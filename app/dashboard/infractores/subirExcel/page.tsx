"use client";

import { useState } from "react";
import { lusitana } from "@/app/ui/fonts";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload-excel", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>Subir Excel</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Subir Excel
        </button>
      </form>
    </div>
  );
}
