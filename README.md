# InterviewAI — AI-Powered Interview Preparation

> Turn a job description and your experience into a focused interview preparation plan.

**🚀 Live Demo:** [Try InterviewAI](https://interview-prep-ai-khaki-eight.vercel.app/)

InterviewAI is a full-stack web application powered by Google Gemini that helps candidates prepare for job interviews. It analyzes a candidate's resume or self-description against a job description, generates a structured preparation report, highlights skill gaps, and creates a job-tailored, ATS-friendly resume as a downloadable PDF.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Run Locally](#run-locally)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Future Improvements](#future-improvements)

## Features

- **AI-Generated Interview Strategy:** Generates a role-specific interview preparation report using a job description and candidate information.
- **Job-Match Score:** Provides a score from 0–100 to help candidates assess their alignment with a target role.
- **Technical Interview Questions:** Generates technical questions, explains the interviewer's intent, and provides guidance on structuring answers.
- **Behavioral Interview Questions:** Generates behavioral questions, explains what they assess, and suggests key points to cover.
- **Skill-Gap Analysis:** Identifies missing or weaker skills and categorizes their severity as low, medium, or high.
- **Day-Wise Preparation Roadmap:** Creates a structured preparation plan with daily focus areas and actionable tasks.
- **Tailored Resume PDF:** Uses AI-generated HTML and Puppeteer to create a downloadable resume tailored to a job description.
- **User Authentication:** Supports registration, login, logout, and authenticated report access.
- **Saved Reports:** Stores interview reports in MongoDB so users can revisit their previous preparation plans.

## How It Works

1. Create an account or sign in.
2. Enter the target job description.
3. Upload a PDF resume and/or provide a self-description, depending on the form's validation requirements.
4. The frontend sends the candidate information and job description to the backend.
5. The backend calls Google Gemini and validates the expected structured response.
6. The interview report is saved in MongoDB and displayed in the frontend.
7. Generate a tailored resume PDF from a saved report when needed.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, SCSS, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| AI | Google Gemini API via `@google/genai` |
| Input Processing | `pdf-parse`, Multer |
| Structured AI Output | Zod, `zod-to-json-schema` |
| PDF Generation | Puppeteer |
| Authentication | JSON Web Tokens (JWT), HTTP cookies, bcryptjs, token blacklist |

## Project Structure

```text
InterviewAI/
├── Backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
│           └── ai.service.js
├── Frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── features/
│       │   ├── auth/
│       │   └── interview/
│       └── ...
└── README.md
```

## Prerequisites

Install or configure the following before running the project:

- [Node.js](https://nodejs.org/) — An active LTS version is recommended; npm is included.
- [MongoDB Atlas](https://www.mongodb.com/atlas) — A cluster or another MongoDB connection string.
- [Google AI Studio API Key](https://aistudio.google.com/apikey) — For Google Gemini API access.
- [Git](https://git-scm.com/) — Required for cloning the repository.
- [Visual Studio Code](https://code.visualstudio.com/) — Or another code editor.

Verify that Node.js and npm are installed:

```bash
node -v
npm -v
```

## Run Locally

The frontend and backend run in separate terminals. Keep both terminals open while testing.

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd InterviewAI
```

Alternatively, extract the project archive and open the folder containing `Backend` and `Frontend` in your code editor.

### 2. Configure Backend Environment Variables

Create a file named `Backend/.env`:

```dotenv
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

See [Environment Variables](#environment-variables) for details. Never commit this file to GitHub.

### 3. Install and Start the Backend

Open Terminal 1:

```bash
cd Backend
npm install
npm run dev
```

The backend uses port `3000` locally. Check the terminal for the server startup message and `Connected to Database`.

### 4. Install and Start the Frontend

Open Terminal 2:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

If the frontend uses a configurable API base URL, create `Frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Restart the Vite development server after changing environment variables.

### 5. Build the Frontend

Verify that the frontend can be bundled for production:

```bash
cd Frontend
npm run build
```

Vite writes the production build to `Frontend/dist/`.

## Environment Variables

| Variable | Used By | Purpose |
|---|---|---|
| `MONGO_URI` | Backend | MongoDB connection string, including the database host and database name. |
| `JWT_SECRET` | Backend | Secret used to sign and verify authentication tokens. |
| `GOOGLE_GENAI_API_KEY` | Backend | API key used for Google Gemini requests. |
| `PORT` | Backend | Port assigned by the hosting platform, such as Render. |
| `VITE_API_BASE_URL` | Frontend | Backend base URL used by the browser. |

**Security reminder:** Never expose `MONGO_URI`, `JWT_SECRET`, or `GOOGLE_GENAI_API_KEY` in frontend code. Variables prefixed with `VITE_` are browser-visible and must not contain secrets.

## API Reference

All endpoints below are relative to the backend base URL, such as `http://localhost:3000`.

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a user with username, email, and password. |
| `POST` | `/api/auth/login` | Public | Log in with email and password. |
| `GET` | `/api/auth/logout` | Public | Clear the login cookie and blacklist the token. |
| `GET` | `/api/auth/get-me` | Authenticated | Return the current user's details. |

### Interview Reports and Resume PDF

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/interview/` | Authenticated | Generate and save an interview preparation report. Accepts multipart form data. |
| `GET` | `/api/interview/` | Authenticated | List the current user's saved reports. |
| `GET` | `/api/interview/report/:interviewId` | Authenticated | Retrieve a saved interview report. |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Authenticated | Generate and download a tailored resume PDF. |

For report generation, the frontend sends `jobDescription`, `selfDescription`, and a `resume` file field when a PDF resume is supplied. The backend upload middleware configures an in-memory upload limit of 3 MB. The report-generation route requires authentication.

## Production Deployment

The intended hosting arrangement is:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **AI Provider:** Google Gemini API

Before deploying, verify the following:

1. **Backend Port:** The Express server listens on `process.env.PORT || 3000` so Render can assign the production port.
2. **Production CORS:** Configure CORS to allow the deployed Vercel frontend origin and credentials. Do not leave production restricted to `http://localhost:5173`.
3. **Backend Environment:** Add `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_GENAI_API_KEY` to Render's environment-variable settings.
4. **Frontend API URL:** Set `VITE_API_BASE_URL` in Vercel to the deployed Render service URL, without adding API endpoint paths to the base URL.
5. **Cookie Settings:** Verify that authentication cookies support production HTTPS and cross-site requests when the frontend and backend use different origins.
6. **MongoDB Network Access:** Allow the deployed backend to connect to Atlas using the narrowest practical network access policy.
7. **PDF Generation:** Verify that Puppeteer can launch Chromium in the selected Render environment. Configure a compatible deployment setup if browser executables or system dependencies are unavailable.

After deployment, test registration, login, the `get-me` endpoint, report generation, report retrieval, and resume PDF downloads from the public frontend.

## Troubleshooting

| Symptom | What to Check |
|---|---|
| `querySrv ECONNREFUSED` | Confirm the Atlas hostname in `MONGO_URI`, test DNS resolution, and check the backend's network connection. |
| MongoDB authentication failure | Verify the database username and password, URL-encode special characters in the password, and check database permissions. |
| `401 Unauthorized` | Log in again and verify JWT configuration and cookie transmission. |
| CORS error | Ensure the backend allows the exact frontend origin and credentials. Do not use a wildcard origin with credentialed cookies. |
| Gemini `503 UNAVAILABLE` | Check model availability and backend logs, then retry after a temporary provider issue. |
| Gemini `401` or `403` | Check the API key, API access, quota, and configured model in `Backend/src/services/ai.service.js`. |
| Resume PDF generation fails | Check backend logs and Puppeteer/Chromium compatibility in the deployment environment. |
| Frontend still calls localhost after deployment | Set `VITE_API_BASE_URL` in Vercel and rebuild or redeploy the frontend. |

## Security Notes

- Keep `.env` files, API keys, database credentials, JWT secrets, and credential exports out of Git.
- Rotate credentials that have accidentally been shared or committed.
- Use a unique, strong `JWT_SECRET` in production and keep it stable across restarts.
- Restrict MongoDB network access as much as your hosting setup permits.
- Treat uploaded resumes and generated reports as sensitive personal data. Avoid using real users' private documents while debugging public deployments.
- Add appropriate request validation, rate limiting, and error handling before making the application broadly available.

## Future Improvements

- Add automated tests for authentication and interview report generation.
- Implement resilient retries and backoff for temporary AI-provider errors.
- Add rate limiting and stronger validation for uploaded files and text inputs.
- Improve production logging and user-facing error messages.
- Add project screenshots and a short product walkthrough.

---

Built with React, Node.js, MongoDB, and Google Gemini.

**[🚀 Try the Live Demo](https://interview-prep-ai-khaki-eight.vercel.app/)**
