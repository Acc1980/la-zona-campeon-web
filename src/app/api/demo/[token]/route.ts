import { NextRequest, NextResponse } from 'next/server'
import { validarToken, consumirToken } from '@/lib/demo-tokens'
import { runPipeline, generarManualHTML, guardarManual, enviarEmailManual } from '@/lib/n4-pipeline'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { valid, used } = validarToken(token)
  if (!valid) return NextResponse.json({ error: 'Link inválido' }, { status: 404 })
  if (used) return NextResponse.json({ error: 'Este link ya fue utilizado' }, { status: 410 })
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { valid, used } = validarToken(token)
  if (!valid) return NextResponse.json({ error: 'Link inválido' }, { status: 404 })
  if (used) return NextResponse.json({ error: 'Este link ya fue utilizado' }, { status: 410 })

  const perfil = await req.json()
  if (!perfil.nombre || !perfil.email) {
    return NextResponse.json({ error: 'Faltan nombre y email' }, { status: 400 })
  }

  try {
    perfil.nombre = (perfil.nombre as string).trim().replace(/\b\w/g, (c: string) => c.toUpperCase())
    const analisis = await runPipeline(perfil)
    const html = generarManualHTML(perfil, analisis)
    const manualId = guardarManual(html)
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lazonacampeon.com'
    const manualUrl = `${SITE_URL}/manual/${manualId}`
    await enviarEmailManual(perfil, analisis, manualUrl)
    consumirToken(token)
    return NextResponse.json({ ok: true, manualUrl })
  } catch (error) {
    console.error('[demo-token]', error)
    return NextResponse.json({ error: 'Error generando el manual' }, { status: 500 })
  }
}
