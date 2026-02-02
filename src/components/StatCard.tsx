import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  const isPositive = change.startsWith("+");

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl border border-white/5 transition-all duration-300 hover:bg-white/[0.07] group">
      <div className="flex items-center justify-between mb-5">
        <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
      </div>
      <div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className="mt-2 flex items-center gap-2">
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded-md",
            isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {change.split(" ")[0]}
          </span>
          <span className="text-[10px] text-gray-500 font-medium italic">
            {change.split(" ").slice(1).join(" ")}
          </span>
        </div>
      </div>
    </div>
  );
}
