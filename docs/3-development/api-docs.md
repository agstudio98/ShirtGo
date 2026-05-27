# API Documentation - ShirtGo

## Base URL: `/api`

### 1. Users
- `POST /users/register`: Create a new account.
- `POST /users/login`: Authenticate and receive JWT.
- `POST /users/google-login`: Authenticate via Google ID Token.
- `GET /users/profile`: Get current user data (Protected).
- `PUT /users/profile`: Update name, email, address, or payment info (Protected).

### 2. Products
- `GET /products`: Retrieve all products (supports simulated catalog).
- `GET /products/:id`: Get details for a specific product.
- `POST /products`: Create a new product (Admin).
- `PUT /products/:id`: Update product info (Admin).
- `DELETE /products/:id`: Remove a product (Admin).

### 3. Orders
- `POST /orders`: Place a new order (Protected).
- `GET /orders`: Get order history for the logged-in user (Protected).
- `GET /orders/:id`: Get specific order details (Protected).

### 4. Support
- `POST /support`: Submit a support ticket (Public/Protected).
- `GET /support/my`: Get tickets submitted by current user (Protected).
- `GET /support`: List all tickets (Admin).

## Response Format
```json
{
  "status": "success",
  "results": 1, // Optional (for lists)
  "data": { ... }
}
```
