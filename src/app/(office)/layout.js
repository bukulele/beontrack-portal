import { SettingsProvider } from "../context/SettingsContext";

export default function OfficeLayout({ children }) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}
