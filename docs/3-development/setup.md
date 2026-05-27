# Setup Guide - ShirtGo

## Prerequisites
- Node.js (v18+)
- MongoDB (Running on port 27012 or as configured in .env)
- pnpm (Recommended)

## Backend Setup
1. `cd backend`
2. `pnpm install`
3. Create `.env` file:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://127.0.0.1:27012/dbShirtGo
   JWT_SECRET=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. `pnpm run seed` (Initializes sample data)
5. `pnpm start`

## Frontend Setup
1. `cd frontend/ShirtGo`
2. `pnpm install`
3. `pnpm run dev`

## Running Tests
`cd backend && pnpm test`
