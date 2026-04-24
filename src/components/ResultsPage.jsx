import { useState, useEffect } from 'react';

function Confetti() {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    const colors = ['#6c5ce7', '#a29bfe', '#00cec9', '#55efc4', '#fd79a8', '#fdcb6e', '#ff6b6b'];
    const p = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setPieces(p);
    const t = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!pieces.length) return null;
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            width: p.size, height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function ResultsPage({ result, onHome, onRetry, onReview }) {
  const { score, total, time, title, answers, questions } = result;
  const percentage = Math.round((score / total) * 100);
  const wrong = total - score - (total - Object.keys(answers).length);
  const [filter, setFilter] = useState('all');

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const getEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🎉';
    if (percentage >= 50) return '👍';
    return '💪';
  };
  const getTitle = () => {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 70) return 'Great Job!';
    if (percentage >= 50) return 'Good Effort!';
    return 'Keep Practicing!';
  };

  const filteredQs = questions.map((q, i) => ({ ...q, idx: i })).filter(q => {
    if (filter === 'correct') return answers[q.idx] === q.correctAnswer;
    if (filter === 'wrong') return answers[q.idx] !== undefined && answers[q.idx] !== q.correctAnswer;
    if (filter === 'skipped') return answers[q.idx] === undefined;
    return true;
  });

  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="results-page">
      {percentage >= 70 && <Confetti />}
      <div className="results-card">
        <div className="results-emoji">{getEmoji()}</div>
        <h2 className="results-title">{getTitle()}</h2>
        <p className="results-subtitle">{title} completed in {formatTime(time)}</p>

        <div className="score-circle" style={{ '--score': percentage }}>
          <div className="score-circle-inner">
            <div className="score-percent">{percentage}%</div>
            <div className="score-label">Score</div>
          </div>
        </div>

        <div className="results-stats">
          <div className="result-stat">
            <div className="result-stat-val green">{score}</div>
            <div className="result-stat-label">Correct</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-val red">{wrong}</div>
            <div className="result-stat-label">Wrong</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-val orange">{formatTime(time)}</div>
            <div className="result-stat-label">Time Taken</div>
          </div>
        </div>

        <div className="results-actions">
          <button className="nav-btn secondary" onClick={onHome}> Home</button>
          <button className="nav-btn primary" onClick={onRetry}>Retry Set</button>
        </div>
      </div>

      <div className="review-section">
        <h3 className="review-title">Review Answers</h3>
        <div className="review-filter">
          {[
            { key: 'all', label: `All (${total})` },
            { key: 'correct', label: `Correct (${score})` },
            { key: 'wrong', label: `Wrong (${wrong})` },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredQs.map(q => {
          const userAns = answers[q.idx];
          const isCorrect = userAns === q.correctAnswer;
          return (
            <div key={q.idx} className="question-card" style={{ marginBottom: '1rem' }}>
              <div className="question-number" style={{ color: isCorrect ? 'var(--green)' : 'var(--red)' }}>
                {isCorrect ? '✅' : '❌'} Question {q.idx + 1}
              </div>
              <div className="question-text" style={{ fontSize: '1rem' }}>{q.question}</div>
              <div className="options-list" style={{ marginTop: '0.75rem' }}>
                {q.options.map((opt, oi) => {
                  let cls = 'option-btn disabled';
                  if (oi === q.correctAnswer) cls += ' correct show-correct';
                  if (oi === userAns && oi !== q.correctAnswer) cls += ' incorrect';
                  return (
                    <div key={oi} className={cls} style={{ padding: '0.6rem 1rem', fontSize: '0.88rem' }}>
                      <span className="option-letter" style={{ width: 26, height: 26, fontSize: '0.72rem' }}>
                        {letters[oi]}
                      </span>
                      <span>{opt}</span>
                      {oi === userAns && oi !== q.correctAnswer && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--red)' }}>Your answer</span>
                      )}
                      {oi === q.correctAnswer && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--green)' }}>Correct</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
