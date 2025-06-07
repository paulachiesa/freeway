"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// este archivo contiene funciones de escritura (mutaciones de la bd)

const MunicipioFormSchema = z.object({
  id: z.coerce.number().optional(),
  nombre: z.string().min(3, "El nombre es obligatorio"),
  provincia: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
});

const CreateMunicipio = MunicipioFormSchema.omit({ id: true });

export async function createMunicipio(formData: FormData) {
  const { nombre, direccion, provincia, ciudad } = CreateMunicipio.parse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
    ciudad: formData.get("ciudad"),
    provincia: formData.get("provincia"),
  });

  try {
    await prisma.municipio.create({
      data: {
        nombre: nombre,
        provincia: provincia,
        ciudad: ciudad,
        direccion: direccion,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al crear municipio.");
  }

  revalidatePath("/dashboard/gestion/municipios");
  redirect("/dashboard/gestion/municipios");
}

const UpdateMunicipio = MunicipioFormSchema.omit({ id: true });

export async function updateMunicipio(id: number, formData: FormData) {
  const { nombre, direccion, provincia, ciudad } = UpdateMunicipio.parse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
    ciudad: formData.get("ciudad"),
    provincia: formData.get("provincia"),
  });

  try {
    await prisma.municipio.update({
      where: { id },
      data: {
        nombre: nombre,
        provincia: provincia,
        ciudad: ciudad,
        direccion: direccion,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al editar municipio.");
  }

  revalidatePath("/dashboard/gestion/municipios");
  redirect("/dashboard/gestion/municipios");
}

export async function deleteMunicipio(id: number) {
  try {
    await prisma.municipio.delete({
      where: { id },
    });
    revalidatePath("/dashboard/gestion/municipios");
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Error al eliminar municipio.");
  }
}
