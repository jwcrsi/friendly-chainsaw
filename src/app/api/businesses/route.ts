import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";
  const minScore = parseInt(searchParams.get("minScore") || "0");
  const maxScore = parseInt(searchParams.get("maxScore") || "100");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isActive: true };

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { category: { contains: query } },
      { subcategory: { contains: query } },
    ];
  }
  if (category) where.category = { contains: category };
  if (city) where.city = { contains: city };
  if (state) where.state = state;
  if (minScore > 0 || maxScore < 100) {
    where.re2Score = { gte: minScore, lte: maxScore };
  }
  if (minRating > 0) {
    where.googleRating = { gte: minRating };
  }

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({ where, skip, take: limit, orderBy: { re2Score: "desc" } }),
    prisma.business.count({ where }),
  ]);

  return NextResponse.json({ businesses, total, page, totalPages: Math.ceil(total / limit) });
}
