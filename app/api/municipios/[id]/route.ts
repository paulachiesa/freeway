// app/api/municipios/[id]/route.ts
import { NextResponse } from "next/server";
import { getMunicipioById } from "@/app/lib/data/municipio.data";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const municipio = await getMunicipioById(id);
    if (!municipio) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json(municipio);
  } catch (error) {
    console.error("Error en API /municipios/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener el municipio" },
      { status: 500 }
    );
  }
}
