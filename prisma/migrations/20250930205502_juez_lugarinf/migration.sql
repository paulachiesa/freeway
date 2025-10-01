/*
  Warnings:

  - You are about to drop the `autoridadconstatacion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."autoridadconstatacion" DROP CONSTRAINT "autoridadconstatacion_municipioId_fkey";

-- AlterTable
ALTER TABLE "public"."lote" ADD COLUMN     "lugar_infraccion" TEXT;

-- AlterTable
ALTER TABLE "public"."municipio" ADD COLUMN     "autoridad_constatacion" VARCHAR(150),
ADD COLUMN     "firmaACUrl" VARCHAR(255);

-- DropTable
DROP TABLE "public"."autoridadconstatacion";
