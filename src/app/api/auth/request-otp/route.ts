import { NextRequest, NextResponse } from 'next/server';
import { sendSMSOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
      );
    }

    const success = await sendSMSOTP(phone);

    if (!success) {
      return NextResponse.json(
        { error: 'SMS dispatch failed. Try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error in request-otp endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
