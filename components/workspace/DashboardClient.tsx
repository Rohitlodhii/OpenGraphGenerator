"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Workspace from "@/components/workspace/workspace";
import { loadLocalProject, loadDbProject } from "@/lib/projects";
import { useCurrentProjectStore } from "@/store/currentprojectstore";
import { authClient } from "@/lib/auth-client";

type Props = { projectId?: string };

export default function DashboardClient({ projectId }: Props) {
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
      return;
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
  }, [mounted, isPending, projectId, session?.user, setCurrent, clearCurrent, router]);

  if (!mounted || isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
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
