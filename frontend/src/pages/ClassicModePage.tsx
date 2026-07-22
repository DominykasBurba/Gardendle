import { useEffect, useState } from 'react';
import { getTodayPuzzle, type DailyPuzzle } from '../api/puzzles';
import GuessInput from '../components/GuessInput';
import PuzzleGrid from '../components/PuzzleGrid';
import Leaderboard from '../components/Leaderboard';
import './ClassicModePage.css';

type GuessResult = {
    name: string;
    isCorrect: boolean;
};

function ClassicModePage() {
    const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
    const [error, setError] = useState('');
    const [guesses, setGuesses] = useState<GuessResult[]>([]);
    const [hasWon, setHasWon] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [loadedPuzzleId, setLoadedPuzzleId] = useState<number | null>(null);

    useEffect(() => {
        getTodayPuzzle()
            .then(setPuzzle)
            .catch((requestError: Error) => setError(requestError.message));
    }, []);

    useEffect(() => {
        if (!puzzle) {
            return;
        }

        const puzzleStorageKey = `${puzzle.id}:${puzzle.date.slice(0, 10)}`;
        const savedGuesses = localStorage.getItem(`photo-grid-guesses:${puzzleStorageKey}`);
        const savedWin = localStorage.getItem(`photo-grid-won:${puzzleStorageKey}`);

        setHasWon(savedWin === 'true');

        if (!savedGuesses) {
            setGuesses([]);
            setLoadedPuzzleId(puzzle.id);
            return;
        }

        const storedGuesses = JSON.parse(savedGuesses) as Array<GuessResult | string>;
        const migratedGuesses = storedGuesses.map((guess, index) =>
            typeof guess === 'string'
                ? {
                    name: guess,
                    isCorrect: savedWin === 'true' && index === storedGuesses.length - 1,
                }
                : guess,
        );

        setGuesses(migratedGuesses);
        setLoadedPuzzleId(puzzle.id);
    }, [puzzle]);

    useEffect(() => {
        if (!puzzle || loadedPuzzleId !== puzzle.id) {
            return;
        }

        const puzzleStorageKey = `${puzzle.id}:${puzzle.date.slice(0, 10)}`;
        localStorage.setItem(`photo-grid-guesses:${puzzleStorageKey}`, JSON.stringify(guesses));
    }, [guesses, loadedPuzzleId, puzzle]);

    useEffect(() => {
        if (!puzzle || loadedPuzzleId !== puzzle.id) {
            return;
        }

        const puzzleStorageKey = `${puzzle.id}:${puzzle.date.slice(0, 10)}`;
        localStorage.setItem(`photo-grid-won:${puzzleStorageKey}`, String(hasWon));
    }, [hasWon, loadedPuzzleId, puzzle]);

    useEffect(() => {
        if (!showCelebration) {
            return;
        }

        const timeoutId = window.setTimeout(() => setShowCelebration(false), 4000);

        return () => window.clearTimeout(timeoutId);
    }, [showCelebration]);

    if (error) {
        return <div className="classic-page__error">{error}</div>;
    }

    if (!puzzle) {
        return <div className="classic-page__loading">Loading today's puzzle...</div>;
    }

    const maxTiles = puzzle.gridSize === 'GRID_3X3' ? 9 : puzzle.gridSize === 'GRID_4X4' ? 16 : 25;
    const revealedTiles = Math.min(guesses.length, maxTiles);

    function handleGuess(guess: string, isCorrect: boolean) {

        setGuesses((currentGuesses) => [...currentGuesses, { name: guess, isCorrect }]);

        if (isCorrect) {
            setHasWon(true);
            setShowCelebration(true);
        }
    }

    return (
        <div className="classic-page">
            {showCelebration ? (
                <div aria-hidden="true" className="classic-page__confetti">
                    {Array.from({ length: 36 }, (_, index) => (
                        <span
                            key={index}
                            style={{
                                animationDelay: `${(index % 9) * 0.08}s`,
                                backgroundColor: ['#facc15', '#22c55e', '#ef4444', '#3b82f6', '#f472b6'][index % 5],
                                left: `${(index * 29) % 100}%`,
                            }}
                        />
                    ))}
                </div>
            ) : null}

            <header className="classic-page__header">
                <a className="classic-page__logo-link" href="/" aria-label="Go to homepage">
                    <img className="classic-page__logo" src="/Gardendle_Logo.png" alt="GardenDLE" />
                </a>
            </header>

            <main className="classic-page__main">
                <section className="classic-page__game">
                    <PuzzleGrid
                        gridSize={puzzle.gridSize}
                        imageLabel="Daily puzzle item"
                        imageUrl={puzzle.imageUrl}
                        revealSeed={puzzle.revealSeed}
                        revealedTiles={revealedTiles}
                    />

                    <GuessInput
                        disabled={hasWon}
                        guessedItems={guesses.map((guess) => guess.name)}
                        onGuess={handleGuess}
                    />

                    <div className="classic-page__history">
                        {guesses.length > 0 ? (
                            <div className="classic-page__history-list">
                                {guesses.map((guess, index) => ({ guess, index })).reverse().map(({ guess, index }) => (
                                    <div
                                        className={`classic-page__guess-card classic-page__guess-card--${guess.isCorrect ? 'correct' : 'wrong'}`}
                                        key={`${guess.name}-${index}`}
                                    >
                                        <span>{guess.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>
                <Leaderboard />
            </main>
        </div>
    );
}

export default ClassicModePage;
