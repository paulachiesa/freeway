"use client";

import { municipio as MunicipioType } from "@/generated/prisma";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateMunicipio } from "@/app/lib/actions";

export default function EditMunicipioForm({
  municipio,
}: {
  municipio: MunicipioType;
}) {
  const updateMunicipioWithId = updateMunicipio.bind(null, municipio.id);

  return (
    <form action={updateMunicipioWithId} encType="multipart/form-data">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            defaultValue={municipio.nombre}
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Provincia */}
        <div className="mb-4">
          <label htmlFor="provincia" className="mb-2 block text-sm font-medium">
            Provincia
          </label>
          <input
            id="provincia"
            name="provincia"
            type="text"
            defaultValue={municipio.provincia || ""}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Ciudad */}
        <div className="mb-4">
          <label htmlFor="ciudad" className="mb-2 block text-sm font-medium">
            Ciudad
          </label>
          <input
            id="ciudad"
            name="ciudad"
            type="text"
            defaultValue={municipio.ciudad || ""}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Dirección */}
        <div className="mb-4">
          <label htmlFor="direccion" className="mb-2 block text-sm font-medium">
            Dirección
          </label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            defaultValue={municipio.direccion || ""}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Logo */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Logo</label>
          {municipio.logoUrl && (
            <img
              src={municipio.logoUrl}
              alt="Logo actual"
              className="h-16 mb-2"
            />
          )}
          <input name="logo" type="file" accept="image/*" />
        </div>

        {/* Firma */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Firma</label>
          {municipio.firmaUrl && (
            <img
              src={municipio.firmaUrl}
              alt="Firma actual"
              className="h-16 mb-2"
            />
          )}
          <input name="firma" type="file" accept="image/*" />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/gestion/municipios"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  );
}
