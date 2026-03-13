# 🍽️ CaterSearch — Catering Search Platform

A full-stack catering discovery platform built with the **MERN** stack. Search and filter professional caterers by name, price, cuisine, and rating — with a clean, modern UI.

![Tech Stack](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Running Locally](#running-locally)
- [Seeding the Database](#seeding-the-database)
- [Deployment](#deployment)

---

## Project Overview

CaterSearch lets users browse caterers from a MongoDB-backed REST API, search by name, and filter by maximum price per plate. The backend follows MVC architecture with request validation and centralized error handling. The frontend is a Vite + React SPA with a fully responsive, dark-mode UI.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Backend   | Node.js, Express.js, Mongoose, MongoDB |
| Validation| express-validator                       |
| Frontend  | React 18, Vite, Tailwind CSS v3         |
| HTTP      | Axios                                   |
| Routing   | React Router DOM v6                     |
| Hosting   | Render (backend) + Vercel (frontend)    |

---

## Folder Structure

```
task/
├── backend/
│   ├── config/
│   │   └── db.js               # Mongoose connection
│   ├── controllers/
│   │   └── catererController.js# Route logic (MVC)
│   ├── middleware/
│   │   ├── validate.js          # express-validator rules
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   └── Caterer.js           # Mongoose schema
│   ├── routes/
│   │   └── catererRoutes.js     # Express router
│   ├── seed.js                  # Sample data seeder
│   ├── server.js                # Application entry point
│   ├── .env                     # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CatererCard.jsx  # Individual caterer card
    │   │   ├── SearchBar.jsx    # Name search input
    │   │   └── PriceFilter.jsx  # Price cap filter buttons
    │   ├── pages/
    │   │   └── Caterers.jsx     # Main caterer listing page
    │   ├── services/
    │   │   └── api.js           # Axios API service layer
    │   ├── App.jsx              # React Router setup
    │   ├── main.jsx             # React entry point
    │   └── index.css            # Global Tailwind styles
    ├── index.html
    ├── tailwind.config.js
    ├── .env
    └── package.json
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/catering?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files.** Both `.env` files are already in `.gitignore`.

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint            | Description            | Body Required |
|--------|---------------------|------------------------|---------------|
| GET    | `/caterers`         | Get all caterers       | —             |
| GET    | `/caterers/:id`     | Get caterer by ID      | —             |
| POST   | `/caterers`         | Create a new caterer   | ✅ JSON body  |

### POST Body Schema

```json
{
  "name": "Spice Garden Catering",
  "location": "Mumbai, Maharashtra",
  "pricePerPlate": 650,
  "cuisines": ["North Indian", "Mughlai"],
  "rating": 4.7
}
```

### Response Envelope

All responses follow:

```json
{
  "success": true,
  "count": 8,
  "data": [ ... ]
}
```

---

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task
```

### 2. Setup the Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your MONGO_URI
npm install
npm run dev       # Starts on http://localhost:5000
```

### 3. Seed the Database (optional)

```bash
cd backend
node seed.js
```

This inserts 8 sample caterers into MongoDB.

### 4. Setup the Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # Starts on http://localhost:5173
```

Open [http://localhost:5173/caterers](http://localhost:5173/caterers) in your browser.

---

## Deployment

### Backend → Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service**.
3. Connect your GitHub repo, select the `backend` folder as root.
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables: `MONGO_URI`, `PORT=10000`, `FRONTEND_URL=<your-vercel-url>`
7. Deploy. Copy your Render URL (e.g. `https://cater-api.onrender.com`).

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**.
2. Import your GitHub repo, set root to `frontend`.
3. Framework preset: **Vite**
4. Add environment variable: `VITE_API_BASE_URL=https://cater-api.onrender.com/api`
5. Deploy. Your app is live!

---

## License

MIT © 2026 CaterSearch
"# caterersnearme" 
