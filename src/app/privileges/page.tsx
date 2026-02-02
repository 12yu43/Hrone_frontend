"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Loader2, Key, MoreVertical, X, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Privilege {
  id: number;
  name: string;
}

export default function PrivilegesPage() {
  const { hasPermission } = useAuth();
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPrivilege, setNewPrivilege] = useState({ name: "" });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchPrivileges = async () => {
    try {
      setLoading(true);
      const res = await api.post("/user/all-privilage");
      const d = res.data;
      let list: Privilege[] = [];
      if (Array.isArray(d)) list = d;
      else if (d && Array.isArray(d.data)) list = d.data;
      setPrivileges(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivileges();
  }, []);

  const handleCreatePrivilege = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post("/user/create-privilege", { name: newPrivilege.name });
      setShowCreateModal(false);
      setNewPrivilege({ name: "" });
      await fetchPrivileges();
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8 relative">
      <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-blue-600/5 blur-[80px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Privilege Management</h2>
          <p className="text-sm text-gray-400 mt-1">Define and manage granular system permissions.</p>
        </div>
        {hasPermission("privilege_create") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-500 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Privilege
          </button>
        )}
      </div>

      {!hasPermission("privilege_view") ? (
        <div className="max-w-4xl glass-card rounded-2xl border border-white/5 p-12 text-center">
          <ShieldAlert className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Access Restricted</h3>
          <p className="text-gray-500 mt-2">You don't have permission to view privileges.</p>
        </div>
      ) : (
        <div className="max-w-4xl glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white">System Privileges</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-white/[0.01] text-[10px] uppercase text-gray-500 font-bold tracking-widest border-b border-white/5">
                  <th className="px-8 py-4">Privilege Title</th>
                  <th className="px-8 py-4">Identifier</th>
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
                ) : privileges.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-500 italic">
                      No privileges defined yet.
                    </td>
                  </tr>
                ) : (
                  privileges.map((p) => (
                    <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Key className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-gray-200">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <code className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">PRIV_{p.id}</code>
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">New Privilege</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrivilege} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2">Privilege Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAN_EDIT_USERS"
                  className="block w-full rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  value={newPrivilege.name}
                  onChange={(e) => setNewPrivilege({ name: e.target.value })}
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
                  {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Privilege"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
