"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Star, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, Plus, X, Building2 } from "lucide-react";
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
}

interface BusinessResponse {
  businesses: Business[];
  total: number;
  page: number;
  totalPages: number;
}

const categories = [
  "All Categories",
  "Restaurant",
  "Retail",
  "Salon & Spa",
  "Medical",
  "Fitness",
  "Coffee Shop",
  "Bar & Nightlife",
  "Auto Services",
  "Home Services",
  "Professional Services",
];

const states = [
  "", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-100 text-emerald-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>RE2: {score}</span>;
}

export default function BusinessesPage() {
  const [data, setData] = useState<BusinessResponse>({ businesses: [], total: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [addingToList, setAddingToList] = useState<string | null>(null);
  const [lists, setLists] = useState<Array<{ id: string; name: string }>>([]);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "All Categories") params.set("category", category);
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    if (minRating !== "0") params.set("minRating", minRating);
    params.set("page", page.toString());

    try {
      const res = await fetch(`/api/businesses?${params}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, category, city, state, minRating, page]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    fetch("/api/lists").then(r => r.json()).then(setLists).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBusinesses();
  };

  const addToList = async (listId: string, businessId: string) => {
    try {
      await fetch(`/api/lists/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      setAddingToList(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Database</h1>
          <p className="text-gray-500 mt-1">{data.total.toLocaleString()} businesses found</p>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses by name, category, or keyword..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
        >
          <Filter size={20} />
          Filters
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              {categories.map((c) => <option key={c} value={c === "All Categories" ? "" : c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => { setCity(e.target.value); setPage(1); }}
              placeholder="Any city"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={state}
              onChange={(e) => { setState(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="">All States</option>
              {states.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            >
              <option value="0">Any rating</option>
              <option value="3">3+ stars</option>
              <option value="3.5">3.5+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : data.businesses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No businesses found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.businesses.map((biz) => (
            <div key={biz.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link href={`/businesses/${biz.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                      {biz.name}
                    </Link>
                    <ScoreBadge score={biz.re2Score} />
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {biz.category}
                    </span>
                  </div>

                  {biz.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{biz.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {biz.city}, {biz.state} {biz.zipCode}
                    </span>
                    {biz.googleRating && (
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        {biz.googleRating} ({biz.reviewCount} reviews)
                      </span>
                    )}
                    {biz.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {biz.phone}
                      </span>
                    )}
                    {biz.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {biz.email}
                      </span>
                    )}
                    {biz.website && (
                      <span className="flex items-center gap-1">
                        <Globe size={14} />
                        Website
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative ml-4">
                  <button
                    onClick={() => setAddingToList(addingToList === biz.id ? null : biz.id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Plus size={16} />
                    Add to List
                  </button>

                  {addingToList === biz.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <div className="flex items-center justify-between px-2 py-1 mb-1">
                          <span className="text-xs font-medium text-gray-500">Select a list</span>
                          <button onClick={() => setAddingToList(null)}><X size={14} className="text-gray-400" /></button>
                        </div>
                        {lists.length === 0 ? (
                          <p className="text-xs text-gray-400 px-2 py-2">No lists yet</p>
                        ) : (
                          lists.map((list) => (
                            <button
                              key={list.id}
                              onClick={() => addToList(list.id, biz.id)}
                              className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded"
                            >
                              {list.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {data.page} of {data.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => setPage(Math.min(data.totalPages, page + 1))}
              disabled={page === data.totalPages}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
