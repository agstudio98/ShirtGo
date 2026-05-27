# Software Requirements Specification (SRS) - ShirtGo

## 1. Introduction
ShirtGo is a modern e-commerce platform specializing in promotional clothing. It connects users with featured deals from various supermarket chains and branches, providing a streamlined "brutalist" shopping experience.

## 2. Overall Description
The system consists of a React frontend and a Node.js/Express backend, using MongoDB for data persistence. It focuses on speed, simplicity, and a bold visual identity.

## 3. System Features
### 3.1 User Management
- User registration and authentication (JWT-based).
- Profile management (name, email, shipping address).
- Financial data storage (encrypted/simulated payment card).
- Google OAuth integration for quick access.

### 3.2 Product Catalog
- Browse featured deals on the landing page.
- Full catalog access with pagination.
- Category and branch-based filtering.

### 3.3 Order Processing
- Seamless checkout flow for authenticated users.
- Simulated real-time delivery tracking (Order Lifecycle: Confirming -> Searching -> Matched -> Delivering).
- Order history retrieval.

### 3.4 Customer Support
- Category-based support ticket submission.
- Instant automated responses for common inquiries.
- Ticket history for registered users.

## 4. Non-Functional Requirements
- **Design:** High-contrast Brutalist aesthetic.
- **Performance:** Deterministic data generation for large catalogs to minimize server load.
- **Maintainability:** Adherence to SOLID and Clean Code principles.
- **Internationalization:** Full support for Spanish (ES) and English (EN).
