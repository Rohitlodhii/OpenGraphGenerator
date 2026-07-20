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

  // Avoid hydration mismatch — theme unknown until mounted
  useEffect(() => setMounted(true), []);

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
      <DialogPopup className="max-w-3xl" bottomStickOnMobile={false}>
        <div className="flex min-h-[26rem]">
          {/* Left pane — tab navigation (30%) */}
          <div className="w-[30%] shrink-0 border-r bg-muted/40 p-3 rounded-l-2xl">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="size-10">
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

            <nav className="mt-3 flex flex-col gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition outline-none",
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

          {/* Right pane — content */}
          <div className="min-w-0 flex-1 overflow-y-auto p-6">
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name ?? ""} />
                    )}
                    <AvatarFallback className="text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h2 className="font-heading text-xl font-semibold leading-none">
                      {user.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
                <h2 className="font-heading text-xl font-semibold">Settings</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage your account preferences.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive updates about your projects.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
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
                <h2 className="font-heading text-xl font-semibold">Projects</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your saved projects will appear here.
                </p>
                <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
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
