import { NextRequest, NextResponse } from 'next/server'
import { getAfiliado } from '@/lib/afiliados'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get('codigo') || ''
  const afiliado = getAfiliado(codigo)
  if (!afiliado) {
    return NextResponse.json({ valid: false }, { status: 404 })
  }
  return NextResponse.json({ valid: true, codigo: afiliado.codigo, nombre: afiliado.nombre })
}
