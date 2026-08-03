import { useEffect, useState } from 'react';
import {
    getTodayLeaderboard,
    getTodayPuzzle,
    savePuzzleResult,
    type DailyPuzzle,
    type LeaderboardEntry,
} from '../api/puzzles';
import { ACCESS_TOKEN_STORAGE_KEY, getCurrentUser } from '../api/auth';
import GuessInput from '../components/GuessInput';
import PuzzleGrid from '../components/PuzzleGrid';
import Leaderboard from '../components/Leaderboard';
import SignInModal from '../components/SignInModal';
import CompletionModal from '../components/CompletionModal';
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
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [showSignIn, setShowSignIn] = useState(false)
    const [attemptToken, setAttemptToken] = useState<string | null>(null);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
    const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
    const [scoreNeedsAuthentication, setScoreNeedsAuthentication] = useState(false);
    const [scoreMessage, setScoreMessage] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [shouldShareAfterSave, setShouldShareAfterSave] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

        if (!accessToken) {
            setIsLoggedIn(false);
            return;
        }

        getCurrentUser(accessToken)
            .then(() => setIsLoggedIn(true))
            .catch(() => {
                localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
                setIsLoggedIn(false);
            });
    }, []);

    useEffect(() => {
        getTodayPuzzle()
            .then(setPuzzle)
            .catch((requestError: Error) => setError(requestError.message));
    }, []);

    useEffect(() => {
        getTodayLeaderboard()
            .then(setLeaderboardEntries)
            .catch((requestError) => console.error('Failed to load leaderboard', requestError))
            .finally(() => setIsLeaderboardLoading(false));
    }, []);

    useEffect(() => {
        if (!puzzle) {
            return;
        }

        const puzzleStorageKey = `${puzzle.id}:${puzzle.date.slice(0, 10)}`;
        const savedGuesses = localStorage.getItem(`photo-grid-guesses:${puzzleStorageKey}`);
        const savedWin = localStorage.getItem(`photo-grid-won:${puzzleStorageKey}`);
        const savedAttemptToken = localStorage.getItem(`photo-grid-attempt:${puzzleStorageKey}`);

        setHasWon(savedWin === 'true');
        setAttemptToken(savedAttemptToken);

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

    useEffect(() => {
        if (!hasWon || !attemptToken) {
            return;
        }

        if (isLoggedIn === false) {
            setShouldShareAfterSave(true);
            setScoreNeedsAuthentication(true);
            setShowSignIn(true);
            return;
        }

        if (isLoggedIn !== true) {
            return;
        }

        const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

        if (!accessToken) {
            setIsLoggedIn(false);
            return;
        }

        savePuzzleResult(attemptToken, accessToken)
            .then(() => getTodayLeaderboard())
            .then((entries) => {
                setLeaderboardEntries(entries);
                setScoreNeedsAuthentication(false);
                setScoreMessage('Your score is saved!');
                if (shouldShareAfterSave) {
                    setShowShareModal(true);
                    setShouldShareAfterSave(false);
                }
            })
            .catch((requestError) => {
                console.error('Failed to save score', requestError);
            });
    }, [attemptToken, hasWon, isLoggedIn]);

    if (error) {
        return <div className="classic-page__error">{error}</div>;
    }

    if (!puzzle) {
        return <div className="classic-page__loading">Loading today's puzzle...</div>;
    }

    const maxTiles = puzzle.gridSize === 'GRID_3X3' ? 9 : puzzle.gridSize === 'GRID_4X4' ? 16 : 25;
    const revealedTiles = Math.min(guesses.length, maxTiles);

    function handleGuess(guess: string, isCorrect: boolean, nextAttemptToken: string) {
        if (!puzzle) {
            return;
        }

        const puzzleStorageKey = `${puzzle.id}:${puzzle.date.slice(0, 10)}`;
        localStorage.setItem(`photo-grid-attempt:${puzzleStorageKey}`, nextAttemptToken);
        setAttemptToken(nextAttemptToken);

        setGuesses((currentGuesses) => [...currentGuesses, { name: guess, isCorrect }]);

        if (isCorrect) {
            setShouldShareAfterSave(true);
            setHasWon(true);
            setShowCelebration(true);
        }
    }

    return (
        <div className="classic-page">
            {isLoggedIn === false ? (
                <button className="auth-button" type="button" onClick={() => setShowSignIn(true)}>
                    Log in
                </button>
            ) : (<button
                    className="auth-button"
                    type="button"
                    onClick={() => {
                        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
                        setIsLoggedIn(false);
                    }}
                >
                    Log out
                </button>
            )}

            {showSignIn ? (
                <SignInModal
                    message={scoreNeedsAuthentication
                        ? 'You solved today’s puzzle! Log in or register to save your score.'
                        : undefined}
                    onAuthenticated={() => setIsLoggedIn(true)}
                    onClose={() => setShowSignIn(false)}
                />
            ) : null}

            {showShareModal ? (
                <CompletionModal onClose={() => setShowShareModal(false)} />
            ) : null}

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
                    <img className="classic-page__logo" src="/GardenDLE_Logo.png" alt="GardenDLE" />
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
                        attemptToken={attemptToken}
                        disabled={hasWon}
                        guessedItems={guesses.map((guess) => guess.name)}
                        onGuess={handleGuess}
                    />

                    {scoreMessage ? (
                        <p className="classic-page__score-message">{scoreMessage}</p>
                    ) : null}

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
                <Leaderboard
                    entries={leaderboardEntries}
                    isLoading={isLeaderboardLoading}
                />
            </main>
        </div>
    );
}

export default ClassicModePage;
