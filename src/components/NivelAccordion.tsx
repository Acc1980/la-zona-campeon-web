'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  id?: string
  nivel: string
  titulo: string
  rango: string
  bgClass?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function NivelAccordion({
  id,
  nivel,
  titulo,
  rango,
  bgClass = 'bg-dark-800',
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id && window.location.hash === `#${id}`) {
      setOpen(true)
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [id])

  return (
    <div id={id} ref={ref} className={`${bgClass} border-b border-dark-600`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full py-4 text-left hover:brightness-105 transition-all"
        aria-expanded={open}
      >
        <div className="section-container">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-display font-black text-xs uppercase tracking-widest text-gold-500 border border-gold-500/40 px-3 py-1 rounded-full shrink-0">
                {nivel}
              </span>
              <div>
                <p className="font-display font-bold text-white text-sm uppercase tracking-wide">{titulo}</p>
                <p className="text-gold-500/80 text-xs font-display font-bold">{rango}</p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gold-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-dark-600/40 pt-8 pb-12">
          <div className="section-container">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
