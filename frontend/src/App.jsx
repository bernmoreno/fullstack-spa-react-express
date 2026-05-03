import React, { useState, useEffect } from 'react'
import FormSubmission from './components/FormSubmission'
import SubmissionsList from './components/SubmissionsList'
import styles from './App.module.css'

const LOCAL_STORAGE_KEY = 'fullstack_spa_submissions'

function App() {
  const [submissions, setSubmissions] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isGithubPages = window?.location?.hostname?.includes('github.io') ?? false

  // Top-level await equivalent - fetch initial data on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true)

        if (isGithubPages) {
          const storedSubmissions = localStorage.getItem(LOCAL_STORAGE_KEY)
          const parsed = JSON.parse(storedSubmissions ?? '[]')
          setSubmissions(Array.isArray(parsed) ? parsed : [])
        } else {
          const response = await fetch('/api/submissions')
          const data = await response.json()
          setSubmissions(data?.submissions ?? [])
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize app:', error)
        setIsLoading(false)
      }
    }

    void initializeApp()
  }, [isGithubPages])

  const handleSubmissionSuccess = (newSubmission) => {
    // Optional chaining and nullish coalescing - safe data access
    const submission = {
      id: newSubmission?.id ?? Math.random().toString(36).substr(2, 9),
      name: newSubmission?.name ?? 'Anonymous',
      email: newSubmission?.email ?? 'no-reply@example.com',
      message: newSubmission?.message ?? '',
      timestamp: newSubmission?.timestamp ?? new Date().toISOString(),
    }

    setSubmissions((prev) => {
      const updated = [submission, ...prev]

      if (isGithubPages) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      }

      return updated
    })
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
            <FormSubmission
              onSuccess={handleSubmissionSuccess}
              isLoading={isLoading}
              isStaticMode={isGithubPages}
            />
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
