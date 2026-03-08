# AI Based College Examination Management System

Full stack web application for automating exam forms, date sheet generation, seating plans, room allocation, and invigilator assignment.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- PDF: PDFKit

## Quick start

### 1) Start MongoDB
Use local MongoDB or Docker:
```bash
docker run -d --name exam-mongo -p 27017:27017 mongo:7
```

### 2) Start backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Start frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Default workflow to validate features
1. Register admin (`POST /api/auth/register-admin`) and login via UI.
2. Create master data from admin dashboard: course, semester, subjects, classrooms, faculty.
3. Register student (`POST /api/auth/register-student`) and login via student portal.
4. Submit student exam form.
5. Verify form appears in admin table and analytics counters update.
6. Generate exam plan using course/semester IDs.
7. Fetch latest plan and PDF report.

## Full test plan
For step-by-step verification of **each feature**, see:
- `docs/TESTING.md`

## Important endpoints
- `POST /api/auth/register-admin`
- `POST /api/auth/register-student`
- `POST /api/auth/login`
- `GET|POST|PUT|DELETE /api/master/:entity`
- `POST /api/forms/submit`
- `GET /api/forms/my-status`
- `GET /api/forms/all?search=&status=`
- `PATCH /api/forms/:id/status`
- `POST /api/plans/generate`
- `GET /api/plans/latest?courseId=&semesterId=`
- `GET /api/plans/:id/pdf`
