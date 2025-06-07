import Form from "@/app/ui/gestion/radares/edit-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";
import { fetchRadarById } from "@/app/lib/data/radar.data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const radar = await fetchRadarById(Number(id));

  if (!radar) {
    return <div className="p-4 text-red-500">Radar no encontrado</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Radares", href: "/dashboard/gestion/radares" },
          {
            label: "Editar Radar",
            href: `/dashboard/gestion/radares/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form radar={radar} />
    </main>
  );
}
