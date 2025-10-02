"use server";

import { z } from "zod";
import fs from "fs";
import path from "path";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MunicipioFormSchema = z.object({
  id: z.coerce.number().optional(),
  nombre: z.string().min(3, "El nombre es obligatorio"),
  provincia: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  autoridad_constatacion: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
});

const sanitize = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-zA-Z0-9._-]+/g, "_") // espacios/paréntesis -> _
    .replace(/_+/g, "_")
    .toLowerCase();

const CreateMunicipio = MunicipioFormSchema.omit({ id: true });

export async function createMunicipio(formData: FormData) {
  const {
    nombre,
    direccion,
    provincia,
    ciudad,
    autoridad_constatacion,
    email,
  } = CreateMunicipio.parse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
    ciudad: formData.get("ciudad"),
    provincia: formData.get("provincia"),
    autoridad_constatacion: formData.get("autoridad_constatacion"),
    email: formData.get("email"),
  });

  const logo = formData.get("logo") as File | null;
  const firma = formData.get("firma") as File | null;

  if (logo && logo.size > 5_000_000) throw new Error("Logo demasiado grande");
  if (firma && firma.size > 5_000_000)
    throw new Error("Firma demasiado grande");

  const folderName = sanitize(String(formData.get("nombre") ?? "municipio"));
  const uploadDir = path.join(process.cwd(), "uploads", folderName);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let logoUrl = "";
  let firmaUrl = "";

  if (logo && logo.size > 0) {
    const ext = path.extname(logo.name).toLowerCase();
    const fileName = `${folderName}-logo${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await logo.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    // guardamos ESTO en BD:
    logoUrl = `/uploads/${folderName}/${fileName}`;
  }

  if (firma && firma.size > 0) {
    const ext = path.extname(firma.name).toLowerCase();
    const fileName = `${folderName}-firma${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await firma.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    firmaUrl = `/uploads/${folderName}/${fileName}`;
  }

  try {
    await prisma.municipio.create({
      data: {
        nombre: nombre,
        provincia: provincia,
        ciudad: ciudad,
        direccion: direccion,
        autoridad_constatacion: autoridad_constatacion,
        email: email,
        logoUrl,
        firmaUrl,
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
  const {
    nombre,
    direccion,
    provincia,
    ciudad,
    autoridad_constatacion,
    email,
  } = UpdateMunicipio.parse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
    ciudad: formData.get("ciudad"),
    provincia: formData.get("provincia"),
    autoridad_constatacion: formData.get("autoridad_constatacion"),
    email: formData.get("email"),
  });

  const municipioActual = await prisma.municipio.findUnique({ where: { id } });
  if (!municipioActual) {
    throw new Error("Municipio no encontrado");
  }
  const logo = formData.get("logo") as File | null;
  const firma = formData.get("firma") as File | null;

  if (logo && logo.size > 5_000_000)
    throw new Error("El logo es demasiado grande");
  if (firma && firma.size > 5_000_000)
    throw new Error("La firma es demasiado grande");

  const folderName = nombre.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const uploadDir = path.join(process.cwd(), "public/uploads", folderName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let logoUrl = municipioActual.logoUrl || "";
  let firmaUrl = municipioActual.firmaUrl || "";

  if (logo && logo.size > 0) {
    const ext = path.extname(logo.name).toLowerCase();
    const fileName = `${folderName}-logo${ext}`;
    const logoPath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await logo.arrayBuffer());
    fs.writeFileSync(logoPath, buffer);
    logoUrl = `/uploads/${folderName}/${logo.name}`;
  }

  if (firma && firma.size > 0) {
    const ext = path.extname(firma.name).toLowerCase();
    const fileName = `${folderName}-firma${ext}`;
    const firmaPath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await firma.arrayBuffer());
    fs.writeFileSync(firmaPath, buffer);
    firmaUrl = `/uploads/${folderName}/${firma.name}`;
  }

  try {
    await prisma.municipio.update({
      where: { id },
      data: {
        nombre: nombre,
        provincia: provincia,
        ciudad: ciudad,
        direccion: direccion,
        autoridad_constatacion: autoridad_constatacion,
        email: email,
        logoUrl,
        firmaUrl,
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
