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
  { name: "Users", href: "/users", icon: Users, permission: "view_users" },
  { name: "Roles", href: "/roles", icon: Shield, permission: "role_view" },
  { name: "Privileges", href: "/privileges", icon: Key, permission: "privilege_view" },
  { name: "Item Master", href: "/items", icon: Package, permission: "item_view" },
  { name: "Production", href: "/production", icon: Factory, permission: "production_view" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission, isSuperAdmin } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="hidden glass-card md:block w-64 flex-col h-full fixed left-0 top-0 bottom-0 z-20 border-r border-white/5">
      <div className="flex h-20 items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <span className="text-lg font-bold text-white">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">HROne</h1>
            {isSuperAdmin() && (
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">God Mode</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1.5 px-4">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-blue-600/10 text-white shadow-[inset_0_0_1px_1px_rgba(59,130,246,0.2)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-all duration-300",
                    isActive ? "text-blue-500 scale-110" : "text-gray-500 group-hover:text-gray-300"
                  )}
                  aria-hidden="true"
                />
                <span className={cn("transition-colors duration-300", isActive ? "font-semibold" : "")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/5 p-6 space-y-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/10 border border-white/10">
            <span className="text-white font-bold text-sm">
              {user?.username?.substring(0, 2).toUpperCase() || "US"}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-semibold text-gray-200 text-sm truncate">{user?.username || "User"}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/20 active:scale-[0.98]"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
