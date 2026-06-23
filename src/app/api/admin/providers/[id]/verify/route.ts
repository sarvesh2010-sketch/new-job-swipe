import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// PATCH: Verify/Approve a provider profile (Requires Admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Provider Profile ID parameter is required.' }, { status: 400 });
    }

    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { isVerified = true } = body;

    // Check if provider profile exists
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { id }
    });

    if (!providerProfile) {
      return NextResponse.json({ error: 'Provider profile not found.' }, { status: 404 });
    }

    // Update isVerified in both ProviderProfile and User tables in a transaction
    const updatedProfile = await prisma.$transaction(async (tx) => {
      const updated = await tx.providerProfile.update({
        where: { id },
        data: { isVerified }
      });

      await tx.user.update({
        where: { id: providerProfile.userId },
        data: { isVerified }
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: `Provider status set to verified = ${isVerified}.`,
      provider: updatedProfile
    });
  } catch (error) {
    console.error('Error verifying provider:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
