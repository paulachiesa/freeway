// app/lib/data/persona.data.ts
import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export type PersonaListadoItem = {
  personaId: number;
  nroActa: number | null;
  dominio: string | null;
  nombre: string | null;
  cuit: string | null;
  dni: string | null;
};

function mapRow(p: {
  id: number;
  nombre_completo: string | null;
  nombre: string | null;
  apellido: string | null;
  cuil_cuit: bigint | null;
  dni: string | null;
  vehiculo: Array<{
    dominio: string | null;
    infraccion: Array<{
      acta: { id: number } | null; // 👈 acta es objeto, no array
    }>;
  }>;
}): PersonaListadoItem {
  const nombre =
    p.nombre_completo ??
    ([p.nombre, p.apellido].filter(Boolean).join(" ") || null);

  const firstVeh = p.vehiculo?.[0];
  const dominio = firstVeh?.dominio ?? null;
  const nroActa = firstVeh?.infraccion?.[0]?.acta?.id ?? null;

  return {
    personaId: p.id,
    nroActa,
    dominio,
    nombre,
    cuit: p.cuil_cuit != null ? String(p.cuil_cuit) : null,
    dni: p.dni ?? null,
  };
}

export async function fetchFilteredPersonas(
  query: string,
  currentPage: number
): Promise<PersonaListadoItem[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const where: Prisma.personaWhereInput = query?.trim()
    ? {
        OR: [
          { dni: { contains: query } },
          {
            nombre_completo: { contains: query, mode: "insensitive" },
          },
          {
            vehiculo: {
              some: { dominio: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      }
    : {};

  const personas = await prisma.persona.findMany({
    where,
    orderBy: { id: "asc" },
    skip: offset,
    take: ITEMS_PER_PAGE,
    select: {
      id: true,
      nombre_completo: true,
      nombre: true,
      apellido: true,
      cuil_cuit: true,
      dni: true,
      vehiculo: {
        orderBy: { id: "desc" },
        take: 1,
        select: {
          dominio: true,
          infraccion: {
            orderBy: { id: "desc" },
            take: 1,
            select: {
              acta: {
                // orderBy: { id: "desc" },
                // take: 1,
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  return personas.map(mapRow);
}

export async function fetchPersonasPages(query: string): Promise<number> {
  const where: Prisma.personaWhereInput = query?.trim()
    ? {
        OR: [
          { dni: { contains: query } },
          { nombre_completo: { contains: query, mode: "insensitive" } },
          {
            vehiculo: {
              some: { dominio: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      }
    : {};

  const total = await prisma.persona.count({ where });
  return Math.ceil(total / ITEMS_PER_PAGE);
}
