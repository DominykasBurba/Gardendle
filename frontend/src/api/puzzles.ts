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

export type DailyPuzzle = {
  id: number;
  date: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  revealSeed: string;
  imageUrl: string | null;
  gridSize: GridSize;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export async function getTodayPuzzle() {
  const response = await fetch(`${API_BASE_URL}/puzzles/today`);

  if (!response.ok) {
    throw new Error(`Failed to load puzzle: ${response.status}`);
  }

  const puzzle = (await response.json()) as DailyPuzzle | null;

  if (!puzzle) {
    throw new Error('No daily puzzle is seeded for today.');
  }

  return puzzle;
}
