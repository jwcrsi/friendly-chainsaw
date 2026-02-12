"use client";

import { useEffect, useState } from "react";
import { Plus, Send, Pause, Play, Mail, Eye, MessageSquare, MoreVertical } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: string;
  totalSent: number;
  totalOpened: number;
  totalReplied: number;
  totalBounced: number;
  createdAt: string;
  updatedAt: string;
  list: { id: string; name: string } | null;
  _count: { emails: number };
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-blue-100 text-blue-700",
};

const statusIcons: Record<string, React.ReactNode> = {
  draft: <Mail size={14} />,
  active: <Play size={14} />,
  paused: <Pause size={14} />,
  completed: <Send size={14} />,
};

export default function OutreachPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [lists, setLists] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedList, setSelectedList] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/campaigns").then((r) => r.json()),
      fetch("/api/lists").then((r) => r.json()),
    ])
      .then(([campaignData, listData]) => {
        setCampaigns(campaignData);
        setLists(listData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, body, listId: selectedList || undefined }),
      });
      const campaign = await res.json();
      setCampaigns([campaign, ...campaigns]);
      setShowCreate(false);
      setName("");
      setSubject("");
      setBody("");
      setSelectedList("");
    } catch (err) {
      console.error(err);
    }
  };

  const totalSent = campaigns.reduce((sum, c) => sum + c.totalSent, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.totalOpened, 0);
  const totalReplied = campaigns.reduce((sum, c) => sum + c.totalReplied, 0);
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const replyRate = totalSent > 0 ? ((totalReplied / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outreach Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage your email campaigns and track performance</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Send size={16} className="text-blue-500" />
            <span className="text-sm text-gray-500">Total Sent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalSent}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-emerald-500" />
            <span className="text-sm text-gray-500">Open Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{openRate}%</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={16} className="text-purple-500" />
            <span className="text-sm text-gray-500">Reply Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{replyRate}%</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={16} className="text-amber-500" />
            <span className="text-sm text-gray-500">Campaigns</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
        </div>
      </div>

      {/* Create campaign form */}
      {showCreate && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Campaign</h2>
          <form onSubmit={createCampaign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  placeholder="Q1 Restaurant Outreach"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target List</label>
                <select
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                >
                  <option value="">No list selected</option>
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                placeholder="Grow your business with our solution"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                placeholder="Hi {{business_name}},&#10;&#10;I noticed your business and wanted to reach out..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Create Campaign
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaign list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Send size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns yet</h3>
          <p className="text-gray-500 mb-4">Create your first campaign to start reaching local businesses</p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                      {statusIcons[campaign.status]}
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Subject: {campaign.subject}</p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Mail size={14} />
                      <span>{campaign.totalSent} sent</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye size={14} />
                      <span>{campaign.totalOpened} opened</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageSquare size={14} />
                      <span>{campaign.totalReplied} replied</span>
                    </div>
                    {campaign.list && (
                      <span className="text-gray-400">List: {campaign.list.name}</span>
                    )}
                  </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
