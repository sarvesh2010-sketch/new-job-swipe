import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role, JobStatus } from '@prisma/client';
import { getDistanceInKm } from '@/lib/geo';

// GET: Retrieve the swipe deck feed for students
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.STUDENT])) {
      return NextResponse.json({ error: 'Unauthorized student access.' }, { status: 401 });
    }

    // Retrieve student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.userId }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile must be created first.' }, { status: 400 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius') || '15'; // Default 15 km
    const minPayParam = searchParams.get('minPay');
    const maxHoursParam = searchParams.get('maxHours');
    const matchSkills = searchParams.get('matchSkills') === 'true';

    // 1. Fetch already swiped jobs to exclude them
    const swipedJobIds = await prisma.swipe.findMany({
      where: { studentId: student.id },
      select: { jobId: true }
    });
    const excludedJobIds = swipedJobIds.map((s) => s.jobId);

    // 2. Build Prisma filters
    const whereCondition: any = {
      status: JobStatus.ACTIVE,
      expiresAt: { gt: new Date() },
      openings: { gt: 0 },
      id: excludedJobIds.length > 0 ? { notIn: excludedJobIds } : undefined
    };

    if (minPayParam) {
      const minPay = parseFloat(minPayParam);
      if (!isNaN(minPay)) {
        whereCondition.payAmount = { gte: minPay };
      }
    }

    if (maxHoursParam) {
      const maxHours = parseFloat(maxHoursParam);
      if (!isNaN(maxHours)) {
        whereCondition.durationHours = { lte: maxHours };
      }
    }

    // Filter by student skills if requested
    if (matchSkills && student.skills.length > 0) {
      whereCondition.skillTags = {
        hasSome: student.skills
      };
    }

    // 3. Fetch jobs from DB
    const jobs = await prisma.job.findMany({
      where: whereCondition,
      include: {
        provider: {
          select: {
            businessName: true,
            businessType: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 4. Filter by radius in-memory (if coordinates provided)
    let filteredJobs = jobs;
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      const radius = parseFloat(radiusParam);

      if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius)) {
        filteredJobs = jobs.filter((job) => {
          const distance = getDistanceInKm(lat, lng, job.locationLat, job.locationLng);
          return distance <= radius;
        });
      }
    }

    return NextResponse.json({
      success: true,
      jobs: filteredJobs.map((job) => ({
        ...job,
        // Convert Prisma Decimal type to standard JS number for easier client-side consumption
        payAmount: Number(job.payAmount)
      }))
    });
  } catch (error) {
    console.error('Error in GET job feed:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
