# 💜 VIVA Web

### Virtual Intelligent Vitality Assistant

> **Every Choice Shapes Your Health.**

VIVA Web powers the backend services, REST APIs, AI Decision Engine, and administrative dashboard for the VIVA ecosystem.

It provides secure APIs for the mobile application while enabling administrators to manage users, analytics, nutrition data, workouts, groceries, notifications, and AI-generated recommendations.

---

# 📖 About

The VIVA Web platform consists of two major components:

- REST API Backend
- Administrative Dashboard

It processes user data, performs intelligent health analysis, communicates with AI services, and delivers personalized recommendations to the mobile application.

---

# 🏗 Architecture

```text
Flutter Mobile
       │
 REST API
       │
 Next.js (Vercel)
       │
 ├── Supabase Auth + Postgres (RLS)
 ├── AI Decision Engine
 ├── Firebase Storage
 └── Firebase Cloud Messaging
```

---

# ✨ Core Modules

## 🔐 Authentication

- JWT Authentication
- Session Management
- Role-Based Access Control
- Secure API Access

---

## 👥 User Management

- Users
- Profiles
- Health Goals
- Health Assessment
- Account Management

---

## 🍽 Nutrition Management

- Nutrition Database
- Meal Records
- Food Categories
- Nutrition Analysis

---

## 🏋 Workout Management

- Workout Library
- Exercise Categories
- User Activity Logs

---

## 💰 Expense Management

- Expense Categories
- Spending Reports
- Budget Analysis

---

## 🛒 Grocery Management

- Pantry Inventory
- Grocery Lists
- Healthy Alternatives

---

## 🧠 Decision Engine

Evaluates:

- Nutrition
- Exercise
- Spending
- Goal Progress
- Daily Habits
- Historical Data

Generates:

- Decision Score
- Goal Alignment Score
- Health Investment Index
- AI Recommendations

---

## 🤖 AI Services

Supports:

- OpenAI
- Google Gemini

Responsibilities:

- Recommendation Generation
- Nutrition Analysis
- Decision Support
- Health Insights

---

## 📊 Analytics Dashboard

- User Statistics
- Daily Activity
- Monthly Reports
- Decision Trends
- Goal Progress
- System Analytics

---

## 🔔 Notifications

- Push Notifications
- Scheduled Notifications
- Weekly Reports
- Goal Reminders

---

# 🛠 Technology Stack

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Motion animations

## Backend & Data

- Next.js Route Handlers + Server Actions
- Supabase Postgres + Row Level Security
- Supabase Auth

## Storage & Notifications

- Firebase Storage
- Firebase Cloud Messaging

## AI

- OpenAI API
- Google Gemini API

## Deployment

- Vercel

---

# 🚀 Quick Start

See [SETUP.md](./SETUP.md) for tools, environment variables, Supabase, Firebase, and Vercel.

```bash
npm install
copy .env.example .env.local
npm run dev
```

---

# 📂 Project Structure

```text
src/
├── app/
│   ├── api/
│   ├── auth/
│   ├── dashboard/
│   └── login/
├── components/
├── lib/
│   ├── firebase/
│   └── supabase/
└── proxy.ts
supabase/
└── schema.sql
```

---

# 🔗 API Modules

- Authentication API
- Users API
- Goals API
- Nutrition API
- Workout API
- Expense API
- Grocery API
- Pantry API
- Decision Engine API
- AI Recommendation API
- Reports API
- Notification API

---

# 🚀 Future Features

- AI Health Dashboard
- Research Analytics
- OCR Processing Service
- Meal Recognition API
- Smart Grocery Engine
- Predictive Health Analysis
- Wearable Integrations

---

# 📄 License

Academic and research purposes.
