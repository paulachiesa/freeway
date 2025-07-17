// app/api/lotes/filtered/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchFilteredLotes } from "@/app/lib/data/lote.data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const municipioIdStr = searchParams.get("municipioId");
  const pageStr = searchParams.get("page") || "1";

  if (!municipioIdStr || isNaN(Number(municipioIdStr))) {
    return NextResponse.json(
      { success: false, message: "municipioId inválido o ausente" },
      { status: 400 }
    );
  }

  try {
    const lotes = await fetchFilteredLotes(
      query,
      Number(pageStr),
      Number(municipioIdStr)
    );
    return NextResponse.json({ success: true, lotes });
  } catch (error) {
    console.error("Error al obtener lotes filtrados:", error);
    return NextResponse.json(
      { success: false, message: "Error del servidor al obtener lotes" },
      { status: 500 }
    );
  }
}
