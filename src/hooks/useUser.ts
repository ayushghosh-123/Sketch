"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";

export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  return {
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          user_metadata: {
            full_name: user.fullName || user.username || "",
          },
        }
      : null,
    profile: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          full_name: user.fullName || user.username || "",
          avatar_url: user.imageUrl || "",
          created_at: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
          updated_at: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
        }
      : null,
    loading: !isLoaded,
    isSignedIn,
  };
}