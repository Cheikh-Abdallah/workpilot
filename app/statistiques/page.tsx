"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useActivities } from "@/lib/use-activities";

const COLORS = ["#94A3B8", "#3B82F6", "#22C55E"];

const PRIORITY_COLORS = [
  "#94A3B8",
  "#3B82F6",
  "#F97316",
  "#EF4444",
];

export default function StatisticsPage() {
  const { activities, loading } = useActivities();

  const [menuOpen, setMenuOpen] = useState(false);

  // Date du jour initialisée après le chargement du composant
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();

    const todayString = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(todayString);
  }, []);

  // Calcul des statistiques
  const statistics = useMemo(() => {
    const total = activities.length;

    const completed = activities.filter(
      (a) => a.status === "completed"
    ).length;

    const inProgress = activities.filter(
      (a) => a.status === "in_progress"
    ).length;

    const todo = activities.filter(
      (a) => a.status === "todo"
    ).length;

    const overdue = activities.filter(
      (a) =>
        today !== "" &&
        a.status !== "completed" &&
        a.dueDate < today
    ).length;

    const urgent = activities.filter(
      (a) =>
        a.priority === "urgent" &&
        a.status !== "completed"
    ).length;

    const progress =
      total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      urgent,
      progress,
    };
  }, [activities, today]);

  // Répartition par statut
  const statusData = [
    { name: "À faire", value: statistics.todo },
    { name: "En cours", value: statistics.inProgress },
    { name: "Terminées", value: statistics.completed },
  ];

  // Répartition par priorité
  const priorityData = [
    {
      name: "Faible",
      total: activities.filter(
        (a) => a.priority === "low"
      ).length,
    },
    {
      name: "Normale",
      total: activities.filter(
        (a) => a.priority === "normal"
      ).length,
    },
    {
      name: "Élevée",
      total: activities.filter(
        (a) => a.priority === "high"
      ).length,
    },
    {
      name: "Urgente",
      total: activities.filter(
        (a) => a.priority === "urgent"
      ).length,
    },
  ];

  // Cartes statistiques
  const statCards = [
    {
      title: "Total des activités",
      value: statistics.total,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Activités terminées",
      value: statistics.completed,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "En cours",
      value: statistics.inProgress,
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "En retard",
      value: statistics.overdue,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">

          {/* TITRE */}
          <section>
            <h1 className="text-2xl font-bold text-slate-900">
              Statistiques et performances
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Analysez vos activités et mesurez votre progression.
            </p>
          </section>

          {loading ? (
            <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
              Chargement des statistiques...
            </div>
          ) : (
            <>
              {/* CARTES STATISTIQUES */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                          {card.title}
                        </p>

                        <div className={`rounded-xl p-3 ${card.color}`}>
                          <Icon size={21} />
                        </div>
                      </div>

                      <h2 className="mt-4 text-3xl font-bold text-slate-900">
                        {card.value}
                      </h2>
                    </div>
                  );
                })}
              </section>

              {/* PROGRESSION */}
              <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <Target className="text-blue-600" size={22} />

                      <h2 className="text-lg font-bold text-slate-900">
                        Taux global de réalisation
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Pourcentage des activités effectivement terminées.
                    </p>
                  </div>

                  <span className="text-4xl font-bold text-blue-600">
                    {statistics.progress}%
                  </span>
                </div>

                <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{
                      width: `${statistics.progress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>{statistics.completed} terminées</span>
                  <span>{statistics.total} activités au total</span>
                </div>
              </section>

              {/* GRAPHIQUES */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* STATUTS */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="mb-5">
                    <h2 className="font-bold text-slate-900">
                      Répartition par statut
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      État actuel de vos activités.
                    </p>
                  </div>

                  <div className="h-72">
                    {statistics.total === 0 ? (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Aucune donnée disponible.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={90}
                            innerRadius={55}
                            paddingAngle={4}
                          >
                            {statusData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={COLORS[index]}
                              />
                            ))}
                          </Pie>

                          <Tooltip />
                          <Legend verticalAlign="bottom" />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* PRIORITÉS */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="mb-5">
                    <h2 className="font-bold text-slate-900">
                      Répartition par priorité
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Niveau d'importance des activités.
                    </p>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={priorityData}
                        margin={{
                          top: 10,
                          right: 10,
                          left: -20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                        />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Bar
                          dataKey="total"
                          name="Activités"
                          radius={[6, 6, 0, 0]}
                        >
                          {priorityData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={PRIORITY_COLORS[index]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* SYNTHÈSE */}
              <section className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <BarChart3 size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Synthèse de vos activités
                    </h2>

                    <p className="text-xs text-slate-500">
                      Indicateurs clés de votre organisation.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-sm text-green-700">
                      Activités réalisées
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-800">
                      {statistics.completed}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                      Activités en retard
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-800">
                      {statistics.overdue}
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-4">
                    <p className="text-sm text-orange-700">
                      Urgences non terminées
                    </p>

                    <p className="mt-2 text-2xl font-bold text-orange-800">
                      {statistics.urgent}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}