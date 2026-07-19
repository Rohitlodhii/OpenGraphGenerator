"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Workspace from "@/components/workspace/workspace";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isPending && !session) {
      router.push("/");
    }
  }, [mounted, isPending, session, router]);

  if (!mounted || isPending || !session) {
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
