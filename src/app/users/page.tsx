"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Plus, Search, Loader2, UserPlus, Users, Shield, Zap, TrendingUp, MoreVertical, Building2, DollarSign, ArrowUpRight, MoreHorizontal, LucideIcon } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: number;
  username: string;
  email: string;
  roles: Array<string | { id: number; name: string; privileges?: any[] }>;
  employeeResponseDto?: {
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
  };
}

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [assignState, setAssignState] = useState({ userId: 0, roleId: 0 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.post("/user/all");
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setUsers(responseData);
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        setUsers(responseData.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await api.post("/user/all-role");
    const d = res.data;
    let list: { id: number; name: string }[] = [];
    if (Array.isArray(d)) list = d;
    else if (d && Array.isArray(d.data)) list = d.data;
    setRoles(list);
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/user/assign-role", {
        userId: assignState.userId,
        roleId: assignState.roleId,
      });
      setAssignState({ userId: 0, roleId: 0 });
      await fetchUsers();
    } catch (error) {
      console.error("Failed to assign role", error);
      alert("Failed to assign role");
    }
  };

  return (
    <div className="space-y-8 pb-8 relative">
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage system access and team member profiles.</p>
        </div>
        {hasPermission("user_create") && (
          <Link
            href="/users/create"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-500 active:scale-[0.98]"
          >
            <UserPlus className="h-5 w-5" />
            Add New User
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex items-center gap-5">
          <div className="h-14 w-14 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-bold text-white mt-0.5">{users.length}</h3>
          </div>
        </div>

        {hasPermission("role_assign") && (
          <div className="md:col-span-2 glass-card rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white">Quick Role Assignment</h3>
            </div>
            <form onSubmit={handleAssignRole} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Select User</label>
                <select
                  className="block w-full rounded-xl border-none bg-white/5 px-4 py-2.5 text-sm text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                  value={assignState.userId}
                  onChange={(e) => setAssignState({ ...assignState, userId: Number(e.target.value) })}
                >
                  <option value={0} className="bg-gray-900">Choose user...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="bg-gray-900">{u.username}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Select Role</label>
                <select
                  className="block w-full rounded-xl border-none bg-white/5 px-4 py-2.5 text-sm text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                  value={assignState.roleId}
                  onChange={(e) => setAssignState({ ...assignState, roleId: Number(e.target.value) })}
                >
                  <option value={0} className="bg-gray-900">Choose role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id} className="bg-gray-900">{r.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-white/5 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                Assign
              </button>
            </form>
          </div>
        )}
      </div>

      {!hasPermission("view_users") ? (
        <div className="glass-card rounded-2xl border border-white/5 p-12 text-center">
          <Shield className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Access Restricted</h3>
          <p className="text-gray-500 mt-2">You don't have permission to view the user list.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white">System Users</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Filter by name or email..."
                className="h-10 w-full md:w-72 rounded-xl bg-white/5 border-none pl-10 pr-4 text-sm text-gray-200 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-white/[0.01] text-[10px] uppercase text-gray-500 font-bold tracking-widest border-b border-white/5">
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Contact</th>
                  <th className="px-8 py-4">Access Level</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-lg">
                            {user.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200">{user.username}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-gray-400 font-medium">{user.email}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-lg bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase"
                            >
                              {typeof role === "string" ? role : role.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
