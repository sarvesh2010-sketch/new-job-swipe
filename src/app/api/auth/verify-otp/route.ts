import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySMSOTP } from '@/lib/otp';
import { signToken } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { phone, code, role } = await req.json();

    if (!phone || !code || !role) {
      return NextResponse.json(
        { error: 'Phone, OTP code, and role are required parameters.' },
        { status: 400 }
      );
    }

    // Validate role enum
    if (![Role.STUDENT, Role.PROVIDER, Role.ADMIN].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid user role specified.' },
        { status: 400 }
      );
    }

    // Verify SMS OTP
    const isValid = verifySMSOTP(phone, code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP code.' },
        { status: 401 }
      );
    }

    // Find or create user profile
    const user = await prisma.user.upsert({
      where: { phone },
      update: { isVerified: true },
      create: {
        phone,
        role,
        name: phone === '9999999999' ? 'Admin Moderator' : `User +91${phone.slice(-4)}`,
        isVerified: true
      }
    });

    // Generate stateless JWT token
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error in verify-otp endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
