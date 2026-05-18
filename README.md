# LeadFlow - Smart Leads Dashboard

> A professional full-stack lead management dashboard built with the MERN stack for efficient lead tracking and management.

<div align="center">

![GitHub](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-v20+-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

**[Live Demo](https://ashutosh-lead.vercel.app/) • [GitHub Repo](https://github.com/as-ga/lead-flow) • [API Docs](./API_DOCUMENTATION.md)**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

---

## 🎯 Overview

**LeadFlow** is a production-ready lead management system designed to help sales teams efficiently capture, organize, and nurture leads. Built with modern web technologies, it features a responsive dashboard, advanced filtering, real-time search, and role-based access control.

### Key Highlights

- 🔐 **Secure JWT Authentication** with token refresh mechanism
- 📊 **Advanced Filtering & Search** - Filter by status, source, search by name/email
- 📄 **CSV Export** - Download leads data for external analysis
- 👥 **Role-Based Access** - Admin and Sales user roles
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, desktop
- 🌓 **Dark Mode** - Modern dark/light theme support
- ⚡ **Optimized Performance** - Debounced search, pagination, caching
- 🐳 **Docker Ready** - Complete containerization with Docker Compose
- 📦 **Production Deployment** - Deployed on Vercel (frontend) and cloud services

---

## ✨ Features

### ✅ Core Features

| Feature                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| **JWT Authentication** | Secure token-based auth with refresh tokens    |
| **Lead CRUD**          | Create, read, update, delete lead records      |
| **Advanced Filtering** | Filter by status, source, search by name/email |
| **Pagination**         | Backend pagination (10 records/page)           |
| **CSV Export**         | Export leads as CSV for offline use            |
| **Role-Based Access**  | Admin and Sales User roles                     |
| **Responsive Design**  | Mobile, tablet, desktop optimized              |
| **Dark Mode**          | Full dark/light theme support                  |

### 🚀 Advanced Features

| Feature                  | Description                        |
| ------------------------ | ---------------------------------- |
| **Debounced Search**     | Optimized search performance       |
| **Real-time Validation** | Form validation with Zod           |
| **Error Handling**       | Comprehensive error management     |
| **Loading States**       | Skeleton loaders and spinners      |
| **Empty States**         | Helpful messaging when no data     |
| **Toast Notifications**  | Success/error feedback with Sonner |
| **Docker Compose**       | Multi-container orchestration      |
| **API Documentation**    | Complete API reference             |

---

## 🛠️ Tech Stack

### Frontend Stack

```
Framework:      Next.js 16 (React 19)
Language:       TypeScript 5
Styling:        TailwindCSS 4 + Dark Mode
UI Components:  shadcn/ui (Radix UI)
Forms:          React Hook Form + Zod
State:          Zustand + TanStack Query
HTTP Client:    Axios with interceptors
Notifications:  Sonner
Icons:          Lucide React
Deployment:     Vercel
```

### Backend Stack

```
Runtime:        Node.js 20
Framework:      Express.js 5
Language:       TypeScript 5
Database:       MongoDB 6 + Mongoose
Authentication: JWT + bcrypt
Validation:     Zod schemas
Container:      Docker + Docker Compose
Deployment:     Render/Railway/AWS
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free)
- **pnpm** or npm
- **Docker** & **Docker Compose** (Optional, for containerized setup)

### Option 1: Local Setup

#### Backend

```bash
cd server

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Configure .env (see ENV_GUIDE.md)
# - Set MONGODB_URI
# - Configure JWT secrets
# - Set CLIENT_URL

# Start development server
pnpm dev
```

#### Frontend

```bash
cd client

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Configure .env.local
# - Set NEXT_PUBLIC_API_URL to http://localhost:5000/api

# Start development server
pnpm dev
```

**Access Application:**

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Option 2: Docker Setup

```bash
# Start all services
docker compose up -d

# Wait for initialization (30 seconds)
sleep 30

# Verify services
docker compose ps

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker guide.

---

## 📚 Documentation

Complete documentation for all aspects of the project:

| Document                                           | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**             | Step-by-step installation and setup |
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | Complete API endpoints reference    |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)**           | System design and patterns          |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)**               | Production deployment guide         |
| **[ENV_GUIDE.md](./ENV_GUIDE.md)**                 | Environment variables configuration |
| **[DOCKER_SETUP.md](./DOCKER_SETUP.md)**           | Docker containerization guide       |

