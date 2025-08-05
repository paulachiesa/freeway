// app/api/municipios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const municipios = await prisma.municipio.findMany();
    return NextResponse.json(municipios);
  } catch (error) {
    console.error("Error al obtener municipios:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
