<div align="center">

```
████████╗ █████╗ ███████╗██╗  ██╗    ███████╗██╗      ██████╗ ██╗    ██╗
╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝    ██╔════╝██║     ██╔═══██╗██║    ██║
   ██║   ███████║███████╗█████╔╝     █████╗  ██║     ██║   ██║██║ █╗ ██║
   ██║   ██╔══██║╚════██║██╔═██╗     ██╔══╝  ██║     ██║   ██║██║███╗██║
   ██║   ██║  ██║███████║██║  ██╗    ██║     ███████╗╚██████╔╝╚███╔███╔╝
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

### *A full-stack task management dashboard — built for the HedgeOne screening project*

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)

<br/>

> **Plan. Prioritize. Ship.**
> A cinematic command board built for momentum.

</div>

---

## ✦ Overview

TaskFlow is a production-grade full-stack task management application featuring a **premium dark UI**, real-time CRUD operations, and buttery-smooth animations. Built from scratch in under a week as a screening project for HedgeOne Consultants LLP.

What makes it stand out:

- ⚡ **Optimistic updates** — UI responds instantly, API syncs in the background
- 🎨 **Awwwards-level UI** — dark glassmorphism, custom cursor, staggered animations  
- 🔍 **Real-time search** — filters across all columns as you type
- 🚨 **Overdue detection** — automatically flags tasks past their due date
- 📊 **Live progress bar** — tracks completion across all tasks
- 💬 **Inline delete confirmation** — no browser dialogs, auto-cancels after 4s

---

## ✦ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite), plain CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL via Supabase |
| **HTTP Client** | Axios |
| **Auth / DB Host** | Supabase (free tier) |
| **Version Control** | Git + GitHub |

---

## ✦ Features

### Core (Required)
- [x] Create tasks with title, description, status, and due date
- [x] View all tasks in a kanban-style board
- [x] Edit any task via a smooth modal
- [x] Delete tasks with inline confirmation
- [x] Persistent storage via Supabase PostgreSQL
- [x] Full REST API backend

### Bonus
- [x] Kanban columns grouped by status (Todo / In Progress / Completed)
- [x] Real-time search across all tasks
- [x] Overdue task detection with red warning badge
- [x] Animated progress bar (X of Y tasks completed)
- [x] Optimistic UI updates (no loading flicker)
- [x] Smooth staggered page load animations
- [x] Custom magnetic cursor
- [x] Animated modal open/close
- [x] Card hover effects with purple glow
- [x] Custom scrollbar styling
- [x] Responsive layout

---

## ✦ Project Structure

```
task-dashboard/
├── backend/
│   ├── db/
│   │   └── supabase.js        # Supabase client setup
│   ├── routes/
│   │   └── tasks.js           # CRUD route handlers
│   ├── .env                   # Environment variables (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── tasks.js       # Axios API calls
│   │   ├── components/
│   │   │   ├── TaskCard.jsx   # Individual task card
│   │   │   ├── TaskForm.jsx   # Create / edit form
│   │   │   └── TaskList.jsx   # Kanban column renderer
│   │   ├── App.jsx            # Root component + state
│   │   └── index.css          # Global styles
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ✦ Getting Started

### Prerequisites

- Node.js v18+
- npm
- A free [Supabase](https://supabase.com) account

### 1 — Clone the repository

```bash
git clone https://github.com/seyansiuu/task-dashboard.git
cd task-dashboard
```

### 2 — Set up the database

Log into your Supabase project, open the **SQL Editor**, and run:

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text default 'Todo' check (status in ('Todo', 'In Progress', 'Completed')),
  due_date date,
  created_at timestamp default now()
);

-- Disable RLS for development
alter table tasks disable row level security;
```

### 3 — Configure the backend

```bash
cd backend
```

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=5001
```

> Get these from **Supabase → Project Settings → API**

Install dependencies and start:

```bash
npm install
node server.js
# Server running on port 5001
```

### 4 — Run the frontend

Open a new terminal tab:

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## ✦ API Reference

Base URL: `http://localhost:5001/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Fetch all tasks (newest first) |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update a task by ID |
| `DELETE` | `/tasks/:id` | Delete a task by ID |

### Example — Create a task

```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ship the dashboard",
    "description": "Complete the HedgeOne screening project",
    "status": "In Progress",
    "due_date": "2026-05-31"
  }'
```

### Response format

```json
{
  "data": {
    "id": "uuid-here",
    "title": "Ship the dashboard",
    "description": "Complete the HedgeOne screening project",
    "status": "In Progress",
    "due_date": "2026-05-31",
    "created_at": "2026-05-27T12:00:00Z"
  }
}
```

---

## ✦ AI Tools Used

This project was built with the help of AI-assisted development workflows:

| Tool | Usage |
|------|-------|
| **Blackbox AI (Codex)** | Code generation for backend routes, frontend components, and CSS |
| **Claude (Anthropic)** | Debugging, architecture decisions, performance optimization guidance |

> All AI-generated code was reviewed, understood, and customized. The architecture decisions, debugging, and product decisions were made independently.

---

## ✦ Author

**Seyanshu Mukherjee**
B.Tech Computer Science, Rishihood University (2029)

[![GitHub](https://img.shields.io/badge/GitHub-seyansiuu-181717?style=flat&logo=github)](https://github.com/seyansiuu)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Seyanshu-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/seyanshu-mukherjee-360151263/)
[![Email](https://img.shields.io/badge/Email-mukherjeeseyanshu@gmail.com-EA4335?style=flat&logo=gmail)](mailto:mukherjeeseyanshu@gmail.com)

---

<div align="center">

*Built with ☕ and way too many terminal tabs*

**Submitted to HedgeOne Consultants LLP · May 2026**

</div>
