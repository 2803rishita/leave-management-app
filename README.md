# 🗓️ LeaveFlow — Leave Management System

A full-stack leave management web application where employees can apply for leave and employers can approve or reject those requests.

---

## 📁 Project Structure

```
leave-app/
├── backend/                  # Node.js + Express REST API
│   ├── controllers/
│   │   ├── authController.js
│   │   └── leaveController.js
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── User.js           # Mongoose User schema
│   │   └── Leave.js          # Mongoose Leave schema
│   ├── routes/
│   │   ├── auth.js
│   │   └── leaves.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # Vue 3 + Tailwind CSS SPA
    ├── src/
    │   ├── assets/
    │   │   └── main.css
    │   ├── components/       # Shared UI components
    │   ├── router/
    │   │   └── index.js      # Vue Router with guards
    │   ├── services/
    │   │   └── api.js        # Axios instance
    │   ├── store/
    │   │   ├── auth.js       # Pinia auth store
    │   │   └── leave.js      # Pinia leave store
    │   ├── views/
    │   │   ├── layouts/
    │   │   │   ├── EmployeeLayout.vue
    │   │   │   └── EmployerLayout.vue
    │   │   ├── employee/
    │   │   │   ├── DashboardView.vue
    │   │   │   ├── ApplyLeaveView.vue
    │   │   │   └── MyLeavesView.vue
    │   │   ├── employer/
    │   │   │   ├── DashboardView.vue
    │   │   │   └── LeaveRequestsView.vue
    │   │   ├── LoginView.vue
    │   │   └── RegisterView.vue
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/leave_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

> **MongoDB Atlas setup:**
> 1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
> 2. Create a free cluster
> 3. Add a database user
> 4. Whitelist your IP (or `0.0.0.0/0` for development)
> 5. Copy the connection string into `MONGODB_URI`

Start the backend:

```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

Backend runs on: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register employee or employer |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Private | Get current user |

### Leaves
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/leaves` | Employee | Apply for leave |
| GET | `/api/leaves/my` | Employee | Get own leave applications |
| GET | `/api/leaves` | Employer | Get all leave requests |
| GET | `/api/leaves/stats` | Employer | Get leave statistics |
| PATCH | `/api/leaves/:id/review` | Employer | Approve or reject a request |

---

## ✨ Features

### Employee
- Sign up and log in as Employee
- Apply for leave with type, dates, and reason
- View all personal leave applications
- Filter by status (Pending / Approved / Rejected)
- See reviewer notes on reviewed applications

### Employer
- Sign up and log in as Employer
- View dashboard with leave statistics
- View all employee leave requests
- Filter by status and leave type
- Approve or reject with optional note

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, Vue Router, Pinia |
| Styling | Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| HTTP Client | Axios |
