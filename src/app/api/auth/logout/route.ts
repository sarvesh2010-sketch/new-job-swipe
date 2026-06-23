import { NextResponse } from 'next/server';

export async function POST() {
  // Stateless JWT logouts are handled on the client-side by purging the token.
  // This endpoint serves as a standard hook.
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
