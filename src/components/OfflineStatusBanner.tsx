import React, { useState, useEffect } from "react";
import { WifiOff, Database, CheckCircle2, X, RefreshCw } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const OfflineStatusBanner: React.FC = () => {
  const { language } = useLanguage();
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? !navigator.onLine : false;
  });
  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setDismissed(false);
      const timer = setTimeout(() => {
        setJustReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
      setDismissed(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (dismissed) return null;

  if (justReconnected) {
    return (
      <div 
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm">
          <p className="font-semibold text-white">
            {language === "bn" ? "ইন্টারনেট পুনঃসংযোগ স্থাপিত" : "Internet Restored"}
          </p>
          <p className="text-emerald-300/80 text-xs">
            {language === "bn" 
              ? "রিয়েল-টাইম ডাটাবেস সিঙ্ক চালু রয়েছে।" 
              : "Reconnected to live database. Data is in sync."}
          </p>
        </div>
        <button
          onClick={() => setJustReconnected(false)}
          className="ml-auto text-emerald-400/70 hover:text-emerald-200 p-1 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[94%] sm:w-auto bg-zinc-900/95 border border-amber-500/40 text-zinc-200 px-4 py-3.5 rounded-xl shadow-2xl backdrop-blur-md flex items-start sm:items-center gap-3.5 animate-in fade-in slide-in-from-bottom duration-300"
    >
      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400 mt-0.5 sm:mt-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div className="text-xs sm:text-sm pr-2">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white">
            {language === "bn" ? "অফলাইন মোড সক্রিয়" : "Offline Persistence Active"}
          </p>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Database className="w-2.5 h-2.5" />
            IndexedDB
          </span>
        </div>
        <p className="text-zinc-400 text-xs mt-0.5">
          {language === "bn" 
            ? "ইন্টারনেট না থাকলেও ক্যাশ করা প্রজেক্ট ও সার্ভিস ডাটা দৃশ্যমান রয়েছে।" 
            : "Cached project and service data remains fully visible while disconnected."}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="ml-auto text-zinc-400 hover:text-white p-1 rounded-md transition-colors"
        aria-label="Dismiss offline banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
