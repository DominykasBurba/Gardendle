import type { CSSProperties } from 'react';
import type { GridSize } from '../api/puzzles';
import { getRevealOrder, gridSizeToNumber } from '../utils/revealOrder';
import './PuzzleGrid.css';

type PuzzleGridProps = {
    imageUrl: string | null;
    imageLabel: string;
    gridSize: GridSize;
    revealSeed: string;
    revealedTiles: number;
};

function PuzzleGrid({
    imageUrl,
    imageLabel,
    gridSize,
    revealSeed,
    revealedTiles,
}: PuzzleGridProps) {
    const size = gridSizeToNumber(gridSize);
    const tileCount = size * size;
    const revealOrder = getRevealOrder(tileCount, revealSeed);
    const visibleTiles = new Set(revealOrder.slice(0, Math.min(revealedTiles, tileCount)));
    const cellBorder = '1px solid #111827';

    return (
        <div
            className="puzzle-grid"
            role="img"
            aria-label={`${imageLabel} puzzle image with ${visibleTiles.size} of ${tileCount} tiles revealed`}
            style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
            }}
        >
            {Array.from({ length: tileCount }, (_, index) => {
                const row = Math.floor(index / size);
                const column = index % size;
                const isVisible = visibleTiles.has(index);
                const hasVisibleTopNeighbor = row > 0 && visibleTiles.has(index - size);
                const hasVisibleRightNeighbor = column < size - 1 && visibleTiles.has(index + 1);
                const hasVisibleBottomNeighbor = row < size - 1 && visibleTiles.has(index + size);
                const hasVisibleLeftNeighbor = column > 0 && visibleTiles.has(index - 1);
                const tileStyle: CSSProperties = {
                    backgroundImage: isVisible && imageUrl ? `url(${imageUrl})` : undefined,
                    backgroundSize: `${size * 100}% ${size * 100}%`,
                    backgroundPosition: `${(column / (size - 1)) * 100}% ${
                        (row / (size - 1)) * 100
                    }%`,
                    borderTop: isVisible && hasVisibleTopNeighbor ? 0 : cellBorder,
                    borderRight: isVisible && hasVisibleRightNeighbor ? 0 : cellBorder,
                    borderBottom: isVisible && hasVisibleBottomNeighbor ? 0 : cellBorder,
                    borderLeft: isVisible && hasVisibleLeftNeighbor ? 0 : cellBorder,
                };

                return (
                    <div
                        className={`puzzle-grid__tile ${
                            isVisible ? 'puzzle-grid__tile--visible' : 'puzzle-grid__tile--hidden'
                        }`}
                        key={index}
                        style={tileStyle}
                    />
                );
            })}
        </div>
    );
}

export default PuzzleGrid;
