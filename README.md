# EcoLens | AI Complaint Analyzer


**EcoLens** is a sophisticated, AI-powered complaint management system built with Next.js 16, designed to automate customer feedback analysis using Google Gemini. It features secure OTP-based authentication, real-time sentiment analysis, and a clean, responsive dashboard.

---

## 🚀 Key Features

- **🔐 Multi-Step Authentication**: Secure registration with Name, Phone, Email, Password, and Gender. Verified via 6-digit OTP delivery.
- **🤖 Gemini 2.5 AI Analysis**: 
  - **Sentiment Detection**: Automatically classifies complaints as POSITIVE, NEUTRAL, or NEGATIVE.
  - **Auto-Priority**: Assigns LOW, MEDIUM, or HIGH priority based on issue urgency.
  - **Smart Summary**: Generates concise one-line summaries for complex descriptions.
- **🛡️ Secure Navigation**: URL-safe Base64 ID masking protects sensitive database identifiers in the browser address bar.
- **📊 Interactive Dashboard**: Visualized complaint statistics using Chart.js.
- **👤 Profile Management**: Personalized user settings for updating contact information.
- **💬 FAQ Chatbot**: Instant support via an intelligent floating chatbot.
- **✨ Premium UI**: Global toast notifications (`sonner`), smooth transitions, and a modern dark/light aesthetic.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [MySQL](https://www.mysql.com/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **AI**: [Google Gemini SDK](https://ai.google.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/) via Brevo SMTP

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 20.9.0 or higher
- MySQL Database

### 2. Installation
```bash
git clone <your-repo-url>
cd tech_assignment
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="mysql://user:password@localhost:3306/complaint_db"
AUTH_SECRET="your-auth-secret"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
EMAIL_SERVER_HOST="smtp-relay.brevo.com"
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-smtp-password"
EMAIL_FROM="noreply@ecolens.com"
```

### 4. Database Migration
```bash
npx prisma db push
```

### 5. Run the Project
```bash
npm run dev
```
Navigate to `http://localhost:3000` to see the application in action.

---

## 🛤️ Project Workflow

1. **Register**: Sign up with your details and verify your email via the 6-digit OTP.
2. **Dashboard**: Access your personalized dashboard to track ongoing complaints.
3. **Analyze**: Create a new complaint; our AI will instantly categorize and prioritize it.
4. **Resolve**: Update complaint status or manage your profile settings.

---

## 📄 License
This project is for technical assessment purposes.

---
Built with ❤️ by **Karthik Raj N**.
