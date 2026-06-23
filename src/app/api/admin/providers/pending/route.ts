import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// GET: Retrieve all provider profiles waiting for verification (Requires Admin)
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized administrative access.' }, { status: 401 });
    }

    const pendingProviders = await prisma.providerProfile.findMany({
      where: { isVerified: false },
      include: {
        user: {
          select: { name: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, providers: pendingProviders });
  } catch (error) {
    console.error('Error in GET pending providers:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
