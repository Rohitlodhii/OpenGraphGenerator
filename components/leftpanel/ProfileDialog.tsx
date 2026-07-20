"use client";

import React, { useState, useEffect } from "react";
import { UserIcon, SettingsIcon, FolderIcon, SunIcon, MoonIcon, PlugIcon, CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  clearImgbbKey,
  getImgbbKey,
  setImgbbKey as saveImgbbKey,
} from "@/lib/imgbb";

type ProfileUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: boolean | null;
};

type TabId = "profile" | "settings" | "connectors" | "projects";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "settings", label: "Settings", icon: SettingsIcon },
  { id: "connectors", label: "Connectors", icon: PlugIcon },
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

function ConnectorsPanel() {
  const [keyInput, setKeyInput] = useState("");
  const [connected, setConnected] = useState(false);

  // Read the stored key only on the client to avoid hydration mismatch.
  useEffect(() => {
    setConnected(!!getImgbbKey());
  }, []);

  const handleSave = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    saveImgbbKey(trimmed);
    setConnected(true);
    setKeyInput("");
  };

  const handleRemove = () => {
    clearImgbbKey();
    setConnected(false);
    setKeyInput("");
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold max-sm:text-lg">Connectors</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Connect services to unlock more.
      </p>

      <div className="mt-6 rounded-lg border p-4 max-sm:mt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <PlugIcon className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">imgbb</p>
              <p className="text-xs text-muted-foreground">
                Upload exported images to the cloud.
              </p>
            </div>
          </div>
          {connected && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckIcon className="size-3" />
              Connected
            </span>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Without a key you get 5 free cloud uploads. Add your own imgbb API key
          for unlimited uploads on your account.{" "}
          <a
            href="https://api.imgbb.com/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground"
          >
            Get a key
          </a>
        </p>

        <div className="mt-3 flex gap-2 max-sm:flex-col">
          <Input
            type="password"
            autoComplete="off"
            placeholder={connected ? "Key saved — enter a new one to replace" : "imgbb API key"}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!keyInput.trim()}>
              Save
            </Button>
            {connected && (
              <Button variant="outline" onClick={handleRemove}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <ApiKeyConnectorCard
        source="illustration"
        title="Illustration API"
        description="Search illustrations in the Tools panel."
        helpUrl="https://getillustrations.com/"
      />
      <ApiKeyConnectorCard
        source="unsplash"
        title="Unsplash"
        description="Search Unsplash photos in the Tools panel."
        helpUrl="https://unsplash.com/developers"
      />
    </div>
  );
}

type ApiKeySource = "illustration" | "unsplash";

// DB-backed connector card for the Tools panel search sources. Unlike imgbb
// (localStorage), these keys are stored per-user on the server via
// /api/user/api-keys, and the free-tier remaining count comes from the same
// endpoint.
function ApiKeyConnectorCard({
  source,
  title,
  description,
  helpUrl,
}: {
  source: ApiKeySource;
  title: string;
  description: string;
  helpUrl: string;
}) {
  const [keyInput, setKeyInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/user/api-keys")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.[source]) return;
        setConnected(Boolean(data[source].connected));
        setRemaining(
          typeof data[source].remaining === "number"
            ? data[source].remaining
            : null,
        );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [source]);

  const persist = async (key: string | null) => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, key }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setConnected(Boolean(data?.connected));
        if (data?.connected) setRemaining(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    await persist(trimmed);
    setKeyInput("");
  };

  const handleRemove = async () => {
    await persist(null);
    setKeyInput("");
  };

  return (
    <div className="mt-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <PlugIcon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {connected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckIcon className="size-3" />
            Connected
          </span>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {connected
          ? "Using your own key — unlimited searches."
          : `Without a key you get 5 free searches${
              remaining !== null ? ` (${remaining} left)` : ""
            }. Add your own key for unlimited searches.`}{" "}
        <a
          href={helpUrl}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-foreground"
        >
          Get a key
        </a>
      </p>

      <div className="mt-3 flex gap-2 max-sm:flex-col">
        <Input
          type="password"
          autoComplete="off"
          placeholder={connected ? "Key saved — enter a new one to replace" : `${title} key`}
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!keyInput.trim() || saving}>
            Save
          </Button>
          {connected && (
            <Button variant="outline" onClick={handleRemove} disabled={saving}>
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
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

            {activeTab === "connectors" && <ConnectorsPanel />}

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
