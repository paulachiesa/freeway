import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createRadar } from "@/app/lib/actions";

export default function Form() {
  return (
    <form action={createRadar}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="mb-4">
            <label htmlFor="marca" className="mb-2 block text-sm font-medium">
              Marca
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  placeholder="Ingrese la marca"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="modelo" className="mb-2 block text-sm font-medium">
              Modelo
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="modelo"
                  name="modelo"
                  type="text"
                  placeholder="Ingrese el modelo"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="mb-4">
            <label
              htmlFor="nro_serie"
              className="mb-2 block text-sm font-medium"
            >
              Número de Serie
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="nro_serie"
                  name="nro_serie"
                  type="text"
                  placeholder="Ingrese el número de serie"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="disp_autorizante"
              className="mb-2 block text-sm font-medium"
            >
              Disposición Autorizante
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="disp_autorizante"
                  name="disp_autorizante"
                  type="text"
                  placeholder="Ingrese la disposición autorizante"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/radares"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Crear Radar</Button>
      </div>
    </form>
  );
}
