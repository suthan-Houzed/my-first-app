import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// This would typically be in a database
let users: any[] = [];

export async function POST(request: Request) {
  try {
    const { name, email, role, password } = await request.json();

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      role,
      password: hashedPassword,
    };

    users.push(newUser);

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 