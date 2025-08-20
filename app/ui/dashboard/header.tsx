"use client";

import { useMunicipio } from "@/app/providers/MunicipioProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function Header() {
  // 1) Hooks SIEMPRE al tope y sin condiciones
  const { data: session, status } = useSession();
  const { selected } = useMunicipio();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2) Recién acá podés cortar el render (no cambia el orden de hooks)
  if (status !== "authenticated") return null;

  const username =
    session?.user?.name || (session?.user as any)?.username || "Usuario";

  const goToHome = () => router.push("/dashboard");

  return (
    <header className="w-full bg-white border-b p-4 flex items-center justify-between">
      <div className="cursor-pointer" onClick={goToHome}>
        {isClient ? (
          selected ? (
            <span className="text-gray-700">Municipio: {selected.nombre}</span>
          ) : (
            <span className="text-gray-500 italic">
              Ningún municipio seleccionado
            </span>
          )
        ) : (
          <span className="text-gray-500 italic">&nbsp;</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <UserCircleIcon className="h-5 w-5 shrink-0" />
        <span>{username}</span>
      </div>
    </header>
  );
}
