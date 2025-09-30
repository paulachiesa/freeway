import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { join, normalize } from "path";

export const dynamic = "force-dynamic";

function contentType(file: string) {
  const ext = file.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const rel = params.path.join("/");
    const safeRel = normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");

    const filePath = join(process.cwd(), "uploads", safeRel);

    const file = await readFile(filePath);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType(filePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
