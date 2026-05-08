# Smart Campus Operations Hub

A full-stack web application that centralises day-to-day campus operations — from booking shared facilities to reporting and resolving maintenance incidents — into a single role-based platform for students, technicians, and administrators.

Built as a Programming Application Frameworks (PAF) project using **Spring Boot 3** on the backend, **React 19 + Vite** on the frontend, and **MongoDB Atlas** as the data store.

---

## Project Idea

University and college campuses run on dozens of shared resources (labs, lecture halls, sports facilities, AV equipment) and constant maintenance work (broken projectors, leaking taps, network outages). These activities are usually handled through scattered spreadsheets, emails, and WhatsApp groups, which leads to double-bookings, lost incident reports, and slow technician response.

**Smart Campus Operations Hub** solves this by giving each campus role a dedicated workspace inside one application:

- **Students / Staff** can browse campus resources, book them within published availability windows, and report maintenance issues with photo attachments.
- **Technicians** see a queue of assigned tickets, update status as work progresses, and add resolution notes.
- **Administrators** manage the resource catalogue, oversee bookings, triage and assign tickets, and monitor activity through dashboards and analytics.

The system enforces a structured workflow (Open → Assigned → In Progress → Resolved / Rejected) with role-based access control, so every action has clear ownership and an audit trail.

---

## Key Features

### Authentication & Authorisation
- Email/password sign-up and login with JWT-based stateless sessions.
- **Google OAuth2** single sign-on for students and staff.
- Role selection on first login with secret access codes for `ADMIN` and `TECHNICIAN` roles (regular users default to `USER`).
- Spring Security filter chain with role-based route protection on every API.

### Resource & Facility Management
- Admin CRUD for campus resources (name, location, description, capacity, images, availability windows).
- Per-resource availability windows (day-of-week + time range) so users can only book inside published hours.
- Public resource catalogue with search, filtering, and detailed resource pages.

### Booking System
- Students request bookings for a chosen resource, date, and time slot.
- Conflict detection prevents overlapping bookings on the same resource.
- "My Bookings" view for users; full booking dashboard for admins.
- Calendar view (powered by `react-big-calendar`) for at-a-glance scheduling.

### Maintenance Incident / Ticket Workflow
- Users report incidents with title, description, category, priority, location, contact number, and **multiple file attachments**.
- Admins triage, assign tickets to technicians, or reject with a reason.
- Technicians progress tickets through status states and add resolution notes / comments.
- File uploads stored on disk under `uploads/tickets` and served via static resource handler.
- Ticket detail page shows full history including comments, attachments, and timeline.

### Dashboards & Analytics
- Admin dashboard with KPI cards and charts (built with `recharts`) for tickets, bookings, and resource utilisation.
- Technician workload view.
- Student personal dashboard summarising their bookings and reported tickets.

---

## Tech Stack

### Backend — `smart-campus-backend/`
| Layer | Technology |
|------|------------|
| Language / Runtime | Java 21 |
| Framework | Spring Boot 3.5 |
| Web | Spring Web (REST controllers) |
| Security | Spring Security + OAuth2 Client + JWT (`jjwt` 0.12.6) |
| Persistence | Spring Data MongoDB |
| Database | MongoDB Atlas |
| Validation | Jakarta Bean Validation |
| File Storage | Local filesystem (`uploads/tickets`) served as static resources |
| Build Tool | Maven (with `mvnw` wrapper) |
| Helpers | Lombok, Spring Boot DevTools |

### Frontend — `smart-campus-frontend/`
| Layer | Technology |
|------|------------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 + `tailwindcss-animate` |
| Routing | React Router 7 |
| HTTP Client | Axios |
| Icons | `lucide-react`, `react-icons` |
| Notifications | `react-hot-toast` |
| Calendar | `react-big-calendar` + `moment` |
| Charts | `recharts` |

---

## Architecture

```
┌──────────────────────────────┐         ┌──────────────────────────────┐
│   smart-campus-frontend      │         │   smart-campus-backend       │
│   (React + Vite, port 3000)  │  HTTPS  │   (Spring Boot, port 8080)   │
│                              │ ──────► │                              │
│  • Pages / Layouts           │  JWT in │  • REST Controllers          │
│  • Axios services            │ Authoriz│  • Service layer             │
│  • Auth context              │  ation  │  • Repositories (Mongo)      │
│  • Role-based routes         │  header │  • Security filters          │
└──────────────────────────────┘         └──────────────┬───────────────┘
                                                        │
                                                        ▼
                                         ┌──────────────────────────────┐
                                         │       MongoDB Atlas          │
                                         │  collections: users,         │
                                         │  resources, bookings,        │
                                         │  tickets                     │
                                         └──────────────────────────────┘
```

