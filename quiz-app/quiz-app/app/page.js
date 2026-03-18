'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import quizData from '../data/quizzes.json'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizPage() {
  const [phase, setPhase] = useState('start') // start | quiz | result | end
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState(null) // { correct: bool, answer: string }
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const inputRef = useRef(null)

  const loadNextQuestion = useCallback((q) => {
    if (q.length === 0) {
      // 모두 소진되면 다시 섞어서 계속
      const reshuffled = shuffleArray(quizData)
      setCurrent(reshuffled[0])
      setQueue(reshuffled.slice(1))
    } else {
      setCurrent(q[0])
      setQueue(q.slice(1))
    }
    setInput('')
    setFeedback(null)
    setPhase('quiz')
  }, [])

  // 시작: Enter 키
  useEffect(() => {
    if (phase !== 'start') return
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        const shuffled = shuffleArray(quizData)
        loadNextQuestion(shuffled)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, loadNextQuestion])

  // 퀴즈 중 Enter 키
  useEffect(() => {
    if (phase !== 'quiz') return
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        if (document.activeElement === inputRef.current) return // input이 포커스면 submit으로
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase])

  // result 상태: Enter로 다음 문제
  useEffect(() => {
    if (phase !== 'result') return
    const handleKey = (e) => {
      if (e.key === 'Enter') {
        loadNextQuestion(queue)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [phase, queue, loadNextQuestion])

  useEffect(() => {
    if (phase === 'quiz' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [phase, current])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const isCorrect = input.trim().toLowerCase() === current.answer.toLowerCase()
    setFeedback({ correct: isCorrect, answer: current.answer })
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }))
    setPhase('result')
  }

  const handleEnd = () => {
    setPhase('end')
  }

  // ── START SCREEN ──
  if (phase === 'start') {
    return (
      <div style={styles.fullscreen}>
        <div style={styles.startInner}>
          <div style={styles.startLabel}>QUIZ</div>
          <h1 style={styles.startTitle}>IMAGE<br />QUIZ</h1>
          <p style={styles.startSub}>이미지를 보고 정답을 입력하세요</p>
          <div style={styles.startEnter}>
            <span style={styles.enterKey}>ENTER</span>
            <span style={styles.enterText}>를 눌러 시작</span>
          </div>
          <div style={styles.startCount}>{quizData.length} questions loaded</div>
        </div>
      </div>
    )
  }

  // ── END SCREEN ──
  if (phase === 'end') {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
    return (
      <div style={styles.fullscreen}>
        <div style={styles.startInner}>
          <div style={styles.startLabel}>RESULT</div>
          <h1 style={{ ...styles.startTitle, fontSize: '8rem' }}>{pct}%</h1>
          <p style={styles.endScore}>{score.correct} / {score.total} 정답</p>
          <button style={styles.restartBtn} onClick={() => {
            setScore({ correct: 0, total: 0 })
            setPhase('start')
          }}>
            다시 시작
          </button>
        </div>
      </div>
    )
  }

  // ── QUIZ / RESULT ──
  return (
    <div style={styles.fullscreen}>
      {/* 이미지 영역 */}
      <div style={styles.imageArea}>
        {current && (
          <img
            src={current.image}
            alt="quiz"
            style={styles.quizImage}
          />
        )}

        {/* 스코어 */}
        <div style={styles.scoreBadge}>
          {score.correct}/{score.total}
        </div>

        {/* 끝내기 버튼 */}
        <button style={styles.endBtn} onClick={handleEnd}>끝내기</button>
      </div>

      {/* 입력 / 피드백 영역 */}
      <div style={styles.bottomArea}>
        {phase === 'quiz' ? (
          <form onSubmit={handleSubmit} style={styles.inputForm}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="정답을 입력하세요..."
              style={styles.input}
              autoComplete="off"
              spellCheck="false"
            />
            <button type="submit" style={styles.submitBtn}>→</button>
          </form>
        ) : (
          <div style={styles.feedbackArea}>
            <div style={{
              ...styles.feedbackBadge,
              background: feedback?.correct ? 'var(--correct)' : 'var(--wrong)',
              color: '#000',
            }}>
              {feedback?.correct ? '✓ CORRECT' : '✗ WRONG'}
            </div>
            <div style={styles.answerLine}>
              정답: <span style={styles.answerText}>{feedback?.answer}</span>
            </div>
            <div style={styles.nextHint}>
              ENTER → 다음 문제
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  fullscreen: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg)',
    position: 'relative',
  },
  // ── START ──
  startInner: {
    margin: 'auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  startLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.75rem',
    letterSpacing: '0.3em',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  startTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '10rem',
    lineHeight: 0.9,
    color: 'var(--accent)',
    letterSpacing: '-0.02em',
  },
  startSub: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  startEnter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  enterKey: {
    border: '1.5px solid var(--text)',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  enterText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  startCount: {
    fontSize: '0.7rem',
    color: 'var(--border)',
    letterSpacing: '0.1em',
    marginTop: '1rem',
  },
  // ── IMAGE AREA ──
  imageArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    background: '#000',
  },
  quizImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  scoreBadge: {
    position: 'absolute',
    top: '1.2rem',
    left: '1.2rem',
    background: 'rgba(0,0,0,0.7)',
    border: '1px solid var(--border)',
    padding: '0.4rem 0.8rem',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.85rem',
    color: 'var(--accent)',
    backdropFilter: 'blur(8px)',
    borderRadius: '4px',
  },
  endBtn: {
    position: 'absolute',
    top: '1.2rem',
    right: '1.2rem',
    background: 'rgba(0,0,0,0.7)',
    border: '1px solid var(--border)',
    padding: '0.4rem 1rem',
    color: 'var(--text-muted)',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.8rem',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    borderRadius: '4px',
    letterSpacing: '0.05em',
    transition: 'border-color 0.2s, color 0.2s',
  },
  // ── BOTTOM AREA ──
  bottomArea: {
    height: '120px',
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 2rem',
  },
  inputForm: {
    display: 'flex',
    width: '100%',
    maxWidth: '600px',
    gap: '0.75rem',
  },
  input: {
    flex: 1,
    background: 'var(--bg)',
    border: '1.5px solid var(--border)',
    color: 'var(--text)',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    outline: 'none',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  submitBtn: {
    background: 'var(--accent)',
    border: 'none',
    color: '#000',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: '1.2rem',
    padding: '0.75rem 1.2rem',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'opacity 0.15s',
  },
  // ── FEEDBACK ──
  feedbackArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '700px',
    flexWrap: 'wrap',
  },
  feedbackBadge: {
    padding: '0.5rem 1.2rem',
    borderRadius: '4px',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.4rem',
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  answerLine: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    flex: 1,
  },
  answerText: {
    color: 'var(--text)',
    fontWeight: 600,
    fontSize: '1rem',
  },
  nextHint: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.7rem',
    color: 'var(--border)',
    letterSpacing: '0.1em',
    flexShrink: 0,
  },
  // ── END ──
  endScore: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
  },
  restartBtn: {
    marginTop: '1rem',
    background: 'transparent',
    border: '1.5px solid var(--accent)',
    color: 'var(--accent)',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.9rem',
    padding: '0.75rem 2rem',
    cursor: 'pointer',
    letterSpacing: '0.1em',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
}
