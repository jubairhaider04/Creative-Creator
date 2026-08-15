import React, { useState, useEffect } from "react";
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download, 
  RefreshCw, 
  Layers, 
  Globe, 
  Mail, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Filter
} from "lucide-react";
import { AnalyticsData, LeadInquiry, UserAuth } from "../types";
import { subscribeToLeadsFirestore, updateLeadStatusFirestore } from "../lib/firebase";

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAuth | null;
  onOpenAuth: () => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "crm" | "traffic">("overview");

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();

      // Real-time Firestore sync
      const unsubscribe = subscribeToLeadsFirestore((firestoreLeads) => {
        if (firestoreLeads && firestoreLeads.length > 0) {
          setLeads(prev => {
            // merge unique leads
            const map = new Map();
            firestoreLeads.forEach(l => map.set(l.id, l));
            prev.forEach(l => { if (!map.has(l.id)) map.set(l.id, l); });
            return Array.from(map.values());
          });
        }
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isOpen]);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/leads")
      ]);

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalytics(aData);
      }
      if (leadsRes.ok) {
        const lData = await leadsRes.json();
        setLeads(prev => {
          const map = new Map();
          (lData.leads || []).forEach((l: any) => map.set(l.id, l));
          prev.forEach(l => { if (!map.has(l.id)) map.set(l.id, l); });
          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      // Update in Firestore
      try {
        await updateLeadStatusFirestore(id, newStatus);
      } catch (fErr) {
        console.warn("Firestore update error:", fErr);
      }

      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus as any } : l));
      }
    } catch (err) {
      console.error("Error updating lead status:", err);
    }
  };

  const handleExportCsv = () => {
    if (!leads.length) return;
    const headers = "ID,Name,Email,Company,Services,Budget,Timeline,Status,EstimatedValue,CreatedAt\n";
    const rows = leads.map(l => 
      `"${l.id}","${l.name}","${l.email}","${l.company || ''}","${l.services.join(';')}",` +
      `"${l.budget}","${l.timeline}","${l.status}",${l.estimatedValue},"${l.createdAt}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `creative-creator-crm-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const filteredLeads = leads.filter(l => statusFilter === "all" || l.status === statusFilter);

  return (
    <div 
      id="analytics-dashboard-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="analytics-dashboard-modal"
        className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Studio Performance & CRM Hub</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-zinc-400">Real-time visitor conversion, service attribution, and lead pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-refresh-analytics"
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              id="btn-export-csv-report"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              id="btn-close-analytics-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-6 border-b border-zinc-800 bg-zinc-950 text-xs font-semibold text-zinc-400">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === "overview" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            Studio Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("crm")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "crm" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            <span>Inquiry CRM Pipeline</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px]">
              {leads.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("traffic")}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === "traffic" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            Traffic & Geo Intelligence
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && analytics && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Live Active Visitors</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {analytics.realTimeVisitors}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18% from last hour</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-zinc-400 text-xs mb-1">Inquiry Conversion</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                    {analytics.leadConversionRate}%
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Industry avg: 1.8%</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-zinc-400 text-xs mb-1">Active Pipeline Value</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    ${(analytics.pipelineMetrics.totalPipelineValue / 1000).toFixed(1)}k
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    {analytics.pipelineMetrics.totalInquiries} Qualified Leads
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="text-zinc-400 text-xs mb-1">Monthly Reach</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">
                    {analytics.monthlyVisitors.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Avg Session: {analytics.avgSessionDuration}</div>
                </div>
              </div>

              {/* Service Revenue & Projects Breakdown */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Revenue & Deliverables Share by Service Pillar
                </h3>
                <div className="space-y-3">
                  {analytics.serviceBreakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{item.name}</span>
                        <div className="text-zinc-400 flex items-center gap-3">
                          <span>{item.projectsCount} Projects</span>
                          <strong className="text-white font-mono">{item.revenueShare}</strong>
                          <span className="text-blue-400 font-bold">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CRM TAB */}
          {activeTab === "crm" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Filter bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-zinc-500 mr-1">Status:</span>
                  {["all", "new", "reviewing", "quoted", "closed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                        statusFilter === st ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-zinc-400 font-mono">
                  Showing {filteredLeads.length} of {leads.length} Inquiries
                </div>
              </div>

              {/* Leads Table */}
              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3.5">Client & Company</th>
                      <th className="p-3.5">Services</th>
                      <th className="p-3.5">Budget / Timeline</th>
                      <th className="p-3.5">Value</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{lead.name}</div>
                          <div className="text-[11px] text-zinc-400">{lead.email}</div>
                          {lead.company && <div className="text-[10px] text-blue-400 font-medium">{lead.company}</div>}
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {lead.services.map((s, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-zinc-200 font-medium">{lead.budget}</div>
                          <div className="text-[11px] text-zinc-500">{lead.timeline}</div>
                        </td>
                        <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                          ${(lead.estimatedValue || 10000).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize bg-zinc-900 border ${
                              lead.status === "new" ? "border-amber-500/50 text-amber-300" :
                              lead.status === "reviewing" ? "border-blue-500/50 text-blue-300" :
                              lead.status === "quoted" ? "border-purple-500/50 text-purple-300" :
                              "border-emerald-500/50 text-emerald-300"
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="quoted">Quoted</option>
                            <option value="closed">Closed / Won</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TRAFFIC TAB */}
          {activeTab === "traffic" && analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-200">
              {/* Traffic sources */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Acquisition Channels
                </h3>
                <div className="space-y-3">
                  {analytics.trafficSources.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-200 font-medium">{item.source}</span>
                        <span className="font-mono text-zinc-400">{item.visitors} ({item.share}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic breakdown */}
              <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Global Geographic Distribution
                </h3>
                <div className="space-y-3">
                  {analytics.topRegions.map((reg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{reg.flag}</span>
                        <span className="text-zinc-200 font-medium">{reg.country}</span>
                      </div>
                      <span className="font-mono font-bold text-white">{reg.share}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
