export type ActivityStatus =
  | "todo"
  | "in_progress"
  | "completed";

export type ActivityPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: ActivityPriority;
  status: ActivityStatus;
  createdAt: string;
}