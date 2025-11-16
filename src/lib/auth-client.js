/**
 * Better Auth Client Configuration
 *
 * This file configures Better Auth for client-side authentication.
 * Use this in React components for login, logout, and session management.
 */

"use client";

import { createAuthClient } from "better-auth/react";
import { customSessionClient, emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
  plugins: [
    customSessionClient(),
    emailOTPClient(),
  ],
});

/**
 * Auth hooks exported for convenience
 */
export const {
  useSession,
  signIn,
  signOut,
  signUp,
} = authClient;
