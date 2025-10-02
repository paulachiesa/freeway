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

// export async function crearLoteConInfracciones(data: any) {
//   const {
//     municipio_id,
//     fecha_desde,
//     fecha_hasta,
//     estado,
//     lugar_infraccion,
//     radar_id,
//     directorio,
//     infracciones,
//   } = data;

//   return await prisma.$transaction(async (tx) => {
//     const ultimoLote = await tx.lote.findFirst({
//       where: { municipio_id: parseInt(municipio_id) },
//       orderBy: { numero: "desc" },
//     });

//     const numero = (ultimoLote?.numero ?? 0) + 1;

//     const lote = await tx.lote.create({
//       data: {
//         municipio_id: parseInt(municipio_id),
//         numero,
//         descripcion: `Lote ${numero}`,
//         fecha_desde: new Date(fecha_desde),
//         fecha_hasta: new Date(fecha_hasta),
//         lugar_infraccion,
//         estado,
//         radar_id,
//         directorio,
//       },
//     });

//     for (const inf of infracciones) {
//       const vehiculo = await tx.vehiculo.findUnique({
//         where: { dominio: inf.dominio.toUpperCase() },
//       });

//       let parsedFecha: Date | null = null;
//       if (inf.fecha) {
//         // 👉 Si viene en formato DD/MM/YYYY (desde TXT), convertir a ISO
//         if (inf.fecha.includes("/")) {
//           const [day, month, year] = inf.fecha.split("/");
//           parsedFecha = new Date(`${year}-${month}-${day}`);
//         } else {
//           parsedFecha = new Date(inf.fecha); // ya viene ISO
//         }
//       }

//       await tx.infraccion.create({
//         data: {
//           fecha: parsedFecha,
//           hora: inf.hora,
//           lote_id: lote.id,
//           nombre_archivo: inf.nombre_archivo,
//           velocidad_maxima: inf.velocidad_maxima,
//           velocidad_medida: inf.velocidad_medida,
//           imagen_url: inf.imagen_url,
//           radar_id,
//           dominio: inf.dominio.toUpperCase(),
//           vehiculo_id: vehiculo?.id ?? null,
//         },
//       });
//     }

//     return lote;
//   });
// }

// export async function actualizarLoteConInfracciones(data: any) {
//   const {
//     id,
//     municipio_id,
//     fecha_desde,
//     fecha_hasta,
//     estado,
//     lugar_infraccion,
//     radar_id,
//     directorio,
//     infracciones,
//   } = data;

//   return await prisma.$transaction(async (tx) => {
//     const lote = await tx.lote.update({
//       where: { id },
//       data: {
//         fecha_desde: new Date(fecha_desde),
//         fecha_hasta: new Date(fecha_hasta),
//         estado,
//         radar_id,
//         directorio,
//         lugar_infraccion,
//       },
//     });

//     const actuales = await tx.infraccion.findMany({ where: { lote_id: id } });

//     const enviadosIds = infracciones
//       .filter((i: any) => i.id)
//       .map((i: any) => i.id);

//     const idsAEliminar = actuales
//       .map((a) => a.id)
//       .filter((id) => !enviadosIds.includes(id));

//     if (idsAEliminar.length > 0) {
//       await tx.infraccion.deleteMany({ where: { id: { in: idsAEliminar } } });
//     }

//     for (const inf of infracciones) {
//       const vehiculo = inf.dominio
//         ? await tx.vehiculo.findUnique({
//             where: { dominio: inf.dominio.toUpperCase() },
//           })
//         : null;

//       let parsedFecha: Date | null = null;
//       if (inf.fecha) {
//         if (inf.fecha.includes("/")) {
//           const [day, month, year] = inf.fecha.split("/");
//           parsedFecha = new Date(`${year}-${month}-${day}`);
//         } else {
//           parsedFecha = new Date(inf.fecha);
//         }
//       }

//       if (inf.id) {
//         // actualizar existente
//         await tx.infraccion.update({
//           where: { id: inf.id },
//           data: {
//             fecha: parsedFecha,
//             hora: inf.hora,
//             nombre_archivo: inf.nombre_archivo,
//             velocidad_maxima: inf.velocidad_maxima,
//             velocidad_medida: inf.velocidad_medida,
//             imagen_url: inf.imagen_url,
//             radar_id,
//             dominio: inf.dominio.toUpperCase(),
//             vehiculo_id: vehiculo?.id ?? null,
//           },
//         });
//       } else {
//         // crear nueva
//         await tx.infraccion.create({
//           data: {
//             fecha: parsedFecha,
//             hora: inf.hora,
//             lote_id: id,
//             nombre_archivo: inf.nombre_archivo,
//             velocidad_maxima: inf.velocidad_maxima,
//             velocidad_medida: inf.velocidad_medida,
//             imagen_url: inf.imagen_url,
//             radar_id,
//             dominio: inf.dominio.toUpperCase(),
//             vehiculo_id: vehiculo?.id ?? null,
//           },
//         });
//       }
//     }

