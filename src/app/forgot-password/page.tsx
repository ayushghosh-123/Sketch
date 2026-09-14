"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="flex-1 w-full bg-[#000000] text-[#f4f4f5] flex flex-col items-center justify-center px-4 py-16 min-h-[calc(100vh-68px)] font-sans relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111111] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded bg-[#18181b] border border-white/10 flex items-center justify-center text-[#f97316]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 2 4 4-10 10H8v-4L18 2z" />
                <path d="m14 6 4 4" />
                <path d="M4 20h16" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-wider text-white uppercase font-sans">
              SKETCH
            </span>
          </Link>

          <h1 className="text-xl font-bold text-white font-sans">Reset your password</h1>
          <p className="text-xs text-[#a1a1aa]">
            Enter your email and we&apos;ll send you a password recovery link.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#a1a1aa]">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                placeholder="architect@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#18181b] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#f97316] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-semibold font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 chai-btn-primary shadow-lg shadow-orange-950/40"
            >
              <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors inline-flex items-center gap-1 font-sans"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Log In
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="h-10 w-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center mx-auto text-[#10b981]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              If an account exists for <span className="font-semibold text-[#f4f4f5]">{email}</span>, a recovery link has been dispatched.
            </p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs text-[#f4f4f5] transition-colors font-mono"
            >
              Return to Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
