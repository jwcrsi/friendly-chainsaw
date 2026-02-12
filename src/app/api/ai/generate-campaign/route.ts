import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Generate campaign email templates with placeholder variables
const campaignTemplates: Record<string, { subject: string; body: string }> = {
  "new-business": {
    subject: "Grow {{business_name}} with proven local strategies",
    body: `Hi {{business_name}} team,

I noticed your {{category}} business in {{city}} and wanted to reach out. We work exclusively with local businesses to help them attract more customers and increase revenue.

Here's what we've seen work for businesses like yours:
• Targeted local advertising that reaches your ideal customers
• Online presence optimization to capture more search traffic
• Customer retention strategies that boost repeat business

Would you have 15 minutes this week for a quick call? I'd love to share some ideas specific to the {{category}} industry.

Best regards`,
  },
  "seasonal-promo": {
    subject: "Exclusive offer for {{business_name}} this season",
    body: `Hi {{business_name}} team,

As the season changes, it's the perfect time to boost your business. We're offering a limited-time program specifically for {{category}} businesses in {{city}}.

For a limited time, we're including:
• Free local market analysis for your area
• Custom marketing strategy session
• 30-day trial of our customer growth platform

This offer is only available to select businesses, and {{business_name}} made our short list based on your strong reputation.

Interested? Just reply to this email and we'll set up a time to chat.

Cheers`,
  },
  "re-engagement": {
    subject: "We haven't forgotten about {{business_name}}",
    body: `Hi {{business_name}} team,

It's been a while since we last connected, and I wanted to check back in. A lot has changed in the local business landscape, and I think there are some exciting opportunities for {{business_name}}.

Since we last spoke:
• We've added new tools specifically for {{category}} businesses
• Our clients are seeing 40% better results with our updated approach
• We've expanded our coverage in {{city}}

Would you be open to a fresh conversation? I think you'll be pleasantly surprised by what's possible now.

Looking forward to reconnecting.

Best`,
  },
  "referral-ask": {
    subject: "A quick favor, {{business_name}}?",
    body: `Hi {{business_name}} team,

I hope business is going well! I wanted to reach out with a quick request.

We've been growing our network of {{category}} businesses in {{city}}, and we're always looking for great businesses to partner with. Since {{business_name}} has such a strong reputation in the area, I was wondering if you might know any other local businesses that could benefit from our services?

Of course, we'd love to work with {{business_name}} directly as well. If you're interested, we offer special rates for businesses that come through referrals.

Either way, thanks for considering it!

Best regards`,
  },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { template = "new-business" } = await req.json();

  const generated = campaignTemplates[template] || campaignTemplates["new-business"];

  return NextResponse.json({
    subject: generated.subject,
    body: generated.body,
    template,
    availableTemplates: Object.keys(campaignTemplates),
  });
}
