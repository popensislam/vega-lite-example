import { useMemo } from "react";
import { VegaEmbed } from "react-vega";
import type { VegaSpecResult } from "shared/hooks/useVegaSpec";

const DEFAULT_DATA = [
  { region: "Almaty", revenue: 120 },
  { region: "Astana", revenue: 90 },
  { region: "Shymkent", revenue: 70 },
];

type Props = {
  options: VegaSpecResult;
};

export function VegaPreview({ options }: Props) {
  const { isValid, spec, error } = options;
  const vegaLiteSpec = useMemo(() => {
    if (!spec || !isValid) return null;

    // Добавляем data.values, но если в spec уже есть data — перезапишем
    // (по тестовому данные можно хардкодить)
    return {
      ...spec,
      data: { values: DEFAULT_DATA },
    };
  }, [spec, isValid]);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Vega chart spec</h3>

      {!spec && <div style={{ color: "#666" }}>Spec не найден</div>}

      {spec && !isValid && (
        <div style={{ color: "crimson" }}>
          Spec найден, но невалидный: {error ?? "unknown validation error"}
        </div>
      )}

      {vegaLiteSpec && (
        <div style={{ marginTop: 8 }}>
          <VegaEmbed
            spec={vegaLiteSpec}
            options={{ mode: "vega-lite", actions: false }}
          />
        </div>
      )}
    </div>
  );
}
