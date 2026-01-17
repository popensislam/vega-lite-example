import { useState } from "react";
import { VegaPreview } from "services/VegaPreview/VegaPreview";
import { useVegaSpec } from "shared/hooks/useVegaSpec";
import type { SplitPart } from "shared/utils/splitTextByJsonParts";

export const PartView = ({ part }: { part: SplitPart }) => {
  const [copied, setCopied] = useState(false);

  const specOptions = useVegaSpec(part.value);

  const copy = async () => {
    if (part.type !== "json") return;
    try {
      await navigator.clipboard.writeText(part.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (e) {
      console.error(e);
    }
  };

  if (part.type === "text") {
    return (
      <pre
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}
      >
        {part.value}
      </pre>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ margin: "12px 0" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <b>JSON</b>
          <button onClick={copy}>Copy</button>
          {copied && <span style={{ color: "#0a7a2f" }}>Copied!</span>}
        </div>

        <pre
          style={{
            margin: 0,
            whiteSpace: "pre",
            overflow: "auto",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#f6f8fa",
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        >
          {part.value}
        </pre>
      </div>

      <VegaPreview options={specOptions} />
    </div>
  );
};
