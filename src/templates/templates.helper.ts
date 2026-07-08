export const extractVariables = (template?: string): string[] => {
  if (!template) {
    return [];
  }
  const regex = /\{\{\s*(\w+)\s*\}\}/g;
  const matches = template.match(regex);
  if (matches) {
    const rawVars = matches.map((match) => match.slice(2, -2).trim());
    return Array.from(new Set(rawVars));
  }
  return [];
};
