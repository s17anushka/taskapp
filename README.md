# TaskApp — Full-Stack Task Manager

React + Node/Express + PostgreSQL (Prisma) + Socket.io

## Project Structure

```
taskapp/
├── backend/          # Node.js + Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       └── routes/
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── services/
```

## Prerequisites

- Node.js 18+
- PostgreSQL (running locally or a cloud DB)
- npm or yarn

---

## Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and fill in your env vars
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET

# Generate Prisma client + run migrations
npm run db:generate
npm run db:migrate

# Start dev server (port 4000)
npm run dev
```

The API will be live at `http://localhost:4000`.

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev
```

Open `http://localhost:5173`. The Vite proxy routes `/api/*` to the backend automatically.

---

## API Reference

### Auth

| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/auth/register` | `{ name, email, password }` | — |
| POST | `/api/auth/login` | `{ email, password }` | — |
| POST | `/api/auth/refresh` | `{ refreshToken }` | — |
| GET  | `/api/auth/me` | — | Bearer |

### Tasks

| Method | Endpoint | Notes | Auth |
|--------|----------|-------|------|
| GET | `/api/tasks` | `?status=TODO&priority=HIGH&sort=dueDate&order=asc` | Bearer |
| POST | `/api/tasks` | `{ title, description?, status?, priority?, dueDate? }` | Bearer |
| GET | `/api/tasks/:id` | — | Bearer |
| PUT | `/api/tasks/:id` | Any task fields | Bearer |
| DELETE | `/api/tasks/:id` | — | Bearer |

### WebSocket Events

Connect with `{ auth: { token: '<accessToken>' } }`.

| Event | Direction | Payload |
|-------|-----------|---------|
| `task:created` | server → client | Full task object |
| `task:updated` | server → client | Full task object |
| `task:deleted` | server → client | `{ id }` |

---

## Environment Variables

### Backend `.env`

```
DATABASE_URL="postgresql://user:pass@localhost:5432/taskapp"
JWT_SECRET="<strong-random-string>"
JWT_REFRESH_SECRET="<another-strong-random-string>"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

---

## Next Steps

- Add task search / text filtering
- Email notifications on due dates (e.g. with Resend or Nodemailer)
- Unit tests with Vitest (frontend) and Jest (backend)
- Deploy: Render / Railway (backend) + Vercel (frontend)
