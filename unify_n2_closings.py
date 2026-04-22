#!/usr/bin/env python3
"""
Unifica el cierre de los 5 manuales N2 para que todos coincidan con
el estilo de 01-espiral-negativa (fondo claro, centrado, padding amplio).
"""
import os, re

BASE = r'd:\automatizaciones\la-zona-campeon-web\public\n2-rev-c3a8f1'

# ─── CSS canónico de cierre (igual que espiral negativa) ─────────────────────
CLOSE_CSS = """    /* CIERRE */
    .close {
      padding: 70px 50px;
      text-align: center;
      background: #f5f0e8;
      border-top: 3px solid #C8AA32;
    }
    .close h2 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 30px;
      text-transform: uppercase;
      color: #2c2f3a;
      margin-bottom: 16px;
    }
    .close p {
      font-size: 15px;
      color: #555;
      line-height: 1.8;
      max-width: 500px;
      margin: 0 auto 20px;
    }
    .close p strong { color: #C8AA32; }
    .cta-btn {
      display: inline-block;
      background: #C8AA32;
      color: #1a1a2e;
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 13px;
      letter-spacing: 3px;
      text-transform: uppercase;
      padding: 16px 40px;
      border-radius: 8px;
      text-decoration: none;
    }
    .footer-brand {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #C8AA32;
      text-align: center;
      padding: 24px 30px;
      background: #2c2f3a;
    }"""

# ─── Contenido único por manual ──────────────────────────────────────────────
CLOSING_DATA = {
    '02-concentracion-bajo-presion.html': {
        'h2': 'El foco es<br>una decisión',
        'paras': [
            'La <strong>concentración bajo presión</strong> no depende del ambiente. Depende de lo que has entrenado antes de que llegue la presión.',
            'Conoce tus distractores. Mantente en tu <strong>zona de activación óptima</strong>. Usa las técnicas de foco en tiempo real. Construye tu rutina pre-competencia. Entrena el músculo de la atención.',
            '<strong>Tu juego cambia cuando tu mente cambia.</strong>',
        ],
        'plan_link': 'concentracion-4-semanas.html',
        'plan_label': 'Abrir el Plan de 4 Semanas →',
    },
    '03-confianza-autoestima.html': {
        'h2': 'La confianza es<br>una decisión diaria',
        'paras': [
            'No la decide el marcador. No la decide el entrenador. No la decide el rival. La construyes tú, en cada entrenamiento, en cada pensamiento, en cada momento en que eliges seguir trabajando cuando nadie te está mirando.',
            'Practica el <strong>diálogo interno positivo</strong>. Usa el <strong>historial de victorias</strong> cuando la duda aparezca. Actúa con confianza antes de sentirla.',
            '<strong>Tu juego cambia cuando tu mente cambia.</strong>',
        ],
        'plan_link': 'confianza-4-semanas.html',
        'plan_label': 'Abrir el Plan de 4 Semanas →',
    },
    '04-manejo-errores-fracasos.html': {
        'h2': 'El error no es el final.<br>Es el material.',
        'paras': [
            'Los mejores deportistas del mundo no son los que menos fallan. Son los que más rápido <strong>procesan el error y vuelven al juego</strong>.',
            'Ese tiempo de recuperación se entrena. Con el <strong>protocolo de reset</strong>, con la <strong>autoevaluación sin juicio</strong> y con la práctica diaria de soltarlo y seguir.',
            '<strong>Tu juego cambia cuando tu mente cambia.</strong>',
        ],
        'plan_link': 'errores-fracasos-4-semanas.html',
        'plan_label': 'Abrir el Plan de 4 Semanas →',
    },
    '05-liderazgo-comunicacion.html': {
        'h2': 'El liderazgo no espera<br>el momento perfecto',
        'paras': [
            'No esperes la banda, el título ni los años de experiencia. Empieza hoy con la conducta, la comunicación y la energía que tienes.',
            'El equipo que construyas desde adentro es el equipo que te va a <strong>sostener cuando más lo necesites</strong>. Ese liderazgo silencioso es el más poderoso.',
            '<strong>Tu juego cambia cuando tu mente cambia.</strong>',
        ],
        'plan_link': 'liderazgo-4-semanas.html',
        'plan_label': 'Abrir el Plan de 4 Semanas →',
    },
}


