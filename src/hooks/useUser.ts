"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser as useClerkUser, useClerk } from "@clerk/nextjs";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  role?: string;
  plan?: string;
}

export function useUser() {
  const { user: clerkUser, isLoaded, isSignedIn: clerkSignedIn } = useClerkUser();
  const clerk = useClerk();
  const [localUser, setLocalUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sketch_local_user");
      if (stored) {
        try {
          setLocalUser(JSON.parse(stored));
        } catch {
          setLocalUser(null);
        }
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (clerk && typeof clerk.signOut === "function") {
        await clerk.signOut();
      }
    } catch (e) {
      console.warn("Clerk signOut notice:", e);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("sketch_local_user");
      setLocalUser(null);
    }
  }, [clerk]);

  // If Clerk has an authenticated user, prioritize Clerk
  if (clerkUser) {
    const profile: UserProfile = {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      full_name:
        clerkUser.fullName ||
        clerkUser.username ||
        localUser?.full_name ||
        clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "Architect",
      avatar_url: clerkUser.imageUrl || "",
      created_at: clerkUser.createdAt
        ? new Date(clerkUser.createdAt).toISOString()
        : localUser?.created_at || new Date().toISOString(),
      updated_at: clerkUser.updatedAt
        ? new Date(clerkUser.updatedAt).toISOString()
        : new Date().toISOString(),
      role: "Lead Architect",
      plan: "Sketch Professional (Unlimited)",
    };

    return {
      user: {
        id: profile.id,
        email: profile.email,
        user_metadata: {
          full_name: profile.full_name,
        },
      },
      profile,
      loading: !isLoaded,
      isSignedIn: true,
      signOut,
    };
  }

  // If local fallback user exists
  if (localUser) {
    return {
      user: {
        id: localUser.id,
        email: localUser.email,
        user_metadata: {
          full_name: localUser.full_name,
        },
      },
      profile: localUser,
      loading: false,
      isSignedIn: true,
      signOut,
    };
  }

  return {
    user: null,
    profile: null,
    loading: !isLoaded,
    isSignedIn: false,
    signOut,
  };
}