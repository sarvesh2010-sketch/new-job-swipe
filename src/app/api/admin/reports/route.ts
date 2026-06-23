import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// GET: Fetch all moderation tickets (Requires Admin)
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // In-memory relational resolution to avoid schema limitations
    const jobIds = Array.from(new Set(reports.map((r) => r.reportedJobId).filter(Boolean))) as string[];
    const userIds = Array.from(
      new Set([
        ...reports.map((r) => r.reportedUserId).filter(Boolean),
        ...reports.map((r) => r.reportedByUserId)
      ])
    ) as string[];

    const jobs = await prisma.job.findMany({
      where: { id: { in: jobIds } },
      select: { id: true, title: true, status: true, providerId: true }
    });

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, phone: true, role: true }
    });

    // Map into lists for easy lookup
    const jobMap = new Map(jobs.map((j) => [j.id, j]));
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enrichedReports = reports.map((report) => ({
      ...report,
      reportedJob: report.reportedJobId ? jobMap.get(report.reportedJobId) || null : null,
      reportedUser: report.reportedUserId ? userMap.get(report.reportedUserId) || null : null,
      reportedByUser: userMap.get(report.reportedByUserId) || null
    }));

    return NextResponse.json({ success: true, reports: enrichedReports });
  } catch (error) {
    console.error('Error in GET admin reports:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
