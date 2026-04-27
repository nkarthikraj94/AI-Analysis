import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["PENDING", "RESOLVED"]).optional(),
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const complaint = await prisma.complaint.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(complaint);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    const complaint = await prisma.complaint.update({
      where: { id, userId: session.user.id },
      data: validatedData,
    });

    return NextResponse.json(complaint);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.complaint.delete({
    where: { id, userId: session.user.id },
  });

  return new NextResponse(null, { status: 204 });
}
