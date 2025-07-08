"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Esquema de validación para Lote
const LoteFormSchema = z.object({
  id: z.coerce.number().optional(),
  municipio_id: z.coerce.number(),
  descripcion: z.string().min(3, "La descripción es obligatoria"),
  numero: z.coerce.number().optional().nullable(),
  fecha_desde: z.coerce.date(),
  fecha_hasta: z.coerce.date(),
  estado: z.string().optional().nullable(),
  radar_id: z.coerce.number().optional().nullable(),
  directorio: z.string().optional().nullable(),
});

const CreateLote = LoteFormSchema.omit({ id: true });

export type LoteFormState = {
  message: string | null;
  errors: {
    municipio_id?: string[];
    descripcion?: string[];
    fecha_desde?: string[];
    fecha_hasta?: string[];
    estado?: string[];
    radar_id?: string[];
    directorio?: string[];
  };
};

export async function createLote(formData: FormData) {
  const data = CreateLote.parse({
    municipio_id: formData.get("municipio_id"),
    descripcion: formData.get("descripcion"),
    numero: formData.get("numero"),
    fecha_desde: formData.get("fecha_desde"),
    fecha_hasta: formData.get("fecha_hasta"),
    estado: formData.get("estado"),
    radar_id: formData.get("radar_id"),
    directorio: formData.get("directorio"),
  });

  try {
    await prisma.lote.create({
      data,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al crear lote.");
  }

  revalidatePath("/dashboard/gestion/lotes");
  redirect("/dashboard/gestion/lotes");
}

const UpdateLote = LoteFormSchema.omit({ id: true });

export async function updateLote(id: number, formData: FormData) {
  const data = UpdateLote.parse({
    municipio_id: formData.get("municipio_id"),
    descripcion: formData.get("descripcion"),
    numero: formData.get("numero"),
    fecha_desde: formData.get("fecha_desde"),
    fecha_hasta: formData.get("fecha_hasta"),
    estado: formData.get("estado"),
    radar_id: formData.get("radar_id"),
    directorio: formData.get("directorio"),
  });

  try {
    await prisma.lote.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al editar lote.");
  }

  revalidatePath("/dashboard/gestion/lotes");
  redirect("/dashboard/gestion/lotes");
}

export async function deleteLote(id: number) {
  try {
    await prisma.lote.delete({
      where: { id },
    });
    revalidatePath("/dashboard/gestion/lotes");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al eliminar lote.");
  }
}
