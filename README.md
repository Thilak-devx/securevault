# SecureVault

SecureVault is a full-stack secure notes application built with React, Tailwind CSS, Node.js, Express, and MongoDB Atlas. It includes JWT authentication, Google OAuth, locked notes, email-based password reset, and encrypted note storage.

## Features

- JWT authentication with protected frontend and backend routes
- Google OAuth sign-in
- Password-protected notes with unlock and recovery flow
- Forgot password flow with email reset
- Encrypted note storage
- Per-user note ownership enforcement
- Pinned notes, real-time search, and polished dashboard UX

## Tech Stack

- React
- Tailwind CSS
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Axios
- JWT
- Google OAuth
- Nodemailer

## Screenshots

Add product screenshots here after deployment.

## Live Demo

- Frontend: `https://your-frontend-domain.com`
- Backend API: `https://your-backend-domain.com/api`

## Local Setup

### 1. Clone the project

```bash
git clone <your-repo-url>
cd secure-notes-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Copy [`.env.example`](C:/Users/2026/Desktop/secure-notes-app/.env.example) to `.env` and fill in your real values.

```bash
cp .env.example .env
```

Required server values:

```env
MONGODB_URI=mongodb+srv://your-db-user:your-db-password@your-cluster.mongodb.net/secure-notes-app?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-jwt-secret
ENCRYPTION_KEY=replace-with-a-long-random-encryption-key
```

Required frontend-safe values:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Optional feature values:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
PORT=5000
JWT_EXPIRES_IN=1h
```

### 4. Run the backend

```bash
npm start
```

### 5. Run the frontend

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

## Frontend Environment Safety

Only `VITE_*` values are exposed to the client bundle. Never place server secrets in frontend code or in any environment variable that does not need to be public.

Safe public frontend env vars for this project:

- `VITE_API_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID`

Server-only secrets that must never be used client-side:

- `MONGODB_URI`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `EMAIL_PASS`
- any service account keys or deployment tokens

## Security Checklist

- `.env` and other secret files are gitignored
- startup validation fails fast when core server env vars are missing
- only public `VITE_*` vars are used in the frontend
- placeholders live in `.env.example`, never real credentials

## If Secrets Were Previously Exposed

Rotate or regenerate these immediately if they were ever committed publicly:

- MongoDB Atlas database user password or create a brand-new database user
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- Gmail App Password used for `EMAIL_PASS`
- any deployment tokens or API keys that were stored in local env files

Google OAuth client IDs are generally public identifiers, but any Google client secret should be rotated immediately if it was exposed anywhere else.

## Repository Safety Notes

Ignoring files now does not remove them from old Git history. If secrets were previously pushed to GitHub, rotate those credentials in the external services first, then purge the old files from Git history before treating the repository as fully clean.

## API Highlights

### Auth

- `POST /api/register`
- `POST /api/login`
- `POST /api/google-login`
- `POST /api/forgot-password`
- `POST /api/reset-password/:token`
- `DELETE /api/delete-account`

### Notes

- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `POST /api/notes/unlock/:id`
- `POST /api/notes/reset-lock/:id`

## License

Add your preferred license here.
