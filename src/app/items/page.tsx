"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";

interface Item {
  id: number;
  itemName: string;
  rate: number;
  unit: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Form State
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
        size: 100 // Fetch reasonably large size for now
      });
      
      const responseData = response.data;
      // Handle response structure similar to users
      if (Array.isArray(responseData)) {
         setItems(responseData);
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
         setItems(responseData.data);
      } else if (responseData && responseData.content && Array.isArray(responseData.content)) {
         setItems(responseData.content);
      } else if (responseData && responseData.data && responseData.data.content && Array.isArray(responseData.data.content)) {
         setItems(responseData.data.content);
      } else {
         console.warn("Unexpected item data format", responseData);
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
      fetchItems(); // Refresh list
    } catch (error) {
      console.error("Failed to create item", error);
      alert("Failed to create item");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Item Master</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Loading items...
                    </td>
                 </tr>
              ) : items.length === 0 ? (
                <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        No items found
                    </td>
                 </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.itemName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.rate}</td>
                    <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rate</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  value={newItem.rate}
                  onChange={(e) => setNewItem({...newItem, rate: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
                  placeholder="e.g. kg, pcs"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
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
                  {createLoading ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
