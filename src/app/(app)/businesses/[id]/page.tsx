"use client";

import { useEffect, useState, use } from "react";
import { Star, MapPin, Phone, Mail, Globe, Facebook, Instagram, Linkedin, ArrowLeft, Send, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  googleRating: number | null;
  reviewCount: number;
  re2Score: number;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  yearEstablished: number | null;
  employeeCount: number | null;
  annualRevenue: string | null;
  outreachEmails: Array<{
    id: string;
    subject: string | null;
    status: string;
    channel: string;
    sentAt: string | null;
    createdAt: string;
  }>;
  deals: Array<{
    id: string;
    title: string;
    value: number;
    stage: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    title: string;
    details: string | null;
    createdAt: string;
  }>;
}

const stageColors: Record<string, string> = {
  lead: "bg-gray-100 text-gray-700",
  contacted: "bg-blue-100 text-blue-700",
  meeting: "bg-purple-100 text-purple-700",
  proposal: "bg-amber-100 text-amber-700",
  negotiation: "bg-orange-100 text-orange-700",
  closed_won: "bg-emerald-100 text-emerald-700",
  closed_lost: "bg-red-100 text-red-700",
};

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    fetch(`/api/businesses/${id}`)
      .then((r) => r.json())
      .then(setBusiness)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Business not found</h2>
        <Link href="/businesses" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
          Back to businesses
        </Link>
      </div>
    );
  }

  const scoreColor = business.re2Score >= 80 ? "text-emerald-600" : business.re2Score >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back link */}
      <Link href="/businesses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to businesses
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {business.category}
              </span>
              {business.subcategory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {business.subcategory}
                </span>
              )}
            </div>
            {business.description && (
              <p className="text-gray-600 mb-4 max-w-2xl">{business.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={14} />{business.address}, {business.city}, {business.state} {business.zipCode}</span>
              {business.googleRating && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  {business.googleRating} ({business.reviewCount} reviews)
                </span>
              )}
              {business.yearEstablished && (
                <span className="flex items-center gap-1"><Calendar size={14} />Est. {business.yearEstablished}</span>
              )}
            </div>
          </div>

          <div className="text-center ml-6">
            <div className={`text-4xl font-bold ${scoreColor}`}>{business.re2Score}</div>
            <div className="text-xs text-gray-500 mt-1">RE2 Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Contact info & socials */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{business.phone}</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{business.email}</span>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-400" />
                  <span className="text-sm text-blue-600">{business.website}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
            <div className="space-y-3">
              {business.facebook && (
                <div className="flex items-center gap-3">
                  <Facebook size={16} className="text-blue-600" />
                  <span className="text-sm text-gray-700">{business.facebook}</span>
                </div>
              )}
              {business.instagram && (
                <div className="flex items-center gap-3">
                  <Instagram size={16} className="text-pink-600" />
                  <span className="text-sm text-gray-700">{business.instagram}</span>
                </div>
              )}
              {business.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin size={16} className="text-blue-700" />
                  <span className="text-sm text-gray-700">{business.linkedin}</span>
                </div>
              )}
              {!business.facebook && !business.instagram && !business.linkedin && (
                <p className="text-sm text-gray-400">No social profiles listed</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h2>
            <div className="space-y-3 text-sm">
              {business.employeeCount && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Employees</span>
                  <span className="text-gray-900 font-medium">{business.employeeCount}</span>
                </div>
              )}
              {business.annualRevenue && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Annual Revenue</span>
                  <span className="text-gray-900 font-medium">{business.annualRevenue}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle column - Quick actions & outreach */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <Send size={16} /> Send Email
              </button>
              <Link
                href={`/pipeline?businessId=${business.id}`}
                className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                <TrendingUp size={16} /> Create Deal
              </Link>
            </div>
          </div>

          {showEmailForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Email</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input type="text" value={business.email || ""} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                    placeholder="Enter subject..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                    placeholder="Write your message..."
                  />
                </div>
                <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  Send Email
                </button>
              </div>
            </div>
          )}

          {/* Outreach history */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Outreach History</h2>
            {business.outreachEmails.length === 0 ? (
              <p className="text-sm text-gray-400">No outreach yet</p>
            ) : (
              <div className="space-y-3">
                {business.outreachEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{email.subject || "(no subject)"}</p>
                      <p className="text-xs text-gray-500">{email.channel} - {email.status}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {email.sentAt ? new Date(email.sentAt).toLocaleDateString() : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Deals & Activity */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deals</h2>
            {business.deals.length === 0 ? (
              <p className="text-sm text-gray-400">No deals yet</p>
            ) : (
              <div className="space-y-3">
                {business.deals.map((deal) => (
                  <div key={deal.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{deal.title}</p>
                      <span className="text-sm font-medium text-emerald-600">${deal.value.toLocaleString()}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[deal.stage] || "bg-gray-100 text-gray-700"}`}>
                      {deal.stage.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            {business.activities.length === 0 ? (
              <p className="text-sm text-gray-400">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {business.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      {activity.details && <p className="text-xs text-gray-500">{activity.details}</p>}
                      <p className="text-xs text-gray-400 mt-1">{new Date(activity.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
