import { NextRequest, NextResponse } from 'next/server'
import { crearToken, listarTokens } from '@/lib/demo-tokens'

function checkSecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret') || ''
  return secret === (process.env.ADMIN_SECRET || '')
}

export async function POST(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const token = crearToken()
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lazonacampeon.com'
  return NextResponse.json({ token, url: `${SITE_URL}/demo/${token}` })
}

export async function GET(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  return NextResponse.json({ tokens: listarTokens() })
}
