# DropyHub Partners Platform (Client-Server Architecture)

Operational Admin Portal & Inbound Application Pipeline for DropyHub delivery & warehouse partners.

---

## 🏗️ Architecture Overview

```
Dropyhub_partners/
├── server/                     # Production REST API Server (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/             # Supabase & PostgreSQL client configuration
│   │   ├── controllers/        # Auth, Public Intake, Partner Management controllers
│   │   ├── db/                 # schema.sql & seed.sql for Supabase
│   │   ├── middleware/         # JWT verification, RBAC guard, Error handler
│   │   ├── routes/             # /api/v1/auth, /api/v1/public, /api/v1/admin
│   │   └── index.ts            # Express server bootstrap (Port 5000)
│   └── .env
│
└── client/                     # Staff Admin Dashboard (React + Vite + Tailwind + Lucide)
    ├── src/
    │   ├── api/                # API client with auto-injected JWT
    │   ├── components/         # Navbar, StatsCards, PartnerTable, PartnerDetailModal
    │   ├── context/            # AuthContext (master@dropyhub.com session)
    │   ├── pages/              # LoginPage, DashboardPage
    │   └── App.tsx             # Root router & view guard (Port 5173)
    └── package.json
```

---

## 🚀 Quick Start

### 1. Start Backend API Server
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

### 2. Start Staff Admin Client
```bash
cd client
npm run dev
# Dashboard running at http://localhost:5173
```

---

## 🔐 Staff Access Credentials

* **Staff Email**: `master@dropyhub.com`
* **Default Password**: `masteR&26`
* **Role**: `SUPER_ADMIN`

---

## 🗄️ Database Setup (Supabase)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/lelbaulfwtgaccbsggap).
2. Click on **SQL Editor** in the left sidebar.
3. Open `server/src/db/schema.sql`, copy all contents, and click **RUN**.
4. Open `server/src/db/seed.sql`, copy all contents, and click **RUN**.
5. Copy your **`service_role` secret key** from **Project Settings $\rightarrow$ API Keys** into `server/.env`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_secret_key_here
   ```

---

## 🔌 Connecting `dropyhub-website`

To connect the public application forms in `dropyhub-website` (`ContactHeroForm.tsx` & `WarehouseApplicationForm.tsx`):

```typescript
// Replace the simulate timeout in handleSubmit with:
const response = await fetch('http://localhost:5000/api/v1/public/apply', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: formData.fullName,
    mobileNumber: formData.mobileNumber,
    email: formData.email,
    city: formData.city,
    area: formData.area || formData.location,
    hasBike: formData.hasBike,
    hasLicense: formData.hasLicense,
    preferredCompanies: formData.preferredCompanies || formData.preferredStores,
    jobTypes: formData.jobTypes,
    source: 'DELIVERY_PAGE', // or 'WAREHOUSE_PAGE'
  }),
});

const result = await response.json();
if (result.success) {
  console.log('Registered with Ref:', result.referenceId);
  setSubmitted(true);
}
```
All leads submitted on the website will immediately appear in real-time inside the **Partner Admin Panel**!
