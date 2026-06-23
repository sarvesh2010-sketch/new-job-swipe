import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'jobswipe-fallback-secret-2026-key';

export interface TokenPayload {
  userId: string;
  phone: string;
  role: Role;
}

// Signs a JWT token for the user session (valid for 30 days)
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

// Verifies a JWT token, returning the payload or null
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Helper to extract bearer token and authorize API requests
export function verifyRequest(req: NextRequest): TokenPayload | null {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

// Route guard checking if user has required roles
export function hasRole(payload: TokenPayload | null, requiredRoles: Role[]): boolean {
  if (!payload) return false;
  return requiredRoles.includes(payload.role);
}
