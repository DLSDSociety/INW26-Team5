# 💼 JobPortal — Full-Stack Job Portal Web Application

> An internship project built for **Digital Literacy and Skill Development Society (DLSDS)**
> A full-stack job portal connecting Job Seekers, Employers, and Admins.

---

## 📌 Project Overview

JobPortal is a full-stack web application that allows:
- **Job Seekers** to browse, search, and apply for jobs
- **Employers** to post and manage job listings
- **Admins** to manage users, jobs, and platform activity

The project is being built over **3 months** as part of an internship programme at DLSDS.

---

## 🚀 Current Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project setup, Navbar, Home Page, Dark/Light mode | ✅ Complete |
| Phase 2 | Jobs page — listings, search, filters | ✅ Complete  |
| Phase 3 | Login, Register, JWT Authentication | ✅ Complete |
| Phase 4 | Role-based Dashboard, Backend API, MongoDB | ✅ Complete  |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router DOM v6 |
| State / Theme | React Context API |
| Styling | CSS (custom properties, dark/light mode) |
| Backend *(planned)* | Node.js + Express |
| Database *(planned)* | MongoDB |
| Authentication *(planned)* | JWT (JSON Web Tokens) |

---

## 📁 Folder Structure

```
JOB_AND_CAREER_PORTAL/
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/          # Images, logos
    │   ├── components/
    │   │   ├── Navbar.jsx   # ✅ Done
    │   │   └── Navbar.css
    │   ├── context/
    │   │   └── ThemeContext.jsx  # ✅ Dark/Light mode
    │   ├── hooks/
    │   ├── pages/
    │   │   ├── Home.jsx     # ✅ Done
    │   │   ├── Home.css
    │   │   ├── Jobs.jsx     # ✅ Complete 
    │   │   ├── Login.jsx    # ✅ Complete 
    │   │   ├── Register.jsx # ✅ Complete 
    │   │   ├── Dashboard.jsx# ✅ Complete 
    │   │   └── Auth.css
    │   ├── services/
    │   │   └── api.js       # API config (ready for backend)
    │   ├── util/
    │   ├── App.jsx          # ✅ Routes configured
    │   ├── App.css
    │   ├── index.css        # CSS variables (theme)
    │   └── main.jsx         # ✅ ThemeProvider wrapped
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ✅ Features Completed (Phase 1)

### Navbar
- Logo with SVG icon
- Navigation links: Home, Jobs, Login, Register, Dashboard
- Active page highlighting using `useLocation()`
- Dark / Light mode toggle button
- Fully responsive

### Home Page
- **Hero section** with headline, subtext, and search bar
  - Keyword input, Location input, Category dropdown
  - Passes search query params to `/jobs` route
  - Popular search tags (quick-fill)
- **Stats strip** — 10,000+ Jobs, 5,000+ Companies, 50,000+ Seekers, 8,000+ Hires
- **Featured Jobs grid** — 6 mock job cards showing:
  - Company logo initials, job type badge (colour-coded)
  - Title, company, location, salary, category
  - Save button + Apply Now button
- **Employer CTA section** — "Post a Job — It's Free"

### Dark / Light Mode
- Implemented via `ThemeContext` (React Context API)
- Theme toggled via `data-theme` attribute on `<html>`
- CSS custom properties (`--bg-primary`, `--text-primary`, etc.)
- User preference saved to `localStorage` — persists on refresh

### Routing
- All 5 routes registered in `App.jsx`
- Search bar on Home passes `?keyword=&location=&category=` to `/jobs`

---

## 🖥️ Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/job-portal.git

# Navigate to frontend
cd job-portal/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will run at **http://localhost:5173**

---

## 📸 Pages Overview

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Home | `/` | ✅ Complete | Hero, search, featured jobs, stats |
| Jobs | `/jobs` | ✅ Complete  | Listings, filters, search |
| Login | `/login` | ✅ Complete  | JWT auth |
| Register | `/register` |✅ Complete  | Role selection (Seeker / Employer) |
| Dashboard | `/dashboard` |✅ Complete  | Role-based views |

---

## 🔜 Next Steps (Phase 2–4)

### Phase 2 — Jobs Page 
- Full job listings with search and filters
- Job detail page
- Save / unsave jobs
- Employer job CRUD API

### Phase 3 — Auth 
- Login and Register forms
- JWT authentication
- Role-based access control (Seeker / Employer / Admin)
- Protected routes

### Phase 4 — Dashboard + Backend 
- Seeker dashboard: applications, saved jobs, profile strength
- Employer dashboard: posted jobs, applicants
- Admin dashboard: user management, flagged jobs
- Node.js + Express REST API
- MongoDB database integration

---

## 👤 Author

**Mustafa Azad hussain**
Intern — Digital Literacy and Skill Development Society (DLSDS)
Project Duration: 3 Months | Started: March 2026

---

## 📄 License

This project is developed as part of an internship at DLSDS. All rights reserved.
