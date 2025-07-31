"use client"

import { useState, useRef, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"

// Component imports
import HomePage from "./HomePage.jsx"
import GamePage4 from "./GamePage4.jsx"
import EmojiRiddle4 from "./EmojiRiddle4.jsx"
import Network from "./network.jsx"
import Cascading from "./cascading.jsx"
import Asymmetric from "./asymmetric.jsx"
import Html from "./html.jsx"
import SecureAccess from "./SecureAccess.jsx"
import Leaderboard from "./Leaderboard.jsx"

// Error handling component
function ErrorFallback({ error }) {
  return (
    <div role="alert" style={{ color: "red", padding: "20px", background: "#fff" }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
  )
}

// Timer utility function
function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0")
  const sec = String(seconds % 60).padStart(2, "0")
  return `${min}:${sec}`
}

// Timer display component
function TimerDisplay({ seconds }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 25,
        top: 10,
        zIndex: 2000,
        fontFamily: "'Orbitron', 'Oswald', 'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        fontSize: "1.6rem",
        color: "#fff",
        letterSpacing: "2px",
        textShadow: `0 0 2px #fff, 0 0 4px #fff`,
      }}
    >
      ⏳ {formatTime(seconds)}
    </div>
  )
}

// Defines the order of pages for game logic
const PAGE_ORDER = ["home", "game4", "emoji4", "network", "cascading", "asymmetric", "html", "secure", "leaderboard"]

// Main App Component
function App() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState("home")
  const [timer, setTimer] = useState(600)
  const [timerActive, setTimerActive] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)
  const [userData, setUserData] = useState({ name: "", department: "" })
  const timerRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
    const loadAssets = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(loadAssets)
  }, [])

  const showTimer =
    PAGE_ORDER.indexOf(page) >= PAGE_ORDER.indexOf("game4") && PAGE_ORDER.indexOf(page) <= PAGE_ORDER.indexOf("secure")

  useEffect(() => {
    if (timerActive && showTimer && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, showTimer, timer])

  useEffect(() => {
    if (timer === 0 && timerActive) setTimerActive(false)
  }, [timer, timerActive])

  const handleStartGame = (user) => {
    setUserData(user)
    setTimer(600)
    setTimerActive(true)
    setPage("game4")
  }

  const handleCompleteSecureAccess = () => {
    setTimeTaken(600 - timer)
    setTimerActive(false)
    setPage("leaderboard")
  }

  if (!isClient || isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#000",
        }}
      >
        <h1 style={{ color: "#fff" }}>Loading WebVerse...</h1>
      </div>
    )
  }

  const sharedProps = {
    timer,
    TimerDisplay: showTimer ? <TimerDisplay seconds={timer} /> : null,
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {(() => {
        switch (page) {
          case "home":
            return <HomePage onNext={handleStartGame} />
          case "game4":
            return <GamePage4 {...sharedProps} onNext={() => setPage("emoji4")} />
          case "emoji4":
            return <EmojiRiddle4 {...sharedProps} onNext={() => setPage("network")} />
          case "network":
            return <Network {...sharedProps} onNext={() => setPage("cascading")} />
          case "cascading":
            return <Cascading {...sharedProps} onNext={() => setPage("asymmetric")} />
          case "asymmetric":
            return <Asymmetric {...sharedProps} onNext={() => setPage("html")} />
          case "html":
            return <Html {...sharedProps} onNext={() => setPage("secure")} />
          case "secure":
            return <SecureAccess {...sharedProps} onNext={handleCompleteSecureAccess} />
          case "leaderboard":
            return <Leaderboard timeTaken={timeTaken} userData={userData} />
          default:
            return <div style={{ color: "#fff", padding: "20px" }}>404: Page Not Found</div>
        }
      })()}
    </ErrorBoundary>
  )
}

export default App
