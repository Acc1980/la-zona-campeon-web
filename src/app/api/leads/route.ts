import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzWQx2Jo-Zv-wWQewL6ni9ZvkN-azdI0R8KPb9htaBSiGCgHZzdLthtZLn9ASVaUPMD/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, deporte, fuente } = body;

    if (!nombre || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const params = new URLSearchParams({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      deporte: deporte?.trim() || "",
      fuente: fuente || "lead-magnet",
    });

    fetch(`${SHEETS_URL}?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
    }).catch(() => {});

    enviarEmailGuia(nombre.trim(), email.toLowerCase().trim()).catch(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error guardando lead:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

async function enviarEmailGuia(nombre: string, email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "La Zona Campeón <info@lazonacampeon.com>",
    to: email,
    subject: `Tu guía gratuita está lista, ${nombre}`,
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">

        <!-- Header -->
        <div style="background:#1a1a2e;padding:28px 32px;text-align:center;">
          <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c8aa32;margin:0 0 6px;">La Zona Campeón</p>
          <h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ffffff;margin:0;">Tu guía está lista</h1>
        </div>

        <!-- Intro -->
        <div style="padding:28px 32px;background:#f5f0e8;border-bottom:1px solid #e8e0d0;">
          <p style="color:#1a1a2e;font-size:14px;margin:0 0 8px;">Hola <strong>${nombre}</strong>,</p>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">Aquí tienes tus dos recursos gratuitos. Descárgalos y tenlos a mano antes de tu próximo entrenamiento o partido.</p>
        </div>

        <!-- Descargas -->
        <div style="padding:28px 32px;">

          <div style="background:#f9f5ee;border-left:4px solid #c8aa32;border-radius:4px;padding:16px 20px;margin-bottom:16px;">
            <p style="font-weight:800;color:#1a1a2e;font-size:14px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">📘 Guía: 5 Hábitos Mentales del Campeón</p>
            <p style="color:#555;font-size:12px;line-height:1.6;margin:0 0 14px;">Los 5 hábitos que practican los atletas de élite — con ejercicios aplicables desde hoy.</p>
            <a href="https://lazonacampeon.com/guia-5-habitos.html" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:10px 22px;border-radius:4px;text-decoration:none;">Descargar guía →</a>
          </div>

          <div style="background:#f9f5ee;border-left:4px solid #c8aa32;border-radius:4px;padding:16px 20px;">
            <p style="font-weight:800;color:#1a1a2e;font-size:14px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">📅 Calendario de seguimiento 21 días</p>
            <p style="color:#555;font-size:12px;line-height:1.6;margin:0 0 14px;">Registra tu progreso mental durante 21 días y construye el hábito de rendir bajo presión.</p>
            <a href="https://lazonacampeon.com/calendario-21-dias.html" style="display:inline-block;background:#c8aa32;color:#1a1a2e;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:10px 22px;border-radius:4px;text-decoration:none;">Descargar calendario →</a>
          </div>

        </div>

        <!-- Frases activadoras -->
        <div style="padding:24px 32px;border:2px solid #c8aa32;margin:0 32px 28px;border-radius:8px;text-align:center;">
          <p style="font-size:10px;font-weight:700;color:#c8aa32;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Antes de tu próximo partido</p>
          <p style="font-weight:800;color:#1a1a2e;font-size:15px;margin:0 0 8px;">Tu frase activadora del día</p>
          <p style="color:#555;font-size:12px;line-height:1.6;margin:0 0 16px;">Léela en voz alta antes de entrar al campo. Una frase distinta cada día para activar tu mente de campeón.</p>
          <a href="https://lazonacampeon.com/frases" style="display:inline-block;background:#1a1a2e;color:#c8aa32;font-weight:900;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:12px 26px;border-radius:4px;text-decoration:none;">Ver mi frase activadora →</a>
        </div>

        <!-- Footer -->
        <div style="padding:20px 32px;background:#1a1a2e;text-align:center;">
          <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0 0 6px;">¿Quieres llevar tu entrenamiento mental al siguiente nivel?</p>
          <a href="https://lazonacampeon.com/productos" style="color:#c8aa32;font-size:11px;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Ver manuales personalizados →</a>
          <p style="color:rgba(255,255,255,0.25);font-size:10px;margin:16px 0 0;">La Zona Campeón · lazonacampeon.com</p>
        </div>

      </div>
    `,
  });
}
