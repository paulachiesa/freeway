import Form from "@/app/ui/gestion/municipios/edit-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";
import { getMunicipioById } from "@/app/lib/data/municipio.data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const municipio = await getMunicipioById(Number(id));

  if (!municipio) {
    return <div className="p-4 text-red-500">Municipio no encontrado</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Municipios", href: "/dashboard/gestion/municipios" },
          {
            label: "Editar Municipio",
            href: `/dashboard/gestion/municipios/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form municipio={municipio} />
    </main>
  );
}
