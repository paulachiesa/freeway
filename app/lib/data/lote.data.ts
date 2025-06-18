import { prisma } from "@/app/lib/prisma";

export async function getLotes() {
  return await prisma.lote.findMany({
    include: {
      infraccion: true,
      municipio: true,
      radar: true,
    },
    orderBy: {
      fecha_desde: "desc",
    },
  });
}

export async function fetchLoteById(id: number) {
  try {
    const lote = await prisma.lote.findUnique({
      where: { id },
      include: {
        infraccion: true,
        municipio: true,
        radar: true,
      },
    });
    return lote;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch lote.");
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredLotes(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const lotes = await prisma.lote.findMany({
      where: {
        OR: [
          { estado: { contains: query, mode: "insensitive" } },
          { descripcion: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        infraccion: true,
        municipio: true,
        radar: true,
      },
      orderBy: {
        fecha_desde: "desc",
      },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
    return lotes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener lotes.");
  }
}

export async function fetchLotesPages(query: string) {
  try {
    const totalCount = await prisma.lote.count({
      where: {
        OR: [
          { estado: { contains: query, mode: "insensitive" } },
          { descripcion: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener número total de lotes.");
  }
}
