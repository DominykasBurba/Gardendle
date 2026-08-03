import { useState, type FormEvent } from 'react';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  loginUser,
  registerUser,
} from '../api/auth';
import './SingInModal.css';

type SignInModalProps = {
  message?: string;
  onAuthenticated: () => void;
  onClose: () => void;
};

function SignInModal({ message, onAuthenticated, onClose }: SignInModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!username.trim()) {
      setError(mode === 'login'
        ? 'Please enter your username or email.'
        : 'Please enter a username.');
      return;
    }

    if (mode === 'register' && !email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (mode === 'register' && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = mode === 'login'
        ? await loginUser(username, password)
        : await registerUser({ username, email, password });

      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, result.accessToken);
      onAuthenticated();
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Authentication failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode);
    setError('');
    setPassword('');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        aria-labelledby="sign-in-title"
        aria-modal="true"
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Close sign in window"
          className="sign-in-modal__close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <img
          alt="GardenDLE"
          className="sing_in_page_logo"
          src="/GardenDLE_Logo.png"
        />

        {message ? <p className="sign-in-modal__message">{message}</p> : null}

        <form className="sign-in-modal__form" noValidate onSubmit={handleSubmit}>
          <label className="sign-in-modal__field">
            <span>{mode === 'login' ? 'Username or email' : 'Username'}</span>
            <input
              autoComplete="username"
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder={mode === 'login' ? 'Username or email' : 'GardenPlayer'}
              type="text"
              value={username}
            />
          </label>

          {mode === 'register' ? (
            <label className="sign-in-modal__field">
              <span>Email</span>
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="gardener@example.com"
                inputMode="email"
                type="text"
                value={email}
              />
            </label>
          ) : null}

          <label className="sign-in-modal__field">
            <span>Password</span>
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="sign-in-modal__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="sign-in-modal__actions">
            <button
              className="sign-in-modal__button"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login' ? 'Log in' : 'Register'}
            </button>
            <button
              className="sign-in-modal__button sign-in-modal__button--secondary"
              disabled={isSubmitting}
              onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
              type="button"
            >
              {mode === 'login' ? 'Create account' : 'Back to login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignInModal;
