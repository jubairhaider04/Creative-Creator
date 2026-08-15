import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Smartphone
} from "lucide-react";
import { UserAuth } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAuth) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [email, setEmail] = useState("alex@creativecreator.agency");
  const [password, setPassword] = useState("admin123");
  const [mfaCode, setMfaCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      if (data.mfaRequired) {
        setStep("mfa");
      } else if (data.user) {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2MfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mfaCode })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid MFA code");
      }

      if (data.user) {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "MFA validation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="auth-modal"
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Studio Client Portal</h3>
              <p className="text-[11px] text-zinc-400">Secure Multi-Factor Authenticated Access</p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-auth-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="input-auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="input-auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Demo prefill notice */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-start justify-between">
                <span>Demo Admin: <strong className="text-zinc-200">alex@creativecreator.agency</strong></span>
                <span className="font-mono text-blue-400 font-bold">admin123</span>
              </div>

              <button
                type="submit"
                id="btn-auth-submit-credentials"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue with MFA Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2MfaSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-2 pb-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Enter 6-Digit Authenticator Code</h4>
                <p className="text-xs text-zinc-400">
                  Open your authenticator app or use standard test code <strong className="text-blue-400 font-mono font-bold">849201</strong>
                </p>
              </div>

              <div>
                <input
                  id="input-auth-mfa-code"
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="849201"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="w-1/3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold border border-zinc-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  id="btn-auth-verify-mfa"
                  disabled={isLoading || mfaCode.length < 6}
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Sign In</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
