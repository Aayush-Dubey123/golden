# Golden Kulcha 🫓✨

> **Minimal. Golden. Freshly baked.**  
> A full-stack food ordering web application built with a React 19 frontend and a FastAPI backend powered by MongoDB.

---

## 🌟 Key Features

- 🫓 **Public Landing & Menu Page (`/`):** Opens directly to a rich, dark-golden menu catalog without requiring upfront customer login.
- 🛒 **Unauthenticated Cart System:** Select products (Amritsari Chole Kulcha, Paneer Special, Cheese Burst, Sweet Lassi), adjust quantities, and persist cart state locally.
- 🔐 **Checkout Authentication Gate:** Frictionless customer journey — customers browse freely and are prompted to sign in or register only when confirming order placement.
- ⚡ **One-Click Portfolio Demo Access:** Quick demo login for both **Demo Customer** and **Demo Merchant (Zomato Terminal)**.
- 📦 **Order Management & Persistence:** Orders are created, stored, and managed in MongoDB via FastAPI REST endpoints (`POST /v1/orders`).
- ⭐ **Ratings & Reviews:** Customers can rate completed orders with 1–5 stars and submit detailed feedback (`POST /v1/orders/{id}/rate`).
- 💬 **Google & WhatsApp Integration:** Direct Google Reviews link, Instagram updates (`@golden_kulchaco`), and WhatsApp feedback modal.
- 🎨 **Luxury Dark-Gold Aesthetic:** Unified theme featuring gold typography (`#d4af37`, `#f2d06b`), glassmorphism cards (`#0a0a0a`), Playfair Display & Montserrat fonts, and background texture overlays.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Google Fonts (`Playfair Display`, `Montserrat`)
- **State & Routing:** React Router 7 + Context API (Cart & Auth)
- **Icons & UI:** Lucide React + Sonner (Toasts)

### Backend
- **Framework:** FastAPI (Python)
- **Database:** MongoDB via ODMantic & Motor (Async MongoDB Driver)
- **Authentication:** JWT (JSON Web Tokens) & native bcrypt password encryption
- **ASGI Server:** Uvicorn

---

## 📁 Repository Structure

```text
golden/
├── src/                        # React 19 Frontend Code
│   ├── api/                    # Axios instance & API services (authApi, orderApi)
│   ├── components/             # Layout, Navbar, Sidebar, ProtectedRoute, Loader
│   ├── context/                # AuthContext & CartContext
│   └── pages/                  # GoldenLandingPage, CreateOrder, MyOrders, OrderDetails, Auth, Dashboard
├── public/                     # Static assets & brand logos
├── core/                       # FastAPI Backend
│   ├── apis/                   # Application assembly & routes (user_router, order_router)
│   ├── controllers/            # Controller business logic (UserController, OrderController)
│   ├── cruds/                  # Database CRUD queries (UserCRUD, OrderCRUD)
│   ├── database/               # MongoDB client & ODMantic engine connection
│   └── model/                  # Data models (User, Order, FoodType, OrderStatus)
├── common/                     # Shared backend utilities (auth, logger)
├── api/                        # Vercel serverless function entry (index.py)
├── main.py                     # Local FastAPI entry point (Uvicorn launcher)
├── package.json                # Root Node dependencies & build scripts
├── requirements.txt            # Python backend dependencies
└── vercel.json                 # Vercel deployment configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)
- MongoDB running locally on `mongodb://localhost:27017` (or MongoDB Atlas)

---

### Setup & Running Locally

1. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=golden
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   VITE_API_BASE_URL=/v1
   ```

2. **Install Dependencies:**
   ```powershell
   # Install Node dependencies
   npm install

   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Start Applications:**
   ```powershell
   # Start FastAPI Backend (runs on http://127.0.0.1:8000)
   python main.py

   # Start React Frontend (runs on http://localhost:5173)
   npm run dev
   ```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
