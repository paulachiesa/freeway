// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const municipio = formData.get("municipio") as string;
  const nroLote = formData.get("nroLote") as string;

  if (!file || !municipio || !nroLote) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const municipioFolder = municipio.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    municipioFolder,
    nroLote
  );

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.name).toLowerCase();
  const baseName = path.basename(file.name, path.extname(file.name));
  const safeFileName = `${baseName}${ext}`;

  const filePath = path.join(uploadDir, safeFileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    filename: file.name,
    url: `/api/uploads/${municipioFolder}/${nroLote}/${safeFileName}`,
  });
}
