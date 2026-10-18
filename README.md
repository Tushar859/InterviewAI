# InterviewAI — AI-Powered Interview Preparation

> Turn a job description and your experience into a focused interview preparation plan.

InterviewAI is a full-stack web application that uses Google Gemini to help candidates prepare for job interviews. It analyzes a candidate's resume or self-description against a job description, generates a structured preparation report, highlights skill gaps, and can create a job-tailored, ATS-friendly resume as a downloadable PDF.

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

- **AI-generated interview strategy:** Uses a job description and candidate information to create a role-specific report.
- **Job-match score:** Provides a score from 0–100 to help candidates assess alignment with the target role.
- **Technical interview questions:** Generates questions with the interviewer's intent and guidance for structuring an answer.
- **Behavioral interview questions:** Generates behavioral questions, explains what they assess, and suggests key points to cover.
- **Skill-gap analysis:** Identifies missing or weaker skills and categorizes their severity as low, medium, or high.
- **Day-wise preparation roadmap:** Produces a structured plan with daily focus areas and actionable tasks.
- **Tailored resume PDF:** Uses AI-generated HTML and Puppeteer to create a downloadable resume tailored to a job description.
- **User authentication:** Supports registration, login, logout, and authenticated report access.
- **Saved reports:** Stores interview reports in MongoDB so users can revisit previous preparation plans.

## How It Works

1. Create an account or sign in.
2. Add the target job description.
3. Upload a PDF resume and/or provide a self-description, as supported by the current form validation.
4. InterviewAI sends the candidate information and job description to the backend.
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
| Input processing | `pdf-parse`, Multer |
| Structured AI output | Zod, `zod-to-json-schema` |
| PDF generation | Puppeteer |
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

Install or create the following before running the project:

