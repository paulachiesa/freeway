import { prisma } from "../prisma";

export async function fetchVehiculoByDominio(dominio: string) {
  try {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { dominio },
    });
    return vehiculo;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch vehiculo.");
  }
}
