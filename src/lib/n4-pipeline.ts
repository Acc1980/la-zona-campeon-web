import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const ASPECTOS: Record<string, { label: string; fortaleza: string; desafio: string }> = {
  concentracion: {
    label: 'Concentración bajo presión',
    fortaleza: 'Tu capacidad de mantener el foco en los momentos de mayor exigencia es un activo real. Los deportistas con concentración sólida toman mejores decisiones justo cuando el partido más lo pide, y eso se nota en el rendimiento en los últimos minutos o en las situaciones decisivas.',
    desafio: 'Mantener la concentración bajo presión es uno de los trabajos mentales más exigentes en el deporte. La mente tiende a irse hacia el resultado, hacia lo que puede salir mal o hacia lo que ya salió. El entrenamiento específico en este área consiste en recuperar el foco al momento presente de forma deliberada y sistemática.',
  },
  confianza: {
    label: 'Confianza y autoestima',
    fortaleza: 'Tienes una base de confianza sobre tu capacidad que te permite competir sin que cada error te destruya. Esa confianza —cuando está bien construida— no depende del último resultado sino de la certeza de tu trabajo y tu preparación.',
    desafio: 'La confianza que oscila con los resultados es frágil. El trabajo en este área apunta a construir una confianza interna que no depende de si el partido sale bien o mal, sino de la certeza en el proceso de preparación. Eso se construye y se puede entrenar.',
  },
  errores: {
    label: 'Manejo de errores y fracasos',
    fortaleza: 'Tu capacidad de procesar los errores rápido y volver al juego con claridad es una ventaja competitiva directa. Los deportistas que sueltan el error en segundos tienen más tiempo de juego efectivo que los que lo cargan durante minutos.',
    desafio: 'La reacción al error es uno de los patrones más trabajables en psicología deportiva. El objetivo no es no sentir nada cuando se falla —es comprimir el tiempo entre el error y la recuperación, para que ese momento no destruya el rendimiento siguiente.',
  },
  liderazgo: {
    label: 'Liderazgo y comunicación en equipo',
    fortaleza: 'Tu capacidad de influir positivamente en el equipo y comunicarte bien en los momentos difíciles tiene un impacto que va más allá de tu propio rendimiento individual. Los equipos que tienen jugadores con liderazgo genuino rinden diferente bajo presión.',
    desafio: 'El liderazgo deportivo no es un rasgo innato —es una habilidad que se desarrolla. Aprender a comunicar de manera que active a los compañeros en lugar de presionarlos, y a mantener la calma colectiva cuando el partido se complica, son habilidades concretas y entrenables.',
  },
  espiral: {
    label: 'Control de la espiral negativa',
    fortaleza: 'Identificar cuándo estás entrando en una espiral y tener herramientas para interrumpirla es una habilidad mental avanzada. Eso significa que los ciclos de error → frustración → más errores no te atrapan durante mucho tiempo.',
    desafio: 'La espiral negativa es el patrón mental más destructivo en el deporte porque se alimenta a sí mismo: un error genera frustración, la frustración genera más errores, y el ciclo sigue. Aprender a interrumpir ese ciclo en los primeros segundos —antes de que tome velocidad— es el trabajo central en esta área.',
  },
  regularidad: {
    label: 'Regularidad y consistencia',
    fortaleza: 'Mantener un nivel estable de rendimiento partido a partido —sin depender de los picos de inspiración ni hundirte en los valles— es la base de la carrera deportiva a largo plazo. La consistencia es lo que construye la confianza de técnicos y compañeros.',
    desafio: 'La irregularidad en el rendimiento tiene raíces mentales claras: la carga emocional del último partido, la expectativa del próximo, el manejo de la crítica o la presión del entorno. Trabajar la consistencia mental significa encontrar la base estable desde la que siempre puedes operar, independientemente de las circunstancias externas.',
  },
  presion: {
    label: 'Rendir bajo presión alta',
    fortaleza: 'Activarte en los partidos grandes, en los momentos de alta presión, y rendir en esas circunstancias es una de las habilidades más valoradas en el deporte de competición. No todos los deportistas rinden mejor cuando el contexto es más exigente.',
    desafio: 'La presión alta —partidos decisivos, situaciones de ventaja que defender, errores críticos— activa respuestas físicas y mentales que pueden interferir con el rendimiento. El entrenamiento en este área trabaja específicamente cómo interpretar y canalizar esa activación para que sea combustible en lugar de freno.',
  },
  mentalidad: {
    label: 'Mentalidad ante la derrota',
    fortaleza: 'Tu capacidad de procesar una derrota sin que defina tu identidad o destruya tu motivación es fundamental para la continuidad deportiva. Los deportistas que aprenden de las derrotas sin hundirse en ellas recuperan antes y crecen más rápido.',
    desafio: 'La derrota tiene un impacto diferente en cada deportista, y eso depende en gran medida de cómo se interpreta. Trabajar la mentalidad ante la derrota no significa no afectarse —significa aprender a transitar ese proceso de manera que deje aprendizaje y no solo dolor.',
  },
}

