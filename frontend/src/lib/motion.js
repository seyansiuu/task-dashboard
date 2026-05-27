export const pageReveal = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
}

export const columnReveal = {
  hidden: (index = 0) => ({
    opacity: 0,
    y: 24,
    transition: { delay: 0.3 + index * 0.15 },
  }),
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18 },
  },
}

export const taskCardReveal = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18 },
  },
}
