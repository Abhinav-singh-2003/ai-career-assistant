# AI Career & Interview Assistant

An AI-powered career preparation platform that helps job seekers improve their resumes, compare their skills with job descriptions, and practice job interviews with personalized feedback.

## Features

- **User Authentication:** Register and log in securely using JWT authentication and password hashing.
- **Resume Analysis:** Upload a PDF resume, extract its text, and receive AI-generated feedback.
- **Job Description Matching:** Compare a resume against a target job description to identify matching skills, missing skills, and improvement suggestions.
- **AI Interview Practice:** Generate interview questions based on a target job role.
- **Answer Evaluation:** Submit interview answers and receive AI-generated scores, strengths, improvement suggestions, and example answers.
- **Dashboard:** View resume counts, job match counts, interview sessions, and average interview answer scores.
- **Protected APIs:** Restrict access to authenticated users and their own data.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- TypeScript
- REST APIs
- JWT and bcryptjs
- Multer
- PDF text extraction

**Database and AI**
- MongoDB
- Mongoose
- OpenAI API

## Project Structure

```text
ai-career-assistant/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── validators/
│   │   └── server.ts
│   ├── uploads/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── .env
│   └── package.json
└── README.md
```

*Note: The structure above describes the intended organization. Update it if your actual folders differ.*

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB, either locally or through MongoDB Atlas
- An OpenAI API key

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ai-career-assistant
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
OPENAI_API_KEY=your_openai_api_key
```

Replace the example values with your own configuration. Keep this file private and never commit API keys or secrets to GitHub.

Start the backend development server:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5000
```

The root endpoint can be used to check whether the API is running.

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal, typically `http://localhost:5173`.

## API Overview

The backend provides REST API endpoints for the following operations:

| Feature | Endpoint | Method |
|---|---|---|
| Register | `/api/auth/register` | POST |
| Login | `/api/auth/login` | POST |
| Get user profile | `/api/users/profile` | GET |
| Upload resume | `/api/resumes` | POST |
| List my resumes | `/api/resumes/my` | GET |
| Analyze resume | `/api/resumes/:id/analyze` | POST |
| Match resume to job | `/api/job-matches` | POST |
| Generate interview | `/api/interviews/generate` | POST |
| Submit interview answer | `/api/interviews/:id/answer` | POST |
| List interview sessions | `/api/interviews/my` | GET |
| Get dashboard statistics | `/api/dashboard/stats` | GET |

Protected endpoints require a valid JWT access token, generally sent using the `Authorization: Bearer <token>` header.

## How It Works

1. A user creates an account and logs in.
2. The user uploads a PDF resume.
3. The backend extracts text from the PDF and stores the resume information in MongoDB.
4. The AI service analyzes the resume and provides feedback.
5. The user submits a job description to identify matching and missing skills.
6. The user generates interview questions for a target role and submits answers for evaluation.
7. The dashboard displays available preparation statistics.

## Security Notes

- Store credentials and API keys in environment variables.
- Do not commit `.env` files or uploaded resumes to the repository.
- Validate uploaded files and user inputs on the server.
- Protect private endpoints with authentication and ownership checks.
- Avoid exposing sensitive information in API responses or logs.

## Future Improvements

- Interview history and detailed performance analytics.
- Resume and job-match report history.
- Automated backend and frontend tests.
- Improved file validation and rate limiting.
- Responsive UI enhancements and accessibility improvements.
- Deployment with production environment configuration.

## Learning Outcomes

This project demonstrates practical experience with:

- Full-stack development using React and Node.js.
- Building REST APIs with Express and TypeScript.
- MongoDB data modeling with Mongoose.
- Authentication and authorization with JWT.
- PDF upload and text extraction.
- Integrating an AI API into a web application.
- Managing asynchronous API requests and errors.

## Author

**Your Name**

- GitHub: YOUR_GITHUB_PROFILE_URL
- LinkedIn: YOUR_LINKEDIN_PROFILE_URL

---

*Built as a full-stack portfolio project to explore AI-powered career preparation tools.*