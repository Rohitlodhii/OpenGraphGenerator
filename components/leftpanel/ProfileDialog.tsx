"use client";

import React, { useState, useEffect } from "react";
import { UserIcon, SettingsIcon, FolderIcon, SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogPopup } from "@/components/ui/dialog";

type ProfileUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: boolean | null;
};

type TabId = "profile" | "settings" | "projects";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
  { id: "projects", label: "Projects", icon: FolderIcon },
];

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm break-all">{value}</p>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch; theme unknown until mounted.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition hover:bg-muted"
    >
      {mounted && isDark ? (
        <>
          <MoonIcon className="size-4" />
          Dark
        </>
      ) : (
        <>
          <SunIcon className="size-4" />
          Light
        </>
      )}
    </button>
  );
}

export function ProfileDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileUser;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup
        className="max-w-3xl overflow-hidden max-sm:h-[min(42rem,calc(100dvh-2rem))] max-sm:max-w-[calc(100vw-1rem)]"
        bottomStickOnMobile={false}
      >
        <div className="flex min-h-[26rem] max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
          <div className="w-[30%] shrink-0 rounded-l-2xl border-r bg-muted/40 p-3 max-sm:w-full max-sm:rounded-l-none max-sm:rounded-t-2xl max-sm:border-b max-sm:border-r-0 max-sm:p-4 max-sm:pb-3">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="size-10 shrink-0">
                {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>

            <nav className="mt-3 flex flex-col gap-1 max-sm:grid max-sm:grid-cols-3 max-sm:gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition outline-none max-sm:h-16 max-sm:flex-col max-sm:justify-center max-sm:gap-1 max-sm:px-2 max-sm:text-xs",
                      active
                        ? "bg-background font-medium text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto p-6 max-sm:p-4">
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center gap-4 max-sm:gap-3">
                  <Avatar className="size-16 shrink-0 max-sm:size-12">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name ?? ""} />
                    )}
                    <AvatarFallback className="text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <h2 className="truncate font-heading text-xl font-semibold leading-none max-sm:text-lg">
                      {user.name}
                    </h2>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 max-sm:mt-4 max-sm:gap-3">
                  <Field label="Name" value={user.name} />
                  <Field label="Email" value={user.email} />
                  <Field
                    label="Email verified"
                    value={user.emailVerified ? "Yes" : "No"}
                  />
                  <Field label="User ID" value={user.id} />
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="font-heading text-xl font-semibold max-sm:text-lg">Settings</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage your account preferences.
                </p>
                <div className="mt-6 flex flex-col gap-3 max-sm:mt-4">
                  <div className="flex items-center justify-between rounded-lg border p-4 max-sm:items-start">
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive updates about your projects.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-lg border p-4 max-sm:flex-col max-sm:items-start">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">
                        Choose your preferred appearance.
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <h2 className="font-heading text-xl font-semibold max-sm:text-lg">Projects</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your saved projects will appear here.
                </p>
                <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground max-sm:mt-4 max-sm:p-6">
                  No projects yet.
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogPopup>
    </Dialog>
  );
}
