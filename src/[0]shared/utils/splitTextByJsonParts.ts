export type SplitPart =
  | { type: "text"; value: string }
  | { type: "json"; value: string };

export function splitTextByJsonParts(text: string): SplitPart[] {
  const re = /```json\s*([\s\S]*?)\s*```/gi;
  const parts: SplitPart[] = [];

  let lastIndex = 0;

  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    const full = match[0] ?? "";
    const json = (match[1] ?? "").trim();

    // текст ДО блока
    const before = text.slice(lastIndex, index);
    if (before) parts.push({ type: "text", value: before });

    // сам JSON блок
    parts.push({ type: "json", value: json });

    // двигаем курсор после блока
    lastIndex = index + full.length;
  }

  // хвост текста ПОСЛЕ последнего блока
  const after = text.slice(lastIndex);
  if (after) parts.push({ type: "text", value: after });

  // если вообще не было блоков — вернём весь текст как один кусок
  return parts.length ? parts : [{ type: "text", value: text }];
}
