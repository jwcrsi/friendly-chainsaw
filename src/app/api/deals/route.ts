import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    include: { business: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, value, stage, priority, notes, businessId } = await req.json();
  const deal = await prisma.deal.create({
    data: { title, value, stage, priority, notes, businessId, userId: session.user.id },
  });

  return NextResponse.json(deal, { status: 201 });
}
