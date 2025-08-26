"use client";

import { useState, useEffect } from "react";
import { lusitana } from "@/app/ui/fonts";
import Toast from "@/app/ui/components/Toast/toast";
import Spinner from "@/app/ui/components/Spinner/spinner";
import Dialog from "@/app/ui/components/Dialog/dialog";

type LoteOption = { id: number; numero: number; descripcion: string };

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [municipioId, setMunicipioId] = useState<string>("");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [faltantesCount, setFaltantesCount] = useState<number>(0);
  const [selectedLoteId, setSelectedLoteId] = useState<number | "">("");

  const selectedNumero =
    typeof selectedLoteId === "number"
      ? lotes.find((l) => l.id === selectedLoteId)?.numero
      : undefined;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("municipio");
      if (!raw) return;

      const obj = JSON.parse(raw);
      const id = Number(obj?.id);
      if (!Number.isFinite(id)) {
        console.warn("municipio.id inválido en sessionStorage:", obj?.id);
        return;
      }
      setMunicipioId(String(id));
    } catch (e) {
      console.error("No se pudo leer municipio desde sessionStorage:", e);
    }
  }, []);

  useEffect(() => {
    if (!municipioId) return;
    (async () => {
      try {
        const res = await fetch(`/api/lotes/combo?municipioId=${municipioId}`);
        const data = await res.json();

        setLotes(data.success ? data.lotes : []);
      } catch {
        setLotes([]);
      }
    })();
  }, [municipioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setToastType("warning");
      setToastMsg("Seleccioná un archivo Excel.");
      return;
    }
    if (!selectedLoteId) {
      setToastType("warning");
      setToastMsg("Seleccioná un lote del combo.");
      return;
    }

    setLoading(true);
    setToastMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("municipioId", municipioId);

      const res = await fetch("/api/infractores/upload-excel", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Error al importar");

      const resF = await fetch(
        `/api/infractores/faltantes-excel?loteId=${selectedLoteId}`,
        { method: "GET" }
      );
      const info = await resF.json();

      if (!info.success)
        throw new Error(info.message || "No se pudo consultar faltantes");

      if (info.faltantes > 0) {
        setFaltantesCount(info.faltantes);
        setDialogOpen(true);
      } else {
        setToastType("success");
        setToastMsg(
          `Excel importado. El lote #${
            selectedNumero ?? selectedLoteId
          } no tiene infracciones incompletas.`
        );
      }
      setSelectedLoteId("");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setToastType("error");
      setToastMsg(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogConfirm = async () => {
    if (!selectedLoteId) return;
    setDialogOpen(false);
    setLoading(true);

    try {
      const responseDelete = await fetch(
        `/api/infractores/faltantes-excel?loteId=${selectedLoteId}`,
        { method: "DELETE" }
      );
      const delData = await responseDelete.json();
      if (delData.success) {
        setToastType("success");
        setToastMsg(
          `Se eliminaron ${
            delData.eliminadas
          } infracciones faltantes del lote #${
            selectedNumero ?? selectedLoteId
          }.`
        );
      } else {
        setToastType("error");
        setToastMsg("Error al eliminar las infracciones faltantes.");
      }
    } catch (err) {
      console.error(err);
      setToastType("error");
      setToastMsg("Error al procesar eliminación.");
    } finally {
      setLoading(false);
      setFaltantesCount(0);
    }
  };

  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <div className="w-full">
      <Dialog
        isOpen={dialogOpen}
        title="Infracciones faltantes"
        message={`El lote #${
          selectedNumero ?? selectedLoteId
        } tiene ${faltantesCount} infracciones sin datos de vehículo. ¿Deseás eliminarlas ahora?`}
        singleButton={{ label: "Aceptar", onClick: handleDialogConfirm }}
      />

      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl mb-3`}>Subir Excel</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-4 mb-4 flex-wrap">
          <div>
            <label className="block mb-1 text-sm">Lote del municipio</label>
            <select
              className="border rounded px-3 py-2 h-[38px]"
              style={{ width: "12em" }}
              value={selectedLoteId}
              onChange={(e) =>
                setSelectedLoteId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">Seleccioná un lote</option>
              {lotes.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[260px]">
            <label className="block mb-1 text-sm">Archivo Excel</label>
            <div className="flex items-center gap-3">
              <input
                id="fileInput"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="fileInput"
                className="inline-flex items-center h-[38px] px-3 py-2 border rounded bg-white hover:bg-gray-50 cursor-pointer"
              >
                Seleccionar archivo
              </label>
              <span
                className="text-sm break-all whitespace-normal"
                aria-live="polite"
              >
                {file ? file.name : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-start gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Importando..." : "Subir Excel"}
          </button>
        </div>
      </form>

      {toastMsg && (
        <Toast
          message={toastMsg}
          type={toastType}
          position="top-right"
          onClose={() => setToastMsg(null)}
        />
      )}
    </div>
  );
}
