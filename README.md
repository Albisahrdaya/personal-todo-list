# Personal To-Do List (MERN)

A full-stack task-management web app built with React, Node.js, Express, and MongoDB Atlas.

## Live links

- Frontend: https://personal-todo-list-nine.vercel.app/
- Backend health check: https://personal-todo-list-api.onrender.com/api/health
- GitHub repository: https://github.com/Albisahrdaya/personal-todo-list

## Features

- Create tasks with a title and optional description
- Add optional due date and priority (Low, Medium, High)
- Mark tasks complete or pending
- Edit a task title
- Delete tasks
- Filter All, Pending, and Completed
- Show task summary counts
- Persist tasks in MongoDB Atlas

## Technology stack

- Frontend: React, Vite, CSS, Axios
- Backend: Node.js, Express
- Database: MongoDB Atlas
- ODM: Mongoose
- Hosting: Vercel (frontend), Render (backend)
- Version control: Git and GitHub

## Project structure

```text
personal-todo-list/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
├── server/
│   ├── models/Task.js
│   ├── routes/tasks.js
│   ├── server.js
│   └── package.json
└── .gitignore
```

## Run locally

Requirements: Node.js/npm and a MongoDB Atlas database.

1. Clone the repository:
   ```bash
   git clone https://github.com/Albisahrdaya/personal-todo-list.git
   cd personal-todo-list
   ```
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Create `server/.env` locally with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```
   Do not commit `.env` or publish the connection string.
4. Start the backend:
   ```bash
   npm start
   ```
5. In a second terminal, install and run the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

The frontend uses `http://localhost:5000/api/tasks` as its fallback API URL for local development. For hosted deployment, set the frontend environment variable `VITE_API_URL` to `https://personal-todo-list-api.onrender.com/api/tasks`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Deployment settings

### Render backend
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `NODE_ENV=production`

### Vercel frontend
- Root directory: `client`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://personal-todo-list-api.onrender.com/api/tasks`

## Testing

Manually test adding, completing, editing, deleting, filtering, and refreshing tasks. The main flows were reported as working in the deployed application.

## Limitations

- No authentication or user-specific task ownership.
- The edit interface currently supports editing the title.
- This is a learning/demo project and should not be used for private task data without adding authentication and access controls.

## Security

- Keep real `.env` files and credentials out of Git.
- If a database credential is exposed, rotate it immediately.
- Never place secrets in frontend `VITE_` variables.