const ASPECTOS_LABELS: Record<string, string> = Object.fromEntries(Object.entries(ASPECTOS).map(([k, v]) => [k, v.label]))

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function buildPerfilTexto(p: Record<string, unknown>): string {
  const fortalezasLabels = (p.fortalezas as string[]).map(f => ASPECTOS_LABELS[f] || f).join(', ')
  const desafiosLabels = (p.desafios as string[]).map(d => ASPECTOS_LABELS[d] || d).join(', ')

  let txt = `DEPORTISTA: ${p.nombre}${p.edad ? ` · ${p.edad} años` : ''}
DEPORTE: ${p.deporteLabel} | POSICIÓN: ${p.posicionLabel} | CATEGORÍA: ${p.categoria}
FORTALEZAS MENTALES: ${fortalezasLabels}
${p.fortalezasTexto ? `En sus palabras (fortalezas): "${p.fortalezasTexto}"` : ''}
DESAFÍOS PRIORITARIOS: ${desafiosLabels}
${p.desafiosTexto ? `En sus palabras (desafíos): "${p.desafiosTexto}"` : ''}
${p.situaciones ? `Situaciones donde la mente le frena: "${p.situaciones}"` : ''}`

  if (p.incluyeTecnico && (p.tecnicoFortalezas || p.tecnicoDesafios)) {
    txt += `\n\nPERSPECTIVA DEL ENTRENADOR/A${p.tecnicoNombre ? ` (${p.tecnicoNombre})` : ''}:`
    if (p.tecnicoFortalezas) txt += `\n· Fortalezas que ve: "${p.tecnicoFortalezas}"`
    if (p.tecnicoDesafios) txt += `\n· Qué pide mejorar: "${p.tecnicoDesafios}"`
  }

  if (p.incluyePadres && (p.padresObservaciones || p.padresPreocupaciones || p.padresEntrenadorDijo)) {
    txt += `\n\nPERSPECTIVA DE LOS PADRES${p.padresNombre ? ` (${p.padresNombre})` : ''}:`
    if (p.padresObservaciones) txt += `\n· Observan desde casa: "${p.padresObservaciones}"`
    if (p.padresPreocupaciones) txt += `\n· Les preocupa: "${p.padresPreocupaciones}"`
    if (p.padresEntrenadorDijo) txt += `\n· El entrenador les ha dicho: "${p.padresEntrenadorDijo}"`
  }

  return txt
}

export function parseJSON(text: string): Record<string, unknown> | null {
  // Find the first { and the last } to handle extra text before/after
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    // If still fails, try to find valid JSON block
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    try { return JSON.parse(match[0]) } catch { return null }
  }
}

// ─── Agentes ─────────────────────────────────────────────────────────────────

async function agente1_generador(perfilTexto: string, nombre: string, deporte: string, posicion: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: `Eres un psicólogo deportivo de élite especializado en rendimiento mental.
Tu tarea es generar análisis mentales personalizados profundos y accionables para deportistas.
Escribes de forma directa, empática y sin rodeos. Cada análisis debe sentirse escrito específicamente para esa persona, no como una plantilla genérica.
Las herramientas de seguimiento deben ser 100% específicas al deporte, posición y desafíos concretos del deportista — nunca genéricas.
Responde ÚNICAMENTE con JSON válido, sin texto antes ni después.`,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{
      role: 'user',
      content: `Genera el análisis mental personalizado para este deportista:

${perfilTexto}

Responde ÚNICAMENTE con este JSON (sin texto adicional):
{
  "diagnostico": "2 párrafos sólidos. Menciona a ${nombre} por nombre. Conecta su deporte (${deporte}, ${posicion}) con los patrones específicos de su perfil. Sé concreto sobre qué está pasando mentalmente y por qué.",
  "estrategias": [
    {"titulo": "Nombre de la estrategia (máx 5 palabras)", "descripcion": "Explicación práctica de 2-3 líneas. Debe ser accionable y específica para su perfil."},
    {"titulo": "...", "descripcion": "..."},
    {"titulo": "...", "descripcion": "..."}
  ],
  "plan4semanas": [
    {"semana": 1, "titulo": "Título de la semana", "foco": "Objetivo central de esta semana en una frase", "ejercicios": ["Ejercicio concreto y específico 1 para ${deporte}/${posicion}", "Ejercicio concreto 2", "Ejercicio concreto 3"]},
    {"semana": 2, "titulo": "...", "foco": "...", "ejercicios": ["...", "...", "..."]},
    {"semana": 3, "titulo": "...", "foco": "...", "ejercicios": ["...", "...", "..."]},
    {"semana": 4, "titulo": "...", "foco": "...", "ejercicios": ["...", "...", "..."]}
  ],
  "registroDiario": {
    "habitos": [
      {"nombre": "Nombre del hábito (máx 4 palabras, específico a ${deporte}/${posicion})", "descripcion": "Qué hace exactamente y cuándo. Vinculado a sus desafíos concretos."},
      {"nombre": "...", "descripcion": "..."},
      {"nombre": "...", "descripcion": "..."},
      {"nombre": "...", "descripcion": "..."},
      {"nombre": "...", "descripcion": "..."}
    ]
  },
  "autoevaluacionSemanal": {
    "preguntas": [
      {"area": "Área específica (ej: Concentración en partidos)", "pregunta": "Pregunta concreta en primera persona que el deportista se hace al final de la semana. Debe referirse a situaciones reales de ${deporte}/${posicion}."},
      {"area": "...", "pregunta": "..."},
      {"area": "...", "pregunta": "..."},
      {"area": "...", "pregunta": "..."},
      {"area": "...", "pregunta": "..."},
      {"area": "...", "pregunta": "..."}
    ]
  },
  "mensajeFinal": "Un párrafo corto (3-4 líneas) dirigido directamente a ${nombre}. Personal, específico a su deporte y posición, genuinamente motivador sin ser genérico."
}`,
    }],
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : '{}'
}

