"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import {
  ArrowLeft,
  User,
  Sliders,
  CheckCircle2,
  Trash2,
  LogOut,
  Copy,
  Check,
  ShieldCheck,
  Mail,
  Calendar,
  Sparkles,
  Fingerprint
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, isSignedIn, signOut, loading } = useUser();

  const [defaultCloud, setDefaultCloud] = useState("Vercel");
  const [defaultDb, setDefaultDb] = useState("Supabase PostgreSQL");
  const [saved, setSaved] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "System Architect";
  const displayEmail = profile?.email || user?.email || "architect@sketch.dev";
  const displayId = profile?.id || user?.id || "usr_sketch_arch_001";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SA";

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "September 14, 2026";

  const handleCopyId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(displayId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      setSigningOut(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 bg-[#09090b] text-[#f4f4f5] min-h-[calc(100vh-68px)] p-4 sm:p-8 max-w-4xl mx-auto w-full font-mono text-xs">
      {/* Header */}
      <div className="pb-6 border-b border-[#27272a] space-y-2">
        <Link
          href="/dashboard"
          className="text-xs text-[#71717a] hover:text-[#0ea5e9] flex items-center gap-1 mb-2 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
        <div className="text-xs text-[#0ea5e9] uppercase tracking-wider font-bold">
          WORKSPACE CONFIGURATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
          Account & Workspace Settings
        </h1>
        <p className="text-xs text-[#a1a1aa] font-sans">
          Review your account profile, manage session authentication, and adjust architectural defaults.
        </p>
      </div>

      <div className="space-y-6 pt-6">
        {/* User Detail & Profile Card */}
        <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-[#18181b] border-2 border-[#0ea5e9]/50 flex items-center justify-center text-sm font-bold text-[#0ea5e9] shadow-sm">
                  {initials}
                </div>
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#111113]"
                  title="Active Session"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#f4f4f5]">
                    {loading ? "Loading account..." : displayName}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20">
                    Active Architect
                  </span>
                </div>
                <p className="text-xs text-[#71717a] font-sans">{displayEmail}</p>
              </div>
            </div>

            {/* Top Sign Out CTA button */}
            <div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={signingOut}
                className="border-red-500/30 text-red-400 hover:bg-red-950/40 hover:text-red-300 text-xs h-9 px-3.5 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{signingOut ? "Signing Out..." : "Sign Out"}</span>
              </Button>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="p-3 rounded-lg bg-[#18181b]/70 border border-[#27272a] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#71717a] uppercase font-bold">
                <User className="h-3 w-3 text-[#0ea5e9]" />
                <span>Full Name</span>
              </div>
              <div className="text-xs font-semibold text-[#f4f4f5]">{displayName}</div>
            </div>

            {/* Email Address */}
            <div className="p-3 rounded-lg bg-[#18181b]/70 border border-[#27272a] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#71717a] uppercase font-bold">
                <Mail className="h-3 w-3 text-[#0ea5e9]" />
                <span>Email Address</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f4f4f5] truncate mr-2">
                  {displayEmail}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-sans">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
            </div>

            

            {/* Member Since */}
            <div className="p-3 rounded-lg bg-[#18181b]/70 border border-[#27272a] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#71717a] uppercase font-bold">
                <Calendar className="h-3 w-3 text-[#0ea5e9]" />
                <span>Account Created</span>
              </div>
              <div className="text-xs font-semibold text-[#f4f4f5]">{memberSince}</div>
            </div>

            {/* Architecture Plan */}
            <div className="p-3 rounded-lg bg-[#18181b]/70 border border-[#27272a] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#71717a] uppercase font-bold">
                <Sparkles className="h-3 w-3 text-[#0ea5e9]" />
                <span>Subscription Tier</span>
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Sketch Professional (Unlimited Canvas & AI)</span>
              </div>
            </div>

            {/* Session Status */}
            <div className="p-3 rounded-lg bg-[#18181b]/70 border border-[#27272a] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#71717a] uppercase font-bold">
                <ShieldCheck className="h-3 w-3 text-[#0ea5e9]" />
                <span>Session Status</span>
              </div>
              <div className="text-xs text-[#f4f4f5] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isSignedIn ? "Authenticated & Synced" : "Local Workspace Session"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Architecture Defaults */}
        <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#27272a] font-bold text-sm text-[#f4f4f5]">
            <Sliders className="h-4 w-4 text-[#0ea5e9]" />
            <span>ARCHITECTURE GENERATION PREFERENCES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#71717a] uppercase block mb-1">
                Default Cloud Provider
              </label>
              <select
                value={defaultCloud}
                onChange={(e) => setDefaultCloud(e.target.value)}
                className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-[#f4f4f5] focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="Vercel">Vercel (Recommended)</option>
                <option value="AWS">Amazon Web Services (AWS)</option>
                <option value="GCP">Google Cloud Platform (GCP)</option>
                <option value="Cloudflare">Cloudflare Workers</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] uppercase block mb-1">
                Default Database Preference
              </label>
              <select
                value={defaultDb}
                onChange={(e) => setDefaultDb(e.target.value)}
                className="w-full p-2.5 rounded bg-[#18181b] border border-[#27272a] text-[#f4f4f5] focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="Supabase PostgreSQL">Supabase PostgreSQL + pgvector (Recommended)</option>
                <option value="Neon PostgreSQL">Neon Serverless PostgreSQL</option>
                <option value="MongoDB Atlas">MongoDB Atlas</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSave}
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-semibold text-xs h-8 px-4 cursor-pointer"
            >
              {saved ? "Preferences Saved!" : "Save Preferences"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
