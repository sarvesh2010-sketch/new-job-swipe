import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRequest, hasRole } from '@/lib/auth';
import { Role } from '@prisma/client';

// GET: Retrieve own student profile
export async function GET(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.STUDENT])) {
      return NextResponse.json({ error: 'Unauthorized student access.' }, { status: 401 });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: payload.userId },
      include: {
        user: {
          select: { name: true, phone: true }
        }
      }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: studentProfile });
  } catch (error) {
    console.error('Error in GET student profile:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Create or update student profile
export async function POST(req: NextRequest) {
  try {
    const payload = verifyRequest(req);
    if (!payload || !hasRole(payload, [Role.STUDENT])) {
      return NextResponse.json({ error: 'Unauthorized student access.' }, { status: 401 });
    }

    const { collegeOrArea, age, skills, photoUrl } = await req.json();

    // Validations
    if (!collegeOrArea || !age || !skills || !Array.isArray(skills)) {
      return NextResponse.json({ error: 'Missing required profile fields.' }, { status: 400 });
    }

    // Minimum age check (Security & compliance mandate)
    if (parseInt(age) < 18) {
      return NextResponse.json({ error: 'You must be at least 18 years old to perform gigs.' }, { status: 400 });
    }

    // Upsert student profile
    const profile = await prisma.studentProfile.upsert({
      where: { userId: payload.userId },
      update: {
        collegeOrArea,
        age: parseInt(age),
        skills,
        photoUrl: photoUrl || ''
      },
      create: {
        userId: payload.userId,
        collegeOrArea,
        age: parseInt(age),
        skills,
        photoUrl: photoUrl || '',
        trustScore: 4.0 // Initial baseline rating
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error in POST student profile:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
