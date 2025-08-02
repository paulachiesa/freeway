import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { fetchFilteredLotes } from "@/app/lib/data/lote.data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const form = new IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files: any) => {
      if (err) return reject(err);

      const filePath = files.file[0].filepath;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      try {
        for (const row of data as Record<string, any>[]) {
          //   await procesarFila(row);
        }
        resolve(NextResponse.json({ success: true }));
      } catch (error) {
        console.error(error);
        resolve(NextResponse.json({ success: false, error }, { status: 500 }));
      }
    });
  });
}
