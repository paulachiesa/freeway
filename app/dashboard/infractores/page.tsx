"use client";

import { lusitana } from "@/app/ui/fonts";

export default function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>
          Tabla Infractores
        </h1>
      </div>
      <p>
        filtros: dni, dominio.
        <br></br>aca muestro tabla con: nro acta, dominio, nombre, cuit, dni.
        <br></br>al hacer click en una fila, mostrar en un modal todos los datos
      </p>
    </div>
  );
}
