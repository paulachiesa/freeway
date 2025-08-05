import { prisma } from "../prisma";

export async function getRadares() {
  return await prisma.radar.findMany();
}

export async function getRadaresCombo() {
  try {
    const radares = await prisma.radar.findMany({
      orderBy: { id: "asc" },
    });

    return radares.map((r) => ({
      id: r.id,
      nombre: `${r.marca} ${r.modelo} (${r.nro_serie})`,
    }));
  } catch (error) {
    console.error("Error al obtener radares:", error);
    throw new Error("Error al obtener radares");
  }
}

export async function fetchRadarById(id: number) {
  try {
    const radar = await prisma.radar.findUnique({
      where: { id },
    });
    return radar;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch radar.");
  }
}

const ITEMS_PER_PAGE = 5;

export async function fetchFilteredRadares(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const radares = await prisma.radar.findMany({
      where: {
        OR: [
          { marca: { contains: query, mode: "insensitive" } },
          { modelo: { contains: query, mode: "insensitive" } },
          { nro_serie: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "asc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
    return radares;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener radares.");
  }
}

export async function fetchRadarPages(query: string) {
  try {
    const totalCount = await prisma.radar.count({
      where: {
        OR: [
          { marca: { contains: query, mode: "insensitive" } },
          { modelo: { contains: query, mode: "insensitive" } },
          { nro_serie: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Error al obtener número total de radares.");
  }
}
