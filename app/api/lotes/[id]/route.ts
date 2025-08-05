// @ts-nocheck
import { NextResponse } from "next/server";
import { fetchLoteById } from "@/app/lib/data/lote.data";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const lote = await fetchLoteById(id);
    return NextResponse.json(lote);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener lote" },
      { status: 500 }
    );
  }
}
