import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role, ReportStatus, JobStatus } from '@prisma/client';

// PATCH: Resolve a moderation report and execute actions (Requires Admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Report ID parameter is required.' }, { status: 400 });
    }

    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const body = await req.json();
    const { status, banUser = false, closeJob = false } = body;

    if (!status || !Object.values(ReportStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid report status value.' }, { status: 400 });
    }

    // Retrieve report
    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      return NextResponse.json({ error: 'Report record not found.' }, { status: 404 });
    }

    // Execute updates inside database transaction to guarantee integrity
    const updatedReport = await prisma.$transaction(async (tx) => {
      // 1. Update report status
      const updated = await tx.report.update({
        where: { id },
        data: { status }
      });

      // 2. Perform automated action if requested or ACTION_TAKEN set
      if (status === ReportStatus.ACTION_TAKEN) {
        // Suspend user (by setting isVerified to false and stripping provider credentials)
        if (banUser && report.reportedUserId) {
          await tx.user.update({
            where: { id: report.reportedUserId },
            data: { isVerified: false }
          });
          
          // If the user has a provider profile, un-verify it too
          const provider = await tx.providerProfile.findUnique({
            where: { userId: report.reportedUserId }
          });
          if (provider) {
            await tx.providerProfile.update({
              where: { id: provider.id },
              data: { isVerified: false }
            });
            // Auto-close all active jobs by this provider
            await tx.job.updateMany({
              where: { providerId: provider.id },
              data: { status: JobStatus.CLOSED }
            });
          }
        }

        // Close reported job listing
        if (closeJob && report.reportedJobId) {
          await tx.job.update({
            where: { id: report.reportedJobId },
            data: { status: JobStatus.CLOSED }
          });
        }
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: 'Moderation report successfully updated.',
      report: updatedReport
    });
  } catch (error) {
    console.error('Error updating report by ID:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
