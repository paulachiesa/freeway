/*
  Warnings:

  - A unique constraint covering the columns `[infraccion_id]` on the table `acta` will be added. If there are existing duplicate values, this will fail.
  - Made the column `infraccion_id` on table `acta` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."acta" DROP CONSTRAINT "acta_infraccion_id_fkey";

-- AlterTable
ALTER TABLE "public"."acta" ALTER COLUMN "infraccion_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."municipio" ADD COLUMN     "autoridad_constatacion" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "acta_infraccion_id_key" ON "public"."acta"("infraccion_id");

-- AddForeignKey
ALTER TABLE "public"."acta" ADD CONSTRAINT "acta_infraccion_id_fkey" FOREIGN KEY ("infraccion_id") REFERENCES "public"."infraccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
