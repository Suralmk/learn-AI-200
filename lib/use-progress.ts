"use client";

import { useSyncExternalStore } from "react";
import { emptyProgress, progressStore, type Progress } from "./progress";

const serverSnapshot = emptyProgress();

/** Reads local study progress; renders empty on the server and first paint. */
export function useProgress(): Progress {
  return useSyncExternalStore(progressStore.subscribe, progressStore.load, () => serverSnapshot);
}