---

## 📁 Project Structure

```
lead-flow/
├── server/                          # Backend (Node.js)
│   ├── src/
│   │   ├── app.ts                  # Express app configuration
│   │   ├── server.ts               # Server entry point
│   │   ├── config/
│   │   │   ├── db.ts               # MongoDB connection
│   │   │   └── env.ts              # Environment config
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts  # JWT authentication
│   │   ├── models/
│   │   │   ├── user.ts             # User schema
│   │   │   └── lead.ts             # Lead schema
│   │   ├── modules/
│   │   │   ├── auth/               # Authentication module
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controllers.ts
│   │   │   │   └── auth.validations.ts
│   │   │   └── lead/               # Lead management module
│   │   │       ├── lead.routes.ts
│   │   │       ├── lead.controllers.ts
│   │   │       └── lead.validations.ts
│   │   ├── types/
│   │   │   ├── user.d.ts
│   │   │   └── lead.d.ts
│   │   └── utils/
│   │       ├── apiHandler.ts       # API response handler
│   │       ├── asyncHandler.ts     # Async middleware
│   │       └── jwt.ts              # JWT utilities
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── client/                          # Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── (auth)/                 # Auth routes group
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   └── dashboard/              # Dashboard routes
│   │       ├── page.tsx
│   │       └── ...
│   ├── components/
│   │   ├── ui/                     # UI components
│   │   └── ...                     # Feature components
│   ├── lib/
│   │   ├── utils.ts
│   │   └── api.ts                  # API client
│   ├── public/                     # Static files
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml              # Docker orchestration
├── .env.docker                     # Docker environment variables
├── README.md                       # Project overview
├── SETUP_GUIDE.md                  # Installation guide
├── API_DOCUMENTATION.md            # API reference
├── ARCHITECTURE.md                 # Architecture details
├── DEPLOYMENT.md                   # Deployment guide
├── ENV_GUIDE.md                    # Environment configuration
└── DOCKER_SETUP.md                 # Docker guide
```

---

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint                  | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | `/api/auth/register`      | Register new user    |
| POST   | `/api/auth/login`         | User login           |
| GET    | `/api/auth/me`            | Get current user     |
| POST   | `/api/auth/refresh-token` | Refresh access token |
| POST   | `/api/auth/logout`        | User logout          |

### Lead Routes

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | `/api/lead`     | Create lead                  |
| GET    | `/api/lead`     | Get all leads (with filters) |
| GET    | `/api/lead/:id` | Get single lead              |
| PATCH  | `/api/lead/:id` | Update lead                  |
| DELETE | `/api/lead/:id` | Delete lead                  |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details with examples.

---

## 🔐 Security

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS**: Configured for production domains only
- **Input Validation**: Zod schemas on frontend and backend
- **HTTP-Only Cookies**: For secure token storage
- **HTTPS**: Enforced in production
- **Environment Secrets**: Never committed to repository

---

## 📦 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead-flow
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

See [ENV_GUIDE.md](./ENV_GUIDE.md) for detailed configuration.

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

**Live:** https://ashutosh-lead.vercel.app/

### Backend (Render/Railway)

1. Create account on Render or Railway
2. Connect GitHub repository
3. Configure environment variables
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

---

## 📊 Features in Detail

### Authentication Flow

```
Register/Login → JWT Token Generated → Token Stored (Secure)
    ↓
Protected Routes → Verify JWT → Extract User Info
    ↓
Token Expired → Use Refresh Token → New Access Token
    ↓
Logout → Clear Tokens
```

### Lead Management

- **Create**: Add new leads with validation
- **Read**: View single lead or all leads with pagination
- **Update**: Modify lead status, source, etc.
- **Delete**: Remove leads from system
- **Filter**: By status and source
- **Search**: Debounced search by name/email
- **Export**: Download leads as CSV

### Dashboard Features

