import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Email templates organized by tone
const templates: Record<string, (biz: BusinessInfo) => { subject: string; body: string }> = {
  friendly: (biz) => ({
    subject: `Love what you're doing at ${biz.name}!`,
    body: `Hi ${biz.name} team,

I came across ${biz.name} and was really impressed by what you've built${biz.city ? ` in ${biz.city}` : ""}. ${biz.googleRating && biz.googleRating >= 4 ? `Your ${biz.googleRating}-star rating speaks volumes about the quality you deliver!` : ""}

I work with ${biz.category.toLowerCase()} businesses to help them grow their customer base and streamline operations. I'd love to share a few ideas that have worked really well for similar businesses in your area.

Would you be open to a quick 15-minute chat this week? No pressure at all — just a friendly conversation to see if there's a fit.

Looking forward to connecting!

Best regards`,
  }),
  professional: (biz) => ({
    subject: `Partnership opportunity for ${biz.name}`,
    body: `Dear ${biz.name} Management,

I'm reaching out because I've been researching ${biz.category.toLowerCase()} businesses in ${biz.city || "your area"} and ${biz.name} stood out as a leader in the space.${biz.yearEstablished ? ` With ${new Date().getFullYear() - biz.yearEstablished} years of experience, you clearly understand what it takes to succeed.` : ""}

We specialize in helping businesses like yours:
• Increase foot traffic and online visibility
• Optimize customer acquisition costs
• Build stronger local brand presence

${biz.employeeCount && biz.employeeCount > 10 ? "For a business of your size, w" : "W"}e've consistently delivered 20-30% improvements in customer engagement for our partners.

I'd welcome the opportunity to discuss how we might support ${biz.name}'s growth objectives. Would you have 15 minutes this week for a brief call?

Respectfully,`,
  }),
  casual: (biz) => ({
    subject: `Quick question for ${biz.name}`,
    body: `Hey there!

I was checking out ${biz.name}${biz.website ? " online" : ""} and thought — these folks are doing something right! ${biz.reviewCount > 50 ? `${biz.reviewCount} reviews? That's awesome.` : ""}

Here's the deal: I help ${biz.category.toLowerCase()} businesses get more customers through the door. Nothing fancy, just proven strategies that work for local businesses.

Curious if you'd be up for a quick chat? Even just 10 minutes. I promise I won't waste your time.

Cheers`,
  }),
  "follow-up": (biz) => ({
    subject: `Following up — ${biz.name}`,
    body: `Hi ${biz.name} team,

I reached out recently about helping ${biz.name} grow its customer base and wanted to circle back. I know things get busy, so I wanted to keep this brief.

Since my last email, we've helped several ${biz.category.toLowerCase()} businesses in ${biz.state || "the area"} see real results:
• 35% average increase in new customer inquiries
• 25% boost in repeat business

I genuinely think there's an opportunity here for ${biz.name}. Would you be open to a quick conversation?

If the timing isn't right, no worries at all — just let me know and I'll follow up later.

Best`,
  }),
};

interface BusinessInfo {
  name: string;
  category: string;
  city: string | null;
  state: string | null;
  googleRating: number | null;
  reviewCount: number;
  yearEstablished: number | null;
  employeeCount: number | null;
  website: string | null;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { businessId, tone = "friendly" } = await req.json();

  if (!businessId) {
    return NextResponse.json({ error: "businessId is required" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      name: true,
      category: true,
      city: true,
      state: true,
      googleRating: true,
      reviewCount: true,
      yearEstablished: true,
      employeeCount: true,
      website: true,
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const templateFn = templates[tone] || templates.friendly;
  const generated = templateFn(business);

  return NextResponse.json({
    subject: generated.subject,
    body: generated.body,
    tone,
    businessName: business.name,
  });
}
