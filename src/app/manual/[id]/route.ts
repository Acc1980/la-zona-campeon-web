import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id.replace(/[^a-f0-9]/g, '')
  if (!id) return new NextResponse('Not found', { status: 404 })

  const filePath = path.join(process.cwd(), 'public', 'manuales', `${id}.html`)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Manual no encontrado o expirado.', { status: 404 })
  }

  const html = fs.readFileSync(filePath, 'utf8')
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
