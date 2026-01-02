Here is the `README.md` updated with your specific file structure and project details.

---

# 💎 Loylpass

> **The Next-Generation Loyalty Operating System for Modern Businesses.**

Loylpass is a premium, full-stack SaaS platform designed to bridge the gap between businesses and their customers through seamless, QR-based loyalty programs. Built with performance, security, and aesthetics in mind, it features a glassmorphism-inspired UI and a robust event-driven architecture.

![Loylpass Dashboard Preview](919shots_so.png)
![Loylpass Phone Interface Preview](929shots_so.png)

## ✨ Key Features

### 🏢 For Business Owners

- **Deep Analytics:** Real-time dashboards tracking Customer LTV, Hourly Activity, and Staff Performance (`/dashboard/business`).
- **Dynamic Programs:** Create flexible reward tiers (Points per Dollar, Item-based, Visits).
- **Staff Management:** Manage waiters and track their sales contributions (`/dashboard/business/waiters`).
- **Boost Mode:** Toggle multiplier events (e.g., "Double Points Weekend") with a single click.

### 📱 For Staff (Waiters)

- **Instant POS:** Generate unique, secure QR codes for customers based on bill amount.
- **History Tracking:** View personal sales history (`/dashboard/waiter/history`).

### 👤 For Customers

- **Digital Wallet:** Track progress across multiple businesses in one place (`/dashboard/client`).
- **Seamless Redemption:** Scan-to-redeem logic with real-time balance updates.

### 🛡️ For Platform Admins

- **System Observability:** Real-time database logging of all critical events (Success, Warn, Error).
- **Live Monitoring:** Real server latency tracking and health status indicators (`/dashboard/admin`).
- **Global Registry:** Manage onboarded businesses and subscription statuses (`/dashboard/admin/businesses`).

---

## 🛠️ Tech Stack

This project uses the latest standards in the React/Next.js ecosystem.

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Database:** SQLite (Dev) / PostgreSQL (Prod)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Styling:** Tailwind CSS, [Shadcn UI](https://ui.shadcn.com/), Framer Motion
- **Data Viz:** Recharts
- **Internationalization:** next-intl (i18n) - Supports EN, FR, AR

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/loyelpass.git
cd loyelpass
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth (Generate a secret via `openssl rand -base64 32`)
AUTH_SECRET="your-super-secret-key"

# App URL
AUTH_URL="http://localhost:3000"
```

### 4. Database Setup

Initialize the SQLite database and run migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Seed Data (Crucial)

Populate the database with the Super Admin, a Demo Business, Waiters, and Clients, along with simulated system logs.

```bash
npx prisma db seed
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔐 Access Credentials (Seed Data)

After running the seed script, you can log in with these roles:

| Role               | Email                  | Password      | Access                            |
| :----------------- | :--------------------- | :------------ | :-------------------------------- |
| **Super Admin**    | `admin@loyelpass.com`  | `password123` | `/admin` (System Logs, Registry)  |
| **Business Owner** | `owner@loyelpass.com`  | `password123` | `/business` (Analytics, Programs) |
| **Waiter**         | `waiter@loyelpass.com` | `password123` | `/waiter` (QR Generation)         |
| **Client**         | `client@loyelpass.com` | `password123` | `/client` (Wallet, History)       |

---

## 📂 Project Structure

```bash
src
├── app
│   ├── [locale]             # Localized routes (en, fr, ar)
│   │   ├── (auth)           # Login/Register Pages
│   │   └── (dashboard)      # Protected Layouts
│   │       ├── admin        # Super Admin Control Panel
│   │       ├── business     # Business Owner Dashboard
│   │       ├── client       # Customer Wallet
│   │       └── waiter       # Staff POS Interface
│   └── api                  # Backend API Routes
│       ├── admin            # Admin actions (Stats, Business Mgmt)
│       ├── auth             # NextAuth Endpoints
│       ├── loyalty-programs # Program CRUD
│       ├── purchases        # QR Generation & Scanning
│       └── tickets          # Redemption Logic
├── components
│   ├── Landing              # Marketing Page Components (Hero, Pricing)
│   ├── ui                   # Shadcn Reusable Components
│   └── ...                  # Feature Components (Charts, Modals)
├── lib                      # Utilities
│   ├── logger.ts            # Database Logging System
│   └── prisma.ts            # Prisma Singleton
├── messages                 # Translation Files (i18n)
└── prisma                   # Database Schema & Seed Scripts
```

---

## 🎨 Design Philosophy

Loylpass distinguishes itself with a **"Premium Glass"** aesthetic:

- **Glassmorphism:** Heavy use of `backdrop-blur`, translucent backgrounds, and subtle borders.
- **Aurora Gradients:** Animated background meshes used in dashboards.
- **Interactive Data:** Charts feature gradients, custom tooltips, and entrance animations.
- **Gold & Dark:** A distinct color palette focusing on high-contrast dark modes with gold/amber accents for ranking and rewards.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
