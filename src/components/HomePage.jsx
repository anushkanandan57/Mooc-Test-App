import { useState, useMemo } from 'react';
import { WEEKS, ALL_QUESTIONS, TOTAL_SETS, QUESTIONS_PER_SET } from '../data/questions';

export default function HomePage({ onStudy, onPracticeWeeks, onStartQuiz, completedSets, completedWeeks }) {
  const [tab, setTab] = useState('weeks');
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [search, setSearch] = useState('');

  const toggleWeek = (w) => {
    setSelectedWeeks(prev =>
      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    if (selectedWeeks.length === WEEKS.length) setSelectedWeeks([]);
    else setSelectedWeeks(WEEKS.map(w => w.week));
  };

  const filteredSets = useMemo(() => {
    const sets = Array.from({ length: TOTAL_SETS }, (_, i) => i + 1);
    if (!search) return sets;
    return sets.filter(n => String(n).includes(search));
  }, [search]);

  const completedCount = Object.keys(completedSets).length;
  const totalQSelected = selectedWeeks.length * 10;

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-badge">
          <span className="pulse"></span>
          SDG Quiz Practice Platform
        </div>
        <h1 className="hero-title">
          Master Your <span className="gradient-text">SDG Knowledge</span>
          <br />Week by Week
        </h1>
        <p className="hero-subtitle">
          {ALL_QUESTIONS.length} questions organized into {WEEKS.length} weeks.
          Study, practice by week, or mix multiple weeks for shuffled quizzes.
        </p>
        <div className="hero-stats-row">
          <div className="hero-stat">
            <div className="hero-stat-val">{ALL_QUESTIONS.length}</div>
            <div className="hero-stat-label">Total Questions</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{WEEKS.length}</div>
            <div className="hero-stat-label">Weeks</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{TOTAL_SETS}</div>
            <div className="hero-stat-label">Practice Sets</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{completedCount}</div>
            <div className="hero-stat-label">Completed</div>
          </div>
        </div>
      </section>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button className={`tab-btn ${tab === 'weeks' ? 'active' : ''}`} onClick={() => setTab('weeks')}>
          Weeks (Study & Practice)
        </button>
        <button className={`tab-btn ${tab === 'sets' ? 'active' : ''}`} onClick={() => setTab('sets')}>
          Practice Sets (50 Qs)
        </button>
      </div>

      {tab === 'weeks' && (
        <>
          {/* Multi-select bar */}
          {selectedWeeks.length > 0 && (
            <div className="multi-select-bar">
              <div className="multi-info">
                <span className="multi-count">{selectedWeeks.length} week{selectedWeeks.length > 1 ? 's' : ''} selected</span>
                <span className="multi-qs">{totalQSelected} questions</span>
              </div>
              <div className="multi-actions">
                <button className="nav-btn secondary" onClick={() => setSelectedWeeks([])}>
                  Clear
                </button>
                <button className="nav-btn primary" onClick={() => onPracticeWeeks(selectedWeeks)}>
                  Practice Selected Weeks
                </button>
              </div>
            </div>
          )}

          <div className="section-header">
            <div>
              <h2 className="section-title">Weekly Modules</h2>
              <p className="section-subtitle">Select weeks to combine, or click Study/Practice for a single week</p>
            </div>
            <button className="nav-btn secondary" onClick={selectAll} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
              {selectedWeeks.length === WEEKS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="weeks-grid">
            {WEEKS.map(w => {
              const isSelected = selectedWeeks.includes(w.week);
              const done = completedWeeks[w.week];
              return (
                <div
                  key={w.week}
                  className={`week-card ${isSelected ? 'selected' : ''} ${done ? 'completed' : ''}`}
                >
                  {done && <span className="set-score-badge">{done.score}/10</span>}
                  <div className="week-check" onClick={() => toggleWeek(w.week)}>
                    <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && '✓'}
                    </div>
                  </div>
                  <div className="week-card-body">
                    <div className="week-number">Week {w.week}</div>
                    <div className="week-range">Q{w.start + 1} – Q{w.end}</div>
                    <div className="week-qs">{w.end - w.start} questions</div>
                  </div>
                  <div className="week-actions">
                    <button className="week-btn study" onClick={() => onStudy(w.week)}>
                      Study
                    </button>
                    <button className="week-btn practice" onClick={() => onPracticeWeeks([w.week])}>
                      Practice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'sets' && (
        <>
          <div className="section-header">
            <div>
              <h2 className="section-title">Practice Sets</h2>
              <p className="section-subtitle">50 shuffled questions from all 130</p>
            </div>
            <input
              type="text" placeholder="Search set #..."
              value={search} onChange={e => setSearch(e.target.value)}
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
                <div key={num} className={`set-card ${completed ? 'completed' : ''}`} onClick={() => onStartQuiz(num)}>
                  {completed && <span className="set-score-badge">{completed.score}/{QUESTIONS_PER_SET}</span>}
                  
                  <div className="set-icon">
                    {completed ? '✅' : '📝'}
                  </div>
                  
                  <div className="set-card-body">
                    <div className="set-number">Set {String(num).padStart(2, '0')}</div>
                    <div className="set-label">Practice Quiz</div>
                    <div className="set-meta">{QUESTIONS_PER_SET} questions</div>
                  </div>

                  <div className="set-action">
                    {completed ? 'Retry' : 'Start'}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
