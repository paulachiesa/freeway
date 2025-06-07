import Form from "@/app/ui/gestion/radares/create-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Radares", href: "/dashboard/gestion/radares" },
          {
            label: "Crear Radar",
            href: "/dashboard/gestion/radares/crear",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
