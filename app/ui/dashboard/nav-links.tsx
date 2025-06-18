"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  WrenchScrewdriverIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Infracciones",
    icon: HomeIcon,
    children: [
      {
        name: "Nueva Carga",
        href: "/dashboard/infracciones/crear",
        icon: BuildingOffice2Icon,
      },
      {
        name: "Ver Todas",
        href: "/dashboard/infracciones",
        icon: BuildingOffice2Icon,
      },
    ],
  },
  {
    name: "Actas",
    href: "/dashboard",
    icon: HomeIcon,
    // children: [
    //   {
    //     name: "Nueva Carga",
    //     href: "/dashboard/infracciones/crear",
    //     icon: BuildingOffice2Icon,
    //   },
    //   {
    //     name: "Ver Todas",
    //     href: "/dashboard/infracciones",
    //     icon: BuildingOffice2Icon,
    //   },
    // ],
  },
  {
    name: "Administración",
    icon: Cog6ToothIcon,
    children: [
      {
        name: "Municipios",
        href: "/dashboard/gestion/municipios",
        icon: BuildingOffice2Icon,
      },
      {
        name: "Radares",
        href: "/dashboard/gestion/radares",
        icon: WrenchScrewdriverIcon,
      },
      {
        name: "Cuadro Tarifario",
        href: "/dashboard/gestion/cuadroTarifario",
        icon: DocumentDuplicateIcon,
      },
    ],
  },
  { name: "Usuarios", href: "/dashboard", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        if (link.children) {
          const isOpen = openMenus[link.name];

          return (
            <div key={link.name} className="w-full">
              <button
                onClick={() => toggleMenu(link.name)}
                className={clsx(
                  "flex w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600",
                  {
                    "bg-sky-100 text-blue-600": link.children.some(
                      (child) => pathname === child.href
                    ),
                  }
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
                  {link.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={clsx(
                        "rounded-md px-3 py-1 text-sm hover:bg-sky-100 hover:text-blue-600",
                        {
                          "bg-sky-100 text-blue-600": pathname === child.href,
                        }
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            {LinkIcon && <LinkIcon className="w-6" />}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
