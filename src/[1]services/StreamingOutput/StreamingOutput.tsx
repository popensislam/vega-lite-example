import { useMemo } from "react";
import { splitTextByJsonParts } from "shared/utils/splitTextByJsonParts";
import { PartView } from "./ui/PartView";

export function StreamingOutput({ text }: { text: string }) {
  const parts = useMemo(() => splitTextByJsonParts(text), [text]);

  return (
    <div>
      {parts.map((part, index) => (
        <PartView key={index} part={part} />
      ))}
    </div>
  );
}
