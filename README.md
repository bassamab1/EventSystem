📅 Event Backend System

A scalable backend system for managing events, built with Node.js, Express, TypeScript, PostgreSQL (Prisma), Redis, and BullMQ.
It includes authentication, role-based access, RSVP system, caching, rate limiting, and async email notifications using background workers.

🚀 Features
🔐 Authentication & Authorization
User registration and login
JWT-based authentication
Role-based access (ADMIN / USER)
Protected routes middleware
📅 Event Management
Create, update, delete events (admin-controlled)
Get all events / single event
Track event creator
Auto-notification when events are updated
🙋 RSVP System
Join event
Leave event
Prevent duplicate RSVPs
Track users per event
🔔 Notification System
Email sent when:
User joins an event
User leaves an event
Event is updated (all attendees notified)
Powered by BullMQ + Redis worker
⚡ Performance & Optimization
Redis caching for events list
Rate limiting using Redis (anti-spam protection)
Background job processing (non-blocking API)
🔒 Security
JWT authentication
Password hashing (bcrypt)
Helmet security headers
Role-based authorization
🛠️ Tech Stack
Node.js
Express.js
TypeScript
PostgreSQL
Prisma ORM
Redis
BullMQ
JWT
Nodemailer
bcrypt
Helmet, Morgan, CORS
📁 Project Structure
src/
├── config/          # Prisma & Redis config
├── middlewares/     # Auth, role, rate limit
├── modules/
│   ├── auth/        # Authentication module
│   └── events/      # Events + RSVP logic
├── queue/           # BullMQ queues
├── services/        # Email service
├── workers/         # Background worker
├── app.ts           # Express app
└── server.ts        # Entry point
🗄️ Database Schema (Prisma)
User
id, name, email, password, role
Relations: events, rsvps
Event
id, title, description, location, startDate
createdBy (User relation)
rsvps
RSVP
userId + eventId (unique constraint)
links users to events
⚙️ Setup Instructions
1. Clone repository
git clone https://github.com/your-username/event-backend-system.git
cd event-backend-system
2. Install dependencies
npm install
3. Setup environment variables

Create .env file:

PORT=5000

DATABASE_URL=postgresql://user:password@localhost:5432/db_name

JWT_SECRET=your_secret_key

REDIS_URL=redis://localhost:6379

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
4. Run database migration
npx prisma migrate dev
5. Start Redis
redis-server
▶️ Running the Project
Development server
npm run dev
Run worker (notifications)
npm run worker
Production
npm run build
npm start
📬 API Endpoints
Auth
POST /api/auth/register → Register user
POST /api/auth/login → Login user
Events
GET /api/events → Get all events
GET /api/events/:id → Get event by ID
POST /api/events → Create event (ADMIN)
PUT /api/events/update/:id → Update event
DELETE /api/events/:id → Delete event (ADMIN)
RSVP
POST /api/events/join → Join event
POST /api/events/leave → Leave event
🔄 System Flow
User performs action (join / leave / update event)
API pushes job to Redis queue (BullMQ)
Worker processes job in background
Email is sent using Nodemailer
API responds immediately (non-blocking system)
