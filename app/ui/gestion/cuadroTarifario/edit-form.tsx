"use client";

import { cuadrotarifario } from "@/generated/prisma";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateCuadroTarifario } from "@/app/lib/actions";

export default function EditCuadroTarifarioForm({
  cuadroTarifario,
}: {
  cuadroTarifario: {
    id: number;
    velocidad_desde: number;
    velocidad_hasta: number;
    gasto_administrativo: number | null;
    primer_vencimiento: string | null;
    valor_1er_vencimiento: number | null;
    segundo_vencimiento: string | null;
    valor_2do_vencimiento: number | null;
  };
}) {
  const updateCuadroTarifarioWithId = updateCuadroTarifario.bind(
    null,
    cuadroTarifario.id
  );

  return (
    <form action={updateCuadroTarifarioWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Velocidad desde */}
        <div className="mb-4">
          <label
            htmlFor="velocidad_desde"
            className="mb-2 block text-sm font-medium"
          >
            Velocidad desde
          </label>
          <input
            id="velocidad_desde"
            name="velocidad_desde"
            type="number"
            defaultValue={cuadroTarifario.velocidad_desde}
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Velocidad hasta */}
        <div className="mb-4">
          <label
            htmlFor="velocidad_hasta"
            className="mb-2 block text-sm font-medium"
          >
            Velocidad hasta
          </label>
          <input
            id="velocidad_hasta"
            name="velocidad_hasta"
            type="number"
            defaultValue={cuadroTarifario.velocidad_hasta}
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Gasto administrativo */}
        <div className="mb-4">
          <label
            htmlFor="gasto_administrativo"
            className="mb-2 block text-sm font-medium"
          >
            Gasto administrativo ($)
          </label>
          <input
            id="gasto_administrativo"
            name="gasto_administrativo"
            type="number"
            step="0.01"
            defaultValue={
              cuadroTarifario.gasto_administrativo?.toString() || ""
            }
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Primer vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="primer_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Primer vencimiento
          </label>
          <input
            id="primer_vencimiento"
            name="primer_vencimiento"
            type="date"
            defaultValue={cuadroTarifario.primer_vencimiento ?? ""}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Valor 1er vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="valor_1er_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Valor primer vencimiento ($)
          </label>
          <input
            id="valor_1er_vencimiento"
            name="valor_1er_vencimiento"
            type="number"
            step="0.01"
            defaultValue={
              cuadroTarifario.valor_1er_vencimiento?.toString() || ""
            }
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Segundo vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="segundo_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Segundo vencimiento
          </label>
          <input
            id="segundo_vencimiento"
            name="segundo_vencimiento"
            type="date"
            defaultValue={cuadroTarifario.segundo_vencimiento ?? ""}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Valor 2do vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="valor_2do_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Valor segundo vencimiento ($)
          </label>
          <input
            id="valor_2do_vencimiento"
            name="valor_2do_vencimiento"
            type="number"
            step="0.01"
            defaultValue={
              cuadroTarifario.valor_2do_vencimiento?.toString() || ""
            }
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/gestion/cuadroTarifario"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  );
}
