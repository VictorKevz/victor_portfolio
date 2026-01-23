import React from "react";

/**
 * Parses text content and converts it to appropriate HTML structure
 * - If content contains line breaks and bullet-like prefixes, converts to <ul><li>
 * - Otherwise renders as paragraphs with preserved line breaks
 */
export function parseSmartList(text: string | undefined | null): React.ReactNode {
  if (!text || typeof text !== "string") {
    return null;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  // Check if content looks like a list (contains bullet-like patterns or line breaks with dashes/minus)
  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  // Detect if it's a list format (starts with -, *, •, or numbered)
  const isListFormat = lines.some((line) => {
    const listPattern = /^[-*•]\s+|^\d+[.)]\s+/;
    return listPattern.test(line);
  });

  if (isListFormat) {
    // Convert to <ul><li> structure
    const items = lines
      .map((line) => {
        // Remove bullet markers and numbering
        return line.replace(/^[-*•]\s+|^\d+[.)]\s+/, "").trim();
      })
      .filter((item) => item.length > 0);

    if (items.length === 0) {
      return null;
    }

    return (
      <ul className="list-disc list-inside space-y-2 my-4">
        {items.map((item, index) => (
          <li key={index} className="text-base">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // Otherwise, render as paragraphs with preserved line breaks
  const paragraphs = lines.filter((line) => line.length > 0);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 my-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-base leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
