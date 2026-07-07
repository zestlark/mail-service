export const extractVariables = (template?: string): string[] => {
  if (!template) {
    return [];
  }
  const regex = /\{\{\s*(\w+)\s*\}\}/g;
  const matches = template.match(regex);
  return matches ? matches.map((match) => match.slice(2, -2).trim()) : [];
};
