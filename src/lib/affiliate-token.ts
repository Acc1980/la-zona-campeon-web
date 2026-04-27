import { createHmac } from 'crypto'

const SECRET = process.env.AFFILIATE_TOKEN_SECRET || 'lazonacampeon-afiliados-2026'

export function generarToken(codigo: string): string {
  return createHmac('sha256', SECRET)
    .update(codigo.toLowerCase())
    .digest('hex')
    .slice(0, 24)
}

export function validarToken(codigo: string, token: string): boolean {
  return generarToken(codigo) === token
}
