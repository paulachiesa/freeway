import Form from "@/app/ui/gestion/cuadroTarifario/create-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Cuadros Tarifarios",
            href: "/dashboard/gestion/cuadroTarifario",
          },
          {
            label: "Crear Cuadro Tarifario",
            href: "/dashboard/gestion/cuadroTarifario/crear",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
