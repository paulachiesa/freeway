// app/api/lotes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { crearLoteConInfracciones } from "@/app/lib/data/lote.data";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lote = await crearLoteConInfracciones(data);
    return NextResponse.json({ success: true, lote }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al crear el lote:", error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // fallback para errores desconocidos
    return NextResponse.json(
      { success: false, message: "Error desconocido al guardar el lote." },
      { status: 500 }
    );
  }
}
