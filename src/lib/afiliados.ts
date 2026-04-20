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
}

export const DESCUENTO_COMPRADOR = 0.10  // 10%
export const COMISION_AFILIADO = 0.35    // 35%

export function getAfiliado(codigo: string): Afiliado | null {
  const afiliado = AFILIADOS[codigo.toLowerCase()]
  return afiliado?.activo ? afiliado : null
}
