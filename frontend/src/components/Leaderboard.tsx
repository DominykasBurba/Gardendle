import { useMemo } from 'react';
import type { LeaderboardEntry } from '../api/puzzles';
import './Leaderboard.css';

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
};

function formatTime(timeSeconds: number) {
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = timeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Leaderboard({ entries, isLoading = false }: LeaderboardProps) {

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
        if(a.guesses !== b.guesses) {
            return a.guesses - b.guesses
        }
        
        return a.timeSeconds - b.timeSeconds
    })
  }, [entries]);


  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      <div className="leaderboard__content">
        <h2 className="leaderboard__title" id="leaderboard-title">
          Leaderboard for today&apos;s puzzle
        </h2>

        <table className="leaderboard__table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Guesses</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>Loading scores...</td>
              </tr>
            ) : null}
            {!isLoading && sortedEntries.length === 0 ? (
              <tr>
                <td colSpan={4}>No completed scores yet. Be the first!</td>
              </tr>
            ) : null}
            {!isLoading ? sortedEntries.slice(0, 10).map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.guesses}</td>
                <td>{formatTime(entry.timeSeconds)}</td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Leaderboard;
