import { prisma } from './prisma';

/**
 * Recalculates and updates the trust score for a student profile
 * Formula:
 * Trust Score = (avgPunctuality * 0.4) + (avgQuality * 0.4) + (completionBonus * 0.2) - (noShowPenalty * 0.5)
 * 
 * - Starting/baseline score is 4.0
 * - Score is capped between 1.0 and 5.0
 * - Completion Bonus starts at 4.0 and grows by 0.1 for every completed job up to 5.0
 * - No-Show Penalty deducts 0.5 points per incident
 */
export async function recalculateTrustScore(studentProfileId: string): Promise<number> {
  try {
    // 1. Fetch all ratings submitted for this student
    const ratings = await prisma.rating.findMany({
      where: { ratedStudentId: studentProfileId },
      select: {
        punctualityScore: true,
        qualityScore: true,
      }
    });

    // 2. Fetch completed shifts count
    const completionsCount = await prisma.application.count({
      where: {
        studentId: studentProfileId,
        status: 'COMPLETED',
      }
    });

    // 3. Fetch approved applications that passed the gig window but were NOT marked completed (No-shows)
    // For MVP: We query applications where status remains APPROVED but job duration has expired.
    // In a live system, this is flagged by hosts.
    const noShowsCount = await prisma.application.count({
      where: {
        studentId: studentProfileId,
        status: 'APPROVED',
        job: {
          expiresAt: {
            lt: new Date()
          }
        }
      }
    });

    // If student has no host ratings yet, return baseline 4.0 minus any no-show penalties
    if (ratings.length === 0) {
      const startingScore = 4.0;
      const penalty = noShowsCount * 0.5;
      const finalScore = Math.max(1.0, startingScore - penalty);
      
      await prisma.studentProfile.update({
        where: { id: studentProfileId },
        data: { trustScore: finalScore }
      });
      
      return finalScore;
    }

    // Calculate averages
    const sumPunctuality = ratings.reduce((acc, r) => acc + r.punctualityScore, 0);
    const sumQuality = ratings.reduce((acc, r) => acc + r.qualityScore, 0);

    const avgPunctuality = sumPunctuality / ratings.length;
    const avgQuality = sumQuality / ratings.length;

    // Completion bonus maps completions: 12 completions -> Math.min(5, 4 + 0.1 * 12) = 5.0
    const completionBonus = Math.min(5.0, 4.0 + 0.1 * completionsCount);
    
    // No-Show penalty
    const noShowPenalty = noShowsCount * 0.5;

    // Compute raw formula
    const rawScore = 
      (avgPunctuality * 0.4) + 
      (avgQuality * 0.4) + 
      (completionBonus * 0.2) - 
      noShowPenalty;

    // Cap between 1.0 and 5.0
    const finalScore = Math.max(1.0, Math.min(5.0, rawScore));

    // Update student profile database
    await prisma.studentProfile.update({
      where: { id: studentProfileId },
      data: { trustScore: finalScore }
    });

    return finalScore;
  } catch (error) {
    console.error('Error recalculating trust score:', error);
    throw new Error('Trust score calculation failed.');
  }
}
