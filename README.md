# Talentra - AI-Powered Recruitment Ecosystem

Talentra is a comprehensive, full-stack recruitment platform designed to streamline the hiring process for both candidates and employers. It leverages modern technologies and AI to provide a premium, efficient, and user-friendly experience.

## 🏗️ Architecture

The project is divided into two main components:

- **[Frontend (Client)](./client/README.md)**: A modern React-based web application with a premium UI.
- **[Backend (Server)](./server/README.md)**: A robust Node.js/Express API with MongoDB for data persistence and AI integration.

## 🚀 Key Features

- **AI-Powered Matching**: Automated compatibility analysis between candidate profiles and job requirements.
- **Real-time Communication**: Integrated chat and notifications for seamless interaction.
- **Interview Management**: Comprehensive system for scheduling and tracking interviews.
- **Secure Authentication**: OTP-based signup and login with Google OAuth integration.
- **Resume Parsing & Management**: Secure storage and handling of professional documents.
- **Payment Integration**: Subscription-based plans for employers via Razorpay.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19, Vite
- **State Management**: Redux Toolkit, Zustand
- **Styling**: Tailwind CSS, Lucide Icons, Material UI
- **Communication**: Socket.io-client, Axios

### Backend
- **Runtime**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **AI**: Google Generative AI (Gemini)
- **Storage**: Cloudinary (Media), Local (Uploads)
- **Security**: JWT, bcryptjs, Passport.js (OAuth)
- **Utilities**: PDFKit (Resume generation), Winston (Logging)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)
- Cloudinary Account (For image storage)
- Google Cloud Console Credentials (For Google Auth)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Talentra
   ```

2. **Setup the Server**:
   ```bash
   cd server
   npm install
   # Create a .env file based on the provided environment variables
   npm run dev
   ```

3. **Setup the Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 🚥 Scripts

### Server
- `npm run dev`: Starts the backend with ts-node-dev (hot reload).
- `npm run build`: Compiles TypeScript to JavaScript.
- `npm start`: Runs the compiled production build.

### Client
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the production bundle.
- `npm run preview`: Previews the production build locally.

---
Built with ❤️ by the Talentra Team
