import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';

const STORAGE_KEY = 'sdg-quiz-progress';

function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'quiz' | 'results'
  const [currentSet, setCurrentSet] = useState(null);
  const [result, setResult] = useState(null);
  const [completedSets, setCompletedSets] = useState(loadProgress);

  useEffect(() => { saveProgress(completedSets); }, [completedSets]);

  const handleStartQuiz = (setNum) => {
    setCurrentSet(setNum);
    setPage('quiz');
    window.scrollTo(0, 0);
  };

  const handleFinish = (res) => {
    setResult(res);
    setCompletedSets(prev => {
      const existing = prev[res.setNumber];
      if (!existing || res.score > existing.score) {
        return { ...prev, [res.setNumber]: { score: res.score, time: res.time } };
      }
      return prev;
    });
    setPage('results');
    window.scrollTo(0, 0);
  };

  const handleHome = () => {
    setPage('home');
    setCurrentSet(null);
    setResult(null);
    window.scrollTo(0, 0);
  };

  const handleRetry = () => {
    setPage('quiz');
    setCurrentSet(prev => prev); // re-render
    window.scrollTo(0, 0);
  };

  const totalCompleted = Object.keys(completedSets).length;

  return (
    <>
      <div className="bg-animation">
        <div className="bg-orb" />
        <div className="bg-orb" />
        <div className="bg-orb" />
      </div>

      <div className="app-container">
        <header className="header">
          <div className="header-logo" onClick={handleHome}>
            <span className="logo-icon"></span>
            SDG Quiz Pro
          </div>
          <div className="header-stats">
            <div className="stat-badge">
               <span className="stat-val">{totalCompleted}</span> completed
            </div>
          </div>
        </header>

        {page === 'home' && (
          <HomePage onStartQuiz={handleStartQuiz} completedSets={completedSets} />
        )}
        {page === 'quiz' && (
          <QuizPage
            key={`${currentSet}-${Date.now()}`}
            setNumber={currentSet}
            onFinish={handleFinish}
            onBack={handleHome}
          />
        )}
        {page === 'results' && result && (
          <ResultsPage
            result={result}
            onHome={handleHome}
            onRetry={handleRetry}
          />
        )}
      </div>
    </>
  );
}
