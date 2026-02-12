"use client";

import { useEffect, useState } from "react";
import { Building2, ListChecks, Send, TrendingUp, Mail, Eye, MessageSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Analytics {
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
    details: string | null;
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

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
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
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overview = data?.overview || { totalBusinesses: 0, totalLists: 0, totalCampaigns: 0, totalDeals: 0 };
  const emailStats = data?.emailStats || {};
  const pipeline = data?.pipeline || [];
  const activities = data?.recentActivities || [];

  const statCards = [
    { label: "Businesses in Database", value: overview.totalBusinesses.toLocaleString(), icon: Building2, color: "bg-blue-500", href: "/businesses" },
    { label: "My Lists", value: overview.totalLists, icon: ListChecks, color: "bg-emerald-500", href: "/lists" },
    { label: "Active Campaigns", value: overview.totalCampaigns, icon: Send, color: "bg-purple-500", href: "/outreach" },
    { label: "Deals in Pipeline", value: overview.totalDeals, icon: TrendingUp, color: "bg-amber-500", href: "/pipeline" },
  ];

  const emailMetrics = [
    { label: "Sent", value: emailStats.sent || 0, icon: Mail, color: "text-blue-600" },
    { label: "Opened", value: emailStats.opened || 0, icon: Eye, color: "text-emerald-600" },
    { label: "Replied", value: emailStats.replied || 0, icon: MessageSquare, color: "text-purple-600" },
    { label: "Bounced", value: emailStats.bounced || 0, icon: AlertTriangle, color: "text-red-600" },
  ];

  const totalPipelineValue = pipeline.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your sales overview at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            {emailMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <metric.icon size={20} className={metric.color} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Summary</h2>
            <span className="text-sm font-medium text-emerald-600">
              ${totalPipelineValue.toLocaleString()} total
            </span>
          </div>
          <div className="space-y-3">
            {pipeline.length === 0 ? (
              <p className="text-sm text-gray-500">No deals yet. Start prospecting!</p>
            ) : (
              pipeline.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-700">{stageLabels[stage.stage] || stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{stage.count} deals</span>
                    <span className="text-sm text-gray-500">${stage.value.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity. Get started by searching for businesses!</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.title}</p>
                  {activity.business && (
                    <p className="text-xs text-gray-500">{activity.business.name}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
