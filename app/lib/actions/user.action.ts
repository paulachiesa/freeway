"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BaseUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre es obligatorio"),
  username: z.string().min(3, "El usuario es obligatorio"),
  email: z.string().optional().nullable(),
  password: z.string().optional(),
  roleId: z.string().min(1, "Debe seleccionar un rol"),
});

const CreateUser = BaseUserSchema.extend({
  password: z.string().min(4, "Debe ingresar una contraseña"),
});

const UpdateUser = BaseUserSchema.extend({
  password: z.string().optional(),
});

export async function createUser(formData: FormData) {
  const { name, username, email, password, roleId } = CreateUser.parse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    roleId: formData.get("roleId"),
  });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al crear usuario.");
  }

  revalidatePath("/dashboard/usuarios");
  redirect("/dashboard/usuarios");
}

export async function updateUser(id: string, formData: FormData) {
  const { name, username, email, password, roleId } = UpdateUser.parse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    roleId: formData.get("roleId"),
  });

  const userActual = await prisma.user.findUnique({
    where: { id },
    include: { roles: true },
  });

  if (!userActual) {
    throw new Error("Usuario no encontrado");
  }

  try {
    const dataToUpdate: any = { name, username, email };

    if (password && password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    if (roleId) {
      await prisma.userRole.deleteMany({ where: { userId: id } });
      await prisma.userRole.create({
        data: { userId: id, roleId },
      });
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al editar usuario.");
  }

  revalidatePath("/dashboard/usuarios");
  redirect("/dashboard/usuarios");
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/dashboard/usuarios");
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Error al eliminar usuario.");
  }
}
