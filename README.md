# Full-Stack SPA Application

A modern single-page application demonstrating the request-response cycle with a React 18 frontend and Node.js/Express backend.

## Project Structure

```
.
├── frontend/          # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/           # Node.js + Express API
│   ├── server.js
│   └── package.json
└── package.json       # Workspace root
```

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, CSS Modules
- **Backend**: Node.js 20+, Express.js
- **Data Storage**: File system (JSON Lines format)
- **Build Tool**: Vite (HMR-enabled development)

## Features

- ✅ Modern ES2021+ features (optional chaining, nullish coalescing, top-level await)
- ✅ Modular React components with hooks (useState, useEffect)
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Request-response cycle with data persistence
- ✅ Clean, maintainable code architecture

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Servers

Start both frontend and backend concurrently:

```bash
npm run dev
```

Or start them individually:

```bash
npm run frontend    # React dev server (http://localhost:5173)
npm run backend     # Express server (http://localhost:3000)
```

### Build for Production

```bash
npm run build
npm run preview
```

## API Endpoints

- **POST /api/submit** — Submit form data
  - Body: `{ name, email, message }`
  - Response: `{ success, id, timestamp, message }`
- **GET /api/submissions** — Retrieve all submissions
- **GET /health** — Server health check

## Data Persistence

Form submissions are persisted to `backend/data.txt` in JSON Lines format (one entry per line), auto-created on first submission.

## Development Notes

- React components use functional components with hooks
- CSS Modules prevent style conflicts across components
- Optional chaining and nullish coalescing used throughout for safe data access
- CORS enabled for localhost:5173 ↔ localhost:3000 communication
