# API Documentation - LeadFlow

**Base URL:** `http://localhost:5000/api` (Development)  
**Base URL:** `https://api.ashutosh-lead.vercel.app/api` (Production - if deployed)

## 📚 Table of Contents

- [Authentication](#authentication)
- [Leads API](#leads-api)
- [Error Handling](#error-handling)
- [Response Format](#response-format)
- [Request Headers](#request-headers)

---

## 🔐 Authentication

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "sales_user"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales_user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400/409):**

```json
{
  "success": false,
  "message": "Email already exists",
  "errors": ["user.email.unique"]
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales_user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "sales_user"
  }
}
```

---

### 5. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👥 Leads API

### 1. Create Lead

**Endpoint:** `POST /api/lead`

**Headers:**

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "status": "new",
  "source": "website"
}
```

**Validation Rules:**

- `name`: Required, string, min 2 chars, max 100 chars
- `email`: Required, valid email format
- `status`: Required, enum: `new`, `contacted`, `qualified`, `lost`
- `source`: Required, enum: `website`, `instagram`, `referral`

**Success Response (201):**

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "status": "new",
    "source": "website",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2026-05-19T10:30:00Z",
    "updatedAt": "2026-05-19T10:30:00Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

---

### 2. Get All Leads (with Filtering, Search, Sort, Pagination)

**Endpoint:** `GET /api/lead`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Query Parameters:**

```
?page=1
&limit=10
&search=rahul
&status=qualified
&source=instagram
&sort=latest
```

**Parameters:**

- `page`: Page number (default: 1)
- `limit`: Records per page (default: 10, max: 100)
- `search`: Search by name or email (optional)
- `status`: Filter by status (optional) - `new`, `contacted`, `qualified`, `lost`
- `source`: Filter by source (optional) - `website`, `instagram`, `referral`
- `sort`: Sort order (optional) - `latest`, `oldest` (default: `latest`)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": {
    "leads": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Rahul Kumar",
        "email": "rahul@example.com",
        "status": "qualified",
        "source": "instagram",
        "createdBy": "507f1f77bcf86cd799439011",
        "createdAt": "2026-05-19T10:30:00Z",
        "updatedAt": "2026-05-19T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 3. Get Single Lead

**Endpoint:** `GET /api/lead/:id`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**URL Parameters:**

- `id`: Lead ID (MongoDB ObjectId)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "status": "qualified",
    "source": "instagram",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-05-19T10:30:00Z",
    "updatedAt": "2026-05-19T10:30:00Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

### 4. Update Lead

**Endpoint:** `PATCH /api/lead/:id`

**Headers:**

```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**URL Parameters:**

- `id`: Lead ID

**Request Body:** (All fields optional)

```json
{
  "name": "Rahul Kumar Updated",
  "email": "rahul.updated@example.com",
  "status": "contacted",
  "source": "referral"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Rahul Kumar Updated",
    "email": "rahul.updated@example.com",
    "status": "contacted",
    "source": "referral",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2026-05-19T10:30:00Z",
    "updatedAt": "2026-05-19T10:35:00Z"
  }
}
```

---

### 5. Delete Lead

**Endpoint:** `DELETE /api/lead/:id`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**URL Parameters:**

- `id`: Lead ID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Rahul Kumar",
    "email": "rahul@example.com"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

## 🔄 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

---

## ❌ Error Handling

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 200         | OK - Request successful                 |
| 201         | Created - Resource created successfully |
| 400         | Bad Request - Invalid input data        |
| 401         | Unauthorized - Missing or invalid token |
| 403         | Forbidden - Insufficient permissions    |
| 404         | Not Found - Resource not found          |
| 409         | Conflict - Resource already exists      |
| 500         | Internal Server Error - Server error    |

### Common Error Messages

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "name": "Name is required"
  }
}
```

```json
{
  "success": false,
  "message": "Authentication failed",
  "errors": ["Invalid credentials"]
}
```

---

## 📋 Request Headers

Required headers for authenticated requests:

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

---

## 🧪 Example cURL Requests

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "sales_user"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Create Lead

```bash
curl -X POST http://localhost:5000/api/lead \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "status": "new",
    "source": "website"
  }'
```

### Get All Leads (with filters)

```bash
curl -X GET "http://localhost:5000/api/lead?page=1&limit=10&status=qualified&source=instagram&sort=latest" \
  -H "Authorization: Bearer {accessToken}"
```

### Update Lead

```bash
curl -X PATCH http://localhost:5000/api/lead/{leadId} \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted"
  }'
```

### Delete Lead

```bash
curl -X DELETE http://localhost:5000/api/lead/{leadId} \
  -H "Authorization: Bearer {accessToken}"
```

---

## 🔒 Authentication Flow

1. **Register** → Get access & refresh tokens
2. **Login** → Get access & refresh tokens
3. **Use Access Token** → Include in Authorization header
4. **Token Expires** → Use refresh token to get new access token
5. **Logout** → Invalidate tokens

---

## 📌 Notes

- All timestamps are in ISO 8601 format (UTC)
- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days
- Pagination: Default 10 records, max 100 records per page
- Search is case-insensitive
- Multiple filters can be combined
