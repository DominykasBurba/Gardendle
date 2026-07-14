import { useEffect, useState } from 'react';
import { getTodayPuzzle, type DailyPuzzle } from '../api/puzzles';
import GuessInput from '../components/GuessInput';
import PuzzleGrid from '../components/PuzzleGrid';
import './ClassicModePage.css';

function ClassicModePage() {
    const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
    const [error, setError] = useState('');
    const [guesses, setGuesses] = useState<string[]>([]);

    useEffect(() => {
        getTodayPuzzle()
            .then(setPuzzle)
            .catch((requestError: Error) => setError(requestError.message));
    }, []);

    if (error) {
        return <div className="classic-page__error">{error}</div>;
    }

    if (!puzzle) {
        return <div className="classic-page__error">Loading today's puzzle...</div>;
    }

    const maxTiles = puzzle.gridSize === 'GRID_3X3' ? 9 : puzzle.gridSize === 'GRID_4X4' ? 16 : 25;
    const revealedTiles = Math.min(guesses.length, maxTiles);

    function handleGuess(guess: string) {
        if (!puzzle) {
            return;
        }

        setGuesses((currentGuesses) => [...currentGuesses, guess]);
    }

    return (
        <div className="classic-page">
            <header className="classic-page__header">
                <a className="classic-page__logo-link" href="/" aria-label="Go to homepage">
                    <img className="classic-page__logo" src="/GardenDLE_Logo.png" alt="GardenDLE" />
                </a>
            </header>

            <main className="classic-page__main">
                <section className="classic-page__game">
                    <h1 className="classic-page__title">Photo Grid</h1>
                    <p className="classic-page__meta">
                        {puzzle.difficulty} puzzle - {new Date(puzzle.date).toLocaleDateString()}
                    </p>

                    <PuzzleGrid
                        gridSize={puzzle.gridSize}
                        imageLabel="Daily puzzle item"
                        imageUrl={puzzle.imageUrl}
                        revealSeed={puzzle.revealSeed}
                        revealedTiles={revealedTiles}
                    />

                    <GuessInput onGuess={handleGuess} />

                    <div className="classic-page__history">
                        <p className="classic-page__history-title">Guesses</p>
                        {guesses.length > 0 ? (
                            <ol className="classic-page__history-list">
                                {guesses
                                    .slice(-5)
                                    .reverse()
                                    .map((guess, index) => (
                                        <li key={`${guess}-${guesses.length - index}`}>
                                            {guess}
                                        </li>
                                    ))}
                            </ol>
                        ) : (
                            <p className="classic-page__history-empty">No guesses yet.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ClassicModePage;
