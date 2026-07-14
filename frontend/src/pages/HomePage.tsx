function HomePage() {
    const gameModes = [
        {
            title: 'Classic',
            description: 'Get clues on every try',
            path: '/classic',
        },
        {
            title: 'Photo Grid',
            description: 'Guess from a puzzle image',
            path: '/classic',
        },
        {
            title: 'Timed',
            description: 'Beat the clock',
            path: '/classic',
        },
        {
            title: 'Daily',
            description: 'One garden challenge per day',
            path: '/classic',
        },
    ];

    function openGameMode(path: string) {
        window.location.href = path;
    }

    return (
        <div className="home-page">
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
                <div className="mode-list" aria-label="Choose a game mode">
                    {gameModes.map((mode) => (
                        <button
                            className="mode-button"
                            key={mode.title}
                            type="button"
                            onClick={() => openGameMode(mode.path)}
                        >
                            <span className="mode-button__title">{mode.title}</span>
                            <span className="mode-button__description">{mode.description}</span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default HomePage;
