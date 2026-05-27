# ShirtGo - Promotional Clothing Platform

ShirtGo is a high-performance e-commerce platform built with the MERN stack, featuring a unique brutalist design and a focus on promotional deals.

## Key Features
- **Brutalist UI:** A bold, high-contrast visual experience.
- **Fast Auth:** Email/Password and Google OAuth integration.
- **Live Tracking:** Interactive simulated map for order deliveries.
- **Multilingual:** Real-time translation between Spanish and English.
- **Robust Backend:** Annotated code following SOLID and Clean Code standards.

## Project Structure
- `frontend/`: React + TypeScript + Vite.
- `backend/`: Node.js + Express + Mongoose.
- `docs/`: Comprehensive technical and project management documentation.

## Documentation Index
1. [Setup & Installation](docs/3-development/setup.md)
2. [Software Requirements (SRS)](docs/1-requirements/srs.md)
3. [System Architecture](docs/2-design/arquitectura.md)
4. [API Endpoints](docs/3-development/api-docs.md)
5. [Database Models](docs/3-development/database.md)

## Quick Start
```bash
# Install dependencies
cd backend && pnpm install
cd ../frontend/ShirtGo && pnpm install

# Seed and Start Backend
cd ../../backend
pnpm run seed
pnpm start

# Start Frontend
cd ../frontend/ShirtGo
pnpm run dev
```

## Engineering Standards
This project strictly adheres to:
- **SOLID Principles**
- **Clean Code**
- **AAA Testing Pattern**
- **JSDoc Documentation**
