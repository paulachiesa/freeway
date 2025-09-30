"use client";

import ActaTemplate from "../ui/infracciones/acta-template";

export default function PreviewActaPage() {
  const inf = {
    id: 8,
    fecha: new Date("2025-02-20T00:00:00.000Z"),
    radar_id: 1,
    lote_id: 1,
    vehiculo_id: 1,
    nombre_archivo: "F20250220080843.txt",
    velocidad_maxima: 60,
    velocidad_medida: 67,
    imagen_url: "/api/uploads/urundel/1/F20250220080843.JPG",
    dominio: "AC108NS",
    hora: "08:08:43",
    radar: {
      id: 1,
      marca: "Radar ultra",
      modelo: "Modelo ultra",
      nro_serie: "4fds6f4s8",
      disp_autorizante: "dispo aut",
    },
    vehiculo: {
      id: 1,
      dominio: "AC108NS",
      marca: "TOYOTA",
      modelo: "COROLLA XEI PACK 1.8 6M/T",
      anio: null,
      persona_id: 1,
      fecha_compra: "19-12-2017",
      fecha_tramite: "25-04-2024",
      porcentaje_titularidad: "100",
      procedencia: "Importado",
      tipo: "SEDAN 4 PUERTAS",
      persona: {
        id: 1,
        nombre: null,
        apellido: null,
        nombre_completo: "PELLICER JAVIER JOSE",
        dni: "22424316",
        tipo_dni: "DNI-EB",
        genero: "M",
        nacionalidad: "ARGENTINA",
        fecha_nacimiento: "20/10/1971",
        fecha_fallecimiento: null,
        cuil_cuit: "20224243163",
        email: "jpellicer113@gmail.com",
        email1: "sixtopellicer@yahoo.com",
        email2: null,
        domicilio: [
          {
            id: 1,
            persona_id: 1,
            tipo: null,
            direccion: "ALVARADO 755",
            codigo_postal: "4530",
            codigo_postal_argentino: "A4449XAT",
            localidad: "SAN RAMON",
            partido: "ANTA",
            provincia: "SALTA",
            fecha_desde: null,
            fecha_hasta: null,
          },
        ],
      },
    },
    acta: {
      id: 22,
      infraccion_id: 8,
      cuadro_tarifario_id: null,
      fecha_emision: "2025-09-30T00:00:00.000Z",
      numero_acta: 8000,
    },
    lote: {
      id: 1,
      municipio_id: 1,
      descripcion: "Lote 1",
      numero: 1,
      fecha_desde: "2025-08-07T00:00:00.000Z",
      fecha_hasta: "2025-08-18T00:00:00.000Z",
      estado: "Proceso de carga completo",
      radar_id: 1,
      directorio: "",
      municipio: {
        id: 1,
        nombre: "Urundel",
        provincia: "Salta",
        ciudad: "Salta",
        direccion: "calle 123",
        firmaUrl:
          "/uploads/urundel/WhatsApp Image 2025-07-29 at 19.20.31 (2).jpeg",
        logoUrl: "/uploads/urundel/WhatsApp Image 2025-07-29 at 19.20.31.jpeg",
        email: null,
        autoridades: [],
      },
      radar: {
        id: 1,
        marca: "Radar ultra",
        modelo: "Modelo ultra",
        nro_serie: "4fds6f4s8",
        disp_autorizante: "dispo aut",
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-lg font-bold mb-4">Vista previa del Acta</h1>
      <div className="border shadow bg-white p-4">
        <ActaTemplate
          infraccion={inf}
          municipio={inf.lote.municipio}
          radar={inf.radar ?? inf.lote.radar}
          numero_acta={inf.acta?.numero_acta ?? 0}
          vehiculo={inf.vehiculo}
        />
      </div>
    </div>
  );
}
