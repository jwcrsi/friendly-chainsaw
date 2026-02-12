import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const [
    totalBusinesses,
    totalLists,
    totalCampaigns,
    totalDeals,
    emailStats,
    dealsByStage,
    recentActivities,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.list.count({ where: { userId } }),
    prisma.campaign.count({ where: { userId } }),
    prisma.deal.count({ where: { userId } }),
    prisma.outreachEmail.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
    prisma.deal.groupBy({
      by: ["stage"],
      where: { userId },
      _count: true,
      _sum: { value: true },
    }),
    prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { business: { select: { name: true } } },
    }),
  ]);

  const emailStatsMap: Record<string, number> = {};
  emailStats.forEach((s) => { emailStatsMap[s.status] = s._count; });

  const pipelineData = dealsByStage.map((d) => ({
    stage: d.stage,
    count: d._count,
    value: d._sum.value || 0,
  }));

  return NextResponse.json({
    overview: { totalBusinesses, totalLists, totalCampaigns, totalDeals },
    emailStats: emailStatsMap,
    pipeline: pipelineData,
    recentActivities,
  });
}
