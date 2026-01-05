# Personal Injury Frontend

This is the **frontend application** for a Personal Injury Management system built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit Query**.  
The app is **fully Dockerized**, making it production-ready for deployment.

---

## Features

- User authentication and registration
- Email verification workflow
- Dashboard for patients, appointments, and documents
- Admin panel for providers, appointment types, settings
- Responsive design for mobile and desktop
- Fully Dockerized for deployment consistency
- RTK Query integration for API calls

---

## Tech Stack

- **Next.js 16** (App Router + Turbopack)
- **TypeScript**
- **React 18**
- **Tailwind CSS**
- **Redux Toolkit Query**
- **Docker** (multi-stage build)

---

---

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- npm >= 10.x
- Docker (for containerized builds)

---

### Running Locally (Development)

```bash
git clone https://github.com/Clarity-MedLegal/PI-frontend
cd personal-injury-frontend
npm install
npm run dev
Open http://localhost:3000 in your browser.

### Docker Setup

Build Docker Image

From your project root:

docker build -t personal-injury-frontend .

Run Docker Container
docker run -p 3000:3000 personal-injury-frontend


Open http://localhost:3000 in your browser.


