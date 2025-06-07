import { prisma } from "../prisma";

// en este archivo van funciones de lectura (fetch), que no modifican el estado de la bd

export async function getMunicipios() {
  return await prisma.municipio.findMany();
}

export async function fetchMunicipiosById(id: number) {
  try {
    const municipio = await prisma.municipio.findUnique({
      where: { id },
    });
    return municipio;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch municipio.");
  }
}

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredMunicipios(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const municipios = await prisma.municipio.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: "insensitive" } },
          { provincia: { contains: query, mode: "insensitive" } },
          { ciudad: { contains: query, mode: "insensitive" } },
          { direccion: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        id: "asc",
      },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
    return municipios;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener municipios.");
  }
}

export async function fetchMunicipiosPages(query: string) {
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

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Error al obtener numero total de municipios.");
  }
}
