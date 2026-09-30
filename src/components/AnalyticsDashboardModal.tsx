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
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Database, 
  Briefcase, 
  FolderGit2, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { AnalyticsData, LeadInquiry, UserAuth, ServicePillar, Project, ServiceCategory } from "../types";
import { 
  subscribeToLeadsFirestore, 
  updateLeadStatusFirestore,
  seedServicesFirestore,
  saveServiceFirestore,
  deleteServiceFirestore,
  seedPortfolioFirestore,
  saveProjectFirestore,
  deleteProjectFirestore,
  fetchAllUsersFirestore,
  db
} from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAuth | null;
  onOpenAuth: () => void;
  services: ServicePillar[];
  projects: Project[];
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  services,
  projects
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "crm" | "services" | "portfolio" | "users" | "traffic">("overview");

  // Notifications / Feedback toast
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Service Edit / Create Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePillar | null>(null);

  // Project Edit / Create Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
      loadUsers();

      // Real-time Firestore sync for CRM leads
      const unsubscribe = subscribeToLeadsFirestore((firestoreLeads) => {
        if (firestoreLeads && firestoreLeads.length > 0) {
          setLeads(prev => {
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

  const loadUsers = async () => {
    const userList = await fetchAllUsersFirestore();
    setRegisteredUsers(userList);
  };

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
      await loadUsers();
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      await updateLeadStatusFirestore(id, newStatus);
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus as any } : l));
      }
      showNotification(`Lead status updated to ${newStatus}`);
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
    link.download = `bongio-digital-crm-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Seed Handlers
  const handleSeedServices = async () => {
    try {
      setIsRefreshing(true);
      await seedServicesFirestore();
      showNotification("Services seeded to Firestore successfully!");
    } catch (e: any) {
      showNotification("Error seeding services: " + e.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSeedPortfolio = async () => {
    try {
      setIsRefreshing(true);
      await seedPortfolioFirestore();
      showNotification("Portfolio projects seeded to Firestore successfully!");
    } catch (e: any) {
      showNotification("Error seeding portfolio: " + e.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Save Service Handler
  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = (formData.get("id") as string).trim() || `serv-${Date.now()}`;
    const title = formData.get("title") as ServiceCategory;
    const banglaTitle = formData.get("banglaTitle") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const startingPrice = formData.get("startingPrice") as string;
    const turnaroundTime = formData.get("turnaroundTime") as string;
    const highlightMetric = formData.get("highlightMetric") as string;
    const iconName = (formData.get("iconName") as string) || "Code2";
    const accentColor = (formData.get("accentColor") as string) || "blue";

    const featuresRaw = formData.get("keyFeatures") as string;
    const keyFeatures = featuresRaw.split("\n").map(s => s.trim()).filter(Boolean);

    const deliverablesRaw = formData.get("deliverables") as string;
    const deliverables = deliverablesRaw.split("\n").map(s => s.trim()).filter(Boolean);

    const techStackRaw = formData.get("techStack") as string;
    const techStack = techStackRaw.split(",").map(s => s.trim()).filter(Boolean);

    const serviceObj: ServicePillar = {
      id,
      title,
      banglaTitle,
      iconName,
      tagline,
      description,
      accentColor,
      startingPrice,
      turnaroundTime,
      highlightMetric,
      keyFeatures,
      deliverables,
      techStack,
      bn: {
        tagline,
        description,
        turnaroundTime,
        highlightMetric,
        keyFeatures,
        deliverables
      }
    };

    try {
      await saveServiceFirestore(serviceObj);
      showNotification(`Service "${title}" saved to Firestore.`);
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      showNotification("Error saving service: " + err.message);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service from Firestore?")) return;
    try {
      await deleteServiceFirestore(serviceId);
      showNotification("Service deleted from Firestore.");
    } catch (err: any) {
      showNotification("Error deleting service: " + err.message);
    }
  };

  // Save Project Handler
  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = (formData.get("id") as string).trim() || `proj-${Date.now()}`;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const category = formData.get("category") as ServiceCategory;
    const client = formData.get("client") as string;
    const year = (formData.get("year") as string) || "2025";
    const thumbnail = formData.get("thumbnail") as string;
    const liveUrl = (formData.get("liveUrl") as string) || "";
    const challenge = formData.get("challenge") as string;
    const solution = formData.get("solution") as string;
    const featured = formData.get("featured") === "on";

    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw.split(",").map(s => s.trim()).filter(Boolean);

    const deliverablesRaw = (formData.get("deliverables") as string) || "";
    const deliverables = deliverablesRaw.split("\n").map(s => s.trim()).filter(Boolean);

    const techStackRaw = (formData.get("techStack") as string) || "";
    const techStack = techStackRaw.split(",").map(s => s.trim()).filter(Boolean);

    const metric1Label = formData.get("metric1Label") as string;
    const metric1Value = formData.get("metric1Value") as string;
    const metric1Desc = formData.get("metric1Desc") as string;

    const metrics = metric1Label && metric1Value ? [
      { label: metric1Label, value: metric1Value, description: metric1Desc || "" }
    ] : (editingProject?.metrics || []);

    const projectObj: Project = {
      id,
      title,
      subtitle,
      category,
      client,
      year,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
      galleryImages: editingProject?.galleryImages || [thumbnail],
      tags: tags.length ? tags : ["Digital", "Production"],
      metrics,
      challenge,
      solution,
      deliverables: deliverables.length ? deliverables : ["Complete Handover"],
      techStack: techStack.length ? techStack : ["React", "TypeScript"],
      liveUrl,
      featured
    };

    try {
      await saveProjectFirestore(projectObj);
      showNotification(`Case Study "${title}" saved to Firestore.`);
      setIsProjectModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      showNotification("Error saving project: " + err.message);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this case study from Firestore?")) return;
    try {
      await deleteProjectFirestore(projectId);
      showNotification("Case study deleted from Firestore.");
    } catch (err: any) {
      showNotification("Error deleting project: " + err.message);
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "client" : "admin";
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setRegisteredUsers(registeredUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showNotification(`User role updated to ${newRole}`);
    } catch (err: any) {
      showNotification("Error updating user role: " + err.message);
    }
  };

  if (!isOpen) return null;

  const filteredLeads = leads.filter(l => statusFilter === "all" || l.status === statusFilter);

  return (
    <div 
      id="analytics-dashboard-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="analytics-dashboard-modal"
        className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Bongio Digital Admin & CRM Hub</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firestore Live Sync
                </span>
                {currentUser?.role === "admin" && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-500/30">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    Admin Access
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">Manage real-time Firestore collections: Users, Services, Portfolio, and Inquiries</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-refresh-analytics"
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              title="Refresh Telemetry & Firestore"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              id="btn-export-csv-report"
              onClick={handleExportCsv}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800"
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

        {/* Action toast feedback */}
        {actionMessage && (
          <div className="px-6 py-2 bg-blue-950/80 border-b border-blue-500/30 flex items-center justify-between text-xs text-blue-200 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-blue-400" />
              <span>{actionMessage}</span>
            </div>
            <button type="button" onClick={() => setActionMessage(null)} className="text-blue-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 px-6 border-b border-zinc-800 bg-zinc-950 text-xs font-semibold text-zinc-400 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "overview" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            Studio Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("crm")}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "crm" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            <span>Inquiry CRM</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px]">
              {leads.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "services" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Services CMS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px]">
              {services.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "portfolio" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Portfolio CMS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px]">
              {projects.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "users" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users & Auth</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px]">
              {registeredUsers.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("traffic")}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "traffic" ? "border-blue-500 text-white" : "border-transparent hover:text-zinc-200"
            }`}
          >
            Traffic & Analytics
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && analytics && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-medium">Real-Time Visitors</span>
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-mono">{analytics.realTimeVisitors}</span>
                    <span className="text-xs text-emerald-400 font-semibold">+18% today</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-medium">Active Leads in CRM</span>
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-mono">{leads.length}</span>
                    <span className="text-xs text-zinc-400">Total inquiries</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-medium">Firestore Services</span>
                    <Briefcase className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-mono">{services.length}</span>
                    <span className="text-xs text-emerald-400">Live published</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-medium">Portfolio Case Studies</span>
                    <FolderGit2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-mono">{projects.length}</span>
                    <span className="text-xs text-blue-400">Live showcase</span>
                  </div>
                </div>
              </div>

              {/* Database Quick Actions Bar */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-purple-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    Firebase Firestore Database Controls
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Sync default templates into Firestore collections (<code className="text-blue-300">users</code>, <code className="text-emerald-300">services</code>, <code className="text-purple-300">portfolio</code>)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSeedServices}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-all"
                  >
                    Sync Services
                  </button>
                  <button
                    type="button"
                    onClick={handleSeedPortfolio}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-medium transition-all"
                  >
                    Sync Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CRM TAB */}
          {activeTab === "crm" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-300">Filter Status:</span>
                  <div className="flex items-center gap-1">
                    {["all", "new", "reviewing", "quoted", "closed"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-xs capitalize font-medium transition-colors ${
                          statusFilter === st
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-zinc-400">Showing {filteredLeads.length} of {leads.length} records</span>
              </div>

              <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Services</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-zinc-400 text-[11px]">{lead.email}</div>
                          {lead.company && <div className="text-zinc-500 text-[10px]">{lead.company}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {lead.services.map((s, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{lead.budget}</td>
                        <td className="py-3 px-4 text-zinc-400">{lead.timeline}</td>
                        <td className="py-3 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1 outline-none"
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

          {/* SERVICES CMS TAB */}
          {activeTab === "services" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    Firestore Services Management
                  </h3>
                  <p className="text-xs text-zinc-400">All changes made here are saved directly to Firestore and reflect instantly in the app.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSeedServices}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
                      setIsServiceModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm">{service.title}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingService(service);
                              setIsServiceModalOpen(true);
                            }}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            title="Edit Service"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/20"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{service.tagline}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 mb-3">
                        <div>
                          <span className="text-zinc-500 block">Starting Investment</span>
                          <span className="font-semibold text-emerald-300 font-mono">{service.startingPrice}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Turnaround</span>
                          <span className="font-semibold text-zinc-300">{service.turnaroundTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {service.keyFeatures.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PORTFOLIO CMS TAB */}
          {activeTab === "portfolio" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-purple-400" />
                    Firestore Portfolio Projects Management
                  </h3>
                  <p className="text-xs text-zinc-400">Add, edit, or remove case studies live in the portfolio gallery.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSeedPortfolio}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsProjectModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between overflow-hidden group">
                    <div>
                      <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-zinc-950">
                        <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10">
                          {proj.category}
                        </span>
                        {proj.featured && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/90 text-zinc-950">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-white text-sm truncate">{proj.title}</h4>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">{proj.subtitle}</p>
                      <div className="text-[10px] text-zinc-500 mb-3">{proj.client} • {proj.year}</div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-mono">{proj.tags.slice(0, 2).join(", ")}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/20 text-xs"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS & AUTH TAB */}
          {activeTab === "users" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    Firestore Registered Users & Roles
                  </h3>
                  <p className="text-xs text-zinc-400">Real-time user accounts stored in the <code className="text-blue-300">users</code> collection.</p>
                </div>
                <button
                  type="button"
                  onClick={loadUsers}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold"
                >
                  Refresh Users
                </button>
              </div>

              {registeredUsers.length === 0 ? (
                <div className="py-12 text-center bg-zinc-900/20 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs mb-2">No users saved to Firestore yet.</p>
                  <p className="text-zinc-500 text-[11px]">Sign in with Google in the app to register the active account in Firestore.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 font-semibold">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">UID</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {registeredUsers.map((u) => {
                        const isCurrent = currentUser?.email === u.email;
                        const isAdmin = u.role === "admin";
                        return (
                          <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="py-3 px-4 flex items-center gap-2">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                                  {u.displayName ? u.displayName[0] : "U"}
                                </div>
                              )}
                              <span className="font-semibold text-white">{u.displayName || "Google User"}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-500/30">You</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-zinc-300 font-mono text-[11px]">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                isAdmin
                                  ? "bg-purple-950/60 text-purple-300 border border-purple-500/30"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}>
                                {isAdmin ? <ShieldCheck className="w-3 h-3 text-purple-400" /> : <Users className="w-3 h-3" />}
                                {u.role || "client"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-zinc-500 font-mono text-[10px] truncate max-w-[120px]">{u.uid || u.id}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleToggleUserRole(u.id, u.role)}
                                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium"
                              >
                                Toggle to {isAdmin ? "Client" : "Admin"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TRAFFIC TAB */}
          {activeTab === "traffic" && analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-200">
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

      {/* SERVICE EDIT/CREATE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService ? `Edit Service: ${editingService.title}` : "Create New Firestore Service"}
              </h3>
              <button type="button" onClick={() => setIsServiceModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <input type="hidden" name="id" defaultValue={editingService?.id || ""} />
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Service Discipline / Title</label>
                <select name="title" defaultValue={editingService?.title || "Web Development"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none">
                  <option value="Web Development">Web Development</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Graphic Design">Graphic Design</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Bangla Title</label>
                <input name="banglaTitle" defaultValue={editingService?.banglaTitle || ""} placeholder="ওয়েব ডেভেলপমেন্ট" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Starting Price</label>
                  <input name="startingPrice" defaultValue={editingService?.startingPrice || "৳ 18,000 (BDT)"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Turnaround Time</label>
                  <input name="turnaroundTime" defaultValue={editingService?.turnaroundTime || "7 - 10 Days"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Tagline</label>
                <input name="tagline" defaultValue={editingService?.tagline || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Description</label>
                <textarea name="description" rows={3} defaultValue={editingService?.description || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Highlight Metric</label>
                <input name="highlightMetric" defaultValue={editingService?.highlightMetric || "99+ Lighthouse Speed"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Key Features (one per line)</label>
                <textarea name="keyFeatures" rows={3} defaultValue={editingService?.keyFeatures?.join("\n") || ""} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none font-mono" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Deliverables (one per line)</label>
                <textarea name="deliverables" rows={2} defaultValue={editingService?.deliverables?.join("\n") || ""} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none font-mono" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Tech Stack (comma separated)</label>
                <input name="techStack" defaultValue={editingService?.techStack?.join(", ") || ""} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md">Save Service to Firestore</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT EDIT/CREATE MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProject ? `Edit Project: ${editingProject.title}` : "Add New Portfolio Case Study"}
              </h3>
              <button type="button" onClick={() => setIsProjectModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <input type="hidden" name="id" defaultValue={editingProject?.id || ""} />
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Project Title</label>
                <input name="title" defaultValue={editingProject?.title || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Subtitle / Hook</label>
                <input name="subtitle" defaultValue={editingProject?.subtitle || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Category</label>
                  <select name="category" defaultValue={editingProject?.category || "Web Development"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none">
                    <option value="Web Development">Web Development</option>
                    <option value="Content Creation">Content Creation</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Client / Organization</label>
                  <input name="client" defaultValue={editingProject?.client || "Bongio Partner (Dhaka)"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Thumbnail Image URL</label>
                <input name="thumbnail" defaultValue={editingProject?.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Live URL / Demo Link</label>
                <input name="liveUrl" defaultValue={editingProject?.liveUrl || ""} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Challenge Statement</label>
                <textarea name="challenge" rows={2} defaultValue={editingProject?.challenge || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Solution Implemented</label>
                <textarea name="solution" rows={2} defaultValue={editingProject?.solution || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Metric Label</label>
                  <input name="metric1Label" defaultValue={editingProject?.metrics?.[0]?.label || "Conversion Lift"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1.5 text-white outline-none text-xs" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Metric Value</label>
                  <input name="metric1Value" defaultValue={editingProject?.metrics?.[0]?.value || "+280%"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1.5 text-white outline-none text-xs" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Metric Description</label>
                  <input name="metric1Desc" defaultValue={editingProject?.metrics?.[0]?.description || "Average performance increase"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1.5 text-white outline-none text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Deliverables (one per line)</label>
                <textarea name="deliverables" rows={2} defaultValue={editingProject?.deliverables?.join("\n") || ""} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none font-mono" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="project-featured" name="featured" defaultChecked={editingProject?.featured} className="rounded border-zinc-700" />
                <label htmlFor="project-featured" className="text-zinc-300 font-medium">Feature prominently on showcase highlights</label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md">Save Project to Firestore</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
