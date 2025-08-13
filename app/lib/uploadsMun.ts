export function toImageApiUrl(uploadPath: string) {
  // quita prefijo /uploads y codifica cada segmento
  const parts = uploadPath
    .replace(/^\/+/, "")
    .replace(/^uploads\//, "")
    .split("/");
  const encoded = parts.map(encodeURIComponent).join("/");
  return `/api/images/${encoded}`;
}
