import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Rate limiting (in-memory) ────────────────────────────────────────────────
const rateLimits = new Map<string, { count: number; resetAt: number }>()
const MAX_MESSAGES = 10
const WINDOW_MS = 24 * 60 * 60 * 1000

function checkRateLimit(userId: string): 'ok' | 'limit_reached' | 'blocked' {
  const now = Date.now()
  const limit = rateLimits.get(userId)

  if (!limit || now > limit.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + WINDOW_MS })
    return 'ok'
  }

  if (limit.count > MAX_MESSAGES) return 'blocked'
  if (limit.count === MAX_MESSAGES) {
    limit.count++
    return 'limit_reached'
  }

  limit.count++
  return 'ok'
}

// ─── Sistema de memoria por usuario (última pregunta fuera de tema) ───────────
const offTopicMemory = new Map<string, number>() // userId -> timestamp del último off-topic

function hasWarned(userId: string): boolean {
  const warned = offTopicMemory.get(userId)
  if (!warned) return false
  // La advertencia dura 1 hora
  return Date.now() - warned < 60 * 60 * 1000
}

function setWarned(userId: string) {
  offTopicMemory.set(userId, Date.now())
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres el equipo de soporte de La Zona Campeón, una plataforma de entrenamiento mental para deportistas. Respondes mensajes de Instagram de forma amable, directa y motivadora. NUNCA menciones que eres una IA o un bot.

## SOBRE LA ZONA CAMPEÓN
- Web: lazonacampeon.com
- Email de contacto: info@lazonacampeon.com
- Instagram: @lazonacampeon
- Especialistas en psicología deportiva aplicada — entrenamiento mental para deportistas de todos los niveles y deportes.

## PRODUCTOS
1. **Guía Gratis** — "5 Hábitos Mentales del Campeón" + Calendario 21 días → lazonacampeon.com/gratis
2. **Nivel 1 — Manuales temáticos** ($12.99 c/u): Espiral Negativa · Concentración bajo presión · Confianza y Autoestima · Manejo de Errores · Liderazgo y Comunicación → lazonacampeon.com/productos
3. **Nivel 2 — Manuales por posición en fútbol** ($17.99 c/u): Portero · Defensa Central · Lateral · Mediocampista · Extremo · Delantero Centro → lazonacampeon.com/productos
4. **Nivel 3 — Análisis de Perfil Mental Personalizado** (precio en la web) — análisis hecho por 3 agentes IA en base al perfil del deportista → lazonacampeon.com/personalizado

## REGLAS ESTRICTAS
- Respuestas cortas: máximo 3-4 frases. Directo y cálido.
- NUNCA ofrezcas descuentos ni precios especiales que no estén publicados en lazonacampeon.com.
- Si preguntan por precios, menciona los exactos de la web.
- Si alguien quiere empezar, recomienda primero la guía gratis en lazonacampeon.com/gratis.
- Si el mensaje no tiene relación con entrenamiento mental deportivo ni con nuestros productos, responde con la etiqueta [OFF_TOPIC] al inicio de tu respuesta, luego el mensaje amable.
- Si el mensaje SÍ es relevante, responde normalmente sin etiquetas.`

// ─── Graph API ────────────────────────────────────────────────────────────────

async function sendDM(recipientId: string, message: string) {
  const pageId = process.env.META_PAGE_ID

  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: message },
      messaging_type: 'RESPONSE',
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('[instagram-bot] Error enviando DM:', err)
  }
}

// ─── Claude ───────────────────────────────────────────────────────────────────

async function generateReply(userMessage: string): Promise<{ text: string; isOffTopic: boolean }> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 250,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = (response.content[0] as { type: string; text: string }).text
  const isOffTopic = text.startsWith('[OFF_TOPIC]')
  const cleanText = text.replace('[OFF_TOPIC]', '').trim()

  return { text: cleanText, isOffTopic }
}

// ─── GET — Verificación webhook Meta ─────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    console.log('[instagram-bot] Webhook verificado')
    return new Response(challenge ?? '', { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ─── POST — Mensajes entrantes ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('[instagram-bot] POST recibido:', JSON.stringify(body).slice(0, 500))

    if (body.object !== 'instagram' && body.object !== 'page') {
      console.log('[instagram-bot] object ignorado:', body.object)
      return NextResponse.json({ ok: true })
    }

    const messagingEvent = body.entry?.[0]?.messaging?.[0]

    // Ignorar si no es mensaje de texto o es eco propio
    if (!messagingEvent?.message?.text || messagingEvent.message.is_echo) {
      return NextResponse.json({ ok: true })
    }

    const senderId = messagingEvent.sender.id as string
    const messageText = messagingEvent.message.text as string

    const rateStatus = checkRateLimit(senderId)

    if (rateStatus === 'blocked') {
      return NextResponse.json({ ok: true })
    }

    if (rateStatus === 'limit_reached') {
      await sendDM(senderId, 'Para más información escríbenos a info@lazonacampeon.com. ¡Gracias por tu interés en La Zona Campeón!')
      return NextResponse.json({ ok: true })
    }

    const { text, isOffTopic } = await generateReply(messageText)

    // Si es off-topic y ya se le advirtió antes → ignorar
    if (isOffTopic && hasWarned(senderId)) {
      return NextResponse.json({ ok: true })
    }

    // Si es off-topic por primera vez → responder y marcar
    if (isOffTopic) {
      setWarned(senderId)
    }

    await sendDM(senderId, text)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[instagram-bot] Error:', error)
    return NextResponse.json({ ok: true }) // Siempre 200 para Meta
  }
}
