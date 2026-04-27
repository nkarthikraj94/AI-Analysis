import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, gender } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in VerificationToken table
    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token: otp } },
      update: { expires, token: otp }, // This is a bit tricky with identifier_token unique, let's use delete Many then create
      create: { identifier: email, token: otp, expires },
    });

    // Actually, upsert might fail if token is different. Let's just create.
    // Clean up old tokens first
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({
      data: { identifier: email, token: otp, expires },
    });

    // Send OTP via email
    console.log(`Attempting to send OTP to ${email}...`);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    try {
      await transporter.verify();
      console.log("SMTP connection verified.");
      
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Your OTP for AI Complaint Analyzer",
        text: `Hello ${name}, your OTP is ${otp}. It expires in 10 minutes.`,
        html: `<p>Hello <strong>${name}</strong>,</p><p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      });
      console.log("Email sent successfully:", info.messageId);
    } catch (mailError: unknown) {
      const message = mailError instanceof Error ? mailError.message : String(mailError);
      console.error("Mail sending failed:", mailError);
      // Expose error for debugging (remove in production)
      return NextResponse.json({ error: `SMTP Error: ${message}` }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent to email", otp });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Register error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
