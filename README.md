# Collaborative Task Manager 🚀

A robust full-stack task management application designed for teams with role-based access control (RBAC). Built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## 🛠 Tech Stack

- **Frontend**: React 19 (Vite), Context API, CSS Variables, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication.
- **Tools**: Concurrently (run both servers with one command), Bcryptjs (password hashing), Morgan (logging).
- **Features**: RBAC, Real-time status updates, Dark Mode, and **Activity Logging** for all task operations.

---

## 🏁 Getting Started (Intern's Guide)

Follow these steps to get the project running locally in under 15 minutes.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally OR a MongoDB Atlas URI.

### 2. Installation

Clone the repository and install dependencies for all parts of the project:

```bash
git clone https://github.com/Punyashreekm/Collaborative-Task-Manager.git
cd Collaborative-Task-Manager
npm run install-all
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_here
```

Create a `.env` file in the `frontend/` directory (or ensure `VITE_API_URL` is set):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application

From the **root directory**, run both the frontend and backend concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Sample Credentials

| Role         | Email                  | Password   |
| :----------- | :--------------------- | :--------- |
| **Manager**  | `manager@example.com`  | `password` |
| **Employee** | `employee@example.com` | `password` |

---

## 📡 API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`

Registers a new user.

- **Body**: `{ "name": "John", "email": "john@ex.com", "password": "123", "role": "manager" }`
- **Response**: `201 Created` with user object and JWT token.

#### `POST /api/auth/login`

Authenticates a user.

- **Body**: `{ "email": "john@ex.com", "password": "123" }`
- **Response**: `200 OK` with user object and JWT token.

---

### Task Management Endpoints (CRUD)

All task endpoints require an `Authorization: Bearer <token>` header.

#### `GET /api/tasks`

Fetch tasks based on user role.

- **Managers**: See tasks created by them or assigned to them.
- **Employees**: See only tasks assigned to them.
- **Status Codes**: `200 OK`, `401 Unauthorized`.

#### `POST /api/tasks`

Create a new task (**Manager Only**).

- **Body**: `{ "title": "Fix Bug", "description": "Crash on login", "assignedTo": "USER_ID" }`
- **Response**: `201 Created`.

#### `PUT /api/tasks/:id`

Update task details or status.

- **Managers**: Can update all fields.
- **Employees**: Can **ONLY** update the `status` field.
- **Body**: `{ "status": "completed" }`
- **Response**: `200 OK`.

#### `DELETE /api/tasks/:id`

Delete a task (**Manager Only**).

- **Response**: `200 OK`.

---

## 🏗 Project Structure

- `frontend/`: React frontend with Vite.
- `backend/`: Node.js/Express server.
- `backend/src/models/`: MongoDB schemas (User, Task, Log).
- `backend/src/controllers/`: Business logic for tasks and auth.
- `frontend/src/context/`: State management for Auth and Tasks.

---

## 🚀 Deployment

- **Backend**: Can be deployed to Render, Fly.io, or AWS. Ensure `MONGO_URI` and `JWT_SECRET` are set in production env.
- **Frontend**: Can be deployed to Vercel or Netlify. Set `VITE_API_URL` during build.

---

## 🤝 Contributing

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.