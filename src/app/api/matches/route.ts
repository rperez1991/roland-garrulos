import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phase = searchParams.get("phase");
  const group = searchParams.get("group");

  const where: Record<string, unknown> = {};
  if (phase) where.phase = phase;
  if (group) where.group = group;

  const matches = await prisma.match.findMany({
    where,
    orderBy: [{ round: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(matches);
}
