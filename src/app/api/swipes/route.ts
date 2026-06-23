import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role, SwipeDirection, ApplicationStatus } from '@prisma/client';

// POST: Record a swipe direction (LEFT or RIGHT)
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.STUDENT])) {
      return NextResponse.json({ error: 'Unauthorized student access.' }, { status: 401 });
    }

    const { jobId, direction } = await req.json();

    if (!jobId || !direction) {
      return NextResponse.json({ error: 'Missing jobId or direction parameters.' }, { status: 400 });
    }

    if (!Object.values(SwipeDirection).includes(direction)) {
      return NextResponse.json({ error: 'Invalid swipe direction (must be LEFT or RIGHT).' }, { status: 400 });
    }

    // Fetch student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.userId }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    // Verify job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    if (job.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'This job listing is no longer active.' }, { status: 400 });
    }

    // Record swipe. If RIGHT, create a pending application inside a database transaction.
    if (direction === SwipeDirection.RIGHT) {
      const result = await prisma.$transaction(async (tx) => {
        // Create Swipe entry
        const newSwipe = await tx.swipe.create({
          data: {
            studentId: student.id,
            jobId,
            direction: SwipeDirection.RIGHT
          }
        });

        // Create pending application (upsert to handle edge duplicates cleanly)
        const newApplication = await tx.application.upsert({
          where: {
            jobId_studentId: {
              jobId,
              studentId: student.id
            }
          },
          update: {}, // No updates if already exists
          create: {
            jobId,
            studentId: student.id,
            status: ApplicationStatus.PENDING
          }
        });

        return { swipe: newSwipe, application: newApplication };
      });

      return NextResponse.json({
        success: true,
        message: 'Swipe Right logged; application submitted.',
        data: result
      });
    } else {
      // LEFT swipe: just log the swipe
      const swipe = await prisma.swipe.create({
        data: {
          studentId: student.id,
          jobId,
          direction: SwipeDirection.LEFT
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Swipe Left logged.',
        swipe
      });
    }
  } catch (error: any) {
    // Handle uniqueness constraints (e.g. if student already swiped on this job)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'You have already logged a swipe for this job.' }, { status: 409 });
    }

    console.error('Error in POST swipe:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
