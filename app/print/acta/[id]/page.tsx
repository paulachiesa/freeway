// app/print/acta/[id]/page.tsx
import ActaTemplate from "@/app/ui/infracciones/acta-template";
import { prisma } from "@/app/lib/prisma";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // ✅ se espera params
  const infId = parseInt(id, 10);

  const inf = await prisma.infraccion.findUnique({
    where: { id: infId },
    include: {
      radar: true,
      vehiculo: { include: { persona: { include: { domicilio: true } } } },
      acta: true,
      lote: {
        include: {
          municipio: {
            include: {
              autoridades: true,
            },
          },
          radar: true,
        },
      },
    },
  });

  if (!inf) return <div>No se encontró la infracción</div>;

  const lote = inf.lote;

  console.log(
    "🟡 Datos de la infracción completa:",
    JSON.stringify(
      { inf },
      (key, value) => (typeof value === "bigint" ? value.toString() : value),
      2
    )
  );

  return (
    <div className="bg-white">
      <ActaTemplate
        infraccion={inf}
        municipio={lote.municipio}
        radar={inf.radar ?? lote.radar}
        numero_acta={inf.acta?.numero_acta ?? 0}
        vehiculo={inf.vehiculo}
      />
    </div>
  );
}
