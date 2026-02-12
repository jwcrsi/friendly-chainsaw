import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { businessId, notes } = await req.json();

  const item = await prisma.listItem.create({
    data: { listId: id, businessId, notes },
  });

  return NextResponse.json(item, { status: 201 });
}
