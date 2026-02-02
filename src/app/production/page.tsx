"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Loader2, Factory, Filter, Search, X, Calendar, User, Package, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface ProductionEntry {
  id: number;
  employeeName: string;
  itemName: string;
  quantity: number;
  workDate: string;
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
  const { hasPermission } = useAuth();
  const [entries, setEntries] = useState<ProductionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [filters, setFilters] = useState({
    employeeId: 0,
    itemId: 0,
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    page: 0,
    size: 20
  });

  const [newEntry, setNewEntry] = useState({
    employeeId: "",
    itemId: "",
    quantity: 0
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const userRes = await api.post("/user/all");
        const userData = userRes.data;
        let usersList: any[] = Array.isArray(userData) ? userData : (userData?.data || []);

        const employeeList = usersList
          .filter((u: any) => u.employeeResponseDto)
          .map((u: any) => ({
            id: u.employeeResponseDto.id,
            firstName: u.employeeResponseDto.firstName,
            lastName: u.employeeResponseDto.lastName
          }));
        setEmployees(employeeList);

        const itemRes = await api.post("/items/all", { page: 0, size: 100 });
        const itemData = itemRes.data;
        let itemsList: Item[] = Array.isArray(itemData) ? itemData : (itemData?.data || itemData?.content || []);
        setItems(itemsList);
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      }
    };
    fetchMetadata();
    fetchProductionEntries();
  }, []);

  const fetchProductionEntries = async () => {
    try {
      setLoading(true);
      const payload = {
        ...filters,
        employeeId: Number(filters.employeeId) || null,
        itemId: Number(filters.itemId) || null
      };

      const response = await api.post("/production/filter", payload);
      const data = response.data;

      let entryList: ProductionEntry[] = Array.isArray(data) ? data : (data?.data || data?.content || []);
      setEntries(entryList);
    } catch (error) {
      console.error("Failed to fetch production entries", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post("/production/add-production-entry", {
        employeeId: Number(newEntry.employeeId),
        itemId: Number(newEntry.itemId),
        quantity: Number(newEntry.quantity)
      });
      setShowCreateModal(false);
      setNewEntry({ employeeId: "", itemId: "", quantity: 0 });
      fetchProductionEntries();
    } catch (error) {
      console.error("Failed to create entry", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const totalAmount = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);

  return (
    <div className="space-y-8 pb-8 relative">
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Production Management</h2>
          <p className="text-sm text-gray-500 mt-1">Track daily production output and earnings.</p>
        </div>
        {hasPermission("production_create") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-500 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            New Entry
          </button>
        )}
      </div>

      {/* Stats and Filter Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-500/20">
                <Factory className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Monthly Value</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalAmount)}
              </h3>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{entries.length} Entries Loaded</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 glass-card rounded-2xl border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-4 w-4 text-blue-500" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Filter Parameters</h3>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Employee</label>
              <select
                className="block w-full rounded-xl border-none bg-white/5 px-4 py-2.5 text-sm text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                value={filters.employeeId}
                onChange={(e) => setFilters({ ...filters, employeeId: Number(e.target.value) })}
              >
                <option value={0} className="bg-gray-900">All Personnel</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id} className="bg-gray-900">{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Item</label>
              <select
                className="block w-full rounded-xl border-none bg-white/5 px-4 py-2.5 text-sm text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                value={filters.itemId}
                onChange={(e) => setFilters({ ...filters, itemId: Number(e.target.value) })}
              >
                <option value={0} className="bg-gray-900">All Products</option>
                {items.map(item => (
                  <option key={item.id} value={item.id} className="bg-gray-900">{item.itemName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Start Date</label>
              <input
                type="date"
                className="block w-full rounded-xl border-none bg-white/5 px-4 py-2 text-sm text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">End Date</label>
              <input
                type="date"
                className="block w-full rounded-xl border-none bg-white/5 px-4 py-2 text-sm text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button
                type="button"
                onClick={fetchProductionEntries}
                className="rounded-xl bg-white/5 px-8 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Query Records
              </button>
            </div>
          </form>
        </div>
      </div>

      {!hasPermission("production_view") ? (
        <div className="glass-card rounded-2xl border border-white/5 p-12 text-center">
          <Zap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Access Restricted</h3>
          <p className="text-gray-500 mt-2">You don't have permission to view production reports.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-white/[0.01] text-[10px] uppercase text-gray-500 font-bold tracking-widest border-b border-white/5">
                  <th className="px-8 py-4">Work Date</th>
                  <th className="px-8 py-4">Team Member</th>
                  <th className="px-8 py-4">Product Name</th>
                  <th className="px-8 py-4 text-right">Qty</th>
                  <th className="px-8 py-4 text-right">Computed Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-gray-500 italic">
                      No production records match your criteria.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {entry.workDate}
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-400 border border-blue-500/20">
                            <User className="h-3 w-3" />
                          </div>
                          {entry.employeeName}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Package className="h-3.5 w-3.5" />
                          {entry.itemName}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right font-mono text-gray-200">{entry.quantity}</td>
                      <td className="px-8 py-5 text-right font-bold text-emerald-400">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(entry.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white disabled:opacity-30" disabled>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white disabled:opacity-30" disabled>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Page 1 of 1</p>
          </div>
        </div>
      )}

      {/* Create Entry Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">New Production Entry</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Assigned Employee</label>
                <select
                  required
                  className="block w-full rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                  value={newEntry.employeeId}
                  onChange={(e) => setNewEntry({ ...newEntry, employeeId: e.target.value })}
                >
                  <option value="" className="bg-gray-900">Select personnel...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-gray-900">{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Cataloug Item</label>
                <select
                  required
                  className="block w-full rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                  value={newEntry.itemId}
                  onChange={(e) => setNewEntry({ ...newEntry, itemId: e.target.value })}
                >
                  <option value="" className="bg-gray-900">Select product...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id} className="bg-gray-900">{item.itemName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Quantity Completed</label>
                <div className="relative">
                  <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter numeric value"
                    className="block w-full rounded-xl border-none bg-white/5 pl-10 pr-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                    value={newEntry.quantity || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, quantity: parseFloat(e.target.value) })}
                  />
                </div>
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
                  className="rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
