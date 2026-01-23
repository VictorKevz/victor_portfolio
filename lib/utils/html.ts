export function decodeHtmlEntities(input: string): string {
  if (!input) {
    return "";
  }

  const namedEntities: Record<string, string> = {
    amp: "&",
    quot: "\"",
    apos: "'",
    lt: "<",
    gt: ">",
    nbsp: " ",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
    hellip: "…",
    mdash: "—",
    ndash: "–",
    copy: "©",
    reg: "®",
    trade: "™",
  };

  return input.replace(/&(#\d+|#x[0-9A-Fa-f]+|[A-Za-z]+);/g, (match, entity) => {
    if (entity.startsWith("#x")) {
      const codePoint = parseInt(entity.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    if (entity.startsWith("#")) {
      const codePoint = parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return namedEntities[entity] ?? match;
  });
}
