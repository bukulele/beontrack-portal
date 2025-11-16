/**
 * Better Auth Server Configuration
 *
 * This file configures Better Auth for server-side authentication.
 * It handles user authentication with email/password and session management.
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession, emailOTP } from "better-auth/plugins";
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Temporary storage for OTP in development mode
const devOTPStorage = new Map();
export { devOTPStorage };

export const auth = betterAuth({
  // Database configuration with Prisma adapter
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Base URL and trusted origins
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002",
  trustedOrigins: ["http://localhost:3002"],

  // Email/Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    minPasswordLength: 8,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
    },
  },

  // User model configuration
  user: {
    modelName: "user",
    fields: {
      email: "email",
      name: "username",
      emailVerified: "emailVerified",
    },
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
      department: {
        type: "string",
        required: false,
        input: true,
      },
      location: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  // Advanced configuration
  advanced: {
    database: {
      generateId: () => {
        // Use UUID v4
        return crypto.randomUUID();
      },
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  // Plugins
  plugins: [
    // Email OTP for passwordless portal authentication
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Mock OTP sender for development
        console.log(`📧 [MOCK] Sending OTP to ${email}`);
        console.log(`📧 [MOCK] OTP Code: ${otp}`);
        console.log(`📧 [MOCK] Type: ${type}`);

        // Store OTP in memory for dev mode (expires in 10 minutes)
        if (process.env.NODE_ENV === 'development') {
          devOTPStorage.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 600000 });
          // Clean up after 10 minutes
          setTimeout(() => devOTPStorage.delete(email.toLowerCase()), 600000);
        }

        // In production, replace this with real email sending:
        // await sendEmail({
        //   to: email,
        //   subject: 'Your verification code',
        //   text: `Your code is: ${otp}`,
        // });

        return { success: true };
      },
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      sendOnSignUp: true, // Send OTP on first sign-up
    }),

    customSession(async ({ user, session }) => {
      // Fetch user's roles and permissions
      const userWithRoles = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: true,
                },
              },
            },
          },
        },
      });

      if (!userWithRoles) {
        return { user, session };
      }

      // Attach roles and permissions to user
      return {
        user: {
          ...user,
          roles: userWithRoles.roles.map(ur => ur.role.name),
          permissions: userWithRoles.roles.flatMap(ur =>
            ur.role.permissions.map(p => ({
              entityType: p.entityType,
              actions: p.actions,
              fields: p.fields,
              conditions: p.conditions,
            }))
          ),
          department: userWithRoles.department,
          location: userWithRoles.location,
          isActive: userWithRoles.isActive,
          isSuperuser: userWithRoles.isSuperuser,
        },
        session,
      };
    }),
  ],
});

/**
 * Get session from request headers
 * Use this in API routes and server components
 */
export async function getSession(headers) {
  return await auth.api.getSession({
    headers,
  });
}

/**
 * Verify user credentials (for custom login flows)
 */
export async function verifyCredentials(email, password) {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
  });

  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

/**
 * Hash password (for user creation)
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
