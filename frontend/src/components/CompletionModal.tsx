import { useState } from 'react';
import './CompletionModal.css';

type CompletionModalProps = {
  onClose: () => void;
};

function CompletionModal({ onClose }: CompletionModalProps) {
  const [copyMessage, setCopyMessage] = useState('Copy link');

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/classic`);
      setCopyMessage('Link copied!');
    } catch {
      setCopyMessage('Could not copy');
    }
  }

  return (
    <div className="completion-modal__overlay" onClick={onClose}>
      <section
        aria-labelledby="completion-modal-title"
        aria-modal="true"
        className="completion-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Close share window"
          className="completion-modal__close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <img
          alt="GardenDLE"
          className="completion-modal__logo"
          src="/Gardendle_Logo.png"
        />

        <h2 className="completion-modal__title" id="completion-modal-title">
          Share with friends!
        </h2>
        <p className="completion-modal__text">
          Challenge your friends to solve today&apos;s garden puzzle.
        </p>

        <button
          className="completion-modal__copy-button"
          onClick={copyShareLink}
          type="button"
        >
          {copyMessage}
        </button>
      </section>
    </div>
  );
}

export default CompletionModal;
