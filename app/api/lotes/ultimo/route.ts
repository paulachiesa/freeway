import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const ultimoLote = await prisma.lote.findFirst({
    orderBy: { id: "desc" },
  });

  const proximoNumero = (ultimoLote?.id ?? 0) + 1;

  return NextResponse.json({ proximoNumero });
}
