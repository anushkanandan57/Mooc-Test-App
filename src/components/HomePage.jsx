import { useState, useMemo } from 'react';
import { WEEKS, ALL_QUESTIONS, TOTAL_SETS, QUESTIONS_PER_SET } from '../data/questions';

export default function HomePage({ onStudy, onPracticeWeeks, onStartQuiz, completedSets, completedWeeks }) {
  const [tab, setTab] = useState('weeks');
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [search, setSearch] = useState('');

  const activeWeeks = WEEKS.filter(w => w.end > w.start).map(w => w.week);

  const toggleWeek = (w) => {
    const weekObj = WEEKS.find(item => item.week === w);
    if (!weekObj || weekObj.end <= weekObj.start) return;
    setSelectedWeeks(prev =>
      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    if (selectedWeeks.length === activeWeeks.length) setSelectedWeeks([]);
    else setSelectedWeeks(activeWeeks);
  };

  const filteredSets = useMemo(() => {
    const sets = Array.from({ length: TOTAL_SETS }, (_, i) => i + 1);
    if (!search) return sets;
    return sets.filter(n => String(n).includes(search));
  }, [search]);

  const completedCount = Object.keys(completedSets).length;
  const totalQSelected = selectedWeeks.reduce((acc, wn) => {
    const w = WEEKS.find(item => item.week === wn);
    return acc + (w ? w.end - w.start : 0);
  }, 0);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-badge">
          <span className="pulse"></span>
          Psychology of Learning Practice Platform
        </div>
        <h1 className="hero-title">
          Master <span className="gradient-text">Psychology of Learning</span>
          <br />Week by Week
        </h1>
        <p className="hero-subtitle">
          {ALL_QUESTIONS.length} questions organized into {WEEKS.length} weeks (Weeks 0–12).
          Study, practice by week, or mix multiple weeks for shuffled quizzes.
        </p>

        <div className="course-info-card">
          <span className="course-tag">NPTEL Course</span>
          <h2 className="course-title">Psychology of Learning</h2>
          <p className="course-instructor">NPTEL Online Certification Courses • IIT Kharagpur</p>
        </div>
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
              {selectedWeeks.length === activeWeeks.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="weeks-grid">
            {WEEKS.map(w => {
              const isSelected = selectedWeeks.includes(w.week);
              const done = completedWeeks[w.week];
              const qCount = w.end - w.start;
              const isEmpty = qCount === 0;

              return (
                <div
                  key={w.week}
                  className={`week-card ${isSelected ? 'selected' : ''} ${done ? 'completed' : ''} ${isEmpty ? 'empty-week' : ''}`}
                  style={isEmpty ? { opacity: 0.75 } : {}}
                >
                  {done && <span className="set-score-badge">{done.score}/{qCount}</span>}
                  <div
                    className="week-check"
                    onClick={() => !isEmpty && toggleWeek(w.week)}
                    style={{ cursor: isEmpty ? 'not-allowed' : 'pointer', opacity: isEmpty ? 0.3 : 1 }}
                  >
                    <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && '✓'}
                    </div>
                  </div>
                  <div className="week-card-body">
                    <div className="week-number">Week {w.week}</div>
                    <div className="week-range">
                      {isEmpty ? 'Questions coming soon' : `Q${w.start + 1} – Q${w.end}`}
                    </div>
                    <div className="week-qs">{isEmpty ? 'Empty' : `${qCount} questions`}</div>
                  </div>
                  <div className="week-actions">
                    <button
                      className="week-btn study"
                      disabled={isEmpty}
                      onClick={() => !isEmpty && onStudy(w.week)}
                      style={isEmpty ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      Study
                    </button>
                    <button
                      className="week-btn practice"
                      disabled={isEmpty}
                      onClick={() => !isEmpty && onPracticeWeeks([w.week])}
                      style={isEmpty ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
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
              <p className="section-subtitle">50 shuffled questions from all {ALL_QUESTIONS.length}</p>
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
