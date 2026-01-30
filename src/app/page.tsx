import { Users, Building2, TrendingUp, DollarSign } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome to your new CRM dashboard</p>
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

      <div className="grid gap-6 md:grid-cols-1">
         <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
            <div className="mt-6 h-[300px] w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                {/* SVG for a simple line chart representation */}
                <svg className="w-full h-full text-green-500" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path
                        d="M0,80 C50,70 100,75 150,60 S250,40 300,50 S350,20 400,10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                    />
                    <circle cx="0" cy="80" r="2" fill="currentColor" />
                    <circle cx="150" cy="60" r="2" fill="currentColor" />
                    <circle cx="300" cy="50" r="2" fill="currentColor" />
                    <circle cx="400" cy="10" r="2" fill="currentColor" />
                </svg>
            </div>
         </div>
      </div>
    </div>
  );
}
