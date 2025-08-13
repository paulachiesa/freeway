-- CreateTable
CREATE TABLE "acta" (
    "id" SERIAL NOT NULL,
    "infraccion_id" INTEGER,
    "cuadro_tarifario_id" INTEGER,
    "fecha_emision" DATE,

    CONSTRAINT "acta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adicionalespersona" (
    "id" SERIAL NOT NULL,
    "persona_id" INTEGER,
    "nroitem" VARCHAR(50),

    CONSTRAINT "adicionalespersona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bcrapersona" (
    "id" SERIAL NOT NULL,
    "persona_id" INTEGER,
    "score" INTEGER,
    "situacion1_desde" DATE,
    "cantidad_entidades" INTEGER,
    "deuda_tomada" DECIMAL,
    "deuda_mora" DECIMAL,
    "deuda_ultimos_24meses" DECIMAL,

    CONSTRAINT "bcrapersona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bcrariesgo" (
    "id" SERIAL NOT NULL,
    "bcra_persona_id" INTEGER,
    "tipo_riesgo" VARCHAR(20),
    "cantidad_entidades" INTEGER,
    "deuda_tomada" DECIMAL,

    CONSTRAINT "bcrariesgo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chequesrechazados" (
    "id" SERIAL NOT NULL,
    "persona_id" INTEGER,
    "periodo" VARCHAR(10),
    "cantidad_rechazados" INTEGER,
    "monto_rechazado" DECIMAL,
    "cheques_levantados" INTEGER,
    "monto_levantados" DECIMAL,

    CONSTRAINT "chequesrechazados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuadrotarifario" (
    "id" SERIAL NOT NULL,
    "velocidad_desde" INTEGER NOT NULL,
    "velocidad_hasta" INTEGER NOT NULL,
    "gasto_administrativo" DECIMAL(10,2),
    "valor_1er_vencimiento" DECIMAL(10,2),
    "valor_2do_vencimiento" DECIMAL(10,2),

    CONSTRAINT "cuadrotarifario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribucioncomportamiento" (
    "id" SERIAL NOT NULL,
    "bcra_persona_id" INTEGER,
    "situacion1" INTEGER,
    "situacion2" INTEGER,
    "situacion3" INTEGER,
    "situacion4" INTEGER,
    "situacion5" INTEGER,

    CONSTRAINT "distribucioncomportamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domicilio" (
    "id" SERIAL NOT NULL,
    "persona_id" INTEGER,
    "tipo" VARCHAR(20),
    "direccion" TEXT,
    "codigo_postal" VARCHAR(10),
    "codigo_postal_argentino" VARCHAR(10),
    "localidad" VARCHAR(100),
    "partido" VARCHAR(100),
    "provincia" VARCHAR(100),
    "fecha_desde" DATE,
    "fecha_hasta" DATE,

    CONSTRAINT "domicilio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entidadopera" (
    "id" SERIAL NOT NULL,
    "bcra_persona_id" INTEGER,
    "cod_entidad" VARCHAR(20),
    "descripcion" TEXT,
    "deuda_tomada" DECIMAL,

    CONSTRAINT "entidadopera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infraccion" (
    "id" SERIAL NOT NULL,
    "fecha" DATE,
    "radar_id" INTEGER NOT NULL,
    "lote_id" INTEGER NOT NULL,
    "vehiculo_id" INTEGER,
    "nombre_archivo" VARCHAR(255),
    "velocidad_maxima" INTEGER,
    "velocidad_medida" INTEGER,
    "imagen_url" TEXT,
    "dominio" VARCHAR(50),
    "hora" VARCHAR(8),

    CONSTRAINT "infraccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intimacion" (
    "id" SERIAL NOT NULL,
    "persona_id" INTEGER,
    "fecha" DATE,
    "descripcion" TEXT,

    CONSTRAINT "intimacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lote" (
    "id" SERIAL NOT NULL,
    "municipio_id" INTEGER NOT NULL,
    "descripcion" TEXT,
    "numero" INTEGER,
    "fecha_desde" DATE,
    "fecha_hasta" DATE,
    "estado" VARCHAR(100),
    "radar_id" INTEGER,
    "directorio" TEXT,

    CONSTRAINT "lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipio" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "provincia" VARCHAR(100),
    "ciudad" VARCHAR(100),
    "direccion" TEXT,
    "firmaUrl" VARCHAR(255),
    "logoUrl" VARCHAR(255),

    CONSTRAINT "municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "acta_id" INTEGER,
    "fecha_pago" DATE,
    "monto" DECIMAL(10,2),

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "apellido" VARCHAR(100),
    "nombre_completo" VARCHAR(100),
    "dni" VARCHAR(20),
    "tipo_dni" VARCHAR(20),
    "genero" VARCHAR(20),
    "nacionalidad" VARCHAR(50),
    "fecha_nacimiento" DATE,
    "fecha_fallecimiento" DATE,
    "cuil_cuit" BIGINT,
    "email" VARCHAR(100),
    "email1" VARCHAR(100),
    "email2" VARCHAR(100),

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radar" (
    "id" SERIAL NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "nro_serie" TEXT,
    "disp_autorizante" TEXT,

    CONSTRAINT "radar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radarmunicipio" (
    "id" SERIAL NOT NULL,
    "radar_id" INTEGER,
    "municipio_id" INTEGER,
    "fecha_asignacion" DATE,
    "fecha_fin" DATE,

    CONSTRAINT "radarmunicipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telefonopersona" (
    "id" SERIAL NOT NULL,
    "persona_id" INTEGER,
    "numero" VARCHAR(20),
    "es_whatsapp" BOOLEAN,
    "orden" SMALLINT,

    CONSTRAINT "telefonopersona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculo" (
    "id" SERIAL NOT NULL,
    "dominio" VARCHAR(20) NOT NULL,
    "marca" VARCHAR(50),
    "modelo" VARCHAR(50),
    "anio" INTEGER,
    "persona_id" INTEGER,
    "fecha_compra" DATE,
    "fecha_tramite" DATE,
    "porcentaje_titularidad" DECIMAL,
    "procedencia" VARCHAR(50),
    "tipo" VARCHAR(50),

    CONSTRAINT "vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adicionalespersona_persona_id_key" ON "adicionalespersona"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "bcrapersona_persona_id_key" ON "bcrapersona"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "persona_cuil_cuit_key" ON "persona"("cuil_cuit");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculo_dominio_key" ON "vehiculo"("dominio");

-- AddForeignKey
ALTER TABLE "acta" ADD CONSTRAINT "acta_cuadro_tarifario_id_fkey" FOREIGN KEY ("cuadro_tarifario_id") REFERENCES "cuadrotarifario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "acta" ADD CONSTRAINT "acta_infraccion_id_fkey" FOREIGN KEY ("infraccion_id") REFERENCES "infraccion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "adicionalespersona" ADD CONSTRAINT "adicionalespersona_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bcrapersona" ADD CONSTRAINT "bcrapersona_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bcrariesgo" ADD CONSTRAINT "bcrariesgo_bcra_persona_id_fkey" FOREIGN KEY ("bcra_persona_id") REFERENCES "bcrapersona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chequesrechazados" ADD CONSTRAINT "chequesrechazados_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "distribucioncomportamiento" ADD CONSTRAINT "distribucioncomportamiento_bcra_persona_id_fkey" FOREIGN KEY ("bcra_persona_id") REFERENCES "bcrapersona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "domicilio" ADD CONSTRAINT "domicilio_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entidadopera" ADD CONSTRAINT "entidadopera_bcra_persona_id_fkey" FOREIGN KEY ("bcra_persona_id") REFERENCES "bcrapersona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "infraccion" ADD CONSTRAINT "infraccion_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "infraccion" ADD CONSTRAINT "infraccion_radar_id_fkey" FOREIGN KEY ("radar_id") REFERENCES "radar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "infraccion" ADD CONSTRAINT "infraccion_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intimacion" ADD CONSTRAINT "intimacion_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lote" ADD CONSTRAINT "lote_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "municipio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lote" ADD CONSTRAINT "lote_radar_id_fkey" FOREIGN KEY ("radar_id") REFERENCES "radar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_acta_id_fkey" FOREIGN KEY ("acta_id") REFERENCES "acta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "radarmunicipio" ADD CONSTRAINT "radarmunicipio_municipio_id_fkey" FOREIGN KEY ("municipio_id") REFERENCES "municipio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "radarmunicipio" ADD CONSTRAINT "radarmunicipio_radar_id_fkey" FOREIGN KEY ("radar_id") REFERENCES "radar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "telefonopersona" ADD CONSTRAINT "telefonopersona_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehiculo" ADD CONSTRAINT "vehiculo_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "persona"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
