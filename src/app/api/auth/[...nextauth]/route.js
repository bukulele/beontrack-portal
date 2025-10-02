import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const dynamic = "force-dynamic";

export const revalidate = 0;

const {
  AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SECRET,
  AZURE_AD_TENANT_ID,
  AZURE_ROLE_PORTAL_DISPATCH,
  AZURE_ROLE_PORTAL_SAFETY,
  AZURE_ROLE_PORTAL_RECRUITING,
  AZURE_ROLE_PORTAL_PAYROLL,
  AZURE_ROLE_PORTAL_PLANNER,
  AZURE_ROLE_PORTAL_SHOP,
  AZURE_ROLE_PORTAL_ADMIN,
  AZURE_ROLE_PORTAL_PAYROLL_MANAGER,
  AZURE_ROLE_PORTAL_HR,
} = process.env;

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: AZURE_AD_CLIENT_ID,
      clientSecret: AZURE_AD_CLIENT_SECRET,
      tenantId: AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        // Fetch user's roles from Microsoft Graph API
        const response = await fetch(
          "https://graph.microsoft.com/v1.0/me/memberOf?$select=id",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          }
        );

        const data = await response.json();
        token.userRoles = data.value; // Store roles in the token
      }
      token.userRoles = token.userRoles.filter(
        (value) =>
          value.id === AZURE_ROLE_PORTAL_DISPATCH ||
          value.id === AZURE_ROLE_PORTAL_SAFETY ||
          value.id === AZURE_ROLE_PORTAL_RECRUITING ||
          value.id === AZURE_ROLE_PORTAL_PAYROLL ||
          value.id === AZURE_ROLE_PORTAL_PLANNER ||
          value.id === AZURE_ROLE_PORTAL_SHOP ||
          value.id === AZURE_ROLE_PORTAL_ADMIN ||
          value.id === AZURE_ROLE_PORTAL_PAYROLL_MANAGER ||
          value.id === AZURE_ROLE_PORTAL_HR
      );
      return token;
    },
    async session({ session, token }) {
      session.userRoles = token.userRoles; // Pass roles to session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
