import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { analyzeComplaint } from "@/lib/complaint-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const complaintSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: any = { userId: session.user.id };
  if (status) where.status = status;
  if (priority) where.aiPriority = priority;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.complaint.count({ where }),
  ]);

  return NextResponse.json({
    complaints,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = complaintSchema.parse(body);

    // AI Analysis
    const analysis = await analyzeComplaint(validatedData.title, validatedData.description);

    const complaint = await prisma.complaint.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category || analysis.category,
        aiSentiment: analysis.sentiment,
        aiPriority: analysis.priority,
        aiSummary: analysis.summary,
        userId: session.user.id,
      },
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
