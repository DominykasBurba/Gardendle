import { useState } from 'react';
import './GuessInput.css';

type GuessInputProps = {
  disabled?: boolean;
  onGuess: (guess: string) => void;
};

function GuessInput({ disabled = false, onGuess }: GuessInputProps) {
  const [guess, setGuess] = useState('');

  function submitGuess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedGuess = guess.trim();

    if (!trimmedGuess) {
      return;
    }

    onGuess(trimmedGuess);
    setGuess('');
  }

  return (
    <form className="guess-form" onSubmit={submitGuess}>
      <input
        className="guess-form__input"
        disabled={disabled}
        onChange={(event) => setGuess(event.target.value)}
        placeholder="Type an item name"
        type="text"
        value={guess}
      />
      <button className="guess-form__button" disabled={disabled} type="submit">
        Guess
      </button>
    </form>
  );
}

export default GuessInput;
