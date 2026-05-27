import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Check, Pencil, Play, Trash2 } from 'lucide-react'
import TaskForm from './TaskForm'
import { taskCardReveal } from '../lib/motion'

function formatDate(value) {
  if (!value) return 'No due date'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value.slice(0, 10)}T00:00:00`))
}

function isOverdue(value, status) {
  if (!value || status === 'Completed') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(`${value.slice(0, 10)}T00:00:00`)
  return dueDate < today
}

function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const formattedDueDate = useMemo(() => formatDate(task.due_date), [task.due_date])
  const overdue = useMemo(() => isOverdue(task.due_date, task.status), [task.due_date, task.status])
  const statusClass = useMemo(
    () => `status-badge status-${task.status.replaceAll(' ', '-').toLowerCase()}`,
    [task.status],
  )

  const handleUpdate = useCallback(async (payload) => {
    setIsSaving(true)
    setIsEditing(false)
    try {
      await onUpdate(task.id, payload)
    } finally {
      setIsSaving(false)
    }
  }, [onUpdate, task.id])

  const handleStatusChange = useCallback(async (status) => {
    if (task.status === status) return

    setIsSaving(true)
    try {
      await onUpdate(task.id, { status })
    } finally {
      setIsSaving(false)
    }
  }, [onUpdate, task.id, task.status])

  useEffect(() => {
    if (!isConfirmingDelete) return undefined
    const timeoutId = window.setTimeout(() => setIsConfirmingDelete(false), 4000)
    return () => window.clearTimeout(timeoutId)
  }, [isConfirmingDelete])

  useEffect(() => {
    if (!isEditing) return undefined

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [isEditing])

  const closeEditModal = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleDelete = useCallback(async () => {
    await onDelete(task.id)
  }, [onDelete, task.id])

  function renderWorkflowActions() {
    if (task.status === 'Todo') {
      return (
        <>
          <button
            type="button"
            className="button start-button"
            onClick={() => handleStatusChange('In Progress')}
            disabled={isSaving}
          >
            <Play size={13} />
            Start doing it
          </button>
          <button
            type="button"
            className="button done-button"
            onClick={() => handleStatusChange('Completed')}
            disabled={isSaving}
          >
            <Check size={13} />
            Done
          </button>
        </>
      )
    }

    if (task.status === 'In Progress') {
      return (
        <button
          type="button"
          className="button done-button"
          onClick={() => handleStatusChange('Completed')}
          disabled={isSaving}
        >
          <Check size={13} />
          Done
        </button>
      )
    }

    return null
  }

  return (
    <>
      <m.article
        className={`task-card ${task.status === 'Completed' ? 'task-complete' : ''} ${task.__entering ? 'task-entering' : ''}`}
        variants={taskCardReveal}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileTap={{ scale: 0.985 }}
      >
        <div className="task-card-header">
          <span className={statusClass}>
            {task.status}
          </span>
          <span className={`due-date ${overdue ? 'due-date-overdue' : ''}`}>
            {formattedDueDate}
            {overdue ? <span className="overdue-pill">Overdue</span> : null}
          </span>
        </div>

        <h3>{task.title}</h3>
        <p>{task.description || 'No description provided.'}</p>

        <AnimatePresence mode="wait">
          {isConfirmingDelete ? (
            <m.div
              className="task-actions delete-confirmation"
              key="confirm-delete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <span>Sure?</span>
              <button type="button" className="button confirm-delete-button" onClick={handleDelete}>
                Yes, delete
              </button>
              <button type="button" className="button edit-button" onClick={() => setIsConfirmingDelete(false)}>
                Cancel
              </button>
            </m.div>
          ) : (
            <m.div
              className="task-actions"
              key="default-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {renderWorkflowActions()}
              <button type="button" className="button edit-button" onClick={() => setIsEditing(true)}>
                <Pencil size={13} />
                Edit
              </button>
              <button type="button" className="button delete-button" onClick={() => setIsConfirmingDelete(true)}>
                <Trash2 size={13} />
                Delete
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </m.article>

      <div
        className={`modal-overlay ${isEditing ? 'is-visible' : ''}`}
        role="presentation"
        onMouseDown={closeEditModal}
      >
        <section
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-hidden={!isEditing}
          aria-labelledby={`edit-task-${task.id}`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <p className="eyebrow">Edit task</p>
              <h2 id={`edit-task-${task.id}`}>{task.title}</h2>
            </div>
            <button
              type="button"
              className="button ghost"
              onClick={closeEditModal}
            >
              Close
            </button>
          </div>

          <TaskForm
            key={`${task.id}-${isEditing}`}
            task={task}
            onSubmit={handleUpdate}
            onCancel={closeEditModal}
            isSubmitting={isSaving}
          />
        </section>
      </div>
    </>
  )
}

export default memo(TaskCard)
