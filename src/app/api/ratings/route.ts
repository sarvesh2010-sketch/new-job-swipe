import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';
import { recalculateTrustScore } from '@/lib/trustScore';

// POST: Provider submits a rating for a student on a finished job
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.PROVIDER])) {
      return NextResponse.json({ error: 'Unauthorized provider access.' }, { status: 401 });
    }

    const { jobId, ratedStudentId, punctualityScore, qualityScore, comment } = await req.json();

    if (!jobId || !ratedStudentId || punctualityScore === undefined || qualityScore === undefined) {
      return NextResponse.json({ error: 'Missing required rating parameters.' }, { status: 400 });
    }

    const punctScore = parseInt(punctualityScore);
    const qualScore = parseInt(qualityScore);

    if (isNaN(punctScore) || punctScore < 1 || punctScore > 5) {
      return NextResponse.json({ error: 'Punctuality score must be an integer between 1 and 5.' }, { status: 400 });
    }
    if (isNaN(qualScore) || qualScore < 1 || qualScore > 5) {
      return NextResponse.json({ error: 'Quality score must be an integer between 1 and 5.' }, { status: 400 });
    }

    // Fetch provider profile
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: payload.userId }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found.' }, { status: 404 });
    }

    // Verify job belongs to provider
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job || job.providerId !== provider.id) {
      return NextResponse.json({ error: 'Forbidden. You do not own this job listing.' }, { status: 403 });
    }

    // Verify student profile exists
    const student = await prisma.studentProfile.findUnique({
      where: { id: ratedStudentId }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    // Verify student completed the job application
    const application = await prisma.application.findUnique({
      where: {
        jobId_studentId: {
          jobId,
          studentId: ratedStudentId
        }
      }
    });

    if (!application || application.status !== 'COMPLETED') {
      return NextResponse.json({ 
        error: 'You can only review students who have successfully completed the gig.' 
      }, { status: 400 });
    }

    // Create the rating record
    const rating = await prisma.rating.create({
      data: {
        jobId,
        ratedStudentId,
        ratedByProviderId: provider.id,
        punctualityScore: punctScore,
        qualityScore: qualScore,
        comment: comment || null
      }
    });

    // Recalculate and update trust score
    const updatedTrustScore = await recalculateTrustScore(ratedStudentId);

    return NextResponse.json({
      success: true,
      message: 'Review recorded; trust score updated.',
      rating,
      newTrustScore: updatedTrustScore
    });
  } catch (error) {
    console.error('Error in POST rating:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
