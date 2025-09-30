/*
  Warnings:

  - Added the required column `numero_acta` to the `acta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."acta" ADD COLUMN     "numero_acta" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."municipio" ADD COLUMN     "email" VARCHAR(100);
