import { useMemo } from 'react';
import './Leaderboard.css';


export type LeaderboardEntry = {
  id: number;
  name: string;
  guesses: number;
  time: string;
};

type LeaderboardProps = {
  entries?: LeaderboardEntry[];
};

const sampleEntries: LeaderboardEntry[] = [
  { id: 1, name: 'GardenPlayer', guesses: 3, time: '00:42' },
  { id: 2, name: 'PlantMaster', guesses: 4, time: '01:08' },
  { id: 3, name: 'Seedling', guesses: 6, time: '01:35' },
  { id: 4, name: 'BerryBuddy', guesses: 7, time: '01:49' },
  { id: 5, name: 'GreenThumb', guesses: 8, time: '02:18' },
  { id: 6, name: 'SunnySprout', guesses: 8, time: '02:17' },
  { id: 7, name: 'FlowerFan', guesses: 10, time: '02:41' },
  { id: 8, name: 'CropKeeper', guesses: 11, time: '03:06' },
  { id: 9, name: 'GardenGnome', guesses: 12, time: '03:28' },
  { id: 10, name: 'LittleLeaf', guesses: 14, time: '04:02' },
];

function Leaderboard({ entries = sampleEntries }: LeaderboardProps) {

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
        if(a.guesses !== b.guesses) {
            return a.guesses - b.guesses
        }
        
        return a.time.localeCompare(b.time)
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
            {sortedEntries.slice(0, 10).map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.name}</td>
                <td>{entry.guesses}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Leaderboard;
