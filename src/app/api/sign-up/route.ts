import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    const existingUsername = await prisma.user.findFirst({
      where: { username, isVerified: true },
    });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: 'Username is already taken' },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const existingEmailUser = await prisma.user.findUnique({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingEmailUser) {
      if (existingEmailUser.isVerified) {
        return NextResponse.json(
          { success: false, message: 'User already exists with this email' },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { email },
        data: {
          username,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry,
          isVerified: false,
          isAcceptingMessages: true,
        },
      });
    }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
