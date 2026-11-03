"use client";

import { useRef, useState } from "react";
import {
  Settings,
  User,
  Database,
  Download,
  Upload,
  Trash2,
  Smartphone,
  Info,
  ShieldCheck,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useActivities } from "@/lib/use-activities";
import { Activity } from "@/types/activity";

export default function SettingsPage() {
  const { activities, refresh } = useActivities();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("M. Sané");

  const fileInput = useRef<HTMLInputElement>(null);

  function exportData() {
    const data = {
      application: "WorkPilot",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      activities,
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `workpilot-sauvegarde-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);

    toast.success("Sauvegarde exportée avec succès !");
  }

  async function importData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const content = JSON.parse(await file.text());

      if (
        !Array.isArray(content.activities) ||
        !content.activities.every((a: Activity) =>
          a &&
          typeof a.id === "string" &&
          typeof a.title === "string" &&
          typeof a.description === "string" &&
          typeof a.startDate === "string" &&
          typeof a.dueDate === "string" &&
          ["todo", "in_progress", "completed"].includes(a.status) &&
          ["low", "normal", "high", "urgent"].includes(a.priority) &&
          typeof a.createdAt === "string"
        )
      ) {
        throw new Error("Format invalide");
      }

      const { saveActivity } = await import("@/lib/database");

      for (const activity of content.activities) {
        await saveActivity(activity);
      }

      await refresh();

      toast.success("Données importées avec succès !");
    } catch {
      toast.error("Fichier invalide ou impossible à importer.");
    } finally {
      event.target.value = "";
    }
  }

  async function resetData() {
    const confirmed = window.confirm(
      "Attention : cette opération supprimera toutes vos activités. Continuer ?"
    );

    if (!confirmed) return;

    const { getAllActivities, removeActivity } =
      await import("@/lib/database");

    const allActivities = await getAllActivities();

    for (const activity of allActivities) {
      await removeActivity(activity.id);
    }

    await refresh();

    toast.success("Toutes les activités ont été supprimées.");
  }

  function saveProfile() {
    localStorage.setItem("workpilot-user", userName);
    toast.success("Profil enregistré !");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-5xl space-y-7 p-4 sm:p-8">

          <section>
            <h1 className="text-2xl font-bold text-slate-900">
              Paramètres
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Personnalisez votre espace de travail et gérez vos données.
            </p>
          </section>

          {/* PROFIL */}

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <User size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Profil utilisateur
                </h2>
                <p className="text-xs text-slate-500">
                  Informations personnelles.
                </p>
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nom affiché
                </label>

                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={saveProfile}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Enregistrer le profil
              </button>
            </div>
          </section>

          {/* DONNÉES */}

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <Database size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Gestion des données
                </h2>

                <p className="text-xs text-slate-500">
                  Sauvegardez et récupérez vos activités.
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                Activités enregistrées
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {activities.length}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button
                onClick={exportData}
                className="flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download size={19} />
                Exporter mes données
              </button>

              <button
                onClick={() => fileInput.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Upload size={19} />
                Importer une sauvegarde
              </button>

              <input
                ref={fileInput}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={importData}
              />

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Les sauvegardes sont enregistrées au format JSON.
            </p>
          </section>

          {/* INSTALLATION */}

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Smartphone size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Application mobile
                </h2>

                <p className="text-xs text-slate-500">
                  Installation sur Android et iPhone.
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              WorkPilot est conçu pour fonctionner comme une application
              installable sur votre téléphone. La fonctionnalité sera
              disponible après activation de la version PWA.
            </p>
          </section>

          {/* SÉCURITÉ */}

          <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <Trash2 size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Zone de réinitialisation
                </h2>

                <p className="text-xs text-slate-500">
                  Opérations irréversibles.
                </p>
              </div>
            </div>

            <p className="mb-4 text-sm text-slate-600">
              Supprimer définitivement toutes les activités enregistrées
              sur cet appareil.
            </p>

            <button
              onClick={resetData}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Réinitialiser les données
            </button>
          </section>

          {/* INFORMATIONS */}

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Info className="text-blue-600" size={22} />

              <div>
                <h2 className="font-bold text-slate-900">
                  À propos de WorkPilot
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Version 1.0.0 — Gestion et planification des activités.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-green-600">
              <ShieldCheck size={16} />
              Stockage local sur votre appareil.
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
