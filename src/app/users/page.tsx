"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Search, Loader2 } from "lucide-react";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [assignState, setAssignState] = useState({ userId: 0, roleId: 0 });

  // Create Form State
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    employeeCode: ""
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.post("/user/all");
      // The API returns { status, message, count, data: [...] } based on schema
      // But sometimes 'data' is the array directly or wrapped. 
      // Based on schema: { status: 0, message: "string", count: 0, data: "string" }
      // Wait, data is string? It might be JSON string or the schema is generic.
      // Let's assume data is the array or inside data.data if it follows common patterns.
      // If the schema says "data": "string", it might mean it returns a serialized object or list.
      // Or it's a generic wrapper. Let's try to handle it safely.
      
      const responseData = response.data;
      if (Array.isArray(responseData)) {
         setUsers(responseData);
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
         setUsers(responseData.data);
      } else {
         console.warn("Unexpected user data format", responseData);
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const payload = {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
        roles: ["USER"], // Default role, or add role selection
        employee: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          department: newUser.department,
          designation: newUser.designation,
          joiningDate: newUser.joiningDate,
          employeeCode: newUser.employeeCode
        }
      };

      await api.post("/user/create", payload);
      setShowCreateModal(false);
      setNewUser({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        department: "",
        designation: "",
        joiningDate: "",
        employeeCode: ""
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Failed to create user", error);
      alert("Failed to create user");
    } finally {
      setCreateLoading(false);
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <form onSubmit={handleAssignRole} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">User</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              value={assignState.userId}
              onChange={(e) => setAssignState({ ...assignState, userId: Number(e.target.value) })}
            >
              <option value={0}>Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
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
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 shadow-sm"
            >
              Assign Role
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading users...
                    </td>
                 </tr>
              ) : users.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No users found
                    </td>
                 </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.employeeResponseDto?.firstName} {user.employeeResponseDto?.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.username}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.employeeResponseDto?.department}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.roles.map((role) => {
                        const label = typeof role === "string" ? role : role?.name;
                        const key = typeof role === "string" ? role : String(role?.id ?? role?.name);
                        return (
                          <span key={key} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-1">
                            {label}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New User</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.designation}
                    onChange={(e) => setNewUser({...newUser, designation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee Code</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.employeeCode}
                    onChange={(e) => setNewUser({...newUser, employeeCode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                    value={newUser.joiningDate}
                    onChange={(e) => setNewUser({...newUser, joiningDate: e.target.value})}
                  />
                </div>
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
                  {createLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
