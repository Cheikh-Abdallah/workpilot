"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatCard from "@/components/dashboard/stat-card";
import { demoActivities } from "@/lib/demo-data";
import type { Activity } from "@/types/activity";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activities] = useState<Activity[]>(demoActivities);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  const formattedDate = useMemo(() => {
    if (!today) return "";

    return new Date(`${today}T12:00:00`).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [today]);

  const stats = useMemo(() => {
    const overdue = activities.filter(
      (activity) =>
        activity.status !== "completed" &&
        today !== "" &&
        activity.dueDate < today
    ).length;

    return {
      total: activities.length,
      completed: activities.filter(
        (a) => a.status === "completed"
      ).length,
      pending: activities.filter(
        (a) => a.status === "todo" || a.status === "in_progress"
      ).length,
      overdue,
      urgent: activities.filter(
        (a) =>
          a.priority === "urgent" &&
          a.status !== "completed"
      ).length,
    };
  }, [activities, today]);

  const progress =
    stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  function getStatus(status: Activity["status"]) {
    const styles = {
      todo: "bg-slate-100 text-slate-600",
      in_progress: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
    };

    const labels = {
      todo: "À faire",
      in_progress: "En cours",
      completed: "Terminée",
    };

    return (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  }

  function getPriority(priority: Activity["priority"]) {
    const styles = {
      low: "text-slate-500",
      normal: "text-blue-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };

    const labels = {
      low: "Faible",
      normal: "Normale",
      high: "Élevée",
      urgent: "Urgente",
    };

    return (
      <span className={`text-xs font-semibold ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">

          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-blue-600 capitalize">
                {formattedDate}
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Bonjour, M. Sané 👋
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Voici un aperçu de vos activités professionnelles.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
              <Plus size={19} />
              Nouvelle activité
            </button>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total des activités"
              value={stats.total}
              subtitle="Toutes les activités enregistrées"
              icon={ClipboardList}
              color="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="En cours / À faire"
              value={stats.pending}
              subtitle="Activités restant à traiter"
              icon={Clock}
              color="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Activités terminées"
              value={stats.completed}
              subtitle="Activités réalisées"
              icon={CheckCircle2}
              color="bg-green-50 text-green-600"
            />

            <StatCard
              title="En retard"
              value={stats.overdue}
              subtitle="Échéances dépassées"
              icon={AlertTriangle}
              color="bg-red-50 text-red-600"
            />

          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Progression globale
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  État d'avancement de l'ensemble de vos activités.
                </p>
              </div>

              <span className="text-3xl font-bold text-blue-600">
                {progress}%
              </span>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              {stats.completed} activité(s) terminée(s) sur {stats.total}.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Activités récentes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Suivez vos dernières activités.
                </p>
              </div>

              <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
                Voir tout
                <ArrowRight size={17} />
              </button>

            </div>

            <div className="divide-y divide-slate-100">

              {activities.slice(0, 5).map((activity) => (

                <div
                  key={activity.id}
                  className="flex flex-col gap-3 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-start gap-3">

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <ClipboardList size={20} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {activity.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        Échéance : {activity.dueDate}
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">

                    {getPriority(activity.priority)}

                    {getStatus(activity.status)}

                  </div>

                </div>

              ))}

            </div>
          </section>

          <section className="rounded-2xl border border-red-100 bg-red-50 p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-red-100 p-3 text-red-600">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h2 className="font-bold text-red-900">
                  Attention aux urgences
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  Vous avez {stats.urgent} activité(s) urgente(s) non terminée(s)
                  et {stats.overdue} activité(s) en retard.
                </p>
              </div>

            </div>
          </section>

        </main>
      </div>
    </div>
  );
}