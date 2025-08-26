"use client";

import { useState } from "react";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import PersonaDetalle from "./detalle-readonly";

export default function ButtonDetalle({ personaId }: { personaId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded p-1 text-gray-700 hover:bg-gray-100"
            aria-label="Ver detalle"
            title="Ver detalle"
          >
            <EllipsisHorizontalCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </td>

      <PersonaDetalle
        personaId={personaId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
