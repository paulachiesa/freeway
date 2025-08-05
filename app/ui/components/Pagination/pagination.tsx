// app/ui/components/Pagination/pagination.tsx
"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "@/app/lib/utils";

export default function Pagination({
  totalPages,
  currentPage,
  basePath,
  query,
}: {
  totalPages: number;
  currentPage: number;
  basePath: string;
  query: string;
}) {
  const pages = generatePagination(currentPage, totalPages);

  const makeHref = (page: number) => {
    const p = new URLSearchParams();
    if (query) p.set("query", query);
    p.set("page", String(page));
    return `${basePath}?${p.toString()}`;
  };

  return (
    <div className="inline-flex">
      <Link
        href={makeHref(currentPage - 1)}
        className={clsx("p-2", {
          "pointer-events-none opacity-50": currentPage <= 1,
        })}
      >
        <ArrowLeftIcon className="w-4" />
      </Link>
      {pages.map((p, i) => (
        <Link
          key={i}
          href={makeHref(typeof p === "number" ? p : currentPage)}
          className={clsx("px-3 py-1 border", {
            "bg-blue-600 text-white": p === currentPage,
            "text-gray-400": p === "...",
          })}
        >
          {p}
        </Link>
      ))}
      <Link
        href={makeHref(currentPage + 1)}
        className={clsx("p-2", {
          "pointer-events-none opacity-50": currentPage >= totalPages,
        })}
      >
        <ArrowRightIcon className="w-4" />
      </Link>
    </div>
  );
}
