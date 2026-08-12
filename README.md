# Screening Task

## Installation 
### Prerequisites
- Node.js 22+
- npm
- PostgreSQL
- Docker
- Docker compose



### Running with Docker

Make sure Docker is installed and running.

Create a `.env` file in the project root:

```env
DB_NAME=mpc
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://postgres:your_password@database:5432/mpc
JWT_SECRET=your_secret
```
#### Start the Application
```bash
docker compose up --build
```
### Running without Docker

#### Install Dependencies
```bash
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/mpc
JWT_SECRET=your_secret
```

#### Set up and Run
```bash
npm run db:setup
npm run dev
```

Api will be available at http://localhost:3000/


## API Examples

### Auth

#### Sign up
`POST /api/auth/signup`

Body:
```json
{
  "name": "malek",
  "password": "malek123",
  "role": "admin"
}
```

Response `201`:
```json
{
  "success": true,
  "message": "Student registered successfully",
  "user": { "id": 1, "name": "malek", "role": "admin" }
}
```

#### Login
`POST /api/auth/login`

Body:
```json
{
  "name": "malek",
  "password": "malek123"
}
```

Response `200`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> All routes below require this token in the header: `Authorization: Bearer <token>`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/students` | Auth | List students (supports `?name=`, `?role=`, `?search=`) |
| GET | `/api/students/:id` | Auth | Get one student |
| POST | `/api/students` | Admin | Create a student |
| PUT | `/api/students/:id` | Admin | Replace a student |
| DELETE | `/api/students/:id` | Admin | Delete a student |
| GET | `/api/courses` | Auth | List courses (supports `?name=`) |
| GET | `/api/courses/:id` | Auth | Get one course |
| POST | `/api/courses` | Admin | Create a course |
| GET | `/api/assignments` | Auth | List assignments (supports `?name=`, `?course_id=`) |
| POST | `/api/assignments` | Admin | Create an assignment |
| PATCH | `/api/assignments/:id` | Admin | Partially update an assignment |


### Example: Create a student
`POST /api/students` — requires admin token

Body:
```json
{ "name": "testuser", "password": "testpass", "role": "student" }
```

Response `200`:
```json
{ "success": true, "student": { "id": 2, "name": "testuser", "role": "student" } }
```




## Design Decisions and Assumptions
- The task given did not specify a schema and only provided the required endpoint. I designed the schema and relationships myself which include the following:
    - Students and courses have a many to many relationship represented through a join table. Students can have multiple courses and courses can have multiple students
    - Each assignments belongs to one course, fulfilling a one to many relationship.
- Each student must have a role which can either be student or admin.
- Admins have complete access to everything. Students with the role student only have access to GET endpoints
- The api/auth/signup end point was provided for testing only. Ideally, the database should have admin already and only admins can create student entries.
 - PATCH on assignments only updates fields explicitly provided in the request body
- PUT on students requires the full object and replaces all fields.
