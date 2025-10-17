"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateUser } from "@/app/lib/actions/user.action";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type UserType = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  roles?: { role: { id: string; name: string } }[];
};

export default function EditUserForm({
  user,
  roles,
}: {
  user: UserType;
  roles: { id: string; name: string }[];
}) {
  const updateUserWithId = updateUser.bind(null, user.id);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("password", password);

    await updateUser(user.id, formData);
  };

  const currentRoleId = user.roles?.[0]?.role?.id || "";

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Datos principales */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name || ""}
              required
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>

          {/* Usuario */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={user.username}
              required
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email || ""}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Contraseña y rol */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Nueva contraseña */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Dejar en blanco para no cambiar"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-200 py-2 px-3 pr-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repita la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-200 py-2 px-3 pr-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Rol */}
          <div className="mb-4">
            <label htmlFor="roleId" className="mb-2 block text-sm font-medium">
              Rol
            </label>
            <select
              id="roleId"
              name="roleId"
              defaultValue={currentRoleId}
              required
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="">Seleccione un rol</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm font-medium mt-1 mb-4">{error}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/gestion/usuarios"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Guardar Cambios</Button>
      </div>
    </form>
  );
}
