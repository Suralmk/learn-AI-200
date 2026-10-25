/** "1"–"9" or "a"–"i" → option index, or null when the key isn't an option. */
export function keyToOption(key: string, optionCount: number): number | null {
  let index: number | null = null;
  if (/^[1-9]$/.test(key)) index = Number(key) - 1;
  else if (/^[a-i]$/i.test(key)) index = key.toLowerCase().charCodeAt(0) - 97;
  return index !== null && index < optionCount ? index : null;
}

export function toggleSelection(current: number[], index: number, multi: boolean): number[] {
  if (!multi) return [index];
  return current.includes(index)
    ? current.filter((i) => i !== index)
    : [...current, index].sort((a, b) => a - b);
}

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}
