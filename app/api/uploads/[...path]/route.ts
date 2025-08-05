import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { join } from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = join(process.cwd(), "uploads", ...params.path);

  try {
    const stat = statSync(filePath);
    const stream = createReadStream(filePath);

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(filePath),
        "Content-Length": stat.size.toString(),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 }
    );
  }
}

function getMimeType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}
