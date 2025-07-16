import { lusitana } from "@/app/ui/fonts";
import Form from "@/app/ui/lotes/create-form";
import { fetchLoteById } from "@/app/lib/data/lote.data";

export default async function EditarPage({
  params,
}: {
  params: { id: string };
}) {
  const lote = await fetchLoteById(Number(params.id));

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>
          Editar Lote #{lote?.numero}
        </h1>
      </div>
      <Form initialLote={lote} />
    </div>
  );
}
