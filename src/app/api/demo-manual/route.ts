import { NextRequest, NextResponse } from 'next/server'
import { runPipeline, generarManualHTML, guardarManual, enviarEmailManual } from '@/lib/n4-pipeline'

const DEMO_SECRET = process.env.DEMO_SECRET || 'lzc-demo-2026'

export async function POST(req: NextRequest) {
  try {
    const { secret, ...perfil } = await req.json()

    if (secret !== DEMO_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!perfil.nombre || !perfil.email) {
      return NextResponse.json({ error: 'Faltan nombre y email' }, { status: 400 })
    }

    perfil.nombre = (perfil.nombre as string).trim().replace(/\b\w/g, (c: string) => c.toUpperCase())

    const analisis = await runPipeline(perfil)
    const html = generarManualHTML(perfil, analisis)
    const manualId = guardarManual(html)

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lazonacampeon.com'
    const manualUrl = `${SITE_URL}/manual/${manualId}`

    await enviarEmailManual(perfil, analisis, manualUrl)

    return NextResponse.json({ ok: true, manualUrl })
  } catch (error) {
    console.error('[demo-manual]', error)
    return NextResponse.json({ error: 'Error generando el manual' }, { status: 500 })
  }
}
