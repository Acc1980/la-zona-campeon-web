'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import DocumentoGenerado, { type PerfilCompleto, type AnalisisIA } from '@/components/DocumentoGenerado'

// ─── Data ────────────────────────────────────────────────────────────────────

const DEPORTES = [
  { id: 'futbol', label: 'Fútbol' },
  { id: 'baloncesto', label: 'Baloncesto' },
  { id: 'tenis', label: 'Tenis' },
  { id: 'atletismo', label: 'Atletismo' },
  { id: 'natacion', label: 'Natación' },
  { id: 'otro', label: 'Otro deporte' },
]

const POSICIONES: Record<string, { id: string; label: string }[]> = {
  futbol: [
    { id: 'portero', label: 'Portero' },
    { id: 'defensa-central', label: 'Defensa Central' },
    { id: 'lateral', label: 'Lateral' },
    { id: 'mediocampista', label: 'Mediocampista' },
    { id: 'extremo', label: 'Extremo' },
    { id: 'delantero', label: 'Delantero Centro' },
  ],
  baloncesto: [
    { id: 'base', label: 'Base' },
    { id: 'escolta', label: 'Escolta' },
    { id: 'alero', label: 'Alero' },
    { id: 'pivote', label: 'Pívot' },
  ],
  tenis: [
    { id: 'fondo', label: 'Jugador de fondo de pista' },
    { id: 'red', label: 'Jugador de red / saque-volea' },
    { id: 'completo', label: 'Jugador completo' },
  ],
  atletismo: [
    { id: 'velocista', label: 'Velocista' },
    { id: 'fondista', label: 'Fondista' },
    { id: 'saltos-lanzamientos', label: 'Saltos / Lanzamientos' },
  ],
  natacion: [
    { id: 'libre', label: 'Estilo libre' },
    { id: 'mariposa', label: 'Mariposa' },
    { id: 'combinado', label: 'Combinado / Espalda / Braza' },
  ],
  otro: [
    { id: 'individual', label: 'Deporte individual' },
    { id: 'equipo', label: 'Deporte de equipo' },
  ],
}

const CATEGORIAS = [
  'Infantil (sub-12)',
  'Juvenil temprano (sub-13 / sub-15)',
  'Juvenil (sub-16 / sub-18)',
  'Amateur adulto',
  'Semiprofesional',
  'Profesional',
  'Universitario / Colegial',
]

const ASPECTOS_MENTALES = [
  { id: 'concentracion', label: 'Concentración bajo presión', desc: 'Mantener el foco en los momentos clave' },
  { id: 'confianza', label: 'Confianza y autoestima', desc: 'Creer en tu capacidad independientemente del resultado' },
  { id: 'errores', label: 'Manejo de errores', desc: 'Soltar los fallos rápido y seguir jugando' },
  { id: 'liderazgo', label: 'Liderazgo y comunicación', desc: 'Influir positivamente en el equipo' },
  { id: 'espiral', label: 'Control de la espiral negativa', desc: 'Romper el ciclo error → frustración → más errores' },
  { id: 'regularidad', label: 'Regularidad y consistencia', desc: 'Mantener el nivel partido a partido' },
  { id: 'presion', label: 'Rendir bajo presión alta', desc: 'Activarte en los partidos importantes' },
  { id: 'mentalidad', label: 'Mentalidad ante la derrota', desc: 'Procesar las derrotas y seguir adelante' },
]

// ─── State inicial ────────────────────────────────────────────────────────────

const perfilVacio: PerfilCompleto = {
  nombre: '', edad: '', deporte: '', deporteLabel: '', posicion: '', posicionLabel: '',
  categoria: '', fortalezas: [], fortalezasTexto: '', desafios: [], desafiosTexto: '',
  situaciones: '', incluyeTecnico: false, tecnicoNombre: '', tecnicoFortalezas: '',
  tecnicoDesafios: '', incluyePadres: false, padresNombre: '', padresObservaciones: '',
  padresPreocupaciones: '', padresEntrenadorDijo: '', email: '',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toggleAspecto(lista: string[], id: string, max: number): string[] {
  if (lista.includes(id)) return lista.filter(x => x !== id)
  if (lista.length >= max) return lista
  return [...lista, id]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">
        Paso {step} de {total}
      </p>
      <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && <p className="text-dark-300 mt-2 text-sm max-w-md mx-auto">{subtitle}</p>}
    </div>
  )
}

