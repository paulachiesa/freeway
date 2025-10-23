import { NextRequest } from "next/server";
import puppeteer from "puppeteer";
import JSZip from "jszip";
import { prisma } from "@/app/lib/prisma";
import { Readable } from "stream";
import { generarDatosPago } from "../../../../lib/epagos";

const INICIALES: Record<string, number> = {
  Calilegua: 52000,
  Urundel: 8000,
  "Apolinario Saravia": 40000,
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const loteId = Number(id);

  const { fecha_vencimiento_1, fecha_vencimiento_2 } = await request.json();

  const lote = await prisma.lote.findUnique({
    where: { id: loteId },
    include: {
      municipio: true,
      radar: true,
      infraccion: {
        include: {
          vehiculo: { include: { persona: { include: { domicilio: true } } } },
          radar: true,
          acta: true,
        },
      },
    },
  });
  if (!lote) return new Response("Lote no encontrado", { status: 404 });

  const municipioNombre = lote.municipio.nombre;
  const inicio = INICIALES[municipioNombre] ?? 1;

  const ultimo = await prisma.acta.findFirst({
    where: { infraccion: { lote: { municipio_id: lote.municipio_id } } },
    orderBy: { numero_acta: "desc" },
  });
  let siguiente = ultimo ? ultimo.numero_acta + 1 : inicio;

  // Base URL: usar .env para produccion
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const browser = await puppeteer.launch({ headless: true });
  const zip = new JSZip();

  try {
    for (const inf of lote.infraccion) {
      //ePagos
      const persona = inf.vehiculo?.persona;

      const personaData = {
        email: persona?.email ?? "",
        dni: persona?.dni ?? "",
        cuit: String(persona?.cuil_cuit ?? ""),
      };

      const { monto1, monto2, pago, gastoAdm, cuadro } = await generarDatosPago(
        {
          municipio: municipioNombre,
          velocidadMedida: Number(inf.velocidad_medida ?? 0),
          persona: personaData,
          fecha_vencimiento_1,
          fecha_vencimiento_2,
        }
      );

      let acta = await prisma.acta.findUnique({
        where: { infraccion_id: inf.id },
      });

      if (acta) {
        acta = await prisma.acta.update({
          where: { infraccion_id: inf.id },
          data: {
            fecha_emision: new Date(),
            fecha_vencimiento_1: new Date(fecha_vencimiento_1),
            fecha_vencimiento_2: new Date(fecha_vencimiento_2),
            cuadro_tarifario_id: cuadro?.id ?? null,
          },
        });
      } else {
        acta = await prisma.acta.create({
          data: {
            numero_acta: siguiente,
            infraccion_id: inf.id,
            fecha_emision: new Date(),
            fecha_vencimiento_1: new Date(fecha_vencimiento_1),
            fecha_vencimiento_2: new Date(fecha_vencimiento_2),
            cuadro_tarifario_id: cuadro?.id ?? null,
          },
        });

        siguiente++;
      }

      const page = await browser.newPage();

      // Abrir la página imprimible que ya renderiza ActaTemplate con datos
      const url = `${baseUrl}/print/acta/${inf.id}`;
      await page.goto(url, { waitUntil: "networkidle0", timeout: 120_000 });

      //nuevo
      await page.evaluate(
        (qr, barras, codigoNumero) => {
          const qrImg = document.querySelector(
            "img[data-type='qr']"
          ) as HTMLImageElement | null;
          if (qrImg) qrImg.src = `data:image/png;base64,${qr}`;

          const barrasImg = document.querySelector(
            "img[data-type='barcode']"
          ) as HTMLImageElement | null;
          if (barrasImg) barrasImg.src = `data:image/png;base64,${barras}`;

          // 🔹 Inyectar el número debajo del código de barras
          const barrasTexto = document.querySelector(
            "[data-type='barcode-number']"
          );
          if (barrasTexto) barrasTexto.textContent = codigoNumero || "";
        },
        pago.qr,
        pago.codigoBarras,
        pago.codigoBarrasNumero
      );
      //
      await page.emulateMediaType("print");

      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
      zip.file(`ACTA_${acta.numero_acta}.pdf`, new Uint8Array(pdfBuffer));

      await page.close();
    }

    // Generar ZIP
    const content = await zip.generateAsync({ type: "nodebuffer" });

    const stream = Readable.from(content);

    return new Response(stream as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=lote-${loteId}-pdfs.zip`,
      },
    });
  } catch (error: any) {
    console.error("Error generando PDFs:", error);
    return new Response(JSON.stringify({ error: error?.message ?? "Error" }), {
      status: 500,
    });
  } finally {
    await browser.close();
  }
}
