"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  fuente?: string;
  dark?: boolean;
}

export default function LeadMagnetForm({ fuente = "lead-magnet", dark = false }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", email: "", deporte: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nombreTrim = form.nombre.trim();
    const emailTrim = form.email.trim().toLowerCase();

    if (!nombreTrim || nombreTrim.length < 2) {
      setError("Por favor escribe tu nombre completo.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim || !emailRegex.test(emailTrim)) {
      setError("Escribe un email válido (ejemplo: tu@correo.com).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreTrim, email: emailTrim, deporte: form.deporte, fuente }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error. Intenta de nuevo.");
        return;
      }

      router.push("/gratis/gracias");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border ${
    dark
      ? "border-dark-600 bg-dark-700 text-white placeholder:text-dark-400 focus:border-gold-500"
      : "border-dark-500 bg-dark-900/50 text-white placeholder:text-dark-400 focus:border-gold-500"
  } focus:ring-2 focus:ring-gold-500/20 transition-all duration-200 outline-none`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        type="text"
        placeholder="Tu nombre"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        required
        className={inputClass}
      />
      <input
        type="email"
        placeholder="Tu email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className={inputClass}
      />
      <select
        value={form.deporte}
        onChange={(e) => setForm({ ...form, deporte: e.target.value })}
        className={inputClass}
      >
        <option value="">Tu deporte (opcional)</option>
        <option value="futbol">Fútbol</option>
        <option value="basquetbol">Básquetbol</option>
        <option value="tenis">Tenis</option>
        <option value="natacion">Natación</option>
        <option value="atletismo">Atletismo</option>
        <option value="voleibol">Voleibol</option>
        <option value="otro">Otro</option>
      </select>

      {error && (
        <p className="text-rojo-400 text-sm text-center">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? "Enviando..." : "Descargar Guía Gratis"}
      </button>

      <p className="text-dark-400 text-xs text-center">
        Sin spam. Puedes cancelar cuando quieras.
      </p>
    </form>
  );
}
