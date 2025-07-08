import { NextResponse } from "next/server";
import { fetchVehiculoByDominio } from "@/app/lib/data/vehiculo.data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dominio = searchParams.get("dominio");

  if (!dominio) {
    return NextResponse.json({ error: "Dominio requerido." }, { status: 400 });
  }

  const vehiculo = await fetchVehiculoByDominio(dominio.toUpperCase());

  if (!vehiculo) {
    return NextResponse.json(
      { error: "Vehículo no encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json(vehiculo);
}
