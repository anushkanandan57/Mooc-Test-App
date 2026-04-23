import { useState, useMemo } from 'react';
import { TOTAL_SETS, QUESTIONS_PER_SET, ALL_QUESTIONS } from '../data/questions';

export default function HomePage({ onStartQuiz, completedSets }) {
  const [search, setSearch] = useState('');

  const filteredSets = useMemo(() => {
    const sets = Array.from({ length: TOTAL_SETS }, (_, i) => i + 1);
    if (!search) return sets;
    return sets.filter(n => String(n).includes(search));
  }, [search]);

  const completedCount = Object.keys(completedSets).length;
  const bestScore = Object.values(completedSets).reduce((max, s) => Math.max(max, s.score), 0);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-badge">
          <span className="pulse"></span>
          SDG Quiz Practice Platform
        </div>
        <h1 className="hero-title">
          Master Your <span className="gradient-text">SDG Knowledge</span>
          <br />One Set at a Time
        </h1>
        <p className="hero-subtitle">
          {ALL_QUESTIONS.length} carefully curated questions across {TOTAL_SETS} unique practice sets.
          Each set contains {QUESTIONS_PER_SET} shuffled questions for maximum retention.
        </p>
        <div className="hero-stats-row">
          <div className="hero-stat">
            <div className="hero-stat-val">{ALL_QUESTIONS.length}</div>
            <div className="hero-stat-label">Total Questions</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{TOTAL_SETS}</div>
            <div className="hero-stat-label">Practice Sets</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{QUESTIONS_PER_SET}</div>
            <div className="hero-stat-label">Per Set</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{completedCount}</div>
            <div className="hero-stat-label">Completed</div>
          </div>
        </div>
      </section>

      <div className="section-header">
        <div>
          <h2 className="section-title">Practice Sets</h2>
          <p className="section-subtitle">Pick any set to start practicing</p>
        </div>
        <input
          type="text"
          placeholder="Search set #..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'var(--glass)', border: '1px solid var(--glass-border)',
            borderRadius: '100px', padding: '8px 16px', color: 'var(--text-primary)',
            fontSize: '0.85rem', outline: 'none', width: '140px',
          }}
        />
      </div>

      <div className="sets-grid">
        {filteredSets.map(num => {
          const completed = completedSets[num];
          return (
            <div
              key={num}
              className={`set-card ${completed ? 'completed' : ''}`}
              onClick={() => onStartQuiz(num)}
              style={{ animationDelay: `${(num % 20) * 0.02}s` }}
            >
              {completed && (
                <span className="set-score-badge">
                  {completed.score}/{QUESTIONS_PER_SET}
                </span>
              )}
              <div className="set-card-content">
                <div className="set-number">#{String(num).padStart(2, '0')}</div>
                <div className="set-label">Practice Set</div>
                <div className="set-meta">
                  <span>{QUESTIONS_PER_SET} Qs</span>
                  {completed && <span>• ✅ Done</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
