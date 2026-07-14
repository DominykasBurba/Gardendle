import HomePage from './pages/HomePage';
import ClassicModePage from './pages/ClassicModePage';
import './App.css';

function App() {
  if (window.location.pathname === '/classic') {
    return <ClassicModePage />;
  }

  return (
    <HomePage />
  );
}

export default App;
