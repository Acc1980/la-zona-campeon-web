import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { PRODUCTOS } from "@/lib/productos";
import { getAfiliado, DESCUENTO_COMPRADOR } from "@/lib/afiliados";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lazonacampeon.com";

export async function POST(req: NextRequest) {
  try {
    const { productoId, codigoAfiliado } = await req.json();

    const producto = PRODUCTOS[productoId];
    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const afiliado = codigoAfiliado ? getAfiliado(codigoAfiliado) : null
    const precioFinal = afiliado
      ? Math.round(producto.price * (1 - DESCUENTO_COMPRADOR) * 100) / 100
      : producto.price

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: productoId,
            title: afiliado ? `${producto.title} (10% dto)` : producto.title,
            description: producto.description,
            quantity: 1,
            unit_price: precioFinal,
            currency_id: "USD",
          },
        ],
        external_reference: afiliado ? `${productoId}|${afiliado.codigo}` : productoId,
        back_urls: {
          success: `${SITE_URL}/gracias`,
          failure: `${SITE_URL}/productos`,
          pending: `${SITE_URL}/productos`,
        },
        auto_return: "approved",
        statement_descriptor: "La Zona Campeon",
        notification_url: `${SITE_URL}/api/webhook`,
      },
    });

    return NextResponse.json({ checkoutUrl: result.init_point });
  } catch (error) {
    console.error("Error creando preferencia MP:", error);
    return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
  }
}
