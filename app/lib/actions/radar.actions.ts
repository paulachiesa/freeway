"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// este archivo contiene funciones de escritura (mutaciones de la bd)

const RadarFormSchema = z.object({
  id: z.coerce.number().optional(),
  marca: z.string().max(100, "Máximo 100 caracteres").optional().nullable(),
  modelo: z.string().max(100, "Máximo 100 caracteres").optional().nullable(),
  nro_serie: z.string().max(100, "Máximo 100 caracteres").optional().nullable(),
});

const CreateRadar = RadarFormSchema.omit({ id: true });

export async function createRadar(formData: FormData) {
  const { marca, modelo, nro_serie } = CreateRadar.parse({
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    nro_serie: formData.get("nro_serie"),
  });

  try {
    await prisma.radar.create({
      data: {
        marca: marca,
        modelo: modelo,
        nro_serie: nro_serie,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al crear radar.");
  }

  revalidatePath("/dashboard/gestion/radares");
  redirect("/dashboard/gestion/radares");
}

const UpdateRadar = RadarFormSchema.omit({ id: true });

export async function updateRadar(id: number, formData: FormData) {
  const { marca, modelo, nro_serie } = UpdateRadar.parse({
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    nro_serie: formData.get("nro_serie"),
  });

  try {
    await prisma.radar.update({
      where: { id },
      data: {
        marca: marca,
        modelo: modelo,
        nro_serie: nro_serie,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al editar radar.");
  }

  revalidatePath("/dashboard/gestion/radares");
  redirect("/dashboard/gestion/radares");
}

export async function deleteRadar(id: number) {
  try {
    await prisma.radar.delete({
      where: { id },
    });
    revalidatePath("/dashboard/gestion/radares");
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Error al eliminar radar.");
  }
}
