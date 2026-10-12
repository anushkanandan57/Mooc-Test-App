import { useState } from 'react';
import { getWeekQuestions } from '../data/questions';

export default function StudyPage({ weekNum, onBack }) {
  const questions = getWeekQuestions(weekNum);
  const [reveal, setReveal] = useState({});
  const [revealAll, setRevealAll] = useState(false);
  const letters = ['A', 'B', 'C', 'D', 'E'];

  const toggleReveal = (i) => {
    setReveal(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="study-page">
      <div className="study-header">
        <button className="quiz-back-btn" onClick={onBack}>← Back</button>
        <h2 className="study-title">Week {weekNum} — Study Mode</h2>
        {questions.length > 0 && (
          <button
            className="nav-btn secondary"
            onClick={() => setRevealAll(r => !r)}
            style={{ fontSize: '0.82rem' }}
          >
            {revealAll ? 'Hide All Answers' : 'Show All Answers'}
          </button>
        )}
      </div>

      {questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No questions available for Week {weekNum} yet.</p>
          <button className="nav-btn primary" onClick={onBack}>Return to Home</button>
        </div>
      ) : (
        <div className="study-list">
          {questions.map((q, i) => {
            const shown = revealAll || reveal[i];
            return (
              <div key={i} className="study-card" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="study-q-num">Q{i + 1}</div>
                <div className="study-q-text">{q.question}</div>
                <div className="study-options">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`study-opt ${shown && oi === q.correctAnswer ? 'correct' : ''}`}
                    >
                      <span className="option-letter">{letters[oi]}</span>
                      <span>{opt}</span>
                      {shown && oi === q.correctAnswer && (
                        <span className="correct-tag">Correct</span>
                      )}
                    </div>
                  ))}
                </div>
                {!revealAll && (
                  <button className="reveal-btn" onClick={() => toggleReveal(i)}>
                    {reveal[i] ? 'Hide Answer' : 'Show Answer'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
