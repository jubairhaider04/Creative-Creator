import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, AlertTriangle, ArrowLeft, LogOut, Loader2, Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "admin" | "client";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { user, profile, loading, isAuthenticated, isAdmin, isSuspended, logout } = useAuth();
  const location = useLocation();

  // 1. Loading State (Prevent authentication flickering)
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            BD
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </div>
        <p className="text-zinc-400 text-xs font-mono animate-pulse">
          Verifying Bongio Digital credentials...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated check -> Redirect to /login with memory
  if (!isAuthenticated || !user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  // 3. Suspended account check
  if (isSuspended) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900/80 border border-red-500/30 text-center shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Account Suspended</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Your Bongio Digital account is currently suspended. Please contact Bongio Digital support at <span className="text-zinc-200">jubair04sale@gmail.com</span> or via WhatsApp.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
            <a
              href="https://wa.me/8801676056414"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 4. Role Authorization check (Prevent clients from accessing /admin/*)
  if (requireRole === "admin" && !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900/80 border border-amber-500/30 text-center shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Admin privileges are required to access the Bongio Digital Administration Hub. Your current account role is <span className="font-mono text-amber-300 font-semibold">{profile?.role || "client"}</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              Go to Client Dashboard
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
