import Image from "next/image";
import {
  UpdateMunicipio,
  DeleteMunicipio,
} from "@/app/ui/gestion/municipios/buttons";
import { fetchFilteredMunicipios } from "@/app/lib/data/municipio.data";
import { toImageApiUrl } from "@/app/lib/uploadsMun";

export default async function MunicipiosTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const municipios = await fetchFilteredMunicipios(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {municipios?.map((municipio) => (
              <div
                key={municipio.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{municipio.nombre}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {municipio.direccion}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{municipio.ciudad}</p>
                    <p>{municipio.provincia}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateMunicipio id={municipio.id} />
                    <DeleteMunicipio id={municipio.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Dirección
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ciudad
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Provincia
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Logo
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Firma
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {municipios?.map((municipio) => (
                <tr
                  key={municipio.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{municipio.nombre}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {municipio.direccion}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {municipio.ciudad}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {municipio.provincia}
                  </td>
                  <td className="px-4 py-3">
                    {municipio.logoUrl ? (
                      <Image
                        src={toImageApiUrl(municipio.logoUrl)}
                        alt={`Logo de ${municipio.nombre}`}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {municipio.firmaUrl ? (
                      <Image
                        src={toImageApiUrl(municipio.firmaUrl)}
                        alt={`Firma de ${municipio.nombre}`}
                        width={60}
                        height={30}
                        className="rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateMunicipio id={municipio.id} />
                      <DeleteMunicipio id={municipio.id} />
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
