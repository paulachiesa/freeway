import { prisma } from "@/app/lib/prisma";

export async function getLotes() {
  return await prisma.lote.findMany({
    include: {
      infraccion: true,
      municipio: true,
      radar: true,
    },
    orderBy: {
      numero: "desc",
    },
  });
}

export async function fetchLoteById(id: number) {
  try {
    const lote = await prisma.lote.findUnique({
      where: { id },
      include: {
        municipio: true,
        radar: true,
        infraccion: {
          include: {
            vehiculo: true,
          },
        },
      },
    });

    const loteNormalizado = {
      ...lote,
      infracciones: lote?.infraccion ?? [],
    };

    delete loteNormalizado.infraccion;

    return loteNormalizado;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch lote.");
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredLotes(
  query: string,
  currentPage: number,
  municipioId: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const lotes = await prisma.lote.findMany({
      where: {
        municipio_id: municipioId,
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
        numero: "desc",
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

export async function fetchLotesPages(query: string, municipioId: number) {
  try {
    const totalCount = await prisma.lote.count({
      where: {
        municipio_id: municipioId,
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

export async function crearLoteConInfracciones(data: any) {
  const {
    municipio_id,
    fecha_desde,
    fecha_hasta,
    estado,
    radar_id,
    directorio,
    infracciones,
  } = data;

  return await prisma.$transaction(async (tx) => {
    const ultimoLote = await tx.lote.findFirst({
      where: { municipio_id: parseInt(municipio_id) },
      orderBy: { numero: "desc" },
    });

    const numero = (ultimoLote?.numero ?? 0) + 1;

    const lote = await tx.lote.create({
      data: {
        municipio_id: parseInt(municipio_id),
        numero,
        descripcion: `Lote ${numero}`,
        fecha_desde: new Date(fecha_desde),
        fecha_hasta: new Date(fecha_hasta),
        estado,
        radar_id,
        directorio,
      },
    });

    for (const inf of infracciones) {
      const vehiculo = await tx.vehiculo.findUnique({
        where: { dominio: inf.dominio.toUpperCase() },
      });

      const [day, month, year] = inf.fecha.split("/");
      const parsedFecha = new Date(`${year}-${month}-${day}`);

      await tx.infraccion.create({
        data: {
          fecha: parsedFecha,
          hora: inf.hora,
          lote_id: lote.id,
          nombre_archivo: inf.nombre_archivo,
          velocidad_maxima: inf.velocidad_maxima,
          velocidad_medida: inf.velocidad_medida,
          imagen_url: inf.imagen_url,
          radar_id,
          dominio: inf.dominio.toUpperCase(),
          vehiculo_id: vehiculo?.id ?? null,
        },
      });
    }

    return lote;
  });
}

export async function actualizarLoteConInfracciones(data: any) {
  const {
    id,
    municipio_id,
    fecha_desde,
    fecha_hasta,
    estado,
    radar_id,
    directorio,
    infracciones,
  } = data;

  return await prisma.$transaction(async (tx) => {
    const lote = await tx.lote.update({
      where: { id },
      data: {
        fecha_desde: new Date(fecha_desde),
        fecha_hasta: new Date(fecha_hasta),
        estado,
        radar_id,
        directorio,
      },
    });

    await tx.infraccion.deleteMany({
      where: { lote_id: id },
    });

    for (const inf of infracciones) {
      const vehiculo = await tx.vehiculo.findUnique({
        where: { dominio: inf.dominio.toUpperCase() },
      });

      const [day, month, year] = inf.fecha.split("/");
      const parsedFecha = new Date(`${year}-${month}-${day}`);

      await tx.infraccion.create({
        data: {
          fecha: parsedFecha,
          hora: inf.hora,
          lote_id: id,
          nombre_archivo: inf.nombre_archivo,
          velocidad_maxima: inf.velocidad_maxima,
          velocidad_medida: inf.velocidad_medida,
          imagen_url: inf.imagen_url,
          radar_id,
          dominio: inf.dominio.toUpperCase(),
          vehiculo_id: vehiculo?.id ?? null,
        },
      });
    }

    return lote;
  });
}

export async function getLoteConInfracciones(loteId: number) {
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

  if (!lote) return null;

  return {
    id: lote.id,
    numero: lote.numero,
    descripcion: lote.descripcion,
    fecha_desde: lote.fecha_desde,
    fecha_hasta: lote.fecha_hasta,
    municipio: lote.municipio,
    radar: lote.radar,
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
}
