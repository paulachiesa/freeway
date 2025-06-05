import { getMunicipios } from "../../lib/data";

export default async function Page() {
  const municipios = await getMunicipios();
  console.log(municipios);
  return <p>Dashboard Page</p>;
}
