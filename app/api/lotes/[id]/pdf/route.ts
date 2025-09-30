// app/api/lotes/[id]/pdf/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const loteId = parseInt(params.id, 10);

    if (isNaN(loteId)) {
      return NextResponse.json(
        { error: "El id del lote debe ser un número válido" },
        { status: 400 }
      );
    }

    const lote = await prisma.lote.findUnique({
      where: { id: loteId },
      include: {
        municipio: true,
        radar: true,
        infraccion: {
          include: {
            vehiculo: {
              include: {
                persona: true,
              },
            },
            radar: true,
          },
        },
      },
    });

    if (!lote) {
      return NextResponse.json(
        { error: "Lote no encontrado" },
        { status: 404 }
      );
    }

    if (lote.estado !== "Proceso de carga completo") {
      return NextResponse.json(
        {
          error:
            "El lote no está en estado 'Proceso de carga completo'. No se puede generar el PDF.",
        },
        { status: 400 }
      );
    }

    const responseData = {
      id: lote.id,
      numero: lote.numero,
      descripcion: lote.descripcion,
      fecha_desde: lote.fecha_desde,
      fecha_hasta: lote.fecha_hasta,
      municipio: lote.municipio,
      radar_lote: lote.radar,
      infracciones: lote.infraccion.map((inf) => ({
        id: inf.id,
        fecha: inf.fecha,
        velocidad_medida: inf.velocidad_medida,
        velocidad_maxima: inf.velocidad_maxima,
        nombre_archivo: inf.nombre_archivo,
        imagen_url: inf.imagen_url,
        dominio: inf.dominio,
        hora: inf.hora,
        radar: inf.radar
          ? {
              id: inf.radar.id,
              marca: inf.radar.marca,
              modelo: inf.radar.modelo,
              nro_serie: inf.radar.nro_serie,
            }
          : null,
        vehiculo: inf.vehiculo
          ? {
              id: inf.vehiculo.id,
              dominio: inf.vehiculo.dominio,
              marca: inf.vehiculo.marca,
              modelo: inf.vehiculo.modelo,
              tipo: inf.vehiculo.tipo,
              persona: inf.vehiculo.persona
                ? {
                    id: inf.vehiculo.persona.id,
                    nombre: inf.vehiculo.persona.nombre,
                    apellido: inf.vehiculo.persona.apellido,
                    dni: inf.vehiculo.persona.dni,
                  }
                : null,
            }
          : null,
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en pdf:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
