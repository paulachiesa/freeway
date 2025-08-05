import { prisma } from "@/app/lib/prisma";

function parseFecha(valor: any): Date | null {
  if (!valor) return null;
  const fecha = new Date(valor);
  return isNaN(fecha.getTime()) ? null : fecha;
}

function truncar(valor: string | null | undefined, max = 255): string | null {
  if (!valor) return null;
  return valor.length > max ? valor.slice(0, max) : valor;
}

export async function mapeoColumnasExcel(row: Record<string, any>) {
  await prisma.$transaction(async (tx) => {
    if (!row.cuil) throw new Error("Fila sin CUIL");

    const persona = await tx.persona.upsert({
      where: { cuil_cuit: BigInt(row.cuil) },
      update: {
        dni: row.dni,
        tipo_dni: row.tipoDni,
        nombre_completo: truncar(row.nombreCompleto),
        email: truncar(row.email, 100),
        email1: truncar(row.email2, 100),
        email2: truncar(row.email3, 100),
      },
      create: {
        cuil_cuit: BigInt(row.cuil),
        dni: row.dni,
        tipo_dni: row.tipoDni,
        nombre_completo: truncar(row.nombreCompleto),
        email: truncar(row.email, 100),
        email1: truncar(row.email2, 100),
        email2: truncar(row.email3, 100),
      },
    });

    if (row.direccion) {
      const existeDomicilio = await tx.domicilio.findFirst({
        where: {
          persona_id: persona.id,
          direccion: row.direccion,
          provincia: row.provincia,
        },
      });

      if (!existeDomicilio) {
        await tx.domicilio.create({
          data: {
            persona_id: persona.id,
            direccion: truncar(row.direccion, 255),
            codigo_postal: truncar(row.cp, 10),
            codigo_postal_argentino: truncar(row.cpa, 10),
            localidad: truncar(row.localidad, 100),
            partido: truncar(row.partido, 100),
            provincia: truncar(row.provincia, 100),
          },
        });
      }
    }

    for (let i = 1; i <= 5; i++) {
      const numero = row[`celular${i}`];
      if (numero) {
        const existeTel = await tx.telefonopersona.findFirst({
          where: {
            persona_id: persona.id,
            numero,
            orden: i,
          },
        });

        if (!existeTel) {
          await tx.telefonopersona.create({
            data: {
              persona_id: persona.id,
              numero: truncar(numero, 20),
              es_whatsapp:
                row[`celularWsp${i}`]?.toString().toLowerCase() === "si",
              orden: i,
            },
          });
        }
      }
    }

    if (row.dominio) {
      await tx.vehiculo.upsert({
        where: { dominio: row.dominio },
        update: {
          marca: truncar(row.marcaVehiculo, 50),
          modelo: truncar(row.modeloVehiculo, 50),
          tipo: truncar(row.tipoVehiculo, 50),
          porcentaje_titularidad: row.porcentajeTitularidad
            ? parseFloat(row.porcentajeTitularidad)
            : null,
          fecha_tramite: parseFecha(row.fechaTramite),
          fecha_compra: parseFecha(row.fechaCompra),
          persona_id: persona.id,
        },
        create: {
          dominio: row.dominio,
          marca: truncar(row.marcaVehiculo, 50),
          modelo: truncar(row.modeloVehiculo, 50),
          tipo: truncar(row.tipoVehiculo, 50),
          porcentaje_titularidad: row.porcentajeTitularidad
            ? parseFloat(row.porcentajeTitularidad)
            : null,
          fecha_tramite: parseFecha(row.fechaTramite),
          fecha_compra: parseFecha(row.fechaCompra),
          persona_id: persona.id,
        },
      });
    }

    if (row.nroItem) {
      await tx.adicionalespersona.upsert({
        where: { persona_id: persona.id },
        update: { nroitem: truncar(row.nroItem, 50) },
        create: { persona_id: persona.id, nroitem: truncar(row.nroItem, 50) },
      });
    }

    const bcra = await tx.bcrapersona.upsert({
      where: { persona_id: persona.id },
      update: {
        score: row.score ? parseInt(row.score) : null,
        situacion1_desde: parseFecha(row.situacion1Desde),
        cantidad_entidades: row.cantEntidades
          ? parseInt(row.cantEntidades)
          : null,
        deuda_tomada: row.deudaTomada ? parseFloat(row.deudaTomada) : null,
        deuda_mora: row.deudaMora ? parseFloat(row.deudaMora) : null,
        deuda_ultimos_24meses: row.deuda24m ? parseFloat(row.deuda24m) : null,
      },
      create: {
        persona_id: persona.id,
        score: row.score ? parseInt(row.score) : null,
        situacion1_desde: parseFecha(row.situacion1Desde),
        cantidad_entidades: row.cantEntidades
          ? parseInt(row.cantEntidades)
          : null,
        deuda_tomada: row.deudaTomada ? parseFloat(row.deudaTomada) : null,
        deuda_mora: row.deudaMora ? parseFloat(row.deudaMora) : null,
        deuda_ultimos_24meses: row.deuda24m ? parseFloat(row.deuda24m) : null,
      },
    });

    const riesgos = [
      { tipo: "bajo", cant: row.cantBajo, deuda: row.deudaBajo },
      { tipo: "medio", cant: row.cantMedio, deuda: row.deudaMedio },
      { tipo: "alto", cant: row.cantAlto, deuda: row.deudaAlto },
      {
        tipo: "irrecuperable",
        cant: row.cantIrrecuperable,
        deuda: row.deudaIrrecuperable,
      },
    ];

    for (const r of riesgos) {
      if (r.cant || r.deuda) {
        const existeRiesgo = await tx.bcrariesgo.findFirst({
          where: {
            bcra_persona_id: bcra.id,
            tipo_riesgo: r.tipo,
          },
        });

        if (!existeRiesgo) {
          await tx.bcrariesgo.create({
            data: {
              bcra_persona_id: bcra.id,
              tipo_riesgo: r.tipo,
              cantidad_entidades: r.cant ? parseInt(r.cant) : 0,
              deuda_tomada: r.deuda ? parseFloat(r.deuda) : 0,
            },
          });
        }
      }
    }

    const existeDistribucion = await tx.distribucioncomportamiento.findFirst({
      where: { bcra_persona_id: bcra.id },
    });

    if (!existeDistribucion) {
      await tx.distribucioncomportamiento.create({
        data: {
          bcra_persona_id: bcra.id,
          situacion1: row.situacion1 ? parseInt(row.situacion1) : 0,
          situacion2: row.situacion2 ? parseInt(row.situacion2) : 0,
          situacion3: row.situacion3 ? parseInt(row.situacion3) : 0,
          situacion4: row.situacion4 ? parseInt(row.situacion4) : 0,
          situacion5: row.situacion5 ? parseInt(row.situacion5) : 0,
        },
      });
    }

    for (let i = 1; i <= 4; i++) {
      const cod = row[`entidadCod${i}`];
      if (cod) {
        const existeEntidad = await tx.entidadopera.findFirst({
          where: {
            bcra_persona_id: bcra.id,
            cod_entidad: cod,
          },
        });

        if (!existeEntidad) {
          await tx.entidadopera.create({
            data: {
              bcra_persona_id: bcra.id,
              cod_entidad: truncar(cod, 20),
              descripcion: truncar(row[`entidadDesc${i}`]),
              deuda_tomada: row[`entidadDeuda${i}`]
                ? parseFloat(row[`entidadDeuda${i}`])
                : 0,
            },
          });
        }
      }
    }

    const periodos = [
      { meses: 12, sufijo: "" },
      { meses: 24, sufijo: "2" },
    ];

    for (const p of periodos) {
      const cantidad = row[`chequesRechazados${p.sufijo}`];
      const monto = row[`montoRechazados${p.sufijo}`];
      const levantados = row[`chequesLevantados${p.sufijo}`];
      const montoLev = row[`montoLevantados${p.sufijo}`];

      if (cantidad || monto || levantados || montoLev) {
        const existeCheque = await tx.chequesrechazados.findFirst({
          where: {
            persona_id: persona.id,
            periodo: `${p.meses} meses`,
          },
        });

        if (!existeCheque) {
          await tx.chequesrechazados.create({
            data: {
              persona_id: persona.id,
              periodo: `${p.meses} meses`,
              cantidad_rechazados: cantidad ? parseInt(cantidad) : 0,
              monto_rechazado: monto ? parseFloat(monto) : 0,
              cheques_levantados: levantados ? parseInt(levantados) : 0,
              monto_levantados: montoLev ? parseFloat(montoLev) : 0,
            },
          });
        }
      }
    }
  });
}
