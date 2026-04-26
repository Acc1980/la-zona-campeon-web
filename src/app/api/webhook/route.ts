import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Resend } from "resend";
import { PRODUCTOS } from "@/lib/productos";
import { getAfiliado, COMISION_AFILIADO } from "@/lib/afiliados";
import { registrarVentaAfiliado } from "@/lib/sheets-afiliados";
import { runPipeline, generarManualHTML, guardarManual, enviarEmailManual, leerPerfilPendiente, eliminarPerfilPendiente } from "@/lib/n4-pipeline";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY!);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lazonacampeon.com";
const FROM = "La Zona Campeón <info@lazonacampeon.com>";

function registrarVenta(data: {
  nivel: string;
  producto: string;
  monto: number;
  email: string;
  afiliado?: string;
  paymentId?: string;
}) {
  const url = process.env.GOOGLE_SCRIPT_VENTAS_URL;
  if (!url) return;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {});
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function getNivel(productoId: string): "n2" | "n3" {
  return productoId.startsWith("n2-") ? "n2" : "n3";
}

// ─── Email templates ──────────────────────────────────────────────────────────

function guiaUsoN2N4(): string {
  return `
        <div style="background:#1a1a2e;border-radius:8px;padding:22px 24px;">
          <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:3px;text-align:center;margin:0 0 18px;">Cómo usar este manual</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="25%" style="text-align:center;padding:0 6px;vertical-align:top;">
                <div style="width:32px;height:32px;border-radius:50%;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;line-height:32px;text-align:center;margin:0 auto 10px;">1</div>
                <p style="font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 5px;">Lee el diagnóstico</p>
                <p style="font-size:10px;color:rgba(245,240,232,0.55);line-height:1.5;margin:0;">Entiende tu perfil mental y tus áreas prioritarias.</p>
              </td>
              <td width="25%" style="text-align:center;padding:0 6px;vertical-align:top;">
                <div style="width:32px;height:32px;border-radius:50%;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;line-height:32px;text-align:center;margin:0 auto 10px;">2</div>
                <p style="font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 5px;">Sigue el plan 4 semanas</p>
                <p style="font-size:10px;color:rgba(245,240,232,0.55);line-height:1.5;margin:0;">Un paso concreto por semana. Sin saltar etapas.</p>
              </td>
              <td width="25%" style="text-align:center;padding:0 6px;vertical-align:top;">
                <div style="width:32px;height:32px;border-radius:50%;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;line-height:32px;text-align:center;margin:0 auto 10px;">3</div>
                <p style="font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 5px;">Registro diario</p>
                <p style="font-size:10px;color:rgba(245,240,232,0.55);line-height:1.5;margin:0;">Marca tus hábitos cada día. La constancia es la clave.</p>
              </td>
              <td width="25%" style="text-align:center;padding:0 6px;vertical-align:top;">
                <div style="width:32px;height:32px;border-radius:50%;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;line-height:32px;text-align:center;margin:0 auto 10px;">4</div>
                <p style="font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 5px;">Autoevalúate cada domingo</p>
                <p style="font-size:10px;color:rgba(245,240,232,0.55);line-height:1.5;margin:0;">Puntúa tu semana y ajusta lo que necesites.</p>
              </td>
            </tr>
          </table>
        </div>`;
}

