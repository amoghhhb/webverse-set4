"use client"

import { useState, useEffect } from "react"
import "./GamePage4.css"

function GamePage({ onNext }) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [answer, setAnswer] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [tries, setTries] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimer, setBlockTimer] = useState(10)
  const [isCorrect, setIsCorrect] = useState(false)

  // Master timer logic
  useEffect(() => {
    if (timeLeft <= 0) return
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [timeLeft])

  // Block timer logic
  useEffect(() => {
    let timerId
    if (isBlocked) {
      if (blockTimer > 0) {
        timerId = setTimeout(() => setBlockTimer(blockTimer - 1), 1000)
      } else {
        setIsBlocked(false)
        setTries(0)
        setBlockTimer(10)
        setErrorMessage("")
      }
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTimer])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isBlocked || timeLeft === 0) return
    if (answer === "1") {
      setIsCorrect(true)
      setErrorMessage("")
    } else {
      setIsCorrect(false)
      const newTries = tries + 1
      setTries(newTries)
      if (newTries >= 3) {
        setIsBlocked(true)
        setErrorMessage("Too many tries! Please wait 10 seconds ⏳")
      } else {
        setErrorMessage("Incorrect clue input ❌")
      }
    }
  }

  const handleSimulatorClick = () => {
    window.open("https://circuitverse.org/simulator", "_blank", "noopener,noreferrer")
  }
  
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="logic-arena">
      <div className="clock-display">
      <span role="img" aria-label="timer">⏳</span>
      <span>{formatTime()}</span>
    </div>

      <div className="arena-content">
      <header className="challenge-header">
        <h1 className="arena-title">Logic Gate Puzzle</h1>
      </header>

        <section className="logic-problem">
          <div className="problem-workspace">
            <h2 className="workspace-heading">
              <span className="workspace-emoji" role="img" aria-label="lightning">
                ⚡
              </span>
              <span>Solve the Logic Expression</span>
            </h2>
            <div className="formula-showcase">
              <code className="logic-formula" aria-label="Logic expression: A AND B OR C">
                A XOR B?
              </code>
            </div>
            <div className="variables-section">
              <h3 className="variables-heading">Given Values:</h3>
              <div className="variables-grid" role="list" aria-label="Variable values">
                <div className="variable-item" role="listitem">
                  <span className="variable-name">A =</span>
                  <span className="variable-digit" aria-label="A equals 1">
                    0
                  </span>
                </div>
                <div className="variable-item" role="listitem">
                  <span className="variable-name">B =</span>
                  <span className="variable-digit" aria-label="B equals 0">
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="response-section">
          <form onSubmit={handleSubmit} className="response-form">
            <div className="response-group">
              <label htmlFor="answer" className="response-label">
                Your Answer
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="response-field"
                disabled={isBlocked || timeLeft === 0 || isCorrect}
                placeholder=""
                maxLength={1}
                pattern="[01]"
                inputMode="numeric"
                aria-describedby="answer-help"
                autoComplete="off"
              />
            </div>

            <button
              type="button"
              className="tool-btn"
              onClick={handleSimulatorClick}
              aria-label="Open CircuitVerse simulator in new tab"
            >
              <span className="tool-icon" role="img" aria-hidden="true">
                🔧
              </span>
              <span>Circuit Simulator</span>
            </button>
          </form>
        </section>

        <section className="button-row-section">
          <div className="button-container">
            <button
              type="button"
              className="solve-btn"
              onClick={handleSubmit}
              disabled={isBlocked || timeLeft === 0 || isCorrect || !answer.trim()}
              aria-describedby="submit-status"
            >
              {isBlocked ? `Wait ${blockTimer}s` : "Submit"}
            </button>

            <button
              className={`Maps-btn ${!isCorrect || timeLeft === 0 ? "disabled" : ""}`}
              onClick={onNext}
              disabled={!isCorrect || timeLeft === 0}
              aria-describedby="next-help"
            >
              <span className="navigate-text">Go to Next Clue</span>
              <span className="navigate-icon" aria-hidden="true">
                ➡️
              </span>
            </button>
          </div>
          <div id="next-help" className="sr-only">
            Available only after answering correctly and within time limit
          </div>
        </section>

        <section className="status-section" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <div className="status-alert error-alert" role="alert">
              <span className="alert-icon" aria-hidden="true">
                ❌
              </span>
              <span className="alert-text">
                {errorMessage} {isBlocked && ` (${blockTimer}s)`}
              </span>
            </div>
          )}

          {isCorrect && (
            <div className="status-alert success-alert" role="alert">
              <span className="alert-icon" aria-hidden="true">
                ✅
              </span>
              <span className="alert-text">Correct! Click next to continue.</span>
            </div>
          )}

          {timeLeft === 0 && (
            <div className="status-alert timeout-alert" role="alert">
              <span className="alert-icon" aria-hidden="true">
                ⏰
              </span>
              <span className="alert-text">{"Time's up!"}</span>
            </div>
          )}
        </section>

        <section className="progress-section">
          <div className="progress-tracker">
            <span className="tracker-label">Attempts:</span>
            <div className="progress-dots" role="img" aria-label={`${tries} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div key={attempt} className={`progress-dot ${tries >= attempt ? "used" : ""}`} aria-hidden="true" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GamePage