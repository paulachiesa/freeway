import { NextResponse } from "next/server";
import { getRadaresCombo } from "@/app/lib/data/radar.data";

export async function GET() {
  const radares = await getRadaresCombo();
  return NextResponse.json(radares);
}