function guiaUsoN3(productoTitle: string, planUrl: string): string {
  const planTitulo = productoTitle.replace('La Mente del ', 'Plan de 4 Semanas del ').replace('La Mente de la ', 'Plan de 4 Semanas de la ');
  return `
        <div style="background:#1a1a2e;border-radius:8px;padding:22px 24px;">
          <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:3px;text-align:center;margin:0 0 14px;">Lo que incluye tu compra</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:20px;">
            <span style="background:rgba(200,170,50,0.15);border:1px solid rgba(200,170,50,0.35);border-radius:5px;padding:6px 14px;font-size:11px;font-weight:700;color:#e8dab0;font-family:'Helvetica Neue',Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;">${productoTitle}</span>
            <a href="${planUrl}" style="background:rgba(200,170,50,0.15);border:1px solid rgba(200,170,50,0.35);border-radius:5px;padding:6px 14px;font-size:11px;font-weight:700;color:#c8aa32;font-family:'Helvetica Neue',Arial,sans-serif;text-transform:uppercase;letter-spacing:0.5px;text-decoration:none;">${planTitulo} →</a>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="33%" style="text-align:center;padding:0 8px;vertical-align:top;">
                <div style="width:32px;height:32px;border-radius:50%;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;line-height:32px;text-align:center;margin:0 auto 10px;">1</div>
                <p style="font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 5px;">Sigue el plan</p>
                <p style="font-size:10px;color:rgba(245,240,232,0.55);line-height:1.5;margin:0;">El plan de 4 semanas te indica qué hacer cada día.</p>
              </td>
              <td width="33%" style="text-align:center;padding:0 8px;vertical-align:top;">
                <div style="width:32px;height:32px;border-radius:50%;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;line-height:32px;text-align:center;margin:0 auto 10px;">2</div>
                <p style="font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 5px;">Lee el manual</p>
                <p style="font-size:10px;color:rgba(245,240,232,0.55);line-height:1.5;margin:0;">Cada día el plan te indica el capítulo a leer en el manual.</p>
              </td>
              <td width="33%" style="text-align:center;padding:0 8px;vertical-align:top;">
                <div style="width:32px;height:32px;border-radius:50%;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:14px;line-height:32px;text-align:center;margin:0 auto 10px;">3</div>
                <p style="font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 5px;">Ficha del partido</p>
                <p style="font-size:10px;color:rgba(245,240,232,0.55);line-height:1.5;margin:0;">Antes y después de cada partido usa la ficha al final del plan.</p>
              </td>
            </tr>
          </table>
        </div>`;
}

function emailDia0(productoTitle: string, manualUrl: string, planUrl?: string): string {
  const guia = planUrl ? guiaUsoN3(productoTitle, planUrl) : guiaUsoN2N4();
  const planTitulo = planUrl
    ? productoTitle.replace('La Mente del ', 'Plan de 4 Semanas del ').replace('La Mente de la ', 'Plan de 4 Semanas de la ')
    : null;

  const botonesAcceso = planUrl
    ? `
          <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Tu compra incluye</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding:0 6px 0 0;width:50%;">
              <a href="${manualUrl}" style="display:block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:13px 10px;border-radius:6px;text-decoration:none;text-align:center;">Manual ${productoTitle} →</a>
            </td>
            <td style="padding:0 0 0 6px;width:50%;">
              <a href="${planUrl}" style="display:block;background:#1a1a2e;border:2px solid #c8aa32;color:#c8aa32;font-weight:900;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:11px 10px;border-radius:6px;text-decoration:none;text-align:center;">${planTitulo} →</a>
            </td>
          </tr></table>`
    : `
          <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Tu manual</p>
          <p style="font-size:16px;font-weight:800;color:#1a1a2e;text-transform:uppercase;margin:0 0 20px;">${productoTitle}</p>
          <a href="${manualUrl}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:6px;text-decoration:none;">Abrir mi manual →</a>`;

  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
      <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
        <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
        <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">Tu manual está listo</h1>
      </div>
      <div style="padding:32px;background:#f5f0e8;">
        <div style="background:#ffffff;border-left:4px solid #c8aa32;border-radius:4px;padding:20px 24px;margin-bottom:28px;text-align:center;">
          ${botonesAcceso}
        </div>
        ${guia}
      </div>
      <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
        <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0;">Guarda este email — puedes volver a tu manual cuando quieras · <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;text-decoration:none;">info@lazonacampeon.com</a></p>
      </div>
    </div>
  `;
}

function emailDia3(manualUrl: string): string {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
      <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
        <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
        <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">¿Cómo va tu primera semana?</h1>
      </div>
      <div style="padding:32px;background:#f5f0e8;">
        <p style="color:#1a1a2e;font-size:14px;font-weight:700;margin:0 0 12px;">Ya llevas 3 días con tu manual.</p>
        <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 20px;">La semana 1 del plan es la más importante. No porque sea la más difícil, sino porque es donde se decide si el entrenamiento mental se convierte en hábito o en otro PDF que se queda guardado.</p>
        <div style="background:#ffffff;border-left:4px solid #c8aa32;border-radius:4px;padding:18px 20px;margin-bottom:24px;">
          <p style="font-size:11px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Consejo de esta semana</p>
          <p style="color:#1a1a2e;font-size:13px;line-height:1.7;margin:0;">Usa el registro diario aunque sean 2 minutos antes de dormir. No se trata de hacerlo perfecto — se trata de hacerlo consistente. El patrón aparece en los datos de la semana, no en el día suelto.</p>
        </div>
        <div style="text-align:center;margin-top:8px;">
          <a href="${manualUrl}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:6px;text-decoration:none;">Continuar con mi manual →</a>
        </div>
      </div>
      <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
        <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0;">¿Dudas? <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;text-decoration:none;">info@lazonacampeon.com</a></p>
      </div>
    </div>
  `;
}