async function agente2_revisor(perfilTexto: string, borrador: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: [
      {
        type: 'text',
        text: `Eres un revisor editorial de documentos de psicología deportiva. Tu rol es detectar problemas de calidad en análisis mentales personalizados.
Evalúas: (1) personalización real vs. texto genérico, (2) coherencia entre el perfil y el análisis, (3) especificidad de los ejercicios al deporte y posición, (4) que los hábitos del registro diario sean concretos y no genéricos, (5) que las preguntas de autoevaluación reflejen situaciones reales del deporte/posición del deportista.
Responde en formato de lista concisa de correcciones. Si el análisis es correcto, responde "APROBADO".`,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{
      role: 'user',
      content: `Revisa este análisis mental para el siguiente perfil. Identifica máximo 3 problemas concretos a corregir.

PERFIL:
${perfilTexto}

BORRADOR:
${borrador}

Responde con una lista numerada de correcciones específicas, o "APROBADO" si el análisis está bien.`,
    }],
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : 'APROBADO'
}

async function agente3_implementador(perfilTexto: string, borrador: string, correcciones: string): Promise<string> {
  if (correcciones.trim().toUpperCase().startsWith('APROBADO')) {
    return borrador
  }

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: `Eres un psicólogo deportivo editor. Recibes un análisis mental borrador y una lista de correcciones. Aplicas las correcciones y devuelves el análisis mejorado.
Responde ÚNICAMENTE con el JSON corregido, sin texto antes ni después. Mantén exactamente la misma estructura del JSON original.`,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{
      role: 'user',
      content: `Aplica estas correcciones al borrador y devuelve el JSON mejorado.

PERFIL DEL DEPORTISTA:
${perfilTexto}

CORRECCIONES A IMPLEMENTAR:
${correcciones}

BORRADOR A MEJORAR:
${borrador}

Devuelve ÚNICAMENTE el JSON corregido con la misma estructura.`,
    }],
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : borrador
}

// ─── Pipeline principal ───────────────────────────────────────────────────────

export async function runPipeline(perfil: Record<string, unknown>): Promise<Record<string, unknown>> {
  const perfilTexto = buildPerfilTexto(perfil)
  const nombre = perfil.nombre as string
  const deporteLabel = perfil.deporteLabel as string
  const posicionLabel = perfil.posicionLabel as string

  let analisisIA: Record<string, unknown> | null = null
  let ultimoError = ''

  for (let intento = 1; intento <= 3; intento++) {
    try {
      const borrador = await agente1_generador(perfilTexto, nombre, deporteLabel, posicionLabel)
      const correcciones = await agente2_revisor(perfilTexto, borrador)
      const final = await agente3_implementador(perfilTexto, borrador, correcciones)
      analisisIA = parseJSON(final)
      if (analisisIA) break
      ultimoError = `Intento ${intento}: JSON inválido`
      console.warn(`[n4-pipeline] ${ultimoError} — reintentando...`)
    } catch (err) {
      ultimoError = `Intento ${intento}: ${err instanceof Error ? err.message : 'error desconocido'}`
      console.warn(`[n4-pipeline] ${ultimoError} — reintentando...`)
      if (intento === 3) throw err
    }
  }

  if (!analisisIA) {
    throw new Error(`Pipeline falló tras 3 intentos. Último error: ${ultimoError}`)
  }

  return analisisIA
}

