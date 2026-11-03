"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  ChartNoAxesCombined,
  Settings,
  BriefcaseBusiness,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { label: "Mes activités", href: "/activites", icon: ClipboardList },
  { label: "Planning", href: "/planning", icon: CalendarDays },
  { label: "Statistiques", href: "/statistiques", icon: ChartNoAxesCombined },
  { label: "Paramètres", href: "/parametres", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                WorkPilot
              </h1>
              <p className="text-xs text-slate-500">
                Gestion des activités
              </p>
            </div>
          </Link>

          <button onClick={onClose} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className="mb-5 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Espace de travail
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-4 rounded-2xl bg-blue-50 p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <BriefcaseBusiness size={19} />
          </div>

          <p className="text-sm font-semibold text-blue-900">
            Restez organisé !
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            Planifiez vos activités et suivez votre progression.
          </p>
        </div>

        <div className="border-t border-slate-100 p-4 text-center text-xs text-slate-400">
          WorkPilot © 2026
        </div>
      </aside>
    </>
  );
}