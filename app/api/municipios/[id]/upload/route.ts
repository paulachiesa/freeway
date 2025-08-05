import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const config = {
  api: { bodyParser: false },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const municipioId = Number(params.id);

  const municipio = await prisma.municipio.findUnique({
    where: { id: municipioId },
  });
  if (!municipio) {
    return NextResponse.json(
      { error: "Municipio no encontrado" },
      { status: 404 }
    );
  }

  const folderMunicipio = municipio.nombre
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  const uploadDir = path.join(process.cwd(), "public/uploads", folderMunicipio);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  });

  return new Promise((resolve) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        return resolve(
          NextResponse.json(
            { error: "Error al subir archivos" },
            { status: 500 }
          )
        );
      }

      const logo = (files.logo as formidable.File[])?.[0];
      const firma = (files.firma as formidable.File[])?.[0];

      const updated = await prisma.municipio.update({
        where: { id: municipioId },
        data: {
          logoUrl: logo
            ? `/uploads/${folderMunicipio}/${path.basename(logo.filepath)}`
            : municipio.logoUrl,
          firmaUrl: firma
            ? `/uploads/${folderMunicipio}/${path.basename(firma.filepath)}`
            : municipio.firmaUrl,
        },
      });

      return resolve(NextResponse.json(updated));
    });
  });
}
