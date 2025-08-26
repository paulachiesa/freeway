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
        genero: row.genero,
        nacionalidad: row.nacionalidad,
        fecha_nacimiento: row.fechaNac,
        fecha_fallecimiento: row.fecFalle,
        nombre_completo: truncar(row.nombreCompleto),
        email: truncar(row.email, 100),
        email1: truncar(row.email2, 100),
        email2: truncar(row.email3, 100),
      },
      create: {
        cuil_cuit: BigInt(row.cuil),
        dni: row.dni,
        tipo_dni: row.tipoDni,
        genero: row.genero,
        nacionalidad: row.nacionalidad,
        fecha_nacimiento: row.fechaNac,
        fecha_fallecimiento: row.fec,
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
          procedencia: row.procedencia,
          porcentaje_titularidad: row.porcentajeTitularidad
            ? parseFloat(row.porcentajeTitularidad)
            : null,
          fecha_tramite: row.fechaTramite,
          fecha_compra: row.fechaCompra,
          persona_id: persona.id,
        },
        create: {
          dominio: row.dominio,
          marca: truncar(row.marcaVehiculo, 50),
          modelo: truncar(row.modeloVehiculo, 50),
          tipo: truncar(row.tipoVehiculo, 50),
          procedencia: row.procedencia,
          porcentaje_titularidad: row.porcentajeTitularidad
            ? parseFloat(row.porcentajeTitularidad)
            : null,
          fecha_tramite: row.fechaTramite,
          fecha_compra: row.fechaCompra,
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
  });
}
