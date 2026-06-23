import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// GET: Retrieve all applications for a specific job (Requires Provider or Admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID parameter is required.' }, { status: 400 });
    }

    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.PROVIDER, Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // Verify job listing exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    // If provider, check ownership of the job
    if (payload.role === Role.PROVIDER) {
      const provider = await prisma.providerProfile.findUnique({
        where: { userId: payload.userId }
      });

      if (!provider || job.providerId !== provider.id) {
        return NextResponse.json({ error: 'Forbidden. You do not own this job listing.' }, { status: 403 });
      }
    }

    // Fetch all applications for the job
    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        student: {
          include: {
            user: {
              select: { name: true, phone: true }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    // Buddy-Apply Grouping: group applicants from the same college/area
    // We group applications that share the same collegeOrArea
    const groupedByCollege: { [college: string]: typeof applications } = {};
    applications.forEach((app) => {
      const college = app.student.collegeOrArea || 'Other';
      if (!groupedByCollege[college]) {
        groupedByCollege[college] = [];
      }
      groupedByCollege[college].push(app);
    });

    // Turn it into a friendly response structure
    const buddyGroups = Object.entries(groupedByCollege).map(([college, members]) => {
      return {
        college,
        isGroup: members.length > 1, // Treat as buddy group if more than 1 student applied from the same college
        members
      };
    });

    return NextResponse.json({
      success: true,
      applications,
      buddyGroups // Helpful for rendering side-by-side buddy profiles
    });
  } catch (error) {
    console.error('Error in GET job applicants:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
