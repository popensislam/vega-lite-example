import { useCallback, useMemo, useRef, useState } from "react";
import type { StreamEvent } from "shared/types/global";
import { randomInt } from "shared/utils/randomInt";
import { sleep } from "shared/utils/sleep";

export type StreamStatus = "idle" | "streaming" | "done" | "error";

type Options = {
  minDelayMs?: number;
  maxDelayMs?: number;
  onTextChange?: (text: string) => void;
  onStatusChange?: (status: StreamStatus) => void;
};

export function useStreamPlayer(events: StreamEvent[], options?: Options) {
  const minDelayMs = options?.minDelayMs ?? 50;
  const maxDelayMs = options?.maxDelayMs ?? 150;

  const [status, setStatus] = useState<StreamStatus>("idle");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // скорость: 1 = нормально, 2 = быстрее, 0.5 = медленнее
  const [speed, setSpeed] = useState(1);

  // чтобы менять скорость во время проигрывания без перезапуска play()
  const speedRef = useRef(speed);
  // eslint-disable-next-line react-hooks/refs
  speedRef.current = speed;

  const isPlayingRef = useRef(false);
  const runIdRef = useRef(0);

  const setStatusSafe = useCallback(
    (next: StreamStatus) => {
      setStatus(next);
      options?.onStatusChange?.(next);
    },
    [options],
  );

  const appendText = useCallback(
    (delta: string) => {
      setText((prev) => {
        const next = prev + delta;
        options?.onTextChange?.(next);
        return next;
      });
    },
    [options],
  );

  const reset = useCallback(() => {
    setText("");
    options?.onTextChange?.("");
    setError(null);
    setStatusSafe("idle");
  }, [options, setStatusSafe]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setStatusSafe("idle");
  }, [setStatusSafe]);

  const play = useCallback(async () => {
    if (events.length === 0) return;
    if (status === "streaming") return;

    runIdRef.current += 1;
    const runId = runIdRef.current;

    isPlayingRef.current = true;
    setError(null);
    setText("");
    options?.onTextChange?.("");
    setStatusSafe("streaming");

    for (let i = 0; i < events.length; i++) {
      if (!isPlayingRef.current) return;
      if (runIdRef.current !== runId) return;

      const baseDelay = randomInt(minDelayMs, maxDelayMs);

      const sp = speedRef.current || 1;
      const delay = Math.max(0, Math.round(baseDelay / sp));

      await sleep(delay);

      if (!isPlayingRef.current) return;
      if (runIdRef.current !== runId) return;

      const ev = events[i];

      if (ev.event === "token") {
        appendText(ev.data?.delta ?? "");
        continue;
      }

      if (ev.event === "error") {
        setError(ev.data?.message ?? "Unknown error");
        setStatusSafe("error");
        isPlayingRef.current = false;
        return;
      }

      if (ev.event === "done") {
        setStatusSafe("done");
        isPlayingRef.current = false;
        return;
      }
    }

    if (isPlayingRef.current) {
      setStatusSafe("done");
      isPlayingRef.current = false;
    }
  }, [
    events,
    status,
    appendText,
    minDelayMs,
    maxDelayMs,
    options,
    setStatusSafe,
  ]);

  const canPlay = useMemo(
    () => events.length > 0 && status !== "streaming",
    [events.length, status],
  );
  const canStop = useMemo(() => status === "streaming", [status]);

  return {
    status,
    text,
    error,
    canPlay,
    canStop,
    play,
    stop,
    reset,
    speed,
    setSpeed,
  };
}
