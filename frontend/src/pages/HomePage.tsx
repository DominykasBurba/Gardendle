function HomePage() {
    return (
        <div className="home-page">
            <header className="home-page__header">
                <a className="home-page__logo-link" href="/" aria-label="Go to homepage">
                    <img
                        className="home-page__logo"
                        src="/Gardendle_Logo.png"
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
            </main>
        </div>
    )
}

export default HomePage;
