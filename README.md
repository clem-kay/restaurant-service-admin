# Restaurant Service Admin Panel

A multi-restaurant admin panel built with React, Vite, TanStack Query, Zustand, and shadcn/ui. Connects to the NestJS backend at `../restaurant-service/`.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Environment Variables](#4-environment-variables)
5. [Role-Based Access Control](#5-role-based-access-control)
6. [Feature Guide](#6-feature-guide)
7. [Architecture](#7-architecture)
8. [State Management](#8-state-management)
9. [Real-Time Notifications](#9-real-time-notifications)
10. [API Integration](#10-api-integration)
11. [Routing](#11-routing)

---

## 1. Overview

This admin panel serves three distinct user roles — Platform Admin, Restaurant Admin, and Restaurant Staff — each with a tailored view of the platform.

| Role | What they see |
|---|---|
| `PLATFORM_ADMIN` | All restaurants, all users, platform-wide analytics, can drill down into any restaurant |
| `RESTAURANT_ADMIN` | Own restaurant's orders, menu, categories, staff, customers, analytics |
| `RESTAURANT_STAFF` | Own restaurant's orders, walk-in order creation, team members, customers |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript 5 |
| Routing | React Router v6 |
| Server state | TanStack Query (React Query) v5 |
| Client state | Zustand |
| UI components | shadcn/ui + Tailwind CSS |
| HTTP client | Axios (with JWT refresh interceptor) |
| Real-time | socket.io-client v4 |
| Toast notifications | react-hot-toast |
| Icons | lucide-react |
| Theme | next-themes (light/dark) |

---

## 3. Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Backend running (see `../restaurant-service/`)

### Installation

```bash
cd restaurant-service-admin
npm install
```

### Configuration

```bash
cp .env.local.example .env.local
# Edit .env.local — set VITE_BASE_URL to the backend URL
```

### Running

```bash
# Development with hot-reload
npm run dev

# Production build
npm run build
npm run preview
```

The app runs at `http://localhost:5173` by default.

---

## 4. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_BASE_URL` | Yes | Backend API base URL (e.g. `http://localhost:3000/api/v1/`) |

---

## 5. Role-Based Access Control

Role is read from the JWT stored in Zustand's `useAuthStore`. Every protected page and nav item checks the role.

### Navigation visibility

| Nav item | PLATFORM_ADMIN | RESTAURANT_ADMIN | RESTAURANT_STAFF |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ |
| Inventory (Menu) | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | ✅ |
| Riders | ✅ | ✅ | ❌ |
| Team | ❌ | ✅ | ✅ |
| Restaurants | ✅ | ❌ | ❌ |

### Data scoping

- **RESTAURANT_ADMIN / RESTAURANT_STAFF** — all API calls hit restaurant-scoped endpoints (`/orders/mine`, `/foodmenu/mine`, `/category/mine`, `/customer/mine`). The backend resolves the restaurant from the JWT automatically.
- **PLATFORM_ADMIN** — hits platform-wide endpoints. When a restaurant is selected (via the "Enter" button on the Restaurants page), a context banner appears and all data views automatically scope to that restaurant.

---

## 6. Feature Guide

### Dashboard

- **PLATFORM_ADMIN** — platform-wide stats: total restaurants, pending approvals, total revenue, total customers, total riders, total orders.
- **PLATFORM_ADMIN (drill-down)** — when a restaurant is selected, shows restaurant-scoped stats instead.
- **RESTAURANT_ADMIN / RESTAURANT_STAFF** — restaurant stats: total orders, today's sales, previous month revenue, total menu items, total categories, total staff.

### Orders

- Paginated, filterable table (food status, payment status).
- **Status update** — RESTAURANT_ADMIN/STAFF see a per-row dropdown with valid next transitions only:
  ```
  PENDING → ACCEPTED / CANCELLED
  ACCEPTED → PREPARING / CANCELLED
  PREPARING → READY / CANCELLED
  READY → PICKED_UP
  PICKED_UP → DELIVERED
  ```
- **Walk-in Order** button (RESTAURANT_ADMIN/STAFF):
  - Enter customer name + optional phone
  - Search and add menu items from the restaurant's live menu
  - Adjust quantities inline
  - Add an optional note
  - Submits to `POST /orders/walkin`
  - All fields clear on cancel or successful submission

### Inventory (Menu)

- List, create, update, and delete food menu items grouped by category.
- Restaurant staff see only their restaurant's items.

### Customers

- **PLATFORM_ADMIN** — all customers on the platform.
- **RESTAURANT_ADMIN / RESTAURANT_STAFF** — customers who have placed at least one order at their restaurant (hits `GET /customer/mine`).

### Riders

- Available to PLATFORM_ADMIN and RESTAURANT_ADMIN.
- Lists rider profiles with status.

### Team (Staff Management)

- Available to RESTAURANT_ADMIN and RESTAURANT_STAFF.
- RESTAURANT_ADMIN can add new staff or co-admin accounts.
- RESTAURANT_STAFF can view the team (read-only).

### Restaurants (PLATFORM_ADMIN only)

- Full list of restaurants with approval status.
- **Approve / Revoke** — toggles `isApproved` via `PATCH /restaurant/:id/approve`.
- **Enter** — sets the selected restaurant context and navigates to the dashboard scoped to that restaurant.
- **Create Restaurant** — dialog with all fields; optionally creates an admin account in the same step.

### Notifications

- Bell icon in the header with an unread badge (max "9+").
- Popover shows the notification list with read/unread state.
- Real-time delivery via Socket.io (`notification:new` event).
- "Mark all read" button.

---

## 7. Architecture

### Directory structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── SidePanel.tsx          — sticky sidebar with role-filtered nav
│   │   ├── CollapsedSidebar.tsx   — mobile sheet sidebar
│   │   ├── NotificationBell.tsx   — bell + popover
│   │   ├── AccountAvatar.tsx      — user avatar + logout
│   │   ├── SearchBar.tsx
│   │   └── users/
│   │       ├── UserAccountsTable.tsx
│   │       └── UserTableHeaderBtns.tsx
│   ├── Theme/
│   └── ui/                        — shadcn/ui components
├── constants/
│   └── constants.ts               — EndPoints enum, QueryKeys enum
├── hooks/
│   ├── auth/
│   ├── category/
│   ├── customers/
│   │   └── useCustomers.tsx       — role-aware: /customer or /customer/mine
│   ├── dashboard/
│   │   └── useDashboard.tsx
│   ├── menu/
│   │   └── useMenu.ts
│   ├── notifications/
│   │   └── useNotifications.ts    — REST + Socket.io combined
│   ├── orders/
│   │   └── useOrders.tsx          — role-aware: /orders or /orders/mine
│   └── restaurants/
│       └── useRestaurants.tsx
├── pages/
│   ├── AdminPage.tsx              — layout: sidebar + header + <Outlet>
│   ├── DashboardStatsPage.tsx
│   ├── OrdersPage.tsx
│   ├── CustomersPage.tsx
│   ├── RestaurantsPage.tsx
│   └── ...
├── services/
│   └── api-client.ts              — Axios instance + JWT refresh interceptor
├── store/
│   ├── useAuthStore.ts            — JWT + user info (persisted)
│   └── useRestaurantStore.ts      — PLATFORM_ADMIN drill-down context
└── main.tsx
```

---

## 8. State Management

### `useAuthStore` (Zustand, persisted)

Stores the logged-in user's identity and tokens.

```typescript
interface AuthState {
  user: { sub: number; username: string; role: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user, accessToken, refreshToken) => void;
  clearAuth: () => void;
}
```

The Axios interceptor reads `accessToken` from this store and automatically refreshes it on 401.

### `useRestaurantStore` (Zustand, in-memory)

Tracks the restaurant a PLATFORM_ADMIN is currently inspecting.

```typescript
interface RestaurantStore {
  selectedRestaurant: RestaurantResponse | null;
  setSelectedRestaurant: (restaurant: RestaurantResponse | null) => void;
  clearSelectedRestaurant: () => void;
}
```

When `selectedRestaurant` is set:
- A context banner appears in the header: "Viewing: **Restaurant Name** [✕]"
- All data hooks (`useOrders`, `useMenu`, `useCategory`, `useDashboard`) pass `?restaurantId=X` to the backend

---

## 9. Real-Time Notifications

`useNotifications` hook (`src/hooks/notifications/useNotifications.ts`):

1. Fetches initial notifications via `GET /notifications` (TanStack Query).
2. Opens a Socket.io connection to the `/tracking` namespace.
3. Emits `user:join { userId }` to subscribe to the personal room.
4. Listens for `notification:new` — prepends incoming notifications to the React Query cache without a refetch.

`NotificationBell` component (`src/components/Dashboard/NotificationBell.tsx`):

- Shows a red badge with the unread count (capped at "9+")
- Click opens a popover with the notification list
- Clicking a notification marks it read via `PATCH /notifications/:id/read`
- "Mark all read" button

---

## 10. API Integration

### Axios instance (`src/services/api-client.ts`)

- Base URL from `VITE_BASE_URL`
- Attaches `Authorization: Bearer <accessToken>` to every request
- On 401: pauses all pending requests, calls `POST /auth/refresh`, retries with new token
- On refresh failure: clears auth and redirects to `/login`

### TanStack Query

All server data is fetched via React Query hooks in `src/hooks/`. Query keys include role and `selectedRestaurant?.id` so that switching restaurants automatically invalidates caches.

---

## 11. Routing

```
/                    → redirect to /login
/login               → LoginPage
/onboarding          → OnboardingPage (restaurant self-registration)
/admin               → AdminPage (layout)
  /admin/dashboard   → DashboardStatsPage
  /admin/orders      → OrdersPage
  /admin/inventory   → InventoryPage (menu management)
  /admin/customers   → CustomersPage
  /admin/riders      → RidersPage
  /admin/users       → UserAccountsPage (Team)
  /admin/restaurants → RestaurantsPage (PLATFORM_ADMIN only)
  /admin/register    → RegisterUserPage (create staff/user)
```

All `/admin/*` routes are protected — unauthenticated users are redirected to `/login`.
