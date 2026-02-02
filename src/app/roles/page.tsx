"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Loader2, CheckSquare, Shield, ShieldAlert, MoreVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Role {
  id: number;
  name: string;
  privileges?: { id: number; name: string }[];
}

interface Privilege {
  id: number;
  name: string;
}

export default function RolesPage() {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "" });
  const [assignState, setAssignState] = useState({ roleId: 0, privilegeIds: [] as number[] });
  const [createLoading, setCreateLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await api.post("/user/all-role");
      const d = res.data;
      let list: Role[] = [];
      if (Array.isArray(d)) list = d;
      else if (d && Array.isArray(d.data)) list = d.data;
      setRoles(list);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivileges = async () => {
    const res = await api.post("/user/all-privilage");
    const d = res.data;
    let list: Privilege[] = [];
    if (Array.isArray(d)) list = d;
    else if (d && Array.isArray(d.data)) list = d.data;
    setPrivileges(list);
  };

  const fetchRolePrivilegeMapping = async () => {
    const res = await api.post("/user/all-role-privilage");
    const d = res.data;
    let list: Role[] = [];
    if (Array.isArray(d)) list = d;
    else if (d && Array.isArray(d.data)) list = d.data;
    setRoles(list);
  };

  useEffect(() => {
    fetchRoles();
    fetchPrivileges();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post("/user/create-role", { name: newRole.name });
      setShowCreateModal(false);
      setNewRole({ name: "" });
      await fetchRoles();
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAssignPrivileges = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignLoading(true);
    try {
      await api.post("/user/assign-privilage", {
        roleId: assignState.roleId,
        privilegeIds: assignState.privilegeIds,
      });
      setShowAssignModal(false);
      setAssignState({ roleId: 0, privilegeIds: [] });
      await fetchRolePrivilegeMapping();
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8 relative">
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Role Management</h2>
          <p className="text-sm text-gray-400 mt-1">Configure user roles and associated privileges.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasPermission("privilege_assign") && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <CheckSquare className="h-4 w-4" />
              Assign Privileges
            </button>
          )}
          {hasPermission("role_create") && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-500 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Create Role
            </button>
          )}
        </div>
      </div>

      {!hasPermission("role_view") ? (
        <div className="glass-card rounded-2xl border border-white/5 p-12 text-center">
          <ShieldAlert className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Access Restricted</h3>
          <p className="text-gray-500 mt-2">You don't have permission to view roles.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white">Roles & Permissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-white/[0.01] text-[10px] uppercase text-gray-500 font-bold tracking-widest border-b border-white/5">
                  <th className="px-8 py-4">Role Name</th>
                  <th className="px-8 py-4">Defined Privileges</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-500 italic">
                      No roles created yet.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Shield className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-gray-200">{role.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {(role.privileges || []).length === 0 ? (
                            <span className="text-[10px] text-gray-600 font-bold uppercase italic tracking-tighter">No Privileges Assigned</span>
                          ) : (
                            (role.privileges || []).map((p) => (
                              <span
                                key={p.id}
                                className="inline-flex items-center rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 uppercase"
                              >
                                {p.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
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

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">New System Role</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Manager"
                  className="block w-full rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ name: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50 transition-all"
                >
                  {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Privileges Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          <div className="relative w-full max-w-lg glass-card rounded-2xl border border-white/10 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Attach Privileges</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAssignPrivileges} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2">Target Role</label>
                <select
                  className="block w-full appearance-none rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500 transition-all"
                  value={assignState.roleId}
                  onChange={(e) => setAssignState({ ...assignState, roleId: Number(e.target.value) })}
                >
                  <option value={0} className="bg-gray-900">Select role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id} className="bg-gray-900">{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-3">Privileges Map</label>
                <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {privileges.map((p) => {
                    const checked = assignState.privilegeIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={cn(
                          "relative flex items-center justify-between pointer-cursor p-3 rounded-xl border transition-all duration-200",
                          checked ? "bg-indigo-500/10 border-indigo-500/40" : "bg-white/5 border-white/5 hover:bg-white/[0.07]"
                        )}
                      >
                        <span className={cn("text-xs font-medium", checked ? "text-indigo-400" : "text-gray-400")}>{p.name}</span>
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500/50 bg-transparent"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...assignState.privilegeIds, p.id]
                              : assignState.privilegeIds.filter((id) => id !== p.id);
                            setAssignState({ ...assignState, privilegeIds: next });
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignLoading}
                  className="rounded-xl bg-indigo-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {assignLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <> <ShieldAlert className="h-4 w-4" /> Finalize Changes </>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