// ─── Generador HTML completo ─────────────────────────────────────────────────

export function generarManualHTML(perfil: Record<string, unknown>, analisis: Record<string, unknown>): string {
  const nombre = perfil.nombre as string
  const deporteLabel = perfil.deporteLabel as string
  const posicionLabel = perfil.posicionLabel as string
  const categoria = (perfil.categoria as string) ?? ''
  const edad = (perfil.edad as string) ?? ''
  const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const fechaExpira = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  const fortalezas = (perfil.fortalezas as string[]) ?? []
  const desafios = (perfil.desafios as string[]) ?? []
  const fortalezasTexto = (perfil.fortalezasTexto as string) ?? ''
  const desafiosTexto = (perfil.desafiosTexto as string) ?? ''
  const situaciones = (perfil.situaciones as string) ?? ''
  const incluyeTecnico = !!(perfil.incluyeTecnico && ((perfil.tecnicoFortalezas as string) || (perfil.tecnicoDesafios as string)))
  const tecnicoNombre = (perfil.tecnicoNombre as string) ?? ''
  const tecnicoFortalezas = (perfil.tecnicoFortalezas as string) ?? ''
  const tecnicoDesafios = (perfil.tecnicoDesafios as string) ?? ''
  const incluyePadres = !!(perfil.incluyePadres && ((perfil.padresObservaciones as string) || (perfil.padresPreocupaciones as string) || (perfil.padresEntrenadorDijo as string)))
  const padresNombre = (perfil.padresNombre as string) ?? ''
  const padresObservaciones = (perfil.padresObservaciones as string) ?? ''
  const padresPreocupaciones = (perfil.padresPreocupaciones as string) ?? ''
  const padresEntrenadorDijo = (perfil.padresEntrenadorDijo as string) ?? ''
  const esJuvenil = ['Infantil (sub-12)', 'Juvenil temprano (sub-13 / sub-15)'].includes(categoria)

  type Estrategia = { titulo: string; descripcion: string }
  type Semana = { semana: number; titulo: string; foco: string; ejercicios?: string[] }
  type Habito = { nombre: string; descripcion: string }
  type Pregunta = { area: string; pregunta: string }

  const diagnostico = (analisis.diagnostico as string) ?? ''
  const estrategias = (analisis.estrategias as Estrategia[]) ?? []
  const plan = (analisis.plan4semanas as Semana[]) ?? []
  const habitos = (analisis.registroDiario as { habitos?: Habito[] })?.habitos ?? []
  const preguntas = (analisis.autoevaluacionSemanal as { preguntas?: Pregunta[] })?.preguntas ?? []
  const mensajeFinal = (analisis.mensajeFinal as string) ?? ''

  const css = `
    <style>
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      :root{--gold:#c8aa32;--dark:#1a1a2e;--cream:#f5f0e8;--red:#c85050;--green:#2e7d32;--blue:#3a7bd5}
      body{font-family:'Helvetica Neue',Arial,sans-serif;background:var(--cream);color:#1a1a2e;line-height:1.7}
      .brand-bar{background:var(--dark);color:var(--gold);text-align:center;padding:10px 20px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase}
      .cover{background:var(--dark);color:var(--cream);text-align:center;padding:56px 30px 48px}
      .cover .badge{display:inline-block;background:var(--gold);color:var(--dark);font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:5px 16px;border-radius:20px;margin-bottom:22px}
      .cover h1{font-size:clamp(1.8rem,5vw,2.8rem);font-weight:900;margin-bottom:10px}
      .cover h1 span{color:var(--gold)}
      .cover .sub{font-size:.95rem;color:rgba(245,240,232,.7);margin-bottom:6px}
      .expiry-bar{background:#7b2f00;color:#fff;text-align:center;padding:14px 24px;font-size:13px;font-weight:600;border-bottom:2px solid #c8430a}
      .expiry-bar strong{color:#ffa060}
      .print-btn{position:fixed;bottom:24px;right:24px;background:var(--gold);color:var(--dark);border:none;border-radius:50px;padding:13px 26px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:999;text-decoration:none;display:inline-block}
      .page{max-width:800px;margin:0 auto;padding:44px 24px 80px}
      .section-label{font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:3px;margin-bottom:8px}
      .section-title{font-size:1.4rem;font-weight:800;color:var(--dark);margin-bottom:20px;border-bottom:2px solid var(--gold);padding-bottom:10px}
      .block{margin-bottom:44px}
      .card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:18px 20px;margin-bottom:10px}
      .card.gold{border-left:4px solid var(--gold)}
      .card.green{border-left:4px solid var(--green)}
      .card.red{border-left:4px solid var(--red)}
      .card.blue{border-left:4px solid var(--blue)}
      .card-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
      .card-text{font-size:.9rem;line-height:1.7;color:#333}
      .italic{font-style:italic;color:#555;font-size:.88rem}
      .uso-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;background:var(--dark);border-radius:10px;padding:28px 24px;margin-bottom:0}
      .uso-item{text-align:center}
      .uso-num{width:36px;height:36px;border-radius:50%;background:var(--gold);color:var(--dark);font-weight:900;font-size:1rem;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
      .uso-t{font-size:10px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
      .uso-d{font-size:10px;color:rgba(245,240,232,.6);line-height:1.5}
      .plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
      .week-card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:18px 20px}
      .week-num{font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
      .week-title{font-size:.88rem;font-weight:700;color:var(--dark);margin-bottom:4px}
      .week-foco{font-size:.82rem;color:#555;font-style:italic;margin-bottom:10px}
      .week-card ul{margin:0;padding-left:18px}
      .week-card li{font-size:.85rem;color:#333;margin-bottom:4px;line-height:1.6}
      .habit-table{width:100%;border-collapse:collapse;font-size:.82rem;margin-top:8px}
      .habit-table th{background:var(--dark);color:var(--gold);padding:10px 8px;text-align:center;font-size:.7rem;text-transform:uppercase;letter-spacing:1px}
      .habit-table th:first-child{text-align:left;padding-left:14px}
      .habit-table td{padding:12px 8px;text-align:center;border-bottom:1px solid #e8e8e8;color:#bbb}
      .habit-table td:first-child{text-align:left;padding-left:14px;color:#1a1a2e}
      .habit-table tr:nth-child(even) td{background:#faf8f3}
      .habit-name{font-weight:700;font-size:.82rem;margin-bottom:2px}
      .habit-desc{font-size:.76rem;color:#777;line-height:1.5}
      .eval-card{background:#fff;border:1px solid #e0e0e0;border-left:4px solid var(--gold);border-radius:6px;padding:14px 16px;margin-bottom:10px}
      .eval-area{font-size:10px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
      .eval-q{font-size:.88rem;color:var(--dark);line-height:1.7;margin-bottom:10px}
      .eval-scale{display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin-bottom:8px}
      .eval-box{width:22px;height:22px;border:1px solid #ddd;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:.62rem;color:#bbb}
      .eval-line{border-top:1px dashed #e0e0e0;padding-top:8px;font-size:.75rem;color:#aaa}
      .acomp-card{background:#fff;border:1px solid #e0e0e0;border-radius:6px;padding:14px 16px;margin-bottom:10px}
      .cierre{text-align:center;border-top:2px solid var(--gold);padding-top:36px;margin-top:20px}
      .dark-block{background:var(--dark);border-radius:8px;padding:20px 22px}
      @media print{.print-btn{display:none!important}.expiry-bar{display:none!important}body{background:#fff}}
      @media(max-width:600px){.plan-grid{grid-template-columns:1fr}.habit-table{font-size:.7rem}}
    </style>`

  const usoItems = [
    { n: '1', t: 'Lee el diagnóstico', d: 'Entiende tu perfil mental actual y tus áreas prioritarias.' },
    { n: '2', t: 'Sigue el plan 4 semanas', d: 'Un paso concreto por semana. Sin saltar etapas.' },
    { n: '3', t: 'Registro diario', d: 'Marca tus hábitos cada día. La constancia es la clave.' },
    { n: '4', t: 'Autoevalúate cada domingo', d: 'Puntúa tu semana y ajusta lo que necesites.' },
    ...(esJuvenil ? [{ n: '5', t: 'Guía para padres', d: 'Al final del manual encontrarás la sección para tu acompañante.' }] : []),
  ]

  const fortalezasSec = fortalezas.filter(id => ASPECTOS[id]).map(id => `
    <div class="card green">
      <div class="card-label" style="color:var(--green)">${ASPECTOS[id].label}</div>
      <div class="card-text">${ASPECTOS[id].fortaleza}</div>
    </div>`).join('') +
    (fortalezasTexto ? `<div class="card gold"><div class="card-label">En sus propias palabras</div><div class="card-text italic">${fortalezasTexto}</div></div>` : '')

  const desafiosSec = desafios.filter(id => ASPECTOS[id]).map((id, i) => `
    <div class="card red">
      <div class="card-label" style="color:var(--red)">Prioridad ${i + 1} — ${ASPECTOS[id].label}</div>
      <div class="card-text">${ASPECTOS[id].desafio}</div>
    </div>`).join('') +
    (desafiosTexto ? `<div class="card gold"><div class="card-label">En sus propias palabras</div><div class="card-text italic">${desafiosTexto}</div></div>` : '') +
    (situaciones ? `<div class="card" style="background:#fff0f0;border:1px solid #f0c0c0"><div class="card-label">Situaciones específicas mencionadas</div><div class="card-text">${situaciones}</div></div>` : '')

  const tecnicoSec = incluyeTecnico ? `
    <div class="block">
      <div class="section-label">Sección 3</div>
      <div class="section-title">Perspectiva del técnico${tecnicoNombre ? `: ${tecnicoNombre}` : ''}</div>
      ${tecnicoFortalezas ? `<div class="card green"><div class="card-label" style="color:var(--green)">Lo que el técnico observa como fortaleza</div><div class="card-text italic">${tecnicoFortalezas}</div></div>` : ''}
      ${tecnicoDesafios ? `<div class="card red"><div class="card-label" style="color:var(--red)">Lo que el técnico considera que debe trabajar</div><div class="card-text italic">${tecnicoDesafios}</div></div>` : ''}
    </div>` : ''

  const padresSec = incluyePadres ? `
    <div class="block">
      <div class="section-label">Sección 4</div>
      <div class="section-title">Perspectiva de los padres${padresNombre ? `: ${padresNombre}` : ''}</div>
      ${padresObservaciones ? `<div class="card blue"><div class="card-label" style="color:var(--blue)">Lo que observan desde casa</div><div class="card-text italic">${padresObservaciones}</div></div>` : ''}
      ${padresPreocupaciones ? `<div class="card" style="border-left:4px solid #e07b30"><div class="card-label" style="color:#e07b30">Situaciones que les generan preocupación</div><div class="card-text italic">${padresPreocupaciones}</div></div>` : ''}
      ${padresEntrenadorDijo ? `<div class="card"><div class="card-label" style="color:#6b7280">Lo que el entrenador/a les ha dicho</div><div class="card-text italic">${padresEntrenadorDijo}</div></div>` : ''}
    </div>` : ''

  const planSec = plan.length ? `
    <div class="block">
      <div class="section-label">Plan de trabajo</div>
      <div class="section-title">Tu plan — Próximas 4 semanas</div>
      <div class="plan-grid">
        ${plan.map(s => `
          <div class="week-card">
            <div class="week-num">Semana ${s.semana}</div>
            <div class="week-title">${s.titulo}</div>
            <div class="week-foco">${s.foco}</div>
            ${s.ejercicios?.length ? `<ul>${s.ejercicios.map(e => `<li>${e}</li>`).join('')}</ul>` : ''}
          </div>`).join('')}
      </div>
    </div>` : ''

  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const habitosSec = habitos.length ? `
    <div class="block" style="page-break-before:always">
      <div class="section-label">Herramienta de seguimiento · 1</div>
      <div class="section-title">Registro diario</div>
      <p style="font-size:.88rem;color:#555;margin-bottom:16px">Marca cada hábito al finalizar el día. ✓ si lo hiciste, ✗ si no. Sin juicio — solo registro honesto.</p>
      <div style="overflow-x:auto">
        <table class="habit-table">
          <thead><tr>
            <th>Hábito mental</th>
            ${dias.map(d => `<th>${d}</th>`).join('')}
          </tr></thead>
          <tbody>
            ${habitos.map(h => `<tr>
              <td><div class="habit-name">${h.nombre}</div><div class="habit-desc">${h.descripcion}</div></td>
              ${dias.map(() => `<td>○</td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p style="font-size:.76rem;color:#999;margin-top:10px;font-style:italic">Imprime una tabla por semana. Guárdalas para ver tu evolución.</p>
    </div>` : ''

  const evalSec = preguntas.length ? `
    <div class="block">
      <div class="section-label">Herramienta de seguimiento · 2</div>
      <div class="section-title">Autoevaluación semanal</div>
      <p style="font-size:.88rem;color:#555;margin-bottom:16px">Cada domingo, dedica 10 minutos. Puntúa del 1 al 10 y escribe una frase de reflexión.</p>
      ${preguntas.map((p, i) => `
        <div class="eval-card">
          <div class="eval-area">${p.area}</div>
          <div class="eval-q">${i + 1}. ${p.pregunta}</div>
          <div class="eval-scale">
            <span style="font-size:.65rem;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-right:6px">Puntuación:</span>
            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<div class="eval-box">${n}</div>`).join('')}
          </div>
          <div class="eval-line">Reflexión: _______________________________________________</div>
        </div>`).join('')}
    </div>` : ''

  const acompSec = esJuvenil ? `
    <div class="block" style="page-break-before:always">
      <div class="section-label" style="color:var(--blue)">Para el padre / madre / acompañante</div>
      <div class="section-title" style="border-color:var(--blue)">Cómo acompañar a ${nombre} en este proceso</div>
      <p style="font-size:.88rem;color:#555;margin-bottom:20px;line-height:1.8">El entrenamiento mental en deportistas jóvenes funciona mucho mejor cuando el entorno familiar acompaña sin presionar.</p>
      ${[
        { t: 'Antes del partido', c: 'var(--blue)', p: [`Evita darle instrucciones técnicas justo antes de competir.`, `Una frase de confianza vale más que diez consejos. Ej: "Confío en ti. Disfrútalo."`, `Si ${nombre} tiene una rutina de preparación, respétala.`, `No hables de resultados antes del partido. Habla de actitud y esfuerzo.`] },
        { t: 'Durante el partido', c: '#e07b30', p: [`Aplaudir los esfuerzos, no solo los goles.`, `Evitar gritar instrucciones desde la grada.`, `Si comete un error, mantén la calma visible desde fuera.`, `No compares su rendimiento con el de otros jugadores.`] },
        { t: 'Después del partido', c: 'var(--green)', p: [`Primero pregunta cómo se sintió, antes de dar tu evaluación.`, `Dale al menos 20-30 minutos antes de hablar del partido si perdieron.`, `Un solo aprendizaje por partido es suficiente.`, `Refuerza el proceso: "Vi que seguiste intentando después del error."`] },
        { t: 'En el día a día', c: 'var(--gold)', p: [`Apoya el registro diario sin presionar.`, `No conviertas cada conversación en análisis de rendimiento.`, `Celebra el trabajo, no solo los resultados.`, `Si hay una racha difícil, escucha antes de aconsejar.`] },
      ].map(s => `<div class="acomp-card" style="border-left:4px solid ${s.c}"><div class="card-label" style="color:${s.c}">${s.t}</div><ul style="margin:0;padding-left:18px">${s.p.map(pt => `<li style="font-size:.88rem;color:#333;margin-bottom:6px;line-height:1.6">${pt}</li>`).join('')}</ul></div>`).join('')}
    </div>` : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Manual Mental — ${nombre} · La Zona Campeón</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet"/>
  ${css}
</head>
<body>
  <div class="brand-bar">La Zona Campeón · Control Mental para Deportistas</div>

  <div class="expiry-bar">
    Tu acceso es válido hasta el ${fechaExpira} — puedes consultarlo cuando quieras durante ese período.
    <span style="margin-left:12px;opacity:.75">Usa el botón "Imprimir" para guardarlo como PDF en cualquier momento.</span>
  </div>

  <div class="cover">
    <div class="badge">Nivel 3 · Análisis de Perfil Mental</div>
    <h1>${nombre}</h1>
    <p class="sub">${deporteLabel} · ${posicionLabel} · ${categoria}${edad ? ` · ${edad} años` : ''}</p>
    <p style="font-size:.82rem;color:rgba(245,240,232,.45)">Generado el ${fecha}</p>
  </div>

  <a class="print-btn" onclick="window.print();return false;" href="#">🖨 Imprimir / Guardar PDF</a>

  <div class="page">

    <!-- Guía de uso -->
    <div class="block">
      <div class="uso-grid">
        ${usoItems.map(item => `<div class="uso-item"><div class="uso-num">${item.n}</div><div class="uso-t">${item.t}</div><div class="uso-d">${item.d}</div></div>`).join('')}
      </div>
    </div>

    <!-- Diagnóstico -->
    <div class="block">
      <div class="section-label">Tu diagnóstico mental</div>
      <div class="section-title">Diagnóstico mental personalizado</div>
      <div class="card gold">
        ${diagnostico.split('\n').filter(Boolean).map(p => `<p class="card-text" style="margin-bottom:10px">${p}</p>`).join('')}
      </div>
    </div>

    <!-- Estrategias -->
    ${estrategias.length ? `<div class="block">
      <div class="section-label">Estrategias clave</div>
      <div class="section-title">Estrategias específicas para ti</div>
      ${estrategias.map(e => `<div class="card gold"><div class="card-label">${e.titulo}</div><div class="card-text">${e.descripcion}</div></div>`).join('')}
    </div>` : ''}

    <!-- Sección 1: Fortalezas -->
    ${fortalezas.length ? `<div class="block">
      <div class="section-label">Sección 1</div>
      <div class="section-title">Fortalezas identificadas</div>
      ${fortalezasSec}
    </div>` : ''}

    <!-- Sección 2: Desafíos -->
    ${desafios.length ? `<div class="block">
      <div class="section-label">Sección 2</div>
      <div class="section-title">Áreas de trabajo prioritario</div>
      ${desafiosSec}
    </div>` : ''}

    ${tecnicoSec}
    ${padresSec}
    ${planSec}
    ${habitosSec}
    ${evalSec}
    ${acompSec}

    <!-- Mensaje final -->
    ${mensajeFinal ? `<div class="block">
      <div class="dark-block">
        <div class="section-label" style="text-align:center;margin-bottom:16px">Mensaje de tu equipo</div>
        <p style="font-size:.95rem;color:rgba(245,240,232,.9);line-height:1.8;text-align:center;font-style:italic">"${mensajeFinal}"</p>
      </div>
    </div>` : ''}

    <div class="cierre">
      <p style="font-weight:800;font-size:1.1rem;color:var(--dark);margin-bottom:10px">El campeón se construye desde adentro.</p>
      <p style="color:#666;font-size:.9rem">La Zona Campeón · lazonacampeon.com</p>
    </div>

  </div>
</body>
</html>`
}

