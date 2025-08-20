// app/hooks/useIdleLogout.ts
"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export function useIdleLogout(timeoutMs: number) {
  const { status } = useSession();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const bc = new BroadcastChannel("idle-auth");
    bcRef.current = bc;
    bc.onmessage = (e) => {
      if (e.data === "logout") signOut({ callbackUrl: "/login" });
    };

    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        bc.postMessage("logout"); // desloguea en todas las pestañas
        signOut({ callbackUrl: "/login" });
      }, timeoutMs);
    };

    const onActivity = () => reset();
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "visibilitychange",
    ];
    events.forEach((ev) =>
      window.addEventListener(ev, onActivity, { passive: true })
    );

    reset(); // arranca
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onActivity));
      if (timer.current) clearTimeout(timer.current);
      bc.close();
    };
  }, [status, timeoutMs]);
}
