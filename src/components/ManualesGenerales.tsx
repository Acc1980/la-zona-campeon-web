"use client";

import { useState, useEffect } from "react";

const manualesGenerales = [
  { titulo: "La Espiral Negativa", desc: "Cómo detener el ciclo de errores, frustración y más errores. El problema mental más común en deportistas.", precio: 12.99, productoId: "n2-espiral-negativa" },
  { titulo: "Concentración Bajo Presión", desc: "Técnicas para mantener el foco cuando el partido está en juego y el ambiente se pone difícil.", precio: 12.99, productoId: "n2-concentracion" },
  { titulo: "Confianza y Autoestima Deportiva", desc: "Construye una confianza que no depende de los resultados. Para deportistas que dudan de sí mismos.", precio: 12.99, productoId: "n2-confianza" },
  { titulo: "Manejo de Errores y Fracasos", desc: "Aprende a procesar los errores rápido y volver al juego sin que te destruyan por dentro.", precio: 12.99, productoId: "n2-errores" },
  { titulo: "Liderazgo y Comunicación en Equipo", desc: "Para deportistas que quieren influir positivamente en su equipo sin tener la banda de campeón.", precio: 12.99, productoId: "n2-liderazgo" },
];

const DESCUENTO = 0.10

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
}

export default function ManualesGenerales() {
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
      {manualesGenerales.map((m) => {
        const precioDto = Math.round(m.precio * (1 - DESCUENTO) * 100) / 100
        return (
          <div key={m.titulo} className="card-dark flex flex-col border border-gold-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
              {tieneAfiliado && <Badge text="10% dto" color="bg-green-500/20 text-green-400" />}
            </div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">{m.titulo}</h3>
            <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">{m.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              {tieneAfiliado ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-gold-500 text-xl">${precioDto.toFixed(2)}</span>
                  <span className="font-display text-dark-400 text-sm line-through">${m.precio.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-display font-black text-gold-500 text-xl">${m.precio.toFixed(2)}</span>
              )}
              <button
                onClick={() => handleComprar(m.productoId)}
                disabled={loadingId === m.productoId}
                className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
              >
                {loadingId === m.productoId ? "Cargando..." : "Comprar"}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  );
}
