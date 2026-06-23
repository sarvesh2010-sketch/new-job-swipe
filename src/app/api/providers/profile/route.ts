import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// GET: Fetch the logged-in provider's profile
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.PROVIDER])) {
      return NextResponse.json({ error: 'Unauthorized provider access.' }, { status: 401 });
    }

    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: payload.userId },
      include: {
        user: {
          select: { name: true, phone: true }
        }
      }
    });

    if (!providerProfile) {
      return NextResponse.json({ error: 'Provider profile not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: providerProfile });
  } catch (error) {
    console.error('Error in GET provider profile:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Create or update provider profile
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.PROVIDER])) {
      return NextResponse.json({ error: 'Unauthorized provider access.' }, { status: 401 });
    }

    const { businessName, businessType, locationLat, locationLng, address } = await req.json();

    // Validations
    if (!businessName || !businessType || locationLat === undefined || locationLng === undefined || !address) {
      return NextResponse.json({ error: 'Missing required profile fields.' }, { status: 400 });
    }

    const lat = parseFloat(locationLat);
    const lng = parseFloat(locationLng);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Invalid latitude or longitude coordinates.' }, { status: 400 });
    }

    // Upsert provider profile
    const profile = await prisma.providerProfile.upsert({
      where: { userId: payload.userId },
      update: {
        businessName,
        businessType,
        locationLat: lat,
        locationLng: lng,
        address
      },
      create: {
        userId: payload.userId,
        businessName,
        businessType,
        locationLat: lat,
        locationLng: lng,
        address,
        isVerified: false // Admin must verify verification
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error in POST provider profile:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
