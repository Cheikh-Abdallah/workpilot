import { Activity } from "@/types/activity";

const today = new Date();

function getDate(offset: number) {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

export const demoActivities: Activity[] = [
  {
    id: "1",
    title: "Préparer le rapport mensuel",
    description: "Finalisation du rapport des activités.",
    startDate: getDate(-2),
    dueDate: getDate(2),
    priority: "high",
    status: "in_progress",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Organiser la réunion d'équipe",
    description: "Préparer l'ordre du jour.",
    startDate: getDate(0),
    dueDate: getDate(3),
    priority: "urgent",
    status: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mettre à jour les dossiers",
    description: "Vérification des dossiers administratifs.",
    startDate: getDate(-4),
    dueDate: getDate(-1),
    priority: "normal",
    status: "completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Suivi des projets en cours",
    description: "Évaluation de l'avancement des projets.",
    startDate: getDate(-5),
    dueDate: getDate(-1),
    priority: "urgent",
    status: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Préparer le planning hebdomadaire",
    description: "Planification des activités de la semaine.",
    startDate: getDate(1),
    dueDate: getDate(5),
    priority: "normal",
    status: "todo",
    createdAt: new Date().toISOString(),
  },
];