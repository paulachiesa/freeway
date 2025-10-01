import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createMunicipio } from "@/app/lib/actions";

export default function Form() {
  return (
    <form action={createMunicipio}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Nombre municipio */}
          <div className="mb-4">
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
              Nombre
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ingrese el nombre"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Ciudad */}
          <div className="mb-4">
            <label htmlFor="ciudad" className="mb-2 block text-sm font-medium">
              Ciudad
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="ciudad"
                  name="ciudad"
                  type="text"
                  placeholder="Ingrese la ciudad"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Provincia */}
          <div className="mb-4">
            <label
              htmlFor="provincia"
              className="mb-2 block text-sm font-medium"
            >
              Provincia
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="provincia"
                  name="provincia"
                  type="text"
                  placeholder="Ingrese la provincia"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Dirección */}
          <div className="mb-4">
            <label
              htmlFor="direccion"
              className="mb-2 block text-sm font-medium"
            >
              Dirección
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  placeholder="Ingrese la direccion"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Autoridad de Constatación */}
          <div className="mb-4">
            <label
              htmlFor="autoridad_constatacion"
              className="mb-2 block text-sm font-medium"
            >
              Autoridad Constatación
            </label>
            <input
              id="autoridad_constatacion"
              name="autoridad_constatacion"
              type="text"
              placeholder="Ingrese nombre de la autoridad de constatación"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>

          {/* Email Municipio */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Municipio
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Ingrese el email del municipio"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Firma Aut Constatacion */}
        <div className="mb-4">
          <label htmlFor="firmaAC" className="mb-2 block text-sm font-medium">
            Firma Autoridad Constatación
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input name="firmaAC" type="file" accept="image/*" />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="mb-4">
          <label htmlFor="logo" className="mb-2 block text-sm font-medium">
            Logo
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input name="logo" type="file" accept="image/*" />
            </div>
          </div>
        </div>
        {/* Firma */}
        <div className="mb-4">
          <label htmlFor="firma" className="mb-2 block text-sm font-medium">
            Firma
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input name="firma" type="file" accept="image/*" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/municipios"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Crear Municipio</Button>
      </div>
    </form>
  );
}