- Real-time lead statistics
- Lead status distribution chart
- Quick add lead form
- Lead list with filters
- CSV export functionality
- Responsive on all devices

---

## 🧪 Testing

### Manual Testing

```bash
# Test API
curl http://localhost:5000/api/health

# Test with authentication
curl -H "Authorization: Bearer {token}" http://localhost:5000/api/lead
```

### Test Credentials

```
Email: test@example.com
Password: TestPassword123
```

---

## 📝 Git Commit History

Professional commit messages following conventional commits:

```
feat: add authentication system
feat: implement lead management CRUD
feat: add advanced filtering and search
feat: add CSV export functionality
fix: resolve CORS issues
docs: add comprehensive documentation
chore: update dependencies
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) file for details.

---

## 👨‍💼 About

**LeadFlow** is built as a full-stack internship assignment showcasing:

- ✅ Professional code structure and architecture
- ✅ Complete TypeScript implementation
- ✅ Modern frontend with React and Next.js
- ✅ Scalable backend with Express.js
- ✅ Database design with MongoDB
- ✅ Docker containerization
- ✅ Production deployment
- ✅ Comprehensive documentation

---

## 🔗 Links

- **Live App**: https://ashutosh-lead.vercel.app/
- **GitHub**: https://github.com/as-ga/lead-flow
- **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Environment Config**: [ENV_GUIDE.md](./ENV_GUIDE.md)

---

## 💬 Questions?

Check out the documentation files or review the codebase. For issues, open a GitHub issue.

---

**Made with ❤️ by Ashutosh Gaurav**

```
│ ├── app/ # Next.js pages
│ │ ├── dashboard/ # Main dashboard
│ │ ├── login/ # Auth pages
│ │ └── register/
│ ├── components/ # React components
│ │ ├── ui/ # UI components
│ │ └── leads/ # Lead components
│ ├── hooks/ # Custom hooks
│ ├── lib/ # Utilities
│ │ ├── api.ts # API client
│ │ ├── store.ts # Zustand stores
│ │ ├── validations.ts # Zod schemas
│ │ └── types.ts # TypeScript types
│ └── public/ # Static files
│
├── SETUP_GUIDE.md # Setup instructions
└── README.md # This file

```

## 📚 Key Features Explained

### Authentication Flow

1. User registers with email and password
2. Backend hashes password with bcrypt
3. JWT tokens issued (access + refresh)
4. Tokens stored in localStorage
5. Automatic refresh on token expiry

### Lead Management

- **Create**: Add new leads with name, email, source, remarks
- **Read**: View leads with pagination and filtering
- **Update**: Edit lead status, source, remarks
- **Delete**: Remove leads with confirmation

### Advanced Filtering

- Search by name or email (debounced)
- Filter by status (New, Contacted, Qualified, Lost)
- Filter by source (Website, Instagram, Referral)
- Sort by latest or oldest
- All filters work together

### Pagination

- Server-side pagination (10 per page)
- Navigation buttons and page numbers
- Total count and page metadata

## 🔐 Security

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation (Zod + backend schemas)
- ✅ Role-based access control

## 📊 API Endpoints

### Authentication

```

POST /api/auth/register - Register user
POST /api/auth/login - Login user
GET /api/auth/logout - Logout user
POST /api/auth/refresh-token - Refresh token
POST /api/auth/logout-all - Logout all sessions

```

### Leads

```

POST /api/lead/create - Create lead
GET /api/lead/get - Get all leads (paginated)
GET /api/lead/get/:id - Get lead details
GET /api/lead/update/:id - Update lead
DELETE /api/lead/delete/:id - Delete lead

```

### Query Parameters

```

page - Page number (default: 1)
limit - Records per page (default: 10)
search - Search by name/email
status - Filter by new/contacted/qualified/lost
source - Filter by website/instagram/referral
sort - latest or oldest

```

## 🧪 Testing Checklist

- [✅] User registration flow
- [✅] User login flow
- [✅] Create new lead
- [✅] Update lead
- [✅] Delete lead
- [✅] Search leads (debounced)
- [✅] Filter by status
- [✅] Filter by source
- [✅] Pagination (previous/next)
- [✅] CSV export
- [✅] Logout
