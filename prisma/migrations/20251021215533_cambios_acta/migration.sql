-- AlterTable
ALTER TABLE "public"."acta" ADD COLUMN     "codigo_barras_url" VARCHAR(255),
ADD COLUMN     "fecha_vencimiento_1" DATE,
ADD COLUMN     "fecha_vencimiento_2" DATE,
ADD COLUMN     "qr_imagen_url" VARCHAR(255);
