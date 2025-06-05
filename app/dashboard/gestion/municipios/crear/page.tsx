import Form from "@/app/ui/gestion/create-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";
// import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  //   const customers = await fetchCustomers();

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
