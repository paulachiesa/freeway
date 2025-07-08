import CardWrapper from "@/app/ui/dashboard/cards";

export default async function Page({
  searchParams,
}: {
  searchParams: { municipio?: string };
}) {
  // const idMunicipio = searchParams.municipio
  //   ? Number(searchParams.municipio)
  //   : null;

  // Si quisieras pre-cargar algo server-side para este municipio:
  // const data = idMunicipio
  //   ? await fetchMisDatos({ idMunicipio })
  //   : null;

  return (
    <div>
      <p>Home</p>

      <div className="min-h-96 flex justify-center items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardWrapper />
      </div>
    </div>
  );
}
