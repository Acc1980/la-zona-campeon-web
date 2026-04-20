import { NextRequest, NextResponse } from 'next/server'
import { runPipeline, generarManualHTML, guardarManual, enviarEmailManual } from '@/lib/n4-pipeline'

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzWQx2Jo-Zv-wWQewL6ni9ZvkN-azdI0R8KPb9htaBSiGCgHZzdLthtZLn9ASVaUPMD/exec'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lazonacampeon.com'

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const perfil = await req.json()

    if (!perfil.nombre || !perfil.email || !perfil.deporte) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    perfil.nombre = (perfil.nombre as string).trim().replace(/\b\w/g, (c: string) => c.toUpperCase())

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

    // Run 3-agent pipeline (with retries built in)
    const analisisIA = await runPipeline(perfil)

    // Generate HTML manual and send email
    const manualHtml = generarManualHTML(perfil, analisisIA)
    const manualId = guardarManual(manualHtml)
    const manualUrl = `${SITE_URL}/manual/${manualId}`

    if (perfil.email) {
      enviarEmailManual(perfil, analisisIA, manualUrl).catch(err =>
        console.error('[personalizado] Error enviando email:', err)
      )
    }

    return NextResponse.json({ success: true, analisisIA })
  } catch (error) {
    console.error('Error en /api/personalizado:', error)
    return NextResponse.json({ error: 'Error generando el análisis. Intenta de nuevo.' }, { status: 500 })
  }
}
