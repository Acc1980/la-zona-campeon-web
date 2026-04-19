import { NextRequest, NextResponse } from "next/server";

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

    await fetch(`${SHEETS_URL}?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error guardando lead:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
