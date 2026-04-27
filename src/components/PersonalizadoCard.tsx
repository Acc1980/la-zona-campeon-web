"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PRECIO = 29.99
const DESCUENTO = 0.10

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block text-xs font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full ${color}`}>
      {text}
    </span>
  );
}

export default function PersonalizadoCard() {
  const [tieneAfiliado, setTieneAfiliado] = useState(false);

  useEffect(() => {
    const codigo = document.cookie.split('; ').find(r => r.startsWith('afiliado='))?.split('=')[1]
    if (codigo) setTieneAfiliado(true)
  }, [])

  const precioDto = Math.round(PRECIO * (1 - DESCUENTO) * 100) / 100

  return (
    <div className="card-dark border border-gold-500/30">
      <div className="flex items-center gap-2">
        <Badge text="Disponible" color="bg-gold-500/20 text-gold-400" />
        {tieneAfiliado && <Badge text="10% dto" color="bg-green-500/20 text-green-400" />}
      </div>
      <h3 className="font-display font-bold text-white text-lg uppercase tracking-wide mt-4 mb-3">
        Manual 100% Personalizado
      </h3>
      <p className="text-dark-300 text-sm leading-relaxed mb-6">
        Respondes un perfil completo — deporte, posición, fortalezas y desafíos mentales — y nuestro sistema especializado genera un manual único para ti con diagnóstico, estrategias, plan de 4 semanas y herramientas de seguimiento.
      </p>
      <ul className="space-y-2 text-sm text-dark-300 mb-6">
        {["Tu nombre, deporte, posición y categoría", "Tu autoevaluación mental (fortalezas + desafíos)", "La perspectiva de tu técnico (opcional)", "La perspectiva de tus padres (opcional)", "Diagnóstico + estrategias + plan de 4 semanas", "Registro diario y autoevaluación semanal"].map(item => (
          <li key={item} className="flex gap-2"><span className="text-gold-500">→</span>{item}</li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        {tieneAfiliado ? (
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-gold-500 text-2xl">${precioDto.toFixed(2)}</span>
            <span className="font-display text-dark-400 text-sm line-through">${PRECIO.toFixed(2)}</span>
          </div>
        ) : (
          <span className="font-display font-black text-gold-500 text-2xl">${PRECIO.toFixed(2)}</span>
        )}
        <Link href="/personalizado" className="btn-primary text-xs px-5 py-2.5">
          Generar mi manual →
        </Link>
      </div>
    </div>
  );
}