def build_closing_html(data):
    paras = '\n    '.join(f'<p>{p}</p>' for p in data['paras'])
    return f"""  <!-- CIERRE -->
  <div class="close">
    <div class="gold-line"></div>
    <h2>{data['h2']}</h2>
    {paras}
    <br>
    <a href="https://lazonacampeon.com/productos" class="cta-btn">Ver más manuales</a>
    <br><br>
    <p style="font-size:13px; color:#9090b0; max-width:420px; margin:0 auto 8px;">Antes de tu próximo partido, enciende tu mente con la <strong style="color:#C8AA32;">Frase Activadora del Día</strong>:</p>
    <a href="https://lazonacampeon.com/frases" target="_blank" style="color:#C8AA32; font-family:'Montserrat',sans-serif; font-weight:700; font-size:13px; letter-spacing:2px; text-decoration:none;">lazonacampeon.com/frases →</a>
    <br><br>
    <p style="font-size:13px; color:#606080;">¿Quieres ir al siguiente nivel? Explora los manuales específicos para tu posición en lazonacampeon.com</p>
  </div>

  <div style="background:#1a1a2e; border-radius:10px; padding:28px 30px; margin:40px 0; text-align:center;">
    <p style="color:#aaa; font-size:13px; margin-bottom:14px; letter-spacing:1px; text-transform:uppercase;">Tu plan de implementación</p>
    <a href="{data['plan_link']}" target="_blank" style="display:inline-block; background:#e8c84a; color:#1a1a2e; font-weight:bold; font-size:16px; padding:14px 32px; border-radius:8px; text-decoration:none; letter-spacing:0.5px;">{data['plan_label']}</a>
  </div>

  <div class="footer-brand">© La Zona Campeón — lazonacampeon.com</div>"""


def fix_css_02(c):
    """
    Manual 02 usa .close (como espiral) pero con fondo oscuro y colores dark.
    Reemplazamos el bloque CSS completo de .close + .footer-brand.
    """
    # Reemplazar toda la sección de CSS de CIERRE (inline, todo en una línea)
    c = re.sub(
        r'/\* CIERRE \*/\s*\.close \{[^}]*\}\s*\.close h2 \{[^}]*\}\s*\.close p \{[^}]*\}\s*\.close p strong \{[^}]*\}\s*\.cta-btn \{[^}]*\}\s*\.footer-brand \{[^}]*\}',
        CLOSE_CSS,
        c,
        count=1
    )
    return c


def fix_css_03_05(c):
    """
    Manuals 03-05 usan .closing (portero-template). Reemplazamos con .close CSS.
    """
    # Eliminar CSS de .closing (puede ser multilinea)
    c = re.sub(
        r'/\*[^*]*CIERRE[^*]*\*/\s*\.closing \{[^}]*\}(\s*\.closing h2 \{[^}]*\})?(\s*\.closing p \{[^}]*\})?(\s*\.closing \.url \{[^}]*\})?(\s*\.url \{[^}]*\})?',
        CLOSE_CSS,
        c,
        count=1
    )
    return c


def fix_html_02(c):
    """
    02 ya tiene estructura similar a espiral. Solo actualizar texto inline de color
    en p con color:#9090b0 si está como estilo inline y asegurar gold-line.
    """
    # Asegurar que tenga gold-line al inicio del .close
    if '<div class="close">\n    <div class="gold-line">' not in c and '<div class="close">\n  <div class="gold-line">' not in c:
        c = c.replace(
            '<div class="close">',
            '<div class="close">\n    <div class="gold-line"></div>'
        )
    # El footer-brand de 02 todavía tiene colores viejos — reemplazar toda la línea
    c = re.sub(
        r'<div class="footer-brand">[^<]*</div>',
        '<div class="footer-brand">© La Zona Campeón — lazonacampeon.com</div>',
        c
    )
    return c


def fix_html_03_05(c, data):
    """
    03-05: reemplazar bloque <!-- CIERRE -->...(plan block)...(footer) con estructura canónica.
    """
    new_html = build_closing_html(data)
    # Reemplazar desde <!-- CIERRE --> hasta el </div> del .closing, incluyendo el plan block y footer si existen
    c = re.sub(
        r'  <!-- CIERRE -->\s*\n  <div class="closing">.*?</div>\s*\n\n  <div style="background:#1a1a2e.*?</div>',
        new_html,
        c,
        count=1,
        flags=re.DOTALL
    )
    # Si no matcheó (no había plan block), intentar sin plan block
    if build_closing_html(data)[:30] not in c:
        c = re.sub(
            r'  <!-- CIERRE -->\s*\n  <div class="closing">.*?</div>',
            new_html,
            c,
            count=1,
            flags=re.DOTALL
        )
    return c


def process(fname):
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    if fname == '02-concentracion-bajo-presion.html':
        c = fix_css_02(c)
        c = fix_html_02(c)
    else:
        c = fix_css_03_05(c)
        c = fix_html_03_05(c, CLOSING_DATA[fname])

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'OK: {fname}')


for fname in CLOSING_DATA:
    process(fname)

print('\nListo.')
