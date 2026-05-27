# Architecture - ShirtGo

## MERN Stack (Modified)
ShirtGo utilizes a variation of the MERN stack (MongoDB, Express, React, Node.js) with a focus on **SOLID** principles and **Clean Code**.

### 1. Backend (Node.js & Express)
- **Controller-Service-Model Pattern:** Logic is separated into controllers that handle HTTP concerns, models for data structure, and utility functions for cross-cutting concerns.
- **Error Handling:** Centralized middleware handles operational vs. programming errors, ensuring consistent JSON responses.
- **Security:** Passport-less JWT implementation with bcrypt for manual auth and custom fetch logic for Google OAuth.
- **Idempotent Seeding:** A dedicated script ensures the database is initialized to a clean state.

### 2. Frontend (React & TypeScript)
- **Composition over Inheritance:** The UI is built from small, reusable components.
- **Context API:** Global state (Theme, Order lifecycle) is managed through specialized Context Providers, avoiding prop-drilling.
- **Brutalist Design System:** Custom CSS and Tailwind classes implement a bold, high-contrast aesthetic.
- **I18n:** `react-i18next` handles real-time language switching without page reloads.

### 3. Persistence (MongoDB & Mongoose)
- **Schema Validation:** Mongoose models enforce data integrity at the application level.
- **Middleware Hooks:** Pre-save hooks handle sensitive operations like password hashing.
- **Relationships:** ObjectId references connect Orders and Support tickets to Users.
