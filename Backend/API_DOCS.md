# API Reference — CaterSearch Backend

## MongoDB Schema

```js
// models/Caterer.js
{
  name:          String,   // required, max 100 chars
  location:      String,   // required, max 150 chars
  pricePerPlate: Number,   // required, min 0
  cuisines:      [String], // required, min 1 item
  rating:        Number,   // required, 0–5
  createdAt:     Date,     // auto (timestamps)
  updatedAt:     Date,     // auto (timestamps)
}
```

---

## Sample API Responses

### GET /api/caterers — 200 OK

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Spice Garden Catering",
      "location": "Mumbai, Maharashtra",
      "pricePerPlate": 650,
      "cuisines": ["North Indian", "Mughlai", "Punjabi"],
      "rating": 4.7,
      "createdAt": "2026-03-13T07:26:37.000Z",
      "updatedAt": "2026-03-13T07:26:37.000Z"
    },
    {
      "id": "65f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Coastal Delights",
      "location": "Goa",
      "pricePerPlate": 850,
      "cuisines": ["Seafood", "Goan", "Mediterranean"],
      "rating": 4.5,
      "createdAt": "2026-03-13T07:26:37.000Z",
      "updatedAt": "2026-03-13T07:26:37.000Z"
    }
  ]
}
```

---

### GET /api/caterers/:id — 200 OK

```json
{
  "success": true,
  "data": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Spice Garden Catering",
    "location": "Mumbai, Maharashtra",
    "pricePerPlate": 650,
    "cuisines": ["North Indian", "Mughlai", "Punjabi"],
    "rating": 4.7,
    "createdAt": "2026-03-13T07:26:37.000Z",
    "updatedAt": "2026-03-13T07:26:37.000Z"
  }
}
```

### GET /api/caterers/:id — 404 Not Found

```json
{
  "success": false,
  "message": "Caterer not found with id: 65f1a2b3c4d5e6f7a8b9c0d9"
}
```

---

### POST /api/caterers — 201 Created

**Request Body:**
```json
{
  "name": "The Royal Feast",
  "location": "Delhi, NCR",
  "pricePerPlate": 1200,
  "cuisines": ["Continental", "Indian", "Chinese"],
  "rating": 4.9
}
```

**Response:**
```json
{
  "success": true,
  "message": "Caterer created successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d3",
    "name": "The Royal Feast",
    "location": "Delhi, NCR",
    "pricePerPlate": 1200,
    "cuisines": ["Continental", "Indian", "Chinese"],
    "rating": 4.9,
    "createdAt": "2026-03-13T07:30:00.000Z",
    "updatedAt": "2026-03-13T07:30:00.000Z"
  }
}
```

### POST /api/caterers — 422 Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name",         "message": "Name is required" },
    { "field": "pricePerPlate","message": "Price per plate must be a positive number" },
    { "field": "rating",       "message": "Rating must be a number between 0 and 5" }
  ]
}
```

---

## Postman Examples

### Collection: CaterSearch API

#### 1. Health Check
- **Method:** GET
- **URL:** `{{base_url}}/`
- **Expected:** 200 with `"message": "🍽️  Catering Search Platform API is running"`

#### 2. Get All Caterers
- **Method:** GET
- **URL:** `{{base_url}}/api/caterers`

#### 3. Get Caterer by ID
- **Method:** GET
- **URL:** `{{base_url}}/api/caterers/{{caterer_id}}`

#### 4. Create Caterer (Valid)
- **Method:** POST
- **URL:** `{{base_url}}/api/caterers`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Nawabi Nights",
  "location": "Lucknow, Uttar Pradesh",
  "pricePerPlate": 900,
  "cuisines": ["Awadhi", "Mughlai"],
  "rating": 4.7
}
```

#### 5. Create Caterer (Invalid — trigger validation)
- **Method:** POST
- **URL:** `{{base_url}}/api/caterers`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "",
  "pricePerPlate": -10,
  "cuisines": [],
  "rating": 6
}
```
- **Expected:** 422 with validation errors array

#### Environment Variables (Postman)
```
base_url = http://localhost:5000
caterer_id = <paste an ID from GET /api/caterers response>
```

---

## Example .env Files

### backend/.env
```env
PORT=5000
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/catering?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
