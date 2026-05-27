import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { createTask, deleteTask, getTasks, updateTask } from './api/tasks'
import './App.css'
import AmbientBackground from './components/AmbientBackground'
import CustomCursor from './components/CustomCursor'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { usePerformanceMode } from './hooks/usePerformanceMode'
import { pageReveal } from './lib/motion'

function createOptimisticId() {
  return `optimistic-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
}

function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [createFormKey, setCreateFormKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMobileStatus, setActiveMobileStatus] = useState('Todo')
  const [error, setError] = useState('')
  const performanceMode = usePerformanceMode()
  const skeletonColumns = useMemo(() => Array.from({ length: 3 }, (_, columnIndex) => columnIndex), [])
  const skeletonCards = useMemo(() => Array.from({ length: 3 }, (_, cardIndex) => cardIndex), [])
  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === 'Completed').length,
    [tasks],
  )
  const progressScale = tasks.length === 0 ? 0 : completedCount / tasks.length
  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return tasks
    return tasks.filter((task) => task.title?.toLowerCase().includes(normalizedQuery))
  }, [searchQuery, tasks])

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true)
        setError('')
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks)
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load tasks.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  useEffect(() => {
    document.body.style.overflow = isFormOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isFormOpen])

  const closeCreateModal = useCallback(() => {
    setIsFormOpen(false)
    window.setTimeout(() => setCreateFormKey((currentKey) => currentKey + 1), 200)
  }, [])

  const handleCreateTask = useCallback(async (payload) => {
    setIsSubmitting(true)
    const optimisticId = createOptimisticId()
    const optimisticTask = {
      id: optimisticId,
      created_at: new Date().toISOString(),
      __entering: true,
      ...payload,
    }
    const realIdRef = { current: null }

    setTasks((currentTasks) => [optimisticTask, ...currentTasks])
    closeCreateModal()

    window.setTimeout(() => {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task.id !== optimisticId && task.id !== realIdRef.current) return task
          const nextTask = { ...task }
          delete nextTask.__entering
          return nextTask
        }),
      )
    }, 300)

    try {
      setError('')
      const newTask = await createTask(payload)
      realIdRef.current = newTask.id
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === optimisticId ? { ...newTask, __entering: task.__entering } : task,
        ),
      )
    } catch (err) {
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== optimisticTask.id))
      setError(err.response?.data?.error || 'Could not create the task.')
    } finally {
      setIsSubmitting(false)
    }
  }, [closeCreateModal])

  const handleUpdateTask = useCallback(async (id, payload) => {
    let previousTask
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) return task
        previousTask = task
        return { ...task, ...payload }
      }),
    )

    try {
      setError('')
      const updatedTask = await updateTask(id, payload)
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      )
    } catch (err) {
      if (previousTask) {
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task.id === id ? previousTask : task)),
        )
      }
      setError(err.response?.data?.error || 'Could not update the task.')
    }
  }, [])

  const handleDeleteTask = useCallback(async (id) => {
    let deletedTask
    setTasks((currentTasks) =>
      currentTasks.filter((task) => {
        if (task.id === id) deletedTask = task
        return task.id !== id
      }),
    )

    try {
      setError('')
      await deleteTask(id)
    } catch (err) {
      if (deletedTask) {
        setTasks((currentTasks) => [deletedTask, ...currentTasks])
      }
      setError(err.response?.data?.error || 'Could not delete the task.')
    }
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <AmbientBackground lowPower={performanceMode.lowPower} />
      <CustomCursor enabled={performanceMode.finePointer} />

      <m.header
        className="navbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="navbar-inner" aria-label="Primary">
          <m.div className="brand" whileHover={performanceMode.lowPower ? undefined : { scale: 1.02 }}>
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>
            <span>TaskFlow</span>
          </m.div>

          <div className="header-actions">
            <span className="task-count-pill">
              {tasks.length} tasks
            </span>
            <m.button
              type="button"
              className="button primary"
              onClick={() => setIsFormOpen(true)}
              whileHover={performanceMode.lowPower ? undefined : { y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={16} />
              New Task
            </m.button>
          </div>
        </nav>
      </m.header>

      <m.main
        className="app-shell"
        variants={pageReveal}
        initial="hidden"
        animate="visible"
      >
        <m.section
          className="page-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">Workspace</p>
          <h1>My Tasks</h1>
          <p>Plan, prioritize, and ship your work across a cinematic command board built for momentum.</p>
        </m.section>

        <section className="mobile-summary">
          <h1>My Tasks</h1>
          <div className="progress-summary">
            <p>
              {tasks.length > 0 && completedCount === tasks.length
                ? '✓ All tasks completed! 🎉'
                : `${completedCount} of ${tasks.length} tasks completed`}
            </p>
            <div className="progress-track" aria-hidden="true">
              <span style={{ '--progress-scale': progressScale }}></span>
            </div>
          </div>
        </section>

        <m.section
          className="task-controls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="search-field">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tasks..."
            />
          </label>

          <div className="progress-summary">
            <p>
              {tasks.length > 0 && completedCount === tasks.length
                ? '✓ All tasks completed! 🎉'
                : `${completedCount} of ${tasks.length} tasks completed`}
            </p>
            <div className="progress-track" aria-hidden="true">
              <span style={{ '--progress-scale': progressScale }}></span>
            </div>
          </div>
        </m.section>

        <div
          className={`modal-overlay ${isFormOpen ? 'is-visible' : ''}`}
          role="presentation"
          onMouseDown={closeCreateModal}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-hidden={!isFormOpen}
            aria-labelledby="new-task-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Create</p>
                <h2 id="new-task-title">New Task</h2>
              </div>
              <button
                type="button"
                className="button ghost"
                onClick={closeCreateModal}
              >
                Close
              </button>
            </div>
            <TaskForm
              key={createFormKey}
              onSubmit={handleCreateTask}
              onCancel={closeCreateModal}
              isSubmitting={isSubmitting}
            />
          </section>
        </div>

        <AnimatePresence>
          {error ? (
            <m.div
              className="alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </m.div>
          ) : null}
        </AnimatePresence>

        {isLoading ? (
          <div className="skeleton-board" aria-label="Loading tasks">
            {skeletonColumns.map((columnIndex) => (
              <div className="skeleton-column" key={columnIndex}>
                <div className="skeleton-heading"></div>
                {skeletonCards.map((cardIndex) => (
                  <div className="skeleton-card" key={cardIndex}>
                    <span></span>
                    <strong></strong>
                    <p></p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            totalTasks={tasks.length}
            searchQuery={searchQuery}
            activeStatus={activeMobileStatus}
            onStatusChange={setActiveMobileStatus}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </m.main>
    </LazyMotion>
  )
}

export default App
