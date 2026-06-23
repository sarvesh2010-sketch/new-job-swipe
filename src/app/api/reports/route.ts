import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest } from '@/lib/auth';

// POST: Submit a new moderation report
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { reportedJobId, reportedUserId, reason } = await req.json();

    if (!reason || reason.trim() === '') {
      return NextResponse.json({ error: 'Reason for report is required.' }, { status: 400 });
    }

    if (!reportedJobId && !reportedUserId) {
      return NextResponse.json({ 
        error: 'Either reportedJobId or reportedUserId must be provided.' 
      }, { status: 400 });
    }

    // Automated Moderation Check: scan for suspicious deposit/registration words
    const scamKeywords = ['deposit', 'upfront', 'registration fee', 'advance', 'money transfer', 'bank details', 'pay first'];
    const isSuspicious = scamKeywords.some(keyword => reason.toLowerCase().includes(keyword));

    const finalReason = isSuspicious 
      ? `[AUTOMATED SCAM ALERT] ${reason}`
      : reason;

    if (isSuspicious) {
      console.warn(`[MODERATION AUTOMATION] Suspicious scam keywords flagged in report by user ${payload.userId}`);
    }

    const report = await prisma.report.create({
      data: {
        reportedJobId: reportedJobId || null,
        reportedUserId: reportedUserId || null,
        reportedByUserId: payload.userId,
        reason: finalReason,
        status: 'OPEN'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully.',
      report
    });
  } catch (error) {
    console.error('Error in POST report:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
