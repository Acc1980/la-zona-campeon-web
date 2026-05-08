"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const manualesPosicion = [
  { titulo: "La Mente del Portero", deporte: "Fútbol", desc: "Concentración extrema, liderazgo desde atrás, recuperación mental tras goles encajados.", precio: 17.99, disponible: true, productoId: "mente-portero" },
  { titulo: "La Mente del Defensa Central", deporte: "Fútbol", desc: "Liderazgo defensivo, anticipación y calma en los momentos más decisivos del partido.", precio: 17.99, disponible: true, productoId: "mente-defensa-central" },
  { titulo: "La Mente del Lateral", deporte: "Fútbol", desc: "Expansión ofensiva, identidad completa y proyección al ataque. 50 páginas de entrenamiento mental específico.", precio: 17.99, disponible: true, productoId: "mente-lateral" },
  { titulo: "La Mente del Mediocampista", deporte: "Fútbol", desc: "Creatividad bajo presión, liderazgo técnico y toma de decisiones en fracciones de segundo.", precio: 17.99, disponible: true, productoId: "mente-mediocampista" },
  { titulo: "La Mente del Extremo", deporte: "Fútbol", desc: "Velocidad mental, desborde, decisión en el uno contra uno y aportación constante.", precio: 17.99, disponible: true, productoId: "mente-extremo" },
  { titulo: "La Mente del Delantero Centro", deporte: "Fútbol", desc: "Sequías de gol, presión del equipo, instinto anotador y mentalidad de definición.", precio: 17.99, disponible: true, productoId: "mente-delantero-centro" },
  { titulo: "La Mente del Base", deporte: "Básquetbol", desc: "Liderazgo en cancha, decisión bajo presión y visión de juego en los momentos críticos.", precio: 17.99, disponible: false, productoId: "" },
  { titulo: "La Mente del Alero", deporte: "Básquetbol", desc: "Versatilidad mental, adaptación táctica y confianza en el lanzamiento.", precio: 17.99, disponible: false, productoId: "" },
];

const DESCUENTO = 0.10

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
}

export default function ManualesPosicion() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [tieneAfiliado, setTieneAfiliado] = useState(false);

  useEffect(() => {
    const codigo = document.cookie
      .split('; ')
      .find(r => r.startsWith('afiliado='))
      ?.split('=')[1]
    if (codigo) setTieneAfiliado(true)
  }, [])

  async function handleComprar(productoId: string) {
    setLoadingId(productoId);
    try {
      const codigoAfiliado = document.cookie
        .split('; ')
        .find(r => r.startsWith('afiliado='))
        ?.split('=')[1] ?? null

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId, codigoAfiliado }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      alert("Error al procesar. Intenta de nuevo.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {manualesPosicion.map((m) => {
        const precioDto = Math.round(m.precio * (1 - DESCUENTO) * 100) / 100
        return (
          <div key={m.titulo} className={`card-dark flex flex-col ${!m.disponible ? "opacity-70" : "border border-gold-500/30"}`}>
            <div className="flex items-center gap-2 mb-3">
              <Badge text={m.deporte} color="bg-dark-600 text-dark-200" />
              {m.disponible
                ? <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
                : <Badge text="Próximamente" color="bg-dark-600 text-dark-300" />
              }
              {tieneAfiliado && m.disponible && <Badge text="10% dto" color="bg-green-500/20 text-green-400" />}
            </div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">{m.titulo}</h3>
            <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">{m.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              {tieneAfiliado && m.disponible ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-gold-500 text-xl">${precioDto.toFixed(2)}</span>
                  <span className="font-display text-dark-400 text-sm line-through">${m.precio.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-display font-black text-gold-500 text-xl">${m.precio.toFixed(2)}</span>
              )}
              {m.disponible
                ? <button
                    onClick={() => handleComprar(m.productoId)}
                    disabled={loadingId === m.productoId}
                    className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
                  >
                    {loadingId === m.productoId ? "Cargando..." : "Comprar"}
                  </button>
                : <Link href="/gratis" className="btn-secondary text-xs px-5 py-2.5">Avísame</Link>
              }
            </div>
          </div>
        )
      })}
    </div>
  );
}
