import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// GET: Retrieve own student applications
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.STUDENT])) {
      return NextResponse.json({ error: 'Unauthorized student access.' }, { status: 401 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.userId }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: {
        job: {
          include: {
            provider: {
              select: {
                businessName: true,
                businessType: true,
                address: true,
                user: {
                  select: { phone: true }
                }
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      applications: applications.map((app) => ({
        ...app,
        job: {
          ...app.job,
          payAmount: Number(app.job.payAmount)
        }
      }))
    });
  } catch (error) {
    console.error('Error in GET student applications:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
