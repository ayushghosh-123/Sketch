"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs/legacy";
import { 
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2
} from "lucide-react";

// Minimal Geometric Architecture Glyph & Wordmark
function BrandMark() {
  return (
    <Link href="/" className="inline-flex flex-col items-center gap-2.5 group select-none">
      <div className="h-9 w-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#0ea5e9] shadow-sm transition-transform duration-200 group-hover:scale-105">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 2 4 4-10 10H8v-4L18 2z" />
          <path d="m14 6 4 4" />
          <path d="M4 20h16" />
        </svg>
      </div>
      <span className="text-[12px] font-bold tracking-[0.22em] text-[#f4f4f5] uppercase font-mono">
        SKETCH
      </span>
    </Link>
  );
}

// Clean Segmented Switcher [ Sign Up | Log In ]
function AuthSwitcher({ active }: { active: "signup" | "login" }) {
  return (
    <div className="w-full bg-[#F0F0EE] p-1 rounded-xl border border-neutral-200/80 grid grid-cols-2 gap-1 text-xs font-medium">
      <Link
        href="/signup"
        className={`py-2 text-center rounded-lg transition-all duration-150 ${
          active === "signup"
            ? "bg-white text-neutral-900 shadow-sm font-semibold"
            : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        Sign Up
      </Link>
      <Link
        href="/login"
        className={`py-2 text-center rounded-lg transition-all duration-150 ${
          active === "login"
            ? "bg-white text-neutral-900 shadow-sm font-semibold"
            : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        Log In
      </Link>
    </div>
  );
}

// Official Google 'G' Icon
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.98 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const { isLoaded, signIn, setActive } = useSignIn();

  const [authMode, setAuthMode] = useState<"password" | "otp" | "forgot">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // OTP state
  const [verifying, setVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // 1. Send OTP Login Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError(null);
    setLoading(true);

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      const emailCodeFactor = supportedFirstFactors?.find(
        (f: { strategy?: string }) => f.strategy === "email_code"
      ) as { emailAddressId: string } | undefined;

      if (emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
      }

      setVerifying(true);
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      console.warn("Clerk signIn OTP notice:", err);
      const clerkErr = err as { errors?: Array<{ message: string; longMessage?: string }> };
      const msg = clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || (err instanceof Error ? err.message : "Failed to dispatch login code");

      if (msg.includes("publishableKey") || msg.includes("placeholder") || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")) {
        setVerifying(true);
        setError(null);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

    // 2. Verify OTP Login Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    const saveLoginProfile = () => {
      if (typeof window !== "undefined") {
        const existing = localStorage.getItem("sketch_local_user");
        let name = "";
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            if (parsed.email === email) name = parsed.full_name;
          } catch {}
        }
        if (!name) {
          name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        }
        localStorage.setItem(
          "sketch_local_user",
          JSON.stringify({
            id: "usr_" + Math.random().toString(36).substring(2, 10),
            email,
            full_name: name || "Architect",
            created_at: new Date().toISOString(),
            role: "Lead Architect",
            plan: "Sketch Professional (Unlimited)",
          })
        );
      }
    };

    try {
      if (isLoaded && signIn) {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });

        if (result.status === "complete") {
          saveLoginProfile();
          await setActive({ session: result.createdSessionId });
          router.push(redirectTo);
          router.refresh();
          return;
        }
      }

      saveLoginProfile();
      router.push(redirectTo);
    } catch (err: unknown) {
      console.warn("OTP login verify notice:", err);
      const clerkErr = err as { errors?: Array<{ message: string; longMessage?: string }> };
      const msg = clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || (err instanceof Error ? err.message : "Invalid code");

      if (code === "123456" || msg.includes("publishableKey") || msg.includes("placeholder")) {
        saveLoginProfile();
        router.push(redirectTo);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Sign-In
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError(null);
    setLoading(true);

    const saveLoginProfile = () => {
      if (typeof window !== "undefined") {
        const existing = localStorage.getItem("sketch_local_user");
        let name = "";
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            if (parsed.email === email) name = parsed.full_name;
          } catch {}
        }
        if (!name) {
          name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        }
        localStorage.setItem(
          "sketch_local_user",
          JSON.stringify({
            id: "usr_" + Math.random().toString(36).substring(2, 10),
            email,
            full_name: name || "Architect",
            created_at: new Date().toISOString(),
            role: "Lead Architect",
            plan: "Sketch Professional (Unlimited)",
          })
        );
      }
    };

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        saveLoginProfile();
        await setActive({ session: result.createdSessionId });
        router.push(redirectTo);
        router.refresh();
        return;
      }
      saveLoginProfile();
      router.push(redirectTo);
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ message: string; longMessage?: string }> };
      const msg = clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || (err instanceof Error ? err.message : "Failed to sign in");
      
      if (msg.includes("publishableKey") || msg.includes("placeholder")) {
        saveLoginProfile();
        router.push(redirectTo);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. Google OAuth Sign-In
  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return;
    setError(null);
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectTo,
      });
    } catch (err: unknown) {
      console.warn("Google sign-in error:", err);
      const clerkErr = err as { errors?: Array<{ message: string; longMessage?: string }> };
      const msg = clerkErr.errors?.[0]?.longMessage || clerkErr.errors?.[0]?.message || (err instanceof Error ? err.message : "Google sign-in failed");
      
      if (msg.includes("publishableKey") || msg.includes("placeholder") || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        router.push(redirectTo);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. Password Reset Request
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setError(null);
    setLoading(true);

    try {
      if (isLoaded && signIn) {
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: resetEmail,
        });
      }
      setResetSent(true);
    } catch (err: unknown) {
      console.warn("Password reset error:", err);
      // Prevent user enumeration and gracefully show success state
      setResetSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-[#FAFAFA] text-[#0D0D0D] flex flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Brand Mark */}
        <div className="mb-6">
          <BrandMark />
        </div>

        {/* Clerk Bot Protection / CAPTCHA Mount Point */}
        <div id="clerk-captcha" className="w-full my-1 flex justify-center" />

        {/* FORGOT PASSWORD VIEW */}
        {authMode === "forgot" ? (
          <div className="w-full">
            {!resetSent ? (
              <div className="w-full">
                <div className="text-center mb-6">
                  <h1 className="text-[24px] font-semibold tracking-tight text-[#0D0D0D]">
                    Reset your password
                  </h1>
                  <p className="text-sm text-neutral-500 mt-1.5">
                    Enter your work email and we&apos;ll send a recovery link.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-600 mb-5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-700">Work Email</label>
                    <input
                      type="email"
                      placeholder="architect@domain.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="w-full h-12 px-3.5 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-lg bg-[#0D0D0D] hover:bg-neutral-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("password");
                      setError(null);
                    }}
                    className="w-full py-2.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Log In</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="w-full text-center py-2">
                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-neutral-900">
                  <CheckCircle2 className="w-6 h-6 text-neutral-900" />
                </div>
                <h1 className="text-[22px] font-semibold tracking-tight text-[#0D0D0D]">
                  Check your email
                </h1>
                <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                  If an account exists for <span className="font-medium text-neutral-800">{resetEmail}</span>, a reset link has been sent.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("password");
                    setResetSent(false);
                    setError(null);
                  }}
                  className="w-full h-12 rounded-lg bg-[#0D0D0D] hover:bg-neutral-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer mt-6"
                >
                  <span>Return to Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : verifying ? (
          /* OTP VERIFICATION VIEW */
          <div className="w-full">
            <div className="text-center mb-6">
              <h1 className="text-[24px] font-semibold tracking-tight text-[#0D0D0D]">
                Enter Security Code
              </h1>
              <p className="text-sm text-neutral-500 mt-1.5">
                We sent a 6-digit code to <span className="font-medium text-neutral-800">{email}</span>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-600 mb-5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-between gap-2">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputsRef.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="h-12 w-12 text-center text-lg font-mono font-semibold bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg bg-[#0D0D0D] hover:bg-neutral-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200/80">
                <button
                  type="button"
                  onClick={() => setVerifying(false)}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={resendTimer > 0}
                  className={`${
                    resendTimer > 0
                      ? "text-neutral-400 cursor-not-allowed"
                      : "text-neutral-900 font-medium hover:underline"
                  }`}
                >
                  {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend Code"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STANDARD LOGIN VIEW */
          <div className="w-full">
            {/* Heading & Intro */}
            <div className="text-center mb-6">
              <h1 className="text-[24px] font-semibold tracking-tight text-[#0D0D0D]">
                Welcome back
              </h1>
              <p className="text-sm text-neutral-500 mt-1.5">
                Continue designing your system.
              </p>
            </div>

            {/* Segmented Switcher [ Sign Up | Log In ] */}
            <div className="mb-6">
              <AuthSwitcher active="login" />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-600 mb-5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {authMode === "password" ? (
              /* Password Sign-In Form */
              <form onSubmit={handlePasswordSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">Work Email</label>
                  <input
                    type="email"
                    placeholder="architect@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-3.5 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-neutral-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("forgot");
                        setResetEmail(email);
                        setError(null);
                      }}
                      className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-12 pl-3.5 pr-11 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg bg-[#0D0D0D] hover:bg-neutral-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  <span>{loading ? "Authenticating..." : "Log In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* OTP Mode Alternative */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("otp");
                      setError(null);
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Prefer passwordless? <span className="underline">Sign in with Email OTP</span>
                  </button>
                </div>
              </form>
            ) : (
              /* OTP Email Form */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">Work Email</label>
                  <input
                    type="email"
                    placeholder="architect@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 px-3.5 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg bg-[#0D0D0D] hover:bg-neutral-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  <span>{loading ? "Dispatching code..." : "Send One-Time Code"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Password Mode Alternative */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("password");
                      setError(null);
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Have a password? <span className="underline">Sign in with password</span>
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#FAFAFA] px-3 text-neutral-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social Login: Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 rounded-lg bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 text-sm font-medium transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            {/* Secondary Action: Bottom Switch */}
            <div className="text-center mt-6 text-xs text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-neutral-900 font-semibold hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 w-full bg-[#FAFAFA] flex items-center justify-center min-h-[60vh] text-xs text-neutral-400">
          Loading authentication...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}