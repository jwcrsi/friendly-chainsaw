"use client";

import { useEffect, useState } from "react";
import { Plus, DollarSign, Building2, GripVertical } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  priority: string;
  notes: string | null;
  createdAt: string;
  business: {
    id: string;
    name: string;
    category: string;
    city: string;
    state: string;
  };
}

const stages = [
  { key: "lead", label: "Lead", color: "border-gray-300 bg-gray-50" },
  { key: "contacted", label: "Contacted", color: "border-blue-300 bg-blue-50" },
  { key: "meeting", label: "Meeting", color: "border-purple-300 bg-purple-50" },
  { key: "proposal", label: "Proposal", color: "border-amber-300 bg-amber-50" },
  { key: "negotiation", label: "Negotiation", color: "border-orange-300 bg-orange-50" },
  { key: "closed_won", label: "Closed Won", color: "border-emerald-300 bg-emerald-50" },
  { key: "closed_lost", label: "Closed Lost", color: "border-red-300 bg-red-50" },
];

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-red-100 text-red-600",
};

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"board" | "list">("board");
  const [showCreate, setShowCreate] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: "", value: "", stage: "lead", priority: "medium", businessId: "", notes: "" });
  const [businesses, setBusinesses] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/deals").then((r) => r.json()),
      fetch("/api/businesses?limit=100").then((r) => r.json()),
    ])
      .then(([dealData, bizData]) => {
        setDeals(dealData);
        setBusinesses(bizData.businesses || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const createDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDeal, value: parseFloat(newDeal.value) || 0 }),
      });
      const deal = await res.json();
      setDeals([deal, ...deals]);
      setShowCreate(false);
      setNewDeal({ title: "", value: "", stage: "lead", priority: "medium", businessId: "", notes: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const updateDealStage = async (dealId: string, newStage: string) => {
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      setDeals(deals.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
    } catch (err) {
      console.error(err);
    }
  };

  const totalValue = deals.filter(d => d.stage !== "closed_lost").reduce((sum, d) => sum + d.value, 0);
  const wonValue = deals.filter((d) => d.stage === "closed_won").reduce((sum, d) => sum + d.value, 0);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-72 flex-shrink-0 h-96 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-500 mt-1">
            {deals.length} deals &middot; ${totalValue.toLocaleString()} pipeline &middot; ${wonValue.toLocaleString()} won
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView("board")}
              className={`px-3 py-2 text-sm ${view === "board" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Board
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 text-sm ${view === "list" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Plus size={16} /> New Deal
          </button>
        </div>
      </div>

      {/* Create deal form */}
      {showCreate && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Deal</h2>
          <form onSubmit={createDeal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
                <input
                  type="text"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                <input
                  type="number"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                <select
                  value={newDeal.businessId}
                  onChange={(e) => setNewDeal({ ...newDeal, businessId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  required
                >
                  <option value="">Select business</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={newDeal.stage}
                  onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                >
                  {stages.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newDeal.priority}
                  onChange={(e) => setNewDeal({ ...newDeal, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Create Deal
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Board view */}
      {view === "board" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            return (
              <div key={stage.key} className={`w-72 flex-shrink-0 rounded-xl border ${stage.color}`}>
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{stage.label}</h3>
                    <span className="text-xs text-gray-500">{stageDeals.length}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">${stageValue.toLocaleString()}</p>
                </div>
                <div className="p-2 space-y-2 min-h-[200px]">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{deal.title}</h4>
                        <GripVertical size={14} className="text-gray-300" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600">{deal.business?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                          <DollarSign size={14} />{deal.value.toLocaleString()}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityColors[deal.priority]}`}>
                          {deal.priority}
                        </span>
                      </div>
                      {/* Stage move buttons */}
                      <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                        {stages.filter(s => s.key !== deal.stage).slice(0, 3).map((s) => (
                          <button
                            key={s.key}
                            onClick={() => updateDealStage(deal.id, s.key)}
                            className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Deal</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Business</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Value</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Stage</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{deal.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{deal.business?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-emerald-600">${deal.value.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={deal.stage}
                      onChange={(e) => updateDealStage(deal.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded text-gray-700"
                    >
                      {stages.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[deal.priority]}`}>
                      {deal.priority}
                    </span>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No deals yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
