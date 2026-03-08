# End-to-End Testing Guide

This guide helps you verify every major feature in the project.

## 1) Start dependencies

### MongoDB
If you already have MongoDB installed locally:
```bash
mongod --dbpath <your-db-path>
```

Or with Docker:
```bash
docker run -d --name exam-mongo -p 27017:27017 mongo:7
```

## 2) Start backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Expected: server starts on `http://localhost:5000` and `/api/health` returns `{ "status": "ok" }`.

## 3) Start frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Expected: app opens at `http://localhost:5173`.

## 4) Create initial users

### Register Admin (one-time)
```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Exam Admin","email":"admin@college.edu","password":"Admin@123"}'
```

### Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register-student \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Student One",
    "rollNumber":"BCA301",
    "email":"student1@college.edu",
    "password":"Student@123"
  }'
```

## 5) Login checks

### Admin login
Use frontend login with:
- Role: `Admin / Exam Cell`
- Identifier: `admin@college.edu`
- Password: `Admin@123`

### Student login
Use frontend login with:
- Role: `Student`
- Identifier: `BCA301`
- Password: `Student@123`

## 6) Test all Admin functions

1. **Master CRUD**
   - Add Course: `BCA`.
   - Add Semester linked to that course.
   - Add Subjects linked to course + semester.
   - Add Classrooms (`roomCapacity` should auto-calculate).
   - Add Faculty entries.

2. **Search/filter student forms**
   - After form submissions, use backend endpoint:
   ```bash
   GET /api/forms/all?search=BCA301&status=submitted
   ```

3. **Analytics**
   - Verify counters in Admin dashboard update after data creation.

4. **Generate Exam Plan**
   - Click **Generate Exam Plan** with valid `courseId` and `semesterId`.
   - Confirm these outputs are generated:
     - Date sheet
     - Room allocation
     - Seating arrangement
     - Invigilator assignment
   - Check saved plan using:
   ```bash
   GET /api/plans/latest?courseId=<courseId>&semesterId=<semesterId>
   ```

5. **PDF report**
   - Open generated PDF endpoint:
   ```bash
   GET /api/plans/:id/pdf
   ```
   - Verify it includes all sections.

## 7) Test all Student functions

1. Login as student.
2. Fill and submit exam form with:
   - Name
   - Roll Number
   - Course (ObjectId)
   - Semester (ObjectId)
   - Subjects (comma-separated ObjectIds in current UI)
   - Email
3. Verify status using:
```bash
GET /api/forms/my-status
```

## 8) API regression checklist

- [ ] `/api/auth/register-admin`
- [ ] `/api/auth/register-student`
- [ ] `/api/auth/login` (admin + student)
- [ ] `/api/master/:entity` CRUD for all entities
- [ ] `/api/forms/submit`
- [ ] `/api/forms/my-status`
- [ ] `/api/forms/all` with `search` and `status`
- [ ] `/api/forms/:id/status`
- [ ] `/api/plans/generate`
- [ ] `/api/plans/latest`
- [ ] `/api/plans/:id/pdf`
- [ ] `/api/admin/analytics`

## 9) Common issues

- **401 Unauthorized**: Missing `Authorization: Bearer <token>` for protected routes.
- **Invalid ObjectId**: Ensure course/semester/subject IDs exist in DB.
- **Insufficient room capacity**: Add more classrooms or increase benches/seats.
- **No plan generated**: Ensure subjects, student forms, classrooms, and faculty exist.
