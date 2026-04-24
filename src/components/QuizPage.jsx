import { useState, useEffect, useCallback } from 'react';

export default function QuizPage({ questions: initialQuestions, title, onFinish, onBack }) {
  const [questions] = useState(initialQuestions);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [showDots, setShowDots] = useState(false);
  const totalQ = questions.length;

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleAnswer = (optionIdx) => {
    if (answers[currentQ] !== undefined) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optionIdx }));
  };

  const nextQ = useCallback(() => {
    if (currentQ < totalQ - 1) setCurrentQ(c => c + 1);
  }, [currentQ, totalQ]);

  const prevQ = () => {
    if (currentQ > 0) setCurrentQ(c => c - 1);
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    onFinish({ score, total: totalQ, answers, questions, time: timer });
  };

  const answeredCount = Object.keys(answers).length;
  const q = questions[currentQ];
  const selectedAnswer = answers[currentQ];
  const isAnswered = selectedAnswer !== undefined;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="quiz-back-btn" onClick={onBack}>← Back</button>
        <h3 style={{ color: 'var(--accent-2)', fontFamily: 'Outfit', fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
        <div className="quiz-info-bar">
          <div className="quiz-timer">
            {formatTime(timer)}
          </div>
          <div className="quiz-progress-text">
            {answeredCount}/{totalQ} answered
          </div>
          <button className="quiz-back-btn" onClick={() => setShowDots(d => !d)} style={{ fontSize: '0.8rem' }}>
            {showDots ? 'Hide' : 'Navigator'}
          </button>
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${(answeredCount / totalQ) * 100}%` }} />
      </div>

      {showDots && (
        <div className="question-dots">
          {questions.map((_, i) => (
            <button
              key={i}
              className={`q-dot ${i === currentQ ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`}
              onClick={() => setCurrentQ(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="question-card" key={currentQ}>
        <div className="question-number">Question {currentQ + 1} of {totalQ}</div>
        <div className="question-text">{q.question}</div>
        <div className="options-list">
          {q.options.map((opt, idx) => {
            let cls = 'option-btn';
            if (isAnswered) {
              cls += ' disabled';
              if (idx === q.correctAnswer) cls += ' correct show-correct';
              if (idx === selectedAnswer && idx !== q.correctAnswer) cls += ' incorrect';
            }
            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
                <span className="option-letter">{letters[idx]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="quiz-nav">
        <button className="nav-btn secondary" onClick={prevQ} disabled={currentQ === 0}>
          ← Previous
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{title}</span>
        {currentQ === totalQ - 1 ? (
          <button className="nav-btn primary" onClick={handleSubmit}
            disabled={answeredCount < totalQ}
            title={answeredCount < totalQ ? `Answer all ${totalQ} questions first` : 'Submit quiz'}>
            Submit Quiz
          </button>
        ) : (
          <button className="nav-btn primary" onClick={nextQ}>Next →</button>
        )}
      </div>
    </div>
  );
}