### Backend package layout (`com.smartcampus.backend`)
```
backend/
├── BackendApplication.java     # Spring Boot entry point
├── config/                     # CORS, MongoDB, file storage, web config
├── controller/                 # AuthController, ResourceController,
│                               # BookingController, TicketController,
│                               # AdminController, DashboardController, ...
├── dto/                        # Request / response DTOs
├── exception/                  # Global exception handler & custom exceptions
├── model/                      # AppUser, Resource, AvailabilityWindow,
│                               # Booking, Ticket, TicketComment, enums
│                               # (Role, AuthProvider, TicketStatus,
│                               #  TicketPriority, TicketCategory)
├── repository/                 # Spring Data MongoDB repositories
├── security/                   # JWT filter, OAuth2 success handler,
│                               # SecurityConfig, principal user details
├── service/                    # AuthService, ResourceService,
│                               # BookingService, TicketService + impls
└── util/                       # Helpers (date, file, mappers)
```

### Frontend layout (`src/`)
```
src/
├── main.jsx, App.jsx           # App bootstrap & router
├── layouts/                    # Shared shells (e.g. Sidebar layouts)
├── components/                 # Reusable UI: Layout, Sidebar,
│                               # ProtectedRoute, resource components
├── pages/
│   ├── AuthPage.jsx            # Login / register
│   ├── OAuth2SuccessPage.jsx   # Google OAuth callback handling
│   ├── RoleSelectionPage.jsx   # First-time role + access code
│   ├── Home.jsx, DashboardPage.jsx
│   ├── ResourcesPage.jsx, ResourceDashboard.jsx
│   ├── NewBooking.jsx, MyBookings.jsx, Calendar.jsx, BookingDashboard.jsx
│   ├── TicketDetailsPage.jsx
│   ├── Admin/                  # Admin-only screens
│   ├── Technician/             # Technician queue & ticket workspace
│   └── Student/                # Student-facing views
├── services/                   # api.js (axios instance), auth.js,
│                               # resourceService.js, bookingService.js,
│                               # ticket.js
├── context/                    # Auth & user context providers
└── config/                     # API base URL, constants
```

---

## Domain Model (high level)

- **AppUser** — `id, name, email, password (hashed), role, authProvider (LOCAL | GOOGLE), avatarUrl`
- **Role** — `USER | ADMIN | TECHNICIAN`
- **Resource** — `id, name, description, location, capacity, images, availabilityWindows[]`
- **AvailabilityWindow** — `dayOfWeek, startTime, endTime`
- **Booking** — `id, resourceId, userId, startTime, endTime, status, createdAt`
- **Ticket** — `id, title, description, resourceLocation, category, priority, status, contactNumber, attachmentUrls[], reporterId/Name, assignedTechnicianId/Name, rejectionReason, resolutionNotes, createdAt, updatedAt`
- **TicketComment** — embedded comments on a ticket
- Enums — `TicketStatus`, `TicketPriority`, `TicketCategory`, `AuthProvider`

---

## API Overview

All endpoints are prefixed with the backend base URL (default `http://localhost:8080`). Protected endpoints require an `Authorization: Bearer <jwt>` header.

| Area | Method & Path | Role |
|------|---------------|------|
| Auth | `POST /api/auth/register` | Public |
| Auth | `POST /api/auth/login` | Public |
| Auth | `GET  /api/auth/me` | Authenticated |
| Auth | `POST /api/auth/role` | Authenticated (first-time role pick) |
| Auth | `GET  /oauth2/authorization/google` | Public (starts Google SSO) |
| Resources | `GET  /api/resources` | Authenticated |
| Resources | `POST /api/resources` | ADMIN |
| Resources | `PUT  /api/resources/{id}` | ADMIN |
| Resources | `DELETE /api/resources/{id}` | ADMIN |
| Bookings | `POST /api/bookings` | USER |
| Bookings | `GET  /api/bookings/me` | USER |
| Bookings | `GET  /api/bookings` | ADMIN |
| Tickets | `POST /api/tickets` (multipart with attachments) | USER |
| Tickets | `GET  /api/tickets` | ADMIN / TECHNICIAN (filtered) |
| Tickets | `GET  /api/tickets/{id}` | Owner / ADMIN / assigned TECHNICIAN |
| Tickets | `PUT  /api/tickets/{id}/assign` | ADMIN |
| Tickets | `PUT  /api/tickets/{id}/status` | TECHNICIAN |
| Tickets | `PUT  /api/tickets/{id}/reject` | ADMIN |
| Dashboard | `GET  /api/dashboard/*` | Role-scoped stats |

