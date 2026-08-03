import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllItemNames, type ItemOption } from '../api/items';
import { submitGuess } from '../api/puzzles';

import './GuessInput.css';

const MAX_SUGGESTIONS = 8;

type GuessInputProps = {
  attemptToken?: string | null;
  disabled?: boolean;
  guessedItems?: string[];
  onGuess: (guess: string, isCorrect: boolean, attemptToken: string) => void;
};

function normalizeItemName(itemName: string) {
  return itemName.trim().toLowerCase();
}

function GuessInput({
  attemptToken,
  disabled = false,
  guessedItems = [],
  onGuess,
}: GuessInputProps) {
  const [guess, setGuess] = useState('');
  const [items, setItems] = useState<ItemOption[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submissionLocked = useRef(false);

  useEffect(() => {
    getAllItemNames()
      .then(setItems)
      .catch((error) => {
        console.error('Failed to load item names', error);
        setItems([]);
      });
  }, []);

  const suggestions = useMemo(() => {
    const normalizedGuess = normalizeItemName(guess);

    if (!normalizedGuess) {
      return [];
    }

    const guessedItemSet = new Set(guessedItems.map(normalizeItemName));

    return items
      .filter((item) => {
        const normalizedItemName = normalizeItemName(item.itemName);

        return (
          normalizedItemName.includes(normalizedGuess) &&
          !guessedItemSet.has(normalizedItemName)
        );
      })
      .slice(0, MAX_SUGGESTIONS);
  }, [guess, guessedItems, items]);

  const shouldShowSuggestions =
    isFocused &&
    suggestions.length > 0 &&
    !disabled &&
    !isSubmitting;

  async function submitItem(item: ItemOption) {
    if (submissionLocked.current) {
      return;
    }

    submissionLocked.current = true;
    setIsSubmitting(true);

    try {
      const result = await submitGuess(item.itemId, attemptToken);

      onGuess(item.itemName, result.isCorrect, result.attemptToken);
      setGuess('');
    } catch (error) {
      console.error('Failed to submit guess', error);
    } finally {
      submissionLocked.current = false;
      setIsSubmitting(false);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const firstSuggestion = suggestions[0];

    if (!firstSuggestion) {
      return;
    }

    void submitItem(firstSuggestion);
  }

  function handleSuggestionMouseDown(
    event: React.MouseEvent<HTMLButtonElement>,
    item: ItemOption,
  ) {
    event.preventDefault();
    void submitItem(item);
  }

  return (
    <form className="guess-form" onSubmit={handleFormSubmit}>
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
                onMouseDown={(event) =>
                  handleSuggestionMouseDown(event, item)
                }
                type="button"
              >
                {item.itemName}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        className="guess-form__button"
        disabled={disabled || isSubmitting || suggestions.length === 0}
        type="submit"
      >
        {isSubmitting ? 'Checking...' : 'Guess'}
      </button>
    </form>
  );
}

export default GuessInput;
