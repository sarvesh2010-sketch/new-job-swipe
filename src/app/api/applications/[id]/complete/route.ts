import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role, ApplicationStatus } from '@prisma/client';

// PATCH: Mark an approved application as COMPLETED
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

    // Verify the application was approved first
    if (application.status !== ApplicationStatus.APPROVED) {
      return NextResponse.json({ 
        error: 'Only previously approved applications can be marked as completed.' 
      }, { status: 400 });
    }

    const updatedApp = await prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.COMPLETED
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Application marked as completed.',
      application: updatedApp
    });
  } catch (error) {
    console.error('Error in PATCH application completion:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
