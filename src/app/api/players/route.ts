import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const players = await prisma.player.findMany({ where: { active: true }, orderBy: { id: "asc" } });
  return NextResponse.json(players);
}

export async function POST(request: Request) {
  const { name, surname, nick, group } = await request.json();
  const player = await prisma.player.create({
    data: { name, surname, nick, group },
  });
  revalidatePath("/");
  revalidatePath("/grupos");
  revalidatePath("/admin/participantes");
  return NextResponse.json(player);
}