function Campo({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block font-display font-bold text-xs text-dark-300 uppercase tracking-wider mb-2">
        {label}{required && <span className="text-gold-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-500 transition-colors"
const textareaCls = `${inputCls} resize-none`
const selectCls = `${inputCls} appearance-none`

function CheckGrid({
  opciones,
  seleccionados,
  max,
  onToggle,
}: {
  opciones: { id: string; label: string; desc?: string }[]
  seleccionados: string[]
  max: number
  onToggle: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {opciones.map(op => {
        const sel = seleccionados.includes(op.id)
        const bloq = !sel && seleccionados.length >= max
        return (
          <button
            key={op.id}
            type="button"
            onClick={() => onToggle(op.id)}
            disabled={bloq}
            className={`flex items-start gap-3 text-left rounded-xl border-2 p-4 transition-all duration-200
              ${sel ? 'border-gold-500 bg-gold-500/10' : bloq ? 'border-dark-700 bg-dark-800/50 opacity-40 cursor-not-allowed' : 'border-dark-600 bg-dark-800 hover:border-gold-500/40 hover:bg-dark-700'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${sel ? 'border-gold-500 bg-gold-500' : 'border-dark-500'}`}>
              {sel && <span className="text-dark-800 font-black text-xs">✓</span>}
            </div>
            <div>
              <div className="font-display font-bold text-white text-xs uppercase tracking-wide">{op.label}</div>
              {op.desc && <div className="text-dark-400 text-xs mt-0.5">{op.desc}</div>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function BtnBack({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-dark-400 hover:text-gold-500 text-sm font-display uppercase tracking-wider transition-colors">
      ← Volver
    </button>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────

const FRASES_CARGA = [
  'Tu historial de juego está siendo analizado en detalle...',
  'Identificando tus patrones mentales únicos...',
  'Construyendo tu plan de trabajo personalizado...',
  'Cada respuesta que diste está siendo procesada...',
  'Tu hoja de ruta mental está tomando forma...',
  'Analizando el cruce entre tus fortalezas y desafíos...',
  'Los grandes campeones también trabajan su mente. Tú ya diste el primer paso.',
]

function LoadingAnalisis() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FRASES_CARGA.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="text-center py-20">
      <div className="inline-block w-12 h-12 border-4 border-dark-600 border-t-gold-500 rounded-full animate-spin mb-8" />
      <p className="font-display font-bold text-gold-500 uppercase tracking-widest text-sm mb-4">
        Generando tu análisis
      </p>
      <p className="text-dark-300 text-xs max-w-xs mx-auto mb-8">
        Nuestro sistema especializado está analizando tu perfil. Tarda un par de minutos.
      </p>
      <div className="max-w-sm mx-auto bg-dark-800 border border-dark-600 rounded-xl px-6 py-4 min-h-[64px] flex items-center justify-center">
        <p className="text-dark-200 text-sm italic leading-relaxed transition-all duration-500">
          {FRASES_CARGA[idx]}
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PersonalizadoPage() {
  const [step, setStep]         = useState(1)
  const [perfil, setPerfil]     = useState<PerfilCompleto>(perfilVacio)
  const [generado, setGenerado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState('')
  const [analisisIA, setAnalisisIA] = useState<AnalisisIA | undefined>(undefined)
  const docRef = useRef<HTMLDivElement>(null)

  const totalSteps = 5

  function set(field: keyof PerfilCompleto, value: unknown) {
    setPerfil(p => ({ ...p, [field]: value }))
  }

  function avanzar() {
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function retroceder() {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function generar() {
    setCargando(true)
    setError('')
    setStep(6)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      const res = await fetch('/api/personalizado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...perfil, deporteLabel, posicionLabel: posLabel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setAnalisisIA(data.analisisIA)
      setGenerado(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error generando el análisis')
    } finally {
      setCargando(false)
    }
  }

  function reiniciar() {
    setPerfil(perfilVacio)
    setGenerado(false)
    setCargando(false)
    setError('')
    setAnalisisIA(undefined)
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const posActuales = POSICIONES[perfil.deporte] ?? []
  const posLabel = posActuales.find(p => p.id === perfil.posicion)?.label ?? ''
  const deporteLabel = DEPORTES.find(d => d.id === perfil.deporte)?.label ?? ''

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-900 pt-20">

      {/* Header de página */}
      <section className="py-12 bg-dark-900 text-center">
        <div className="section-container">
          <div className="gold-line mx-auto mb-5" />
          <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">Nivel 4</p>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wide mb-3">
            Tu Manual Personalizado
          </h1>
          <p className="text-dark-300 max-w-xl mx-auto text-sm">
            Completa tu perfil, añade la perspectiva de tu técnico y tus padres, y genera tu análisis mental personalizado con el plan de trabajo específico para ti.
          </p>
        </div>
      </section>

      {/* Barra de progreso */}
      {step < 6 && (
        <div className="sticky top-16 z-10 bg-dark-900/95 backdrop-blur border-b border-dark-700 py-3">
          <div className="section-container">
            <div className="flex items-center gap-2 max-w-lg mx-auto">
              {[1,2,3,4,5].map((n, i) => (
                <div key={n} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs shrink-0 transition-colors
                    ${step > n ? 'bg-gold-500 text-dark-800' : step === n ? 'bg-gold-500/20 border-2 border-gold-500 text-gold-500' : 'bg-dark-700 text-dark-500'}`}>
                    {step > n ? '✓' : n}
                  </div>
                  {i < 4 && <div className={`flex-1 h-0.5 ${step > n ? 'bg-gold-500' : 'bg-dark-700'}`} />}
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-dark-400 font-display uppercase tracking-wider">
                {['Tu perfil', 'Tu evaluación', 'Tu técnico', 'Tus padres', 'Revisión'][step - 1]}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="section-container py-10 max-w-2xl">

        {/* ── PASO 1: PERFIL ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <StepHeader step={1} total={totalSteps} title="Tu perfil" subtitle="Cuéntanos quién eres y en qué compites." />

            <Campo label="Nombre completo" required>
              <input className={inputCls} placeholder="Tu nombre" value={perfil.nombre}
                onChange={e => set('nombre', e.target.value)} />
            </Campo>

            <div className="grid grid-cols-2 gap-4">
              <Campo label="Edad">
                <input className={inputCls} placeholder="Ej: 17" type="number" min="8" max="50"
                  value={perfil.edad} onChange={e => set('edad', e.target.value)} />
              </Campo>
              <Campo label="Categoría" required>
                <select className={selectCls} value={perfil.categoria}
                  onChange={e => set('categoria', e.target.value)}>
                  <option value="">Selecciona...</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Campo>
            </div>

            <Campo label="Deporte" required>
              <select className={selectCls} value={perfil.deporte}
                onChange={e => {
                  const d = DEPORTES.find(x => x.id === e.target.value)
                  setPerfil(p => ({ ...p, deporte: e.target.value, deporteLabel: d?.label ?? '', posicion: '', posicionLabel: '' }))
                }}>
                <option value="">Selecciona tu deporte...</option>
                {DEPORTES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
              {perfil.deporte === 'otro' && (
                <input
                  className={inputCls + ' mt-3'}
                  placeholder="¿Cuál es tu deporte?"
                  value={perfil.deporteLabel === 'Otro deporte' ? '' : perfil.deporteLabel}
                  onChange={e => setPerfil(p => ({ ...p, deporteLabel: e.target.value }))}
                />
              )}
            </Campo>

            {perfil.deporte && (
              <Campo label="Posición o rol" required>
                <select className={selectCls} value={perfil.posicion}
                  onChange={e => {
                    const p = posActuales.find(x => x.id === e.target.value)
                    setPerfil(prev => ({ ...prev, posicion: e.target.value, posicionLabel: p?.label ?? '' }))
                  }}>
                  <option value="">Selecciona tu posición...</option>
                  {posActuales.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </Campo>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={avanzar}
                disabled={!perfil.nombre || !perfil.deporte || !perfil.posicion || !perfil.categoria}
                className={`btn-primary text-sm px-8 py-3 ${(!perfil.nombre || !perfil.deporte || !perfil.posicion || !perfil.categoria) ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: AUTOEVALUACIÓN ─────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <StepHeader step={2} total={totalSteps} title="Tu autoevaluación" subtitle="Solo tú sabes cómo te sientes por dentro. Sé honesto/a." />

            <div className="mb-8">
              <h3 className="font-display font-bold text-sm text-gold-500 uppercase tracking-wider mb-3">
                ¿Cuáles son tus fortalezas mentales? <span className="text-dark-400 normal-case font-normal">(elige hasta 3)</span>
              </h3>
              <CheckGrid
                opciones={ASPECTOS_MENTALES}
                seleccionados={perfil.fortalezas}
                max={3}
                onToggle={id => set('fortalezas', toggleAspecto(perfil.fortalezas, id, 3))}
              />
              <div className="mt-3">
                <textarea className={textareaCls} rows={2}
                  placeholder="Describe en tus palabras qué haces bien mentalmente (opcional)..."
                  value={perfil.fortalezasTexto}
                  onChange={e => set('fortalezasTexto', e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-display font-bold text-sm text-gold-500 uppercase tracking-wider mb-3">
                ¿Cuáles son tus mayores desafíos mentales? <span className="text-dark-400 normal-case font-normal">(elige hasta 2)</span>
              </h3>
              <CheckGrid
                opciones={ASPECTOS_MENTALES}
                seleccionados={perfil.desafios}
                max={2}
                onToggle={id => set('desafios', toggleAspecto(perfil.desafios, id, 2))}
              />
              <div className="mt-3">
                <textarea className={textareaCls} rows={2}
                  placeholder="Describe qué es lo que más te cuesta mentalmente (opcional)..."
                  value={perfil.desafiosTexto}
                  onChange={e => set('desafiosTexto', e.target.value)}
                />
              </div>
            </div>

            <Campo label="Situaciones específicas donde tu mente te frena">
              <textarea className={textareaCls} rows={3}
                placeholder="Ej: Cuando voy perdiendo en el segundo tiempo, cuando fallo dos veces seguidas, en los penaltis..."
                value={perfil.situaciones}
                onChange={e => set('situaciones', e.target.value)}
              />
            </Campo>

            <div className="flex items-center justify-between pt-4">
              <BtnBack onClick={retroceder} />
              <button
                type="button"
                onClick={avanzar}
                disabled={perfil.desafios.length === 0}
                className={`btn-primary text-sm px-8 py-3 ${perfil.desafios.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: LO QUE HA DICHO EL ENTRENADOR ─────────────────────── */}
        {step === 3 && (
          <div>
            <StepHeader step={3} total={totalSteps} title="Lo que ha visto tu entrenador/a" subtitle="Tú mismo/a respondes basándote en las conversaciones con tu entrenador/a." />

            <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-sm text-white uppercase tracking-wide">
                    ¿Incluir la perspectiva de tu entrenador/a?
                  </p>
                  <p className="text-dark-400 text-xs mt-1">Opcional · Enriquece el análisis con una visión externa</p>
                </div>
                <button
                  type="button"
                  onClick={() => set('incluyeTecnico', !perfil.incluyeTecnico)}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${perfil.incluyeTecnico ? 'bg-gold-500' : 'bg-dark-600'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${perfil.incluyeTecnico ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {perfil.incluyeTecnico && (
              <div className="space-y-4">
                <Campo label="Nombre del entrenador/a">
                  <input className={inputCls} placeholder="Nombre del entrenador/a"
                    value={perfil.tecnicoNombre} onChange={e => set('tecnicoNombre', e.target.value)} />
                </Campo>
                <Campo label="¿Qué fortalezas mentales ve en ti tu entrenador/a?">
                  <textarea className={textareaCls} rows={4}
                    placeholder="Ej: Me dice que soy muy competitivo, que no me rindo, que tengo buena actitud cuando las cosas van mal..."
                    value={perfil.tecnicoFortalezas}
                    onChange={e => set('tecnicoFortalezas', e.target.value)}
                  />
                </Campo>
                <Campo label="¿Qué te pide mejorar? ¿Cuál dice que es tu mayor área de desarrollo?">
                  <textarea className={textareaCls} rows={4}
                    placeholder="Ej: Me dice que me desconcentro después de los errores, que me pongo muy nervioso en partidos importantes, que debo tener más confianza..."
                    value={perfil.tecnicoDesafios}
                    onChange={e => set('tecnicoDesafios', e.target.value)}
                  />
                </Campo>
              </div>
            )}

            {!perfil.incluyeTecnico && (
              <div className="text-center py-8 text-dark-500">
                <p className="text-sm">Puedes continuar sin incluir esta perspectiva.</p>
                <p className="text-xs mt-1">El análisis se basará solo en tu autoevaluación.</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-6">
              <BtnBack onClick={retroceder} />
              <button type="button" onClick={avanzar} className="btn-primary text-sm px-8 py-3">
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 4: PADRES ─────────────────────────────────────────────── */}
        {step === 4 && (
          <div>
            <StepHeader step={4} total={totalSteps} title="Perspectiva de los padres" subtitle="Cuando los padres están involucrados, el análisis es más completo." />

            <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-sm text-white uppercase tracking-wide">
                    ¿Incluir la perspectiva de los padres?
                  </p>
                  <p className="text-dark-400 text-xs mt-1">Opcional · Para deportistas acompañados por su familia</p>
                </div>
                <button
                  type="button"
                  onClick={() => set('incluyePadres', !perfil.incluyePadres)}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${perfil.incluyePadres ? 'bg-gold-500' : 'bg-dark-600'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${perfil.incluyePadres ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {perfil.incluyePadres && (
              <div className="space-y-4">
                <Campo label="Nombre del padre / madre / tutor">
                  <input className={inputCls} placeholder="Nombre"
                    value={perfil.padresNombre} onChange={e => set('padresNombre', e.target.value)} />
                </Campo>
                <Campo label="¿Cómo observan el rendimiento mental de su hijo/a?">
                  <textarea className={textareaCls} rows={4}
                    placeholder="Descripción de lo que observan en casa y en las competencias: cómo reacciona ante los errores, cómo llega a los partidos, cómo sale de los malos momentos..."
                    value={perfil.padresObservaciones}
                    onChange={e => set('padresObservaciones', e.target.value)}
                  />
                </Campo>
                <Campo label="¿Qué situaciones les generan más preocupación?">
                  <textarea className={textareaCls} rows={3}
                    placeholder="Ej: Se frustra mucho cuando pierde, se pone muy nervioso antes de los partidos importantes, carga mucho los errores..."
                    value={perfil.padresPreocupaciones}
                    onChange={e => set('padresPreocupaciones', e.target.value)}
                  />
                </Campo>
                <Campo label="¿Qué les ha dicho el entrenador/a sobre su hijo/a a nivel mental?">
                  <textarea className={textareaCls} rows={3}
                    placeholder="Ej: El entrenador nos dice que tiene mucho potencial pero que necesita más confianza en sí mismo, que se bloquea en los partidos importantes..."
                    value={perfil.padresEntrenadorDijo}
                    onChange={e => set('padresEntrenadorDijo', e.target.value)}
                  />
                </Campo>
              </div>
            )}

            {!perfil.incluyePadres && (
              <div className="text-center py-8 text-dark-500">
                <p className="text-sm">Puedes continuar sin incluir la perspectiva de los padres.</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-6">
              <BtnBack onClick={retroceder} />
              <button type="button" onClick={avanzar} className="btn-primary text-sm px-8 py-3">
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 5: REVISIÓN ───────────────────────────────────────────── */}
        {step === 5 && (
          <div>
            <StepHeader step={5} total={totalSteps} title="Revisión final" subtitle="Confirma tu información antes de generar el análisis." />

            {/* Resumen */}
            <div className="space-y-4 mb-8">

              <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
                <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-3">Perfil</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-dark-400">Nombre:</span> <span className="text-white font-semibold">{perfil.nombre}</span></div>
                  {perfil.edad && <div><span className="text-dark-400">Edad:</span> <span className="text-white font-semibold">{perfil.edad} años</span></div>}
                  <div><span className="text-dark-400">Deporte:</span> <span className="text-white font-semibold">{deporteLabel}</span></div>
                  <div><span className="text-dark-400">Posición:</span> <span className="text-white font-semibold">{posLabel}</span></div>
                  <div className="col-span-2"><span className="text-dark-400">Categoría:</span> <span className="text-white font-semibold">{perfil.categoria}</span></div>
                </div>
              </div>

              <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
                <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-3">Tu evaluación</p>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-dark-400">Fortalezas: </span>
                    {perfil.fortalezas.length > 0
                      ? <span className="text-white">{perfil.fortalezas.map(id => ASPECTOS_MENTALES.find(a => a.id === id)?.label).join(', ')}</span>
                      : <span className="text-dark-500 italic">No seleccionadas</span>}
                  </div>
                  <div>
                    <span className="text-dark-400">Desafíos: </span>
                    <span className="text-white">{perfil.desafios.map(id => ASPECTOS_MENTALES.find(a => a.id === id)?.label).join(', ')}</span>
                  </div>
                  {perfil.situaciones && (
                    <div><span className="text-dark-400">Situaciones difíciles: </span><span className="text-dark-200 text-xs">{perfil.situaciones}</span></div>
                  )}
                </div>
              </div>

              {perfil.incluyeTecnico && (
                <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
                  <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">
                    Técnico{perfil.tecnicoNombre ? `: ${perfil.tecnicoNombre}` : ''}
                  </p>
                  <p className="text-xs text-dark-400">Perspectiva incluida ✓</p>
                </div>
              )}

              {perfil.incluyePadres && (
                <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
                  <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">
                    Padres{perfil.padresNombre ? `: ${perfil.padresNombre}` : ''}
                  </p>
                  <p className="text-xs text-dark-400">Perspectiva incluida ✓</p>
                </div>
              )}
            </div>

            <Campo label="Tu correo electrónico" required>
              <input className={inputCls} type="email" placeholder="para@enviarte.el.documento"
                value={perfil.email} onChange={e => set('email', e.target.value)} />
              <p className="text-dark-500 text-xs mt-1">Solo se usará para enviarte el documento. Sin spam.</p>
            </Campo>

            <div className="bg-dark-700 border border-gold-500/20 rounded-xl p-4 mb-6">
              <p className="text-dark-300 text-xs leading-relaxed">
                Al generar el análisis confirmas que la información proporcionada es real y aceptas los{' '}
                <Link href="/productos" className="text-gold-500 hover:underline">términos de uso</Link> de La Zona Campeón.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <BtnBack onClick={retroceder} />
              <button
                type="button"
                onClick={generar}
                disabled={!perfil.email}
                className={`btn-primary text-sm px-8 py-3 ${!perfil.email ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Generar mi análisis →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 6: CARGANDO / ERROR / DOCUMENTO ───────────────────────── */}
        {step === 6 && (
          <div>
            {/* Estado: cargando */}
            {cargando && <LoadingAnalisis />}

            {/* Estado: error */}
            {!cargando && error && (
              <div className="text-center py-16">
                <p className="text-red-400 font-display font-bold uppercase tracking-wide text-sm mb-4">{error}</p>
                <button onClick={generar} className="btn-primary text-sm px-8 py-3">
                  Intentar de nuevo
                </button>
              </div>
            )}

            {/* Estado: generado */}
            {!cargando && !error && generado && (
              <>
                <div className="bg-dark-700 border border-gold-500/30 rounded-xl p-5 mb-8 text-center">
                  <p className="font-display font-black text-gold-500 uppercase tracking-wide text-sm mb-1">
                    Tu análisis está listo
                  </p>
                  <p className="text-dark-300 text-xs">
                    Usa el botón de imprimir para guardarlo como PDF.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <button onClick={() => window.print()} className="btn-primary text-sm px-6 py-3 flex-1 justify-center">
                    Imprimir / Guardar PDF
                  </button>
                  <Link href="/productos#nivel-3" className="btn-secondary text-sm px-6 py-3 flex-1 justify-center">
                    Ver manuales recomendados
                  </Link>
                </div>

                <div ref={docRef} id="documento-generado" className="rounded-xl overflow-hidden border border-dark-600">
                  <DocumentoGenerado
                    perfil={{ ...perfil, deporteLabel, posicionLabel: posLabel }}
                    analisisIA={analisisIA}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-dark-700">
                  <button
                    onClick={reiniciar}
                    className="text-dark-400 hover:text-gold-500 text-sm font-display uppercase tracking-wider transition-colors"
                  >
                    ← Generar otro perfil
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          body * { visibility: hidden; }
          #documento-generado, #documento-generado * { visibility: visible; }
          #documento-generado { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}
