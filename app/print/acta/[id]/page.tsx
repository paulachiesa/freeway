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
      acta: {
        include: {
          cuadrotarifario: true,
        },
      },
      lote: {
        include: {
          municipio: true,
          radar: true,
        },
      },
    },
  });

  if (!inf) return <div>No se encontró la infracción</div>;

  const lote = inf.lote;

  return (
    <div className="bg-white">
      <ActaTemplate
        infraccion={inf}
        municipio={lote.municipio}
        radar={inf.radar ?? lote.radar}
        numero_acta={inf.acta?.numero_acta ?? 0}
        acta={inf.acta}
        vehiculo={inf.vehiculo}
      />
    </div>
  );
}
