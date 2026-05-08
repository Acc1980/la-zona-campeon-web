'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Data ────────────────────────────────────────────────────────────────────

const DEPORTES = [
  { id: 'futbol',     label: 'Fútbol',       icon: '⚽' },
  { id: 'baloncesto', label: 'Baloncesto',    icon: '🏀' },
  { id: 'tenis',      label: 'Tenis',         icon: '🎾' },
  { id: 'atletismo',  label: 'Atletismo',     icon: '🏃' },
  { id: 'natacion',   label: 'Natación',      icon: '🏊' },
  { id: 'otro',       label: 'Otro deporte',  icon: '🏅' },
]

const POSICIONES: Record<string, { id: string; label: string; desc: string }[]> = {
  futbol: [
    { id: 'portero',         label: 'Portero',           desc: 'Bajo los palos, el último recurso del equipo' },
    { id: 'defensa-central', label: 'Defensa Central',   desc: 'Líder de la línea defensiva, duelos 1v1' },
    { id: 'lateral',         label: 'Lateral',            desc: 'Ida y vuelta, el flanco entero es tuyo' },
    { id: 'mediocampista',   label: 'Mediocampista',      desc: 'El motor del equipo, decisiones bajo presión' },
    { id: 'extremo',         label: 'Extremo',            desc: 'Velocidad, desborde y creatividad en banda' },
    { id: 'delantero',       label: 'Delantero Centro',   desc: 'Vivir para el gol, sequías y definición' },
  ],
  baloncesto: [
    { id: 'base',      label: 'Base',       desc: 'Director de juego, toma decisiones en cada posesión' },
    { id: 'escolta',   label: 'Escolta',    desc: 'Anotador y defensor, presión constante' },
    { id: 'alero',     label: 'Alero',      desc: 'Versátil, rol cambiante según el partido' },
    { id: 'pivote',    label: 'Pívot',      desc: 'Bajo el aro, físico y mental al límite' },
  ],
  tenis: [
    { id: 'fondo',     label: 'Jugador de fondo de pista', desc: 'Paciencia, consistencia y gestión del rally' },
    { id: 'red',       label: 'Jugador de red / saque-volea', desc: 'Agresividad, decisión rápida y presión' },
    { id: 'completo',  label: 'Jugador completo',  desc: 'Adaptable a cualquier superficie y situación' },
  ],
  atletismo: [
    { id: 'velocista', label: 'Velocista',  desc: 'Todo se decide en segundos, máxima explosividad' },
    { id: 'fondista',  label: 'Fondista',   desc: 'Resistencia, dolor y mentalidad de largo plazo' },
    { id: 'saltador',  label: 'Saltador / Lanzador', desc: 'Una oportunidad, máxima concentración' },
  ],
  natacion: [
    { id: 'libre',      label: 'Estilo libre',  desc: 'Velocidad y ritmo, la prueba más competida' },
    { id: 'mariposa',   label: 'Mariposa',       desc: 'Técnica exigente, desgaste físico y mental' },
    { id: 'combinado',  label: 'Combinado / Espalda / Braza', desc: 'Versatilidad y adaptación táctica' },
  ],
  otro: [
    { id: 'individual', label: 'Deporte individual', desc: 'Compites contigo mismo y contra el cronómetro' },
    { id: 'equipo',     label: 'Deporte de equipo',  desc: 'Tu rendimiento afecta a los demás y viceversa' },
  ],
}

const DESAFIOS = [
  {
    id: 'espiral',
    label: 'Espiral negativa',
    desc: 'Caigo en ciclos de error → frustración → más errores que no sé cómo romper',
    icon: '🌀',
  },
  {
    id: 'concentracion',
    label: 'Concentración bajo presión',
    desc: 'Pierdo el foco en los momentos clave, me disperso cuando más importa',
    icon: '🎯',
  },
  {
    id: 'confianza',
    label: 'Confianza y autoestima',
    desc: 'Mi confianza baja cuando los resultados no llegan o cometo errores',
    icon: '💪',
  },
  {
    id: 'errores',
    label: 'Manejo de errores',
    desc: 'Me cuesta soltar los fallos rápido y seguir jugando con claridad',
    icon: '🔄',
  },
  {
    id: 'liderazgo',
    label: 'Liderazgo de equipo',
    desc: 'Quiero comunicarme mejor y tener más influencia positiva en mi equipo',
    icon: '🗣️',
  },
]

// ─── Recommendation engine ───────────────────────────────────────────────────

