export function formatTextForSlug(text: string) {
  return text.toLowerCase().replace(/\s/g, "-");
}
