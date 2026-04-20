"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PRODUCTOS } from "@/lib/productos";

function GraciasContent() {
  const params = useSearchParams();
  const externalRef = params.get("external_reference") ?? params.get("preference_id") ?? "";
  const esN4 = externalRef.startsWith("n4-personalizado");
  const productoId = esN4 ? "" : externalRef.split("|")[0];
  const producto = productoId ? PRODUCTOS[productoId] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 pt-20">
      <div className="section-container text-center max-w-xl">
        <div className="gold-line mx-auto mb-8" />
        <h1 className="heading-1 mb-4">
          <span className="text-gold-500">¡Gracias</span> por tu compra
        </h1>
        <p className="text-dark-200 text-lg mb-6 leading-relaxed">
          Tu pago fue procesado correctamente.
        </p>

        {esN4 ? (
          <div className="bg-dark-700 border border-gold-500/30 rounded-xl p-6 mb-8">
            <p className="text-gold-500 text-xs font-display font-bold uppercase tracking-widest mb-3">Manual Mental Personalizado</p>
            <p className="text-white font-bold text-base mb-4">
              Tu manual está siendo generado ahora mismo.
            </p>
            <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 mb-4 text-left">
              <p className="text-dark-200 text-sm leading-relaxed">
                📧 <strong className="text-white">Revisa tu correo en los próximos minutos.</strong> Una vez que MercadoPago confirme el pago, generamos tu análisis y te lo enviamos automáticamente.
              </p>
              <p className="text-dark-400 text-xs mt-3 leading-relaxed">
                Este proceso puede tomar <strong className="text-dark-200">hasta 1 hora</strong> dependiendo del tiempo de confirmación de MercadoPago. Si pasada una hora no recibes nada, escríbenos.
              </p>
            </div>
            <p className="text-dark-400 text-xs">
              ¿Dudas? <span className="text-gold-500">info@lazonacampeon.com</span>
            </p>
          </div>
        ) : producto ? (
          <div className="bg-dark-700 border border-gold-500/30 rounded-xl p-6 mb-8">
            <p className="text-dark-400 text-xs font-display uppercase tracking-widest mb-2">Tu manual</p>
            <h2 className="font-display font-black text-white text-lg uppercase tracking-wide mb-4">
              {producto.title}
            </h2>
            <a
              href={producto.manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block px-8 py-3 text-sm"
            >
              Abrir mi manual →
            </a>
            <p className="text-dark-400 text-xs mt-4">
              Guarda este link. Puedes volver cuando quieras desde cualquier dispositivo.
            </p>
          </div>
        ) : (
          <div className="bg-dark-700 border border-gold-500/30 rounded-xl p-6 mb-8">
            <p className="text-dark-300 text-sm leading-relaxed">
              Recibirás el acceso a tu manual en el correo registrado en MercadoPago.<br />
              Si tienes alguna duda escríbenos a{" "}
              <span className="text-gold-500">info@lazonacampeon.com</span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/productos" className="btn-secondary text-sm">
            Ver más manuales
          </Link>
          <Link href="/" className="btn-primary text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <GraciasContent />
    </Suspense>
  );
}
