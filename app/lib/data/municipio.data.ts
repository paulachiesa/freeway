// app/lib/data/municipio.data.ts

import { prisma } from "../prisma";
import type { Municipio } from "./types";

const ITEMS_PER_PAGE = 5;

/**
 * Devuelve todos los municipios
 */
export async function getMunicipios(): Promise<Municipio[]> {
  return prisma.municipio.findMany();
}

/**
 * Devuelve un municipio por su ID
 */
export async function getMunicipioById(id: number): Promise<Municipio | null> {
  try {
    return await prisma.municipio.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch municipio.");
  }
}

/**
 * Devuelve los municipios filtrados + paginados
 */
export async function fetchFilteredMunicipios(
  query: string,
  currentPage: number
): Promise<Municipio[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return await prisma.municipio.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: "insensitive" } },
          { provincia: { contains: query, mode: "insensitive" } },
          { ciudad: { contains: query, mode: "insensitive" } },
          { direccion: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "asc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener municipios.");
  }
}

/**
 * Devuelve la cantidad total de páginas según el filtro
 */
export async function fetchMunicipiosPages(query: string): Promise<number> {
  try {
    const totalCount = await prisma.municipio.count({
      where: {
        OR: [
          { nombre: { contains: query, mode: "insensitive" } },
          { provincia: { contains: query, mode: "insensitive" } },
          { ciudad: { contains: query, mode: "insensitive" } },
          { direccion: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    return Math.ceil(totalCount / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener número total de municipios.");
  }
}
