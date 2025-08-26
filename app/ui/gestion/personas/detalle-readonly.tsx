// app/ui/gestion/personas/PersonaDetailDialog.tsx
"use client";

import { useEffect, useState } from "react";
import Modal from "@/app/ui/components/Modal/modal";

type Tel = { numero: string | null; es_whatsapp: boolean | null };
type Veh = {
  dominio: string | null;
  porcentaje_titularidad: string | null;
  procedencia: string | null;
  fecha_tramite: string | null; // ISO string
  fecha_compra: string | null; // ISO string
  marca: string | null;
  modelo: string | null;
  tipo: string | null;
};

type PersonaDetalle = {
  id: number;
  nombre_completo: string | null;
  nombre: string | null;
  apellido: string | null;
  dni: string | null;
  tipo_dni: string | null;
  genero: string | null;
  nacionalidad: string | null;
  fecha_nacimiento: string | null;
  fecha_fallecimiento: string | null;
  cuil_cuit: string | null;
  email: string | null;
  email1: string | null;
  email2: string | null;
  adicionalespersona?: { nroitem: string | null } | null;
  domicilio: Array<{
    direccion: string | null;
    codigo_postal: string | null;
    codigo_postal_argentino: string | null;
    localidad: string | null;
    partido: string | null;
    provincia: string | null;
  }>;
  telefonopersona: Array<{
    numero: string | null;
    es_whatsapp: boolean | null;
  }>;
  vehiculo: Veh[];
};

function ReadOnly({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
        {value ?? "-"}
      </div>
    </div>
  );
}

export default function PersonaDetalle({
  personaId,
  open,
  onClose,
}: {
  personaId: number | null;
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PersonaDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !personaId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/persona/${personaId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.persona);
        else setError(res.error || "Error");
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false));
  }, [open, personaId]);

  const dom = data?.domicilio?.[0];

  const tels: Tel[] = data?.telefonopersona ?? [];
  const vehs: Veh[] = data?.vehiculo ?? [];

  return (
    <Modal isOpen={open} onClose={onClose} title="Detalle de Persona">
      {loading && (
        <div className="py-6 text-center text-sm text-gray-600">
          Cargando...
        </div>
      )}
      {error && (
        <div className="py-6 text-center text-sm text-red-600">{error}</div>
      )}
      {!loading && !error && data && (
        <div className="flex flex-col gap-6">
          {/* Datos principales */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ReadOnly
              label="Nombre completo"
              value={
                data.nombre_completo ??
                (`${data.nombre ?? ""} ${data.apellido ?? ""}`.trim() || null)
              }
            />
            <ReadOnly label="CUIL/CUIT" value={data.cuil_cuit} />
            <ReadOnly label="DNI" value={data.dni} />
            <ReadOnly label="Tipo DNI" value={data.tipo_dni} />
            <ReadOnly label="Género" value={data.genero} />
            <ReadOnly label="Nacionalidad" value={data.nacionalidad} />
            <ReadOnly label="Fec. Nac." value={data.fecha_nacimiento} />
            <ReadOnly label="Fec. Fallec." value={data.fecha_fallecimiento} />
            <ReadOnly
              label="Nro Item"
              value={data.adicionalespersona?.nroitem ?? null}
            />
          </div>

          {/* Domicilio */}
          <h4 className="text-sm font-semibold text-gray-700">Domicilio</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ReadOnly label="Dirección" value={dom?.direccion ?? null} />
            <ReadOnly label="CP" value={dom?.codigo_postal ?? null} />
            <ReadOnly
              label="CPA"
              value={dom?.codigo_postal_argentino ?? null}
            />
            <ReadOnly label="Localidad" value={dom?.localidad ?? null} />
            <ReadOnly label="Partido" value={dom?.partido ?? null} />
            <ReadOnly label="Provincia" value={dom?.provincia ?? null} />
          </div>

          {/* Teléfonos (hasta 5) */}
          <h4 className="text-sm font-semibold text-gray-700">Teléfonos</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <ReadOnly
                key={idx}
                label={`Celular ${idx + 1}${
                  tels[idx]?.es_whatsapp ? " (WhatsApp)" : ""
                }`}
                value={tels[idx]?.numero ?? null}
              />
            ))}
          </div>

          {/* Emails */}
          <h4 className="text-sm font-semibold text-gray-700">Emails</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ReadOnly label="Email" value={data.email} />
            <ReadOnly label="Email 2" value={data.email1} />
            <ReadOnly label="Email 3" value={data.email2} />
          </div>

          {/* Vehículos (lista breve) */}
          <h4 className="text-sm font-semibold text-gray-700">Vehículos</h4>
          <div className="space-y-3">
            {vehs.length === 0 && (
              <div className="text-sm text-gray-500">Sin vehículos</div>
            )}
            {vehs.map((v, i) => (
              <div key={i} className="rounded-lg border bg-gray-50 p-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <ReadOnly label="Dominio" value={v.dominio} />
                  <ReadOnly
                    label="% Titularidad"
                    value={v.porcentaje_titularidad?.toString() ?? null}
                  />
                  <ReadOnly label="Procedencia" value={v.procedencia} />
                  <ReadOnly label="Fecha de Trámite" value={v.fecha_tramite} />
                  <ReadOnly label="Fecha de Compra" value={v.fecha_compra} />
                  <ReadOnly label="Marca" value={v.marca} />
                  <ReadOnly label="Modelo" value={v.modelo} />
                  <ReadOnly label="Tipo" value={v.tipo} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
