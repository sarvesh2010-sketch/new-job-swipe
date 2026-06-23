import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role, PayType, JobStatus } from '@prisma/client';

// GET: Retrieve job listings based on authentication role
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    if (hasRole(payload, [Role.PROVIDER])) {
      // Find provider profile
      const provider = await prisma.providerProfile.findUnique({
        where: { userId: payload.userId }
      });

      if (!provider) {
        return NextResponse.json({ error: 'Provider profile not found.' }, { status: 404 });
      }

      // Fetch all jobs posted by this provider, with application counts
      const jobs = await prisma.job.findMany({
        where: { providerId: provider.id },
        include: {
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ success: true, jobs });
    }

    if (hasRole(payload, [Role.ADMIN])) {
      // Fetch all jobs for administrative dashboard
      const jobs = await prisma.job.findMany({
        include: {
          provider: {
            select: { businessName: true }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ success: true, jobs });
    }

    return NextResponse.json({ error: 'Forbidden access role.' }, { status: 403 });
  } catch (error) {
    console.error('Error in GET jobs:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Post a new job (Requires provider role & verification status)
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.PROVIDER])) {
      return NextResponse.json({ error: 'Unauthorized provider access.' }, { status: 401 });
    }

    // Find provider profile and verify account status
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: payload.userId }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider profile not found.' }, { status: 404 });
    }

    if (!provider.isVerified) {
      return NextResponse.json({ 
        error: 'Your business profile is pending admin verification. You cannot post gigs yet.' 
      }, { status: 403 });
    }

    const {
      title,
      description,
      payAmount,
      payType,
      durationHours,
      locationLat,
      locationLng,
      skillTags,
      openings,
      expiresAt
    } = await req.json();

    // Validations
    if (
      !title ||
      !description ||
      payAmount === undefined ||
      !payType ||
      durationHours === undefined ||
      locationLat === undefined ||
      locationLng === undefined ||
      !skillTags ||
      openings === undefined ||
      !expiresAt
    ) {
      return NextResponse.json({ error: 'Missing required job parameters.' }, { status: 400 });
    }

    if (!Object.values(PayType).includes(payType)) {
      return NextResponse.json({ error: 'Invalid payment type option.' }, { status: 400 });
    }

    const amount = parseFloat(payAmount);
    const duration = parseFloat(durationHours);
    const lat = parseFloat(locationLat);
    const lng = parseFloat(locationLng);
    const count = parseInt(openings);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Pay amount must be a positive number.' }, { status: 400 });
    }
    if (isNaN(duration) || duration <= 0) {
      return NextResponse.json({ error: 'Duration must be a positive number of hours.' }, { status: 400 });
    }
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Invalid location coordinates.' }, { status: 400 });
    }
    if (isNaN(count) || count <= 0) {
      return NextResponse.json({ error: 'Openings capacity must be at least 1.' }, { status: 400 });
    }

    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
      return NextResponse.json({ error: 'Expiry date must be a valid future timestamp.' }, { status: 400 });
    }

    if (!Array.isArray(skillTags)) {
      return NextResponse.json({ error: 'Skill tags must be an array of strings.' }, { status: 400 });
    }

    // Create active job listing
    const job = await prisma.job.create({
      data: {
        providerId: provider.id,
        title,
        description,
        payAmount: amount,
        payType,
        durationHours: duration,
        locationLat: lat,
        locationLng: lng,
        skillTags,
        openings: count,
        status: JobStatus.ACTIVE,
        expiresAt: expiryDate
      }
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Error in POST job:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
