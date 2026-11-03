import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </h3>

      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}