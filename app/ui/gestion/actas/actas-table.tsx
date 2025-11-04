import { fetchFilteredActasReportes } from "@/app/lib/data/actas.data";

export default async function ActasTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const actas = await fetchFilteredActasReportes(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {actas?.map((acta, index) => (
              <div key={index} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{acta.nroActa}</p>
                    </div>
                    <p className="text-sm text-gray-500">{acta.dominio}</p>
                    <p className="text-sm text-gray-500">{acta.nombre}</p>
                    <p className="text-sm text-gray-500">{acta.dni}</p>
                    <p className="text-sm text-gray-500">{acta.cuit}</p>
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
              {actas?.map((acta, index) => (
                <tr
                  key={index}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{acta.nroActa ?? "-"}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {acta.dominio ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {acta.nombre ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {acta.dni ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {acta.cuit ?? "-"}
                  </td>
                </tr>
              ))}
              {actas.length === 0 && (
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
