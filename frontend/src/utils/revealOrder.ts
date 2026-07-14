import type { GridSize } from '../api/puzzles';

export function gridSizeToNumber(gridSize: GridSize) {
  if (gridSize === 'GRID_3X3') {
    return 3;
  }

  if (gridSize === 'GRID_4X4') {
    return 4;
  }

  return 5;
}

function seededRandom(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += hash << 13;
    hash ^= hash >>> 7;
    hash += hash << 3;
    hash ^= hash >>> 17;
    hash += hash << 5;

    return (hash >>> 0) / 4294967296;
  };
}

export function getRevealOrder(tileCount: number, seed: string) {
  const random = seededRandom(seed);
  const order = Array.from({ length: tileCount }, (_, index) => index);

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }

  return order;
}
