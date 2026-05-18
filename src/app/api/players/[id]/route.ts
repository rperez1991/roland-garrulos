import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, surname, nick, group } = await request.json();
  await prisma.player.update({
    where: { id: parseInt(id) },
    data: { name, surname, nick, group },
  });
  revalidatePath("/");
  revalidatePath("/grupos");
  revalidatePath("/admin/participantes");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.player.update({
    where: { id: parseInt(id) },
    data: { active: false },
  });
  revalidatePath("/");
  revalidatePath("/grupos");
  revalidatePath("/admin/participantes");
  return NextResponse.json({ ok: true });
}
