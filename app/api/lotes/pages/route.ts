import { NextRequest, NextResponse } from "next/server";
import { fetchLotesPages } from "@/app/lib/data/lote.data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
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
    const totalPages = await fetchLotesPages(query, municipioId);
    return NextResponse.json({ success: true, totalPages });
  } catch (error) {
    console.error("Error al obtener total de páginas:", error);
    return NextResponse.json(
      { success: false, message: "Error del servidor al calcular páginas." },
      { status: 500 }
    );
  }
}
