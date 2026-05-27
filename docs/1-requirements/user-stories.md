# User Stories - ShirtGo

## US1: User Authentication
**As a** customer, **I want to** register and log in to the platform, **so that** I can save my preferences and track my orders.
- **Acceptance Criteria:**
  - Secure password hashing using bcrypt.
  - JWT token generation upon successful login.
  - Option to log in via Google OAuth.

## US2: Browse Catalog
**As a** user, **I want to** view a paginated list of products, **so that** I can find promotional clothing without being overwhelmed.
- **Acceptance Criteria:**
  - 6 items per page.
  - Filter by category (Shirts, Pants, Hoodies).
  - Filter by branch/supermarket location.

## US3: Purchase Flow
**As a** registered user, **I want to** buy a product with one click from the "Top Deals" section, **so that** I can complete my purchase quickly.
- **Acceptance Criteria:**
  - Verify shipping address and payment method before confirmation.
  - Modal dialog showing order status transitions.

## US4: Delivery Tracking
**As a** buyer, **I want to** see a real-time simulation of my delivery, **so that** I know when my package is arriving.
- **Acceptance Criteria:**
  - Interactive map showing rider movement.
  - Dynamic status updates (Matched -> Delivering).

## US5: Support Tickets
**As a** user (guest or registered), **I want to** send inquiries to support, **so that** I can resolve issues with my orders.
- **Acceptance Criteria:**
  - Automated response based on selected category.
  - Registered users can see their ticket history.
