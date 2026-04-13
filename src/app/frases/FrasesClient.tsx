"use client";

import { useState, useEffect } from "react";

const frases = [
  "No vine a este entrenamiento por accidente. Vine a ganar.",
  "La presión no me rompe. Me define.",
  "Respiro. Me enfoco. Ejecuto.",
  "El partido empieza en mi mente, mucho antes de empezar en la cancha.",
  "No necesito ser el mejor del mundo. Solo necesito ser el mejor hoy.",
  "Los nervios me dicen que esto importa. Les agradezco y sigo.",
  "Un error no es el final. Es información.",
  "Mi cuerpo está listo. Mi mente también.",
  "Sigo el plan. Confío en mi preparación.",
  "La concentración no llega sola. La elijo.",
  "Hoy compito con todo lo que entrené.",
  "No controlo el marcador. Controlo mi esfuerzo.",
  "Cada jugada es nueva. El pasado no entra a la cancha.",
  "Soy más fuerte que el miedo que siento ahora mismo.",
  "La presión es un privilegio. Solo la sienten quienes compiten.",
  "Me caigo, me levanto, sigo. Esa es mi mentalidad.",
  "No espero condiciones perfectas. Rindo en cualquier condición.",
  "Mi mejor versión está disponible ahora mismo.",
  "El ruido externo no tiene acceso a mi mente hoy.",
  "Uno a la vez. Jugada a jugada. Minuto a minuto.",
  "Confío en lo que he entrenado. Mi cuerpo sabe qué hacer.",
  "La derrota de ayer no entra al partido de hoy.",
  "Estoy aquí para competir, no para sobrevivir.",
  "La diferencia entre ganar y perder empieza antes del partido.",
  "No le temo a la presión. La uso como combustible.",
  "Mi mente es mi primer músculo.",
  "Hoy doy todo. No guardo nada para mañana.",
  "Los campeones no nacen tranquilos. Aprenden a serlo.",
  "El marcador cambia. Mi compromiso no.",
  "Aquí. Ahora. Esto es lo único que existe.",
  "No compito contra ellos. Compito contra mi límite de ayer.",
  "La confianza no se espera. Se construye acción a acción.",
  "Respira. Ya estuviste en situaciones difíciles antes. Saliste.",
  "Mi posición requiere un tipo de mente. Tengo esa mente.",
  "El partido más importante es el que estoy jugando ahora.",
  "No me distraigo. Vuelvo al presente en cada jugada.",
  "Cada error que procese rápido me da ventaja sobre mi rival.",
  "Estoy preparado para este momento.",
  "La energía nerviosa de hoy es mi activación para competir.",
  "No necesito sentirme perfecto para rendir perfectamente.",
  "Mi equipo me necesita presente. Estoy presente.",
  "Esto no es práctica. Estoy aquí para dejar huella.",
  "Cuando el partido se ponga difícil, yo me pongo mejor.",
  "No pienso en lo que puede salir mal. Me enfoco en lo que haré bien.",
  "El campeón que quiero ser empieza a existir en este instante.",
  "Mis pies saben dónde ir. Mi mente sabe cómo guiarlos.",
  "El esfuerzo de hoy es la confianza de mañana.",
  "No me rindo cuando estoy cansado. Me rindo cuando termina el partido.",
  "La adversidad no me detiene. Me enseña.",
  "Hoy compito con propósito. No por accidente.",
  "Mi rival no sabe lo que hay en mi cabeza. Esa es mi ventaja.",
  "Cada minuto que juego soy mejor que el que era antes de empezar.",
  "La presión revela lo que el entrenamiento construyó.",
  "Estoy exactamente donde tengo que estar.",
  "No juego para que no me critiquen. Juego para dejar todo.",
  "Mi concentración es mi arma más poderosa hoy.",
  "Los partidos difíciles son los que me recuerdan por qué entreno.",
  "Visualicé este momento. Estoy listo para vivirlo.",
  "Cuando dude, respiro. Cuando respire, avanzo.",
  "No hay presión que no haya visto antes en mi cabeza.",
  "El miedo me dice que esto importa. Gracias, miedo. Ahora me hago a un lado.",
  "La cancha no me juzga. Solo registra lo que hago.",
  "Soy más que un resultado. Pero hoy busco el resultado.",
  "Mi rutina mental me trajo aquí. La sigo hasta el final.",
  "Ganar empieza con creer que puedo. Lo creo.",
  "No necesito que todo salga perfecto. Necesito responder bien a lo imperfecto.",
  "Cada partido es una clase. Hoy aprendo y rindo al mismo tiempo.",
  "El equipo que enfrento hoy se preparó. Yo también.",
  "Mi mente decide en un segundo. La entrené para decidir bien.",
  "No hay nada que no pueda manejar en los próximos 90 minutos.",
  "Compito con el cuerpo. Gano con la mente.",
  "Cada segundo en la cancha es una oportunidad. Las tomo todas.",
  "Cuando llegue el momento clave, voy a estar ahí.",
  "No me detengo a pensar si puedo. Sé que puedo. Actúo.",
  "La cancha es donde demuestra lo que construí en silencio.",
  "Sigo adelante aunque duela. Especialmente cuando duela.",
  "Mi mayor competencia soy yo de ayer. Hoy lo supero.",
  "El partido no se gana en la primera jugada. Se gana en cada jugada.",
  "Cuando mi cabeza quiera rendirse, mi corazón va a recordarle por qué empezó.",
  "El rival no puede quitarme la concentración. Solo yo puedo dármela.",
  "Hoy no busco aprobación. Busco rendimiento.",
  "El ruido de las gradas no entra en mi zona mental.",
  "Sé quién soy cuando las cosas se ponen difíciles. Soy el que sigue.",
  "Cada entrenamiento me trajo aquí. Cada entrenamiento valió la pena.",
  "No me preocupa lo que no puedo controlar. Me ocupa lo que sí puedo.",
  "Voy a cometer errores. Y me voy a recuperar de todos.",
  "La fatiga es física. La decisión de seguir es mental. Decido seguir.",
  "No hay partido fácil. Solo preparación suficiente.",
  "Hoy soy un atleta con propósito. Cada paso lo demuestra.",
  "Mi posición en la cancha es donde más valor puedo dar. La doy.",
  "El momento de dudar pasó. Ahora es el momento de actuar.",
  "No compito contra el miedo. Compito con el miedo al lado.",
  "Soy capaz de más de lo que creo. Hoy lo demuestro.",
  "El partido de hoy no define quién soy. Sí define lo que hago con lo que soy.",
  "Respira profundo. Ya entrenaste para esto.",
  "No pienso en el marcador. Pienso en la siguiente jugada.",
  "La zona mental del campeón no es un lugar al que se llega. Es uno que se elige.",
  "Hoy elijo estar en La Zona Campeón.",
];

