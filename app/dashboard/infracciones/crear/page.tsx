//aca va carga de infracciones: formulario de alta (ver notas en agenda)
// primero muestro input con municipio seleccionado, luego muestro inputs: nro lote (disabled), desde, hasta, estado, radar: combo, directorio (input file multiple)
//luego muestro tabla infracciones, al seleccionar archvios, cargo los datos.
// muestro jpg

import { lusitana } from "@/app/ui/fonts";
import { MunicipiosTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import Form from "@/app/ui/lotes/create-form";

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>
          Carga de Infracciones
        </h1>
      </div>
      <Form />
    </div>
  );
}
