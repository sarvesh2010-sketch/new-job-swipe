import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// GET: Aggregate platform statistics (Requires Admin)
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    // 1. Core counters
    const activeGigs = await prisma.job.count({
      where: { status: 'ACTIVE', expiresAt: { gt: new Date() } }
    });

    const totalStudents = await prisma.studentProfile.count();
    
    const verifiedProviders = await prisma.providerProfile.count({
      where: { isVerified: true }
    });

    const pendingProviders = await prisma.providerProfile.count({
      where: { isVerified: false }
    });

    const openReports = await prisma.report.count({
      where: { status: 'OPEN' }
    });

    const totalApplications = await prisma.application.count();
    const completedGigs = await prisma.application.count({
      where: { status: 'COMPLETED' }
    });

    // 2. Swipe analytics calculations
    const totalSwipes = await prisma.swipe.count();
    const rightSwipes = await prisma.swipe.count({
      where: { direction: 'RIGHT' }
    });

    const swipeApplyRate = totalSwipes > 0 
      ? Math.round((rightSwipes / totalSwipes) * 100) 
      : 0;

    // 3. Simple historical trend mockups for sparklines (based on creation dates)
    // We group student signups by date for the last 7 days
    const studentTrend = await prisma.studentProfile.groupBy({
      by: ['createdAt'],
      _count: { id: true }
    });

    // Sort or map into daily figures (for display, we can format standard objects)
    const analytics = {
      activeGigs,
      totalStudents,
      verifiedProviders,
      pendingProviders,
      openReports,
      totalApplications,
      completedGigs,
      swipeApplyRate,
      metrics: {
        totalSwipes,
        rightSwipes,
        leftSwipes: totalSwipes - rightSwipes
      },
      sparklines: {
        signups: studentTrend.slice(-7).map(item => ({
          date: item.createdAt.toISOString().split('T')[0],
          count: item._count.id
        }))
      }
    };

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    console.error('Error in GET admin analytics:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
