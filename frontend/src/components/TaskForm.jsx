import { memo, useCallback, useState } from 'react'
import { m } from 'framer-motion'
import { CalendarDays, FileText, Send, Signal, Type } from 'lucide-react'

const statuses = ['Todo', 'In Progress', 'Completed']

const emptyForm = {
  title: '',
  description: '',
  status: 'Todo',
  due_date: '',
}

function normalizeTask(task) {
  if (!task) return emptyForm

  return {
    title: task.title ?? '',
    description: task.description ?? '',
    status: task.status ?? 'Todo',
    due_date: task.due_date ? task.due_date.slice(0, 10) : '',
  }
}

function TaskForm({ task, onSubmit, onCancel, isSubmitting = false }) {
  const [formData, setFormData] = useState(normalizeTask(task))

  const isEditing = Boolean(task)

  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      due_date: formData.due_date || null,
    }

    await onSubmit(payload)

    if (!isEditing) {
      setFormData(emptyForm)
    }
  }, [formData, isEditing, onSubmit])

  return (
    <m.form
      className="task-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="form-grid">
        <label>
          <span><Type size={14} />Title</span>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ship dashboard"
            required
          />
        </label>

        <label>
          <span><Signal size={14} />Status</span>
          <select name="status" value={formData.status} onChange={handleChange}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span><CalendarDays size={14} />Due date</span>
          <input
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </label>

        <label className="description-field">
          <span><FileText size={14} />Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add useful context for this task"
            rows="3"
          />
        </label>
      </div>

      <div className="form-actions">
        {onCancel ? (
          <m.button
            type="button"
            className="button secondary"
            onClick={onCancel}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </m.button>
        ) : null}
        <m.button
          type="submit"
          className="button primary"
          disabled={isSubmitting}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send size={15} />
          {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add task'}
        </m.button>
      </div>
    </m.form>
  )
}

export default memo(TaskForm)
