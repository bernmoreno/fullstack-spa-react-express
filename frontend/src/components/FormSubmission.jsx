import React, { useState } from 'react'
import FormInput from './FormInput'
import styles from './FormSubmission.module.css'

function FormSubmission({ onSuccess, isLoading, isStaticMode = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    // Optional chaining and nullish coalescing for safe validation
    const name = formData?.name?.trim() ?? ''
    const email = formData?.email?.trim() ?? ''
    const message = formData?.message?.trim() ?? ''

    if (!name) return 'Name is required'
    if (!email) return 'Email is required'
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format'
    if (!message) return 'Message is required'
    if (message.length < 10) return 'Message must be at least 10 characters'

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      let data = null

      if (isStaticMode) {
        data = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData?.name ?? '',
          email: formData?.email ?? '',
          message: formData?.message ?? '',
          timestamp: new Date().toISOString(),
        }
      } else {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message ?? 'Failed to submit form')
        }
      }

      // Success: reset form and notify parent
      setSuccess(true)
      onSuccess(data)
      setFormData({ name: '', email: '', message: '' })

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      // Optional chaining for error message extraction
      setError(err?.message ?? 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Submit Your Message</h2>
      {isStaticMode && (
        <div className={styles.successMessage}>
          ℹ️ Running in static mode: submissions are saved in this browser.
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>✓ Message submitted successfully!</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormInput
          label="Name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message (at least 10 characters)"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={styles.textarea}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Message'}
        </button>
      </form>
    </div>
  )
}

export default FormSubmission
