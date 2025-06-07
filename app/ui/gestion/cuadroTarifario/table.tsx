import {
  UpdateCuadroTarifario,
  DeleteCuadroTarifario,
} from "@/app/ui/gestion/cuadroTarifario/buttons";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredCuadrosTarifarios } from "@/app/lib/data/cuadro-tarifario.data";

export default async function CuadroTarifarioTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const cuadros = await fetchFilteredCuadrosTarifarios(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Vista Mobile */}
          <div className="md:hidden">
            {cuadros?.map((cuadro) => (
              <div
                key={cuadro.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex justify-between border-b pb-2">
                  <div>
                    <p className="text-sm text-gray-600">Rango velocidad</p>
                    <p className="text-base font-medium">
                      {cuadro.velocidad_desde} - {cuadro.velocidad_hasta} km/h
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <UpdateCuadroTarifario id={cuadro.id} />
                    <DeleteCuadroTarifario id={cuadro.id} />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    Gasto administrativo:{" "}
                    {formatCurrency(
                      cuadro.gasto_administrativo?.toNumber() ?? 0
                    )}
                  </p>
                  <p>
                    1er venc:{" "}
                    {cuadro.primer_vencimiento
                      ? formatDateToLocal(
                          cuadro.primer_vencimiento.toISOString()
                        )
                      : "-"}
                  </p>
                  <p>
                    Valor 1er venc:{" "}
                    {formatCurrency(
                      cuadro.valor_1er_vencimiento?.toNumber() ?? 0
                    )}
                  </p>
                  <p>
                    2do venc:{" "}
                    {cuadro.segundo_vencimiento
                      ? formatDateToLocal(
                          cuadro.segundo_vencimiento.toISOString()
                        )
                      : "-"}
                  </p>
                  <p>
                    Valor 2do venc:{" "}
                    {formatCurrency(
                      cuadro.valor_2do_vencimiento?.toNumber() ?? 0
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Vista Desktop */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">
                  Velocidad desde
                </th>
                <th className="px-3 py-5 font-medium">Velocidad hasta</th>
                <th className="px-3 py-5 font-medium">Gasto adm.</th>
                <th className="px-3 py-5 font-medium">1er vencimiento</th>
                <th className="px-3 py-5 font-medium">Valor 1er venc.</th>
                <th className="px-3 py-5 font-medium">2do vencimiento</th>
                <th className="px-3 py-5 font-medium">Valor 2do venc.</th>
                <th className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cuadros?.map((cuadro) => (
                <tr
                  key={cuadro.id}
                  className="border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {cuadro.velocidad_desde}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cuadro.velocidad_hasta}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(
                      cuadro.gasto_administrativo?.toNumber() ?? 0
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cuadro.primer_vencimiento
                      ? formatDateToLocal(
                          cuadro.primer_vencimiento.toISOString()
                        )
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(
                      cuadro.valor_1er_vencimiento?.toNumber() ?? 0
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {cuadro.segundo_vencimiento
                      ? formatDateToLocal(
                          cuadro.segundo_vencimiento.toISOString()
                        )
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(
                      cuadro.valor_2do_vencimiento?.toNumber() ?? 0
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCuadroTarifario id={cuadro.id} />
                      <DeleteCuadroTarifario id={cuadro.id} />
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
