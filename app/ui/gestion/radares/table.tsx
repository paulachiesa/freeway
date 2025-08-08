import { UpdateRadar, DeleteRadar } from "@/app/ui/gestion/radares/buttons";
import { fetchFilteredRadares } from "@/app/lib/data/radar.data";

export default async function RadaresTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const radares = await fetchFilteredRadares(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {radares?.map((radar) => (
              <div
                key={radar.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{radar.marca}</p>
                    </div>
                    <p className="text-sm text-gray-500">{radar.modelo}</p>
                    <p className="text-sm text-gray-500">
                      {radar.disp_autorizante}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{radar.nro_serie}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateRadar id={radar.id} />
                    <DeleteRadar id={radar.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Marca
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Modelo
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Número de Serie
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Disposición Autorizante
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {radares?.map((radar) => (
                <tr
                  key={radar.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{radar.marca}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {radar.modelo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {radar.nro_serie}
                  </td>
                  <td className="whitespace-nowrap py-3">
                    {radar.disp_autorizante}
                  </td>
                  <td className="whitespace-nowrap py-3  pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateRadar id={radar.id} />
                      <DeleteRadar id={radar.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
