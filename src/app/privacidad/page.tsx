import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — La Zona Campeón",
  description: "Política de privacidad y tratamiento de datos de La Zona Campeón.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">

        <h1 className="font-display font-black text-3xl uppercase text-white mb-2">
          Política de <span className="text-gold-500">Privacidad</span>
        </h1>
        <p className="text-dark-400 text-sm mb-10">Última actualización: abril 2026</p>

        <div className="space-y-8 text-dark-200 text-sm leading-relaxed">

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">1. Quiénes somos</h2>
            <p>La Zona Campeón es una plataforma de entrenamiento mental para deportistas. Operamos en <strong className="text-white">lazonacampeon.com</strong> y nos puedes contactar en <strong className="text-white">info@lazonacampeon.com</strong>.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">2. Datos que recopilamos</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Datos de registro:</strong> nombre y correo electrónico cuando descargas nuestra guía gratuita o completas el formulario de perfil mental.</li>
              <li><strong className="text-white">Datos de compra:</strong> procesados por MercadoPago. No almacenamos datos de tarjetas de crédito.</li>
              <li><strong className="text-white">Datos del perfil deportivo:</strong> deporte, posición, categoría y respuestas del formulario Nivel 3, usados únicamente para generar tu manual personalizado.</li>
              <li><strong className="text-white">Mensajes de Instagram:</strong> cuando interactúas con nuestra cuenta vía mensaje directo, procesamos el contenido del mensaje para darte una respuesta automatizada. No almacenamos estos mensajes de forma permanente.</li>
              <li><strong className="text-white">Datos de navegación:</strong> recopilamos datos de uso anónimos a través de Google Analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">3. Cómo usamos tus datos</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Enviarte los productos digitales que adquieres.</li>
              <li>Generar tu análisis de perfil mental personalizado.</li>
              <li>Enviarte comunicaciones relacionadas con tus compras o recursos descargados.</li>
              <li>Responder tus mensajes en Instagram de forma automatizada.</li>
              <li>Mejorar nuestros productos y servicios.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">4. Uso de la API de Meta / Instagram</h2>
            <p>Utilizamos la API de Instagram (Meta) para:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Publicar contenido en nuestra cuenta <strong className="text-white">@lazonacampeon</strong>.</li>
              <li>Responder mensajes directos de usuarios que nos contactan.</li>
            </ul>
            <p className="mt-2">No vendemos, transferimos ni utilizamos con fines publicitarios los datos obtenidos a través de la API de Meta. El uso cumple con la <a href="https://developers.facebook.com/policy/" target="_blank" rel="noreferrer" className="text-gold-500 hover:underline">Política de Plataforma de Meta</a>.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">5. Compartición de datos</h2>
            <p>No vendemos ni compartimos tus datos personales con terceros, salvo con los proveedores de servicio necesarios para operar la plataforma:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong className="text-white">MercadoPago</strong> — procesamiento de pagos.</li>
              <li><strong className="text-white">Resend</strong> — envío de correos electrónicos.</li>
              <li><strong className="text-white">Google</strong> — analítica de uso (Google Analytics).</li>
              <li><strong className="text-white">Anthropic</strong> — generación de contenido personalizado con inteligencia artificial.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">6. Retención de datos</h2>
            <p>Conservamos tus datos mientras seas usuario activo o mientras sea necesario para prestarte el servicio. Puedes solicitar la eliminación de tus datos en cualquier momento escribiendo a <strong className="text-white">info@lazonacampeon.com</strong>.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">7. Tus derechos</h2>
            <p>Tienes derecho a acceder, rectificar o eliminar tus datos personales. Para ejercer estos derechos, contáctanos en <strong className="text-white">info@lazonacampeon.com</strong>.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">8. Cookies</h2>
            <p>Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas de Google Analytics para entender cómo se usa la plataforma. Puedes desactivar las cookies en la configuración de tu navegador.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">9. Cambios en esta política</h2>
            <p>Podemos actualizar esta política ocasionalmente. Te notificaremos por correo si los cambios son significativos.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-white text-base uppercase tracking-wide mb-3">10. Contacto</h2>
            <p>Para cualquier consulta sobre privacidad: <a href="mailto:info@lazonacampeon.com" className="text-gold-500 hover:underline">info@lazonacampeon.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
