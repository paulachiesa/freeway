import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const loteIdStr = searchParams.get("loteId");

  if (!loteIdStr) {
    return NextResponse.json(
      { success: false, message: "Falta el parámetro loteId" },
      { status: 400 }
    );
  }

  const loteId = Number(loteIdStr);
  const lote = await prisma.lote.findUnique({
    where: { id: loteId },
    select: { id: true, estado: true },
  });
  if (!lote) {
    return NextResponse.json(
      { success: false, message: "Lote no encontrado" },
      { status: 404 }
    );
  }

  const faltantes = await prisma.infraccion.count({
    where: { lote_id: loteId, vehiculo_id: null },
  });

  return NextResponse.json({
    success: true,
    loteId,
    estado: lote.estado,
    faltantes,
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const loteIdStr = searchParams.get("loteId");
  if (!loteIdStr) {
    return NextResponse.json(
      { success: false, message: "Falta el parámetro loteID" },
      { status: 400 }
    );
  }

  const loteId = Number(loteIdStr);

  const result = await prisma.infraccion.deleteMany({
    where: {
      lote_id: Number(loteId),
      vehiculo_id: null,
    },
  });

  const pendientes = await prisma.infraccion.count({
    where: {
      lote_id: loteId,
      vehiculo_id: null,
    },
  });

  if (pendientes === 0) {
    await prisma.lote.update({
      where: { id: loteId },
      data: { estado: "Proceso de carga completo" },
    });
  }

  return NextResponse.json({
    success: true,
    eliminadas: result.count,
    pendientes,
    estadoActual: pendientes === 0 ? "Proceso de carga completo" : undefined,
  });
}
