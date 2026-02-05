# AtDestiny API Documentation

**Base URL**: `http://localhost:5000/api/v1`

---

## Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `POST` | `/auth/register` | Register a new user | No | `name`, `email`, `password`, `phone` (optional) |
| `POST` | `/auth/login` | Login user | No | `email`, `password` |
| `POST` | `/auth/refresh` | Refresh access token | No | `refreshToken` |
| `POST` | `/auth/logout` | Logout user | Yes | None |
| `GET` | `/auth/me` | Get current logged-in user details | Yes | None |

---

## Users (`/users`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `GET` | `/users/profile` | Get own profile details | Yes | None |
| `PUT` | `/users/profile` | Update own profile details | Yes | `name` (optional), `phone` (optional) |
| `GET` | `/users` | Get all users | Yes (Admin) | None |
| `GET` | `/users/:id` | Get specific user details | Yes (Admin) | None |

---

## Services (`/services`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `GET` | `/services` | List all services | No | None |
| `GET` | `/services/:id` | Get service by ID | No | None |
| `GET` | `/services/slug/:slug` | Get service by slug | No | None |
| `POST` | `/services` | Create a new service | Yes (Admin) | `name`, `category`, `description`, `basePrice`, `slug`, `isActive` (opt) |
| `PUT` | `/services/:id` | Update a service | Yes (Admin) | `name` (opt), `category` (opt), `description` (opt), `basePrice` (opt), `isActive` (opt) |
| `DELETE` | `/services/:id` | Delete a service | Yes (Admin) | None |
| `POST` | `/services/:id/packages` | Add a package to a service | Yes (Admin) | `name`, `description`, `price`, `features` (array), `duration` (opt), `isActive` (opt) |

---

## Portfolios (`/portfolios`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `GET` | `/portfolios` | List all portfolios | No | None |
| `GET` | `/portfolios/:id` | Get portfolio details | No | None |
| `POST` | `/portfolios` | Create a new portfolio | Yes (Admin) | `title`, `description` (opt), `serviceId` (opt), `coverImage` (opt), `isActive` (opt) |
| `PUT` | `/portfolios/:id` | Update a portfolio | Yes (Admin) | `title` (opt), `description` (opt), `serviceId` (opt), `coverImage` (opt), `isActive` (opt) |
| `DELETE` | `/portfolios/:id` | Delete a portfolio | Yes (Admin) | None |
| `POST` | `/portfolios/:id/media` | Upload media files | Yes (Admin) | `file` (multipart/form-data) |

---

## Bookings (`/bookings`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `POST` | `/bookings` | Create a new booking | Yes | `serviceId`, `packageId` (opt), `bookingDate`, `bookingTime`, `location` (opt), `notes` (opt) |
| `GET` | `/bookings/me` | Get my bookings | Yes | None |
| `GET` | `/bookings/:id` | Get specific booking | Yes | None |
| `GET` | `/bookings` | Get all bookings | Yes (Admin) | None |
| `PATCH` | `/bookings/:id/status` | Update booking status | Yes (Admin) | `status` (PENDING, CONFIRMED, etc), `adminNotes` (opt) |

---

## Payments (`/payments`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `POST` | `/payments/initiate` | Initiate a payment | Yes | `bookingId`, `amount`, `gateway` (RAZORPAY, STRIPE, etc) |
| `POST` | `/payments/verify` | Verify a payment | Yes | `paymentId`, `gatewayPaymentId`, `gatewayOrderId` (opt), `gatewaySignature` (opt) |
| `GET` | `/payments` | List all payments | Yes (Admin) | None |

---

## Inquiries (`/inquiries`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `POST` | `/inquiries` | Submit a new inquiry | No | `name`, `email`, `phone` (opt), `message` |
| `GET` | `/inquiries` | Get all inquiries | Yes (Admin) | None |
| `GET` | `/inquiries/:id` | Get inquiry details | Yes (Admin) | None |
| `PATCH` | `/inquiries/:id` | Update inquiry status | Yes (Admin) | `status` (NEW, IN_PROGRESS, etc), `response` (opt) |

---

## Admin (`/admin`)

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `GET` | `/admin/dashboard` | Get dashboard stats | Yes (Admin) | None |
| `POST` | `/admin/promote` | Promote a user to Admin | Yes (Admin) | `identifier` (email or name) |

---

## System

| Method | Endpoint | Description | Auth Required | Body Params |
|:---|:---|:---|:---|:---|
| `GET` | `/health` | Server health check | No | None |
| `GET` | `/uploads/*` | Static file access | No | None |
