<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563eb,100:0ea5e9&height=200&section=header&text=VerdexAI&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=AI-Powered%20Recruitment%20Platform&descAlignY=60&descSize=20" width="100%"/>
</div>

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Montserrat&weight=600&size=24&center=true&vCenter=true&width=700&lines=AI-Powered+Recruitment+Platform;Smart+CV+Parsing+%26+Candidate+Scoring;Interview+Scheduling+%26+Assessment+Engine;Built+with+Next.js+%7C+Express+%7C+MongoDB+%7C+OpenAI" alt="Typing SVG" />
</div>

<br/>

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-verdexai--official.vercel.app-2563eb?style=for-the-badge)](https://verdexai-official.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-mibrahim--O2-181717?style=for-the-badge&logo=github)](https://github.com/mibrahim-O2)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-muhammad--ibrahim--o2-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/muhammad-ibrahim-o2)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)]()

</div>

<br/>

<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11ea-908a-139a6edaec5c.gif" width="100%"/>
</div>

---

<div align="center">

VerdexAI is a full-stack AI-powered recruitment platform built as a personal project to explore and implement real world AI integrations, modern full-stack architecture, and end-to-end software delivery. It transforms the traditional hiring process by automating CV analysis, candidate scoring, assessment testing, and interview scheduling all within a single, clean platform.

***This is a self-learning and personal portfolio project, not affiliated with any institution or organization.***

<div align="center">
  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11ea-908a-139a6edaec5c.gif" width="100%"/>
</div>

</div>

---
<div align="center">

**[🌍Live Application →](https://verdexai-official.vercel.app)**&ensp;|&ensp;**[Go to Documentation →](./UserGuide.md)**

![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![Backend](https://img.shields.io/badge/backend-railway-blueviolet?style=flat-square)
![Frontend](https://img.shields.io/badge/frontend-vercel-black?style=flat-square)

---

### Access

| Role | How to Access |
|------|--------------|
| HR / Recruiter | Contact the developer |
| Candidate | Register directly on the platform |

---

</div>

<div align="center">
  
## Features

<table>
<tr>
<td width="50%">

<div align="center">
  
### Candidate

</div> 

- Sign up and browse open positions
- Apply with PDF resume upload
- AI parses CV and extracts structured profile
- Receive assessment test invitations
- Take timed MCQ tests with proctoring
- View detailed test results with answer review
- See scheduled interview details with meeting link
- Track application status and onboarding progress

</td>
<td width="50%">

<div align="center">
  
### HR / Recruiter

</div>

- Post and manage job listings
- View candidates ranked by AI match score
- Read AI-extracted skills, experience, education
- Send assessment tests (AI-generated per job)
- Schedule interviews with date, platform, meeting link
- Candidate receives automatic email notification
- Finalize hire and track onboarding steps
- Real-time dashboard with pipeline stats

</td>
</tr>
</table>

</div>

### Admin
- Platform-wide stats overview
- Manage HR accounts (activate / suspend)
- View total candidates, jobs, applications

---

<div align="center">

## Tech Stack

![Next.js](https://img.shields.io/badge/-Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/-Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![OpenAI](https://img.shields.io/badge/-OpenAI_GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![Railway](https://img.shields.io/badge/-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Vercel](https://img.shields.io/badge/-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

<div align="center">
  
## Architecture

</div>

```text
                             ┌─────────────────────────────────────────────────────────────────┐
                             │                   Frontend — Vercel                             │
                             │          Next.js 15 App Router + Tailwind CSS 4                 │
                             │   Landing · Auth · Candidate Dashboard · HR Dashboard · Admin   │
                             └──────────────────────────┬──────────────────────────────────────┘
                                                        │
                                                  HTTPS REST API
                                                        │ 
                                                        ▼
                             ┌─────────────────────────────────────────────────────────────────┐
                             │                   Backend — Railway                             │
                             │                Express.js + Mongoose                            │
                             │   Auth · Jobs · Applications · Assessment · Pipeline · Admin    │
                             └──────┬──────────────┬────────────────┬────────────────┬─────────┘
                                    │              │                │                │
                                    ▼              ▼                ▼                ▼
                             ┌──────────┐  ┌──────────────┐  ┌────────────┐    ┌───────────────┐
                             │ MongoDB  │  │   Firebase   │  │   OpenAI   │    │ Resend Email  │
                             │  Atlas   │  │ Auth (Admin) │  │ GPT-4o mini│    │     API       │
                             └──────────┘  └──────────────┘  └────────────┘    └───────────────┘
                                                             
```
---

## Project Structure

```text
VerdexAI/
├── frontend/                         # Next.js application
│   ├── app/
│   │   ├── auth/                     # Login, Signup, Forgot Password
│   │   ├── candidate/                # Candidate dashboard, apply, onboarding
│   │   ├── hr/                       # HR dashboard, job posting, pipeline
│   │   ├── admin/                    # Admin dashboard
│   │   └── test/                     # Assessment test engine
│   │
│   ├── components/
│   │   ├── shared/                   # BrandLogo, DashboardShell, etc.
│   │   ├── icons/                    # SVG icon components
│   │   └── ui/                       # StatCard, etc.
│   │
│   └── lib/                          # Firebase client, auth context, config
│
└── backend/                          # Express API server
    └── src/
        ├── config/                   # DB, Firebase Admin, AI (OpenAI)
        ├── middleware/               # Auth verification, role checks
        ├── models/                   # Mongoose schemas
        └── modules/                  # Feature modules
            ├── auth/                 # Firebase token sync
            ├── jobs/                 # Job post CRUD
            ├── applications/         # Apply, rank, status
            ├── assessment/           # Tests, invitations, interviews
            ├── pipeline/             # Hire finalization, onboarding
            ├── admin/                # Platform management
            └── notifications/        # Email via Resend
```
---

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB Atlas account (free tier)
- A Firebase project with Email/Password Auth enabled
- An OpenAI API key
- A Resend account (free tier, for emails)

### Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/mibrahim-O2/verdexai-official.git
cd verdexai-official
```

**2. Install dependencies**
```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

**3. Configure environment**

Create `backend/.env` (use `backend/.env.example` as reference):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
FRONTEND_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"
OPENAI_API_KEY=your-openai-key
RESEND_API_KEY=your-resend-key
EMAIL_TO=your-email@gmail.com
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
```

**4. Run both servers**
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000`

---

## Demo Video

A complete walkthrough of **VerdexAI** – the AI-Powered Recruitment Platform covering the full end-to-end hiring process (Job Posting → AI Resume Parsing → Candidate Matching → Assessment → Final Hiring Decision) is available on YouTube.

**Click the thumbnail below to watch ↓**

[![Watch VerdexAI Demo](https://img.youtube.com/vi/s-M_aoWDOkM/maxresdefault.jpg)](https://youtu.be/s-M_aoWDOkM)

<p align="center">
  <a href="https://youtu.be/s-M_aoWDOkM">
    <img src="https://img.shields.io/badge/Watch%20on-YouTube-red?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch VerdexAI Demo">
  </a>
</p>
 
---
## Documentation

| Document | Description |
|----------|-------------|
| [User Guide](./UserGuide.md) | Complete guide for Candidates, HR, and Admins |
| [Brand Guide](./docs/BRAND_GUIDE.md) | Colors, typography, logo usage |
| [.env.example](./backend/.env.example) | Environment variable reference |

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://verdexai-official.vercel.app |
| Backend | Railway | https://verdexai-official-production.up.railway.app |
| Database | MongoDB Atlas | Cloud (Singapore region) |

---

## Screenshots

> *user guide includes full visual walkthrough.which inclueds:*

| Page | 
|------|
| Landing Page |
| Candidate Dashboard | 
| HR Ranked Candidates | 
| Assessment Test | 
| Interview Scheduling |

 
---

<div align="center">

  ## Developer
  <img src="https://github.com/mibrahim-O2.png" width="100" style="border-radius:50%"/>
  <br/>
  <strong>Muhammad Ibrahim</strong>
  <br/>
  Full Stack & AI Engineer
  <br/><br/>

[![GitHub](https://img.shields.io/badge/GitHub-mibrahim--O2-181717?style=flat-square&logo=github)](https://github.com/mibrahim-O2)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/muhammad-ibrahim-o2)
[![Email](https://img.shields.io/badge/Email-mibrahimkhalid306@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:mibrahimkhalid306@gmail.com)
[![X](https://img.shields.io/badge/X-@MIbraheem__02-000000?style=flat-square&logo=x)](https://x.com/MIbraheem_02)

</div>

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563eb,100:0ea5e9&height=120&section=footer&animation=fadeIn" width="100%"/>
  <br/>
  <sub>Built with focus, curiosity, and a lot of debugging — Muhammad Ibrahim © 2026</sub>
</div>

