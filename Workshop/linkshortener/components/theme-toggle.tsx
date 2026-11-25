"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [saveError, setSaveError] = useState(false);

  function toggleTheme() {
    const root = document.documentElement;
    const theme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem("theme", theme);
      setSaveError(false);
    } catch (error) {
      console.error("Could not save theme preference:", error);
      setSaveError(true);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {saveError && (
        <span role="status" className="text-xs text-destructive">
          Could not save theme preference.
        </span>
      )}
      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        <Moon aria-hidden="true" className="size-4 dark:hidden" />
        <Sun aria-hidden="true" className="hidden size-4 dark:block" />
        <span className="sr-only dark:hidden">Switch to dark mode</span>
        <span className="sr-only hidden dark:inline">Switch to light mode</span>
      </Button>
    </div>
  );
}
