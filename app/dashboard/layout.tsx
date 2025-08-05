// app/dashboard/layout.tsx
"use client";

// import { useSearchParams } from "next/navigation";
import { MunicipioProvider } from "@/app/providers/MunicipioProvider";
import SideNav from "@/app/ui/dashboard/sidenav";
import Header from "@/app/ui/dashboard/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const searchParams = useSearchParams();
  // const initialMunicipioId = searchParams.get("municipio") ?? undefined;

  return (
    <MunicipioProvider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-48">
          <SideNav />
        </div>

        <div className="flex flex-col flex-grow">
          <Header />

          <main className="flex-grow p-6 md:overflow-y-auto md:pt-3 md:pb-12 md:px-4">
            {children}
          </main>
        </div>
      </div>
    </MunicipioProvider>
  );
}
