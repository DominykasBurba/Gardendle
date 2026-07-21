import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllItemNames, type ItemOption } from '../api/items';
import { submitGuess } from '../api/puzzles';

import './GuessInput.css';

type GuessInputProps = {
  disabled?: boolean;
  guessedItems?: string[];
  onGuess: (guess: string, isCorrect: boolean) => void;
};

function GuessInput({ disabled = false, guessedItems = [], onGuess }: GuessInputProps) {
  const [guess, setGuess] = useState('');
  const [itemNames, setItemNames] = useState<ItemOption[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLocked = useRef(false);

  useEffect(() => {
    getAllItemNames()
      .then(setItemNames)
      .catch(() => setItemNames([]));
  }, []);

  const suggestions = useMemo(() => {
    const normalizedGuess = guess.trim().toLowerCase();
    const guessedItemSet = new Set(
      guessedItems.map((itemName) => itemName.trim().toLowerCase()),
    );

    if (!normalizedGuess) {
      return [];
    }

    return itemNames
      .filter((item) => {
        const normalizedItemName = item.itemName.toLowerCase();

        return (
          normalizedItemName.includes(normalizedGuess) &&
          !guessedItemSet.has(normalizedItemName)
        );
      })
      .slice(0, 8);
  }, [guess, guessedItems, itemNames]);

  const shouldShowSuggestions = isFocused && suggestions.length > 0 && !disabled && !isSubmitting;

  async function submitItem(item: ItemOption) {
    if (submissionLocked.current) {
      return;
    }

    submissionLocked.current = true;
    setIsSubmitting(true);

    try {
      const isCorrect = await submitGuess(item.itemId);

      onGuess(item.itemName, isCorrect);
      setGuess('');
    } catch (error) {
      console.error("Failed to submit", error)
    } finally {
      submissionLocked.current = false;
      setIsSubmitting(false);
    }

  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const firstSuggestion = suggestions[0];

    if (!firstSuggestion) {
      return;
    }

    void submitItem(firstSuggestion)
  }

  function submitSuggestion(item: ItemOption) {
    void submitItem(item)
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <div className="guess-form__field">
        <input
          className="guess-form__input"
          disabled={disabled}
          onBlur={() => setIsFocused(false)}
          onChange={(event) => setGuess(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Type an item name"
          readOnly={isSubmitting}
          type="text"
          value={guess}
        />

        {shouldShowSuggestions ? (
          <div className="guess-form__suggestions">
            {suggestions.map((item) => (
              <button
                className="guess-form__suggestion"
                key={item.itemId}
                onMouseDown={(event) => {
                  event.preventDefault();
                  submitSuggestion(item);
                }}
                type="button"
              >
                {item.itemName}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button className="guess-form__button" disabled={disabled || isSubmitting || suggestions.length === 0} type="submit">
        {isSubmitting ? 'Checking...' : 'Guess'}
      </button>
    </form>
  );
}

export default GuessInput;
