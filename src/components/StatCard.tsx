import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <p className="mt-1 text-xs text-gray-500">
         {change}
        </p>
      </div>
    </div>
  );
}
