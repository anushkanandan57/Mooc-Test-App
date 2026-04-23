import { useState, useEffect, useCallback } from 'react';
import { generateSet, QUESTIONS_PER_SET } from '../data/questions';

export default function QuizPage({ setNumber, onFinish, onBack }) {
  const [questions] = useState(() => generateSet(setNumber));
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showDots, setShowDots] = useState(false);

  // Timer
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
    setShowAnswer(true);
  };

  const nextQ = useCallback(() => {
    setShowAnswer(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
    }
  }, [currentQ, questions.length]);

  const prevQ = () => {
    setShowAnswer(false);
    if (currentQ > 0) setCurrentQ(c => c - 1);
  };

  const goToQ = (idx) => {
    setShowAnswer(false);
    setCurrentQ(idx);
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    onFinish({
      setNumber,
      score,
      total: QUESTIONS_PER_SET,
      answers,
      questions,
      time: timer,
    });
  };

  const answeredCount = Object.keys(answers).length;
  const q = questions[currentQ];
  const selectedAnswer = answers[currentQ];
  const isAnswered = selectedAnswer !== undefined;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="quiz-back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="quiz-info-bar">
          <div className="quiz-timer">
            ⏱{formatTime(timer)}
          </div>
          <div className="quiz-progress-text">
            {answeredCount}/{QUESTIONS_PER_SET} answered
          </div>
          <button
            className="quiz-back-btn"
            onClick={() => setShowDots(d => !d)}
            style={{ fontSize: '0.8rem' }}
          >
            {showDots ? '🔼 Hide' : '🔽 Navigator'}
          </button>
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${(answeredCount / QUESTIONS_PER_SET) * 100}%` }} />
      </div>

      {showDots && (
        <div className="question-dots">
          {questions.map((_, i) => (
            <button
              key={i}
              className={`q-dot ${i === currentQ ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`}
              onClick={() => goToQ(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="question-card" key={currentQ}>
        <div className="question-number">Question {currentQ + 1} of {QUESTIONS_PER_SET}</div>
        <div className="question-text">{q.question}</div>

        <div className="options-list">
          {q.options.map((opt, idx) => {
            let cls = 'option-btn';
            if (isAnswered) {
              cls += ' disabled';
              if (idx === q.correctAnswer) cls += ' correct show-correct';
              if (idx === selectedAnswer && idx !== q.correctAnswer) cls += ' incorrect';
              if (idx === selectedAnswer && idx === q.correctAnswer) cls += ' correct';
            } else if (selectedAnswer === idx) {
              cls += ' selected';
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
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          Set #{setNumber}
        </span>
        {currentQ === questions.length - 1 ? (
          <button
            className="nav-btn primary"
            onClick={handleSubmit}
            disabled={answeredCount < QUESTIONS_PER_SET}
            title={answeredCount < QUESTIONS_PER_SET ? `Answer all ${QUESTIONS_PER_SET} questions first` : 'Submit quiz'}
          >
            Submit Quiz 
          </button>
        ) : (
          <button className="nav-btn primary" onClick={nextQ}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
