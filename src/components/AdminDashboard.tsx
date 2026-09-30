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
  Database,
  ExternalLink,
  Loader2,
  ShoppingBag,
  MessageSquare,
  Activity,
  Send,
  ArrowRight,
  Sliders,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { 
  fetchAllUsersFirestore, 
  updateUserRoleFirestore,
  updateUserStatusFirestore,
  subscribeToAllServiceRequests,
  updateServiceRequestStatusFirestore,
  subscribeToAllClientProjects,
  createClientProjectFirestore,
  updateProjectProgressFirestore,
  deleteClientProjectFirestore,
  subscribeToLeadsFirestore, 
  updateLeadStatusFirestore,
  subscribeToContactMessagesFirestore,
  updateContactMessageStatusFirestore,
  subscribeToActivityLogsFirestore,
  subscribeToMessagesFirestore,
  sendMessageFirestore,
  subscribeToServicesFirestore,
  saveServiceFirestore,
  deleteServiceFirestore,
  seedServicesFirestore,
  subscribeToPortfolioFirestore,
  saveProjectFirestore,
  deleteProjectFirestore,
  seedPortfolioFirestore
} from "../lib/firebase";
import { 
  ServicePillar, 
  Project, 
  UserProfile, 
  ServiceRequest, 
  ClientProject, 
  ChatMessage, 
  ContactMessage, 
  ActivityLog, 
  ServiceCategory 
} from "../types";

