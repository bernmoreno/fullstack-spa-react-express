import React from 'react'
import styles from './SubmissionsList.module.css'

function SubmissionsList({ submissions }) {
  // Nullish coalescing for safe array handling
  const displaySubmissions = submissions ?? []

  if (displaySubmissions.length === 0) {
    return (
      <div className={styles.submissionsContainer}>
        <h2 className={styles.heading}>Recent Submissions</h2>
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📋</p>
          <p className={styles.emptyText}>No submissions yet. Submit the form to see messages here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.submissionsContainer}>
      <h2 className={styles.heading}>
        Recent Submissions ({displaySubmissions.length})
      </h2>
      <div className={styles.submissionsList}>
        {displaySubmissions.map(submission => (
          <div key={submission?.id ?? Math.random()} className={styles.submissionCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.name}>{submission?.name ?? 'Anonymous'}</h3>
              <span className={styles.time}>
                {new Date(submission?.timestamp ?? Date.now()).toLocaleString()}
              </span>
            </div>
            <p className={styles.email}>
              <span className={styles.label}>Email:</span>
              <a href={`mailto:${submission?.email}`}>{submission?.email}</a>
            </p>
            <p className={styles.message}>{submission?.message ?? 'No message'}</p>
            <div className={styles.cardFooter}>
              <span className={styles.id}>ID: {submission?.id ?? 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubmissionsList
