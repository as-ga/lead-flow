# Architecture - LeadFlow

Comprehensive guide to the project architecture, design patterns, and technology decisions.

---

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Next.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Components + TailwindCSS              │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Pages: Home, Dashboard, Auth, Users         │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   State Management: Zustand + TanStack Query       │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Auth Store | Leads Store | UI State         │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     API Client: Axios + Interceptors               │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Request Headers | Response Transform       │  │  │
│  │  │  Token Refresh | Error Handling             │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕↕↕ HTTP
┌─────────────────────────────────────────────────────────────┐
│                  Server (Express.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Middleware Stack                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  CORS | Body Parser | Cookie Parser          │  │  │
│  │  │  Auth Middleware | Error Handler             │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Routes Layer                        │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  /api/auth/    (Authentication)             │  │  │
│  │  │  /api/lead/    (Lead Management)            │  │  │
│  │  │  /api/user/    (User Management)            │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                Controller Layer                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Auth Controllers | Lead Controllers        │  │  │
│  │  │  Validation | Business Logic               │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Model Layer                         │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  User Model | Lead Model | Schemas          │  │  │
│  │  │  Indexes | Validations | Methods            │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕↕↕
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections:                                        │  │
│  │  • users    (Authentication & User Data)           │  │
│  │  • leads    (Lead Records)                         │  │
│  │  • sessions (Session Management)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Patterns

### 1. MVC (Model-View-Controller)

**Backend Structure:**

```
server/
├── models/           → Data Models (MongoDB Schemas)
├── modules/
│   └── */
│       ├── *routes.ts       → Routes (Controllers)
│       ├── *controllers.ts  → Business Logic
│       └── *validations.ts  → Input Validation
└── middlewares/      → Cross-cutting Concerns
```

**Example - Lead Module:**

```typescript
// lead.ts (Model)
interface Lead {
  name: string;
  email: string;
  status: "new" | "contacted" | "qualified" | "lost";
  source: "website" | "instagram" | "referral";
}

// lead.routes.ts (Router)
router.post("/", validateCreateLead, createLead);
router.get("/", getLeads);

// lead.controllers.ts (Business Logic)
export const createLead = asyncHandler(async (req, res) => {
  // Validation, Processing, Response
});
```

### 2. Repository Pattern (Models as Repositories)

Models handle all database operations:

```typescript
// In models/lead.ts
const leadSchema = new Schema({...});
leadSchema.static('findByEmail', async function(email) {
  return this.findOne({ email });
});
leadSchema.query.active = function() {
  return this.where({ deletedAt: null });
};
```

### 3. Middleware Pattern

Clean request/response pipeline:

```typescript
app
  .use(cors) // CORS middleware
  .use(express.json()) // Body parser
  .use(cookieParser()) // Cookie parser
  .use(errorHandler) // Error handling
  .use(routes); // API routes
```

### 4. Async/Await Pattern

Consistent async error handling:

```typescript
// asyncHandler wraps async functions
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
export const createLead = asyncHandler(async (req, res) => {
  // No try-catch needed
  const lead = await Lead.create(req.body);
  res.status(201).json({ data: lead });
});
```

### 5. Centralized Error Handling

```typescript
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Global error middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors,
  });
});
```

---

## 💾 Database Schema

### User Schema

```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'admin' | 'sales_user',
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `email` (unique)
- `createdAt` (for sorting)

### Lead Schema

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  status: 'new' | 'contacted' | 'qualified' | 'lost',
  source: 'website' | 'instagram' | 'referral',
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `email` (for search)
- `status` (for filtering)
- `source` (for filtering)
- `createdBy` (for user leads)
- `createdAt` (for sorting)
- Compound: `(status, source, createdAt)`

---

## 🔐 Authentication Flow

```
┌──────────────┐
│   Register   │
└──────┬───────┘
       │ POST /auth/register
       │ {name, email, password, role}
       ↓
┌──────────────────────────────────┐
│  Validate Input                  │
│  Hash Password (bcrypt)          │
│  Create User in DB               │
└──────┬───────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Generate JWT Tokens             │
│  • Access Token (1 hour)         │
│  • Refresh Token (7 days)        │
└──────┬───────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Return Tokens + User Data       │
│  Store in Secure HTTP-Only       │
│  Cookies or LocalStorage         │
└──────────────────────────────────┘


┌──────────────┐
│    Login     │
└──────┬───────┘
       │ POST /auth/login
       │ {email, password}
       ↓
┌──────────────────────────────────┐
│  Find User by Email              │
│  Compare Passwords               │
│  Validate Credentials            │
└──────┬───────────────────────────┘
       │
       ├─── Invalid ──→ 401 Unauthorized
       │
       ├─── Valid ──→ Generate New Tokens
       │
       ↓
┌──────────────────────────────────┐
│  Return Tokens + User Data       │
└──────────────────────────────────┘


┌──────────────────────────────────┐
│  Protected Route Request         │
│  GET /api/lead                   │
│  Header: Authorization: Bearer {token}
└──────┬───────────────────────────┘
       │
       ↓
┌──────────────────────────────────┐
│  Verify JWT Token                │
│  Extract User Info               │
│  Attach to Request               │
└──────┬───────────────────────────┘
       │
       ├─── Invalid ──→ 401 Unauthorized
       │
       ├─── Expired ──→ Use Refresh Token
       │
       ├─── Valid ──→ Continue to Handler
       │
       ↓
┌──────────────────────────────────┐
│  Execute Route Handler           │
│  Access req.user                 │
└──────────────────────────────────┘
```

---

## 📊 State Management (Frontend)

### Zustand Stores

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email, password) => Promise<void>;
  logout: () => void;
}

// leadsStore.ts
interface LeadsState {
  leads: Lead[];
  pagination: PaginationMeta;
  filters: FilterState;
  setFilters: (filters) => void;
  fetchLeads: () => Promise<void>;
}
```

### TanStack Query (Data Fetching)

```typescript
// Query example
const { data, isLoading, error } = useQuery({
  queryKey: ["leads", filters],
  queryFn: () => fetchLeads(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});

// Mutation example
const mutation = useMutation({
  mutationFn: (newLead) => createLead(newLead),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  },
});
```

---

## 🔄 API Request/Response Flow

### Frontend Request

```typescript
// 1. Create request with auth token
const response = await api.post("/lead", leadData);

// 2. Axios interceptor adds token
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 3. Handle 401 (token expired)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Refresh token
      // Retry request
    }
  }
);
```

### Backend Response

```typescript
// 1. Receive request in route handler
router.post('/', validateCreateLead, createLead);

// 2. Execute business logic in controller
export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({
    ...req.body,
    createdBy: req.user._id
  });

  return apiResponse.success(res, lead, 'Lead created', 201);
});

// 3. Return standardized response
{
  "success": true,
  "message": "Lead created",
  "data": { /* lead object */ }
}
```

---

## 🛡️ Security Architecture

### Password Security

```typescript
// Registration - Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Login - Compare passwords
const isValid = await bcrypt.compare(password, user.password);
```

### Token Security

```typescript
// JWT Secret (stored in environment)
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// HTTP-only cookies prevent XSS
res.cookie("accessToken", token, {
  httpOnly: true, // JS cannot access
  secure: true, // HTTPS only
  sameSite: "strict", // CSRF protection
});
```

### CORS Security

```typescript
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Only allow frontend
    credentials: true, // Allow cookies
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
```

### Input Validation

```typescript
// Zod schema for validation
const createLeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  status: z.enum(["new", "contacted", "qualified", "lost"]),
  source: z.enum(["website", "instagram", "referral"]),
});

// Validate before processing
const result = createLeadSchema.parse(req.body);
```

---

## 📈 Scalability Considerations

### Database Indexing

Indexes on frequently filtered/searched fields:

- Lead status, source, email
- User email
- Creation dates

### Query Optimization

```typescript
// Lean queries for read-only operations
const leads = await Lead.find(filter).lean();

// Pagination to limit results
const leads = await Lead.find(filter)
  .skip((page - 1) * limit)
  .limit(limit);

// Select only needed fields
const leads = await Lead.find().select("name email status");
```

### Caching Strategy

```typescript
// Frontend caching with TanStack Query
staleTime: 5 * 60 * 1000; // 5 min - consider data fresh
gcTime: 10 * 60 * 1000; // 10 min - keep in cache

// Backend could add:
// - Redis for session/token caching
// - Response compression
// - Database connection pooling
```

### Pagination

```typescript
// Mandatory for large datasets
limit: 10 records per page
max limit: 100

// Reduces memory usage and improves performance
```

---

## 🧪 Testing Strategy

### Backend Testing

```typescript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/*.spec.ts"],
};

// Example test
describe("Lead Controller", () => {
  test("should create a new lead", async () => {
    const res = await request(app)
      .post("/api/lead")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test", email: "test@test.com" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### Frontend Testing

```typescript
// Vitest + React Testing Library
import { render, screen } from "@testing-library/react";

test("Login form validates email", () => {
  render(<LoginForm />);
  const input = screen.getByPlaceholderText("Email");
  // ... assertions
});
```

---

## 🚀 Deployment Architecture

### Development Environment

```
localhost:3000 (Client)
    ↓
localhost:5000 (Server)
    ↓
localhost:27017 (MongoDB)
```

### Docker Environment

```
Docker Compose
├── lead-flow-client (port 3000)
├── lead-flow-server (port 5000)
└── lead-flow-mongodb (port 27017)

All connected via lead-flow-network
```

### Production Environment (Example)

```
Vercel (Frontend)
    ↓
API Server (Render/Railway/AWS)
    ↓
MongoDB Atlas (Cloud Database)
```

---

## 📋 Key Files

| File                                        | Purpose                   |
| ------------------------------------------- | ------------------------- |
| `server/src/app.ts`                         | Express app configuration |
| `server/src/server.ts`                      | Server entry point        |
| `server/src/config/db.ts`                   | MongoDB connection        |
| `server/src/config/env.ts`                  | Environment config        |
| `server/src/middlewares/auth.middleware.ts` | JWT middleware            |
| `server/src/utils/asyncHandler.ts`          | Async error wrapper       |
| `client/app/layout.tsx`                     | Root layout               |
| `client/app/page.tsx`                       | Home page                 |
| `docker-compose.yml`                        | Docker orchestration      |

---

## 🔗 Related Documentation

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation & setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