//     return lote;
//   });
// }

export async function crearLoteConInfracciones(data: any) {
  const {
    municipio_id,
    fecha_desde,
    fecha_hasta,
    estado,
    lugar_infraccion,
    radar_id,
    directorio,
    infracciones,
  } = data;

  return await prisma.$transaction(async (tx) => {
    // Buscar último lote del municipio
    const ultimoLote = await tx.lote.findFirst({
      where: { municipio_id: parseInt(municipio_id) },
      orderBy: { numero: "desc" },
    });

    const numero = (ultimoLote?.numero ?? 0) + 1;

    // Crear lote
    const lote = await tx.lote.create({
      data: {
        municipio_id: parseInt(municipio_id),
        numero,
        descripcion: `Lote ${numero}`,
        fecha_desde: fecha_desde ? new Date(fecha_desde) : null,
        fecha_hasta: fecha_hasta ? new Date(fecha_hasta) : null,
        lugar_infraccion,
        estado,
        radar_id,
        directorio,
      },
    });

    if (infracciones?.length > 0) {
      // Preparar las infracciones
      const dataInfracciones = infracciones.map((inf: any) => {
        let parsedFecha: Date | null = null;

        if (inf.fecha) {
          if (typeof inf.fecha === "string" && inf.fecha.includes("/")) {
            const [day, month, year] = inf.fecha.split("/");
            parsedFecha = new Date(`${year}-${month}-${day}`);
          } else {
            parsedFecha = new Date(inf.fecha);
          }
        }

        return {
          fecha: parsedFecha,
          hora: inf.hora,
          lote_id: lote.id,
          nombre_archivo: inf.nombre_archivo,
          velocidad_maxima: inf.velocidad_maxima,
          velocidad_medida: inf.velocidad_medida,
          imagen_url: inf.imagen_url,
          radar_id,
          dominio: (inf.dominio || "").toUpperCase(),
          vehiculo_id: inf.vehiculo_id ?? null, // ✅ opcional
        };
      });

      // Insertar todas juntas
      await tx.infraccion.createMany({
        data: dataInfracciones,
        skipDuplicates: true,
      });
    }

    return lote;
  });
}

export async function actualizarLoteConInfracciones(data: any) {
  const {
    id,
    fecha_desde,
    fecha_hasta,
    estado,
    lugar_infraccion,
    radar_id,
    directorio,
    infracciones,
  } = data;

  return await prisma.$transaction(async (tx) => {
    // Actualizar datos del lote
    const lote = await tx.lote.update({
      where: { id },
      data: {
        fecha_desde: fecha_desde ? new Date(fecha_desde) : null,
        fecha_hasta: fecha_hasta ? new Date(fecha_hasta) : null,
        estado,
        radar_id,
        directorio,
        lugar_infraccion,
      },
    });

    // 1) Borrar infracciones anteriores
    await tx.infraccion.deleteMany({ where: { lote_id: id } });

    // 2) Insertar todas las infracciones que vienen del front
    if (infracciones?.length > 0) {
      const nuevas = infracciones.map((inf: any) => {
        let parsedFecha: Date | null = null;

        if (inf.fecha) {
          if (typeof inf.fecha === "string" && inf.fecha.includes("/")) {
            const [day, month, year] = inf.fecha.split("/");
            parsedFecha = new Date(`${year}-${month}-${day}`);
          } else {
            parsedFecha = new Date(inf.fecha);
          }
        }

        return {
          fecha: parsedFecha,
          hora: inf.hora,
          lote_id: id,
          nombre_archivo: inf.nombre_archivo,
          velocidad_maxima: inf.velocidad_maxima,
          velocidad_medida: inf.velocidad_medida,
          imagen_url: inf.imagen_url,
          radar_id,
          dominio: (inf.dominio || "").toUpperCase(),
          vehiculo_id: inf.vehiculo_id ?? null,
        };
      });

      await tx.infraccion.createMany({
        data: nuevas,
        skipDuplicates: true,
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
