import Form from "@/app/ui/usuarios/create-form";
import { prisma } from "@/app/lib/prisma";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";

export default async function Page() {
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Usuarios", href: "/dashboard/usuarios" },
          {
            label: "Crear Usuario",
            href: "/dashboard/usuarios/crear",
            active: true,
          },
        ]}
      />
      <Form roles={roles} />
    </main>
  );
}
