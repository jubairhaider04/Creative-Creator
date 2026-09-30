import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  FolderGit2, 
  ShoppingBag, 
  Receipt, 
  MessageSquare, 
  BrainCircuit, 
  User, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Sparkles, 
  Edit3, 
  Phone, 
  Building2, 
  Mail, 
  Calendar, 
  ChevronRight,
  ExternalLink,
  Loader2,
  Check,
  Send,
  Plus,
  Paperclip,
  Bell,
  Globe,
  UploadCloud
} from "lucide-react";
import { 
  createServiceRequestFirestore,
  subscribeToClientServiceRequests,
  subscribeToClientProjects,
  sendMessageFirestore,
  subscribeToMessagesFirestore,
  subscribeToUserNotificationsFirestore,
  markNotificationReadFirestore,
  uploadFileToStorage,
  getUserAiPlansFirestore,
  subscribeToLeadsFirestore
} from "../lib/firebase";
import { 
  ServiceRequest, 
  ClientProject, 
  ChatMessage, 
  AppNotification 
} from "../types";

export const ClientDashboard: React.FC = () => {
  const { user, profile, logout, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active section tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "requests" | "new-request" | "messages" | "notifications" | "ai-plans" | "profile"
  >("overview");

  // Real-time Firestore state for this client
  const [myProjects, setMyProjects] = useState<ClientProject[]>([]);
  const [myRequests, setMyRequests] = useState<ServiceRequest[]>([]);
  const [myMessages, setMyMessages] = useState<ChatMessage[]>([]);
  const [myNotifications, setMyNotifications] = useState<AppNotification[]>([]);
  const [userPlans, setUserPlans] = useState<any[]>([]);

  // Profile edit form state
  const [name, setName] = useState(profile?.displayName || profile?.fullName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [company, setCompany] = useState(profile?.company || profile?.companyName || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.photoURL || profile?.avatarUrl || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // New Service Request form state
  const [reqService, setReqService] = useState("Web Development");
  const [reqTitle, setReqTitle] = useState("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqBudget, setReqBudget] = useState("৳ 25,000 - ৳ 50,000 BDT (Growth Tier)");
  const [reqDeadline, setReqDeadline] = useState("10 - 14 Days");
  const [reqPriority, setReqPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [reqFiles, setReqFiles] = useState<File[]>([]);
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState<string | null>(null);

  // Chat message state
  const [chatInput, setChatInput] = useState("");
  const [chatFile, setChatFile] = useState<File | null>(null);
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname.includes("requests/new") || location.pathname.includes("request-service")) setActiveTab("new-request");
    else if (location.pathname.includes("requests")) setActiveTab("requests");
    else if (location.pathname.includes("projects")) setActiveTab("projects");
    else if (location.pathname.includes("messages")) setActiveTab("messages");
    else if (location.pathname.includes("notifications")) setActiveTab("notifications");
    else if (location.pathname.includes("profile")) setActiveTab("profile");
    else if (location.pathname.includes("ai-plans")) setActiveTab("ai-plans");
    else setActiveTab("overview");
  }, [location.pathname]);

  // Sync profile data
  useEffect(() => {
    if (profile) {
      setName(profile.displayName || profile.fullName || "");
      setPhone(profile.phone || "");
      setCompany(profile.company || profile.companyName || "");
      setCountry(profile.country || "");
      setWebsite(profile.website || "");
      setAvatarUrl(profile.photoURL || profile.avatarUrl || "");
    }
  }, [profile]);

  // Subscribe to client-specific collections
  useEffect(() => {
    if (!user?.uid) return;

    const unsubProjects = subscribeToClientProjects(user.uid, (projs) => setMyProjects(projs));
    const unsubRequests = subscribeToClientServiceRequests(user.uid, (reqs) => setMyRequests(reqs));
    const unsubMessages = subscribeToMessagesFirestore(user.uid, (msgs) => setMyMessages(msgs));
    const unsubNotifs = subscribeToUserNotificationsFirestore(user.uid, (notifs) => setMyNotifications(notifs));

    getUserAiPlansFirestore(user.uid).then(setUserPlans).catch(() => {});

    return () => {
      if (unsubProjects) unsubProjects();
      if (unsubRequests) unsubRequests();
      if (unsubMessages) unsubMessages();
      if (unsubNotifs) unsubNotifs();
    };
  }, [user?.uid]);

  // Handle Avatar upload
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadFileToStorage(file, `users/${user.uid}/profile`);
      setAvatarUrl(url);
      await updateProfile({ photoURL: url, avatarUrl: url });
      setProfileNotice("Avatar updated successfully!");
    } catch (err: any) {
      setProfileNotice("Avatar upload failed: " + err.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle profile save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileNotice(null);
    try {
      await updateProfile({
        displayName: name.trim(),
        fullName: name.trim(),
        phone: phone.trim(),
        company: company.trim(),
        companyName: company.trim(),
        country: country.trim(),
        website: website.trim(),
        photoURL: avatarUrl.trim(),
        avatarUrl: avatarUrl.trim()
      });
      setProfileNotice("Profile updated successfully!");
      setTimeout(() => setProfileNotice(null), 4000);
    } catch (err: any) {
      setProfileNotice("Failed to update profile: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Submit New Service Request
  const handleSubmitServiceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqDesc.trim() || !user) return;
    setIsSubmittingReq(true);
    setReqSuccessMsg(null);

    try {
      await createServiceRequestFirestore({
        clientId: user.uid,
        clientName: profile?.displayName || profile?.fullName || "Client",
        clientEmail: user.email || "",
        service: reqService,
        projectTitle: reqTitle.trim(),
        description: reqDesc.trim(),
        budget: reqBudget,
        deadline: reqDeadline,
        priority: reqPriority,
        status: "new",
        attachments: []
      }, reqFiles);

      setReqSuccessMsg("Service request submitted successfully! Our lead engineer has been notified.");
      setReqTitle("");
      setReqDesc("");
      setReqFiles([]);
      setTimeout(() => {
        setReqSuccessMsg(null);
        setActiveTab("requests");
        navigate("/dashboard/requests");
      }, 2000);
    } catch (err: any) {
      setReqSuccessMsg("Submission failed: " + err.message);
    } finally {
      setIsSubmittingReq(false);
    }
  };

  // Handle Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;
    setIsSendingMsg(true);
    try {
      await sendMessageFirestore({
        conversationId: user.uid,
        senderId: user.uid,
        senderName: profile?.displayName || profile?.fullName || "Client",
        senderRole: "client",
        receiverId: "admin",
        message: chatInput.trim(),
        read: false
      }, chatFile || undefined);

      setChatInput("");
      setChatFile(null);
    } catch (err) {
      console.warn("Message sending error:", err);
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const firstName = profile?.displayName ? profile.displayName.split(" ")[0] : "Client";
  const unreadNotifs = myNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900/60 border-b md:border-b-0 md:border-r border-zinc-800 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <Link to="/" className="flex items-center gap-2.5 mb-6 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-[#0d0f15] rounded-[11px] flex items-center justify-center font-bold text-white text-xs">
                BD
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">
                Bongio Digital
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">Client Workspace</span>
            </div>
          </Link>

          {/* User mini profile card */}
          <div className="p-3 mb-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-9 h-9 rounded-xl object-cover border border-zinc-700" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {firstName[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-white text-xs truncate">{profile?.displayName || "Client User"}</div>
              <div className="text-[10px] text-zinc-400 truncate">{profile?.email}</div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => { setActiveTab("overview"); navigate("/dashboard"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "overview" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("projects"); navigate("/dashboard/projects"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "projects" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="w-4 h-4" />
                <span>My Projects</span>
              </div>
              {myProjects.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-300">
                  {myProjects.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("requests"); navigate("/dashboard/requests"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "requests" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Service Requests</span>
              </div>
              {myRequests.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-300 border border-blue-500/30 text-[10px] font-mono">
                  {myRequests.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("new-request"); navigate("/dashboard/requests/new"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "new-request" ? "bg-blue-600 text-white shadow-sm" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Request a Service</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("messages"); navigate("/dashboard/messages"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "messages" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Studio Messages</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("notifications"); navigate("/dashboard/notifications"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "notifications" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("ai-plans"); navigate("/dashboard/ai-plans"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "ai-plans" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-4 h-4" />
                <span>AI Blueprints</span>
              </div>
              {userPlans.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-400">
                  {userPlans.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("profile"); navigate("/dashboard/profile"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "profile" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account Profile</span>
            </button>
          </nav>
        </div>

        {/* Footer controls in sidebar */}
        <div className="pt-6 border-t border-zinc-800 space-y-2 text-xs">
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 transition-colors font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Hub</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}

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
        
        {/* Header greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Welcome, {firstName}
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {profile?.role === "admin" ? "Studio Admin" : "Verified Client"}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Manage your engineering sprints, track deliverables, request new services, and collaborate directly with Bongio Digital.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab("new-request"); navigate("/dashboard/requests/new"); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Request Service</span>
            </button>
            <a
              href="https://wa.me/8801676056414"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all"
            >
              <span>WhatsApp Support</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Active Projects</span>
                  <FolderGit2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">{myProjects.length}</span>
                  <span className="text-xs text-emerald-400 font-semibold">In Progress</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Service Requests</span>
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">{myRequests.length}</span>
                  <span className="text-xs text-zinc-400">Total</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Unread Messages</span>
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">{myMessages.filter(m => !m.read && m.senderRole === "admin").length}</span>
                  <span className="text-xs text-emerald-400 font-semibold">Live Chat</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Notifications</span>
                  <Bell className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">{unreadNotifs}</span>
                  <span className="text-xs text-zinc-400">Unread</span>
                </div>
              </div>
            </div>

            {/* Active Projects List */}
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Active Sprints</span>
                  <h3 className="text-base font-bold text-white">Production Deliverables</h3>
                </div>
                <button type="button" onClick={() => setActiveTab("projects")} className="text-xs text-blue-400 hover:text-blue-300">
                  View all projects →
                </button>
              </div>

              {myProjects.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No active projects currently in production. Submit a service request to start!
                </div>
              ) : (
                <div className="space-y-4">
                  {myProjects.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{p.projectName}</h4>
                          <span className="text-xs text-zinc-400">{p.service} • Deadline: {p.deadline}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-blue-950 text-blue-300 border border-blue-500/30">
                          {p.status.replace("_", " ")} ({p.progress}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500" 
                          style={{ width: `${p.progress}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Service Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <span>Recent Service Requests</span>
                  </h4>
                  <button type="button" onClick={() => setActiveTab("requests")} className="text-xs text-blue-400 hover:text-blue-300">
                    View all
                  </button>
                </div>
                {myRequests.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No service requests yet.</p>
                ) : (
                  <div className="space-y-2">
                    {myRequests.slice(0, 3).map((r) => (
                      <div key={r.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-white">{r.projectTitle}</div>
                          <div className="text-[10px] text-zinc-400">{r.service} • {r.budget}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/30 capitalize">
                          {r.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* In-App Notifications */}
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Latest Notifications</span>
                  </h4>
                  <button type="button" onClick={() => setActiveTab("notifications")} className="text-xs text-blue-400 hover:text-blue-300">
                    View all
                  </button>
                </div>
                {myNotifications.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No notifications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {myNotifications.slice(0, 3).map((n) => (
                      <div key={n.id} className={`p-3 rounded-xl border text-xs ${n.read ? 'bg-zinc-950/40 border-zinc-800/60' : 'bg-blue-950/20 border-blue-500/30'}`}>
                        <div className="font-semibold text-white">{n.title}</div>
                        <div className="text-[10px] text-zinc-400">{n.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. MY PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white">My Projects & Sprints</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time status, deliverables, and progress tracking for your deliverables.</p>
            </div>

            {myProjects.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <FolderGit2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 mb-3">You do not have any active projects yet.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("new-request")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Request a Service</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myProjects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{p.projectName}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-500/30">
                            {p.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{p.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-mono font-bold text-white">{p.progress}%</span>
                        <span className="block text-[10px] text-zinc-400">Progress</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-zinc-800/80">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Service</span>
                        <span className="text-zinc-200 font-semibold">{p.service}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Deadline</span>
                        <span className="text-zinc-200 font-mono">{p.deadline}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Budget</span>
                        <span className="text-emerald-400 font-mono font-semibold">{p.budget}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Assigned Lead</span>
                        <span className="text-zinc-200">{p.assignedTo || "Bongio Core Team"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SERVICE REQUESTS TAB */}
        {activeTab === "requests" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Service Requests</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Track and review submitted briefs and estimates.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("new-request")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Request</span>
              </button>
            </div>

            {myRequests.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 mb-3">No service requests submitted yet.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("new-request")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Request a Service</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Project Title</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {myRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-zinc-800/20">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{r.projectTitle}</div>
                          <div className="text-[10px] text-zinc-500 line-clamp-1">{r.description}</div>
                        </td>
                        <td className="py-3 px-4 text-zinc-300">{r.service}</td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{r.budget}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300">
                            {r.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-blue-950 text-blue-300 border border-blue-500/30">
                            {r.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. NEW REQUEST FORM */}
        {activeTab === "new-request" && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white">Request a Digital Service</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Specify your project requirements. Attachments will be securely stored in Firebase Storage.</p>
            </div>

            {reqSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{reqSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitServiceRequest} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="req-service">
                  Select Discipline / Service *
                </label>
                <select
                  id="req-service"
                  value={reqService}
                  onChange={(e) => setReqService(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="AI Automation for Social Media">AI Automation for Social Media</option>
                  <option value="Web Development">Web Development (60FPS React / Next.js)</option>
                  <option value="Graphic Design">Graphic Design & Brand Identity</option>
                  <option value="Video Editing">4K Cinema Video Editing</option>
                  <option value="Social Media Content Creation">Social Media Content Creation</option>
                  <option value="Other">Other Bespoke Requirement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="req-title">
                  Project Title *
                </label>
                <input
                  id="req-title"
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Next.js SaaS Platform with bKash Checkout"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="req-desc">
                  Project Brief & Description *
                </label>
                <textarea
                  id="req-desc"
                  rows={4}
                  required
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Describe your goals, required pages/features, target audience, and reference links..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="req-budget">
                    Budget Bracket
                  </label>
                  <select
                    id="req-budget"
                    value={reqBudget}
                    onChange={(e) => setReqBudget(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="৳ 10,000 - ৳ 25,000 BDT (Starter)">৳ 10,000 - ৳ 25,000 (Starter)</option>
                    <option value="৳ 25,000 - ৳ 50,000 BDT (Growth Tier)">৳ 25,000 - ৳ 50,000 (Growth)</option>
                    <option value="৳ 50,000 - ৳ 100,000 BDT (Scale)">৳ 50,000 - ৳ 100,000 (Scale)</option>
                    <option value="৳ 100,000+ BDT (Enterprise)">৳ 100,000+ (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="req-deadline">
                    Target Deadline
                  </label>
                  <select
                    id="req-deadline"
                    value={reqDeadline}
                    onChange={(e) => setReqDeadline(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="5 - 7 Days (Rush)">5 - 7 Days (Rush)</option>
                    <option value="10 - 14 Days">10 - 14 Days</option>
                    <option value="3 - 4 Weeks">3 - 4 Weeks</option>
                    <option value="Flexible / Retainer">Flexible / Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="req-priority">
                    Priority Level
                  </label>
                  <select
                    id="req-priority"
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Attachments Upload (Firebase Storage) */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Upload Attachments (Images, PDFs, Specs)
                </label>
                <div className="border border-dashed border-zinc-800 rounded-2xl p-4 text-center hover:border-zinc-700 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) setReqFiles(Array.from(e.target.files));
                    }}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className="w-6 h-6 text-zinc-500 mb-1" />
                    <span className="text-xs text-blue-400 font-semibold">Click to upload files</span>
                    <span className="text-[10px] text-zinc-500">Max 25MB each (PNG, JPG, PDF, ZIP)</span>
                  </label>
                  {reqFiles.length > 0 && (
                    <div className="mt-3 text-left space-y-1">
                      {reqFiles.map((f, i) => (
                        <div key={i} className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingReq}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmittingReq ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Submit Service Request</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. MESSAGES TAB (LIVE STUDIO CHAT) */}
        {activeTab === "messages" && (
          <div className="space-y-4 animate-in fade-in duration-200 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-white">Direct Studio Messages</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Communicate directly with our technical architect and creative leads.</p>
            </div>

            <div className="rounded-3xl bg-zinc-900/40 border border-zinc-800 flex flex-col h-[520px] overflow-hidden">
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {myMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 text-xs">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                    <span>No messages in this thread yet. Send a message to start!</span>
                  </div>
                ) : (
                  myMessages.map((m) => {
                    const isMe = m.senderId === user?.uid;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] text-zinc-400 font-semibold">{m.senderName}</span>
                          <span className="text-[9px] text-zinc-500">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`p-3 rounded-2xl max-w-sm text-xs ${
                          isMe ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-200'
                        }`}>
                          <p>{m.message}</p>
                          {m.attachments && m.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {m.attachments.map((att, idx) => (
                                <a key={idx} href={att} target="_blank" rel="noreferrer" className="block underline text-[10px] opacity-90 truncate">
                                  Attachment {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message to Bongio Digital leads..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="file"
                  id="chat-file-input"
                  onChange={(e) => setChatFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="chat-file-input" className={`p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 cursor-pointer ${chatFile ? 'text-blue-400 border-blue-500/50' : 'text-zinc-500'}`}>
                  <Paperclip className="w-4 h-4" />
                </label>
                <button
                  type="submit"
                  disabled={isSendingMsg || !chatInput.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="space-y-4 animate-in fade-in duration-200 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-white">In-App Notifications</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Sprint milestones, request status updates, and messages.</p>
            </div>

            {myNotifications.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800 text-xs text-zinc-500">
                You're all caught up! No new notifications.
              </div>
            ) : (
              <div className="space-y-2">
                {myNotifications.map((n) => (
                  <div key={n.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${n.read ? 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400' : 'bg-zinc-900 border-blue-500/40 text-zinc-100 shadow-sm'}`}>
                    <div>
                      <h4 className="font-semibold text-xs text-white">{n.title}</h4>
                      <p className="text-xs text-zinc-300 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-zinc-500 mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationReadFirestore(n.id)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] shrink-0"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. AI PLANS TAB */}
        {activeTab === "ai-plans" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Saved AI Architectural Blueprints</h3>
            {userPlans.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <p className="text-xs text-zinc-400 mb-3">No blueprints saved yet. Use the Google Intelligence suite on our homepage.</p>
                <Link to="/#hero" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
                  Generate Project Blueprint
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userPlans.map((plan) => (
                  <div key={plan.id} className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{plan.plan?.title || "AI Blueprint"}</h4>
                      <span className="text-xs text-blue-400 font-mono">{plan.plan?.recommendedBudgetTier}</span>
                    </div>
                    <p className="text-xs text-zinc-300">{plan.plan?.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 8. PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-white">Client Account Profile</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Manage your personal and business details. Profile pictures are uploaded to Firebase Storage.</p>
            </div>

            {profileNotice && (
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{profileNotice}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4 pb-2">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover border border-zinc-700" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {firstName[0]}
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    {isUploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    <span>Upload New Photo</span>
                  </label>
                  <span className="block text-[10px] text-zinc-500 mt-1">Saved to Firebase Storage</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="prof-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-email">
                  Email Address (Protected by Auth)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="prof-email"
                    type="email"
                    disabled
                    value={profile?.email || ""}
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-400 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-phone">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      id="prof-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-company">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      id="prof-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-country">
                    Country / Region
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      id="prof-country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Bangladesh"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-website">
                    Website URL
                  </label>
                  <input
                    id="prof-website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Read-Only Security Metadata */}
              <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-3 text-[11px] text-zinc-400">
                <div>
                  <span className="block text-zinc-500">Account Role</span>
                  <span className="font-mono text-zinc-300 uppercase">{profile?.role || "client"}</span>
                </div>
                <div>
                  <span className="block text-zinc-500">Status</span>
                  <span className="font-semibold text-emerald-400">{profile?.status || "active"}</span>
                </div>
                <div>
                  <span className="block text-zinc-500">Registered</span>
                  <span className="font-mono text-zinc-400">{profile?.createdAt?.split("T")[0] || "Active"}</span>
                </div>
                <div>
                  <span className="block text-zinc-500">User UID</span>
                  <span className="font-mono text-zinc-500 truncate block max-w-[140px]">{profile?.uid}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Profile Changes</span>}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};
