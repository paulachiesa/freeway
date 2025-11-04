import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import ExcelJS from "exceljs";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  try {
    // === 1️⃣ Filtro de búsqueda ===
    const where: Prisma.actaWhereInput =
      query?.trim() !== ""
        ? {
            infraccion: {
              OR: [
                {
                  dominio: { contains: query, mode: "insensitive" },
                },
                {
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
              ],
            },
          }
        : {};

    // === 2️⃣ Consulta completa ===
    const actas = await prisma.acta.findMany({
      where,
      orderBy: { id: "desc" },
      select: {
        id: true,
        numero_acta: true,
        fecha_emision: true,
        fecha_vencimiento_1: true,
        fecha_vencimiento_2: true,
        infraccion: {
          select: {
            dominio: true,
            fecha: true,
            hora: true,
            velocidad_medida: true,
            velocidad_maxima: true,
            radar: { select: { marca: true, modelo: true } },
            vehiculo: {
              select: {
                dominio: true,
                marca: true,
                modelo: true,
                anio: true,
                tipo: true,
                procedencia: true,
                porcentaje_titularidad: true,
                fecha_compra: true,
                fecha_tramite: true,
                persona: {
                  select: {
                    id: true,
                    nombre_completo: true,
                    nombre: true,
                    apellido: true,
                    dni: true,
                    tipo_dni: true,
                    genero: true,
                    nacionalidad: true,
                    fecha_nacimiento: true,
                    fecha_fallecimiento: true,
                    cuil_cuit: true,
                    email: true,
                    email1: true,
                    email2: true,
                    adicionalespersona: { select: { nroitem: true } },
                    domicilio: {
                      select: {
                        direccion: true,
                        codigo_postal: true,
                        codigo_postal_argentino: true,
                        localidad: true,
                        partido: true,
                        provincia: true,
                      },
                      orderBy: { id: "desc" },
                      take: 1,
                    },
                    telefonopersona: {
                      select: { numero: true, es_whatsapp: true, orden: true },
                      orderBy: [{ orden: "asc" }, { id: "asc" }],
                      take: 5,
                    },
                    vehiculo: {
                      select: {
                        dominio: true,
                        porcentaje_titularidad: true,
                        procedencia: true,
                        fecha_tramite: true,
                        fecha_compra: true,
                        marca: true,
                        modelo: true,
                        tipo: true,
                      },
                      orderBy: { id: "desc" },
                      take: 5,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!actas.length) {
      return NextResponse.json(
        { success: false, error: "No hay actas." },
        { status: 404 }
      );
    }

    // === 3️⃣ Generación del Excel ===
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Actas");

    sheet.columns = [
      { header: "Nro Acta", key: "nroActa", width: 12 },
      { header: "Dominio", key: "dominio", width: 12 },
      { header: "Nombre", key: "nombre", width: 25 },
      { header: "DNI", key: "dni", width: 12 },
      { header: "CUIL", key: "cuil", width: 18 },
      { header: "Email", key: "email", width: 25 },
      { header: "Nacionalidad", key: "nacionalidad", width: 18 },
      { header: "Fecha Nac.", key: "fechaNac", width: 14 },
      { header: "Vehículo", key: "vehiculo", width: 25 },
      { header: "Procedencia", key: "procedencia", width: 18 },
      { header: "Fecha Infracción", key: "fechaInfr", width: 18 },
      { header: "Hora", key: "hora", width: 10 },
      { header: "Vel. Medida", key: "velMedida", width: 12 },
      { header: "Vel. Máxima", key: "velMax", width: 12 },
      { header: "Dirección", key: "direccion", width: 25 },
      { header: "Localidad", key: "localidad", width: 20 },
      { header: "Provincia", key: "provincia", width: 20 },
      { header: "Teléfonos", key: "telefonos", width: 30 },
    ];

    for (const a of actas) {
      const persona = a.infraccion?.vehiculo?.persona;
      const veh = a.infraccion?.vehiculo;
      const dom = persona?.domicilio?.[0];
      const tel = persona?.telefonopersona
        ?.map((t) => `${t.numero}${t.es_whatsapp ? " (WhatsApp)" : ""}`)
        .join(", ");

      sheet.addRow({
        nroActa: a.numero_acta,
        dominio: a.infraccion?.dominio ?? "-",
        nombre:
          persona?.nombre_completo ??
          [persona?.nombre, persona?.apellido].filter(Boolean).join(" "),
        dni: persona?.dni ?? "-",
        cuil: persona?.cuil_cuit ? String(persona.cuil_cuit) : "-",
        email: persona?.email ?? persona?.email1 ?? persona?.email2 ?? "-",
        nacionalidad: persona?.nacionalidad ?? "-",
        fechaNac: persona?.fecha_nacimiento ?? "-",
        vehiculo: [veh?.marca, veh?.modelo, veh?.anio]
          .filter(Boolean)
          .join(" "),
        procedencia: veh?.procedencia ?? "-",
        fechaInfr: a.infraccion?.fecha?.toLocaleDateString("es-AR") ?? "-",
        hora: a.infraccion?.hora ?? "-",
        velMedida: a.infraccion?.velocidad_medida ?? "-",
        velMax: a.infraccion?.velocidad_maxima ?? "-",
        direccion: dom?.direccion ?? "-",
        localidad: dom?.localidad ?? "-",
        provincia: dom?.provincia ?? "-",
        telefonos: tel || "-",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="reporte_actas.xlsx"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Error de servidor" },
      { status: 500 }
    );
  }
}
