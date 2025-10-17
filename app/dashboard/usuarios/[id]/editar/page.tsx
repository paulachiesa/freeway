import Form from "@/app/ui/usuarios/edit-form";
import Breadcrumbs from "@/app/ui/gestion/breadcrumbs";
import { getUserById } from "@/app/lib/data/user.data";
import { prisma } from "@/app/lib/prisma";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      roles: { include: { role: true } },
    },
  });

  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });

  if (!user) return <p>Usuario no encontrado</p>;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Usuarios", href: "/dashboard/usuarios" },
          {
            label: "Editar Usuario",
            href: `/dashboard/usuarios/${id}/editar`,
            active: true,
          },
        ]}
      />
      <Form user={user} roles={roles} />
    </main>
  );
}
