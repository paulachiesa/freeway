"use client";

import { radar } from "@/generated/prisma";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateRadar } from "@/app/lib/actions";

export default function EditRadarForm({ radar }: { radar: radar }) {
  const updateRadarWithId = updateRadar.bind(null, radar.id);

  return (
    <form action={updateRadarWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="marca" className="mb-2 block text-sm font-medium">
            Marca
          </label>
          <input
            id="marca"
            name="marca"
            type="text"
            defaultValue={radar.marca || ""}
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="modelo" className="mb-2 block text-sm font-medium">
            Modelo
          </label>
          <input
            id="modelo"
            name="modelo"
            type="text"
            defaultValue={radar.modelo || ""}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ciudad" className="mb-2 block text-sm font-medium">
            Número de Serie
          </label>
          <input
            id="nro_serie"
            name="nro_serie"
            type="text"
            defaultValue={radar.nro_serie || ""}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/gestion/radares"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  );
}
