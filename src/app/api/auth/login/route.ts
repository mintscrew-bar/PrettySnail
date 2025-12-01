import { NextRequest, NextResponse } from 'next/server';
import { findAdminUser, initializeDefaultAdmin } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import { LoginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Initialize default admin if needed
    await initializeDefaultAdmin();

    // Parse and validate request body
    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // Find and authenticate user
    const user = await findAdminUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Return user info (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
