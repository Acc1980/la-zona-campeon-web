#!/usr/bin/env python3
"""
Unifica la sección final de los 6 manuales N3 al estilo del lateral:
  1. Bloque CTA "Plan de 4 Semanas" (dark, prominente) — PRIMERO
  2. .closing div con h2 + párrafos + url + frases + footer — DESPUÉS
"""
import os, re

BASE = r'd:\automatizaciones\la-zona-campeon-web\public\n3-pos-f4c9d2'

# CSS canónico para .closing (igual que lateral)
CLOSING_CSS_OLD_PATTERNS = [
    r'\.closing \{ text-align: center;[^}]+\}(\s*\.closing h2 \{[^}]+\})?(\s*\.closing p \{[^}]+\})?(\s*\.closing \.url \{[^}]+\})?',
]
CLOSING_CSS = """    .closing { text-align: center; padding: 40px 0; border-top: 2px solid #c8aa32; }
    .closing h2 { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 20px; text-transform: uppercase; color: #111; margin-bottom: 10px; }
    .closing p { color: #555; font-size: 14px; margin-bottom: 6px; }
    .closing .url { font-family: 'Montserrat', sans-serif; font-weight: 700; color: #c8aa32; font-size: 14px; letter-spacing: 0.05em; }"""

# Datos únicos por manual
MANUALS = {
    '01-portero.html': {
        'num': '01 de 06',
        'pos': 'Portero',
        'plan': 'portero-4-semanas.html',
        'h2': 'El arco es tuyo.<br>Defiéndelo con la mente primero.',
        'p1': 'La técnica te lleva al arco. La mentalidad te mantiene en él. Cada entrenamiento, cada ritual, cada reset después de un gol encajado es una decisión de seguir compitiendo. Esa decisión es tuya.',
        'p2': '',
    },
    '02-defensa-central.html': {
        'num': '02 de 06',
        'pos': 'Defensa Central',
        'plan': 'defensa-central-4-semanas.html',
        'h2': 'Defiende con la mente.<br>Gana con la calma.',
        'p1': 'La técnica te pone en posición. La anticipación te lleva al duelo con ventaja. Y la mentalidad te mantiene presente cuando el partido, el cansancio y la presión piden que te rindas. Eso se entrena. Empieza hoy.',
        'p2': '',
    },
    '03-lateral.html': {
        'num': '03 de 06',
        'pos': 'Lateral',
        'plan': 'lateral-4-semanas.html',
        'h2': 'Ida y vuelta, noventa minutos,<br>sin rendirse',
        'p1': 'Nadie más en el campo cubre lo que cubre un lateral. Nadie más exige tanto en las dos direcciones a la vez.',
        'p2': 'Ese trabajo —discreto, constante, sin glamour— es lo que sostiene el equipo. Y empieza por sostener tu propia cabeza durante noventa minutos.',
    },
    '04-mediocampista.html': {
        'num': '04 de 06',
        'pos': 'Mediocampista',
        'plan': 'mediocampista-4-semanas.html',
        'h2': 'La claridad que el equipo necesita<br>empieza en tu cabeza',
        'p1': 'Cuando el partido se desordena, el equipo mira al mediocampo. Lo que encuentre ahí —calma o caos— va a contagiarse.',
        'p2': 'Ese es el trabajo invisible del mediocampista: sostener la claridad por dentro para que el equipo pueda apoyarse en ella por fuera.',
    },
    '05-extremo.html': {
        'num': '05 de 06',
        'pos': 'Extremo',
        'plan': 'extremo-4-semanas.html',
        'h2': 'El siguiente intento siempre<br>vale más que el anterior',
        'p1': 'Un desborde fallado no define tu partido. Lo que defines tú es si vuelves a pedirlo.',
        'p2': 'Esa decisión —volver a intentarlo— es la que separa a los extremos que impactan de los que desaparecen cuando el partido se pone difícil.',
    },
    '06-delantero-centro.html': {
        'num': '06 de 06',
        'pos': 'Delantero Centro',
        'plan': 'delantero-centro-4-semanas.html',
        'h2': 'El próximo balón<br>siempre es nuevo',
        'p1': 'No puedes deshacer la oportunidad fallada. Sí puedes decidir qué haces con la siguiente.',
        'p2': 'Ese es el trabajo del delantero: estar listo para que cuando llegue el momento —aunque hayan pasado ochenta minutos esperando— tu mente ya haya tomado la decisión.',
    },
}


