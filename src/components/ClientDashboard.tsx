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
  Check
} from "lucide-react";
import { getUserAiPlansFirestore, subscribeToLeadsFirestore } from "../lib/firebase";

export const ClientDashboard: React.FC = () => {
  const { user, profile, logout, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active section tab
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "orders" | "invoices" | "messages" | "ai-plans" | "profile">("overview");

  // Profile edit form
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [company, setCompany] = useState(profile?.company || "");
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // User's AI plans & inquiries from Firestore
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [userLeads, setUserLeads] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Check URL path to sync tab
  useEffect(() => {
    if (location.pathname.includes("profile")) setActiveTab("profile");
    else if (location.pathname.includes("projects")) setActiveTab("projects");
    else if (location.pathname.includes("orders")) setActiveTab("orders");
    else if (location.pathname.includes("invoices")) setActiveTab("invoices");
    else if (location.pathname.includes("messages")) setActiveTab("messages");
    else if (location.pathname.includes("ai-plans")) setActiveTab("ai-plans");
    else setActiveTab("overview");
  }, [location.pathname]);

  // Sync profile fields if updated
  useEffect(() => {
    if (profile) {
      setName(profile.displayName || "");
      setPhone(profile.phone || "");
      setCompany(profile.company || "");
      setPhotoURL(profile.photoURL || "");
    }
  }, [profile]);

  // Load real Firestore data for current user
  useEffect(() => {
    if (user?.uid) {
      setIsLoadingPlans(true);
      getUserAiPlansFirestore(user.uid)
        .then((plans) => setUserPlans(plans))
        .finally(() => setIsLoadingPlans(false));

      // Listen to user's leads
      const unsub = subscribeToLeadsFirestore((allLeads) => {
        const myLeads = allLeads.filter(l => l.email === user.email || l.userId === user.uid);
        setUserLeads(myLeads);
      });

      return () => {
        if (unsub) unsub();
      };
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    try {
      await updateProfile({
        displayName: name.trim(),
        phone: phone.trim(),
        company: company.trim(),
        photoURL: photoURL.trim()
      });
      setProfileMessage("Your profile information was updated successfully.");
      setTimeout(() => setProfileMessage(null), 4000);
    } catch (err: any) {
      setProfileMessage("Failed to update profile: " + (err.message || "Unknown error"));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const firstName = profile?.displayName ? profile.displayName.split(" ")[0] : "Client";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900/60 border-b md:border-b-0 md:border-r border-zinc-800 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-[#0d0f15] rounded-[11px] flex items-center justify-center font-bold text-white text-xs">
                BD
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">
                Bongio Digital
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Client Workspace</span>
            </div>
          </Link>

          {/* User mini profile card */}
          <div className="p-3 mb-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="" className="w-9 h-9 rounded-xl object-cover border border-zinc-700" />
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
              <span>Dashboard Overview</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("projects"); navigate("/dashboard/projects"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "projects" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>My Projects</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("orders"); navigate("/dashboard/orders"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "orders" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Inquiries & Quotes</span>
              {userLeads.length > 0 && (
                <span className="ml-auto px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                  {userLeads.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("invoices"); navigate("/dashboard/invoices"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "invoices" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Invoices & Billing</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("messages"); navigate("/dashboard/messages"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "messages" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Support Messages</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("ai-plans"); navigate("/dashboard/ai-plans"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "ai-plans" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Saved AI Roadmaps</span>
              {userPlans.length > 0 && (
                <span className="ml-auto px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
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
            <span>← Back to Bongio Public Site</span>
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

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        
        {/* Top Header greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Welcome, {firstName}
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Client
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Manage your engineering sprints, custom quotes, invoices, and direct studio inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/8801676056414"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-sm transition-all"
            >
              <span>Direct Studio WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Active Projects</span>
                  <FolderGit2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">1</span>
                  <span className="text-xs text-emerald-400 font-semibold">Sprint In Progress</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Inquiries & Quotes</span>
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">{userLeads.length || 1}</span>
                  <span className="text-xs text-zinc-400">Recorded</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Outstanding Payments</span>
                  <Receipt className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">৳ 0</span>
                  <span className="text-xs text-emerald-400 font-semibold">All Cleared</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-xs font-medium">Unread Messages</span>
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">0</span>
                  <span className="text-xs text-zinc-400">Up to date</span>
                </div>
              </div>
            </div>

            {/* Current Active Sprint Progress */}
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Active Sprint #104</span>
                  <h3 className="text-base font-bold text-white">Full-Stack Web Application & Design System Handover</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30 text-xs font-semibold self-start sm:self-auto">
                  75% Completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full" style={{ width: "75%" }} />
              </div>

              {/* Milestones grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">UI/UX Wireframes & Prototypes</div>
                    <div className="text-[10px] text-zinc-400">Approved by Client</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">React 19 & Tailwind Engine</div>
                    <div className="text-[10px] text-zinc-400">Built & Lint Verified</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/60 border border-blue-500/30 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0 animate-spin" />
                  <div>
                    <div className="font-semibold text-white">Payment Gateway & Live Deploy</div>
                    <div className="text-[10px] text-blue-300">Target Delivery: 3 Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent inquiries & AI Scopes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recorded Inquiries */}
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    My Submitted Inquiries
                  </h4>
                  <button type="button" onClick={() => setActiveTab("orders")} className="text-xs text-blue-400 hover:text-blue-300">
                    View all
                  </button>
                </div>
                {userLeads.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No inquiry requests submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {userLeads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-white">{lead.services?.join(", ") || "Custom Project"}</div>
                          <div className="text-[10px] text-zinc-400">{lead.budget} • {lead.timeline}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/30 capitalize">
                          {lead.status || "reviewing"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved AI Project Roadmaps */}
              <div className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-amber-400" />
                    Saved AI Roadmaps
                  </h4>
                  <button type="button" onClick={() => setActiveTab("ai-plans")} className="text-xs text-blue-400 hover:text-blue-300">
                    View all
                  </button>
                </div>
                {userPlans.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No AI scopes saved yet. Use the AI Consultant to generate one!</p>
                ) : (
                  <div className="space-y-2">
                    {userPlans.slice(0, 3).map((plan) => (
                      <div key={plan.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
                        <div className="font-semibold text-white truncate">{plan.plan?.title || "AI Architectural Blueprint"}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1">{plan.plan?.summary}</div>
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
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Active & Delivered Projects</h3>
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Bongio Commerce & Full-Stack Platform</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  Sprint Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full-spectrum production: Sub-second page performance, bKash & Nagad integration, bespoke dark UI, and automated analytics.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-zinc-400">
                <span className="px-2 py-1 rounded-lg bg-zinc-800">React 19</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-800">Tailwind CSS</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-800">Firebase Firestore</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-800">SSLCommerz</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS & INQUIRIES TAB */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">My Submitted Inquiries & Quotes</h3>
            {userLeads.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <p className="text-xs text-zinc-400 mb-3">You have not submitted an inquiry from this account yet.</p>
                <Link to="/#contact" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md">
                  Submit a Project Scope
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/70 text-zinc-400 border-b border-zinc-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Services Requested</th>
                      <th className="py-3 px-4">Budget Tier</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {userLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-800/20">
                        <td className="py-3 px-4 font-semibold text-white">{lead.services?.join(", ") || "Project"}</td>
                        <td className="py-3 px-4 font-mono text-zinc-300">{lead.budget}</td>
                        <td className="py-3 px-4 text-zinc-400">{lead.timeline}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/30 capitalize">
                            {lead.status || "reviewing"}
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

        {/* 4. INVOICES & BILLING TAB */}
        {activeTab === "invoices" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Invoices & Payment Receipts</h3>
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">No Outstanding Invoices</div>
              <p className="text-xs text-zinc-400">All sprint milestones are in good standing.</p>
            </div>
          </div>
        )}

        {/* 5. MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Direct Communication & Support</h3>
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Need urgent updates or feature adjustments? Our lead engineers respond in real-time on our verified WhatsApp business line.
              </p>
              <a
                href="https://wa.me/8801676056414"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Chat on WhatsApp (+880 1676-056414)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* 6. AI PLANS TAB */}
        {activeTab === "ai-plans" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white">Saved AI Project Roadmaps</h3>
            {userPlans.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 rounded-2xl border border-zinc-800">
                <p className="text-xs text-zinc-400 mb-3">No AI project blueprints saved to your account yet.</p>
                <Link to="/#hero" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md">
                  Generate AI Architecture Plan
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userPlans.map((plan) => (
                  <div key={plan.id} className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{plan.plan?.title || "Project Architecture Plan"}</h4>
                      <span className="text-[11px] font-mono text-zinc-400">{plan.plan?.recommendedBudgetTier}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{plan.plan?.summary}</p>
                    {plan.plan?.phases && (
                      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Execution Phases</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {plan.plan.phases.map((ph: any, i: number) => (
                            <div key={i} className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs">
                              <span className="text-blue-400 font-semibold block">{ph.phase}</span>
                              <span className="text-[10px] text-zinc-400">{ph.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white">Client Account Profile</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Update your contact details and business information. Roles and security metadata are protected.
              </p>
            </div>

            {profileMessage && (
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4 max-w-xl">
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-email">
                  Email Address (Read-Only)
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
                      placeholder="+880..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
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
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="prof-avatar">
                  Profile Photo URL
                </label>
                <input
                  id="prof-avatar"
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Read-Only Account Security Metadata */}
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
                  <span className="block text-zinc-500">Registered At</span>
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
