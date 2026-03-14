# 🍽️ CaterersNearMe — Catering Search & Booking Platform

A full-stack catering discovery and booking platform built with the **MERN** stack. Search and filter professional caterers by name, city, cuisine, price, and dish — browse profiles, compare menus, and place orders with a modern dark-mode UI.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [API Documentation](#-api-documentation)
- [Optimization Techniques](#-optimization-techniques)
- [Technology Stack](#-technology-stack)
- [Installation Guide](#-installation-guide)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables Setup](#-environment-variables-setup)
- [Project Folder Structure](#-project-folder-structure)
- [Usage Instructions](#-usage-instructions)
- [Best Practices and Important Notes](#-best-practices-and-important-notes)

---

## 📖 Project Overview

**CaterersNearMe** is a catering marketplace that connects event organizers with professional caterers. Users can:

- **Discover** caterers by name, city, area, cuisine type, or specific dish
- **Filter** results by budget (price per plate)
- **View** detailed caterer profiles with galleries, menus, and contact info
- **Add menus** to a cart and place orders with event details
- **Partner** as caterers — register, manage profile, add menus, and receive orders

The backend follows **MVC** with JWT auth (HTTP-only cookies), express-validator, and centralized error handling. The frontend is a Vite + React SPA with lazy loading and a responsive dark-theme UI.

---

## ✨ Key Features

### For Users (Event Organizers)

| Feature | Description |
|---------|-------------|
| **Advanced Search** | Search by name, city, area, cuisine, dish, or service type. Full-text regex across caterer and menu fields. |
| **Budget Filter** | Quick-filter chips for price caps: All, &lt; ₹500, &lt; ₹1,000, &lt; ₹2,000, &lt; ₹5,000 |
| **Quick Filters** | One-click cuisine chips: North Indian, South Indian, Chinese, Mughlai, Jain, Veg, Non-Veg, etc. |
| **Caterer Cards** | Compact cards with image, rating, price, location, cuisines. Click to view full profile. |
| **Caterer Profile** | Full profile with gallery, about section, menus (name, price, dishes), cuisines, service areas, contact. |
| **Cart** | Add multiple menus to cart. Adjust guest count with slider. Continue browsing while cart is open. |
| **Checkout** | Enter event details (name, phone, email, date, location, instructions). Place orders per caterer. |
| **Auth** | Register and log in. Session persisted via HTTP-only cookie. Protected dashboard route. |

### For Caterers (Partners)

| Feature | Description |
|---------|-------------|
| **Registration** | Create a partner account with name, email, password, and business details. |
| **Profile Management** | Update name, location, city, phone, description, cuisines, services, areas served, images. |
| **Menu CRUD** | Add, edit, and delete menus. Each menu: name, type (Veg/Non-Veg/Jain), price, dishes. |
| **Image Upload** | ImageKit integration for profile and gallery images. |
| **Order Management** | View incoming orders. Update status: Pending → Confirmed → Completed / Cancelled. |
| **Dashboard** | Central hub for profile and menu management. |

### Technical Features

- **Debounced Search** — 350ms debounce to avoid excessive API calls while typing
- **Slug-based URLs** — SEO-friendly caterer URLs (`/caterer/my-caterer-name`)
- **Dual Auth** — Separate JWT cookies for users (`token`) and caterers (`catererToken`)
- **Responsive Design** — Mobile-first with Tailwind breakpoints

---

## 📡 API Documentation

**Base URL:** `http://localhost:5000/api` (or your backend URL)

### Response Format

All responses follow a consistent envelope:

```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

### Auth APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Log in user |
| POST | `/api/auth/logout` | Private | Log out (clears cookie) |
| GET | `/api/auth/me` | Private | Get current user |

**Register/Login body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

---

### Caterer APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/caterers` | Public | Get all caterers |
| GET | `/api/caterers/search?q=&maxPrice=` | Public | Search caterers |
| GET | `/api/caterers/slug/:slug` | Public | Get caterer by slug or ID |
| GET | `/api/caterers/:id` | Public | Get caterer by ID |
| POST | `/api/caterers` | Public | Create caterer (admin/legacy) |
| PUT | `/api/caterers/profile` | Caterer | Update caterer profile |

**Search query params:**
- `q` — Search term (name, city, cuisine, dish, etc.)
- `maxPrice` — Max price per plate (number)

**Caterer auth (partner portal):**
- POST `/api/caterers/register`
- POST `/api/caterers/login`
- POST `/api/caterers/logout`
- GET `/api/caterers/me` (protected)

---

### Menu APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/menus/caterer/:catererId` | Public | Get all menus for a caterer |
| POST | `/api/menus` | Caterer | Create menu |
| PUT | `/api/menus/:id` | Caterer | Update menu |
| DELETE | `/api/menus/:id` | Caterer | Delete menu |

**Create/Update menu body:**
```json
{
  "menuName": "Premium Vegetarian",
  "description": "Best veg options",
  "type": "Veg",
  "price": 450,
  "dishes": ["Pav Bhaji", "Pani Puri", "Dal Makhani"]
}
```

---

### Order APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | User | Place order(s) |
| GET | `/api/orders/caterer` | Caterer | Get orders for caterer |
| PUT | `/api/orders/:id/status` | Caterer | Update order status |

**Order body (POST):**
```json
{
  "customerName": "John Doe",
  "customerPhone": "+91 9876543210",
  "customerEmail": "john@example.com",
  "eventDate": "2026-04-15",
  "eventLocation": "Mumbai",
  "guestCount": 100,
  "specialInstructions": "No onion/garlic",
  "catererId": "caterer_id",
  "catererName": "Spice Garden",
  "menuId": "menu_id",
  "menuName": "Premium Veg",
  "pricePerPerson": 450
}
```

**Status values:** `Pending`, `Confirmed`, `Completed`, `Cancelled`

---

### Upload API (ImageKit)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/upload/auth` | Public | Get ImageKit auth params for client-side upload |

---

## ⚡ Optimization Techniques

| Technique | Implementation |
|-----------|----------------|
| **Lazy Loading** | React `lazy()` and `Suspense` for route-level code splitting. Pages (Caterers, Login, Register, Dashboard, CatererProfile, etc.) load on demand, reducing initial bundle size. |
| **Debounced Search** | 350ms debounce on search input to limit API calls while typing. |
| **Skeleton UI** | Loading skeletons for caterer cards instead of blank space during fetch. |
| **useMemo / useCallback** | Memoized pagination and search logic to avoid unnecessary re-renders. |
| **MongoDB Indexes** | `_id` and `slug` used for fast lookups. Search uses `$regex` with `$options: 'i'`. |
| **Vite Build** | ES modules, tree-shaking, and optimized production build. |
| **Axios Instance** | Single `api` instance with base URL and `withCredentials` for cookie-based auth. |
| **Context Optimization** | Separate `AuthContext`, `CatererAuthContext`, and `CartContext` to scope re-renders. |

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 3 |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB, Mongoose 8 |
| **Auth** | JWT (jsonwebtoken), bcryptjs, HTTP-only cookies |
| **Validation** | express-validator |
| **Image Upload** | ImageKit |
| **Dev Tools** | ESLint, Nodemon |

---

## 📦 Installation Guide

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### Step 1: Clone the repository

```bash
git clone <your-repo-url>
cd task
```

### Step 2: Install Backend dependencies

```bash
cd Backend
npm install
```

### Step 3: Install Frontend dependencies

```bash
cd ../Frontend
npm install
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd Backend
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd Frontend
cp .env.example .env
# Ensure VITE_API_BASE_URL points to your backend API
npm run dev
```

The app runs at `http://localhost:5173`.

### 3. Seed Sample Data (optional)

```bash
cd Backend
node seed.js
```

Or use the custom seeder:

```bash
node scripts/seedDummyCaterers.js
```

---

## 🔐 Environment Variables Setup

### Backend (`.env` in `Backend/`)

Create `Backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/catering?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=30d

# CORS - Frontend URL for cookie credentials
FRONTEND_URL=http://localhost:5173

# ImageKit (optional - for image uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### Frontend (`.env` in `Frontend/`)

Create `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, set this to your deployed backend URL (e.g. `https://api.caterersnearme.com/api`).

> ⚠️ **Never commit `.env` files.** They are in `.gitignore`.

---

## 📁 Project Folder Structure

```
task/
├── Backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # User auth (register, login, logout)
│   │   ├── catererAuthController.js # Caterer auth
│   │   ├── catererController.js    # Caterer CRUD, search, profile
│   │   ├── menuController.js       # Menu CRUD
│   │   └── orderController.js      # Orders (create, list, status)
│   ├── middleware/
│   │   ├── authMiddleware.js   # protect, protectCaterer
│   │   ├── errorHandler.js    # Global error handler
│   │   └── validate.js        # express-validator rules
│   ├── models/
│   │   ├── Caterer.js
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── catererRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── uploadRoutes.js
│   ├── scripts/
│   │   └── seedDummyCaterers.js
│   ├── seed.js
│   ├── server.js              # Express app entry
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── CartSidebar.jsx
│   │   │   ├── CatererCard.jsx
│   │   │   ├── CatererModal.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── MenuManager.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriceFilter.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProtectedCatererRoute.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── CatererAuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Caterers.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── caterer/
│   │   │       ├── CatererDashboard.jsx
│   │   │       ├── CatererLogin.jsx
│   │   │       ├── CatererProfile.jsx
│   │   │       └── CatererRegister.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios instance + helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Tailwind base
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Usage Instructions

### Running the app

1. Start the backend:

   ```bash
   cd Backend && npm run dev
   ```

2. Start the frontend:

   ```bash
   cd Frontend && npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173)

### Main flows

- **Browse caterers:** `/caterers` — search, filter, click cards
- **View profile:** Click **View Full Profile** → `/caterer/:slug`
- **Add to cart:** Select menus, adjust guest count, add more while cart is open
- **Checkout:** **Proceed to Checkout** → fill event details → place order
- **Partner:** **Partner with us** → Register → Login → Dashboard → manage profile & menus

### Build for production

```bash
cd Frontend
npm run build
```

Output is in `Frontend/dist/`. Serve with any static host (Vercel, Netlify, etc.).

---

## 📌 Best Practices and Important Notes

1. **Auth cookies**
   - Users and caterers use separate cookies (`token` vs `catererToken`).
   - Always use `withCredentials: true` in axios for CORS + cookies.

2. **CORS**
   - `FRONTEND_URL` must match the origin that calls the API.
   - In production, use your frontend domain (e.g. `https://caterersnearme.com`).

3. **JWT secret**
   - Use a strong random string (≥32 chars) in production.
   - Never commit `JWT_SECRET` to version control.

4. **MongoDB**
   - Use MongoDB Atlas for cloud hosting.
   - Ensure IP allowlist or `0.0.0.0/0` if deploying backend to a cloud service.

5. **Orders**
   - One order per caterer per menu. Multiple menus → multiple orders.
   - Order creation requires user auth (`protect` middleware).

6. **ImageKit**
   - Optional. Without keys, ImageKit uploads will fail; profile text works.
   - Get credentials from [imagekit.io](https://imagekit.io).

7. **Slug generation**
   - Caterer slugs are auto-generated from `name` on save.
   - Duplicate slugs get a random suffix.

---

## 📄 License

MIT © 2026 CaterersNearMe
