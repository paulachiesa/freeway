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

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Leer el Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Rango de filas y columnas
    const range = XLSX.utils.decode_range(sheet["!ref"]!);

    let procesadas = 0;
    const errores: any[] = [];

    // Iteramos desde la fila 4 (ajusta si tus datos empiezan en otra fila)
    for (let rowNum = 4; rowNum <= range.e.r; rowNum++) {
      try {
        // Construimos el objeto row usando el mapeo de columnas por letra
        const row = {
          dominio: sheet[`B${rowNum}`]?.v,
          cuil: sheet[`C${rowNum}`]?.v,
          dni: sheet[`D${rowNum}`]?.v,
          tipoDni: sheet[`E${rowNum}`]?.v,
          nacionalidad: sheet[`F${rowNum}`]?.v,
          fechaNac: sheet[`G${rowNum}`]?.v,
          fechaFalle: sheet[`H${rowNum}`]?.v,
          genero: sheet[`I${rowNum}`]?.v,
          nombreCompleto: sheet[`J${rowNum}`]?.v,
          direccion: sheet[`K${rowNum}`]?.v,
          cp: sheet[`L${rowNum}`]?.v,
          cpa: sheet[`M${rowNum}`]?.v,
          localidad: sheet[`N${rowNum}`]?.v,
          partido: sheet[`O${rowNum}`]?.v,
          provincia: sheet[`P${rowNum}`]?.v,

          // Celulares
          celular1: sheet[`Q${rowNum}`]?.v,
          celularWsp1: sheet[`R${rowNum}`]?.v,
          celular2: sheet[`S${rowNum}`]?.v,
          celularWsp2: sheet[`T${rowNum}`]?.v,
          celular3: sheet[`U${rowNum}`]?.v,
          celularWsp3: sheet[`V${rowNum}`]?.v,
          celular4: sheet[`W${rowNum}`]?.v,
          celularWsp4: sheet[`X${rowNum}`]?.v,
          celular5: sheet[`Y${rowNum}`]?.v,
          celularWsp5: sheet[`Z${rowNum}`]?.v,

          // Emails
          email: sheet[`AA${rowNum}`]?.v,
          email2: sheet[`AB${rowNum}`]?.v,
          email3: sheet[`AC${rowNum}`]?.v,

          // Datos BCRA
          score: sheet[`AD${rowNum}`]?.v,
          situacion1Desde: sheet[`AE${rowNum}`]?.v,
          cantEntidades: sheet[`AF${rowNum}`]?.v,
          deudaTomada: sheet[`AG${rowNum}`]?.v,
          deudaMora: sheet[`AH${rowNum}`]?.v,
          deuda24m: sheet[`BG${rowNum}`]?.v,

          // Riesgos
          cantBajo: sheet[`AI${rowNum}`]?.v,
          deudaBajo: sheet[`AJ${rowNum}`]?.v,
          cantMedio: sheet[`AK${rowNum}`]?.v,
          deudaMedio: sheet[`AL${rowNum}`]?.v,
          cantAlto: sheet[`AM${rowNum}`]?.v,
          deudaAlto: sheet[`AN${rowNum}`]?.v,
          cantIrrecuperable: sheet[`AO${rowNum}`]?.v,
          deudaIrrecuperable: sheet[`AP${rowNum}`]?.v,

          // Distribución comportamiento
          situacion1: sheet[`AQ${rowNum}`]?.v,
          situacion2: sheet[`AR${rowNum}`]?.v,
          situacion3: sheet[`AS${rowNum}`]?.v,
          situacion4: sheet[`AT${rowNum}`]?.v,
          situacion5: sheet[`AU${rowNum}`]?.v,

          // Entidades opera
          entidadCod1: sheet[`AV${rowNum}`]?.v,
          entidadDesc1: sheet[`AW${rowNum}`]?.v,
          entidadDeuda1: sheet[`AX${rowNum}`]?.v,
          entidadCod2: sheet[`AY${rowNum}`]?.v,
          entidadDesc2: sheet[`AZ${rowNum}`]?.v,
          entidadDeuda2: sheet[`BA${rowNum}`]?.v,
          entidadCod3: sheet[`BB${rowNum}`]?.v,
          entidadDesc3: sheet[`BC${rowNum}`]?.v,
          entidadDeuda3: sheet[`BD${rowNum}`]?.v,
          entidadCod4: sheet[`BE${rowNum}`]?.v,
          entidadDesc4: sheet[`BF${rowNum}`]?.v,
          entidadDeuda4: sheet[`BG${rowNum}`]?.v,

          // Cheques rechazados
          chequesRechazados: sheet[`BH${rowNum}`]?.v,
          montoRechazados: sheet[`BI${rowNum}`]?.v,
          chequesLevantados: sheet[`BJ${rowNum}`]?.v,
          montoLevantados: sheet[`BK${rowNum}`]?.v,

          chequesRechazados2: sheet[`BL${rowNum}`]?.v,
          montoRechazados2: sheet[`BM${rowNum}`]?.v,
          chequesLevantados2: sheet[`BN${rowNum}`]?.v,
          montoLevantados2: sheet[`BO${rowNum}`]?.v,

          // Vehículo
          porcentajeTitularidad: sheet[`BQ${rowNum}`]?.v,
          procedencia: sheet[`BR${rowNum}`]?.v,
          fechaTramite: sheet[`BS${rowNum}`]?.v,
          fechaCompra: sheet[`BT${rowNum}`]?.v,
          marcaVehiculo: sheet[`BU${rowNum}`]?.v,
          modeloVehiculo: sheet[`BV${rowNum}`]?.v,
          tipoVehiculo: sheet[`BW${rowNum}`]?.v,

          // Adicionales persona
          nroItem: sheet[`BX${rowNum}`]?.v,
        };

        // Saltear filas vacías (si no tienen CUIL ni dominio)
        if (!row.cuil && !row.dominio) continue;

        await mapeoColumnasExcel(row);
        procesadas++;
      } catch (error) {
        errores.push({ fila: rowNum, error: (error as Error).message });
      }
    }

    // Paso 1: Buscar lotes en estado "Proceso de carga incompleto"
    const lotesIncompletos = await prisma.lote.findMany({
      where: { estado: "Proceso de carga incompleto" },
      include: { infraccion: true },
    });

    // Paso 2: Iterar lotes e infracciones
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

      // Paso 3: Si todas las infracciones tienen vehiculo_id, cambiar el estado
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
