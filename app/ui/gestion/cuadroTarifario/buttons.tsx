import { deleteCuadroTarifario } from "@/app/lib/actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateCuadroTarifario() {
  return (
    <Link
      href="/dashboard/gestion/cuadroTarifario/crear"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Crear Cuadro Tarifario</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCuadroTarifario({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/gestion/cuadroTarifario/${id}/editar`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCuadroTarifario({ id }: { id: number }) {
  const deleteCuadroTarifarioWithID = deleteCuadroTarifario.bind(null, id);
  return (
    <form action={deleteCuadroTarifarioWithID}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Eliminar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
