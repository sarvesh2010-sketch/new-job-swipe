import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role, JobStatus } from '@prisma/client';

// GET: Fetch individual job details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Job ID parameter is required.' }, { status: 400 });
    }

    const payload = verifyRequest(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            businessName: true,
            businessType: true,
            address: true,
            locationLat: true,
            locationLng: true
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Error in GET job by ID:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PATCH: Update job status or specifications
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Job ID parameter is required.' }, { status: 400 });
    }

    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.PROVIDER, Role.ADMIN])) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // Fetch existing job listing
    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 });
    }

    // If provider, make sure they own the job listing
    if (payload.role === Role.PROVIDER) {
      const provider = await prisma.providerProfile.findUnique({
        where: { userId: payload.userId }
      });

      if (!provider || job.providerId !== provider.id) {
        return NextResponse.json({ error: 'Forbidden. You do not own this job listing.' }, { status: 403 });
      }
    }

    const body = await req.json();
    const { title, description, payAmount, payType, status, durationHours, openings, expiresAt } = body;

    const dataToUpdate: any = {};

    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (payType !== undefined) dataToUpdate.payType = payType;
    
    if (payAmount !== undefined) {
      const amount = parseFloat(payAmount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ error: 'Pay amount must be a positive number.' }, { status: 400 });
      }
      dataToUpdate.payAmount = amount;
    }

    if (durationHours !== undefined) {
      const duration = parseFloat(durationHours);
      if (isNaN(duration) || duration <= 0) {
        return NextResponse.json({ error: 'Duration hours must be positive.' }, { status: 400 });
      }
      dataToUpdate.durationHours = duration;
    }

    if (openings !== undefined) {
      const count = parseInt(openings);
      if (isNaN(count) || count <= 0) {
        return NextResponse.json({ error: 'Openings must be a positive integer.' }, { status: 400 });
      }
      dataToUpdate.openings = count;
    }

    if (expiresAt !== undefined) {
      const expiry = new Date(expiresAt);
      if (isNaN(expiry.getTime())) {
        return NextResponse.json({ error: 'Invalid expiry date format.' }, { status: 400 });
      }
      dataToUpdate.expiresAt = expiry;
    }

    if (status !== undefined) {
      if (!Object.values(JobStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid job status value.' }, { status: 400 });
      }
      dataToUpdate.status = status;
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Error updating job by ID:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
