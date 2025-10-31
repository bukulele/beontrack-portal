// middleware.js

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { securedApiMapping } from "./apiMappingMiddleware";

// Define the middleware function
const authMiddleware = withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname; // Full pathname
    const userRoles = req.nextauth.token?.userRoles || []; // Assume the user's roles are stored in the token under userRoles

    // Check if the request is for an API route
    if (pathname.startsWith("/api/")) {
      // Split the pathname into parts
      const pathParts = pathname.split("/");

      // Get the relevant part after /api/
      const apiPath = pathParts[2]; // This will be the third part in the array (index 2)

      // Check if apiPath matches any key in securedApiMapping exactly
      for (const key in securedApiMapping) {
        const regex = new RegExp(`^${key}$`);
        if (regex.test(apiPath)) {
          const allowedRoles = securedApiMapping[key];
          const userRoleIds = userRoles.map((role) => role.id);

          // Check if any of the user's role IDs are in the allowedRoles array
          const hasAccess = allowedRoles.some((roleId) =>
            userRoleIds.includes(roleId)
          );

          if (!hasAccess) {
            return new NextResponse(
              JSON.stringify({ message: `No access to: ${pathname}` }),
              {
                status: 403,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        }
      }
    }

    // If no matched key is found, access is not restricted.
    return NextResponse.next();
  },
  {
    // Define custom sign-in and error pages
    pages: {
      signIn: "/", // Redirect to "/" if not authenticated
      error: "/no-access", // Redirect to "/no-access" on authorization errors
    },
  }
);

export default authMiddleware;

// Configure the matcher to exclude /shop-dashboard and specific API routes
export const config = {
  matcher: [
    /*
     * Apply middleware to all paths except:
     * - /shop-dashboard
     * - /api/get-shop-jobs
     * - /api/get-mechanics
     * - /api/auth/*
     * - /api/v1/* (new Prisma API routes - auth temporarily disabled for testing)
     * - /_next/static/*
     * - /favicon.ico
     */
    "/((?!shop-dashboard|api/get-shop-jobs|api/get-mechanics|api/auth|api/v1|_next/static|favicon.ico).*)",
  ],
};
