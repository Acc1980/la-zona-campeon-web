import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Afiliado } from '@/lib/afiliados'

export const runtime = 'nodejs'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
const DATA_PATH = path.join(process.cwd(), 'data', 'afiliados.json')

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret') || ''
  if (!secret || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const codigo: string = (body.codigo || '').toLowerCase().trim()
  const nombre: string = (body.nombre || '').trim()

  if (!codigo || !nombre) {
    return NextResponse.json({ error: 'codigo and nombre are required' }, { status: 400 })
  }

  let list: Afiliado[] = []
  try {
    list = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  } catch {}

  const exists = list.find(a => a.codigo.toLowerCase() === codigo)
  if (exists) {
    if (!exists.activo) {
      exists.activo = true
      fs.writeFileSync(DATA_PATH, JSON.stringify(list, null, 2))
      return NextResponse.json({ ok: true, action: 'reactivated', codigo })
    }
    return NextResponse.json({ ok: true, action: 'already_exists', codigo })
  }

  list.push({ codigo, nombre, activo: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(list, null, 2))

  return NextResponse.json({ ok: true, action: 'created', codigo })
}
