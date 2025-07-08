// app/lib/data/types.ts
export interface Municipio {
  id: number;
  nombre: string;
  provincia: string | null;
  ciudad: string | null;
  direccion: string | null;
}
