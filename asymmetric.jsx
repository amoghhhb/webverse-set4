"use client"

import { useState, useEffect } from "react"
import "./asymmetric.css"

function Asymmetric({ onNext }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [numberInput, setNumberInput] = useState("")
  const [result, setResult] = useState({ show: false, isCorrect: false })
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTime, setBlockTime] = useState(0)

  // Master timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);
  
  // Block timer logic
  useEffect(() => {
    let timerId
    if (isBlocked && blockTime > 0) {
      timerId = setTimeout(() => setBlockTime(blockTime - 1), 1000)
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false)
      setNumberInput("")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTime])

  const checkAnswer = () => {
    if (isBlocked || timeLeft === 0) return
    if (numberInput.trim() === "2") {
      setResult({ show: true, isCorrect: true })
      setAttempts(0)
    } else {
      setResult({ show: true, isCorrect: false })
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setBlockTime(penalty)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isBlocked && numberInput.trim() !== "" && timeLeft > 0) {
      checkAnswer()
    }
  }

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="binary-workshop">
      <div className="clock-display">
        <span role="img" aria-label="timer">⏳</span>
        <span>{formatTime()}</span>
      </div>
      <div className="conversion-station">
        <h2>🧠 QUIZ</h2>
        <p>
          <strong>In Asymmetric key cryptography how many keys are used ?</strong>
        </p>
        <div className="conversion-controls">
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isBlocked ? `Blocked (${blockTime}s)` : "Enter your answer here"}
            className="binary-decoder"
            disabled={isBlocked || timeLeft === 0}
          />
        </div>
        <div className="control-panel">
          <button
            onClick={checkAnswer}
            disabled={isBlocked || numberInput.length === 0 || timeLeft === 0}
            className={`decode-submit ${isBlocked || numberInput.length === 0 ? "disabled" : ""}`}
          >
            {isBlocked ? `⏳ ${blockTime}s` : "Submit"}
          </button>
        </div>
        {result.show && (
          <div className={`status-indicator ${result.isCorrect ? "success-indicator" : "error-indicator"}`}>
            {result.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </div>
        )}
        <section className="attempts-section">
          <div className="attempts-tracker">
            <span className="attempts-label">Attempts:</span>
            <div className="attempts-dots" role="img" aria-label={`${attempts} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div key={attempt} className={`attempts-dot ${attempts >= attempt ? "used" : ""}`} aria-hidden="true" />
              ))}
            </div>
          </div>
        </section>
        <button onClick={onNext} disabled={!result.isCorrect || timeLeft === 0} className="workshop-next">
          Go to Next Clue ➡️
        </button>
        {timeLeft === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

export default Asymmetric