export const AdminDashboard: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<
    "overview" | "clients" | "requests" | "projects" | "leads" | "contacts" | "messages" | "activity" | "services" | "portfolio" | "settings"
  >("overview");

  // Real-time Firestore state
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [services, setServices] = useState<ServicePillar[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Selected client for messaging
  const [selectedChatClientId, setSelectedChatClientId] = useState<string>("");
  const [adminChatMessages, setAdminChatMessages] = useState<ChatMessage[]>([]);
  const [adminChatInput, setAdminChatInput] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjClientId, setNewProjClientId] = useState("");
  const [newProjClientName, setNewProjClientName] = useState("");
  const [newProjName, setNewProjName] = useState("");
  const [newProjService, setNewProjService] = useState("Web Development");
  const [newProjBudget, setNewProjBudget] = useState("৳ 35,000");
  const [newProjDeadline, setNewProjDeadline] = useState("14 Days");

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const loadUsers = async () => {
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
    loadUsers();

    const unsubRequests = subscribeToAllServiceRequests(setServiceRequests);
    const unsubProjects = subscribeToAllClientProjects(setClientProjects);
    const unsubLeads = subscribeToLeadsFirestore(setLeads);
    const unsubContacts = subscribeToContactMessagesFirestore(setContactMessages);
    const unsubLogs = subscribeToActivityLogsFirestore(setActivityLogs);
    const unsubServices = subscribeToServicesFirestore(setServices);
    const unsubPortfolio = subscribeToPortfolioFirestore(setProjects);

    return () => {
      if (unsubRequests) unsubRequests();
      if (unsubProjects) unsubProjects();
      if (unsubLeads) unsubLeads();
      if (unsubContacts) unsubContacts();
      if (unsubLogs) unsubLogs();
      if (unsubServices) unsubServices();
      if (unsubPortfolio) unsubPortfolio();
    };
  }, []);

  // Listen to chat for selected client
  useEffect(() => {
    if (!selectedChatClientId) return;
    const unsub = subscribeToMessagesFirestore(selectedChatClientId, setAdminChatMessages);
    return () => {
      if (unsub) unsub();
    };
  }, [selectedChatClientId]);

  // Client role & status actions
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

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await updateUserStatusFirestore(userId, newStatus as any);
      setUsersList(usersList.map(u => u.uid === userId ? { ...u, status: newStatus as any } : u));
      showNotice(`User status updated to ${newStatus}`);
    } catch (e: any) {
      showNotice("Error updating user status: " + e.message);
    }
  };

  // Convert Service Request to Project
  const handleConvertRequestToProject = async (req: ServiceRequest) => {
    try {
      await createClientProjectFirestore({
        clientId: req.clientId,
        clientName: req.clientName,
        projectName: req.projectTitle,
        service: req.service,
        description: req.description,
        status: "in_progress",
        progress: 10,
        startDate: new Date().toISOString().split("T")[0],
        deadline: req.deadline,
        budget: req.budget,
        assignedTo: "Studio Core Team"
      });
      await updateServiceRequestStatusFirestore(req.id, "approved", "Converted to live project");
      showNotice(`Request "${req.projectTitle}" converted to active production project!`);
    } catch (e: any) {
      showNotice("Error converting request: " + e.message);
    }
  };

  // Create Project submit
  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjClientId) return;
    try {
      await createClientProjectFirestore({
        clientId: newProjClientId,
        clientName: newProjClientName || "Client",
        projectName: newProjName.trim(),
        service: newProjService,
        description: "New client project sprint",
        status: "in_progress",
        progress: 5,
        startDate: new Date().toISOString().split("T")[0],
        deadline: newProjDeadline,
        budget: newProjBudget,
        assignedTo: "Studio Core Team"
      });
      setIsProjectModalOpen(false);
      setNewProjName("");
      showNotice("Project created and client notified!");
    } catch (e: any) {
      showNotice("Error creating project: " + e.message);
    }
  };

  // Send admin chat message
  const handleAdminSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim() || !selectedChatClientId || !user) return;
    try {
      await sendMessageFirestore({
        conversationId: selectedChatClientId,
        senderId: user.uid,
        senderName: "Bongio Lead Architect",
        senderRole: "admin",
        receiverId: selectedChatClientId,
        message: adminChatInput.trim(),
        read: false
      });
      setAdminChatInput("");
    } catch (e: any) {
      showNotice("Error sending message: " + e.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Statistics
  const totalClients = usersList.filter(u => u.role === "client").length;
  const newRequestsCount = serviceRequests.filter(r => r.status === "new").length;
  const activeProjectsCount = clientProjects.filter(p => p.status === "in_progress" || p.status === "planning").length;
  const completedProjectsCount = clientProjects.filter(p => p.status === "completed").length;
  const newLeadsCount = leads.filter(l => l.status === "new").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900/80 border-b md:border-b-0 md:border-r border-zinc-800 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <Link to="/" className="flex items-center gap-2.5 mb-6 group">
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

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "overview" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview & Stats</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "clients" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Clients</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {usersList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "requests" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Service Requests</span>
              </div>
              {newRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-500 text-white text-[10px] font-bold">
                  {newRequestsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "projects" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" />
                <span>Client Projects</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {clientProjects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "leads" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>CRM Leads</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {leads.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "contacts" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Contact Messages</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                {contactMessages.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "messages" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Client Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "activity" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Activity Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "services" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Services CMS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "portfolio" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Portfolio CMS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all ${
                activeTab === "settings" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database Sync</span>
            </button>
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="pt-6 border-t border-zinc-800 space-y-2 text-xs">
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <span>Switch to Client Portal</span>
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
                Administration Control Center
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                Verified Admin ({profile?.displayName || "Admin"})
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live Firebase control over clients, projects, service requests, CRM leads, and messaging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadUsers}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              title="Refresh Data"
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

        {/* 1. OVERVIEW & METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Total Clients</div>
                <div className="text-2xl font-bold text-white font-mono">{totalClients}</div>
                <div className="text-[10px] text-purple-400 mt-1">Firestore accounts</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">New Leads</div>
                <div className="text-2xl font-bold text-white font-mono">{newLeadsCount}</div>
                <div className="text-[10px] text-blue-400 mt-1">Awaiting reply</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Service Requests</div>
                <div className="text-2xl font-bold text-white font-mono">{serviceRequests.length}</div>
                <div className="text-[10px] text-emerald-400 mt-1">{newRequestsCount} pending</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Active Sprints</div>
                <div className="text-2xl font-bold text-white font-mono">{activeProjectsCount}</div>
                <div className="text-[10px] text-amber-400 mt-1">In production</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Delivered</div>
                <div className="text-2xl font-bold text-white font-mono">{completedProjectsCount}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Completed</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="text-xs text-zinc-400 mb-1">Inquiries</div>
                <div className="text-2xl font-bold text-white font-mono">{contactMessages.length}</div>
                <div className="text-[10px] text-zinc-400 mt-1">Contact form</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Service Requests */}
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <span>Pending Service Requests</span>
                  </h3>
                  <button type="button" onClick={() => setActiveTab("requests")} className="text-xs text-purple-400 hover:text-purple-300">
                    View all ({serviceRequests.length}) →
                  </button>
                </div>
                {serviceRequests.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No service requests yet.</p>
                ) : (
                  <div className="space-y-2">
                    {serviceRequests.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-white">{r.projectTitle}</div>
                          <div className="text-[10px] text-zinc-400">{r.clientName} • {r.service} ({r.budget})</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/30 capitalize">
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity Audit */}
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Recent System Activity</span>
                  </h3>
                  <button type="button" onClick={() => setActiveTab("activity")} className="text-xs text-purple-400 hover:text-purple-300">
                    View audit log →
                  </button>
                </div>
                {activityLogs.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No logged activity yet.</p>
                ) : (
                  <div className="space-y-2">
                    {activityLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
                        <div className="font-medium text-white">{log.description}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{new Date(log.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. CLIENT MANAGEMENT */}
        {activeTab === "clients" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Clients & User Management</h3>
                <p className="text-xs text-zinc-400">View real-time client accounts, change access roles, or toggle account status.</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Company</th>
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
                              {(u.displayName || u.fullName || "U")[0]}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{u.displayName || u.fullName || "User"}</span>
                              {isSelf && <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-950 text-purple-300 font-bold border border-purple-500/30">You</span>}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]">{u.uid}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{u.email}</td>
                        <td className="py-3 px-4 text-zinc-400">{u.companyName || u.company || "—"}</td>
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
                          <button
                            type="button"
                            onClick={() => {
                              setNewProjClientId(u.uid);
                              setNewProjClientName(u.displayName || u.fullName || "Client");
                              setIsProjectModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-medium"
                          >
                            + Project
                          </button>
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

        {/* 3. SERVICE REQUESTS MANAGEMENT */}
        {activeTab === "requests" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white">Client Service Requests</h3>
              <p className="text-xs text-zinc-400">Review project scopes, download client attachments, change statuses, and convert to projects.</p>
            </div>

            {serviceRequests.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 text-xs text-zinc-500">
                No service requests submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {serviceRequests.map((req) => (
                  <div key={req.id} className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{req.projectTitle}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-500/30">
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{req.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleConvertRequestToProject(req)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Convert to Project
                        </button>
                        <select
                          value={req.status}
                          onChange={(e) => updateServiceRequestStatusFirestore(req.id, e.target.value as any)}
                          className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 outline-none"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="approved">Approved</option>
                          <option value="in_progress">In Progress</option>
                          <option value="waiting_for_client">Waiting for Client</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Client</span>
                        <span className="text-zinc-200 font-semibold">{req.clientName} ({req.clientEmail})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Service</span>
                        <span className="text-zinc-200">{req.service}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Budget / Deadline</span>
                        <span className="text-emerald-400 font-mono">{req.budget} • {req.deadline}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Attachments</span>
                        {req.attachments && req.attachments.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {req.attachments.map((url, i) => (
                              <a key={i} href={url} target="_blank" rel="noreferrer" className="text-blue-400 underline text-[10px]">
                                File {i + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-500">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. CLIENT PROJECTS (ACTIVE PRODUCTION SPRINTS) */}
        {activeTab === "projects" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Active Client Projects</h3>
                <p className="text-xs text-zinc-400">Update progress bars, deliverable statuses, and deadlines.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewProjClientId(usersList[0]?.uid || "");
                  setNewProjClientName(usersList[0]?.displayName || "Client");
                  setIsProjectModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Project</span>
              </button>
            </div>

            {clientProjects.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 text-xs text-zinc-500">
                No active projects in production.
              </div>
            ) : (
              <div className="space-y-4">
                {clientProjects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{p.projectName}</h4>
                          <span className="text-xs text-zinc-400">Client: {p.clientName}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{p.service} • Budget: {p.budget}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={p.status}
                          onChange={(e) => updateProjectProgressFirestore(p.id, p.progress, e.target.value as any)}
                          className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 outline-none"
                        >
                          <option value="planning">Planning</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                          <option value="paused">Paused</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => deleteClientProjectFirestore(p.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/20"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Sprint Progress</span>
                        <span className="font-mono font-bold text-white">{p.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={p.progress}
                        onChange={(e) => updateProjectProgressFirestore(p.id, parseInt(e.target.value), p.status)}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. CRM LEADS */}
        {activeTab === "leads" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">CRM Prospective Leads</h3>
            <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Services</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-zinc-800/20">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{l.name}</div>
                        <div className="text-[10px] text-zinc-400">{l.email} {l.phone ? `• ${l.phone}` : ""}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{Array.isArray(l.services) ? l.services.join(", ") : l.service}</td>
                      <td className="py-3 px-4 font-mono text-zinc-300">{l.budget}</td>
                      <td className="py-3 px-4">
                        <select
                          value={l.status || "new"}
                          onChange={(e) => updateLeadStatusFirestore(l.id, e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1 outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal Sent</option>
                          <option value="converted">Converted / Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. CONTACT MESSAGES */}
        {activeTab === "contacts" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Inbound Website Inquiries</h3>
            {contactMessages.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 text-xs text-zinc-500">
                No contact form submissions recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{msg.name} ({msg.email})</span>
                      <select
                        value={msg.status}
                        onChange={(e) => updateContactMessageStatusFirestore(msg.id, e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="text-zinc-400 font-semibold">{msg.subject}</div>
                    <p className="text-zinc-300">{msg.message}</p>
                    <span className="text-[10px] text-zinc-500 block">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. CLIENT MESSAGES / CHAT */}
        {activeTab === "messages" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Client Conversations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
              {/* Clients selector list */}
              <div className="border border-zinc-800 rounded-2xl p-2 bg-zinc-900/40 overflow-y-auto space-y-1">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block p-2">Select Client</span>
                {usersList.map((u) => (
                  <button
                    key={u.uid}
                    type="button"
                    onClick={() => setSelectedChatClientId(u.uid)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      selectedChatClientId === u.uid ? 'bg-purple-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{u.displayName || u.fullName || "User"}</div>
                      <div className="text-[10px] opacity-75 truncate max-w-[140px]">{u.email}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>

              {/* Chat Thread */}
              <div className="md:col-span-2 border border-zinc-800 rounded-2xl bg-zinc-900/40 flex flex-col overflow-hidden">
                {selectedChatClientId ? (
                  <>
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {adminChatMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                          No messages in this client thread yet. Send a message!
                        </div>
                      ) : (
                        adminChatMessages.map((m) => {
                          const isLeadAdmin = m.senderRole === "admin";
                          return (
                            <div key={m.id} className={`flex flex-col ${isLeadAdmin ? 'items-end' : 'items-start'}`}>
                              <span className="text-[10px] text-zinc-500 mb-0.5">{m.senderName}</span>
                              <div className={`p-3 rounded-2xl max-w-sm text-xs ${
                                isLeadAdmin ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-200'
                              }`}>
                                <p>{m.message}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <form onSubmit={handleAdminSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
                      <input
                        type="text"
                        value={adminChatInput}
                        onChange={(e) => setAdminChatInput(e.target.value)}
                        placeholder="Reply to client as Bongio Digital Lead..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                      />
                      <button type="submit" className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                    Select a client on the left to start direct live messaging.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 8. ACTIVITY LOGS */}
        {activeTab === "activity" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">System Activity Audit Trail</h3>
            <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 divide-y divide-zinc-800/60">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{log.description}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Action: {log.action} • Role: {log.actorRole}</div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. SERVICES CMS */}
        {activeTab === "services" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Services Offerings CMS</h3>
                <p className="text-xs text-zinc-400">Live service offerings and starting investments.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <h4 className="font-bold text-white text-sm">{s.title}</h4>
                  <p className="text-xs text-zinc-400">{s.tagline}</p>
                  <div className="flex justify-between text-xs pt-2 font-mono text-emerald-400">
                    <span>{s.startingPrice}</span>
                    <span>{s.turnaroundTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. PORTFOLIO CMS */}
        {activeTab === "portfolio" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Portfolio Case Studies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <img src={proj.thumbnail} alt="" className="h-28 w-full object-cover rounded-xl" />
                  <h4 className="font-bold text-white text-xs truncate">{proj.title}</h4>
                  <p className="text-[10px] text-zinc-400">{proj.client} • {proj.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. DATABASE SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Firestore Database Synchronization</h3>
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <p className="text-xs text-zinc-400">Sync default data models directly to your Cloud Firestore database.</p>
              <div className="flex gap-3 pt-2">
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

      {/* CREATE PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Production Project</h3>
              <button type="button" onClick={() => setIsProjectModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Client Name</label>
                <input
                  type="text"
                  value={newProjClientName}
                  onChange={(e) => setNewProjClientName(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Bongio Digital E-commerce Store"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Service Discipline</label>
                <select
                  value={newProjService}
                  onChange={(e) => setNewProjService(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="AI Automation for Social Media">AI Automation for Social Media</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Social Media Content Creation">Social Media Content Creation</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Budget</label>
                  <input
                    type="text"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Deadline</label>
                  <input
                    type="text"
                    value={newProjDeadline}
                    onChange={(e) => setNewProjDeadline(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
