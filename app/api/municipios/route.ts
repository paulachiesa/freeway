// app/api/municipios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getMunicipios } from "../../lib/data/municipio.data";

export async function GET() {
  const municipios = await getMunicipios();
  return NextResponse.json(municipios);
}
