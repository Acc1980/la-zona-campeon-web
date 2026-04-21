export interface Afiliado {
  codigo: string
  nombre: string
  activo: boolean
}

export const AFILIADOS: Record<string, Afiliado> = {
  coorfupre: {
    codigo: 'coorfupre',
    nombre: 'Coorfupre',
    activo: true,
  },
  lamente10: {
    codigo: 'lamente10',
    nombre: 'LaMente10',
    activo: true,
  },
  gustavomiraanda: {
    codigo: 'gustavomiraanda',
    nombre: 'Gustavo Miranda',
    activo: true,
  },
  fabian_dynamif: {
    codigo: 'fabian_dynamif',
    nombre: 'Fabián Dynamif',
    activo: true,
  },
}

export const DESCUENTO_COMPRADOR = 0.10  // 10%
export const COMISION_AFILIADO = 0.35    // 35%

export function getAfiliado(codigo: string): Afiliado | null {
  const afiliado = AFILIADOS[codigo.toLowerCase()]
  return afiliado?.activo ? afiliado : null
}
