const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  apiKey: /api[_-]?key[_:=\s]+['"]?[a-zA-Z0-9_-]{20,}['"]?/gi,
};

export function maskPii(text: string): { masked: string; redactedCount: number } {
  let redactedCount = 0;
  let masked = text;

  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    const matches = masked.match(pattern) || [];
    redactedCount += matches.length;
    masked = masked.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
  });

  return { masked, redactedCount };
}
