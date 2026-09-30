import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Briefcase, 
  FolderGit2, 
  Mail, 
  Globe, 
  LogOut, 
  ArrowLeft, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Filter, 
  FileSpreadsheet, 
  Database,
  ExternalLink,
  Loader2
} from "lucide-react";
import { 
  fetchAllUsersFirestore, 
  subscribeToLeadsFirestore, 
  updateLeadStatusFirestore,
  updateUserRoleFirestore,
  updateUserStatusFirestore,
  subscribeToServicesFirestore,
  saveServiceFirestore,
  deleteServiceFirestore,
  seedServicesFirestore,
  subscribeToPortfolioFirestore,
  saveProjectFirestore,
  deleteProjectFirestore,
  seedPortfolioFirestore
} from "../lib/firebase";
import { ServicePillar, Project, UserProfile, LeadInquiry, ServiceCategory } from "../types";

export const AdminDashboard: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "leads" | "services" | "portfolio" | "settings">("overview");

  // Real-time Firestore state
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [services, setServices] = useState<ServicePillar[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modals for editing/creating service and project
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePillar | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const loadAllAdminData = async () => {
    setIsRefreshing(true);
    try {
      const uList = await fetchAllUsersFirestore();
      setUsersList(uList);
    } catch (e: any) {
      console.warn("Users fetch notice:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();

    const unsubLeads = subscribeToLeadsFirestore((l) => setLeads(l));
    const unsubServices = subscribeToServicesFirestore((s) => setServices(s));
    const unsubPortfolio = subscribeToPortfolioFirestore((p) => setProjects(p));

    return () => {
      if (unsubLeads) unsubLeads();
      if (unsubServices) unsubServices();
      if (unsubPortfolio) unsubPortfolio();
    };
  }, []);

  // Update User Role in Firestore
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "client" : "admin";
    try {
      await updateUserRoleFirestore(userId, newRole);
      setUsersList(usersList.map(u => u.uid === userId ? { ...u, role: newRole } : u));
      showNotice(`User role updated to ${newRole}`);
    } catch (e: any) {
      showNotice("Error updating user role: " + e.message);
    }
  };

  // Update User Status (active / suspended) in Firestore
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await updateUserStatusFirestore(userId, newStatus);
      setUsersList(usersList.map(u => u.uid === userId ? { ...u, status: newStatus } : u));
      showNotice(`User status updated to ${newStatus}`);
    } catch (e: any) {
      showNotice("Error updating user status: " + e.message);
    }
  };

  // Lead status update
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateLeadStatusFirestore(leadId, newStatus);
      showNotice(`Lead status set to ${newStatus}`);
    } catch (e: any) {
      showNotice("Error updating lead: " + e.message);
    }
  };

  // Service save / delete
  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = (formData.get("id") as string).trim() || `serv-${Date.now()}`;
    const title = formData.get("title") as ServiceCategory;
    const startingPrice = formData.get("startingPrice") as string;
    const turnaroundTime = formData.get("turnaroundTime") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const highlightMetric = formData.get("highlightMetric") as string;

    const servObj: ServicePillar = {
      id,
      title,
      iconName: "Code2",
      tagline,
      description,
      accentColor: "blue",
      startingPrice,
      turnaroundTime,
      highlightMetric,
      keyFeatures: (formData.get("features") as string).split("\n").map(s => s.trim()).filter(Boolean),
      deliverables: (formData.get("deliverables") as string).split("\n").map(s => s.trim()).filter(Boolean),
      techStack: (formData.get("techStack") as string).split(",").map(s => s.trim()).filter(Boolean)
    };

    try {
      await saveServiceFirestore(servObj);
      showNotice(`Service "${title}" updated in Firestore.`);
      setIsServiceModalOpen(false);
      setEditingService(null);
    } catch (err: any) {
      showNotice("Error saving service: " + err.message);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteServiceFirestore(serviceId);
      showNotice("Service deleted from Firestore.");
    } catch (err: any) {
      showNotice("Error deleting service: " + err.message);
    }
  };

  // Project save / delete
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

    const projObj: Project = {
      id,
      title,
      subtitle,
      category,
      client,
      year,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
      galleryImages: [thumbnail],
      tags: (formData.get("tags") as string).split(",").map(s => s.trim()).filter(Boolean),
      metrics: [
        { 
          label: (formData.get("mLabel") as string) || "Performance", 
          value: (formData.get("mVal") as string) || "99+", 
          description: "Quantified client impact" 
        }
      ],
      challenge,
      solution,
      deliverables: (formData.get("deliverables") as string).split("\n").map(s => s.trim()).filter(Boolean),
      techStack: (formData.get("techStack") as string).split(",").map(s => s.trim()).filter(Boolean),
      liveUrl,
      featured
    };

    try {
      await saveProjectFirestore(projObj);
      showNotice(`Project "${title}" saved in Firestore.`);
      setIsProjectModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      showNotice("Error saving project: " + err.message);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await deleteProjectFirestore(projectId);
      showNotice("Project deleted from Firestore.");
    } catch (err: any) {
      showNotice("Error deleting project: " + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const filteredLeads = leads.filter(l => leadStatusFilter === "all" || l.status === leadStatusFilter);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900/80 border-b md:border-b-0 md:border-r border-zinc-800 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-[1px] shadow-md shadow-purple-500/20">
              <div className="w-full h-full bg-[#0d0f15] rounded-[11px] flex items-center justify-center font-bold text-white text-xs">
                BD
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">
                Bongio Digital
              </span>
              <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                Admin Command Hub
              </span>
            </div>
          </Link>

          {/* Nav items */}
          <nav className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "overview" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview & Metrics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "users" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>User Directory</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {usersList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "leads" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>CRM & Inquiries</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {leads.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "services" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Services CMS</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {services.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "portfolio" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" />
                <span>Portfolio CMS</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "settings" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database & System</span>
            </button>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="pt-6 border-t border-zinc-800 space-y-2 text-xs">
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <span>Switch to Client Dashboard</span>
          </Link>
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <span>← Public Website</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Administration Command Center
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                Verified Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live Firestore control of Registered Accounts, CRM Prospects, Services, and Portfolio Case Studies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadAllAdminData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              title="Refresh Firestore"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Action feedback notice */}
        {actionNotice && (
          <div className="mb-6 p-3 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span>{actionNotice}</span>
            </div>
            <button type="button" onClick={() => setActionNotice(null)} className="text-purple-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Registered Users</div>
                <div className="text-2xl font-bold text-white font-mono">{usersList.length}</div>
                <div className="text-[10px] text-purple-400 mt-1">Firestore accounts</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">CRM Inquiries</div>
                <div className="text-2xl font-bold text-white font-mono">{leads.length}</div>
                <div className="text-[10px] text-blue-400 mt-1">Client leads</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Active Services</div>
                <div className="text-2xl font-bold text-white font-mono">{services.length}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Live in catalog</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Portfolio Items</div>
                <div className="text-2xl font-bold text-white font-mono">{projects.length}</div>
                <div className="text-[10px] text-amber-400 mt-1">Published case studies</div>
              </div>
            </div>

            {/* Quick overview of latest leads */}
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Recent Client Inquiries</h3>
                <button type="button" onClick={() => setActiveTab("leads")} className="text-xs text-purple-400 hover:text-purple-300">
                  Manage all leads →
                </button>
              </div>

              {leads.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">No leads in CRM yet.</p>
              ) : (
                <div className="space-y-2">
                  {leads.slice(0, 4).map((lead) => (
                    <div key={lead.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{lead.name} ({lead.email})</div>
                        <div className="text-[10px] text-zinc-400">{lead.services?.join(", ")} • Budget: {lead.budget}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30 capitalize">
                        {lead.status || "new"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. USERS DIRECTORY TAB */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Registered Users & Role Management</h3>
                <p className="text-xs text-zinc-400">View real-time accounts and toggle administrative privileges directly.</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {usersList.map((u) => {
                    const isSelf = u.uid === user?.uid;
                    const isUserAdmin = u.role === "admin";
                    const isSuspended = u.status === "suspended";

                    return (
                      <tr key={u.uid} className="hover:bg-zinc-800/20">
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                              {u.displayName ? u.displayName[0] : "U"}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{u.displayName || "Google User"}</span>
                              {isSelf && <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-950 text-purple-300 font-bold border border-purple-500/30">You</span>}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]">{u.uid}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isUserAdmin 
                              ? "bg-purple-950 text-purple-300 border border-purple-500/30" 
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {isUserAdmin ? <ShieldCheck className="w-3 h-3 text-purple-400" /> : <Users className="w-3 h-3" />}
                            {u.role || "client"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isSuspended 
                              ? "bg-red-950 text-red-400 border border-red-500/30" 
                              : "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                          }`}>
                            {u.status || "active"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {!isSelf && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleToggleRole(u.uid, u.role)}
                                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium transition-colors"
                              >
                                Set {isUserAdmin ? "Client" : "Admin"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(u.uid, u.status || "active")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                                  isSuspended 
                                    ? "bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30" 
                                    : "bg-red-950 text-red-300 hover:bg-red-900 border border-red-500/30"
                                }`}
                              >
                                {isSuspended ? "Unsuspend" : "Suspend"}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. LEADS & CRM TAB */}
        {activeTab === "leads" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-300">Filter:</span>
                {["all", "new", "reviewing", "quoted", "closed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs capitalize font-medium ${
                      leadStatusFilter === st
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <span className="text-xs text-zinc-400">{filteredLeads.length} leads</span>
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
                    <tr key={lead.id} className="hover:bg-zinc-800/20">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="text-zinc-400 text-[11px]">{lead.email}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{lead.services?.join(", ")}</td>
                      <td className="py-3 px-4 font-mono text-zinc-300">{lead.budget}</td>
                      <td className="py-3 px-4 text-zinc-400">{lead.timeline}</td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status || "new"}
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

        {/* 4. SERVICES CMS TAB */}
        {activeTab === "services" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Services Offerings CMS</h3>
                <p className="text-xs text-zinc-400">Edit starting investments, turnarounds, and deliverables.</p>
              </div>
              <button
                type="button"
                onClick={() => { setEditingService(null); setIsServiceModalOpen(true); }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{s.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => { setEditingService(s); setIsServiceModalOpen(true); }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(s.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400">{s.tagline}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                    <div>
                      <span className="text-zinc-500 block">Starting Price</span>
                      <span className="font-semibold text-emerald-400 font-mono">{s.startingPrice}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Turnaround</span>
                      <span className="font-semibold text-zinc-300">{s.turnaroundTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PORTFOLIO CMS TAB */}
        {activeTab === "portfolio" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Portfolio Case Studies CMS</h3>
                <p className="text-xs text-zinc-400">Publish or remove showcase projects.</p>
              </div>
              <button
                type="button"
                onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Case Study</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                  <div className="relative h-28 rounded-xl overflow-hidden bg-zinc-950">
                    <img src={proj.thumbnail} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                      {proj.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs truncate">{proj.title}</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{proj.client} • {proj.year}</p>
                  </div>
                  <div className="flex justify-end gap-1.5 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => { setEditingProject(proj); setIsProjectModalOpen(true); }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/20 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SETTINGS & DATABASE TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Firestore Collections State</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Reset or synchronize live production documents to the Firebase cloud database.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await seedServicesFirestore();
                    showNotice("Services synced to Firestore.");
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                >
                  Sync Default Services
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await seedPortfolioFirestore();
                    showNotice("Portfolio synced to Firestore.");
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                >
                  Sync Default Portfolio
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService ? `Edit: ${editingService.title}` : "New Service Offering"}
              </h3>
              <button type="button" onClick={() => setIsServiceModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <input type="hidden" name="id" defaultValue={editingService?.id || ""} />
              <div>
                <label className="block text-zinc-400 mb-1">Title</label>
                <input name="title" defaultValue={editingService?.title || "Web Development"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Starting Price</label>
                  <input name="startingPrice" defaultValue={editingService?.startingPrice || "৳ 18,000 (BDT)"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Turnaround Time</label>
                  <input name="turnaroundTime" defaultValue={editingService?.turnaroundTime || "7 - 10 Days"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Tagline</label>
                <input name="tagline" defaultValue={editingService?.tagline || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editingService?.description || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Highlight Metric</label>
                <input name="highlightMetric" defaultValue={editingService?.highlightMetric || "99+ Lighthouse Speed"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Key Features (one per line)</label>
                <textarea name="features" rows={3} defaultValue={editingService?.keyFeatures?.join("\n") || ""} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Deliverables (one per line)</label>
                <textarea name="deliverables" rows={2} defaultValue={editingService?.deliverables?.join("\n") || ""} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Tech Stack (comma separated)</label>
                <input name="techStack" defaultValue={editingService?.techStack?.join(", ") || ""} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProject ? `Edit Case Study: ${editingProject.title}` : "Add Case Study"}
              </h3>
              <button type="button" onClick={() => setIsProjectModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <input type="hidden" name="id" defaultValue={editingProject?.id || ""} />
              <div>
                <label className="block text-zinc-400 mb-1">Project Title</label>
                <input name="title" defaultValue={editingProject?.title || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Subtitle</label>
                <input name="subtitle" defaultValue={editingProject?.subtitle || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select name="category" defaultValue={editingProject?.category || "Web Development"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white">
                    <option value="Web Development">Web Development</option>
                    <option value="Content Creation">Content Creation</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Client Name</label>
                  <input name="client" defaultValue={editingProject?.client || "Bongio Partner"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Thumbnail URL</label>
                <input name="thumbnail" defaultValue={editingProject?.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80"} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Live Demo URL</label>
                <input name="liveUrl" defaultValue={editingProject?.liveUrl || ""} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Challenge</label>
                <textarea name="challenge" rows={2} defaultValue={editingProject?.challenge || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Solution</label>
                <textarea name="solution" rows={2} defaultValue={editingProject?.solution || ""} required className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Metric Label</label>
                  <input name="mLabel" defaultValue={editingProject?.metrics?.[0]?.label || "Conversion Lift"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Metric Value</label>
                  <input name="mVal" defaultValue={editingProject?.metrics?.[0]?.value || "+312%"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Tags (comma separated)</label>
                <input name="tags" defaultValue={editingProject?.tags?.join(", ") || "React, TypeScript"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Deliverables (one per line)</label>
                <textarea name="deliverables" rows={2} defaultValue={editingProject?.deliverables?.join("\n") || "Full Stack Application"} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="adm-featured" name="featured" defaultChecked={editingProject?.featured} className="rounded" />
                <label htmlFor="adm-featured" className="text-zinc-300">Feature on homepage showcase</label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold">Save Case Study</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
