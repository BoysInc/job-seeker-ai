"use client"

import { useSyncExternalStore } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const subscribeToThemeClass = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

const isDarkSnapshot = () =>
  document.documentElement.classList.contains("dark")

/**
 * Dependency-free dark mode toggle. Pairs with the inline script in
 * app/layout.tsx that applies the stored preference before first paint.
 */
function ThemeToggle() {
  // Server snapshot is false; the pre-paint script has already set the real
  // class by the time this hydrates, so there is no visible flash.
  const isDark = useSyncExternalStore(
    subscribeToThemeClass,
    isDarkSnapshot,
    () => false
  )

  const toggle = () => {
    const next = !isDarkSnapshot()
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {
      // Storage unavailable (private mode); theme still applies for session.
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export { ThemeToggle }
