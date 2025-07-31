"use client"

import { useState, useEffect } from "react"
import "./network.css"

const Network = ({ onNext }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState("")
  const [showNextButton, setShowNextButton] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // Master timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const checkAnswer = (e) => {
    if (e) {
      e.preventDefault()
    }

    if (timeLeft === 0) return
    if (answer.trim() === "2") {
      setResult("✅ Correct! A point-to-point network directly connects two hosts.")
      setIsCorrect(true)
      setShowNextButton(true)
      setAttempts(0)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setResult("❌ Incorrect! Try again.")
      setIsCorrect(false)
      setShowNextButton(false)
    }
  }

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="file-lab">
      <div className="clock-display">
        <span role="img" aria-label="timer">⏳</span>
        <span>{formatTime()}</span>
      </div>
      <div className="lab-workstation">
        <h1 className="lab-banner">🧠 QUIZ</h1>
        <div className="file-catalog">Minimum number of hosts required for a point to point network?</div>
        <form onSubmit={checkAnswer} style={{ display: "contents" }}>
          <input
            type="number"
            className="analysis-field"
            placeholder="?"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={timeLeft === 0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                checkAnswer()
              }
            }}
          />
          <div className={`status-indicator ${isCorrect ? "success-indicator" : result ? "error-indicator" : ""}`}>
            {result}
          </div>
          <section className="attempts-section">
            <div className="attempts-tracker">
              <span className="attempts-label">Attempts:</span>
              <div className="attempts-dots" role="img" aria-label={`${attempts} out of 3 attempts used`}>
                {[1, 2, 3].map((attempt) => (
                  <div
                    key={attempt}
                    className={`attempts-dot ${attempts >= attempt ? "used" : ""}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </section>
          <button
            type="button"
            className="analyze-btn"
            onClick={(e) => {
              e.preventDefault()
              checkAnswer()
            }}
            disabled={answer.trim() === "" || timeLeft === 0}
          >
            Submit
          </button>
        </form>
        {showNextButton && (
          <button className="analyze-btn advance-btn" onClick={onNext}>
            Click to Continue
          </button>
        )}
        {timeLeft === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

export default Network