function getIndexOfDay(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % frases.length;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FrasesClient() {
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);

  useEffect(() => {
    setIdx(getIndexOfDay());
    setTimeLeft(getSecondsUntilMidnight());

    // Generar partículas solo en cliente
    setParticles(
      Array.from({ length: 150 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
      }))
    );

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIdx(getIndexOfDay());
          return getSecondsUntilMidnight();
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const frase = frases[idx];

  const handleCopy = () => {
    const texto = `"${frase}"\n\n— La Zona Campeón\nlazonacampeon.com`;
    navigator.clipboard.writeText(texto).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = () => {
    const texto = `"${frase}"\n\n— La Zona Campeón\nlazonacampeon.com/frases`;
    if (navigator.share) {
      navigator.share({ text: texto });
    } else {
      navigator.clipboard.writeText(texto).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden flex flex-col items-center justify-center px-6 py-24">

      {/* Partículas */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold-500"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-xl w-full text-center">

        {/* Tag */}
        <p className="font-display font-bold text-xs tracking-widest uppercase text-gold-500 mb-4">
          Antes de Competir
        </p>

        {/* Título */}
        <h1 className="font-display font-black text-4xl md:text-5xl uppercase text-white mb-2 leading-tight">
          Tu Frase <span className="text-gold-500">Activadora</span>
        </h1>
        <p className="text-dark-300 text-sm mb-10">
          Una frase para encender tu mente antes del partido
        </p>

        {!revealed ? (
          /* BOTÓN REVELAR */
          <div className="flex flex-col items-center gap-6">
            <div className="relative bg-dark-800 border border-dark-600 rounded-2xl px-8 py-10 w-full shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gold-500 rounded-full" />
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="w-14 h-14 rounded-full border-2 border-gold-500/40 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-gold-500">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4v6l4 2"/>
                  </svg>
                </div>
                <p className="text-dark-400 text-sm">Tu frase de hoy te está esperando</p>
              </div>
            </div>
            <button
              onClick={() => setRevealed(true)}
              className="btn-primary text-base px-10 py-4 font-display font-black uppercase tracking-wider"
            >
              Quiero mi frase de hoy
            </button>
          </div>
        ) : (
          /* FRASE REVELADA */
          <>
            <div className="relative bg-dark-800 border border-dark-600 rounded-2xl px-8 py-10 mb-8 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gold-500 rounded-full" />
              <p className="font-display font-bold text-xl md:text-2xl text-white leading-relaxed mb-6">
                &ldquo;{frase}&rdquo;
              </p>
              <p className="text-gold-500 text-xs font-display font-bold uppercase tracking-widest">
                — La Zona Campeón
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <button
                onClick={handleShare}
                className="btn-primary flex items-center justify-center gap-2 text-sm px-6 py-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Compartir en Instagram
              </button>
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center justify-center gap-2 text-sm px-6 py-3"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gold-500">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    ¡Copiada!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copiar frase
                  </>
                )}
              </button>
            </div>

            {/* Contador */}
            <div className="text-center">
              <p className="text-dark-400 text-xs uppercase tracking-widest font-display mb-2">
                Tu próxima frase estará disponible en
              </p>
              <p className="font-display font-black text-3xl text-gold-500 tracking-widest">
                {formatTime(timeLeft)}
              </p>
              <p className="text-dark-500 text-xs mt-3 italic">
                Guarda esta frase contigo durante el día
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
