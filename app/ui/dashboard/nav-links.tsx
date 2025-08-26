"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  DocumentCurrencyDollarIcon,
  MapPinIcon,
  QueueListIcon,
  RssIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import Toast from "@/app/ui/components/Toast/toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { useState } from "react";
import Spinner from "../components/Spinner/spinner";

type Role = "admin" | "procesador" | "usuario";
type Child = { name: string; href: string; icon?: any };
type LinkItem = {
  name: string;
  href?: string;
  icon?: any;
  roles?: Role[];
  children?: Child[];
};

const links: LinkItem[] = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Infracciones",
    icon: DocumentArrowUpIcon,
    roles: ["admin", "procesador"],
    children: [
      {
        name: "Nueva Carga",
        href: "/dashboard/infracciones/crear",
        icon: PlusIcon,
      },
      {
        name: "Ver Todas",
        href: "/dashboard/infracciones",
        icon: QueueListIcon,
      },
    ],
  },
  {
    name: "Infractores",
    icon: DocumentArrowUpIcon,
    roles: ["admin"],
    children: [
      {
        name: "Subir Excel",
        href: "/dashboard/infractores/subirExcel",
        icon: ArrowUpTrayIcon,
      },
      {
        name: "Ver Todas",
        href: "/dashboard/infractores",
        icon: QueueListIcon,
      },
    ],
  },
  {
    name: "Actas",
    href: "/dashboard/actas",
    icon: DocumentCheckIcon,
    roles: ["admin"],
  },
  {
    name: "Administración",
    icon: Cog6ToothIcon,
    roles: ["admin"],
    children: [
      {
        name: "Municipios",
        href: "/dashboard/gestion/municipios",
        icon: MapPinIcon,
      },
      {
        name: "Radares",
        href: "/dashboard/gestion/radares",
        icon: RssIcon,
      },
      {
        name: "Cuadro Tarifario",
        href: "/dashboard/gestion/cuadroTarifario",
        icon: DocumentCurrencyDollarIcon,
      },
    ],
  },
  {
    name: "Usuarios",
    href: "/dashboard/usuarios",
    icon: UserGroupIcon,
    roles: ["admin"],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <>
        <Spinner />
      </>
    );
  }
  const userRoles = ((session?.user as any)?.roles ?? []).map((r: string) =>
    String(r).toLowerCase()
  );

  const canSee = (item: LinkItem) =>
    !item.roles || item.roles.some((r) => userRoles.includes(r));

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const rutasProtegidas = [
    "/dashboard/infracciones",
    "/dashboard/actas",
    "/dashboard/infractores/subirExcel",
  ];
  const requiresMunicipio = (href: string) =>
    rutasProtegidas.some((ruta) => href.startsWith(ruta));

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (requiresMunicipio(href)) {
      const stored = sessionStorage.getItem("municipio");
      if (!stored) {
        e.preventDefault();
        setToastMsg("Debe seleccionar un municipio primero.");
      }
    }
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        if (link.children) {
          if (!canSee(link)) return null;
          const isOpen = openMenus[link.name];
          const isAnyChildActive = link.children.some(
            (c) => pathname === c.href
          );

          return (
            <div key={link.name} className="w-full">
              <button
                onClick={() => toggleMenu(link.name)}
                className={clsx(
                  "flex w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                  { "bg-sky-100 text-blue-600": isAnyChildActive }
                )}
              >
                {LinkIcon && <LinkIcon className="w-6" />}
                <span className="hidden md:block">{link.name}</span>
                <span className="ml-auto">
                  {isOpen ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {link.children.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={(e) => handleClick(e, child.href)}
                        className={clsx(
                          "flex items-center gap-2 rounded-md px-3 py-1 text-sm hover:bg-sky-100 hover:text-blue-600",
                          {
                            "bg-sky-100 text-blue-600": pathname === child.href,
                          }
                        )}
                      >
                        {ChildIcon && <ChildIcon className="w-4" />}
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        if (!canSee(link)) return null;

        return (
          <Link
            key={link.name}
            href={link.href!}
            onClick={(e) => handleClick(e, link.href!)}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              { "bg-sky-100 text-blue-600": pathname === link.href }
            )}
          >
            {LinkIcon && <LinkIcon className="w-6" />}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}

      {toastMsg && (
        <Toast
          message={toastMsg}
          type="error"
          position="top-right"
          onClose={() => setToastMsg(null)}
        />
      )}
    </>
  );
}
