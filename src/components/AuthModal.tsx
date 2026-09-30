import React, { useState } from "react";
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Check
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot-password";
  redirectPath?: string;
}

export const getFriendlyAuthErrorMessage = (error: any): string => {
  const code = error?.code || "";
  const msg = error?.message || "";

  if (code === "auth/invalid-email" || msg.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential" || msg.includes("invalid-credential")) {
    return "Email or password is incorrect.";
  }
  if (code === "auth/email-already-in-use" || msg.includes("email-already-in-use")) {
    return "An account with this email already exists. Please login instead.";
  }
  if (code === "auth/weak-password" || msg.includes("weak-password")) {
    return "Password should be at least 8 characters long.";
  }
  if (code === "auth/too-many-requests" || msg.includes("too-many-requests")) {
    return "Too many login attempts. Please try again later.";
  }
  if (code === "auth/user-disabled" || msg.includes("user-disabled")) {
    return "Your account has been suspended. Please contact Bongio Digital support.";
  }
  if (code === "auth/network-request-failed" || msg.includes("network-request-failed")) {
    return "Unable to connect. Please check your internet connection and try again.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Google sign-in popup was closed before completion.";
  }
  if (code === "auth/popup-blocked") {
    return "Sign-in popup was blocked. Please allow popups for Google authentication.";
  }
  return "Authentication error. Please check your details and try again.";
};

// Ensure redirects are internal only (Security: prevent open-redirects)
export const sanitizeRedirectPath = (path?: string | null): string | null => {
  if (!path) return null;
  const decoded = decodeURIComponent(path).trim();
  if (decoded.startsWith("/") && !decoded.startsWith("//") && !decoded.includes("://")) {
    return decoded;
  }
  return null;
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  redirectPath
}) => {
  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<"login" | "register" | "forgot-password">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetRedirect = sanitizeRedirectPath(redirectPath || searchParams.get("redirect"));

  const handlePostAuthRedirect = (profile: any) => {
    onClose();
    if (targetRedirect) {
      navigate(targetRedirect);
      return;
    }
    if (profile?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const profile = await login(cleanEmail, password);
      handlePostAuthRedirect(profile);
    } catch (err: any) {
      setErrorMessage(getFriendlyAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage("Full Name is required.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("You must agree to Bongio Digital's Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      const profile = await register({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: phone.trim(),
        company: company.trim()
      });
      handlePostAuthRedirect(profile);
    } catch (err: any) {
      setErrorMessage(getFriendlyAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(cleanEmail);
      setSuccessMessage("If an account exists for this email, we've sent a password reset link. Please check your inbox.");
    } catch (err: any) {
      // Security: Do not reveal if email exists, show friendly message
      setSuccessMessage("If an account exists for this email, we've sent a password reset link. Please check your inbox.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const profile = await loginWithGoogle();
      handlePostAuthRedirect(profile);
    } catch (err: any) {
      setErrorMessage(getFriendlyAuthErrorMessage(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-4 animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-auth-modal"
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT BRANDING PANEL (Desktop only) */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-blue-950/60 via-zinc-900/80 to-zinc-950 border-r border-zinc-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-500 p-[1px] shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#0d0f15] rounded-[11px] flex items-center justify-center font-bold text-white text-xs tracking-wider">
                  BD
                </div>
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Bongio Digital
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">
              {mode === "register" ? "Create your client workspace" : "Welcome back to the studio"}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Track project milestones, access real-time deliverables, review invoices, and collaborate directly with our engineering & design teams.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>Real-Time Project & Sprint Telemetry</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-blue-950/80 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-blue-400" />
                </div>
                <span>Direct Access to Production Assets & Code</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-purple-950/80 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span>Integrated Invoices & WhatsApp Support</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted with Google Firebase Auth</span>
          </div>
        </div>

        {/* RIGHT AUTH FORM PANEL */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          
          {/* Tabs for Login / Register */}
          {mode !== "forgot-password" && (
            <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-6 w-full sm:w-72">
              <button
                type="button"
                id="tab-auth-login"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "login"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="tab-auth-register"
                onClick={() => {
                  setMode("register");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "register"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="mb-5">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {mode === "login" && "Sign in to Bongio Digital"}
              {mode === "register" && "Start your digital journey"}
              {mode === "forgot-password" && "Reset your password"}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {mode === "login" && "Enter your credentials or continue with Google"}
              {mode === "register" && "Set up your client profile in 30 seconds"}
              {mode === "forgot-password" && "Enter your email to receive a password reset link"}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in" role="alert">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in" role="status">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN (for login or register) */}
          {mode !== "forgot-password" && (
            <div className="mb-5">
              <button
                type="button"
                id="btn-google-auth"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading || isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 active:scale-[0.99] border border-zinc-700/80 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-60 disabled:pointer-events-none"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500 font-semibold tracking-wider">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="login-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-zinc-300" htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot-password");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-login-submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-zinc-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage(null);
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  Create account
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTRATION FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="reg-name">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jubair Ahmed"
                    autoComplete="name"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="reg-email">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="reg-phone">
                    Phone / WhatsApp (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      id="reg-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1..."
                      autoComplete="tel"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="reg-company">
                  Company / Organization (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="reg-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Tech"
                    autoComplete="organization"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="reg-password">
                    Password (min 8 chars) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="reg-confirm-password">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-zinc-950"
                />
                <label htmlFor="agree-terms" className="text-[11px] text-zinc-400 leading-tight">
                  I agree to Bongio Digital's <span className="text-zinc-200">Terms of Service</span> and <span className="text-zinc-200">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                id="btn-register-submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-zinc-400">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {mode === "forgot-password" && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1" htmlFor="reset-email">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-reset-password-submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
