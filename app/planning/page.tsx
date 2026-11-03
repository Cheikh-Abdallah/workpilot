"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ClipboardList,
  Clock,
} from "lucide-react";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useActivities } from "@/lib/use-activities";
import { Activity } from "@/types/activity";

const weekdays = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
];

export default function PlanningPage() {
  const { activities, loading } = useActivities();

  const [menuOpen, setMenuOpen] = useState(false);

  // États du calendrier
  const [currentDate, setCurrentDate] = useState(
    new Date(2000, 0, 1)
  );

  const [selectedDate, setSelectedDate] = useState("2000-01-01");

  const [today, setToday] = useState("");

  // Initialisation des dates après le chargement du composant
  useEffect(() => {
    const now = new Date();

    const todayString = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    setCurrentDate(now);
    setSelectedDate(todayString);
    setToday(todayString);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  // Génération des jours du calendrier
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startOffset = (firstDay.getDay() + 6) % 7;

    const days: (number | null)[] = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(day);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [year, month]);

  // Formatage d'une date
  function formatDate(day: number) {
    return [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");
  }

  // Récupération des activités d'une journée
  function getActivitiesForDay(day: number): Activity[] {
    const date = formatDate(day);

    return activities.filter(
      (activity) =>
        activity.dueDate === date ||
        (activity.startDate <= date && activity.dueDate >= date)
    );
  }

  // Activités de la date sélectionnée
  const selectedActivities = activities.filter(
    (activity) =>
      activity.dueDate === selectedDate ||
      (activity.startDate <= selectedDate &&
        activity.dueDate >= selectedDate)
  );

  // Couleurs des priorités
  const priorityColors: Record<Activity["priority"], string> = {
    low: "bg-slate-100 text-slate-600",
    normal: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  // Mois précédent
  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  // Mois suivant
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  // Retour à la date actuelle
  function goToToday() {
    const now = new Date();

    const todayString = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    setCurrentDate(now);
    setSelectedDate(todayString);
    setToday(todayString);
  }

  // Formatage de la date sélectionnée
  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-7xl space-y-7 p-4 sm:p-8">
          {/* EN-TÊTE */}
          <section>
            <h1 className="text-2xl font-bold text-slate-900">
              Planning
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Visualisez et organisez vos activités dans le temps.
            </p>
          </section>

          {/* STATISTIQUES */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-white p-5">
              <p className="text-sm text-slate-500">
                Total des activités
              </p>

              <p className="mt-2 text-2xl font-bold">
                {activities.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <p className="text-sm text-slate-500">
                Activités urgentes
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {
                  activities.filter(
                    (a) =>
                      a.priority === "urgent" &&
                      a.status !== "completed"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <p className="text-sm text-slate-500">
                Activités terminées
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {
                  activities.filter(
                    (a) => a.status === "completed"
                  ).length
                }
              </p>
            </div>
          </section>

          {/* CALENDRIER ET ACTIVITÉS */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* CALENDRIER */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold capitalize text-slate-900">
                    {monthName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Calendrier des activités
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goToToday}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                  >
                    Aujourd'hui
                  </button>

                  <button
                    onClick={previousMonth}
                    className="rounded-lg border p-2 hover:bg-slate-50"
                    aria-label="Mois précédent"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={nextMonth}
                    className="rounded-lg border p-2 hover:bg-slate-50"
                    aria-label="Mois suivant"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* JOURS DE LA SEMAINE */}
              <div className="grid grid-cols-7 gap-1">
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-xs font-bold text-slate-400"
                  >
                    {day}
                  </div>
                ))}

                {/* JOURS DU MOIS */}
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} />;
                  }

                  const date = formatDate(day);

                  const dayActivities = getActivitiesForDay(day);

                  const isToday = date === today;

                  const selected = date === selectedDate;

                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-20 rounded-xl border p-2 text-left transition sm:min-h-28 ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                            isToday
                              ? "bg-blue-600 text-white"
                              : "text-slate-700"
                          }`}
                        >
                          {day}
                        </span>

                        {dayActivities.length > 0 && (
                          <span className="text-xs font-bold text-blue-600">
                            {dayActivities.length}
                          </span>
                        )}
                      </div>

                      {/* ACTIVITÉS SUR ORDINATEUR */}
                      <div className="mt-2 hidden space-y-1 sm:block">
                        {dayActivities.slice(0, 2).map((activity) => (
                          <div
                            key={activity.id}
                            className={`truncate rounded px-1 py-1 text-[10px] font-medium ${
                              priorityColors[activity.priority]
                            }`}
                          >
                            {activity.title}
                          </div>
                        ))}

                        {dayActivities.length > 2 && (
                          <p className="text-[10px] text-slate-400">
                            +{dayActivities.length - 2} autres
                          </p>
                        )}
                      </div>

                      {/* INDICATEURS SUR MOBILE */}
                      <div className="mt-2 flex gap-1 sm:hidden">
                        {dayActivities.slice(0, 3).map((activity) => (
                          <span
                            key={activity.id}
                            className={`h-1.5 w-1.5 rounded-full ${
                              activity.priority === "urgent"
                                ? "bg-red-500"
                                : activity.priority === "high"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTIVITÉS DU JOUR */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Activités du jour
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selectedDateLabel}
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  Chargement...
                </p>
              ) : selectedActivities.length === 0 ? (
                <div className="py-10 text-center">
                  <ClipboardList
                    size={38}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    Aucune activité
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Aucune activité prévue pour cette date.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <h3 className="text-sm font-semibold text-slate-800">
                        {activity.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-500">
                        {activity.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            priorityColors[activity.priority]
                          }`}
                        >
                          {activity.priority === "urgent"
                            ? "Urgente"
                            : activity.priority === "high"
                              ? "Élevée"
                              : activity.priority === "normal"
                                ? "Normale"
                                : "Faible"}
                        </span>

                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={13} />
                          {activity.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}