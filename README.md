# 🐾 Pet Shop Management System

> A production-ready, full-stack Pet Shop Management System with a premium UI, comprehensive admin dashboard, automated testing, containerization, and a live CI/CD pipeline.

<div align="center">

**[🌐 Live Demo](https://pet-shop-management-system-siyam.vercel.app)** &nbsp;|&nbsp; **[📖 API Docs](https://pet-shop-backend-siyam.onrender.com/api-docs)** &nbsp;|&nbsp; **[🐳 Docker Hub](https://hub.docker.com/r/siyam1809/petshop)**

[![CI Pipeline](https://github.com/SIYAM1809/Pet-Shop-Management-System/actions/workflows/ci.yml/badge.svg)](https://github.com/SIYAM1809/Pet-Shop-Management-System/actions/workflows/ci.yml)
[![Code Quality](https://github.com/SIYAM1809/Pet-Shop-Management-System/actions/workflows/code-quality.yml/badge.svg)](https://github.com/SIYAM1809/Pet-Shop-Management-System/actions/workflows/code-quality.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## 🚀 Live Deployment

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [pet-shop-management-system-siyam.vercel.app](https://pet-shop-management-system-siyam.vercel.app) |
| **Backend API** | Render | [pet-shop-backend-siyam.onrender.com](https://pet-shop-backend-siyam.onrender.com) |
| **API Documentation** | Swagger UI | [/api-docs](https://pet-shop-backend-siyam.onrender.com/api-docs) |

> **Demo Credentials** — Email: `admin@petshop.com` · Password: `admin123`

---

## ✨ Features

### 🎯 Public-Facing
- **🏠 Homepage** — Hero section, featured pets, testimonials, interactive map
- **🐶 Browse Pets** — Species/status filters, search, paginated grid view
- **📝 Pet Inquiries** — Contact form with email notification
- **⭐ Customer Reviews** — Submit & view approved testimonials
- **📅 Appointment Booking** — Schedule shop visits
- **📦 Order Tracking** — Real-time status via order number
- **📧 Newsletter** — Subscribe for new-pet email alerts

### 🛠️ Admin Dashboard
- **📊 Analytics** — Live stats, revenue charts (Recharts), activity feed
- **🐕 Pet Management** — Full CRUD with grid/list toggle view
- **👥 Customer CRM** — Customer database with full order history
- **🛒 Order Processing** — Create orders, update status, generate printable invoices
- **⭐ Review Moderation** — Approve, reject, or delete customer reviews
- **📅 Appointment Manager** — View and action appointment requests
- **📮 Newsletter Admin** — View and manage subscriber list
- **⚙️ Settings** — Profile, dark mode, staff account management

### 💡 Technical Highlights
- **🌙 Dark Mode** — Full theme support with smooth transitions
- **🎬 Animations** — Framer Motion page transitions & micro-interactions
- **📱 Responsive** — Mobile-first, collapsible sidebar
- **🔐 JWT Auth** — Role-based access control (Admin / Staff)
- **📧 Email Notifications** — Nodemailer + Gmail SMTP
- **📖 Swagger UI** — Interactive REST API documentation at `/api-docs`
- **🧪 Test Suite** — 41 automated tests (Vitest + React Testing Library)
- **🐳 Docker** — Multi-stage production builds for both services
- **⚙️ CI/CD** — GitHub Actions runs tests on every push

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| Vite | 6 | Build tool & dev server |
| React Router | 7 | Client-side routing |
| Framer Motion | 12 | Animations & transitions |
| Recharts | 2 | Charts & analytics |
| Lucide React | — | Icon library |
| React Hot Toast | — | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| Express | 5 | Web framework |
| MongoDB | Atlas | NoSQL database |
| Mongoose | 8 | MongoDB ODM |
| JWT | — | Authentication |
| bcryptjs | — | Password hashing |
| Nodemailer | — | Email notifications |
| Swagger UI Express | — | API documentation |

### DevOps & Testing
| Tool | Purpose |
|------|---------|
| Vitest | Backend & frontend test runner |
| Supertest | Backend integration testing |
| MongoDB Memory Server | In-memory DB for tests (no secrets needed) |
| React Testing Library | Frontend component testing |
| Docker + Compose | Containerization |
| GitHub Actions | CI/CD pipeline (tests + build + lint) |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 🧪 Testing

The project includes **41 automated tests** across backend and frontend, running in CI on every push.

```bash
# Run backend tests (18 integration tests)
cd server && npm test

# Run frontend tests (23 component tests)
cd client && npm test

# Generate coverage report
npm run test:coverage
```

### What's Tested

**Backend** (supertest + MongoMemoryServer — no real DB required):
- ✅ Health check endpoint
- ✅ Auth: login validation, wrong credentials, success, field checking
- ✅ Pets: public listing, filters, pagination, invalid ID (CastError → 404)
- ✅ Protected routes return 401 without token (orders, customers, admin)
- ✅ Public routes: reviews, newsletter, inquiries

**Frontend** (React Testing Library + jsdom):
- ✅ `Button` — 13 tests (variants, sizes, loading, disabled, onClick, icon)
- ✅ `Card` — 10 tests (variants, padding, hover, className, prop forwarding)

---

## 🐳 Docker

Run the entire stack locally with a single command:

```bash
# Copy and fill in your environment file
cp .env.docker.example .env

# Start all services (MongoDB + backend + frontend)
docker compose up -d

# Seed the database
docker compose exec backend node seed.js
```

Then open http://localhost:3000.

```bash
# Stop all services
docker compose down
```

### Services
| Service | Port | Description |
|---------|------|-------------|
| MongoDB | 27017 | Database |
| Backend API | 5001 | Express server |
| Frontend | 3000 | Nginx-served React app |

---

## ⚙️ CI/CD Pipeline

GitHub Actions runs automatically on every push to `main`:

```
Push → Tests (backend + frontend) → Lint → Docker Build → Deploy (Vercel auto)
```

| Workflow | Description |
|----------|-------------|
| `ci.yml` | Runs 41 tests + Docker build verification |
| `code-quality.yml` | ESLint checks |
| `docker-publish.yml` | Publishes Docker images on release tags |

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ · MongoDB (local or Atlas) · Gmail account (for email)

### Setup

```bash
# 1. Clone
git clone https://github.com/SIYAM1809/Pet-Shop-Management-System.git
cd Pet-Shop-Management-System

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure environment (see below)

# 4. Seed database
cd server && node seed.js

# 5. Run both services
cd server && npm run dev      # Terminal 1 → http://localhost:5001
cd client && npm run dev      # Terminal 2 → http://localhost:5173
```

### Environment Variables

**`server/.env`**
```env
MONGODB_URI=mongodb://localhost:27017/petshop
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password   # Gmail App Password
FROM_NAME=Siyam's Praniseba
FROM_EMAIL=your-email@gmail.com
PORT=5001
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5001/api
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

---

## 📁 Project Structure

```
Pet-Shop-Management-System/
├── .github/workflows/          # CI/CD pipelines
│   ├── ci.yml                  # Tests + Docker build
│   ├── code-quality.yml        # ESLint
│   └── docker-publish.yml      # Docker Hub publishing
│
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Button, Card, Input, Modal, Sidebar…
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Admin/ + Public/ pages
│   │   ├── services/api.js     # Centralized API layer
│   │   └── utils/              # Animation variants
│   ├── vitest.config.js        # Frontend test config
│   └── Dockerfile              # Multi-stage Nginx build
│
├── server/                     # Node.js + Express Backend
│   ├── __tests__/api.test.js   # 18 integration tests
│   ├── config/                 # DB connection + Swagger spec
│   ├── controllers/            # Route handlers (auth, pets, orders…)
│   ├── middleware/             # JWT auth + error handler
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── app.js                  # Express app factory (for testing)
│   ├── server.js               # Entry point (starts server)
│   ├── seed.js                 # Admin + demo data seeder
│   ├── vitest.config.js        # Backend test config
│   └── Dockerfile              # Multi-stage Node build
│
└── docker-compose.yml          # Full-stack orchestration
```

---

## 📖 API Reference

Full interactive documentation available at **[/api-docs](https://pet-shop-backend-siyam.onrender.com/api-docs)** (Swagger UI).

### Quick Reference

| Resource | Public | Admin/Staff |
|----------|--------|-------------|
| `GET /api/pets` | ✅ List + filter | — |
| `POST /api/pets` | — | ✅ Create |
| `PUT /api/pets/:id` | — | ✅ Update |
| `DELETE /api/pets/:id` | — | ✅ Delete |
| `GET /api/reviews` | ✅ Approved only | — |
| `POST /api/auth/login` | ✅ Login | — |
| `POST /api/auth/register` | — | ✅ Admin only |
| `GET /api/orders` | — | ✅ All orders |
| `GET /api/orders/track/:num` | ✅ Track by # | — |
| `GET /api/dashboard` | — | ✅ Analytics |
| `GET /api/health` | ✅ Health check | — |

---

## 🔐 Security

- JWT tokens with configurable expiry
- bcrypt password hashing (10 salt rounds)
- Role-based route protection (Admin / Staff)
- Environment variables for all secrets
- CORS configured for production origins

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request → CI runs automatically
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built by [SIYAM1809](https://github.com/SIYAM1809)** · [GitHub Repo](https://github.com/SIYAM1809/Pet-Shop-Management-System)

⭐ Star this repository if you find it helpful!

*Made with ❤️ using React, Node.js, Express, and MongoDB*

</div>