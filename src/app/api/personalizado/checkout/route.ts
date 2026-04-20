import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { guardarPerfilPendiente } from '@/lib/n4-pipeline'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lazonacampeon.com'

export async function POST(req: NextRequest) {
  try {
    const perfil = await req.json()

    if (!perfil.nombre || !perfil.email) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    // Capitalize name
    perfil.nombre = (perfil.nombre as string).trim().replace(/\b\w/g, (c: string) => c.toUpperCase())

    // Save pending profile and get UUID
    const uuid = guardarPerfilPendiente(perfil)

    const mp = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    })

    const preference = new Preference(mp)
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'n4-personalizado',
            title: 'Manual Mental Personalizado — La Zona Campeón',
            quantity: 1,
            unit_price: 1,
            currency_id: 'USD',
          },
        ],
        external_reference: `n4-personalizado|${uuid}`,
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
