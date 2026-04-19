'use client'

// ─── Types ───────────────────────────────────────────────────────────────────

export type AnalisisIA = {
  diagnostico: string
  estrategias: { titulo: string; descripcion: string }[]
  plan4semanas: { semana: number; titulo: string; foco: string; ejercicios: string[] }[]
  registroDiario: {
    habitos: { nombre: string; descripcion: string }[]
  }
  autoevaluacionSemanal: {
    preguntas: { area: string; pregunta: string }[]
  }
  mensajeFinal: string
}

export type PerfilCompleto = {
  nombre: string
  edad: string
  deporte: string
  deporteLabel: string
  posicion: string
  posicionLabel: string
  categoria: string
  fortalezas: string[]
  fortalezasTexto: string
  desafios: string[]
  desafiosTexto: string
  situaciones: string
  incluyeTecnico: boolean
  tecnicoNombre: string
  tecnicoFortalezas: string
  tecnicoDesafios: string
  incluyePadres: boolean
  padresNombre: string
  padresObservaciones: string
  padresPreocupaciones: string
  padresEntrenadorDijo: string
  email: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const ASPECTOS: Record<string, { label: string; fortaleza: string; desafio: string }> = {
  concentracion: {
    label: 'Concentración bajo presión',
    fortaleza: 'Tu capacidad de mantener el foco en los momentos de mayor exigencia es un activo real. Los deportistas con concentración sólida toman mejores decisiones justo cuando el partido más lo pide, y eso se nota en el rendimiento en los últimos minutos o en las situaciones decisivas.',
    desafio: 'Mantener la concentración bajo presión es uno de los trabajos mentales más exigentes en el deporte. La mente tiende a irse hacia el resultado, hacia lo que puede salir mal o hacia lo que ya salió. El entrenamiento específico en este área consiste en recuperar el foco al momento presente de forma deliberada y sistemática.',
  },
  confianza: {
    label: 'Confianza y autoestima',
    fortaleza: 'Tienes una base de confianza sobre tu capacidad que te permite competir sin que cada error te destruya. Esa confianza —cuando está bien construida— no depende del último resultado sino de la certeza de tu trabajo y tu preparación.',
    desafio: 'La confianza que oscila con los resultados es frágil. El trabajo en este área apunta a construir una confianza interna que no depende de si el partido sale bien o mal, sino de la certeza en el proceso de preparación. Eso se construye y se puede entrenar.',
  },
  errores: {
    label: 'Manejo de errores y fracasos',
    fortaleza: 'Tu capacidad de procesar los errores rápido y volver al juego con claridad es una ventaja competitiva directa. Los deportistas que sueltan el error en segundos tienen más tiempo de juego efectivo que los que lo cargan durante minutos.',
    desafio: 'La reacción al error es uno de los patrones más trabajables en psicología deportiva. El objetivo no es no sentir nada cuando se falla —es comprimir el tiempo entre el error y la recuperación, para que ese momento no destruya el rendimiento siguiente.',
  },
  liderazgo: {
    label: 'Liderazgo y comunicación en equipo',
    fortaleza: 'Tu capacidad de influir positivamente en el equipo y comunicarte bien en los momentos difíciles tiene un impacto que va más allá de tu propio rendimiento individual. Los equipos que tienen jugadores con liderazgo genuino rinden diferente bajo presión.',
    desafio: 'El liderazgo deportivo no es un rasgo innato —es una habilidad que se desarrolla. Aprender a comunicar de manera que active a los compañeros en lugar de presionarlos, y a mantener la calma colectiva cuando el partido se complica, son habilidades concretas y entrenables.',
  },
  espiral: {
    label: 'Control de la espiral negativa',
    fortaleza: 'Identificar cuándo estás entrando en una espiral y tener herramientas para interrumpirla es una habilidad mental avanzada. Eso significa que los ciclos de error → frustración → más errores no te atrapan durante mucho tiempo.',
    desafio: 'La espiral negativa es el patrón mental más destructivo en el deporte porque se alimenta a sí mismo: un error genera frustración, la frustración genera más errores, y el ciclo sigue. Aprender a interrumpir ese ciclo en los primeros segundos —antes de que tome velocidad— es el trabajo central en esta área.',
  },
  regularidad: {
    label: 'Regularidad y consistencia',
    fortaleza: 'Mantener un nivel estable de rendimiento partido a partido —sin depender de los picos de inspiración ni hundirte en los valles— es la base de la carrera deportiva a largo plazo. La consistencia es lo que construye la confianza de técnicos y compañeros.',
    desafio: 'La irregularidad en el rendimiento tiene raíces mentales claras: la carga emocional del último partido, la expectativa del próximo, el manejo de la crítica o la presión del entorno. Trabajar la consistencia mental significa encontrar la base estable desde la que siempre puedes operar, independientemente de las circunstancias externas.',
  },
  presion: {
    label: 'Rendir bajo presión alta',
    fortaleza: 'Activarte en los partidos grandes, en los momentos de alta presión, y rendir en esas circunstancias es una de las habilidades más valoradas en el deporte de competición. No todos los deportistas rinden mejor cuando el contexto es más exigente.',
    desafio: 'La presión alta —partidos decisivos, situaciones de ventaja que defender, errores críticos— activa respuestas físicas y mentales que pueden interferir con el rendimiento. El entrenamiento en este área trabaja específicamente cómo interpretar y canalizar esa activación para que sea combustible en lugar de freno.',
  },
  mentalidad: {
    label: 'Mentalidad ante la derrota',
    fortaleza: 'Tu capacidad de procesar una derrota sin que defina tu identidad o destruya tu motivación es fundamental para la continuidad deportiva. Los deportistas que aprenden de las derrotas sin hundirse en ellas recuperan antes y crecen más rápido.',
    desafio: 'La derrota tiene un impacto diferente en cada deportista, y eso depende en gran medida de cómo se interpreta. Trabajar la mentalidad ante la derrota no significa no afectarse —significa aprender a transitar ese proceso de manera que deje aprendizaje y no solo dolor.',
  },
}

const NIVEL3_POSICION: Record<string, Record<string, string>> = {
  futbol: {
    portero: 'La Mente del Portero',
    'defensa-central': 'La Mente del Defensa Central',
    lateral: 'La Mente del Lateral',
    mediocampista: 'La Mente del Mediocampista',
    extremo: 'La Mente del Extremo',
    delantero: 'La Mente del Delantero Centro',
  },
}

const NIVEL2_DESAFIO: Record<string, string> = {
  espiral: 'La Espiral Negativa',
  concentracion: 'Concentración Bajo Presión',
  confianza: 'Confianza y Autoestima Deportiva',
  errores: 'Manejo de Errores y Fracasos',
  liderazgo: 'Liderazgo y Comunicación en Equipo',
}

// ─── Plan de 4 semanas según desafíos ────────────────────────────────────────

function generarPlan(desafios: string[], fortalezas: string[]) {
  const prioridad1 = desafios[0]
  const prioridad2 = desafios[1] ?? null

  const descripciones: Record<string, { semana1: string; semana2: string }> = {
    concentracion: {
      semana1: 'Identificar los momentos del partido donde pierdes el foco. Llevar un registro breve después de cada entrenamiento: ¿cuándo me fui? ¿qué pasaba en ese momento?',
      semana2: 'Practicar la técnica de anclaje de atención: palabra clave + respiración. Aplicar en los entrenamientos con presión simulada.',
    },
    confianza: {
      semana1: 'Empezar el Diario de Victorias: registrar cada día 2 cosas que salieron bien en el entrenamiento. Sin importar lo pequeñas que sean.',
      semana2: 'Trabajar el diálogo interno: identificar las frases automáticas que bajan la confianza y reemplazarlas por frases de proceso ("lo hago porque lo trabajé").',
    },
    errores: {
      semana1: 'Aprender y practicar el protocolo de 10 segundos después del error. Aplicarlo en cada entrenamiento, no esperar al partido.',
      semana2: 'Registro de errores y recuperaciones: anotar cuántos segundos tardas en volver a tu nivel después de cada error relevante. El objetivo es comprimir ese tiempo.',
    },
    liderazgo: {
      semana1: 'Identificar tu estilo natural de liderazgo: ¿lideras con energía, con calma, con comunicación verbal, con ejemplo? Conocer tu estilo es el punto de partida.',
      semana2: 'Practicar una comunicación específica por entrenamiento: una instrucción clara a un compañero, un gesto de apoyo concreto en un momento difícil.',
    },
    espiral: {
      semana1: 'Mapear tu espiral personal: ¿qué tipo de error la activa más? ¿cuánto tiempo dura antes de que salgas? ¿qué la interrumpe?',
      semana2: 'Implementar el interruptor de espiral: el gesto físico + la frase corta que corta el ciclo. Practicarlo deliberadamente en los entrenamientos.',
    },
    regularidad: {
      semana1: 'Establecer una rutina de preparación pre-entrenamiento: 5 minutos de activación mental antes de cada sesión. La misma rutina, siempre.',
      semana2: 'Revisión semanal rápida: 10 minutos al final de la semana para identificar qué funcionó y qué ajustar. Sin juicio, solo información.',
    },
    presion: {
      semana1: 'Trabajar la interpretación de la activación: aprender a leer la presión como energía disponible en lugar de como amenaza.',
      semana2: 'Crear una rutina de preparación específica para los partidos grandes: diferente a la rutina normal, que señale al cuerpo y la mente que este momento es importante y están listos.',
    },
    mentalidad: {
      semana1: 'Protocolo post-derrota: las 24 horas después de una derrota tienen un protocolo definido. Primero procesar la emoción, después extraer el aprendizaje.',
      semana2: 'Separar resultado de identidad: un ejercicio escrito para distinguir "perdí ese partido" de "soy un deportista que pierde". Esa distinción protege la motivación a largo plazo.',
    },
  }

  const plan = []

  if (prioridad1 && descripciones[prioridad1]) {
    plan.push({
      semana: 'Semana 1',
      titulo: `Diagnóstico y primer trabajo — ${ASPECTOS[prioridad1]?.label ?? prioridad1}`,
      desc: descripciones[prioridad1].semana1,
    })
    plan.push({
      semana: 'Semana 2',
      titulo: `Herramientas específicas — ${ASPECTOS[prioridad1]?.label ?? prioridad1}`,
      desc: descripciones[prioridad1].semana2,
    })
  }

  if (prioridad2 && descripciones[prioridad2]) {
    plan.push({
      semana: 'Semana 3',
      titulo: `Aplicación en entrenamiento + inicio — ${ASPECTOS[prioridad2]?.label ?? prioridad2}`,
      desc: `Consolidar las herramientas de la semana anterior aplicándolas activamente en los entrenamientos. En paralelo: ${descripciones[prioridad2].semana1}`,
    })
    plan.push({
      semana: 'Semana 4',
      titulo: `Aplicación en competición — ${ASPECTOS[prioridad2]?.label ?? prioridad2}`,
      desc: `${descripciones[prioridad2].semana2} Revisar el progreso de las cuatro semanas: ¿qué cambió? ¿qué necesita más trabajo?`,
    })
  } else if (prioridad1) {
    const fortalezaKey = fortalezas[0]
    plan.push({
      semana: 'Semana 3',
      titulo: 'Aplicación en entrenamiento',
      desc: 'Usar las herramientas trabajadas en situaciones de entrenamiento con presión simulada. Registrar la efectividad del protocolo elegido.',
    })
    plan.push({
      semana: 'Semana 4',
      titulo: 'Transferencia a la competición',
      desc: `Aplicar las herramientas en el contexto real del partido. Después del primer partido: revisión de 10 minutos para evaluar qué funcionó y qué ajustar. ${fortalezaKey ? `Apoyarte en tu fortaleza de ${ASPECTOS[fortalezaKey]?.label ?? fortalezaKey} como base de confianza.` : ''}`,
    })
  }

  return plan
}

// ─── Análisis cruzado técnico/deportista ─────────────────────────────────────

function analisisCruzado(
  deportistaFortalezas: string[],
  deportistaDesafios: string[],
  tecnicoFortalezas: string,
  tecnicoDesafios: string
) {
  const coincidencias: { tipo: 'confirmada' | 'revisar' | 'prioridad'; texto: string }[] = []

  if (!tecnicoFortalezas && !tecnicoDesafios) return coincidencias

  // Simple keyword matching for cross-analysis
  const aspectoKeys = Object.keys(ASPECTOS)
  aspectoKeys.forEach(key => {
    const label = ASPECTOS[key].label.toLowerCase()
    const esFortalezaDeportista = deportistaFortalezas.includes(key)
    const esDesafioDeportista = deportistaDesafios.includes(key)
    const tecnicoLaFortaleza = tecnicoFortalezas.toLowerCase().includes(label.split(' ')[0])
    const tecnicoLaDesafio = tecnicoDesafios.toLowerCase().includes(label.split(' ')[0])

    if (esFortalezaDeportista && tecnicoLaFortaleza) {
      coincidencias.push({ tipo: 'confirmada', texto: `${ASPECTOS[key].label}: tanto el deportista como el técnico la identifican como una fortaleza real.` })
    } else if (esDesafioDeportista && tecnicoLaDesafio) {
      coincidencias.push({ tipo: 'prioridad', texto: `${ASPECTOS[key].label}: ambas perspectivas coinciden en que es el área de mayor trabajo prioritario.` })
    } else if (esFortalezaDeportista && tecnicoLaDesafio) {
      coincidencias.push({ tipo: 'revisar', texto: `${ASPECTOS[key].label}: el deportista la percibe como fortaleza, pero el técnico la señala como área de mejora. Vale la pena explorar esa diferencia de perspectiva.` })
    }
  })

  return coincidencias
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DocumentoGenerado({ perfil, analisisIA }: { perfil: PerfilCompleto; analisisIA?: AnalisisIA }) {
  const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const plan = generarPlan(perfil.desafios, perfil.fortalezas)
  const manualN3 = NIVEL3_POSICION[perfil.deporte]?.[perfil.posicion]
  const manualesN2 = perfil.desafios
    .filter(d => NIVEL2_DESAFIO[d])
    .map(d => NIVEL2_DESAFIO[d])
  const analisis = analisisCruzado(
    perfil.fortalezas,
    perfil.desafios,
    perfil.tecnicoFortalezas,
    perfil.tecnicoDesafios
  )

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", background: '#f5f0e8', color: '#1a1a1a', lineHeight: 1.75 }}>

      <style>{`
        @media print {
          .doc-dark-section { background: #1a1a2e !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .doc-dark-section * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ background: '#fff', borderBottom: '3px solid #e8c84a', textAlign: 'center', padding: '14px 20px', fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#1a1a2e' }}>
        La Zona Campeón · Control Mental para Deportistas
      </div>

      {/* Cover */}
      <div style={{ background: '#fff', color: '#1a1a2e', textAlign: 'center', padding: '60px 30px 50px', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'inline-block', background: '#1a1a2e', color: '#e8c84a', fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 18px', borderRadius: 20, marginBottom: 28 }}>
          Nivel 4 · Análisis de Perfil Mental
        </div>
        <div style={{ width: 60, height: 4, background: '#e8c84a', margin: '0 auto 28px' }} />
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 'clamp(1.8rem,5vw,2.8rem)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px', color: '#1a1a2e' }}>
          {perfil.nombre}
        </h1>
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#1a1a2e', letterSpacing: 1, marginBottom: 8 }}>
          {perfil.deporteLabel} · {perfil.posicionLabel} · {perfil.categoria}
        </p>
        <p style={{ fontSize: '0.88rem', color: '#777' }}>
          Generado el {fecha}
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '44px 24px 80px' }}>

        {/* Resumen del diagnóstico */}
        <div style={{ background: '#fff', borderLeft: '5px solid #e8c84a', borderRadius: 6, padding: '26px 28px', marginBottom: 44 }}>
          <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, color: '#1a1a2e' }}>
            Diagnóstico mental personalizado
          </h2>
          {analisisIA?.diagnostico
            ? analisisIA.diagnostico.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} style={{ marginBottom: 12, fontSize: '0.95rem', lineHeight: 1.8 }}>{p}</p>
              ))
            : (
              <>
                <p style={{ marginBottom: 12 }}>
                  Este análisis está basado en la información que {perfil.nombre} proporcionó sobre su perfil deportivo
                  {perfil.incluyeTecnico ? `, la perspectiva de ${perfil.tecnicoNombre || 'su técnico'}` : ''}
                  {perfil.incluyePadres ? ` y las observaciones de ${perfil.padresNombre || 'sus padres'}` : ''}.
                </p>
                <p>
                  <strong>{perfil.deporteLabel} · {perfil.posicionLabel} · {perfil.categoria}</strong>
                  {perfil.edad ? ` · ${perfil.edad} años` : ''}.
                  {perfil.fortalezas.length > 0 && ` Fortalezas identificadas: ${perfil.fortalezas.map(f => ASPECTOS[f]?.label).filter(Boolean).join(', ')}.`}
                  {perfil.desafios.length > 0 && ` Áreas de trabajo prioritario: ${perfil.desafios.map(d => ASPECTOS[d]?.label).filter(Boolean).join(', ')}.`}
                </p>
              </>
            )
          }
        </div>

        {/* Estrategias IA */}
        {analisisIA?.estrategias && analisisIA.estrategias.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Estrategias clave
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 20, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Estrategias específicas para ti
            </h2>
            {analisisIA.estrategias.map((e, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #ddd', borderLeft: '4px solid #e8c84a', borderRadius: 8, padding: '20px 22px', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {e.titulo}
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0, lineHeight: 1.75 }}>{e.descripcion}</p>
              </div>
            ))}
          </div>
        )}

        {/* Fortalezas */}
        {perfil.fortalezas.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Sección 1
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 20, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Fortalezas identificadas
            </h2>
            {perfil.fortalezas.map(id => ASPECTOS[id] && (
              <div key={id} style={{ background: '#fff', border: '1px solid #ddd', borderLeft: '4px solid #7ab870', borderRadius: 8, padding: '20px 22px', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#2e7d32', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {ASPECTOS[id].label}
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{ASPECTOS[id].fortaleza}</p>
              </div>
            ))}
            {perfil.fortalezasTexto && (
              <div style={{ background: '#f9f5ee', borderRadius: 8, padding: '16px 20px', marginTop: 8, fontSize: '0.9rem', fontStyle: 'italic', color: '#444' }}>
                <strong style={{ fontStyle: 'normal', color: '#1a1a2e' }}>En sus propias palabras: </strong>
                {perfil.fortalezasTexto}
              </div>
            )}
          </div>
        )}

        {/* Áreas de trabajo */}
        {perfil.desafios.length > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Sección 2
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 20, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Áreas de trabajo prioritario
            </h2>
            {perfil.desafios.map((id, i) => ASPECTOS[id] && (
              <div key={id} style={{ background: '#fff', border: '1px solid #ddd', borderLeft: '4px solid #c85050', borderRadius: 8, padding: '20px 22px', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ background: '#c85050', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
                    Prioridad {i + 1}
                  </span>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#c85050', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
                    {ASPECTOS[id].label}
                  </h3>
                </div>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{ASPECTOS[id].desafio}</p>
              </div>
            ))}
            {perfil.desafiosTexto && (
              <div style={{ background: '#f9f5ee', borderRadius: 8, padding: '16px 20px', marginTop: 8, fontSize: '0.9rem', fontStyle: 'italic', color: '#444' }}>
                <strong style={{ fontStyle: 'normal', color: '#1a1a2e' }}>En sus propias palabras: </strong>
                {perfil.desafiosTexto}
              </div>
            )}
            {perfil.situaciones && (
              <div style={{ background: '#fff0f0', border: '1px solid #f0c0c0', borderRadius: 8, padding: '16px 20px', marginTop: 12, fontSize: '0.9rem' }}>
                <strong style={{ color: '#1a1a2e', display: 'block', marginBottom: 6, fontFamily: "'Montserrat',sans-serif", fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Situaciones específicas mencionadas:
                </strong>
                {perfil.situaciones}
              </div>
            )}
          </div>
        )}

        {/* Perspectiva del técnico */}
        {perfil.incluyeTecnico && (perfil.tecnicoFortalezas || perfil.tecnicoDesafios) && (
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Sección 3
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 20, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Perspectiva del técnico{perfil.tecnicoNombre ? `: ${perfil.tecnicoNombre}` : ''}
            </h2>
            {perfil.tecnicoFortalezas && (
              <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '20px 22px', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#2e7d32', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Lo que el técnico observa como fortaleza
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0, fontStyle: 'italic', color: '#333' }}>{perfil.tecnicoFortalezas}</p>
              </div>
            )}
            {perfil.tecnicoDesafios && (
              <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '20px 22px', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#c85050', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Lo que el técnico considera que debe trabajar
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0, fontStyle: 'italic', color: '#333' }}>{perfil.tecnicoDesafios}</p>
              </div>
            )}
            {analisis.length > 0 && (
              <div className="doc-dark-section" style={{ background: '#1a1a2e', borderRadius: 8, padding: '20px 22px' }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#e8c84a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  Análisis cruzado: deportista vs. técnico
                </h3>
                {analisis.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: a.tipo === 'confirmada' ? '#7ab870' : a.tipo === 'prioridad' ? '#c85050' : '#e8c84a', color: a.tipo === 'revisar' ? '#1a1a2e' : '#fff', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {a.tipo === 'confirmada' ? 'Confirmada' : a.tipo === 'prioridad' ? 'Prioridad' : 'Revisar'}
                    </span>
                    <p style={{ fontSize: '0.88rem', color: 'rgba(245,240,232,0.85)', margin: 0 }}>{a.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Perspectiva de los padres */}
        {perfil.incluyePadres && (perfil.padresObservaciones || perfil.padresPreocupaciones || perfil.padresEntrenadorDijo) && (
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Sección 4
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 20, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Perspectiva de los padres{perfil.padresNombre ? `: ${perfil.padresNombre}` : ''}
            </h2>
            {perfil.padresObservaciones && (
              <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '20px 22px', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#3a7bd5', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Lo que observan desde casa
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0, fontStyle: 'italic', color: '#333' }}>{perfil.padresObservaciones}</p>
              </div>
            )}
            {perfil.padresPreocupaciones && (
              <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '20px 22px', marginBottom: 14 }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#e07b30', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Situaciones que les generan preocupación
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0, fontStyle: 'italic', color: '#333' }}>{perfil.padresPreocupaciones}</p>
              </div>
            )}
            {perfil.padresEntrenadorDijo && (
              <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '20px 22px' }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Lo que el entrenador/a les ha dicho
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0, fontStyle: 'italic', color: '#333' }}>{perfil.padresEntrenadorDijo}</p>
              </div>
            )}
          </div>
        )}

        {/* Plan de 4 semanas */}
        {(analisisIA?.plan4semanas?.length || plan.length > 0) && (
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Plan de trabajo
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 20, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Tu plan — Próximas 4 semanas
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
              {analisisIA?.plan4semanas
                ? analisisIA.plan4semanas.map((s) => (
                    <div key={s.semana} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '20px 22px' }}>
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.75rem', fontWeight: 800, color: '#e8c84a', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                        Semana {s.semana}
                      </div>
                      <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
                        {s.titulo}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#555', marginBottom: 10, fontStyle: 'italic' }}>{s.foco}</p>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {s.ejercicios.map((ej, j) => (
                          <li key={j} style={{ fontSize: '0.85rem', color: '#333', marginBottom: 4, lineHeight: 1.6 }}>{ej}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                : plan.map((semana, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '20px 22px' }}>
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.75rem', fontWeight: 800, color: '#e8c84a', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                        {semana.semana}
                      </div>
                      <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>
                        {semana.titulo}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#444', margin: 0, lineHeight: 1.7 }}>{semana.desc}</p>
                    </div>
                  ))
              }
            </div>
          </div>
        )}

        {/* CTA siguiente paso */}
        <div className="doc-dark-section" style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 10, padding: '36px 32px', marginBottom: 44, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 16 }}>
            Próximo paso
          </div>
          <p style={{ color: 'rgba(245,240,232,0.85)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>
            En 4 semanas habrás trabajado tu plan. Vuelve a evaluar tu perfil — verás cuánto ha cambiado tu mente.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://lazonacampeon.com/personalizado" style={{ display: 'inline-block', background: '#e8c84a', color: '#1a1a2e', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, padding: '12px 24px', borderRadius: 6, textDecoration: 'none' }}>
              Reevaluar en 4 semanas →
            </a>
            <a href="https://lazonacampeon.com/gratis" style={{ display: 'inline-block', background: 'transparent', color: '#e8c84a', border: '1px solid rgba(232,200,74,0.5)', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, padding: '12px 24px', borderRadius: 6, textDecoration: 'none' }}>
              Compartir con un compañero
            </a>
          </div>
        </div>

        {/* Registro diario */}
        {(analisisIA?.registroDiario?.habitos?.length ?? 0) > 0 && (
          <div style={{ marginBottom: 44, pageBreakBefore: 'always' }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Herramienta de seguimiento · 1
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 8, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Registro diario
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#555', marginBottom: 20 }}>
              Marca cada hábito al finalizar el día. Un ✓ si lo hiciste, una ✗ si no. Sin juicio — solo registro honesto.
            </p>
            {/* Tabla de hábitos */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#1a1a2e' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: '#e8c84a', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, width: '38%' }}>
                      Hábito mental
                    </th>
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                      <th key={d} style={{ textAlign: 'center', padding: '10px 8px', color: '#e8c84a', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analisisIA!.registroDiario.habitos.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e0e0e0', background: i % 2 === 0 ? '#fff' : '#faf8f3' }}>
                      <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: '#1a1a2e', fontSize: '0.82rem', marginBottom: 2 }}>{h.nombre}</div>
                        <div style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.5 }}>{h.descripcion}</div>
                      </td>
                      {[0,1,2,3,4,5,6].map(j => (
                        <td key={j} style={{ textAlign: 'center', padding: '12px 8px', color: '#ccc', fontSize: '1.1rem' }}>○</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#999', marginTop: 10, fontStyle: 'italic' }}>
              Imprime una tabla por semana. Guárdalas para ver tu evolución.
            </p>
          </div>
        )}

        {/* Autoevaluación semanal */}
        {(analisisIA?.autoevaluacionSemanal?.preguntas?.length ?? 0) > 0 && (
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#e8c84a', marginBottom: 8 }}>
              Herramienta de seguimiento · 2
            </div>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: 8, borderBottom: '2px solid #e8c84a', paddingBottom: 10 }}>
              Autoevaluación semanal
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#555', marginBottom: 20 }}>
              Cada domingo, dedica 10 minutos a responder estas preguntas. Puntúa del 1 al 10 y escribe una frase de reflexión.
            </p>
            {analisisIA!.autoevaluacionSemanal.preguntas.map((p, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e0e0e0', borderLeft: '4px solid #e8c84a', borderRadius: 6, padding: '16px 18px', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.68rem', fontWeight: 700, color: '#e8c84a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                  {p.area}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#1a1a2e', lineHeight: 1.7, marginBottom: 12 }}>{p.pregunta}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>Puntuación:</span>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <div key={n} style={{ width: 20, height: 20, border: '1px solid #ddd', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', color: '#bbb' }}>{n}</div>
                  ))}
                </div>
                <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: "'Montserrat',sans-serif", textTransform: 'uppercase', letterSpacing: 1 }}>Reflexión: </span>
                  <span style={{ fontSize: '0.75rem', color: '#ddd' }}>_______________________________________________</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cierre */}
        <div style={{ textAlign: 'center', borderTop: '2px solid #e8c84a', paddingTop: 36 }}>
          {analisisIA?.mensajeFinal && (
            <p style={{ fontSize: '0.95rem', color: '#333', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 20px', fontStyle: 'italic' }}>
              {analisisIA.mensajeFinal}
            </p>
          )}
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#1a1a2e', marginBottom: 10 }}>
            El campeón se construye desde adentro.
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            La Zona Campeón · lazonacampeon.com
          </p>
        </div>

      </div>
    </div>
  )
}
