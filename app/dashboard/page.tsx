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

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (!mounted || isPending || !session) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="h-screen relative w-full flex flex-col">
      <header className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          {user.image && (
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {user.name}
            </span>
            <span className="text-xs text-gray-600">{user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-2 px-3 py-1 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-md transition"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="h-full w-full flex items-center justify-center">
        <Workspace />
      </div>
    </div>
  );
}
