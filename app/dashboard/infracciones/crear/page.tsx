"use client";

import { lusitana } from "@/app/ui/fonts";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Form from "@/app/ui/lotes/create-form";

export default function Page() {
  const router = useRouter();

  const handleVolverClick = () => {
    router.push("/dashboard/infracciones");
  };
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
          Carga de Infracciones
        </h1>
      </div>
      <Form />
    </div>
  );
}
