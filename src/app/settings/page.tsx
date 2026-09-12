"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Shield,
  Key,
  Database,
  Sliders,
  CheckCircle2,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [defaultCloud, setDefaultCloud] = useState("Vercel");
  const [defaultDb, setDefaultDb] = useState("Supabase PostgreSQL");
  const [saved, setSaved] = useState(false);

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
          Settings
        </h1>
        <p className="text-xs text-[#a1a1aa] font-sans">
          Manage your account profile, AI preferences, and architectural defaults.
        </p>
      </div>

      <div className="space-y-6 pt-6">
        {/* Account Profile */}
        <div className="rounded-xl border border-[#27272a] bg-[#111113] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#27272a] font-bold text-sm text-[#f4f4f5]">
            <User className="h-4 w-4 text-[#0ea5e9]" />
            <span>ACCOUNT INFORMATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#71717a] uppercase block mb-1">Signed In Email</label>
              <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] text-[#f4f4f5]">
                {user?.email || "architect@sketch.dev"}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] uppercase block mb-1">Architecture Plan</label>
              <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] text-[#10b981] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Sketch Professional (Unlimited)</span>
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
              <label className="text-[10px] text-[#71717a] uppercase block mb-1">Default Cloud Provider</label>
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
              <label className="text-[10px] text-[#71717a] uppercase block mb-1">Default Database Preference</label>
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
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] font-semibold text-xs h-8 px-4"
            >
              {saved ? "Preferences Saved!" : "Save Preferences"}
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <Trash2 className="h-4 w-4" />
            <span>DANGER ZONE</span>
          </div>
          <p className="text-xs text-[#a1a1aa] leading-relaxed font-sans">
            Resetting your local state clears browser workspace caches. Your cloud sketches remain safely backed up in the database.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Reset local workspace cache?")) {
                  localStorage.clear();
                  alert("Local workspace cache cleared.");
                }
              }}
              className="border-red-500/30 text-red-400 hover:bg-red-950/30 text-xs h-8"
            >
              Clear Workspace Cache
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
