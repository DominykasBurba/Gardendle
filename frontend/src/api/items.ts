export type GridSize = 'GRID_3X3' | 'GRID_4X4' | 'GRID_5X5';

export type PuzzleItem = {
  id: number;
  slug: string;
  name: string;
  category: string;
  rarity: string;
  imageUrl: string | null;
  description: string | null;
  gridSize: GridSize;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export async function getAllItemNames() {
  const response = await fetch(`${API_BASE_URL}/items/names`);

  if (!response.ok) throw new Error(`Failed to load item names ${response.status}`);

  const names = (await response.json()) as string[];

  return names
}
