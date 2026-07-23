"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Workspace from "@/components/workspace/workspace";
import { loadLocalProject, loadDbProject } from "@/lib/projects";
import { loadTemplate } from "@/lib/templates";
import { useCurrentProjectStore } from "@/store/currentprojectstore";
import { authClient } from "@/lib/auth-client";

type Props = { projectId?: string; templateId?: string };

export default function DashboardClient({ projectId, templateId }: Props) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const setCurrent = useCurrentProjectStore((s) => s.setCurrent);
  const clearCurrent = useCurrentProjectStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isPending) return;

    if (!projectId) {
      clearCurrent();
      if (!templateId) return;

      let cancelled = false;

      (async () => {
        const ok = await loadTemplate(templateId);
        if (cancelled) return;
        if (!ok) router.replace("/dashboard");
      })();

      return () => {
        cancelled = true;
      };
    }

    const signedIn = !!session?.user;
    let cancelled = false;

    (async () => {
      const result = signedIn
        ? await loadDbProject(projectId)
        : loadLocalProject(projectId);
      if (cancelled) return;
      if (result) {
        setCurrent(projectId, result.name, result.lastSavedAt);
      } else {
        clearCurrent();
        router.replace("/dashboard");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted, isPending, projectId, templateId, session?.user, setCurrent, clearCurrent, router]);

  if (!mounted || isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-screen relative w-full flex flex-col">
      <div className="h-full w-full flex items-center justify-center">
        <Workspace />
      </div>
    </div>
  );
}
