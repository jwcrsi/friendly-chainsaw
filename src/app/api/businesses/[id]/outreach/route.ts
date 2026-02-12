import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: businessId } = await params;
  const { subject, body, channel = "email", campaignId } = await req.json();

  if (!body) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  // Create the outreach email record
  const email = await prisma.outreachEmail.create({
    data: {
      businessId,
      userId: session.user.id,
      subject,
      body,
      channel,
      campaignId: campaignId || undefined,
      status: "sent",
      sentAt: new Date(),
    },
  });

  // Log the activity
  await prisma.activity.create({
    data: {
      type: "email_sent",
      title: `Email sent to business`,
      details: subject || "(no subject)",
      businessId,
      userId: session.user.id,
    },
  });

  return NextResponse.json(email, { status: 201 });
}
