import { prisma } from "../prisma";

export async function getCuadrosTarifarios() {
  return await prisma.cuadrotarifario.findMany();
}

export async function fetchCuadroTarifarioById(id: number) {
  try {
    const cuadro = await prisma.cuadrotarifario.findUnique({
      where: { id },
    });

    if (!cuadro) return null;

    return {
      ...cuadro,
      gasto_administrativo: cuadro.gasto_administrativo?.toNumber() ?? null,
      valor_1er_vencimiento: cuadro.valor_1er_vencimiento?.toNumber() ?? null,
      valor_2do_vencimiento: cuadro.valor_2do_vencimiento?.toNumber() ?? null,
      primer_vencimiento: cuadro.primer_vencimiento?.toISOString() ?? null,
      segundo_vencimiento: cuadro.segundo_vencimiento?.toISOString() ?? null,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch cuadro tarifario.");
  }
}

const ITEMS_PER_PAGE = 5;

export async function fetchFilteredCuadrosTarifarios(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const parsedQuery = parseInt(query, 10);

  try {
    const cuadros = await prisma.cuadrotarifario.findMany({
      where: isNaN(parsedQuery)
        ? {}
        : {
            OR: [
              { velocidad_desde: parsedQuery },
              { velocidad_hasta: parsedQuery },
            ],
          },
      orderBy: { id: "asc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
    return cuadros;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener cuadros tarifarios.");
  }
}

export async function fetchCuadroTarifarioPages(query: string) {
  const parsedQuery = parseInt(query, 10);

  try {
    const totalCount = await prisma.cuadrotarifario.count({
      where: isNaN(parsedQuery)
        ? {}
        : {
            OR: [
              { velocidad_desde: parsedQuery },
              { velocidad_hasta: parsedQuery },
            ],
          },
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Error al obtener número total de cuadros tarifarios.");
  }
}
