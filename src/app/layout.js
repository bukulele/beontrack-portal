import { Inter } from "next/font/google";
import "./globals.css";
import { LoaderProvider } from "./context/LoaderContext";
import { SettingsProvider } from "./context/SettingsContext";
import LocalizationWrapper from "./components/localizationWrapper/LocalizationWrapper";
import MuiXLicense from "./MuiXLicense";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "4Tracks office app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <LocalizationWrapper>
        <LoaderProvider>
          <SettingsProvider>
            <body className={`${inter.className} bg-slate-50 dark:bg-gray-900`}>
              <main>
                {children}
                <MuiXLicense />
              </main>
            </body>
          </SettingsProvider>
        </LoaderProvider>
      </LocalizationWrapper>
    </html>
  );
}
