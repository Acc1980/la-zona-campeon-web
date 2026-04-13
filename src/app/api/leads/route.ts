import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";

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

    await connectDB();

    const existing = await Lead.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { message: "Ya estás registrado", alreadyExists: true },
        { status: 200 }
      );
    }

    await Lead.create({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      deporte: deporte?.trim() || "",
      fuente: fuente || "lead-magnet",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error guardando lead:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
