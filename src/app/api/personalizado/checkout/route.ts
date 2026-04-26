import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { guardarPerfilPendiente } from '@/lib/n4-pipeline'
import { getAfiliado, DESCUENTO_COMPRADOR } from '@/lib/afiliados'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lazonacampeon.com'
const PRECIO_BASE = 29.99

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { codigoAfiliado, ...perfil } = body

    if (!perfil.nombre || !perfil.email) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    perfil.nombre = (perfil.nombre as string).trim().replace(/\b\w/g, (c: string) => c.toUpperCase())

    const afiliado = codigoAfiliado ? getAfiliado(codigoAfiliado) : null
    const precioFinal = afiliado
      ? Math.round(PRECIO_BASE * (1 - DESCUENTO_COMPRADOR) * 100) / 100
      : PRECIO_BASE

    const uuid = guardarPerfilPendiente(perfil)

    const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const preference = new Preference(mp)
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'n4-personalizado',
            title: afiliado
              ? 'Manual Mental Personalizado — La Zona Campeón (10% dto)'
              : 'Manual Mental Personalizado — La Zona Campeón',
            quantity: 1,
            unit_price: precioFinal,
            currency_id: 'USD',
          },
        ],
        external_reference: afiliado
          ? `n4-personalizado|${uuid}|${afiliado.codigo}`
          : `n4-personalizado|${uuid}`,
        back_urls: {
          success: `${SITE_URL}/gracias`,
          failure: `${SITE_URL}/personalizado`,
          pending: `${SITE_URL}/personalizado`,
        },
        auto_return: 'approved',
        notification_url: `${SITE_URL}/api/webhook`,
      },
    })

    return NextResponse.json({ checkoutUrl: result.init_point })
  } catch (error) {
    console.error('Error en /api/personalizado/checkout:', error)
    return NextResponse.json({ error: 'Error iniciando el pago. Intenta de nuevo.' }, { status: 500 })
  }
}
