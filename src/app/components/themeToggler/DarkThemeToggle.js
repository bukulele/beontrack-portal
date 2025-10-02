"use client";

import { useEffect, useState } from "react";
import SwitchableComponent from "../switchableComponent/SwitchableComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(null);

  useEffect(() => {
    const savedTheme = Cookies.get("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode === null) return; // Skip until initialized

    if (darkMode) {
      document.documentElement.classList.add("dark");
      Cookies.set("theme", "dark", { expires: 365 });
    } else {
      document.documentElement.classList.remove("dark");
      Cookies.set("theme", "light", { expires: 365 });
    }
  }, [darkMode]);

  if (darkMode === null) return null; // Don't render until theme loaded

  return (
    <div className="flex items-center gap-2 p-2">
      <FontAwesomeIcon icon={faSun} className="text-yellow-500" />
      <SwitchableComponent
        checked={darkMode}
        onCheckedChange={() => setDarkMode(!darkMode)}
      />
      <FontAwesomeIcon icon={faMoon} className="text-blue-500" />
    </div>
  );
}
