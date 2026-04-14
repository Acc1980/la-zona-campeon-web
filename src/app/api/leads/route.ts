import { NextRequest, NextResponse } from "next/server";

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbxMv2y8qNMPZDxWs2rbhZCYLDWUh6B3UpW13kHpqU9w1HPx6SL_Mggiy-aKLHjt9W7m/exec";

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

    await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(),
        deporte: deporte?.trim() || "",
        fuente: fuente || "lead-magnet",
      }),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error guardando lead:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