> The exact request/response shapes live in [smart-campus-backend/src/main/java/com/smartcampus/backend/dto/](smart-campus-backend/src/main/java/com/smartcampus/backend/dto/).

---

## Getting Started

### Prerequisites
- **Java 21** (JDK)
- **Node.js 18+** and npm
- **MongoDB Atlas** cluster (or local MongoDB instance)
- A **Google Cloud OAuth2 Client** (only needed if you want Google sign-in locally)

### 1. Clone the repository
```bash
git clone https://github.com/<your-org>/PAF_Project_SmartCampus.git
cd PAF_Project_SmartCampus
```

### 2. Configure backend environment

The backend reads sensitive values from environment variables and falls back to defaults in [smart-campus-backend/src/main/resources/application.properties](smart-campus-backend/src/main/resources/application.properties). For local development you can either edit that file or export variables before starting Spring Boot:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `APP_JWT_SECRET` | At least 256-bit JWT signing secret |
| `APP_FRONTEND_URL` | Frontend origin (e.g. `http://localhost:3000`) |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |
| `APP_ADMIN_ROLE_CODE` | Secret code required to claim the ADMIN role |
| `APP_TECHNICIAN_ROLE_CODE` | Secret code required to claim the TECHNICIAN role |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth2 credentials |
| `APP_BASE_URL` | Public base URL of the backend (used for attachment links) |

> **Important:** the committed defaults include placeholder credentials for development convenience only. Rotate them and use environment variables before deploying.

### 3. Run the backend
```bash
cd smart-campus-backend
./mvnw spring-boot:run        # macOS / Linux
mvnw.cmd spring-boot:run      # Windows
```
The API starts on `http://localhost:8080`.

### 4. Run the frontend
```bash
cd smart-campus-frontend
npm install
npm run dev
```
Vite serves the app on `http://localhost:3000` (or the next free port). The axios base URL is configured under [smart-campus-frontend/src/config/](smart-campus-frontend/src/config/) and [smart-campus-frontend/src/services/api.js](smart-campus-frontend/src/services/api.js).

### 5. First-time use
1. Register a new account or sign in with Google.
2. On the role selection screen, choose `Student` (default), or enter the access code for `Admin` / `Technician`.
3. Admin: create resources and availability windows.
4. Student: browse resources, book a slot, report a maintenance ticket.
5. Technician: open the assigned ticket queue and progress tickets to resolution.

---

## Project Structure (top level)

```
PAF_Project_SmartCampus/
├── README.md
├── smart-campus-backend/      # Spring Boot REST API
│   ├── pom.xml
│   ├── mvnw, mvnw.cmd
│   ├── run.ps1                # Convenience script
│   ├── src/main/java/com/smartcampus/backend/...
│   ├── src/main/resources/application.properties
│   └── uploads/tickets/       # Uploaded attachments (gitignored)
└── smart-campus-frontend/     # React + Vite SPA
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/...
```

---

## Available Scripts

### Backend
```bash
./mvnw spring-boot:run    # Run dev server with DevTools hot reload
./mvnw test               # Run unit & integration tests
./mvnw clean package      # Build executable jar in target/
```

### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## Roles & Access Control Summary

| Capability | Student (USER) | Technician | Admin |
|-----------|:-------------:|:----------:|:-----:|
| Browse resources | ✅ | ✅ | ✅ |
| Create / edit resources | ❌ | ❌ | ✅ |
| Create a booking | ✅ | ✅ | ✅ |
| View all bookings | ❌ | ❌ | ✅ |
| Report a ticket | ✅ | ✅ | ✅ |
| View assigned tickets | own | assigned | all |
| Assign / reject tickets | ❌ | ❌ | ✅ |
| Update ticket status & resolution | ❌ | ✅ | ✅ |
| Access analytics dashboard | personal | own queue | full |

---

## Contributors

This project was developed as a group submission for the Programming Application Frameworks (PAF) module. See the GitHub contributors list and recent commits for individual contributions.

---

## License

This project is intended for academic use as part of the SLIIT PAF coursework. All rights reserved by the project authors unless otherwise stated.
