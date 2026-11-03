"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CalendarDays,
  ClipboardList,
  X,
  Filter,
} from "lucide-react";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

import { useActivities } from "@/lib/use-activities";

import {
  Activity,
  ActivityPriority,
  ActivityStatus,
} from "@/types/activity";

const initialForm = {
  title: "",
  description: "",
  startDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  priority: "normal" as ActivityPriority,
  status: "todo" as ActivityStatus,
};

export default function ActivitiesPage() {
  const {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
  } = useActivities();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState(initialForm);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(search.toLowerCase()) ||
        activity.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || activity.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [activities, search, filter]);

  function openNewActivity() {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  }

  function openEditActivity(activity: Activity) {
    setEditing(activity);

    setForm({
      title: activity.title,
      description: activity.description,
      startDate: activity.startDate,
      dueDate: activity.dueDate,
      priority: activity.priority,
      status: activity.status,
    });

    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim() || !form.dueDate) return;

    if (form.dueDate < form.startDate) {
      alert("La date limite doit être postérieure à la date de début.");
      return;
    }

    const activity: Activity = {
      id: editing?.id ?? crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      dueDate: form.dueDate,
      priority: form.priority,
      status: form.status,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };

    try {
      if (editing) {
        await updateActivity(activity);
      } else {
        await addActivity(activity);
      }

      setModalOpen(false);
      setEditing(null);
      setForm(initialForm);
    } catch {
      alert("Impossible d'enregistrer cette activité.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cette activité ?")) {
      return;
    }

    await deleteActivity(id);
  }

  async function handleStatusChange(
    activity: Activity,
    status: ActivityStatus
  ) {
    await updateActivity({
      ...activity,
      status,
    });
  }

  function statusLabel(status: ActivityStatus) {
    const labels = {
      todo: "À faire",
      in_progress: "En cours",
      completed: "Terminée",
    };

    return labels[status];
  }

  function priorityLabel(priority: ActivityPriority) {
    const labels = {
      low: "Faible",
      normal: "Normale",
      high: "Élevée",
      urgent: "Urgente",
    };

    return labels[priority];
  }

  const priorityColors = {
    low: "text-slate-500 bg-slate-100",
    normal: "text-blue-700 bg-blue-50",
    high: "text-orange-700 bg-orange-50",
    urgent: "text-red-700 bg-red-50",
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">

        <Header onMenuClick={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-7xl space-y-7 p-4 sm:p-8">

          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Mes activités
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Organisez et suivez toutes vos activités professionnelles.
              </p>
            </div>

            <button
              onClick={openNewActivity}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
            >
              <Plus size={19} />
              Nouvelle activité
            </button>

          </section>

          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">

            {[
              ["Total", activities.length],
              ["À faire", activities.filter(a => a.status === "todo").length],
              ["En cours", activities.filter(a => a.status === "in_progress").length],
              ["Terminées", activities.filter(a => a.status === "completed").length],
            ].map(([label, value]) => (

              <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
              </div>

            ))}

          </section>

          <section className="rounded-2xl border bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row">

              <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4">
                <Search size={19} className="text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une activité..."
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border px-3">
                <Filter size={17} className="text-slate-400" />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent py-3 text-sm outline-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminées</option>
                </select>

              </div>

            </div>

          </section>

          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

            <div className="border-b p-5">
              <h2 className="font-bold text-slate-900">
                Liste des activités
              </h2>
            </div>

            {loading ? (

              <div className="p-12 text-center text-slate-500">
                Chargement des activités...
              </div>

            ) : filteredActivities.length === 0 ? (

              <div className="p-12 text-center">
                <ClipboardList className="mx-auto text-slate-300" size={42} />

                <p className="mt-4 font-semibold text-slate-700">
                  Aucune activité trouvée
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Ajoutez une activité ou modifiez votre recherche.
                </p>
              </div>

            ) : (

              <div className="divide-y">

                {filteredActivities.map((activity) => (

                  <article
                    key={activity.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                  >

                    <div className="flex flex-1 items-start gap-3">

                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <ClipboardList size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-800">
                          {activity.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {activity.description || "Aucune description"}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays size={14} />
                          Échéance : {activity.dueDate}
                        </div>
                      </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColors[activity.priority]}`}>
                        {priorityLabel(activity.priority)}
                      </span>

                      <select
                        value={activity.status}
                        onChange={(e) =>
                          handleStatusChange(
                            activity,
                            e.target.value as ActivityStatus
                          )
                        }
                        className="rounded-lg border px-2 py-2 text-xs font-medium text-slate-600 outline-none"
                        aria-label={`Statut de ${activity.title}`}
                      >
                        <option value="todo">À faire</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminée</option>
                      </select>

                      <button
                        onClick={() => openEditActivity(activity)}
                        aria-label="Modifier"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(activity.id)}
                        aria-label="Supprimer"
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        </main>
      </div>

      {/* FORMULAIRE */}

      {modalOpen && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">

          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b p-5">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editing ? "Modifier l'activité" : "Nouvelle activité"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Renseignez les informations de votre activité.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Fermer"
              >
                <X size={21} />
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Titre de l'activité *
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex : Préparer le rapport mensuel"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez votre activité..."
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date de début *
                  </label>

                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full rounded-xl border px-3 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date limite *
                  </label>

                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    min={form.startDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full rounded-xl border px-3 py-3 text-sm"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Priorité
                  </label>

                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as ActivityPriority })}
                    className="w-full rounded-xl border px-3 py-3 text-sm"
                  >
                    <option value="low">Faible</option>
                    <option value="normal">Normale</option>
                    <option value="high">Élevée</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Statut
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ActivityStatus })}
                    className="w-full rounded-xl border px-3 py-3 text-sm"
                  >
                    <option value="todo">À faire</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminée</option>
                  </select>
                </div>

              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editing ? "Enregistrer les modifications" : "Créer l'activité"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}