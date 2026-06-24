# 🌍 Geo Dashboard

A full-stack geospatial dashboard application for visualizing and managing geographic data such as polygons, entities, and administrative boundaries.

This project demonstrates modern web development practices including JWT authentication, RESTful APIs, PostgreSQL/PostGIS integration, and interactive GIS visualization using OpenLayers.

![Vue](https://img.shields.io/badge/Vue-3.x-42b883)
![Vite](https://img.shields.io/badge/Vite-Frontend-646cff)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![PostGIS](https://img.shields.io/badge/PostGIS-Spatial-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![OpenLayers](https://img.shields.io/badge/OpenLayers-Map-red)

---

## 📸 Screenshots

| Login Page                        | Dashboard                        |
| --------------------------------- | -------------------------------- |
| ![](./screenshots/login-page.png) | ![](./screenshots/dashboard.png) |

### Boundary Highlight

![](./screenshots/boundary-highlight.png)

---

## ⭐ Key Highlights

- Built with Vue 3, OpenLayers, Express.js, PostgreSQL, and PostGIS
- Implemented JWT authentication and protected routes
- Developed REST APIs for geospatial data retrieval
- Visualized GeoJSON polygons and administrative boundaries
- Integrated spatial queries using PostGIS

## 🚀 Features

### 🔐 Authentication & Security

- JWT-based authentication
- Protected API endpoints
- User login/logout functionality
- Persistent session using Local Storage
- Route protection using Vue Router Guards
- Password hashing with bcrypt

### 🗺️ Geospatial Visualization

- Interactive map powered by OpenLayers
- Polygon and administrative boundary rendering
- GeoJSON integration
- Boundary highlighting and auto zoom
- Dynamic map layer management
- Spatial visualization from PostGIS data

### 📊 Data Management

- Filter by Kabupaten
- Filter by Kecamatan
- Filter by Desa
- Dynamic data loading
- Real-time API integration
- Spatial data retrieval from PostgreSQL/PostGIS

### 🎨 Dashboard

- Responsive dashboard layout
- User profile dropdown menu
- Authentication-aware navigation
- Vue 3 Composition API
- State management with Pinia

---

## 💡 Skills Demonstrated

This project showcases:

- Full Stack Development
- REST API Development
- JWT Authentication
- PostgreSQL & PostGIS
- Vue 3 Composition API
- State Management with Pinia
- API Integration with Axios
- OpenLayers GIS Visualization
- Geospatial Data Processing
- Database Design
- Client-Server Architecture

---

## 🏗️ Architecture

```text
Frontend (Vue 3 + Vite + OpenLayers)
                │
                ▼
      REST API (Express.js)
                │
                ▼
     PostgreSQL + PostGIS
```

---

## 🗂️ Project Structure

```text
geo-dashboard/
│
├── backend/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── db/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── services/
│   │   └── assets/
│   │
│   └── vite.config.js
│
├── screenshots/
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

- Vue 3
- Vite
- OpenLayers
- Vue Router
- Pinia
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- dotenv

### Database

- PostgreSQL
- PostGIS

---

## 🗄️ Database

### Authentication

```text
users
├── id
├── username
└── password
```

### Geospatial Data

```text
desa_kalimantan
├── geometry
├── kabupaten
├── kecamatan
├── desa
└── additional attributes
```

---

## 🔐 Authentication API

### Login

```http
POST /api/v1/auth/login
```

Request

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### Register

```http
POST /api/v1/auth/register
```

Request

```json
{
  "username": "newuser",
  "password": "password123"
}
```

---

## 🌐 Geospatial API

### Get GeoJSON Data

```http
GET /api/v1/geo/geojson
```

### Get Kabupaten

```http
GET /api/v1/geo/kabupaten
```

### Get Kecamatan

```http
GET /api/v1/geo/kecamatan?kabupaten=XXX
```

### Get Desa

```http
GET /api/v1/geo/desa?kecamatan=YYY
```

### Get Boundary

```http
GET /api/v1/geo/boundary
```

---

## 🔒 Protected Routes

Protected endpoints require:

```http
Authorization: Bearer <token>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/haritshb/geo-dashboard.git
cd geo-dashboard
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:3000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 🚀 Future Improvements

- Role-Based Access Control (RBAC)
- Admin Dashboard
- Refresh Token Authentication
- Docker & Docker Compose Support
- GIS Layer Management
- Export Map as PNG/PDF
- GitHub Actions CI/CD Pipeline
- Automated Testing
- Audit Logging

---

## 👨‍💻 Author

**Harits Hamid Balfas**

Software Engineer | Full Stack Developer

GitHub:
https://github.com/haritshb

---

## 📌 Purpose

This project was built to demonstrate practical experience in:

- Vue.js Frontend Development
- OpenLayers GIS Visualization
- Express.js Backend Development
- PostgreSQL/PostGIS Geospatial Databases
- JWT Authentication & Authorization
- REST API Design
- Full Stack Application Architecture
