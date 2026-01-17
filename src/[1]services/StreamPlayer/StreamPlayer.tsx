import { useMemo } from "react";
import { useStreamPlayer } from "./hooks/useStreamPlayer";
import type { StreamEvent } from "shared/types/global";
import { StreamingOutput } from "services/StreamingOutput/StreamingOutput";
import { useUpdateEffect } from "shared/hooks/useUpdateEffect";

type Props = {
  events: StreamEvent[];
};

export function StreamPlayer({ events }: Props) {
  const {
    status,
    text,
    error,
    canPlay,
    canStop,
    speed,
    setSpeed,
    play,
    stop,
    reset,
  } = useStreamPlayer(events);

  const info = useMemo(() => {
    if (events.length === 0) return "Событий нет";
    return `Загружено событий: ${events.length}`;
  }, [events.length]);

  // Сброс при загрузке нового файла
  useUpdateEffect(() => {
    reset();
  }, [events]);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={play} disabled={!canPlay}>
          Старт
        </button>
        <button onClick={stop} disabled={!canStop}>
          Стоп
        </button>
        <button onClick={reset} disabled={status === "streaming"}>
          Сбросить
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>Скорость:</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.25}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <b>{speed.toFixed(2)}x</b>
          </label>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <b>Статус:</b> {status}
        </div>
      </div>

      <div style={{ marginTop: 8, color: "#666" }}>{info}</div>

      {status === "error" && error && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: "1px solid #f0b4b4",
            background: "#fff5f5",
          }}
        >
          <b>Ошибка:</b> {error}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Стрим</h3>
        <StreamingOutput text={text} />
      </div>
    </div>
  );
}
