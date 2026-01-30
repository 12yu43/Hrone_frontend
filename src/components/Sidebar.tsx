"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Package,
  Factory,
  Shield,
  Key,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Roles", href: "/roles", icon: Shield },
  { name: "Privileges", href: "/privileges", icon: Key },
  { name: "Item Master", href: "/items", icon: Package },
  { name: "Production", href: "/production", icon: Factory },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="hidden border-r bg-white md:block w-64 flex-col h-full fixed left-0 top-0 bottom-0 z-10">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">HROne</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-gray-400 group-hover:text-gray-500"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-medium text-xs">
                    {user?.username?.substring(0, 2).toUpperCase() || "US"}
                </span>
            </div>
            <div className="text-sm overflow-hidden">
                <p className="font-medium text-gray-700 truncate">{user?.username || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
        </div>
        <button 
            onClick={logout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
        </button>
      </div>
    </div>
  );
}
