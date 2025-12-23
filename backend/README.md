# TaskFlow Backend API

RESTful API for TaskFlow application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/taskflow
     JWT_SECRET=your_jwt_secret
     ```

3. Run Server:
   - Development: `npm run dev`
   - Production: `npm start`

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (Manager) or assigned tasks (Employee)
- `POST /api/tasks` - Create a task (Manager only)
- `PUT /api/tasks/:id` - Update task (Manager: full update, Employee: status only)
- `DELETE /api/tasks/:id` - Delete task (Manager only)
