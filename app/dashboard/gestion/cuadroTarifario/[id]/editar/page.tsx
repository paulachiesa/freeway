import Form from "@/app/ui/gestion/cuadroTarifario/edit-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";
import { fetchCuadroTarifarioById } from "@/app/lib/data/cuadro-tarifario.data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const cuadroTarifario = await fetchCuadroTarifarioById(Number(id));

  if (!cuadroTarifario) {
    return (
      <div className="p-4 text-red-500">Cuadro tarifario no encontrado</div>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Cuadros Tarifarios",
            href: "/dashboard/gestion/cuadroTarifario",
          },
          {
            label: "Editar Cuadro Tarifario",
            href: `/dashboard/gestion/cuadroTarifario/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form cuadroTarifario={cuadroTarifario} />
    </main>
  );
}
