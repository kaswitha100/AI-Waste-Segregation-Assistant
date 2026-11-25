# 🌿 AI Waste Segregation Assistant

An intelligent, production-grade full-stack web application powered by **Computer Vision Deep Learning**, **FastAPI**, **React.js**, and **MongoDB**. Designed to accelerate the circular economy by classifying domestic and municipal waste into 4 standardized color-coded streams with disposal protocols, carbon offset analytics, and community eco-gamification.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.13-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)
![Deep%20Learning](https://img.shields.io/badge/Model-MobileNetV2-orange.svg)

---

## 🌟 Key Features

1. **AI Image Recognition Engine**:
   - Powered by real **MobileNetV2** deep neural network inference combined with OpenCV preprocessing.
   - Recognizes real-world waste items: plastic bottles, glass jars, aluminum cans, cardboard, food leftovers, fruit peels, vegetable scraps, batteries, smartphones, CFL lights, packaging, and non-recyclable wrappers.
   - Detects low confidence and non-waste objects gracefully with **Uncertain / Mixed Waste** guidance instead of false guessing.

2. **4 Standardized Waste Segregation Streams**:
   - 🟢 **Wet Waste (Green Bin)**: Biodegradable organics, fruit/vegetable scraps, cooked food, coffee grounds.
   - 🔵 **Recyclable Waste (Blue Bin)**: Clean PET plastics, HDPE jugs, aluminum & tin cans, cardboard boxes, paper, glass bottles.
   - 🔴 **Hazardous & E-Waste (Red Bin)**: Batteries, electronics, CFL tube lights, spray cans, medicines.
   - ⚫ **Dry Waste (Black Bin)**: Multi-layer wrappers, soiled napkins, broken ceramics, rubber, dust.

3. **Dual Acquisition Scanner**:
   - **Upload Mode**: Drag-and-drop or select files (JPEG, PNG, WEBP) up to 10MB, plus 1-click pre-packaged sample testing items (Plastic Bottle, Banana Peels, AA Battery, Cardboard Box).
   - **Live Camera Mode**: Real-time webcam viewfinder with scanning reticle overlay, camera switching (front/back), snapshot capture, and countdown trigger.

4. **Actionable Disposal Guidance**:
   - Step-by-step preparation (e.g. rinse, air dry, flatten, tape battery terminals).
   - Recommended **Do's** and critical **Don'ts**.
   - Material decomposition timeframe and environmental impact metrics.

5. **Gamification & Environmental Karma**:
   - Scans award **Eco Points** and calculate **avoided CO₂ emissions (kg)** and **virtual water conserved (liters)**.
   - Tier badges: *Green Seedling 🌱*, *Active Recycler ♻️*, *Eco Champion 🌟*, *Zero-Waste Hero 👑*.

6. **History & Advanced Filter**:
   - Search by item name, filter by category stream, submit accuracy feedback (*Helpful* / *Inaccurate*), delete records, and export to CSV.

7. **Recycling Statistics & Interactive Dashboard**:
   - Category distribution percentages, weekly scan trend visualizer, and landfill diversion rate KPI.

8. **Admin Operations Center**:
   - System overview, database connection health, audited model accuracy, registered user directory management, and global classification logs.

9. **Secure Authentication & Resilient Database**:
   - JWT stateless Bearer tokens with bcrypt password hashing.
   - Native async Motor driver for **MongoDB Atlas** / local MongoDB, with an automatic, resilient persistent fallback datastore ensuring zero setup friction.

---

## 🏗️ Project Architecture

```
AI Waste Segregation Assistant/
├── backend/
│   ├── app/
│   │   ├── api/                 # REST API endpoints (auth, classify, history, analytics, profile, admin)
│   │   ├── core/                # JWT tokens, bcrypt security, authentication dependencies
│   │   ├── db/                  # MongoDB Motor driver & resilient async fallback datastore
│   │   ├── ml/                  # MobileNetV2 inference engine, OpenCV pipeline, waste taxonomy
│   │   ├── models/              # Pydantic v2 schemas and validation models
│   │   ├── config.py            # Pydantic-settings environment configuration
│   │   └── main.py              # FastAPI application gateway, CORS, and initial seeding
│   ├── tests/                   # Pytest suite for ML taxonomy, hashing, JWT, and classification
│   ├── requirements.txt         # Backend Python dependencies
│   ├── .env.example             # Backend environment template
│   ├── Procfile                 # Deployment process command
│   └── render.yaml              # Render backend configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Footer, ProtectedRoute
│   │   │   ├── scanner/         # ImageUploader, CameraCapture, ClassificationResult
│   │   │   └── dashboard/       # StatCard
│   │   ├── context/             # AuthContext (JWT persistence, user state, eco points)
│   │   ├── pages/               # HomePage, ScannerPage, DashboardPage, HistoryPage, GuidePage, AnalyticsPage, ProfilePage, AdminPage, LoginPage, RegisterPage
│   │   ├── services/            # Axios API client with interceptors
│   │   └── utils/               # Waste taxonomy categories and color palettes
│   ├── package.json             # Frontend dependencies (React 18, Vite, Tailwind CSS, Lucide)
│   ├── vite.config.js           # Vite dev server with /api proxy
│   ├── tailwind.config.js       # Environmental custom palette
│   └── vercel.json              # Vercel SPA routing
├── ARCHITECTURE.md              # Detailed architecture artifact
├── .gitignore
├── package.json                 # Root script runner
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10 - 3.13**
- **Node.js v18+ & npm**
- *(Optional)* **MongoDB** (Local or MongoDB Atlas connection string. If MongoDB is not running, the application will automatically operate using its built-in resilient persistent datastore).

---

### Step 1: Backend Setup & Execution

Open a terminal in the project directory:

```bash
cd backend
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

Verify backend with automated unit tests:
```bash
python -m pytest tests/test_backend.py
```

Start the FastAPI backend server:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> The API will be live at `http://127.0.0.1:8000`.  
> Interactive OpenAPI Swagger docs available at `http://127.0.0.1:8000/docs`.

---

### Step 2: Frontend Setup & Execution

Open a second terminal:

```bash
cd frontend
```

Install frontend dependencies:
```bash
npm install
```

Start Vite development server:
```bash
npm run dev
```

> The web application will be accessible at:  
> **👉 `http://localhost:5173`**

---

## 🔑 Pre-Seeded Demo Credentials

The backend automatically seeds two demonstration accounts upon initial launch:

| Role | Email | Password |
|---|---|---|
| **Demo User** | `eco.user@example.com` | `Password123!` |
| **System Admin** | `admin@wastesegregation.ai` | `AdminPassword123!` |

*(Both accounts can also be instantly loaded with a single click using the **"Instant 1-Click Demo Login"** buttons on the Sign-In page).*

---

## ☁️ Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and whitelist `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a database user and password.
4. Copy your connection string:
   ```env
   MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/waste_segregation_db?retryWrites=true&w=majority"
   ```

### 2. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign up / Log in to [Render](https://render.com).
3. Select **New Web Service** and link your GitHub repository.
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `MONGODB_URL`: Your MongoDB Atlas URI.
   - `SECRET_KEY`: A secure random 32-character string.
   - `CORS_ORIGINS`: Your Vercel frontend URL (e.g. `https://your-app.vercel.app`).

### 3. Frontend Deployment (Vercel)
1. Sign up / Log in to [Vercel](https://vercel.com).
2. Click **Add New Project** and import the repository.
3. Configure the build:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy! The included `frontend/vercel.json` automatically manages client-side single page routing.

---

## 🧪 Testing Checklist Verified

- [x] **User Registration & JWT Login**: Verified password hashing, token validation, role isolation.
- [x] **File Upload Classification**: Tested with multipart image uploads, size validation, and format checks.
- [x] **Live Camera Classifier**: Tested webcam capture, canvas snapshot framing, and classification.
- [x] **Real Deep Learning Model**: Verified MobileNetV2 inference and taxonomy categorization.
- [x] **Confidence Thresholding**: Handles uncertain objects safely without misleading scores.
- [x] **Disposal Instructions**: Green/Blue/Red/Black bin guidelines, do's & don'ts, decomposition duration.
- [x] **History & Analytics**: Category filters, search, CSV export, carbon offset computation.
- [x] **Admin Operations**: User account auditing, global classification feed, model status.
- [x] **Responsive Environmental Theme**: Emerald, teal, and slate palette with mobile navigation.

---

## 📄 License
This project is open-source under the MIT License.
