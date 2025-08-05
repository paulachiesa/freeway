"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CuadroTarifarioFormSchema = z.object({
  id: z.coerce.number().optional(),
  velocidad_desde: z.coerce
    .number()
    .min(0, "Debe ingresar una velocidad válida"),
  velocidad_hasta: z.coerce
    .number()
    .min(0, "Debe ingresar una velocidad válida"),
  gasto_administrativo: z.coerce.number().nonnegative().optional().nullable(),
  primer_vencimiento: z.coerce.date().optional().nullable(),
  valor_1er_vencimiento: z.coerce.number().nonnegative().optional().nullable(),
  segundo_vencimiento: z.coerce.date().optional().nullable(),
  valor_2do_vencimiento: z.coerce.number().nonnegative().optional().nullable(),
});

const CreateCuadroTarifario = CuadroTarifarioFormSchema.omit({ id: true });

export async function createCuadroTarifario(formData: FormData) {
  const {
    velocidad_desde,
    velocidad_hasta,
    gasto_administrativo,
    primer_vencimiento,
    valor_1er_vencimiento,
    segundo_vencimiento,
    valor_2do_vencimiento,
  } = CreateCuadroTarifario.parse({
    velocidad_desde: formData.get("velocidad_desde"),
    velocidad_hasta: formData.get("velocidad_hasta"),
    gasto_administrativo: formData.get("gasto_administrativo"),
    primer_vencimiento: formData.get("primer_vencimiento"),
    valor_1er_vencimiento: formData.get("valor_1er_vencimiento"),
    segundo_vencimiento: formData.get("segundo_vencimiento"),
    valor_2do_vencimiento: formData.get("valor_2do_vencimiento"),
  });

  try {
    await prisma.cuadrotarifario.create({
      data: {
        velocidad_desde: velocidad_desde,
        velocidad_hasta: velocidad_hasta,
        gasto_administrativo: gasto_administrativo,
        primer_vencimiento: primer_vencimiento,
        valor_1er_vencimiento: valor_1er_vencimiento,
        segundo_vencimiento: segundo_vencimiento,
        valor_2do_vencimiento: valor_2do_vencimiento,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al crear cuadro tarifario.");
  }

  revalidatePath("/dashboard/gestion/cuadroTarifario");
  redirect("/dashboard/gestion/cuadroTarifario");
}

const UpdateCuadroTarifario = CuadroTarifarioFormSchema.omit({ id: true });

export async function updateCuadroTarifario(id: number, formData: FormData) {
  const {
    velocidad_desde,
    velocidad_hasta,
    gasto_administrativo,
    primer_vencimiento,
    valor_1er_vencimiento,
    segundo_vencimiento,
    valor_2do_vencimiento,
  } = UpdateCuadroTarifario.parse({
    velocidad_desde: formData.get("velocidad_desde"),
    velocidad_hasta: formData.get("velocidad_hasta"),
    gasto_administrativo: formData.get("gasto_administrativo"),
    primer_vencimiento: formData.get("primer_vencimiento"),
    valor_1er_vencimiento: formData.get("valor_1er_vencimiento"),
    segundo_vencimiento: formData.get("segundo_vencimiento"),
    valor_2do_vencimiento: formData.get("valor_2do_vencimiento"),
  });

  try {
    await prisma.cuadrotarifario.update({
      where: { id },
      data: {
        velocidad_desde: velocidad_desde,
        velocidad_hasta: velocidad_hasta,
        gasto_administrativo: gasto_administrativo,
        primer_vencimiento: primer_vencimiento,
        valor_1er_vencimiento: valor_1er_vencimiento,
        segundo_vencimiento: segundo_vencimiento,
        valor_2do_vencimiento: valor_2do_vencimiento,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al editar cuadro tarifario.");
  }

  revalidatePath("/dashboard/gestion/cuadroTarifario");
  redirect("/dashboard/gestion/cuadroTarifario");
}

export async function deleteCuadroTarifario(id: number) {
  try {
    await prisma.cuadrotarifario.delete({
      where: { id },
    });
    revalidatePath("/dashboard/gestion/cuadroTarifario");
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Error al eliminar cuadro tarifario.");
  }
}
