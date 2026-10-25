
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load tasks from MongoDB when the app opens
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(API_URL)
        setTasks(response.data)
        setError('')
      } catch (err) {
        setError('Could not load tasks. Check that the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Add a new task
  async function addTask(e) {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a task title')
      return
    }

    try {
      const response = await axios.post(API_URL, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
      })

      setTasks(previousTasks => [response.data, ...previousTasks])
      setTitle('')
      setDescription('')
      setPriority('Medium')
      setDueDate('')
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add task.')
    }
  }

  // Mark a task complete or pending
  async function toggleTask(id, completed) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        completed: !completed,
      })

      setTasks(previousTasks =>
        previousTasks.map(task =>
          task._id === id ? response.data : task
        )
      )
      setError('')
    } catch (err) {
      setError('Could not update task status.')
    }
  }

  // Delete a task
  async function deleteTask(id) {
    try {
      await axios.delete(`${API_URL}/${id}`)

      setTasks(previousTasks =>
        previousTasks.filter(task => task._id !== id)
      )
      setError('')
    } catch (err) {
      setError('Could not delete task.')
    }
  }

  // Edit a task title
  async function editTask(task) {
    const newTitle = prompt('Edit task title:', task.title)

    if (newTitle === null || !newTitle.trim()) {
      return
    }

    try {
      const response = await axios.put(`${API_URL}/${task._id}`, {
        title: newTitle.trim(),
      })

      setTasks(previousTasks =>
        previousTasks.map(item =>
          item._id === task._id ? response.data : item
        )
      )
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not edit task.')
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.completed
    if (filter === 'Completed') return task.completed
    return true
  })

  const completedCount = tasks.filter(task => task.completed).length

  return (
    <main className="app">
      <header className="header">
        <div className="logo">✓</div>
        <div>
          <h1>My To-Do List</h1>
          <p>Plan your day, one task at a time.</p>
        </div>
      </header>

      <section className="summary">
        <div className="summary-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="summary-card">
          <span>Pending</span>
          <strong>{tasks.length - completedCount}</strong>
        </div>
        <div className="summary-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
      </section>

      <section className="panel">
        <h2>Add a New Task</h2>

        <form onSubmit={addTask}>
          <label htmlFor="title">Task Title *</label>
          <input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add some details..."
            rows="2"
          />

          <div className="form-row">
            <div>
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <button className="add-button" type="submit">
            + Add Task
          </button>
        </form>
      </section>

      <section className="task-section">
        <div className="task-heading">
          <h2>My Tasks</h2>

          <select
            aria-label="Filter tasks"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        {error && <p role="alert">{error}</p>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✓</div>
            <h3>No tasks yet</h3>
            <p>Add your first task to get started!</p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map(task => (
              <article className="task-card" key={task._id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id, task.completed)}
                  aria-label={`Complete ${task.title}`}
                />

                <div className="task-info">
                  <h3 className={task.completed ? 'done' : ''}>
                    {task.title}
                  </h3>

                  {task.description && <p>{task.description}</p>}

                  <div className="task-meta">
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>

                    {task.dueDate && (
                      <span>
                        Due: {String(task.dueDate).slice(0, 10)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>Personal To-Do List · Stay organized, stay productive.</footer>
    </main>
  )
}

export default App
