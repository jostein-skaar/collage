export const ratios: Ratio[] = [
  { name: 'photo', width: 3, height: 2 },
  { name: 'square', width: 1, height: 1 },
  { name: 'half', width: 2, height: 1 },
  { name: 'widescreen', width: 16, height: 9 },
  { name: 'book', width: 3, height: 4 },
  { name: 'standing', width: 1, height: 2 },
  { name: 'portrait', width: 2, height: 3 },
];

export function getRatioByName(name: string): Ratio | undefined {
  return ratios.find((x) => x.name === name);
}

export type Ratio = { name: string; width: number; height: number };
