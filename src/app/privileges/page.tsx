 "use client";
 
 import { useEffect, useState } from "react";
 import api from "@/lib/api";
 import { Plus, Loader2 } from "lucide-react";
 
 interface Privilege {
   id: number;
   name: string;
 }
 
 export default function PrivilegesPage() {
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
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold tracking-tight text-gray-900">Privilege Management</h2>
         <button
           onClick={() => setShowCreateModal(true)}
           className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm"
         >
           <Plus className="h-4 w-4" />
           Create Privilege
         </button>
       </div>
 
       <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-700 font-medium">
               <tr>
                 <th className="px-6 py-4">Privilege</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {loading ? (
                 <tr>
                   <td colSpan={1} className="px-6 py-8 text-center text-gray-500">
                     <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                     Loading privileges...
                   </td>
                 </tr>
               ) : privileges.length === 0 ? (
                 <tr>
                   <td colSpan={1} className="px-6 py-8 text-center text-gray-500">
                     No privileges found
                   </td>
                 </tr>
               ) : (
                 privileges.map((p) => (
                   <tr key={p.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
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
               <h3 className="text-lg font-semibold text-gray-900">Create Privilege</h3>
               <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                 ✕
               </button>
             </div>
 
             <form onSubmit={handleCreatePrivilege} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Privilege Name</label>
                 <input
                   type="text"
                   required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                   value={newPrivilege.name}
                   onChange={(e) => setNewPrivilege({ name: e.target.value })}
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
     </div>
   );
 }
