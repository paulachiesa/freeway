import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { mapeoColumnasExcel } from "@/app/lib/mapeoColumnasExcel";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No se subió archivo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = XLSX.utils.decode_range(sheet["!ref"]!);

    // Leer encabezados desde fila 2 (índice r = 1)
    const headers: Record<number, string> = {};
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
      const cell = sheet[cellAddress];
      if (cell) headers[col] = cell.v.toString().trim().toUpperCase();
    }

    // Mapeo de encabezados a nombres de propiedad esperados por mapeoColumnasExcel
    const encabezadoToPropiedad: Record<string, string> = {
      DOMINIO: "dominio",
      "CUIL/CUIT": "cuil",
      DNI: "dni",
      "TIPO DNI": "tipoDni",
      NACIONALIDAD: "nacionalidad",
      FECNAC: "fechaNac",
      FECFALLE: "fechaFalle",
      GENERO: "genero",
      "NOMBRE COMPLETO": "nombreCompleto",
      DIRECCION: "direccion",
      CP: "cp",
      CPA: "cpa",
      LOCALIDAD: "localidad",
      PARTIDO: "partido",
      PROVINCIA: "provincia",
      "CELULAR 1": "celular1",
      "CELULAR WSP 1": "celularWsp1",
      "CELULAR 2": "celular2",
      "CELULAR WSP 2": "celularWsp2",
      "CELULAR 3": "celular3",
      "CELULAR WSP 3": "celularWsp3",
      "CELULAR 4": "celular4",
      "CELULAR WSP 4": "celularWsp4",
      "CELULAR 5": "celular5",
      "CELULAR WSP 5": "celularWsp5",
      EMAIL: "email",
      "EMAIL 2": "email2",
      "EMAIL 3": "email3",
      "PORCENTAJE DE ITULARIDAD": "porcentajeTitularidad",
      PROCEDENCIA: "procedencia",
      "FECHA DE TRAMITE": "fechaTramite",
      "FECHA DE COMPRA": "fechaCompra",
      MARCA: "marcaVehiculo",
      MODELO: "modeloVehiculo",
      TIPO: "tipoVehiculo",
      NROITEM: "nroItem",
    };

    let procesadas = 0;
    const errores: any[] = [];

    // Leer desde fila 3 en adelante (r = 2)
    for (let rowNum = 2; rowNum <= range.e.r; rowNum++) {
      try {
        const row: Record<string, any> = {};

        for (let col = range.s.c; col <= range.e.c; col++) {
          const header = headers[col];
          const prop = encabezadoToPropiedad[header];
          if (!prop) continue;

          const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: col });
          const cell = sheet[cellAddress];
          if (cell) row[prop] = cell.v;
        }

        if (!row.cuil && !row.dominio) continue;

        await mapeoColumnasExcel(row);
        procesadas++;
      } catch (error) {
        errores.push({ fila: rowNum + 1, error: (error as Error).message });
      }
    }

    // Paso final: revisar lotes en estado "Proceso de carga incompleto"
    const lotesIncompletos = await prisma.lote.findMany({
      where: { estado: "Proceso de carga incompleto" },
      include: { infraccion: true },
    });

    for (const lote of lotesIncompletos) {
      let todasCompletadas = true;

      for (const infraccion of lote.infraccion) {
        if (!infraccion.vehiculo_id && infraccion.dominio) {
          const vehiculo = await prisma.vehiculo.findUnique({
            where: { dominio: infraccion.dominio.toUpperCase() },
          });

          if (vehiculo) {
            await prisma.infraccion.update({
              where: { id: infraccion.id },
              data: { vehiculo_id: vehiculo.id },
            });
          } else {
            todasCompletadas = false;
          }
        }
      }

      if (todasCompletadas) {
        await prisma.lote.update({
          where: { id: lote.id },
          data: { estado: "Proceso de carga completo" },
        });
      }
    }

    return NextResponse.json({ success: true, procesadas, errores });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
