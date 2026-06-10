"use client"

import { ReactNode } from "react"

interface GoldGlowProps {
  children: ReactNode
  className?: string
  speed?: "slow" | "normal" | "fast"
}

// Wraps any button or link with a spinning gold conic-gradient border
export function GoldGlow({ children, className, speed = "normal" }: GoldGlowProps) {
  const spinClass = {
    slow: "animate-[spin_6s_linear_infinite]",
    normal: "animate-[spin_3s_linear_infinite]",
    fast: "animate-[spin_1.5s_linear_infinite]",
  }[speed]

  return (
    <div className={`relative inline-flex overflow-hidden rounded-lg p-[2px] ${className ?? ""}`}>
      <span
        className={`absolute inset-[-1000%] m-auto block ${spinClass} bg-[conic-gradient(from_90deg_at_50%_50%,#e2bc8e_0%,#c49a6a_30%,#7a5a38_50%,#c49a6a_70%,#e2bc8e_100%)]`}
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
