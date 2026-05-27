# Database Models - ShirtGo

## 1. User
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `profileImage` (String, base64/url)
- `address` (String)
- `paymentCard` (Object)
  - `number`, `expiry`, `cvv`, `type`
- `role` (Enum: user, admin)

## 2. Product
- `name` (String, required)
- `description` (String, required)
- `price` (Number, required)
- `category` (String, required)
- `stock` (Number, default 0)
- `imageUrl` (String, required)

## 3. Order
- `user` (ObjectId ref User)
- `products` (Array)
  - `product` (ObjectId ref Product)
  - `quantity` (Number)
- `total` (Number)
- `paymentMethod` (String)
- `status` (Enum: pending, shipped, delivered, cancelled)
- `tracking` (Object)
  - `riderId`, `currentLocation`

## 4. Support
- `user` (ObjectId ref User, optional)
- `email` (String, required)
- `message` (String, required)
- `response` (String)
- `status` (Enum: open, closed)

## 5. Branch
- `name` (String)
- `address` (String)
- `city` (String)
- `chain` (String)
