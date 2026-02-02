"use client";

import { Users, Building2, TrendingUp, DollarSign, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Good morning, Deeksha. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-gray-300 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-blue-500 transition-all duration-200 active:scale-[0.98]">
            Add New Record
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value="1,234"
          change="+12% from last month"
          icon={Users}
        />
        <StatCard
          title="Companies"
          value="456"
          change="+8% from last month"
          icon={Building2}
        />
        <StatCard
          title="Active Deals"
          value="89"
          change="+23% from last month"
          icon={TrendingUp}
        />
        <StatCard
          title="Revenue"
          value="$234,567"
          change="+18% from last month"
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
              <p className="text-sm text-gray-500">Overview of your earnings this year</p>
            </div>
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="relative h-[320px] w-full bg-blue-600/[0.02] rounded-2xl flex items-center justify-center border border-dashed border-white/10 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full text-blue-500/20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 100 V 80 Q 25 70, 50 60 T 100 20 V 100 Z" fill="url(#gradient)" />
            </svg>
            <svg className="relative w-full h-[150px] text-blue-500 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path
                d="M0,80 C50,70 100,75 150,60 S250,40 300,50 S350,20 400,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
              <circle cx="0" cy="80" r="4" fill="currentColor" stroke="white" strokeWidth="2" />
              <circle cx="150" cy="60" r="4" fill="currentColor" stroke="white" strokeWidth="2" />
              <circle cx="300" cy="50" r="4" fill="currentColor" stroke="white" strokeWidth="2" />
              <circle cx="400" cy="10" r="4" fill="currentColor" stroke="white" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 p-8 shadow-2xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6 flex-1">
            {[
              { user: "Sarah Connor", action: "Updated Deal", time: "2m ago", color: "text-blue-500" },
              { user: "John Doe", action: "New Contact", time: "15m ago", color: "text-purple-500" },
              { user: "Mike Ross", action: "Closed Sale", time: "1h ago", color: "text-emerald-500" },
              { user: "Rachel Zane", action: "Added Note", time: "3h ago", color: "text-amber-500" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className={cn("h-2.5 w-2.5 rounded-full mt-1.5 ring-4 ring-black/20", activity.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-blue-400 transition-colors">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-500">{activity.action}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase pt-1">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/5">
            View All Activity
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
