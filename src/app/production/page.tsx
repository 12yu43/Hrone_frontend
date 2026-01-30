"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Loader2, Filter } from "lucide-react";

// Interfaces based on potential API response
interface ProductionEntry {
  id: number;
  employeeName: string;
  itemName: string;
  quantity: number;
  date: string;
  amount: number;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

interface Item {
  id: number;
  itemName: string;
}

export default function ProductionPage() {
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Metadata for dropdowns
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Filter State
  const [filters, setFilters] = useState({
    employeeId: 0,
    itemId: 0,
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    page: 0,
    size: 20
  });

  // Create Form State
  const [newEntry, setNewEntry] = useState({
    employeeId: "",
    itemId: "",
    quantity: 0
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch all users/employees for dropdown
        const userRes = await api.post("/user/all"); 
        // Need to extract employees from user response or call employee endpoint if exists.
        // Assuming user/all returns users which have employee info
        const userData = userRes.data;
        let usersList: any[] = [];
        if (Array.isArray(userData)) {
            usersList = userData;
        } else if (userData && Array.isArray(userData.data)) {
            usersList = userData.data;
        }
        
        // Map users to employees format if needed
        const employeeList = usersList
            .filter((u: any) => u.employeeResponseDto)
            .map((u: any) => ({
                id: u.employeeResponseDto.id, // Assuming we need employee ID, not User ID
                firstName: u.employeeResponseDto.firstName,
                lastName: u.employeeResponseDto.lastName
            }));
        setEmployees(employeeList);

        // Fetch items for dropdown
        const itemRes = await api.post("/items/all", { page: 0, size: 100 });
        const itemData = itemRes.data;
        let itemsList: Item[] = [];
        if (Array.isArray(itemData)) {
            itemsList = itemData;
        } else if (itemData && Array.isArray(itemData.data)) {
            itemsList = itemData.data;
        } else if (itemData && Array.isArray(itemData.content)) {
            itemsList = itemData.content;
        }
        setItems(itemsList);

      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };
    fetchMetadata();
    // Initial fetch of production entries
    fetchProductionEntries();
  }, []);

  const fetchProductionEntries = async () => {
    try {
      setLoading(true);
      const payload = {
        ...filters,
        employeeId: Number(filters.employeeId),
        itemId: Number(filters.itemId)
      };
      
      const response = await api.post("/production/filter", payload);
      const data = response.data;
      
      // Handle response structure safely
      let entryList: ProductionEntry[] = [];
      if (Array.isArray(data)) {
        entryList = data;
      } else if (data && Array.isArray(data.data)) {
        entryList = data.data;
      } else if (data && Array.isArray(data.content)) {
        entryList = data.content;
      } else {
        console.warn("Unexpected production data format", data);
      }
      
      setEntries(entryList);
    } catch (error) {
      console.error("Failed to fetch production entries", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProductionEntries();
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const payload = {
        employeeId: Number(newEntry.employeeId),
        itemId: Number(newEntry.itemId),
        quantity: Number(newEntry.quantity)
      };

      await api.post("/production/add-production-entry", payload);
      setShowCreateModal(false);
      setNewEntry({ employeeId: "", itemId: "", quantity: 0 });
      fetchProductionEntries(); // Refresh list
    } catch (error) {
      console.error("Failed to create entry", error);
      alert("Failed to create production entry");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Production Entries</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Entry
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Employee</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              value={filters.employeeId}
              onChange={(e) => setFilters({...filters, employeeId: Number(e.target.value)})}
            >
              <option value={0}>All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Item</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              value={filters.itemId}
              onChange={(e) => setFilters({...filters, itemId: Number(e.target.value)})}
            >
              <option value={0}>All Items</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              value={filters.fromDate}
              onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
              value={filters.toDate}
              onChange={(e) => setFilters({...filters, toDate: e.target.value})}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 shadow-sm"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4 text-right">Quantity</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading entries...
                    </td>
                 </tr>
              ) : entries.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No production entries found
                    </td>
                 </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{entry.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{entry.employeeName}</td>
                    <td className="px-6 py-4 text-gray-600">{entry.itemName}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{entry.quantity}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(entry.amount || 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Entry Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Production Entry</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={newEntry.employeeId}
                  onChange={(e) => setNewEntry({...newEntry, employeeId: e.target.value})}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Item</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={newEntry.itemId}
                  onChange={(e) => setNewEntry({...newEntry, itemId: e.target.value})}
                >
                  <option value="">Select Item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.itemName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={newEntry.quantity}
                  onChange={(e) => setNewEntry({...newEntry, quantity: parseFloat(e.target.value)})}
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
                  {createLoading ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
