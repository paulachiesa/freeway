// prisma/seed.js
const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const [adminRole, procesadorRole, userRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin" },
    }),
    prisma.role.upsert({
      where: { name: "procesador" },
      update: {},
      create: { name: "procesador" }
    }),
    prisma.role.upsert({
      where: { name: "usuario" },
      update: {},
      create: { name: "usuario" },
    }),

  ]);

  // Admin
  const adminPass = await bcrypt.hash("Admin1234!", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      name: "Admin",
      password: adminPass,
      roles: { create: [{ roleId: adminRole.id }] },
    },
  });

  // Procesadores
  const procPass1 = await bcrypt.hash("Procesador1!", 10);
  const procPass2 = await bcrypt.hash("Procesador2%", 10);

  const procesador1 = await prisma.user.upsert({
    where: { username: "proc1" },
    update: {},
    create: {
      username: "proc1",
      email: "proc1@example.com",
      name: "Procesador Uno",
      password: procPass1,
      roles: { create: [{ roleId: procesadorRole.id }] },
    },
  });

  const procesador2 = await prisma.user.upsert({
    where: { username: "proc2" },
    update: {},
    create: {
      username: "proc2",
      email: "proc2@example.com",
      name: "Procesador Dos",
      password: procPass2,
      roles: { create: [{ roleId: procesadorRole.id }] },
    },
  });

  console.log({ admin, adminRole, userRole, procesadorRole, procesador1, procesador2 });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
