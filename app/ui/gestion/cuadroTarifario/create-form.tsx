import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createCuadroTarifario } from "@/app/lib/actions";

export default function Form() {
  return (
    <form action={createCuadroTarifario}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Velocidad Desde */}
        <div className="mb-4">
          <label
            htmlFor="velocidad_desde"
            className="mb-2 block text-sm font-medium"
          >
            Velocidad Desde
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="velocidad_desde"
                name="velocidad_desde"
                type="number"
                placeholder="Ingrese la velocidad desde"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Velocidad Hasta */}
        <div className="mb-4">
          <label
            htmlFor="velocidad_hasta"
            className="mb-2 block text-sm font-medium"
          >
            Velocidad Hasta
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="velocidad_hasta"
                name="velocidad_hasta"
                type="number"
                placeholder="Ingrese la velocidad hasta"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Gasto Administrativo */}
        <div className="mb-4">
          <label
            htmlFor="gasto_administrativo"
            className="mb-2 block text-sm font-medium"
          >
            Gasto Administrativo
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="gasto_administrativo"
                name="gasto_administrativo"
                type="number"
                step="0.01"
                placeholder="Ingrese el gasto administrativo"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Primer Vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="primer_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Primer Vencimiento
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="primer_vencimiento"
                name="primer_vencimiento"
                type="date"
                placeholder="Ingrese el primer vencimiento"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Valor 1er vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="valor_1er_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Valor primer vencimiento ($)
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="valor_1er_vencimiento"
              name="valor_1er_vencimiento"
              type="number"
              step="0.01"
              placeholder="Ej: 133200.00"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Segundo Vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="segundo_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Segundo vencimiento
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="segundo_vencimiento"
              name="segundo_vencimiento"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Valor 2do vencimiento */}
        <div className="mb-4">
          <label
            htmlFor="valor_2do_vencimiento"
            className="mb-2 block text-sm font-medium"
          >
            Valor segundo vencimiento ($)
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="valor_2do_vencimiento"
              name="valor_2do_vencimiento"
              type="number"
              step="0.01"
              placeholder="Ej: 150000.00"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/gestion/cuadroTarifario"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Crear Cuadro Tarifario</Button>
      </div>
    </form>
  );
}
