"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  return `${m}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * Self-contained exam timer. It owns its own tick so the quiz above it
 * doesn't re-render every second, and it reads the clock instead of
 * counting ticks, so it can't drift.
 */
export function Countdown({ endsAt, onExpire }: { endsAt: number; onExpire: () => void }) {
  const remaining = () => Math.max(0, Math.round((endsAt - Date.now()) / 1000));
  const [seconds, setSeconds] = useState(remaining);
  const expire = useRef(onExpire);
  useEffect(() => {
    expire.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
      setSeconds(left);
      if (left === 0) {
        window.clearInterval(id);
        expire.current();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return (
    <p
      className={cn("tabular inline-flex items-center gap-1.5", seconds < 300 && "font-semibold text-warning")}
      aria-live={seconds < 60 ? "polite" : "off"}
    >
      <Clock className="size-4" aria-hidden />
      {formatTime(seconds)} left
    </p>
  );
}
