import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, gender, otp } = await req.json();

    let isVerified = false;

    // Master OTP bypass for testing
    if (otp === "000000") {
      isVerified = true;
    } else {
      const verificationToken = await prisma.verificationToken.findFirst({
        where: { identifier: email, token: otp },
      });
      if (verificationToken && verificationToken.expires >= new Date()) {
        isVerified = true;
      }
    }

    if (!isVerified) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        gender,
        emailVerified: new Date(),
      },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: otp } },
    });

    return NextResponse.json({ message: "User verified and created successfully", user: { email: user.email } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
