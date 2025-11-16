import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Applicant Portal",
  description: "External portal for applicants and employees",
};

/**
 * Portal Root Layout
 *
 * Separate layout hierarchy for the portal.
 * Does NOT include office app contexts (SettingsProvider, EmployeeProvider, etc.)
 * Keeps portal lightweight and independent.
 */
export default function PortalRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 dark:bg-gray-900`}>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
