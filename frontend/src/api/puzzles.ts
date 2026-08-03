export type GridSize = 'GRID_3X3' | 'GRID_4X4' | 'GRID_5X5';

export type DailyPuzzle = {
  id: number;
  date: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  revealSeed: string;
  imageUrl: string | null;
  gridSize: GridSize;
};

export type GuessResponse = {
  isCorrect: boolean;
  attemptToken: string;
};

export type LeaderboardEntry = {
  id: number;
  name: string;
  guesses: number;
  timeSeconds: number;
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

export async function submitGuess(
  itemId: number,
  attemptToken?: string | null,
): Promise<GuessResponse> {

  const response = await fetch(`${API_BASE_URL}/puzzles/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ itemId, attemptToken: attemptToken ?? undefined }),
  });

  if(!response.ok) {
    throw new Error(`Failed to load puzzle: ${response.status}`);
  }

  return (await response.json()) as GuessResponse;
}

export async function getTodayLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${API_BASE_URL}/puzzles/leaderboard/today`);

  if (!response.ok) {
    throw new Error(`Failed to load leaderboard: ${response.status}`);
  }

  return (await response.json()) as LeaderboardEntry[];
}

export async function savePuzzleResult(
  attemptToken: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/puzzles/result`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attemptToken }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save score: ${response.status}`);
  }
}
