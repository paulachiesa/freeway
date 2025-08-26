import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { success: false, error: "id inválido" },
      { status: 400 }
    );
  }

  try {
    const persona = await prisma.persona.findUnique({
      where: { id },
      select: {
        id: true,
        nombre_completo: true,
        nombre: true,
        apellido: true,
        dni: true,
        tipo_dni: true,
        genero: true,
        nacionalidad: true,
        fecha_nacimiento: true,
        fecha_fallecimiento: true,
        cuil_cuit: true,
        email: true,
        email1: true,
        email2: true,
        adicionalespersona: { select: { nroitem: true } },

        domicilio: {
          select: {
            direccion: true,
            codigo_postal: true,
            codigo_postal_argentino: true,
            localidad: true,
            partido: true,
            provincia: true,
          },
          orderBy: { id: "desc" },
          take: 1, //si quiero todos, borrar
        },

        telefonopersona: {
          select: { numero: true, es_whatsapp: true, orden: true },
          orderBy: [{ orden: "asc" }, { id: "asc" }],
          take: 5,
        },

        vehiculo: {
          select: {
            dominio: true,
            porcentaje_titularidad: true,
            procedencia: true,
            fecha_tramite: true,
            fecha_compra: true,
            marca: true,
            modelo: true,
            tipo: true,
          },
          orderBy: { id: "desc" },
          take: 5,
        },
      },
    });

    if (!persona) {
      return NextResponse.json(
        { success: false, error: "No se encontró la persona." },
        { status: 404 }
      );
    }

    const safe = {
      ...persona,
      cuil_cuit: persona.cuil_cuit != null ? String(persona.cuil_cuit) : null,
      fecha_nacimiento: persona.fecha_nacimiento?.toISOString() ?? null,
      fecha_fallecimiento: persona.fecha_fallecimiento?.toISOString() ?? null,
      vehiculo: persona.vehiculo.map((v) => ({
        ...v,
        fecha_tramite: v.fecha_tramite?.toISOString() ?? null,
        fecha_compra: v.fecha_compra?.toISOString() ?? null,
      })),
    };

    return NextResponse.json({ success: true, persona: safe });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: "Error de servidor" },
      { status: 500 }
    );
  }
}
