import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import StudyPage from './components/StudyPage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import { generateSet, getPracticeQuestions } from './data/questions';

const STORAGE_KEY = 'sdg-quiz-progress';
const WEEK_KEY = 'sdg-week-progress';

function load(key) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : {}; }
  catch { return {}; }
}

export default function App() {
  const [page, setPage] = useState('home');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizMeta, setQuizMeta] = useState(null); // {type, id} for saving
  const [result, setResult] = useState(null);
  const [completedSets, setCompletedSets] = useState(() => load(STORAGE_KEY));
  const [completedWeeks, setCompletedWeeks] = useState(() => load(WEEK_KEY));

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSets)); }, [completedSets]);
  useEffect(() => { localStorage.setItem(WEEK_KEY, JSON.stringify(completedWeeks)); }, [completedWeeks]);

  const goHome = () => { setPage('home'); setResult(null); window.scrollTo(0, 0); };

  const handleStudy = (weekNum) => {
    setQuizMeta({ type: 'week-study', id: weekNum });
    setPage('study');
    setQuizTitle(`Week ${weekNum}`);
    window.scrollTo(0, 0);
  };

  const handlePracticeWeeks = (weekNums) => {
    const qs = getPracticeQuestions(weekNums);
    const label = weekNums.length === 1
      ? `Week ${weekNums[0]} Practice`
      : `Week ${weekNums[0]}–${weekNums[weekNums.length - 1]} (${weekNums.length} weeks)`;
    setQuizQuestions(qs);
    setQuizTitle(label);
    setQuizMeta({ type: 'week', ids: weekNums });
    setPage('quiz');
    window.scrollTo(0, 0);
  };

  const handleStartQuiz = (setNum) => {
    const qs = generateSet(setNum);
    setQuizQuestions(qs);
    setQuizTitle(`Practice Set #${String(setNum).padStart(2, '0')}`);
    setQuizMeta({ type: 'set', id: setNum });
    setPage('quiz');
    window.scrollTo(0, 0);
  };

  const handleFinish = (res) => {
    setResult({ ...res, title: quizTitle });
    // Save progress
    if (quizMeta?.type === 'set') {
      setCompletedSets(prev => {
        const existing = prev[quizMeta.id];
        if (!existing || res.score > existing.score)
          return { ...prev, [quizMeta.id]: { score: res.score, time: res.time } };
        return prev;
      });
    } else if (quizMeta?.type === 'week' && quizMeta.ids.length === 1) {
      const wk = quizMeta.ids[0];
      setCompletedWeeks(prev => {
        const existing = prev[wk];
        if (!existing || res.score > existing.score)
          return { ...prev, [wk]: { score: res.score, time: res.time } };
        return prev;
      });
    }
    setPage('results');
    window.scrollTo(0, 0);
  };

  const handleRetry = () => {
    if (quizMeta?.type === 'week') {
      handlePracticeWeeks(quizMeta.ids);
    } else if (quizMeta?.type === 'set') {
      handleStartQuiz(quizMeta.id);
    }
  };

  const totalCompleted = Object.keys(completedSets).length + Object.keys(completedWeeks).length;

  return (
    <>
      <div className="bg-animation">
        <div className="bg-orb" />
        <div className="bg-orb" />
        <div className="bg-orb" />
      </div>
      <div className="app-container">
        <header className="header">
          <div className="header-logo" onClick={goHome}>
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
          <HomePage
            onStudy={handleStudy}
            onPracticeWeeks={handlePracticeWeeks}
            onStartQuiz={handleStartQuiz}
            completedSets={completedSets}
            completedWeeks={completedWeeks}
          />
        )}
        {page === 'study' && (
          <StudyPage weekNum={quizMeta.id} onBack={goHome} />
        )}
        {page === 'quiz' && (
          <QuizPage
            key={Date.now()}
            questions={quizQuestions}
            title={quizTitle}
            onFinish={handleFinish}
            onBack={goHome}
          />
        )}
        {page === 'results' && result && (
          <ResultsPage result={result} onHome={goHome} onRetry={handleRetry} />
        )}
      </div>
    </>
  );
}