export function guardarManual(html: string): string {
  const id = crypto.randomBytes(8).toString('hex')
  const dir = path.join(process.cwd(), 'public', 'manuales')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${id}.html`), html, 'utf8')
  return id
}

// ─── Pending profiles ─────────────────────────────────────────────────────────

export function guardarPerfilPendiente(perfil: Record<string, unknown>): string {
  const uuid = crypto.randomUUID()
  const dir = path.join(process.cwd(), 'public', 'manuales', 'pending')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${uuid}.json`), JSON.stringify(perfil), 'utf8')
  return uuid
}

export function leerPerfilPendiente(uuid: string): Record<string, unknown> | null {
  const filePath = path.join(process.cwd(), 'public', 'manuales', 'pending', `${uuid}.json`)
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

export function eliminarPerfilPendiente(uuid: string): void {
  const filePath = path.join(process.cwd(), 'public', 'manuales', 'pending', `${uuid}.json`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

// ─── Email ───────────────────────────────────────────────────────────────────

export async function enviarEmailManual(perfil: Record<string, unknown>, analisis: Record<string, unknown>, manualUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const nombre = perfil.nombre as string
  const email = perfil.email as string
  const deporteLabel = perfil.deporteLabel as string
  const posicionLabel = perfil.posicionLabel as string
  const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const fechaExpira = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  const diagnostico = (analisis.diagnostico as string | undefined) ?? ''
  const diagnosticoResumen = diagnostico.split('\n').filter(Boolean).slice(0, 2).map(p =>
    `<p style="color:#333;font-size:13px;line-height:1.8;margin:0 0 10px;">${p}</p>`
  ).join('')

  await resend.emails.send({
    from: 'La Zona Campeón <info@lazonacampeon.com>',
    to: email,
    subject: `Tu manual mental personalizado, ${nombre} · La Zona Campeón`,
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;">

        <!-- Header -->
        <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
          <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón · Nivel 3</p>
          <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0 0 8px;">Manual Mental Personalizado</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;">${nombre} · ${deporteLabel} · ${posicionLabel}</p>
          <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:6px 0 0;">Generado el ${fecha}</p>
        </div>

        <!-- Intro -->
        <div style="padding:24px 32px;background:#f5f0e8;border-bottom:1px solid #e8e0d0;">
          <p style="color:#1a1a2e;font-size:14px;margin:0 0 8px;">Hola <strong>${nombre}</strong>,</p>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">Tu manual mental personalizado está listo. Incluye tu diagnóstico, estrategias, plan de 4 semanas, registro diario y autoevaluación semanal.</p>
        </div>

        <!-- Aviso descarga -->
        <div style="background:#7b2f00;padding:16px 32px;text-align:center;">
          <p style="color:#fff;font-size:13px;margin:0;line-height:1.6;">Tu acceso es válido hasta el <strong style="color:#ffa060">${fechaExpira}</strong> — puedes consultarlo cuando quieras durante ese período.</p>
        </div>

        <!-- Botón principal -->
        <div style="padding:36px 32px;text-align:center;border-bottom:1px solid #f0f0f0;">
          <a href="${manualUrl}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;letter-spacing:1px;text-transform:uppercase;padding:16px 40px;border-radius:8px;text-decoration:none;">Ver tu manual completo →</a>
          <p style="color:#888;font-size:11px;margin:14px 0 0;">Desde el manual puedes imprimirlo o guardarlo como PDF</p>
        </div>

        <!-- Diagnóstico (resumen) -->
        ${diagnosticoResumen ? `<div style="padding:28px 32px;border-bottom:1px solid #f0f0f0;">
          <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Extracto de tu diagnóstico</p>
          ${diagnosticoResumen}
          <p style="color:#888;font-size:12px;margin:10px 0 0;font-style:italic;">El diagnóstico completo y todas las secciones están en tu manual.</p>
        </div>` : ''}

        <!-- Footer -->
        <div style="padding:24px 32px;background:#1a1a2e;text-align:center;">
          <p style="color:rgba(245,240,232,0.6);font-size:12px;margin:0 0 6px;">¿Tienes dudas sobre tu plan?</p>
          <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;font-size:12px;text-decoration:none;">info@lazonacampeon.com</a>
          <p style="color:rgba(255,255,255,0.3);font-size:10px;margin:16px 0 0;">La Zona Campeón · lazonacampeon.com</p>
        </div>

      </div>`,
  })
}
