import { memo, useMemo } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import TaskCard from './TaskCard'
import { columnReveal, staggerContainer } from '../lib/motion'

const statusGroups = ['Todo', 'In Progress', 'Completed']
const emptyState = {
  Todo: { icon: '📋', text: 'No tasks waiting in the queue.' },
  'In Progress': { icon: '⚡', text: 'Nothing is actively moving right now.' },
  Completed: { icon: '✅', text: 'Completed work will land here.' },
}

function TaskList({ tasks, totalTasks = tasks.length, searchQuery = '', onUpdate, onDelete }) {
  const tasksByStatus = useMemo(
    () =>
      statusGroups.reduce((groups, status) => {
        groups[status] = tasks.filter((task) => task.status === status)
        return groups
      }, {}),
    [tasks],
  )

  if (tasks.length === 0 && totalTasks === 0) {
    return (
      <m.div
        className="empty-state global-empty-state"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="empty-orbit">📋</span>
        <strong>No tasks yet</strong>
        <p>Create your first task and start shaping the queue.</p>
      </m.div>
    )
  }

  if (tasks.length === 0 && searchQuery.trim()) {
    return (
      <m.div className="empty-state global-empty-state no-results-state" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="empty-orbit">🔍</span>
        <strong>No results for {searchQuery}</strong>
        <p>Try a different title or clear the search field.</p>
      </m.div>
    )
  }

  return (
    <m.div
      className="task-board"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {statusGroups.map((status, index) => {
        const groupedTasks = tasksByStatus[status]
        const empty = emptyState[status]

        return (
          <m.section
            className={`task-column column-${status.replaceAll(' ', '-').toLowerCase()}`}
            key={status}
            variants={columnReveal}
            custom={index}
          >
            <div className="column-header">
              <div className="column-title">
                <span className="column-dot"></span>
                <h2>{status}</h2>
              </div>
              <span>{groupedTasks.length}</span>
            </div>

            <div className="task-stack">
              <AnimatePresence initial={false}>
                {groupedTasks.length > 0 ? (
                groupedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <m.div
                  className="column-empty"
                  key={`${status}-empty`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                >
                  <span>{empty.icon}</span>
                  <p>{empty.text}</p>
                </m.div>
              )}
              </AnimatePresence>
            </div>
          </m.section>
        )
      })}
    </m.div>
  )
}

export default memo(TaskList)
