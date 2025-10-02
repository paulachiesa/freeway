import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";

type InfraccionData = {
  nombre_archivo: string;
  fecha: string;
  hora: string;
  velocidad_maxima: number;
  velocidad_medida: number;
  dominio: string;
  marca: string;
  modelo: string;
  imagen_url: string;
  vehiculo_id?: number | null;
};

export async function POST(req: NextRequest) {
  try {
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

    // Guardamos el ZIP en buffer y lo procesamos con adm-zip
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);

    // Extraer todos los archivos
    zip.getEntries().forEach((entry) => {
      if (!entry.isDirectory) {
        const fileName = path.basename(entry.entryName);
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, entry.getData());
      }
    });

    // Procesar .txt y buscar su imagen correspondiente
    const files = fs.readdirSync(uploadDir);
    const txtFiles = files.filter((f) => f.toLowerCase().endsWith(".txt"));

    const infracciones: InfraccionData[] = txtFiles.map((txtName) => {
      const txtPath = path.join(uploadDir, txtName);
      const text = fs.readFileSync(txtPath, "utf-8");

      const nombreBase = txtName
        .substring(0, txtName.lastIndexOf("."))
        .toLowerCase();

      const fechaMatch = text.match(/Fecha:(\d{2}\/\d{2}\/\d{4})/);
      const horaMatch = text.match(/(\d{2}h\d{2}min\d{2}s)/);
      const vMaxMatch = text.match(/V\.Max:(\d+)/);
      const velMatch = text.match(/Vel:(\d+)/);

      const jpgFile = files.find((img) => {
        const imgBase = img.substring(0, img.lastIndexOf(".")).toLowerCase();
        return imgBase === nombreBase && /\.(jpg|jpeg)$/i.test(img);
      });

      const imagen_url = jpgFile
        ? `/api/uploads/${municipioFolder}/${nroLote}/${jpgFile}`
        : "";

      return {
        nombre_archivo: txtName,
        fecha: fechaMatch?.[1] ?? "",
        hora: horaMatch?.[1]?.replace(/h|min|s/g, ":").slice(0, -1) ?? "",
        velocidad_maxima: Number(vMaxMatch?.[1] ?? 0),
        velocidad_medida: Number(velMatch?.[1] ?? 0),
        dominio: "",
        marca: "",
        modelo: "",
        imagen_url,
      };
    });

    return NextResponse.json({
      success: true,
      message: "ZIP procesado correctamente",
      infracciones,
    });
  } catch (error: any) {
    console.error("Error al procesar ZIP:", error);
    return NextResponse.json(
      { error: "Error al procesar ZIP", details: error.message },
      { status: 500 }
    );
  }
}