const NIVEL3: Record<string, Record<string, { titulo: string; subtitulo: string; precio: string; disponible: boolean }>> = {
  futbol: {
    portero:         { titulo: 'La Mente del Portero',         subtitulo: 'Fútbol · Portero',         precio: '$17.99', disponible: true },
    'defensa-central': { titulo: 'La Mente del Defensa Central', subtitulo: 'Fútbol · Defensa Central', precio: '$17.99', disponible: true },
    lateral:         { titulo: 'La Mente del Lateral',          subtitulo: 'Fútbol · Lateral',          precio: '$17.99', disponible: true },
    mediocampista:   { titulo: 'La Mente del Mediocampista',    subtitulo: 'Fútbol · Mediocampista',    precio: '$17.99', disponible: true },
    extremo:         { titulo: 'La Mente del Extremo',          subtitulo: 'Fútbol · Extremo',          precio: '$17.99', disponible: true },
    delantero:       { titulo: 'La Mente del Delantero Centro', subtitulo: 'Fútbol · Delantero Centro', precio: '$17.99', disponible: true },
  },
}

const NIVEL2: Record<string, { titulo: string; precio: string }> = {
  espiral:        { titulo: 'La Espiral Negativa',              precio: '$12.99' },
  concentracion:  { titulo: 'Concentración Bajo Presión',       precio: '$12.99' },
  confianza:      { titulo: 'Confianza y Autoestima Deportiva', precio: '$12.99' },
  errores:        { titulo: 'Manejo de Errores y Fracasos',     precio: '$12.99' },
  liderazgo:      { titulo: 'Liderazgo y Comunicación en Equipo', precio: '$12.99' },
}

// ─── Component ───────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

