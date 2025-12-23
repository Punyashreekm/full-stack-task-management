# Collaborative Task Manager

A full-stack task management application with role-based access control, built with React (Vite), Node.js, Express, and MongoDB.

**GitHub Repository:** [https://github.com/Punyashreekm/Collaborative-Task-Manager](https://github.com/Punyashreekm/Collaborative-Task-Manager)

## Project Structure

- **Frontend**: `vite-project/` - React application with Context API and JWT authentication.
- **Backend**: `backend/` - Node.js/Express REST API with MongoDB.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Punyashreekm/Collaborative-Task-Manager.git
    cd Collaborative-Task-Manager
    ```

2.  **Install dependencies for both frontend and backend:**
    ```bash
    npm install
    ```
    (This uses the root `package.json` to install dependencies for both sub-projects).

### Running the Application

You can run both the frontend and backend servers concurrently with a single command from the root directory:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5000](http://localhost:5000)

## Features

- **Authentication**: Secure Signup/Login with JWT.
- **RBAC**:
    - **Managers**: Create, Edit, Delete, and Assign tasks.
    - **Employees**: View assigned tasks and update status.
- **Task Management**: CRUD operations for tasks.
- **Activity Logs**: Tracks task creation and updates.
- **Dark Mode**: Toggle between light and dark themes.
