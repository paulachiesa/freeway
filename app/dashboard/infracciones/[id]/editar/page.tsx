"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import Form from "@/app/ui/lotes/create-form";

export default function EditarPage() {
  const router = useRouter();
  const params = useParams();
  const [lote, setLote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleVolverClick = () => {
    router.push("/dashboard/infracciones");
  };

  useEffect(() => {
    const fetchLote = async () => {
      const res = await fetch(`/api/lotes/${params.id}`);
      const data = await res.json();
      setLote(data);
      setLoading(false);
    };

    fetchLote();
  }, [params.id]);

  if (loading) return <p className="p-4">Cargando lote...</p>;
  if (!lote) return <p className="p-4 text-red-600">Lote no encontrado.</p>;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleVolverClick}
        className="flex items-center text-blue-600 hover:underline mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
      </button>
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>
          Editar Lote #{lote?.numero}
        </h1>
      </div>
      <Form initialLote={lote} />
    </div>
  );
}
