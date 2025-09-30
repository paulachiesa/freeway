/*
  Warnings:

  - You are about to drop the column `autoridad_constatacion` on the `municipio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."municipio" DROP COLUMN "autoridad_constatacion";

-- CreateTable
CREATE TABLE "public"."autoridadconstatacion" (
    "id" SERIAL NOT NULL,
    "municipioId" INTEGER NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "firmaUrl" VARCHAR(255),

    CONSTRAINT "autoridadconstatacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."autoridadconstatacion" ADD CONSTRAINT "autoridadconstatacion_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "public"."municipio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
