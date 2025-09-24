import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { renderToString } from "react-dom/server";
import ActaTemplate from "@/app/ui/infracciones/acta-template";
import { getLoteConInfracciones } from "@/app/lib/data/lote.data";
import React from "react";

export async function GET(
  req: Request,
  { params }: { params: { loteId: string } }
) {
  const loteId = Number(params.loteId);

  // 1. Buscar infracciones del lote en tu DB
  const lote = await getLoteConInfracciones(loteId);
  if (!lote) {
    return NextResponse.json({ error: "Lote no encontrado" }, { status: 404 });
  }

  // 2. Crear carpeta temporal
  const tmpDir = path.join(process.cwd(), "tmp", `lote-${loteId}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  // 3. Inicializar Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 4. Generar un PDF por infracción
  for (const infraccion of lote.infracciones) {
    const html = renderToString(
      React.createElement(ActaTemplate, {
        infraccion,
        municipio: lote.municipio,
        radar: lote.radar,
      })
    );

    await page.setContent(html, { waitUntil: "networkidle0" });

    const filePath = path.join(tmpDir, `infraccion-${infraccion.id}.pdf`);
    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
    });
  }

  await browser.close();

  // 5. Crear ZIP con todos los PDFs
  const zipPath = path.join(tmpDir, `lote-${loteId}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);

  for (const infraccion of lote.infracciones) {
    const filePath = path.join(tmpDir, `infraccion-${infraccion.id}.pdf`);
    archive.file(filePath, { name: `infraccion-${infraccion.id}.pdf` });
  }

  await archive.finalize();

  // 6. Devolver ZIP como respuesta
  const buffer = fs.readFileSync(zipPath);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="lote-${loteId}.zip"`,
    },
  });
}
