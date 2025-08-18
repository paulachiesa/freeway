// prisma/seed.js
const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const [adminRole, userRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: { name: "ADMIN" },
    }),
    prisma.role.upsert({
      where: { name: "USER" },
      update: {},
      create: { name: "USER" },
    }),
  ]);

  const email = "admin@example.com";
  const passwordHash = await bcrypt.hash("Admin1234!", 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Admin",
      password: passwordHash,
      roles: {
        create: [{ roleId: adminRole.id }],
      },
    },
  });

  console.log({ admin, adminRole, userRole });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