function emailDia14(manualUrl: string, nivel: "n2" | "n3"): string {
  const tip = nivel === "n2"
    ? {
        titulo: "La técnica del interruptor de 5 segundos",
        texto: "Cuando sientas que empiezas a perder el foco o entras en espiral, cuenta mentalmente 5-4-3-2-1 y di en voz baja tu palabra ancla (puede ser \"foco\", \"siguiente\" o la que uses tú). Ese contador interrumpe el ciclo automático antes de que tome velocidad. Úsalo en entrenamiento para que funcione solo en partido.",
      }
    : {
        titulo: "El ritual de pre-partido en 3 pasos",
        texto: "15 minutos antes de entrar: 1) Cierra los ojos y visualiza 3 acciones concretas en tu posición (no el resultado, las acciones). 2) Di en voz alta una frase de activación personal. 3) Respira profundo 4 tiempos — inhala, aguanta, exhala, aguanta. Esto no es relajación: es activación controlada. La diferencia entre nervios que paralizan y nervios que activan está en cómo los interpretas.",
      };

  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
      <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
        <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
        <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">Un tip extra para ti</h1>
      </div>
      <div style="padding:32px;background:#f5f0e8;">
        <p style="color:#1a1a2e;font-size:14px;font-weight:700;margin:0 0 12px;">Ya van 2 semanas. Esto va para ti.</p>
        <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 20px;">Este tip va más allá de lo que está en el manual. Es una herramienta extra que los deportistas con más consistencia en sus registros suelen aplicar en la semana 2.</p>
        <div style="background:#ffffff;border-left:4px solid #c8aa32;border-radius:4px;padding:18px 20px;margin-bottom:24px;">
          <p style="font-size:11px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">${tip.titulo}</p>
          <p style="color:#1a1a2e;font-size:13px;line-height:1.7;margin:0;">${tip.texto}</p>
        </div>
        <div style="text-align:center;margin-top:8px;">
          <a href="${manualUrl}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:6px;text-decoration:none;">Ver mi manual →</a>
        </div>
      </div>
      <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
        <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0;">¿Dudas? <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;text-decoration:none;">info@lazonacampeon.com</a></p>
      </div>
    </div>
  `;
}

function emailDia30(nivel: "n2" | "n3"): string {
  const siguiente = nivel === "n2"
    ? {
        texto: "El siguiente paso es trabajar el entrenamiento mental específico para tu posición. Los manuales N3 van directamente a los desafíos de tu rol en el campo — lo que necesita un portero no es lo mismo que lo que necesita un delantero.",
        cta: "Ver manuales por posición →",
        href: `${SITE_URL}/productos#nivel-3`,
        precio: "$14.99",
      }
    : {
        texto: "El siguiente nivel es tu manual 100% personalizado. Basado en tu perfil exacto: tu deporte, tu posición, tus fortalezas y los aspectos que quieres mejorar. Generado específicamente para ti con diagnóstico, estrategias y plan de 4 semanas.",
        cta: "Generar mi manual personalizado →",
        href: `${SITE_URL}/personalizado`,
        precio: "$29.99",
      };

  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
      <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
        <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
        <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">Ya llevas 30 días</h1>
      </div>
      <div style="padding:32px;background:#f5f0e8;">
        <p style="color:#1a1a2e;font-size:14px;font-weight:700;margin:0 0 12px;">Un mes de entrenamiento mental. Eso no lo hace cualquiera.</p>
        <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 24px;">Si completaste el plan de 4 semanas de tu manual, ya tienes una base sólida. El siguiente paso es profundizar con un nivel más específico.</p>
        <div style="background:#ffffff;border:1px solid rgba(200,170,50,0.4);border-radius:8px;padding:22px 24px;margin-bottom:24px;">
          <p style="font-size:11px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Siguiente nivel</p>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 16px;">${siguiente.texto}</p>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <span style="font-size:22px;font-weight:900;color:#c8aa32;">${siguiente.precio}</span>
            <a href="${siguiente.href}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:12px 22px;border-radius:6px;text-decoration:none;">${siguiente.cta}</a>
          </div>
        </div>
        <p style="color:#888;font-size:12px;text-align:center;margin:0;">Si aún estás en el plan, no hay prisa. Termínalo primero.</p>
      </div>
      <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
        <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0;">¿Dudas? <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;text-decoration:none;">info@lazonacampeon.com</a></p>
      </div>
    </div>
  `;
}

// ─── Webhook handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const paymentId = body?.data?.id;
    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    const payment = new Payment(mp);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    const externalRef = paymentData.external_reference ?? '';

    // ── N4: Manual Mental Personalizado ──────────────────────────────────────
    if (externalRef.startsWith('n4-personalizado|')) {
      const uuid = externalRef.split('|')[1]
      ;(async () => {
        try {
          const perfil = leerPerfilPendiente(uuid)
          if (!perfil) return
          const analisis = await runPipeline(perfil)
          const html = generarManualHTML(perfil, analisis)
          const manualId = guardarManual(html)
          const manualUrl = `${SITE_URL}/manual/${manualId}`
          const email = perfil.email as string
          const nombre = perfil.nombre as string

          await enviarEmailManual(perfil, analisis, manualUrl)

          registrarVenta({
            nivel: 'N4',
            producto: 'Manual Mental Personalizado',
            monto: paymentData.transaction_amount ?? 49,
            email,
            paymentId: String(paymentId),
          })

          // Día 3
          resend.emails.send({
            from: FROM,
            to: email,
            subject: `${nombre}, ¿cómo va tu primera semana?`,
            scheduledAt: daysFromNow(3),
            html: `
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
                <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
                  <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
                  <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">¿Cómo va tu primera semana?</h1>
                </div>
                <div style="padding:32px;background:#f5f0e8;">
                  <p style="color:#1a1a2e;font-size:14px;font-weight:700;margin:0 0 12px;">Hola ${nombre},</p>
                  <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 20px;">Ya llevas 3 días con tu manual personalizado. La semana 1 del plan es la más importante — no porque sea la más difícil, sino porque es donde se decide si el entrenamiento mental se convierte en hábito o queda guardado.</p>
                  <div style="background:#ffffff;border-left:4px solid #c8aa32;border-radius:4px;padding:18px 20px;margin-bottom:24px;">
                    <p style="font-size:11px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Consejo de esta semana</p>
                    <p style="color:#1a1a2e;font-size:13px;line-height:1.7;margin:0;">Usa el registro diario aunque sean 2 minutos antes de dormir. No se trata de hacerlo perfecto — se trata de hacerlo consistente. El patrón aparece en los datos de la semana, no en el día suelto.</p>
                  </div>
                  <div style="text-align:center;">
                    <a href="${manualUrl}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:6px;text-decoration:none;">Continuar con mi manual →</a>
                  </div>
                </div>
                <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
                  <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0;">¿Dudas? <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;text-decoration:none;">info@lazonacampeon.com</a></p>
                </div>
              </div>`,
          }).catch(() => {})

          // Día 14
          resend.emails.send({
            from: FROM,
            to: email,
            subject: `${nombre}, un tip extra para la semana 3`,
            scheduledAt: daysFromNow(14),
            html: `
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
                <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
                  <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
                  <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">Un tip extra para ti</h1>
                </div>
                <div style="padding:32px;background:#f5f0e8;">
                  <p style="color:#1a1a2e;font-size:14px;font-weight:700;margin:0 0 12px;">Ya van 2 semanas, ${nombre}.</p>
                  <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 20px;">Los deportistas que llegan a la semana 3 de su plan son los que realmente convierten el entrenamiento mental en una ventaja competitiva real. Aquí va algo que no está en el manual — va más allá.</p>
                  <div style="background:#ffffff;border-left:4px solid #c8aa32;border-radius:4px;padding:18px 20px;margin-bottom:24px;">
                    <p style="font-size:11px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">El ritual de los 90 segundos post-error</p>
                    <p style="color:#1a1a2e;font-size:13px;line-height:1.7;margin:0;">Cuando cometas un error en entrenamiento o partido, date exactamente 90 segundos para sentirlo — no lo evites. Luego di en voz baja una frase de cierre (la tuya, la que funcione: "siguiente", "ya fue", "foco"). Ese ritual comprime el tiempo de recuperación y entrena al cerebro a soltar. Con repetición, pasa solo.</p>
                  </div>
                  <div style="text-align:center;">
                    <a href="${manualUrl}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:6px;text-decoration:none;">Ver mi manual →</a>
                  </div>
                </div>
                <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
                  <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0;">¿Dudas? <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;text-decoration:none;">info@lazonacampeon.com</a></p>
                </div>
              </div>`,
          }).catch(() => {})

          // Día 28 — 2 días antes del vencimiento
          resend.emails.send({
            from: FROM,
            to: email,
            subject: `${nombre}, tu manual cierra en 2 días`,
            scheduledAt: daysFromNow(28),
            html: `
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
                <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
                  <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
                  <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">Tu manual cierra en 2 días</h1>
                </div>
                <div style="padding:32px;background:#f5f0e8;">
                  <p style="color:#1a1a2e;font-size:14px;font-weight:700;margin:0 0 12px;">Hola ${nombre},</p>
                  <div style="background:#7b2f00;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                    <p style="color:#fff;font-size:13px;line-height:1.6;margin:0;">⚠️ <strong style="color:#ffa060">En 2 días el link de tu manual dejará de funcionar.</strong> Si no lo has descargado aún, hazlo ahora — solo toma un minuto.</p>
                  </div>
                  <div style="text-align:center;margin-bottom:28px;">
                    <a href="${manualUrl}" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;border-radius:6px;text-decoration:none;">Descargar mi manual ahora →</a>
                    <p style="color:#888;font-size:11px;margin:10px 0 0;">Desde el manual puedes imprimirlo o guardarlo como PDF</p>
                  </div>
                  <div style="background:#ffffff;border:1px solid #e8e0d0;border-radius:8px;padding:20px 22px;margin-bottom:20px;">
                    <p style="font-size:11px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">¿Cómo va tu proceso?</p>
                    <p style="color:#555;font-size:13px;line-height:1.7;margin:0 0 12px;">Llevas casi un mes trabajando tu mente. Nos gustaría saber cómo te ha ido — qué cambió, qué costó, qué aplicaste. Responde este correo con lo que quieras contarnos.</p>
                    <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">Tu experiencia nos ayuda a seguir mejorando los manuales para otros deportistas.</p>
                  </div>
                  <div style="background:#1a1a2e;border-radius:8px;padding:20px 22px;">
                    <p style="font-size:11px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">¿Tienes un compañero que lo necesite?</p>
                    <p style="color:rgba(245,240,232,0.7);font-size:13px;line-height:1.7;margin:0 0 14px;">Si conoces a otro deportista que esté batallando con su mente — concentración, errores, presión — compártele esto. Su manual personalizado también puede cambiar cómo compite.</p>
                    <a href="${SITE_URL}/personalizado" style="display:inline-block;background:transparent;border:2px solid #c8aa32;color:#c8aa32;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:10px 20px;border-radius:6px;text-decoration:none;">Compartir con un amigo →</a>
                  </div>
                </div>
                <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
                  <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0;">¿Dudas? <a href="mailto:info@lazonacampeon.com" style="color:#c8aa32;text-decoration:none;">info@lazonacampeon.com</a></p>
                </div>
              </div>`,
          }).catch(() => {})

          eliminarPerfilPendiente(uuid)
        } catch (e) {
          console.error('[webhook n4]', e)
        }
      })()
      return NextResponse.json({ ok: true })
    }

    const [productoId, codigoAfiliado] = externalRef.includes('|')
      ? externalRef.split('|')
      : [externalRef, null];

    const payerEmail = paymentData.payer?.email;

    if (!productoId || !payerEmail) {
      return NextResponse.json({ ok: true });
    }

    const producto = PRODUCTOS[productoId];
    if (!producto) {
      return NextResponse.json({ ok: true });
    }

    // Registrar comisión si hay afiliado
    if (codigoAfiliado) {
      const afiliado = getAfiliado(codigoAfiliado);
      if (afiliado) {
        const montoTotal = paymentData.transaction_amount ?? 0;
        const comision = Math.round(montoTotal * COMISION_AFILIADO * 100) / 100;
        const fecha = new Date().toISOString().split('T')[0];
        const scripUrl = process.env.GOOGLE_SCRIPT_AFILIADOS_URL;
        if (scripUrl) {
          fetch(scripUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fecha,
              afiliado: afiliado.nombre,
              codigo: afiliado.codigo,
              producto: producto.title,
              monto: montoTotal,
              comision,
              email: payerEmail,
            }),
          }).catch(() => {});
        }

        // Registrar en pestaña del afiliado en el sheet
        registrarVentaAfiliado({
          handle: afiliado.codigo,
          fecha,
          producto: producto.title,
          montoUSD: montoTotal,
          comision,
        }).catch(() => {});
      }
    }

    const manualUrl = `${SITE_URL}${producto.manualUrl}`;
    const planUrl = producto.planUrl ? `${SITE_URL}${producto.planUrl}` : undefined;
    const nivel = getNivel(productoId);

    registrarVenta({
      nivel: getNivel(productoId).toUpperCase(),
      producto: producto.title,
      monto: paymentData.transaction_amount ?? 0,
      email: payerEmail,
      afiliado: codigoAfiliado ?? undefined,
      paymentId: String(paymentId),
    });

    // Día 0 — inmediato
    await resend.emails.send({
      from: FROM,
      to: payerEmail,
      subject: `Tu manual está listo: ${producto.title}`,
      html: emailDia0(producto.title, manualUrl, planUrl),
    });

    // Días 3, 14, 30 — programados con scheduledAt
    resend.emails.send({
      from: FROM,
      to: payerEmail,
      subject: `¿Cómo va tu primera semana con ${producto.title}?`,
      html: emailDia3(manualUrl),
      scheduledAt: daysFromNow(3),
    }).catch(() => {});

    resend.emails.send({
      from: FROM,
      to: payerEmail,
      subject: `Un tip extra para tu entrenamiento mental`,
      html: emailDia14(manualUrl, nivel),
      scheduledAt: daysFromNow(14),
    }).catch(() => {});

    resend.emails.send({
      from: FROM,
      to: payerEmail,
      subject: `Ya llevas 30 días — el siguiente nivel te espera`,
      html: emailDia30(nivel),
      scheduledAt: daysFromNow(30),
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
