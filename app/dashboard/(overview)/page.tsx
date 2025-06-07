import { getMunicipios } from "@/app/lib/data/municipio.data";

export default async function Page() {
  const municipios = await getMunicipios();
  console.log(municipios);
  return <p>Dashboard Page</p>;
}
