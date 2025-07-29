// export const formatDateToLocal = (
//   input: string | Date | null,
//   locale: string = "en-US"
// ) => {
//   if (!input) return "-";

//   const date = typeof input === "string" ? new Date(input) : input;

//   if (isNaN(date.getTime())) return "-"; // evita fechas inválidas

//   const options: Intl.DateTimeFormatOptions = {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   };

//   const formatter = new Intl.DateTimeFormat(locale, options);
//   return formatter.format(date);
// };

export function formatDateToLocal(date: string | Date): string {
  // Si es "dd/mm/yyyy", devolverlo como está
  if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export const formatDateInput = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // → "YYYY-MM-DD"
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
