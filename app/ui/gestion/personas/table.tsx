import { fetchFilteredPersonas } from "@/app/lib/data/infractores.data";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import ButtonDetalle from "./button-detalle";

export default async function PersonasTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const personas = await fetchFilteredPersonas(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {personas?.map((persona) => (
              <div
                key={persona.dni}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{persona.nroActa}</p>
                    </div>
                    <p className="text-sm text-gray-500">{persona.dominio}</p>
                    <p className="text-sm text-gray-500">{persona.nombre}</p>
                    <p className="text-sm text-gray-500">{persona.dni}</p>
                    <p className="text-sm text-gray-500">{persona.cuit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nro. Acta
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Dominio
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Dni
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cuit
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Ver</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {personas?.map((persona) => (
                <tr
                  key={persona.dni}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{persona.nroActa ?? "-"}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {persona.dominio ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {persona.nombre ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {persona.dni ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {persona.cuit ?? "-"}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ButtonDetalle personaId={persona.personaId} />
                    </div>
                  </td>
                </tr>
              ))}
              {personas.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-gray-500"
                    colSpan={5}
                  >
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
