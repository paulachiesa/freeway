import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const municipioIdStr = searchParams.get("municipioId");
  if (!municipioIdStr) {
    return NextResponse.json(
      { success: false, message: "Falta municipioId" },
      { status: 400 }
    );
  }

  const municipioId = Number(municipioIdStr);

  const lotes = await prisma.lote.findMany({
    where: { municipio_id: municipioId },
    select: { id: true, numero: true, descripcion: true, fecha_desde: true },
    orderBy: [{ fecha_desde: "desc" }, { id: "desc" }],
  });

  return NextResponse.json({ success: true, lotes });
}