def build_end_html(d):
    p2_html = f'\n    <p>{d["p2"]}</p>' if d['p2'] else ''
    return f"""
  <!-- CTA PLAN 4 SEMANAS -->
  <div style="background:#1a1a2e; border-radius:10px; padding:28px 30px; margin:40px 0; text-align:center;">
    <p style="font-family:'Montserrat',sans-serif; font-size:10px; font-weight:800; letter-spacing:3px; text-transform:uppercase; color:rgba(245,240,232,0.5); margin-bottom:6px;">Herramienta incluida con tu manual</p>
    <h2 style="font-family:'Montserrat',sans-serif; font-size:1.2rem; font-weight:900; color:#f5f0e8; text-transform:uppercase; margin-bottom:10px;">Plan de 4 Semanas + Ficha de Partido</h2>
    <p style="font-size:0.88rem; color:rgba(245,240,232,0.75); max-width:460px; margin:0 auto 20px;">Un ejercicio por día durante 28 días para que los protocolos de este manual se vuelvan automáticos. Incluye Ficha de Partido imprimible para cada encuentro de la temporada.</p>
    <a href="{d['plan']}" target="_blank" style="display:inline-block; background:#c8aa32; color:#1a1a2e; font-family:'Montserrat',sans-serif; font-weight:900; font-size:0.88rem; letter-spacing:0.1em; text-transform:uppercase; padding:14px 32px; border-radius:8px; text-decoration:none;">Abrir el Plan de 4 Semanas &rarr;</a>
  </div>

  <!-- CLOSING -->
  <div class="closing">
    <h2>{d['h2']}</h2>
    <p>{d['p1']}</p>{p2_html}
    <p class="url"><a href="https://lazonacampeon.com" target="_blank" style="color:inherit; text-decoration:none;">lazonacampeon.com</a></p>
    <p style="margin-top:6px; font-size:13px; color:#888;">Frases activadoras diarias &rarr; <a href="https://lazonacampeon.com/frases" target="_blank" style="color:#C8AA32; font-family:'Montserrat',sans-serif; font-weight:700; font-size:13px; letter-spacing:2px; text-decoration:none;">lazonacampeon.com/frases &rarr;</a></p>
    <p style="margin-top:16px; font-size:13px; color:#888;">Manual {d['num']} &mdash; Nivel 3 &mdash; La Zona Campe&oacute;n &copy; 2025</p>
  </div>"""


def fix_closing_css(c):
    """Asegura que .closing CSS sea el canónico."""
    # Reemplazar .closing CSS (inline o multilinea)
    c = re.sub(
        r'\.closing \{[^}]+\}(\s*\.closing h2 \{[^}]+\})?(\s*\.closing p \{[^}]+\})?(\s*\.closing \.url \{[^}]+\})?',
        CLOSING_CSS,
        c,
        count=1
    )
    return c


def fix_closing_html(c, fname):
    d = MANUALS[fname]
    new_end = build_end_html(d)

    # Reemplazar todo desde <!-- CTA PLAN (o simple plan block) + closing div hasta el cierre
    # Patrón 1: ya tiene CTA PLAN + closing (lateral style)
    replaced = re.sub(
        r'\s*<!-- CTA PLAN 4 SEMANAS -->.*?</div>\s*\n\s*<!-- CLOSING -->\s*\n\s*<div class="closing">.*?</div>',
        new_end,
        c,
        count=1,
        flags=re.DOTALL
    )
    if replaced != c:
        return replaced

    # Patrón 2: closing first, then simple plan block (defensa central / portero style)
    replaced = re.sub(
        r'\s*<div class="closing">.*?</div>\s*\n\s*<div style="background:#1a1a2e.*?</div>',
        new_end,
        c,
        count=1,
        flags=re.DOTALL
    )
    if replaced != c:
        return replaced

    # Patrón 3: solo closing, sin plan block
    replaced = re.sub(
        r'\s*<div class="closing">.*?</div>',
        new_end,
        c,
        count=1,
        flags=re.DOTALL
    )
    return replaced


for fname in MANUALS:
    path = os.path.join(BASE, fname)
    with open(path, encoding='utf-8') as f:
        c = f.read()

    c = fix_closing_css(c)
    c = fix_closing_html(c, fname)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'OK: {fname}')

print('\nListo.')
