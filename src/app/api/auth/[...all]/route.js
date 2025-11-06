/**
 * Better Auth API Route
 *
 * This route handles all authentication requests.
 * Mounted at /api/auth/[...all] to catch all auth-related requests.
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);

export const runtime = "nodejs";
