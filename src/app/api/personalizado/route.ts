import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzWQx2Jo-Zv-wWQewL6ni9ZvkN-azdI0R8KPb9htaBSiGCgHZzdLthtZLn9ASVaUPMD/exec'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ASPECTOS_LABELS: Record<string, string> = {
  concentracion: 'Concentración bajo presión',
  confianza: 'Confianza y autoestima',
  errores: 'Manejo de errores',
  liderazgo: 'Liderazgo y comunicación',
  espiral: 'Control de la espiral negativa',
  regularidad: 'Regularidad y consistencia',
  presion: 'Rendir bajo presión alta',
  mentalidad: 'Mentalidad ante la derrota',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPerfilTexto(p: Record<string, unknown>): string {
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

function parseJSON(text: string): Record<string, unknown> | null {
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

// ─── Email ───────────────────────────────────────────────────────────────────

async function enviarEmailManual(perfil: Record<string, unknown>, analisis: Record<string, unknown>) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const nombre = perfil.nombre as string
  const email = perfil.email as string
  const deporteLabel = perfil.deporteLabel as string
  const posicionLabel = perfil.posicionLabel as string
  const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  type Estrategia = { titulo: string; descripcion: string }
  type Semana = { semana: number; titulo: string; foco: string; ejercicios?: string[] }
  type Habito = { nombre: string; descripcion: string }
  type Pregunta = { area: string; pregunta: string }

  const diagnostico = (analisis.diagnostico as string | undefined) ?? ''
  const estrategias = (analisis.estrategias as Estrategia[] | undefined) ?? []
  const plan = (analisis.plan4semanas as Semana[] | undefined) ?? []
  const habitos = (analisis.registroDiario as { habitos?: Habito[] } | undefined)?.habitos ?? []
  const preguntas = (analisis.autoevaluacionSemanal as { preguntas?: Pregunta[] } | undefined)?.preguntas ?? []
  const mensajeFinal = (analisis.mensajeFinal as string | undefined) ?? ''

  const section = (label: string) =>
    `<p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;border-bottom:1px solid #e8e8e8;padding-bottom:8px;">${label}</p>`

  const estrategiasHtml = estrategias.map(e => `
    <div style="background:#f9f5ee;border-left:3px solid #c8aa32;padding:12px 16px;margin-bottom:10px;border-radius:4px;">
      <p style="font-weight:700;color:#1a1a2e;font-size:13px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">${e.titulo}</p>
      <p style="color:#444;font-size:13px;margin:0;line-height:1.6;">${e.descripcion}</p>
    </div>`).join('')

  const planHtml = plan.map(s => `
    <div style="background:#fff;border:1px solid #e0e0e0;border-radius:6px;padding:14px 16px;margin-bottom:8px;">
      <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Semana ${s.semana}</p>
      <p style="font-weight:700;color:#1a1a2e;font-size:13px;margin:0 0 4px;">${s.titulo}</p>
      <p style="color:#555;font-size:12px;margin:0 0 ${s.ejercicios?.length ? '8px' : '0'};font-style:italic;">${s.foco}</p>
      ${s.ejercicios?.length ? `<ul style="margin:0;padding-left:16px;">${s.ejercicios.map(ej => `<li style="color:#444;font-size:12px;margin-bottom:3px;">${ej}</li>`).join('')}</ul>` : ''}
    </div>`).join('')

  const habitosHtml = habitos.map((h, i) => `
    <div style="background:${i % 2 === 0 ? '#f9f5ee' : '#fff'};border:1px solid #e8e8e8;border-radius:4px;padding:10px 14px;margin-bottom:6px;">
      <p style="font-weight:700;color:#1a1a2e;font-size:13px;margin:0 0 2px;">${h.nombre}</p>
      <p style="color:#555;font-size:12px;margin:0;line-height:1.5;">${h.descripcion}</p>
    </div>`).join('')

  const preguntasHtml = preguntas.map((p, i) => `
    <div style="background:#fff;border:1px solid #e0e0e0;border-radius:6px;padding:12px 16px;margin-bottom:8px;">
      <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">${p.area}</p>
      <p style="color:#1a1a2e;font-size:13px;margin:0 0 6px;line-height:1.6;">${i + 1}. ${p.pregunta}</p>
      <p style="color:#aaa;font-size:11px;margin:0;font-style:italic;">Puntuación del 1 al 10: ___</p>
    </div>`).join('')

  await resend.emails.send({
    from: 'La Zona Campeón <info@lazonacampeon.com>',
    to: email,
    subject: `Tu manual mental personalizado, ${nombre} · La Zona Campeón`,
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;">

        <!-- Header -->
        <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
          <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón · Nivel 4</p>
          <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0 0 8px;">Manual Mental Personalizado</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;">${nombre} · ${deporteLabel} · ${posicionLabel}</p>
          <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:6px 0 0;">Generado el ${fecha}</p>
        </div>

        <!-- Intro -->
        <div style="padding:24px 32px;background:#f5f0e8;border-bottom:1px solid #e8e0d0;">
          <p style="color:#1a1a2e;font-size:14px;margin:0 0 6px;">Hola <strong>${nombre}</strong>,</p>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">Este es tu manual mental completo. Guarda este email — contiene tu diagnóstico, estrategias, plan de 4 semanas, hábitos de seguimiento diario y autoevaluación semanal.</p>
        </div>

        <!-- Diagnóstico -->
        <div style="padding:28px 32px;border-bottom:1px solid #f0f0f0;">
          ${section('Tu diagnóstico mental')}
          ${diagnostico.split('\n').filter(Boolean).map(p => `<p style="color:#333;font-size:13px;line-height:1.8;margin:0 0 10px;">${p}</p>`).join('')}
        </div>

        <!-- Estrategias -->
        ${estrategias.length ? `<div style="padding:28px 32px;border-bottom:1px solid #f0f0f0;">
          ${section('Tus estrategias clave')}
          ${estrategiasHtml}
        </div>` : ''}

        <!-- Plan 4 semanas -->
        ${plan.length ? `<div style="padding:28px 32px;border-bottom:1px solid #f0f0f0;">
          ${section('Tu plan de 4 semanas')}
          ${planHtml}
        </div>` : ''}

        <!-- Registro diario -->
        ${habitos.length ? `<div style="padding:28px 32px;border-bottom:1px solid #f0f0f0;">
          ${section('Hábitos de seguimiento diario')}
          <p style="color:#555;font-size:12px;margin:0 0 12px;font-style:italic;">Marca cada día si cumpliste cada hábito (✓ / ✗). Revísalos cada noche antes de dormir.</p>
          ${habitosHtml}
        </div>` : ''}

        <!-- Autoevaluación -->
        ${preguntas.length ? `<div style="padding:28px 32px;border-bottom:1px solid #f0f0f0;">
          ${section('Autoevaluación semanal')}
          <p style="color:#555;font-size:12px;margin:0 0 12px;font-style:italic;">Cada semana, puntúa del 1 al 10 y escribe una reflexión breve sobre cada pregunta.</p>
          ${preguntasHtml}
        </div>` : ''}

        <!-- Mensaje final -->
        ${mensajeFinal ? `<div style="padding:28px 32px;background:#f5f0e8;border-bottom:1px solid #e8e0d0;">
          ${section('Mensaje de tu equipo')}
          <p style="color:#1a1a2e;font-size:13px;line-height:1.8;margin:0;font-style:italic;">"${mensajeFinal}"</p>
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

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const perfil = await req.json()

    if (!perfil.nombre || !perfil.email || !perfil.deporte) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Guardar en Sheets (sin bloquear)
    const sheetsData = JSON.stringify({
      nombre: perfil.nombre,
      email: perfil.email,
      edad: perfil.edad || '',
      deporte: perfil.deporteLabel || perfil.deporte,
      posicion: perfil.posicionLabel || perfil.posicion,
      categoria: perfil.categoria || '',
      fortalezas: (perfil.fortalezas || []).join(', '),
      fortalezasTexto: perfil.fortalezasTexto || '',
      desafios: (perfil.desafios || []).join(', '),
      desafiosTexto: perfil.desafiosTexto || '',
      situaciones: perfil.situaciones || '',
      incluyeTecnico: perfil.incluyeTecnico ? 'si' : 'no',
      tecnicoNombre: perfil.tecnicoNombre || '',
      tecnicoFortalezas: perfil.tecnicoFortalezas || '',
      tecnicoDesafios: perfil.tecnicoDesafios || '',
      incluyePadres: perfil.incluyePadres ? 'si' : 'no',
      padresNombre: perfil.padresNombre || '',
      padresObservaciones: perfil.padresObservaciones || '',
      padresPreocupaciones: perfil.padresPreocupaciones || '',
      padresEntrenadorDijo: perfil.padresEntrenadorDijo || '',
    })

    fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: sheetsData,
    }).catch(() => {})

    const perfilTexto = buildPerfilTexto(perfil)

    // Pipeline con reintentos automáticos (hasta 3 intentos)
    let analisisIA: Record<string, unknown> | null = null
    let ultimoError = ''

    for (let intento = 1; intento <= 3; intento++) {
      try {
        // Agente 1: Generador
        const borrador = await agente1_generador(perfilTexto, perfil.nombre, perfil.deporteLabel, perfil.posicionLabel)

        // Agente 2: Revisor
        const correcciones = await agente2_revisor(perfilTexto, borrador)

        // Agente 3: Implementador
        const final = await agente3_implementador(perfilTexto, borrador, correcciones)

        analisisIA = parseJSON(final)

        if (analisisIA) break // Éxito — salir del loop

        ultimoError = `Intento ${intento}: JSON inválido`
        console.warn(`[personalizado] ${ultimoError} — reintentando...`)
      } catch (err) {
        ultimoError = `Intento ${intento}: ${err instanceof Error ? err.message : 'error desconocido'}`
        console.warn(`[personalizado] ${ultimoError} — reintentando...`)
        if (intento === 3) throw err
      }
    }

    if (!analisisIA) {
      throw new Error(`Pipeline falló tras 3 intentos. Último error: ${ultimoError}`)
    }

    // Enviar email (sin bloquear la respuesta)
    if (perfil.email) {
      enviarEmailManual(perfil, analisisIA).catch(err =>
        console.error('[personalizado] Error enviando email:', err)
      )
    }

    return NextResponse.json({ success: true, analisisIA })
  } catch (error) {
    console.error('Error en /api/personalizado:', error)
    return NextResponse.json({ error: 'Error generando el análisis. Intenta de nuevo.' }, { status: 500 })
  }
}
