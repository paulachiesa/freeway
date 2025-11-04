import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export type ActaReporteItem = {
  actaId: number;
  nroActa: number;
  dominio: string | null;
  nombre: string | null;
  dni: string | null;
  cuit: string | null;
};

export async function fetchFilteredActasReportes(
  query: string,
  currentPage: number
): Promise<ActaReporteItem[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Filtro general (nombre, dni, cuil o dominio)
  const where: Prisma.actaWhereInput =
    query?.trim() !== ""
      ? {
          OR: [
            {
              infraccion: {
                dominio: { contains: query, mode: "insensitive" },
              },
            },
            {
              infraccion: {
                vehiculo: {
                  persona: {
                    OR: [
                      { dni: { contains: query } },
                      {
                        nombre_completo: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        // coincidencia exacta por CUIL si el texto es numérico
                        cuil_cuit: !isNaN(Number(query))
                          ? BigInt(query)
                          : undefined,
                      },
                    ],
                  },
                },
              },
            },
          ],
        }
      : {};

  const actas = await prisma.acta.findMany({
    where,
    orderBy: { id: "desc" },
    skip: offset,
    take: ITEMS_PER_PAGE,
    select: {
      id: true,
      numero_acta: true,
      infraccion: {
        select: {
          dominio: true,
          vehiculo: {
            select: {
              persona: {
                select: {
                  nombre_completo: true,
                  nombre: true,
                  apellido: true,
                  dni: true,
                  cuil_cuit: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return actas.map((a) => {
    const p = a.infraccion?.vehiculo?.persona;
    const nombre =
      p?.nombre_completo ?? [p?.nombre, p?.apellido].filter(Boolean).join(" ");
    return {
      actaId: a.id,
      nroActa: a.numero_acta,
      dominio: a.infraccion?.dominio ?? null,
      nombre: nombre || null,
      dni: p?.dni ?? null,
      cuit: p?.cuil_cuit != null ? String(p.cuil_cuit) : null,
    };
  });
}

export async function fetchActasReportesPages(query: string): Promise<number> {
  const where: Prisma.actaWhereInput =
    query?.trim() !== ""
      ? {
          OR: [
            {
              infraccion: {
                dominio: { contains: query, mode: "insensitive" },
              },
            },
            {
              infraccion: {
                vehiculo: {
                  persona: {
                    OR: [
                      { dni: { contains: query } },
                      {
                        nombre_completo: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        cuil_cuit: !isNaN(Number(query))
                          ? BigInt(query)
                          : undefined,
                      },
                    ],
                  },
                },
              },
            },
          ],
        }
      : {};

  const total = await prisma.acta.count({ where });
  return Math.ceil(total / ITEMS_PER_PAGE);
}
