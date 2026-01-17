/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";

export type VegaSpecResult = {
  spec: any | null;
  isValid: boolean;
  error: string | null;
  source: "parse" | "inline_parse" | null;
};

function validateSpec(spec: any): { ok: boolean; error: string | null } {
  if (!spec || typeof spec !== "object") {
    return { ok: false, error: "Спецификация не является объектом" };
  }

  // Для построения корректного графика минимально необходимы mark и encoding
  const hasMark = "mark" in spec;
  const hasEncoding =
    "encoding" in spec && spec.encoding && typeof spec.encoding === "object";

  if (!hasMark) {
    return { ok: false, error: 'Отсутствует поле "mark"' };
  }

  if (!hasEncoding) {
    return { ok: false, error: 'Отсутствует или некорректно поле "encoding"' };
  }

  return { ok: true, error: null };
}

export const useVegaSpec = (text: string): VegaSpecResult => {
  return useMemo(() => {
    if (!text.trim()) {
      return { spec: null, isValid: false, error: null, source: null };
    }

    try {
      const parsed = JSON.parse(text);
      const v = validateSpec(parsed);
      return {
        spec: v.ok ? parsed : null,
        isValid: v.ok,
        error: v.ok ? null : v.error,
        source: "parse",
      };
    } catch {
      return {
        spec: null,
        isValid: false,
        error: "Не удалось распарсить JSON",
        source: "parse",
      };
    }
  }, [text]);
};
