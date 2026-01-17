import { useState } from "react";
import type { StreamEvent } from "shared/types/global";

export const LoadDump = ({
  onLoadEvents,
}: {
  onLoadEvents: (events: StreamEvent[]) => void;
}) => {
  const [error, setError] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();

      const parsedEvents: StreamEvent[] = text
        .split("\n")
        .filter(Boolean)
        .map((line, index) => {
          try {
            return JSON.parse(line.trim()) as StreamEvent;
          } catch {
            throw new Error(`Invalid JSON at line ${index + 1}`);
          }
        });

      setError(false);

      onLoadEvents(parsedEvents);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div>
      <label>
        Load dump: <input type="file" accept=".jsonl" onChange={handleFile} />
      </label>

      {error && <p>Ошибка в JSONL</p>}
    </div>
  );
};
