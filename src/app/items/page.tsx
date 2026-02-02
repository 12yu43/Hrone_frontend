"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Loader2, Package, Search, MoreVertical, X, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Item {
  id: number;
  itemName: string;
  rate: number;
  unit: string;
}

export default function ItemsPage() {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newItem, setNewItem] = useState({
    itemName: "",
    rate: 0,
    unit: ""
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.post("/items/all", {
        page: 0,
        size: 100
      });

      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setItems(responseData);
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        setItems(responseData.data);
      } else if (responseData && responseData.content && Array.isArray(responseData.content)) {
        setItems(responseData.content);
      } else if (responseData && responseData.data && responseData.data.content && Array.isArray(responseData.data.content)) {
        setItems(responseData.data.content);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post("/items/add", newItem);
      setShowCreateModal(false);
      setNewItem({ itemName: "", rate: 0, unit: "" });
      fetchItems();
    } catch (error) {
      console.error("Failed to create item", error);
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-8 relative">
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-600/5 blur-[100px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Item Master</h2>
          <p className="text-sm text-gray-500 mt-1">Manage product catalog and pricing units.</p>
        </div>
        {hasPermission("item_create") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Add New Item
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex items-center gap-5">
          <div className="h-14 w-14 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Package className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Items</p>
            <h3 className="text-3xl font-bold text-white mt-0.5">{items.length}</h3>
          </div>
        </div>
      </div>

      {!hasPermission("item_view") ? (
        <div className="glass-card rounded-2xl border border-white/5 p-12 text-center">
          <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Access Restricted</h3>
          <p className="text-gray-500 mt-2">You don't have permission to view the item master.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white">Catalog List</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search items..."
                className="h-10 w-full md:w-72 rounded-xl bg-white/5 border-none pl-10 pr-4 text-sm text-gray-200 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-white/[0.01] text-[10px] uppercase text-gray-500 font-bold tracking-widest border-b border-white/5">
                  <th className="px-8 py-4">Item Details</th>
                  <th className="px-8 py-4">Price / Rate</th>
                  <th className="px-8 py-4">Unit</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-gray-500 italic">
                      No items found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-lg">
                            {item.itemName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200">{item.itemName}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: {item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-emerald-400">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.rate)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center rounded-lg bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                          {item.unit}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md glass-card rounded-2xl border border-white/10 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Add New Catalog Item</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Copper Wire"
                  className="block w-full rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-600 focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2">Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="block w-full rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-500"
                    value={newItem.rate || ""}
                    onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KG"
                    className="block w-full rounded-xl border-none bg-white/5 px-4 py-3 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-emerald-500"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
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
                  className="rounded-xl bg-emerald-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-50 transition-all"
                >
                  {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
