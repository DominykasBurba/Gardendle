import HomePage from './pages/HomePage';
import ClassicModePage from './pages/ClassicModePage';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

function App() {
  const page =
    window.location.pathname === '/classic' ? (
      <ClassicModePage />
    ) : (
      <HomePage />
    );

  return (
    <>
      {page}
      <Analytics />
    </>
  );
}

export default App;
