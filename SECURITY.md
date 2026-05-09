# Security Guide

## Safe Public Repository Rules

- Never commit `.env` or any `.env.*` file other than `.env.example`
- Never commit MongoDB URIs, JWT secrets, encryption keys, OAuth client secrets, email passwords, service account JSON, or deployment tokens
- Only expose public client configuration through `VITE_*` variables

## Required Secret Rotation After Exposure

If secrets were previously pushed to GitHub, rotate them immediately in the external service before doing anything else.

### Rotate now

- MongoDB Atlas database user password, or create a brand-new database user and replace the old one
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- Gmail App Password used for `EMAIL_PASS`
- any deployment tokens or provider API keys that were stored locally

### Usually not secret

- `VITE_GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_ID`

Google client IDs are public identifiers. Rotate only if a related Google client secret was also exposed.

## Recommended Cleanup Workflow

1. Rotate exposed credentials in the provider dashboard
2. Update `.env` locally with the new values
3. Keep only placeholders in `.env.example`
4. Remove tracked secret files from git tracking
5. Purge old secrets from git history before treating the repository as fully clean on GitHub

## Startup Validation

The backend validates these core variables at startup:

- `MONGODB_URI`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

Optional feature variables such as Google OAuth and email credentials produce warnings when missing.
