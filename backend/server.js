import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES2021+ Features: Top-level await and const assertions
const app = express()
const PORT = process.env.PORT ?? 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data.txt')

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Utility function: Write data to file with error handling
const saveSubmission = async (data) => {
  // ES2021+: Optional chaining and nullish coalescing
  const id = data?.id ?? Math.random().toString(36).substr(2, 9)
  const timestamp = data?.timestamp ?? new Date().toISOString()

  const submission = {
    id,
    name: data?.name ?? 'Anonymous',
    email: data?.email ?? '',
    message: data?.message ?? '',
    timestamp,
  }

  return new Promise((resolve, reject) => {
    const dataLine = JSON.stringify(submission) + '\n'
    fs.appendFile(DATA_FILE, dataLine, (err) => {
      if (err) {
        reject(new Error(`Failed to save submission: ${err.message}`))
      } else {
        resolve(submission)
      }
    })
  })
}

/**
 * POST /api/submit
 * Accepts form data and persists to file
 */
app.post('/api/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      })
    }

    // Save to file
    const submission = await saveSubmission({ name, email, message })

    return res.status(201).json({
      success: true,
      id: submission.id,
      timestamp: submission.timestamp,
      message: 'Form submitted successfully',
    })
  } catch (error) {
    console.error('Error processing submission:', error)
    return res.status(500).json({
      success: false,
      message: error?.message ?? 'Internal server error',
    })
  }
})

/**
 * GET /api/submissions
 * Retrieve all submissions
 */
app.get('/api/submissions', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json({ success: true, submissions: [] })
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    const submissions = data
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line)
        } catch (err) {
          console.warn('Failed to parse submission line:', line)
          return null
        }
      })
      .filter(Boolean)

    res.json({
      success: true,
      submissions,
      count: submissions.length,
    })
  } catch (error) {
    console.error('Error retrieving submissions:', error)
    res.status(500).json({
      success: false,
      message: error?.message ?? 'Failed to retrieve submissions',
    })
  }
})

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'Express.js API',
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  })
})

// Top-level await: Start server
try {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║     Express.js Server Running                ║
║     http://localhost:${PORT}                    ║
║     Data persisted to: backend/data.txt      ║
║     CORS enabled for localhost:5173          ║
╚══════════════════════════════════════════════╝
    `)
  })
} catch (error) {
  console.error('Failed to start server:', error)
  process.exit(1)
}
