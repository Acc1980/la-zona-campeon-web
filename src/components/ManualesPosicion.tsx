"use client";

import { useState } from "react";
import Link from "next/link";

// Pegar aquí el link de checkout de Hotmart cuando esté listo
const HOTMART_LATERAL = "https://pay.hotmart.com/REEMPLAZAR";

const manualesPosicion = [
  { titulo: "La Mente del Lateral", deporte: "Fútbol", desc: "Expansión ofensiva, identidad completa y proyección al ataque. 52 páginas de entrenamiento mental específico.", precio: "$19.99", disponible: true, hotmart: HOTMART_LATERAL },
  { titulo: "La Mente del Portero", deporte: "Fútbol", desc: "Concentración extrema, liderazgo desde atrás, recuperación mental tras goles.", precio: "$19.99", disponible: false },
  { titulo: "La Mente del Delantero Centro", deporte: "Fútbol", desc: "Sequías de gol, presión del equipo, instinto anotador y mentalidad de definición.", precio: "$19.99", disponible: false },
  { titulo: "La Mente del Extremo", deporte: "Fútbol", desc: "Velocidad mental, desborde, decisión en el uno contra uno y aportación constante.", precio: "$19.99", disponible: false },
  { titulo: "La Mente del Mediocampista", deporte: "Fútbol", desc: "Creatividad bajo presión, liderazgo técnico y toma de decisiones en fracciones de segundo.", precio: "$19.99", disponible: false },
  { titulo: "La Mente del Defensa Central", deporte: "Fútbol", desc: "Liderazgo defensivo, anticipación y calma bajo presión en los momentos decisivos.", precio: "$19.99", disponible: false },
  { titulo: "La Mente del Base", deporte: "Básquetbol", desc: "Liderazgo en cancha, decisión bajo presión y visión de juego en los momentos críticos.", precio: "$19.99", disponible: false },
  { titulo: "La Mente del Alero", deporte: "Básquetbol", desc: "Versatilidad mental, adaptación táctica y confianza en el lanzamiento.", precio: "$19.99", disponible: false },
];

const deportes = ["Todos", ...Array.from(new Set(manualesPosicion.map((m) => m.deporte)))];

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
}

export default function ManualesPosicion() {
  const [deporteActivo, setDeporteActivo] = useState<string | null>(null);

  const filtrados = deporteActivo === null
    ? []
    : deporteActivo === "Todos"
      ? manualesPosicion
      : manualesPosicion.filter((m) => m.deporte === deporteActivo);

  return (
    <>
      {/* Filtro por deporte */}
      <div className="flex flex-wrap gap-3 mb-8">
        {deportes.map((d) => (
          <button
            key={d}
            onClick={() => setDeporteActivo(d)}
            className={`px-5 py-2 rounded-full text-sm font-display font-bold uppercase tracking-wider transition-all ${
              deporteActivo === d
                ? "bg-gold-500 text-dark-900"
                : "bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Estado inicial: ningún deporte seleccionado */}
      {deporteActivo === null && (
        <div className="text-center py-12 text-dark-400 font-display uppercase tracking-widest text-sm">
          Selecciona un deporte para ver los manuales disponibles
        </div>
      )}

      {/* Grid de manuales */}
      {filtrados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((m) => (
            <div key={m.titulo} className={`card-dark flex flex-col ${!m.disponible ? "opacity-70" : "border border-gold-500/30"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Badge text={m.deporte} color="bg-dark-600 text-dark-200" />
                {m.disponible
                  ? <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
                  : <Badge text="Próximamente" color="bg-dark-600 text-dark-300" />
                }
              </div>
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-2">{m.titulo}</h3>
              <p className="text-dark-300 text-sm leading-relaxed flex-1 mb-4">{m.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-display font-black text-gold-500 text-xl">{m.precio}</span>
                {m.disponible
                  ? <a href={(m as typeof m & { hotmart?: string }).hotmart ?? "#"} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-5 py-2.5">Comprar</a>
                  : <Link href="/gratis" className="btn-secondary text-xs px-5 py-2.5">Avísame</Link>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
