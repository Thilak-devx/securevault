# SecureVault

SecureVault is a premium secure notes application built with React, Tailwind CSS, Node.js, Express, and MongoDB. It combines a polished dark UI with practical security features like JWT authentication, Google OAuth, password-protected notes, email-based password reset, and encrypted note storage.

## Features

- JWT authentication with protected frontend and backend routes
- Google OAuth sign-in
- Password-protected notes with unlock and recovery flow
- Forgot password flow with email reset
- AES-encrypted notes at rest
- Per-user notes with ownership checks
- Real-time search and pinned notes
- Toast notifications, loading states, and polished empty states
- Responsive premium UI with mascot-based branding

## Tech Stack

- React
- Tailwind CSS
- Node.js
- Express
- MongoDB Atlas / Mongoose
- Axios
- JWT
- Google OAuth
- Nodemailer

## Screenshots

Add your product screenshots here once deployed.

- Login screen
- Notes dashboard
- Locked note flow
- Settings / danger zone

Example:

```md
![Login Screenshot](./screenshots/login.png)
![Dashboard Screenshot](./screenshots/dashboard.png)
```

## Live Demo

- Frontend: `https://your-frontend-domain.com`
- Backend API: `https://your-backend-domain.com/api`

Replace these with your deployed URLs.

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

### 3. Configure environment variables

Create a `.env` file in the project root using [`.env.example`](C:/Users/2026/Desktop/secure-notes-app/.env.example) as a guide.

Minimum required values:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

PORT=5000
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secure-notes-app?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
ENCRYPTION_KEY=your-strong-encryption-key

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 4. Run the backend

```bash
npm start
```

### 5. Run the frontend

In a second terminal:

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

## Production Notes

- Set `VITE_API_BASE_URL` to your deployed backend URL
- Set `CLIENT_URL` / `FRONTEND_URL` to your deployed frontend URL
- Use MongoDB Atlas in production
- Use strong secrets for `JWT_SECRET` and `ENCRYPTION_KEY`
- Use a Gmail App Password for `EMAIL_PASS`
- Make sure Google OAuth authorized origins and redirect settings match your deployed domain

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

## Security Highlights

- Passwords hashed with bcrypt
- JWT secret and expiry controlled through environment variables
- Backend route protection with JWT middleware
- Input validation and sanitization with express-validator
- Login and forgot-password rate limiting
- AES encryption for note content
- Hashed per-note passwords for locked notes

## Brand Assets

- App icon / favicon: [public/secure-notes-icon.svg](C:/Users/2026/Desktop/secure-notes-app/public/secure-notes-icon.svg)
- Circular owl logo component: [SecureVaultLogo.jsx](C:/Users/2026/Desktop/secure-notes-app/src/components/SecureVaultLogo.jsx)
- Mascot component: [SecureMascot.jsx](C:/Users/2026/Desktop/secure-notes-app/src/components/SecureMascot.jsx)

## Roadmap Ideas

- Shareable secure note links
- Rich text editor
- Tags and folders
- Audit log / note history
- Two-factor authentication

## License

Add your preferred license here.
