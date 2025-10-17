// app/lib/data/user.data.ts

import { prisma } from "../prisma";
import { User } from "@prisma/client";

const ITEMS_PER_PAGE = 5;

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener usuario.");
  }
}

export async function fetchFilteredUsers(
  query: string,
  currentPage: number
): Promise<
  (User & {
    roleName?: string;
  })[]
> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        {
          roles: {
            some: {
              role: {
                name: { contains: query, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    include: {
      roles: { include: { role: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: ITEMS_PER_PAGE,
  });

  // 🔹 Simplificamos a un solo rol string
  return users.map((u) => ({
    ...u,
    roleName: u.roles?.[0]?.role?.name ?? "",
  }));
}

export async function fetchUsersPages(query: string): Promise<number> {
  try {
    const totalCount = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          {
            roles: {
              some: {
                role: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            },
          },
        ],
      },
    });
    return Math.ceil(totalCount / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener número total de usuarios.");
  }
}
