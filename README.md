# 🌱 Beanstalk Web Portal

**Financial literacy platform — Angular web app**

The Beanstalk web portal is used by course providers and financial educators
to manage their content, mentor profiles, and student engagement.

## Features
- **Course management** — create and manage financial literacy course content
- **Educator profiles** — mentor/educator account management
- **Student dashboard** — view learner progress and engagement
- **Rewards management** — create and manage badge/reward programs
- **Real-time chat** — communicate with enrolled students
- **Analytics** — track course completion and quiz performance

## Tech stack
- Angular 13 (upgrade to 19 recommended — see UPGRADE_NOTES.md)
- PrimeNG component library
- Bootstrap 5
- Socket.io for real-time chat
- TypeScript 4.5

## Getting started

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env

# Run dev server
npm start
# → http://localhost:4200
```

## Recommended upgrade
This repo currently runs Angular 13. Before adding major new features,
upgrade to Angular 19 using `ng update`. See `UPGRADE_NOTES.md`.

## Project structure
```
src/app/
  core/
    auth/           # Authentication, guards, interceptors
    account/        # Account management
    dispensary/     # Course provider services (rename → course-provider)
  modules/
    dashboard/      # Main portal dashboard
    deals/          # Rewards management (rename → rewards)
    dispensary-profile/   # Course provider profile (rename → educator-profile)
    onboarding/     # New educator onboarding
    chat/           # Real-time messaging
    auth/           # Sign in / sign up / reset password
  layout/           # Header, sidebar, shell
  shared/           # Shared modules, PrimeNG imports
```
