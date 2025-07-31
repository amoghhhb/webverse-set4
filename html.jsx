"use client"

import { useState, useEffect } from "react"
import "./html.css"

function Html({ onNext }) {
  const [masterTime, setMasterTime] = useState(600); // 10 minutes
  const [answer, setAnswer] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // Master timer logic
  useEffect(() => {
    if (masterTime <= 0) return;
    const intervalId = setInterval(() => {
      setMasterTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [masterTime]);

  // Block timer logic
  useEffect(() => {
    let timerId
    if (isBlocked && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    } else if (isBlocked && timeLeft === 0) {
      setIsBlocked(false)
      setAnswer("")
      setError("")
      setSuccessMsg("")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, timeLeft])

  const handleInputChange = (e) => {
    const val = e.target.value
    if (/^[0-9]*$/.test(val)) {
      setAnswer(val)
      setError("")
      setSuccessMsg("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isBlocked || answer === "" || masterTime === 0) return

    if (answer === "5") {
      setIsVerified(true)
      setError("")
      setSuccessMsg("✅ Access granted! Clue accepted.")
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setSuccessMsg("")

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setTimeLeft(penalty)
        setError(`❌ Locked for ${penalty} seconds`)
      } else {
        setError(`❌ Incorrect. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? "" : "s"} left.`)
      }
    }
  }
  
  const formatTime = () => {
    const minutes = Math.floor(masterTime / 60);
    const seconds = masterTime % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="detective-wrapper">
      <div className="clock-display">
        <span role="img" aria-label="timer">⏳</span>
        <span>{formatTime()}</span>
      </div>
      <div className="investigation-panel">
        <h1 className="mystery-title">🧠 HTML QUIZ</h1>
        <p className="riddle-text">
          Between &lt;h1&gt; & &lt;h5&gt; how many heading levels falls strictly below &lt;h1&gt; till &lt;h6&gt;
        </p>
        <form onSubmit={handleSubmit} className="verification-form">
          <div className="code-input-section">
            <input
              type="text"
              value={answer}
              onChange={handleInputChange}
              disabled={isBlocked || isVerified || masterTime === 0}
              placeholder="Enter The Discovered Code"
              className="secret-code-field"
            />
            <button
              type="submit"
              disabled={isBlocked || answer === "" || isVerified || masterTime === 0}
              className="verify-btn"
            >
              {isBlocked ? `⏳ ${timeLeft}s` : "Verify"}
            </button>
          </div>
          {error && <div className="status-indicator error-indicator">{error}</div>}
          {successMsg && <div className="status-indicator success-indicator">{successMsg}</div>}
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
        </form>
        <button className="proceed-btn" onClick={onNext} disabled={!isVerified || masterTime === 0}>
          Go to Next Clue ➡️
        </button>
        {masterTime === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

export default Html