import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const municipioIdStr = searchParams.get("municipioId");

  if (!municipioIdStr) {
    return NextResponse.json(
      { success: false, message: "Falta el parámetro municipioId." },
      { status: 400 }
    );
  }

  const municipioId = Number(municipioIdStr);
  if (isNaN(municipioId)) {
    return NextResponse.json(
      { success: false, message: "municipioId no es un número válido." },
      { status: 400 }
    );
  }

  try {
    const ultimoLote = await prisma.lote.findFirst({
      where: { municipio_id: municipioId },
      orderBy: { id: "desc" },
    });

    const proximoNumero = (ultimoLote?.id ?? 0) + 1;

    return NextResponse.json({ success: true, proximoNumero });
  } catch (error) {
    console.error("Error al obtener último lote:", error);
    return NextResponse.json(
      { success: false, message: "Error del servidor al buscar lote." },
      { status: 500 }
    );
  }
}