export default function QuizPage() {
  const [step, setStep]         = useState<Step>(1)
  const [deporte, setDeporte]   = useState('')
  const [posicion, setPosicion] = useState('')
  const [desafios, setDesafios] = useState<string[]>([])

  const posicionesActuales = POSICIONES[deporte] ?? []

  const manualN3 = deporte && posicion ? NIVEL3[deporte]?.[posicion] : null
  const manualesN2 = desafios.map(d => ({ id: d, ...NIVEL2[d] })).filter(Boolean)

  const deporteLabel   = DEPORTES.find(d => d.id === deporte)?.label ?? deporte
  const posicionLabel  = posicionesActuales.find(p => p.id === posicion)?.label ?? posicion

  function toggleDesafio(id: string) {
    setDesafios(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : prev.length < 2 ? [...prev, id] : prev
    )
  }

  function irAlResultado() {
    setStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reiniciar() {
    setStep(1)
    setDeporte('')
    setPosicion('')
    setDesafios([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pasos = [
    { num: 1, label: 'Deporte' },
    { num: 2, label: 'Posición' },
    { num: 3, label: 'Desafíos' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Header */}
      <section className="py-12 bg-dark-900 text-center">
        <div className="section-container">
          <div className="gold-line mx-auto mb-5" />
          <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wide mb-3">
            Encuentra Tu Manual
          </h1>
          <p className="text-dark-300 max-w-lg mx-auto">
            Tres preguntas. Tu manual específico según tu deporte, tu posición y tus desafíos mentales.
          </p>
        </div>
      </section>

      {/* Progress — solo visible en pasos 1–3 */}
      {step < 4 && (
        <div className="sticky top-16 z-10 bg-dark-900/95 backdrop-blur border-b border-dark-700 py-4">
          <div className="section-container">
            <div className="flex items-center justify-center gap-2 md:gap-6">
              {pasos.map((p, i) => (
                <div key={p.num} className="flex items-center gap-2 md:gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm transition-colors ${
                      step > p.num
                        ? 'bg-gold-500 text-dark-800'
                        : step === p.num
                        ? 'bg-gold-500/20 border-2 border-gold-500 text-gold-500'
                        : 'bg-dark-700 text-dark-400'
                    }`}
                  >
                    {step > p.num ? '✓' : p.num}
                  </div>
                  <span
                    className={`hidden sm:block font-display text-xs uppercase tracking-wider ${
                      step >= p.num ? 'text-gold-500' : 'text-dark-500'
                    }`}
                  >
                    {p.label}
                  </span>
                  {i < pasos.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 ${step > p.num ? 'bg-gold-500' : 'bg-dark-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="section-container py-12 max-w-3xl">

        {/* ── PASO 1: DEPORTE ── */}
        {step === 1 && (
          <div>
            <div className="mb-8 text-center">
              <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">Paso 1 de 3</p>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wide">
                ¿Cuál es tu deporte?
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {DEPORTES.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDeporte(d.id)
                    setPosicion('')
                    setStep(2)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-200 text-center
                    ${deporte === d.id
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-dark-600 bg-dark-800 hover:border-gold-500/50 hover:bg-dark-700'
                    }`}
                >
                  <span className="text-4xl">{d.icon}</span>
                  <span className="font-display font-bold text-sm text-white uppercase tracking-wide">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PASO 2: POSICIÓN ── */}
        {step === 2 && (
          <div>
            <div className="mb-8 text-center">
              <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">Paso 2 de 3</p>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wide">
                ¿Cuál es tu posición?
              </h2>
              <p className="text-dark-300 mt-2 text-sm">{deporteLabel}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {posicionesActuales.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPosicion(p.id)
                    setStep(3)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`group flex flex-col text-left rounded-xl border-2 p-5 transition-all duration-200
                    ${posicion === p.id
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-dark-600 bg-dark-800 hover:border-gold-500/50 hover:bg-dark-700'
                    }`}
                >
                  <span className="font-display font-bold text-white text-sm uppercase tracking-wide mb-1">
                    {p.label}
                  </span>
                  <span className="text-dark-300 text-xs leading-relaxed">{p.desc}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-dark-400 hover:text-gold-500 text-sm font-display uppercase tracking-wider transition-colors"
            >
              ← Cambiar deporte
            </button>
          </div>
        )}

        {/* ── PASO 3: DESAFÍOS ── */}
        {step === 3 && (
          <div>
            <div className="mb-8 text-center">
              <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">Paso 3 de 3</p>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-wide">
                ¿Cuáles son tus mayores desafíos?
              </h2>
              <p className="text-dark-300 mt-2 text-sm">
                Elige hasta <span className="text-gold-500 font-bold">2 desafíos</span> que más afecten tu rendimiento ahora mismo.
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              {DESAFIOS.map(d => {
                const seleccionado = desafios.includes(d.id)
                const bloqueado    = !seleccionado && desafios.length >= 2
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDesafio(d.id)}
                    disabled={bloqueado}
                    className={`flex items-start gap-4 text-left rounded-xl border-2 p-5 transition-all duration-200
                      ${seleccionado
                        ? 'border-gold-500 bg-gold-500/10'
                        : bloqueado
                        ? 'border-dark-700 bg-dark-800/50 opacity-40 cursor-not-allowed'
                        : 'border-dark-600 bg-dark-800 hover:border-gold-500/50 hover:bg-dark-700'
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                      seleccionado ? 'border-gold-500 bg-gold-500' : 'border-dark-500'
                    }`}>
                      {seleccionado && <span className="text-dark-800 font-black text-xs">✓</span>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{d.icon}</span>
                        <span className="font-display font-bold text-white text-sm uppercase tracking-wide">{d.label}</span>
                      </div>
                      <span className="text-dark-300 text-sm leading-relaxed">{d.desc}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-dark-400 hover:text-gold-500 text-sm font-display uppercase tracking-wider transition-colors"
              >
                ← Cambiar posición
              </button>
              <button
                onClick={irAlResultado}
                disabled={desafios.length === 0}
                className={`btn-primary text-sm px-8 py-3 ${desafios.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Ver mi recomendación →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 4: RESULTADO ── */}
        {step === 4 && (
          <div>
            {/* Perfil */}
            <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 mb-8 flex flex-wrap gap-3">
              <span className="font-display font-bold text-xs text-dark-400 uppercase tracking-widest self-center">Tu perfil:</span>
              <span className="bg-dark-700 text-gold-500 font-display font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full">
                {deporteLabel}
              </span>
              {posicionLabel && (
                <span className="bg-dark-700 text-gold-500 font-display font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {posicionLabel}
                </span>
              )}
              {desafios.map(id => (
                <span key={id} className="bg-dark-700 text-gold-500 font-display font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {DESAFIOS.find(d => d.id === id)?.label}
                </span>
              ))}
            </div>

            {/* Manual Nivel 3 */}
            <div className="mb-6">
              <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-4">
                {manualN3?.disponible ? '✦ Tu manual de posición' : '✦ Manual de posición'}
              </p>

              {manualN3?.disponible ? (
                <div className="relative bg-dark-800 border-2 border-gold-500 rounded-xl p-6 shadow-xl shadow-gold-500/10">
                  <div className="absolute -top-3 left-6">
                    <span className="bg-gold-500 text-dark-800 font-display font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full">
                      Recomendado para ti
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 flex-wrap mt-2">
                    <div>
                      <p className="text-dark-400 text-xs font-display uppercase tracking-wider mb-1">Nivel 2 · {manualN3.subtitulo}</p>
                      <h3 className="font-display font-black text-xl text-white uppercase tracking-wide">
                        {manualN3.titulo}
                      </h3>
                    </div>
                    <span className="font-display font-black text-2xl text-gold-500 shrink-0">{manualN3.precio}</span>
                  </div>
                  <p className="text-dark-300 text-sm mt-3 mb-5 leading-relaxed">
                    Un manual diseñado específicamente para los desafíos mentales de tu posición: los momentos que solo tú vives, los errores que solo tú cometes y las herramientas que realmente aplican a tu juego.
                  </p>
                  <Link href="/productos#nivel-2" className="btn-primary text-sm px-6 py-3">
                    Ver manual →
                  </Link>
                </div>
              ) : (
                <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 opacity-70">
                  <p className="text-dark-400 text-xs font-display uppercase tracking-wider mb-1">Nivel 2 · {deporteLabel} · {posicionLabel}</p>
                  <h3 className="font-display font-black text-lg text-white uppercase tracking-wide mb-2">
                    Manual de posición — Próximamente
                  </h3>
                  <p className="text-dark-300 text-sm mb-4">
                    Estamos desarrollando el manual específico para tu deporte y posición. Déjanos tu correo para avisarte cuando esté disponible.
                  </p>
                  <Link href="/gratis" className="btn-secondary text-sm px-6 py-3">
                    Avísame cuando esté disponible
                  </Link>
                </div>
              )}
            </div>

            {/* Manuales Nivel 2 */}
            {manualesN2.length > 0 && (
              <div className="mb-8">
                <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-4">
                  ✦ Complementa con estos manuales generales
                </p>
                <div className="flex flex-col gap-3">
                  {manualesN2.map(m => (
                    <div key={m.id} className="bg-dark-800 border border-dark-600 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-dark-400 text-xs font-display uppercase tracking-wider mb-0.5">Nivel 1</p>
                        <h4 className="font-display font-bold text-white text-sm uppercase tracking-wide">{m.titulo}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-display font-black text-gold-500 text-lg">{m.precio}</span>
                        <Link href="/productos#nivel-1" className="btn-secondary text-xs px-5 py-2.5">
                          Ver manual
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bundle */}
            {manualN3?.disponible && manualesN2.length > 0 && (
              <div className="bg-dark-700 border border-gold-500/30 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">💡</span>
                  <div>
                    <p className="font-display font-bold text-white text-sm uppercase tracking-wide mb-1">
                      Consejo
                    </p>
                    <p className="text-dark-300 text-sm leading-relaxed">
                      El manual de posición trabaja los desafíos específicos de tu rol en el campo. Los manuales generales van más a fondo en los aspectos mentales que elegiste. Juntos cubren todo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* N4 Personalizado — siempre visible */}
            <div className="mb-8 bg-dark-800 border border-gold-500/40 rounded-xl p-6">
              <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-3">
                ✦ La opción más completa
              </p>
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <p className="text-dark-400 text-xs font-display uppercase tracking-wider mb-1">Nivel 3 · 100% Personalizado</p>
                  <h3 className="font-display font-black text-xl text-white uppercase tracking-wide">
                    Manual para ti, no para tu posición
                  </h3>
                </div>
                <span className="font-display font-black text-2xl text-gold-500 shrink-0">$29.99</span>
              </div>
              <p className="text-dark-300 text-sm leading-relaxed mb-5">
                El quiz recomendó manuales para tu deporte y posición. El N4 va un paso más allá: se genera según tus fortalezas, tus desafíos específicos y las situaciones reales que vives tú. Es el único manual que nadie más tiene igual.
              </p>
              <Link href="/personalizado" className="btn-primary text-sm px-6 py-3 inline-block">
                Generar Mi Manual Personalizado →
              </Link>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-dark-700">
              <button
                onClick={reiniciar}
                className="text-dark-400 hover:text-gold-500 text-sm font-display uppercase tracking-wider transition-colors"
              >
                ← Hacer el test de nuevo
              </button>
              <Link href="/productos" className="btn-secondary text-sm px-6 py-3">
                Ver todos los manuales
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
