import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sets, winner, completed } = await request.json();
  await prisma.match.update({
    where: { id: parseInt(id) },
    data: {
      sets: sets ? JSON.stringify(sets) : null,
      winner,
      completed: completed ?? true,
    },
  });
  revalidatePath("/");
  revalidatePath("/grupos");
  revalidatePath("/cuadro");
  revalidatePath("/admin/resultados");
  return NextResponse.json({ ok: true });
}
