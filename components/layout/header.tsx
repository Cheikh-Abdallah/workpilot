"use client";

import { Menu, Bell, Search } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div className="hidden items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 sm:flex">
          <Search size={18} className="text-slate-400" />

          <input
            type="search"
            placeholder="Rechercher..."
            className="w-52 bg-transparent text-sm outline-none"
          />
        </div>

        <h2 className="text-lg font-bold text-slate-800 sm:hidden">
          WorkPilot
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          MS
        </div>
      </div>
    </header>
  );
}