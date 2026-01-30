 "use client";
 
 import { useEffect, useState } from "react";
 import api from "@/lib/api";
 import { Plus, Loader2, CheckSquare } from "lucide-react";
 
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
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold tracking-tight text-gray-900">Role Management</h2>
         <div className="flex items-center gap-2">
           <button
             onClick={() => setShowAssignModal(true)}
             className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 shadow-sm"
           >
             <CheckSquare className="h-4 w-4" />
             Assign Privileges
           </button>
           <button
             onClick={() => setShowCreateModal(true)}
             className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm"
           >
             <Plus className="h-4 w-4" />
             Create Role
           </button>
         </div>
       </div>
 
       <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-700 font-medium">
               <tr>
                 <th className="px-6 py-4">Role</th>
                 <th className="px-6 py-4">Privileges</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {loading ? (
                 <tr>
                   <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                     <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                     Loading roles...
                   </td>
                 </tr>
               ) : roles.length === 0 ? (
                 <tr>
                   <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                     No roles found
                   </td>
                 </tr>
               ) : (
                 roles.map((role) => (
                   <tr key={role.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
                     <td className="px-6 py-4 text-gray-600">
                       {(role.privileges || []).length === 0 ? (
                         <span className="text-gray-400">No privileges</span>
                       ) : (
                         (role.privileges || []).map((p) => (
                           <span
                             key={p.id}
                             className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-1"
                           >
                             {p.name}
                           </span>
                         ))
                       )}
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
       </div>
 
       {showCreateModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-semibold text-gray-900">Create Role</h3>
               <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                 ✕
               </button>
             </div>
 
             <form onSubmit={handleCreateRole} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Role Name</label>
                 <input
                   type="text"
                   required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                   value={newRole.name}
                   onChange={(e) => setNewRole({ name: e.target.value })}
                 />
               </div>
 
               <div className="flex justify-end gap-3 mt-6">
                 <button
                   type="button"
                   onClick={() => setShowCreateModal(false)}
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={createLoading}
                   className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-70"
                 >
                   {createLoading ? "Saving..." : "Save"}
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
 
       {showAssignModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-semibold text-gray-900">Assign Privileges to Role</h3>
               <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-500">
                 ✕
               </button>
             </div>
 
             <form onSubmit={handleAssignPrivileges} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Role</label>
                 <select
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                   value={assignState.roleId}
                   onChange={(e) => setAssignState({ ...assignState, roleId: Number(e.target.value) })}
                 >
                   <option value={0}>Select Role</option>
                   {roles.map((r) => (
                     <option key={r.id} value={r.id}>
                       {r.name}
                     </option>
                   ))}
                 </select>
               </div>
 
               <div>
                 <label className="block text-sm font-medium text-gray-700">Privileges</label>
                 <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded-md">
                   {privileges.map((p) => {
                     const checked = assignState.privilegeIds.includes(p.id);
                     return (
                       <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700">
                         <input
                           type="checkbox"
                           checked={checked}
                           onChange={(e) => {
                             const next = e.target.checked
                               ? [...assignState.privilegeIds, p.id]
                               : assignState.privilegeIds.filter((id) => id !== p.id);
                             setAssignState({ ...assignState, privilegeIds: next });
                           }}
                         />
                         <span>{p.name}</span>
                       </label>
                     );
                   })}
                 </div>
               </div>
 
               <div className="flex justify-end gap-3 mt-6">
                 <button
                   type="button"
                   onClick={() => setShowAssignModal(false)}
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={assignLoading}
                   className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 disabled:opacity-70"
                 >
                   {assignLoading ? "Assigning..." : "Assign"}
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
     </div>
   );
 }
