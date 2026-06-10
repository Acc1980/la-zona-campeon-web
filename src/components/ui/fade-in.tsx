"use client"

import { ReactNode } from "react"
import { motion } from "motion/react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
  duration?: number
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
  duration = 0.6,
}: FadeInProps) {
  const offset = 28
  const initial = {
    opacity: 0,
    ...(direction === "up" && { y: offset }),
    ...(direction === "down" && { y: -offset }),
    ...(direction === "left" && { x: offset }),
    ...(direction === "right" && { x: -offset }),
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
