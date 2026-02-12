import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    include: { list: true, _count: { select: { emails: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, subject, body, listId } = await req.json();
  const campaign = await prisma.campaign.create({
    data: { name, subject, body, listId, userId: session.user.id },
  });

  return NextResponse.json(campaign, { status: 201 });
}
