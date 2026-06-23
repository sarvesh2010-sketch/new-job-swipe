import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role, ApplicationStatus } from '@prisma/client';

// PATCH: Approve or Reject a student application
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Application ID parameter is required.' }, { status: 400 });
    }

    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.PROVIDER, Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { status } = await req.json();
    if (!status || ![ApplicationStatus.APPROVED, ApplicationStatus.REJECTED].includes(status)) {
      return NextResponse.json({ error: 'Invalid decision status (must be APPROVED or REJECTED).' }, { status: 400 });
    }

    // Find the application and its linked job
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application record not found.' }, { status: 404 });
    }

    // Verify ownership of the job if provider
    if (payload.role === Role.PROVIDER) {
      const provider = await prisma.providerProfile.findUnique({
        where: { userId: payload.userId }
      });

      if (!provider || application.job.providerId !== provider.id) {
        return NextResponse.json({ error: 'Forbidden. You do not own this job listing.' }, { status: 403 });
      }
    }

    // If approving, check if job openings are still available
    if (status === ApplicationStatus.APPROVED) {
      if (application.job.openings <= 0) {
        return NextResponse.json({ error: 'This gig has no remaining open slots.' }, { status: 400 });
      }
    }

    // Execute application update and decrement openings count in a transaction if approved
    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.application.update({
        where: { id },
        data: {
          status,
          decidedAt: new Date()
        }
      });

      if (status === ApplicationStatus.APPROVED) {
        await tx.job.update({
          where: { id: application.jobId },
          data: {
            openings: {
              decrement: 1
            }
          }
        });
      }

      return updatedApp;
    });

    return NextResponse.json({
      success: true,
      message: `Application successfully ${status.toLowerCase()}.`,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Error in PATCH application decision:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
