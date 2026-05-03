import React, { useState, useEffect } from 'react'
import FormSubmission from './components/FormSubmission'
import SubmissionsList from './components/SubmissionsList'
import styles from './App.module.css'

function App() {
  const [submissions, setSubmissions] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Top-level await equivalent - fetch initial data on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true)
        // Simulate fetching initial state from server
        await new Promise(resolve => setTimeout(resolve, 300))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize app:', error)
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleSubmissionSuccess = (newSubmission) => {
    // Optional chaining and nullish coalescing - safe data access
    const submission = {
      id: newSubmission?.id ?? Math.random().toString(36).substr(2, 9),
      name: newSubmission?.name ?? 'Anonymous',
      email: newSubmission?.email ?? 'no-reply@example.com',
      message: newSubmission?.message ?? '',
      timestamp: newSubmission?.timestamp ?? new Date().toISOString(),
    }
    setSubmissions([submission, ...submissions])
  }

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Form Submission Portal</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={styles.toggleButton}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.gridContainer}>
          <section className={styles.formSection}>
            <FormSubmission onSuccess={handleSubmissionSuccess} isLoading={isLoading} />
          </section>

          <section className={styles.submissionsSection}>
            <SubmissionsList submissions={submissions} />
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Full-Stack SPA Demo | React 18 + Express.js</p>
      </footer>
    </div>
  )
}

export default App
