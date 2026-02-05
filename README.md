# Pet Shop Management System 🐾

A modern, full-stack Pet Shop Management System built with React, Node.js, Express, and MongoDB. Features a stunning UI with Framer Motion animations, dark mode support, and comprehensive CRUD operations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)

## ✨ Features

### Core Functionality
- **📊 Dashboard** - Real-time analytics with charts and statistics
- **🐕 Pet Management** - Full CRUD with grid/list views, filtering, and search
- **👥 Customer Management** - Customer database with purchase history tracking
- **🛒 Order Processing** - Create orders, track status, generate invoices
- **⚙️ Settings** - Theme toggle, profile management, notifications

### Technical Highlights
- 🎨 **Modern UI** - Clean design with glassmorphism and gradient accents
- 🌙 **Dark Mode** - Full dark theme support
- 🎬 **Smooth Animations** - Framer Motion for page transitions and interactions
- 📱 **Responsive** - Mobile-first design with collapsible sidebar
- 🔐 **JWT Authentication** - Secure login with role-based access
- 📈 **Recharts** - Beautiful charts for analytics
- 🔔 **Toast Notifications** - Feedback for all actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SIYAM1809/Pet-Shop-Management-System.git
   cd Pet-Shop-Management-System
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment**
   ```bash
   # In server folder, copy .env.example to .env
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Seed the database (optional)**
   ```bash
   cd server
   node seed.js
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Start server
   cd server
   npm run dev

   # Terminal 2 - Start client
   cd client
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Demo Credentials
```
Email: admin@petshop.com
Password: admin123
```

## 📁 Project Structure

```
Pet-Shop-Management-System/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Button, Input, Modal, Card
│   │   │   └── layout/        # Sidebar, Header, MainLayout
│   │   ├── context/           # React Context (Auth, Theme)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── styles/            # Global CSS & design system
│   │   └── utils/             # Animation variants
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/                # Database configuration
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth & error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── server.js              # Entry point
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build tool |
| React Router | Routing |
| Framer Motion | Animations |
| Recharts | Charts |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |

## 📸 Screenshots

### Dashboard
Modern dashboard with analytics cards, revenue charts, and recent activity.

### Pet Management
Grid and list views with search, filtering, and CRUD modals.

### Dark Mode
Full dark theme support across all pages.

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/me` | GET | Get current user |
| `/api/pets` | GET, POST | List/Create pets |
| `/api/pets/:id` | GET, PUT, DELETE | Pet operations |
| `/api/customers` | GET, POST | List/Create customers |
| `/api/orders` | GET, POST | List/Create orders |
| `/api/dashboard` | GET | Dashboard statistics |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by [SIYAM1809](https://github.com/SIYAM1809)