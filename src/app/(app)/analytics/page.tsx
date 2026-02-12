"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Mail, Eye, MessageSquare, DollarSign } from "lucide-react";

interface AnalyticsData {
  overview: {
    totalBusinesses: number;
    totalLists: number;
    totalCampaigns: number;
    totalDeals: number;
  };
  emailStats: Record<string, number>;
  pipeline: Array<{ stage: string; count: number; value: number }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    createdAt: string;
    business: { name: string } | null;
  }>;
}

const stageLabels: Record<string, string> = {
  lead: "Lead",
  contacted: "Contacted",
  meeting: "Meeting",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const stageColors: Record<string, string> = {
  lead: "bg-gray-400",
  contacted: "bg-blue-400",
  meeting: "bg-purple-400",
  proposal: "bg-amber-400",
  negotiation: "bg-orange-400",
  closed_won: "bg-emerald-400",
  closed_lost: "bg-red-400",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const emailStats = data?.emailStats || {};
  const pipeline = data?.pipeline || [];
  const totalSent = emailStats.sent || 0;
  const totalOpened = emailStats.opened || 0;
  const totalReplied = emailStats.replied || 0;
  const totalBounced = emailStats.bounced || 0;
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const replyRate = totalSent > 0 ? ((totalReplied / totalSent) * 100).toFixed(1) : "0";
  const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : "0";
  const totalPipelineValue = pipeline.reduce((sum, p) => sum + p.value, 0);
  const totalDealsCount = pipeline.reduce((sum, p) => sum + p.count, 0);
  const maxStageValue = Math.max(...pipeline.map((p) => p.value), 1);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Track your outreach and sales performance</p>
      </div>

      {/* Email Performance Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Email Performance</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{totalSent}</p>
            <p className="text-sm text-gray-500 mt-1">Total Sent</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{openRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Open Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{replyRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Reply Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{bounceRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Bounce Rate</p>
          </div>
        </div>

        {/* Email status bars */}
        <div className="space-y-3">
          {[
            { label: "Sent", value: totalSent, color: "bg-blue-500" },
            { label: "Opened", value: totalOpened, color: "bg-emerald-500" },
            { label: "Replied", value: totalReplied, color: "bg-purple-500" },
            { label: "Bounced", value: totalBounced, color: "bg-red-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-20">{item.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all`}
                  style={{ width: `${totalSent > 0 ? (item.value / totalSent) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Analytics */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Analytics</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Pipeline</p>
              <p className="text-xl font-bold text-gray-900">${totalPipelineValue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Deals</p>
              <p className="text-xl font-bold text-gray-900">{totalDealsCount}</p>
            </div>
          </div>
        </div>

        {/* Pipeline chart */}
        <div className="space-y-4">
          {pipeline.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No pipeline data yet</p>
          ) : (
            pipeline.map((stage) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {stageLabels[stage.stage] || stage.stage}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{stage.count} deals</span>
                    <span className="text-sm font-medium text-gray-900">${stage.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stageColors[stage.stage] || "bg-gray-400"} flex items-center px-3 transition-all`}
                    style={{ width: `${Math.max((stage.value / maxStageValue) * 100, 5)}%` }}
                  >
                    <span className="text-xs font-medium text-white">${stage.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <BarChart3 size={32} className="mx-auto text-blue-500 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{data?.overview.totalBusinesses.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Businesses in Database</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <Eye size={32} className="mx-auto text-emerald-500 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{data?.overview.totalCampaigns || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total Campaigns</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <DollarSign size={32} className="mx-auto text-amber-500 mb-3" />
          <p className="text-3xl font-bold text-gray-900">${totalPipelineValue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Pipeline Value</p>
        </div>
      </div>
    </div>
  );
}