- [Node.js](https://nodejs.org/) (an active LTS version is recommended; npm is included)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or another MongoDB connection string
- [Google AI Studio API key](https://aistudio.google.com/apikey)
- [Git](https://git-scm.com/) (optional for local use, required for the GitHub-based deployment workflow)
- [VS Code](https://code.visualstudio.com/) or another editor

Check Node.js and npm are installed:

```bash
node -v
npm -v
```

## Run Locally

The frontend and backend run in separate terminals. Keep both terminals open while testing.

### 1. Clone or open the project

If the repository is on GitHub:

```bash
git clone <YOUR_REPOSITORY_URL>
cd InterviewAI
```

Otherwise, extract the project archive and open the folder containing `Backend` and `Frontend` in VS Code.

### 2. Configure the backend environment

Create a file named `Backend/.env`:

```dotenv
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

See [Environment Variables](#environment-variables) for details. Do not commit this file.

### 3. Install and start the backend

In Terminal 1:

```bash
cd Backend
npm install
npm run dev
```

The backend currently uses port `3000` locally. On startup, check the terminal for the server message and `Connected to Database`.

### 4. Configure and start the frontend

In Terminal 2:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

If the frontend uses a configurable API base URL, create `Frontend/.env.local` with:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Restart the Vite server after changing frontend environment variables.

### 5. Build the frontend

To verify that the frontend can be bundled for production:

```bash
cd Frontend
npm run build
```

Vite writes the production build to `Frontend/dist/`.

## Environment Variables

| Variable | Used by | Purpose |
|---|---|---|
| `MONGO_URI` | Backend | MongoDB connection string, including the database host and database name |
| `JWT_SECRET` | Backend | Secret used to sign and verify login tokens |
| `GOOGLE_GENAI_API_KEY` | Backend | API key used for Gemini requests |
| `PORT` | Backend hosting platform | Port assigned by a host such as Render; the server should listen on `process.env.PORT` in production |
| `VITE_API_BASE_URL` | Frontend | Backend base URL used by the browser, for example `http://localhost:3000` locally or the deployed Render service URL in production |

**Never expose `MONGO_URI`, `JWT_SECRET`, or `GOOGLE_GENAI_API_KEY` in frontend code.** Only variables prefixed with `VITE_` should be considered browser-visible; never store secrets in them.

## API Reference

All paths below are relative to the backend base URL, such as `http://localhost:3000`.

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a user (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Log in with email and password |
| `GET` | `/api/auth/logout` | Public | Clear the login cookie and blacklist the token |
| `GET` | `/api/auth/get-me` | Authenticated | Return the current user's details |

### Interview Reports and Resume PDF

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/interview/` | Authenticated | Generate and save an interview preparation report; accepts multipart form data |
| `GET` | `/api/interview/` | Authenticated | List the current user's saved reports |
| `GET` | `/api/interview/report/:interviewId` | Authenticated | Retrieve one saved report |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Authenticated | Generate and download a tailored resume PDF |

For the report-generation endpoint, the frontend sends `jobDescription`, `selfDescription`, and a `resume` file field when a PDF resume is supplied. The backend upload middleware configures an in-memory upload limit of 3 MB. The current route requires authentication.

## Production Deployment

The intended hosting arrangement is:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **AI provider:** Google Gemini API

Before deploying, confirm these items in the code and hosting dashboards:

1. **Backend port:** The Express server listens on `process.env.PORT || 3000` so Render can assign the production port.
2. **Production CORS:** Configure CORS to allow the deployed Vercel frontend origin and credentials. Do not leave production restricted to `http://localhost:5173`.
3. **Backend environment:** Add `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_GENAI_API_KEY` in the Render environment-variable settings.
4. **Frontend API URL:** Set `VITE_API_BASE_URL` in Vercel to the deployed Render service URL (without adding API endpoint paths to the base URL).
5. **Cookie settings:** Because the frontend and backend will be hosted on different origins, verify that authentication cookies are configured appropriately for production HTTPS and cross-site requests.
6. **MongoDB network access:** Allow the deployed backend to reach Atlas. Use the narrowest practical access policy supported by your hosting setup; avoid leaving broad public access enabled unnecessarily.
7. **PDF generation:** Verify Puppeteer can launch Chromium in the selected Render environment. If the browser executable or system dependencies are unavailable, configure a compatible deployment setup before relying on resume PDF generation.

After deploying, test registration, login, `get-me`, report generation, report retrieval, and resume PDF download from the public frontend.

## Troubleshooting

| Symptom | What to check |
|---|---|
| `querySrv ECONNREFUSED` | Confirm the Atlas hostname in `MONGO_URI`; test DNS resolution and the network used by the backend |
| MongoDB authentication failure | Verify the Atlas database username/password, URL-encode special characters in the password, and confirm the user has suitable database permissions |
| `401 Unauthorized` | Log in again; verify the JWT secret has not changed between requests and that the browser sends cookies with credentials enabled |
| CORS error | Ensure the backend allows the exact frontend origin and credentials; do not use a wildcard origin with credentialed cookies |
| Gemini `503 UNAVAILABLE` | This can indicate temporary model overload; retry later, check the chosen model's availability, and inspect the backend log |
| Gemini `401` or `403` | Check the API key, API access, quota, and the model configured in `Backend/src/services/ai.service.js` |
| Resume PDF generation fails | Check the backend logs and Puppeteer/Chromium compatibility in the deployment environment |
| Frontend still calls localhost after deployment | Set `VITE_API_BASE_URL` in Vercel and rebuild/redeploy the frontend |

## Security Notes

- Keep `.env` files, API keys, database credentials, JWT secrets, and credential exports out of Git.
- Rotate any credentials that have accidentally been shared or committed.
- Use a unique, strong `JWT_SECRET` in production and keep it stable across restarts.
- Restrict MongoDB network access as much as your hosting setup permits.
- Treat uploaded resumes and generated reports as sensitive personal data. Do not upload real users' private documents while debugging public deployments.
- Add appropriate request validation, rate limiting, and error handling before making the application broadly available.

## Future Improvements

- Add automated tests for authentication and report generation.
- Add resilient retries/backoff for temporary AI-provider errors.
- Add request rate limiting and robust validation for uploaded files and text inputs.
- Add production-grade cookie settings, centralized logging, and user-facing error messages.
- Add screenshots, a live demo URL, and a short product walkthrough after deployment.

---

Built with React, Node.js, MongoDB, and Google Gemini.
