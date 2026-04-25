# AI Complaint Analyzer System

An intelligent, AI-powered customer complaint management system. Automatically analyze sentiment, prioritize issues, and gain insights from customer feedback using Google Gemini 1.5 Flash.

## 🚀 Key Features

- **🔐 Secure Authentication**: Email-based Magic Link authentication via Auth.js.
- **🤖 AI Integration**: Automatic sentiment analysis, priority assignment, and summarization of complaints using Gemini AI.
- **📊 Real-time Dashboard**: Interactive charts (Chart.js) showing complaint status breakdown and priority distribution.
- **🔎 Advanced Management**: CRUD operations with pagination, full-text search, and status/priority filtering.
- **🛡️ Security First**:
    - Input validation using **Zod**.
    - Sanitized data handling.
    - Protected API routes and middleware.
    - XSS protection and environment variable management.

## 🧱 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: MySQL with Prisma ORM
- **Auth**: Auth.js (v5)
- **State Management**: React Query (TanStack)
- **AI**: Google Gemini 1.5 Flash
- **Testing**: Vitest (Unit)

## 🛠️ Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Configure `DATABASE_URL` in `.env` and run migrations:
   ```bash
   npx prisma generate
   # Manual DDL might be required depending on your MySQL version
   ```

3. **Environment Variables**:
   Update `.env` with your Gemini API key and SMTP settings.
   DATABASE_URL=""
   AUTH_SECRET=""
   GOOGLE_GENERATIVE_AI_API_KEY=Your Google Api Key

   EMAIL_SERVER_HOST=your email host
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your email username
   EMAIL_SERVER_PASSWORD=your email password
   EMAIL_FROM=your email sent address name

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

- **Unit Tests**: `npm test` (Powered by Vitest)

## 🔒 Security Notes
This project adheres to best practices:
- Middleware for session protection.
- Zod schema validation for all API inputs.
- Safe SQL queries via Prisma.
- Environment variables for all sensitive keys.

---
Built by **Karthik Raj** for the AI AnalyserTech Assignment.
