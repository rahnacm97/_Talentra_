# Talentra - Modern Recruitment Platform (Frontend)

Talentra is a feature-rich recruitment platform designed to bridge the gap between talented candidates and top-tier employers. Built with performance, scalability, and user experience in mind.

## Features

### For Candidates
- **Professional Profiles**: Build and manage your career profile, experience, and certifications.
- **Resume Management**: Securely upload and manage resumes (PDF/DOCX supported).
- **Job Discovery**: Advanced job browsing with location and type filters.
- **One-Click Apply**: Seamlessly apply to jobs using saved or new resumes.
- **AI Matching**: Get compatibility scores for jobs based on your profile skills.

### For Employers
- **Job Management**: Create, edit, and manage job listings effortlessly.
- **Applicant Tracking**: Track applications through various stages (Applied, Interview, Offer, etc.).
- **Interview Scheduling**: Integrated meeting and interview management system.
- **Company Branding**: Manage company profile, logo, and benefits.

### Core Architecture
- **OTP Authentication**: Secure signup and login flow with email verification.
- **Real-time Engine**: Interactive features powered by Socket.io.
- **State Management**: Robust state handling using Redux Toolkit.
- **Responsive Design**: Premium UI built with Tailwind CSS and Framer Motion.

## Tech Stack

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons), Material UI (Select components)
- **State**: Redux Toolkit (State), Zustand (Lightweight store)
- **Networking**: Axios (API), Socket.io-client (Real-time)
- **Validation**: Zod (Schema validation)
- **UI Feedback**: React Toastify, Lucide Icons

## 📁 Project Structure

```text
src/
├── api/          # Axios instance and API service definitions
├── app/          # Central Redux store configuration
├── components/   # Reusable UI components (Job, Auth, Common, etc.)
├── features/     # Redux slices and domain-specific logic
├── hooks/        # Custom React hooks (auth, initializers, etc.)
├── layout/       # Page layout wrappers
├── pages/        # Main route-level components
├── services/     # External services (AI, Socket)
├── shared/       # Shared constants, enums, and types
├── thunks/       # Async Redux operations
└── utils/        # Helper functions and formatters
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Build and Deployment
Build the production-ready bundle:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```
