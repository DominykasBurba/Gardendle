import { useEffect, useState } from 'react';
import {
    ACCESS_TOKEN_STORAGE_KEY,
    getCurrentUser,
} from '../api/auth';
import SignInModal from '../components/SignInModal';

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [showSignIn, setShowSignIn] = useState(false);

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

    return (
        <div className="home-page">
            {isLoggedIn === false ? (
                <button
                    className="auth-button"
                    onClick={() => setShowSignIn(true)}
                    type="button"
                >
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
                </button>)
                }

            {showSignIn ? (
                <SignInModal
                    onAuthenticated={() => setIsLoggedIn(true)}
                    onClose={() => setShowSignIn(false)}
                />
            ) : null}

            <header className="home-page__header">
                <a className="home-page__logo-link" href="/" aria-label="Go to homepage">
                    <img
                        className="home-page__logo"
                        src="/GardenDLE_Logo.png"
                        alt="GardenDLE"
                    />
                </a>
            </header>

            <main className="home-page__main">
                <button
                    aria-label="Play the Daily Challenge"
                    className="daily-challenge-button"
                    onClick={() => { window.location.href = '/classic'; }}
                    type="button"
                >
                    <img
                        alt="Daily Challenge — Can you guess today's item?"
                        className="daily-challenge-button__image"
                        src="/DailyChallenge.webp"
                    />
                </button>

                <img
                    alt="More modes — More ways to play coming soon"
                    className="more-modes-card"
                    src="/More ways.webp"
                />
            </main>
        </div>
    )
}

export default HomePage;
