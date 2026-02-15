# 🐾 Pet Shop Management System

A modern, full-stack Pet Shop Management System built with **React**, **Node.js**, **Express**, and **MongoDB**. Features a beautiful UI with animations, email notifications, customer reviews, appointment booking, and comprehensive admin management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![CI](https://github.com/SIYAM1809/Pet-Shop-Management-System/actions/workflows/ci.yml/badge.svg)

## ✨ Features

### 🎯 Core Functionality

#### Public Features
- **🏠 Homepage** - Hero section, featured pets, testimonials, location map
- **🐶 Browse Pets** - Grid view with filtering by species and search
- **📝 Pet Inquiries** - Contact form for pet inquiries
- **⭐ Submit Reviews** - Customer testimonials and feedback
- **📅 Book Appointments** - Schedule visits to the shop
- **📦 Track Orders** - Check order status with order number
- **📧 Newsletter** - Subscribe to email notifications for new pets

#### Admin Dashboard
- **📊 Analytics Dashboard** - Real-time stats, revenue charts, activity feed
- **🐕 Pet Management** - Full CRUD operations with grid/list views
- **👥 Customer Management** - Customer database with order history
- **🛒 Order Processing** - Create orders, update status, generate invoices
- **📮 Subscriber Management** - View newsletter subscribers
- **⭐ Review Management** - Approve/reject customer reviews
- **📅 Appointment Management** - View and manage appointment requests
- **⚙️ Settings** - Profile management, dark mode, staff management

### 💡 Technical Highlights

- **🎨 Modern UI** - Premium design with glassmorphism and gradients
- **🌙 Dark Mode** - Full dark theme support with smooth transitions
- **🎬 Animations** - Framer Motion for smooth page transitions
- **📱 Responsive Design** - Mobile-first with collapsible sidebar
- **🔐 JWT Authentication** - Secure login with role-based access (Admin/Staff)
- **📧 Email Notifications** - Automated emails via Nodemailer
- **📈 Charts** - Beautiful analytics with Recharts
- **🔔 Toast Notifications** - Real-time feedback for all actions
- **🎯 Protected Routes** - Admin-only pages with authentication guards

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Gmail Account** (for email notifications)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/SIYAM1809/Pet-Shop-Management-System.git
cd Pet-Shop-Management-System
```

#### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 3. Environment Configuration

**Server Environment** (`server/.env`):
```env
# Database
MONGODB_URI=mongodb://localhost:27017/petshop
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/petshop

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_NAME=Siyam's Praniseba
FROM_EMAIL=your-email@gmail.com

# Server
PORT=5001
```

**Client Environment** (`client/.env`):
```env
VITE_API_URL=http://localhost:5001/api
```

> **📧 Email Setup Guide:**
> 1. Go to your [Google Account](https://myaccount.google.com/)
> 2. Enable 2-Step Verification
> 3. Generate an [App Password](https://myaccount.google.com/apppasswords)
> 4. Use this App Password as `SMTP_PASSWORD` in `.env`

#### 4. Seed the Database
```bash
cd server

# Create admin user
node seed.js

# Add demo pets (optional)
node seed_demo_pets.js
```

**Default Admin Credentials:**
```
Email: admin@petshop.com
Password: admin123
```

#### 5. Start the Application
```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend client
cd client
npm run dev
```

#### 6. Open in Browser
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001

## 📁 Project Structure

```
Pet-Shop-Management-System/
├── client/                         # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/             # Button, Input, Modal, Card, etc.
│   │   │   ├── layout/             # Sidebar, Header, Footer, MainLayout
│   │   │   └── home/               # TestimonialsSection
│   │   ├── context/                # React Context
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   └── ThemeContext.jsx   # Dark mode toggle
│   │   ├── pages/                  # Page components
│   │   │   ├── Admin/              # Admin dashboard pages
│   │   │   └── Public/             # Public-facing pages
│   │   ├── services/               # API service layer
│   │   │   └── api.js              # Axios/fetch wrappers
│   │   ├── styles/                 # Global CSS & design system
│   │   └── utils/                  # Animation variants
│   └── package.json
│
├── server/                         # Node.js Backend
│   ├── config/                     # Database configuration
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/                # Route handlers
│   │   ├── authController.js       # Login, register, getMe
│   │   ├── petController.js        # Pet CRUD + email on create
│   │   ├── customerController.js   # Customer management
│   │   ├── orderController.js      # Order processing
│   │   ├── dashboardController.js  # Analytics data
│   │   ├── subscriberController.js # Newsletter subscriptions
│   │   ├── reviewController.js     # Review management
│   │   └── appointmentController.js # Appointments
│   ├── middleware/                 # Custom middleware
│   │   ├── auth.js                 # JWT verification & role checks
│   │   └── error.js                # Error handling
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── Customer.js
│   │   ├── Order.js
│   │   ├── Subscriber.js
│   │   ├── Review.js
│   │   └── Appointment.js
│   ├── routes/                     # API routes
│   │   ├── authRoutes.js
│   │   ├── petRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── subscriberRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── appointmentRoutes.js
│   ├── scripts/                    # Utility scripts
│   │   └── add_more_pets.js        # Add additional pets
│   ├── utils/                      # Helper functions
│   │   └── sendEmail.js            # Nodemailer configuration
│   ├── server.js                   # Entry point
│   ├── seed.js                     # Create admin user
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Framer Motion | Animations & transitions |
| Recharts | Charts & analytics |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express | Web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Nodemailer | Email notifications |
| CORS | Cross-origin requests |

## 📝 API Documentation

### Authentication
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/auth/register` | POST | Admin | Create new staff user |
| `/api/auth/login` | POST | Public | User login |
| `/api/auth/me` | GET | Private | Get current user |
| `/api/auth/users` | GET | Admin | List all users |

### Pets
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/pets` | GET | Public | List all pets (with filters) |
| `/api/pets` | POST | Admin/Staff | Create new pet |
| `/api/pets/:id` | GET | Public | Get single pet |
| `/api/pets/:id` | PUT | Admin/Staff | Update pet |
| `/api/pets/:id` | DELETE | Admin/Staff | Delete pet |
| `/api/pets/stats` | GET | Admin/Staff | Pet statistics |

### Customers
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/customers` | GET | Admin/Staff | List customers |
| `/api/customers` | POST | Admin/Staff | Create customer |
| `/api/customers/:id` | GET | Admin/Staff | Get customer |
| `/api/customers/:id` | PUT | Admin/Staff | Update customer |
| `/api/customers/:id` | DELETE | Admin/Staff | Delete customer |

### Orders
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/orders` | GET | Admin/Staff | List orders |
| `/api/orders` | POST | Admin/Staff | Create order |
| `/api/orders/:id` | GET | Admin/Staff | Get order |
| `/api/orders/:id` | PUT | Admin/Staff | Update order |
| `/api/orders/:id` | DELETE | Admin/Staff | Delete order |
| `/api/orders/track/:orderNumber` | GET | Public | Track order |
| `/api/orders/stats` | GET | Admin/Staff | Order statistics |

### Subscribers
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/subscribers` | POST | Public | Subscribe to newsletter |
| `/api/subscribers` | GET | Admin/Staff | List subscribers |

### Reviews
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/reviews` | GET | Public | List approved reviews |
| `/api/reviews/admin/all` | GET | Admin/Staff | List all reviews |
| `/api/reviews` | POST | Public | Submit review |
| `/api/reviews/:id/status` | PUT | Admin/Staff | Approve/reject review |
| `/api/reviews/:id` | DELETE | Admin/Staff | Delete review |

### Appointments
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/appointments` | GET | Admin/Staff | List appointments |
| `/api/appointments/:id` | PUT | Admin/Staff | Update appointment status |

### Dashboard
| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/dashboard` | GET | Admin/Staff | Dashboard statistics |

## 🎨 Key Features Explained

### Email Notifications
- Subscribers receive automatic emails when new pets are added
- Configured via Nodemailer using Gmail SMTP
- Supports both production and development (Ethereal) modes

### Newsletter Subscription
- Footer subscription form on all public pages
- Subscribers list viewable in admin dashboard
- Email validation and duplicate prevention

### Review System
- Customers submit reviews via public form
- Admin can approve/reject/delete reviews
- Approved reviews show on homepage testimonials

### Appointment Booking
- Book appointments to visit the shop
- Viewable location map
- Admin can manage appointment requests

### Order Tracking
- Public order tracking by order number
- Real-time status updates
- Invoice generation

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Role-Based Access** - Admin and Staff roles
- **Protected Routes** - Middleware for route protection
- **Environment Variables** - Sensitive data in `.env`
- **CORS Configuration** - Controlled cross-origin requests

## 🧪 Testing

The repository includes various test scripts in `server/`:
- `test_api.js` - API endpoint testing
- `test_login.js` - Authentication testing
- `check_admin.js` - Verify admin users
- `debug_db.js` - Database debugging

## 📦 Deployment

### Backend (Render/Railway/Heroku)
1. Set environment variables in hosting platform
2. Set `MONGODB_URI` to MongoDB Atlas connection string
3. Configure `SMTP_*` variables for email
4. Deploy from GitHub repository

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production API URL
2. Build command: `npm run build`
3. Output directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**SIYAM1809**
- GitHub: [@SIYAM1809](https://github.com/SIYAM1809)
- Project Link: [Pet-Shop-Management-System](https://github.com/SIYAM1809/Pet-Shop-Management-System)

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ using React, Node.js, and MongoDB