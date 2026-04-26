import fs from 'fs'
import path from 'path'

export interface Afiliado {
  codigo: string
  nombre: string
  activo: boolean
}

export const DESCUENTO_COMPRADOR = 0.10  // 10%
export const COMISION_AFILIADO = 0.35    // 35%

const DATA_PATH = path.join(process.cwd(), 'data', 'afiliados.json')

function loadAfiliados(): Record<string, Afiliado> {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    const list: Afiliado[] = JSON.parse(raw)
    const map: Record<string, Afiliado> = {}
    for (const a of list) {
      map[a.codigo.toLowerCase()] = a
    }
    return map
  } catch {
    return {}
  }
}

export function getAfiliado(codigo: string): Afiliado | null {
  const map = loadAfiliados()
  const afiliado = map[codigo.toLowerCase()]
  return afiliado?.activo ? afiliado : null
}

export function getAllAfiliados(): Afiliado[] {
  return Object.values(loadAfiliados())
}
