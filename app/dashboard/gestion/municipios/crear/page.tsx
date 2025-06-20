import Form from "@/app/ui/gestion/municipios/create-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Municipios", href: "/dashboard/gestion/municipios" },
          {
            label: "Crear Municipio",
            href: "/dashboard/gestion/municipios/crear",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
