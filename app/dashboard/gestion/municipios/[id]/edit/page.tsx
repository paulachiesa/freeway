import Form from "@/app/ui/gestion/edit-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";
import { fetchMunicipiosById } from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const municipio = await fetchMunicipiosById(Number(id));

  if (!municipio) {
    return <div className="p-4 text-red-500">Municipio no encontrado</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Municipios", href: "/dashboard/gestion/municipios" },
          {
            label: "Crear Municipio",
            href: `/dashboard/gestion/municipios/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form municipio={municipio} />
    </main>
  );
}
