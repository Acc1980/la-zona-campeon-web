#!/usr/bin/env python3
"""
Unifica diseño N2:
- Portada oscura (dark blue gradient) en 03, 04, 05 (igual que espiral negativa)
- Cierre claro/cream en 01 y 02 (quitar azul oscuro del closing)
"""
import re, os

BASE = r'd:\automatizaciones\la-zona-campeon-web\public\n2-rev-c3a8f1'

# ── CSS para portada oscura (igual que espiral negativa) ──────────────────────
DARK_COVER_CSS = """
    /* PORTADA */
    .cover {
      min-height: 100vh;
      background: linear-gradient(160deg, #1a1a2e 0%, #2c2f3a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 40px;
      position: relative;
      border-bottom: 4px solid #C8AA32;
    }
    .cover-logo {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 13px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #C8AA32;
      margin-bottom: 60px;
      opacity: 0.9;
    }
    .cover-tag {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #C8AA32;
      background: rgba(200, 170, 50, 0.12);
      border: 1px solid rgba(200, 170, 50, 0.35);
      padding: 8px 20px;
      border-radius: 30px;
      margin-bottom: 30px;
    }
    .cover h1 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 52px;
      line-height: 1.1;
      text-transform: uppercase;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .cover h1 span { color: #C8AA32; }
    .cover-sub {
      font-size: 16px;
      color: #9090b0;
      max-width: 480px;
      line-height: 1.7;
      margin-bottom: 50px;
    }
    .gold-line {
      width: 60px;
      height: 3px;
      background: #C8AA32;
      margin: 0 auto 40px;
    }
    .cover-promise {
      background: rgba(200, 170, 50, 0.1);
      border: 1px solid rgba(200, 170, 50, 0.25);
      border-radius: 12px;
      padding: 24px 32px;
      max-width: 480px;
      font-size: 14px;
      color: #b0b0cc;
      line-height: 1.8;
      font-style: italic;
    }
    .cover-promise strong { color: #C8AA32; font-style: normal; }
"""

# Datos de portada para cada manual
COVER_DATA = {
    '03-confianza-autoestima.html': {
        'tag': 'Manual 03 de 05 &mdash; Nivel 2',
        'h1': 'Confianza y<br><span>Autoestima</span><br>Deportiva',
        'sub': 'Construye una confianza que no depende de los resultados',
        'promise': 'La duda puede destruir a un deportista antes de que el rival haga nada. Este manual te enseña a construir una <strong>confianza sólida</strong>, que no se desmorona con una racha mala o una crítica.',
    },
    '04-manejo-errores-fracasos.html': {
        'tag': 'Manual 04 de 05 &mdash; Nivel 2',
        'h1': 'Manejo de<br><span>Errores</span><br>y Fracasos',
        'sub': 'Procesa rápido, aprende y vuelve al juego',
        'promise': 'El error no te destruye. Lo que te destruye es cómo reaccionas a él. Este manual te enseña a <strong>procesar los errores en tiempo real</strong> y a usar el fracaso como combustible.',
    },
    '05-liderazgo-comunicacion.html': {
        'tag': 'Manual 05 de 05 &mdash; Nivel 2',
        'h1': 'Liderazgo y<br><span>Comunicación</span><br>en Equipo',
        'sub': 'Influye positivamente sin necesitar la banda de campeón',
        'promise': 'El liderazgo no lo da el puesto. Lo da la forma en que te comportas cuando el partido se complica, cuando un compañero falla, cuando el equipo necesita <strong>energía y dirección</strong>.',
    },
}

def build_new_cover_html(data):
    return f"""  <!-- PORTADA -->
  <div class="cover">
    <div class="cover-logo">La Zona Campeón</div>
    <div class="cover-tag">{data['tag']}</div>
    <h1>{data['h1']}</h1>
    <div class="gold-line"></div>
    <p class="cover-sub">{data['sub']}</p>
    <div class="cover-promise">
      <strong>Lo que encontrarás aquí:</strong><br>
      {data['promise']}
    </div>
  </div>"""

def convert_to_dark_cover(fname, data):
    """03, 04, 05: reemplazar portada clara por portada oscura."""
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Reemplazar CSS de portada: la portada actual tiene .cover sin background
    # Buscar y reemplazar el bloque CSS de .cover
    c = re.sub(
        r'(/\*[^*]*\*/\s*)?\s*\.cover \{[^}]*\}(\s*\.manual-num \{[^}]*\})?(\s*\.cover h1 \{[^}]*\})?(\s*\.cover h1 span \{[^}]*\})?(\s*\.cover-sub \{[^}]*\})?(\s*\.cover-desc \{[^}]*\})?(\s*\.cover-stats \{[^}]*\})?(\s*\.cover-stat span \{[^}]*\})?(\s*\.cover-stat small \{[^}]*\})?',
        '\n' + DARK_COVER_CSS,
        c,
        count=1
    )

    # Asegurar que gold-line CSS exista
    if '.gold-line' not in c:
        pass  # ya está en DARK_COVER_CSS

    # 2. Reemplazar HTML de la portada
    c = re.sub(
        r'<!-- PORTADA -->.*?<div class="cover">.*?</div>\s*(?=\n\s*<!--)',
        build_new_cover_html(data) + '\n\n',
        c,
        count=1,
        flags=re.DOTALL
    )
    # Si el patrón anterior no matchea, intentar más simple
    if build_new_cover_html(data)[:30] not in c:
        c = re.sub(
            r'<div class="cover">.*?</div>\s*(?=\n\s*<div)',
            build_new_cover_html(data) + '\n\n',
            c,
            count=1,
            flags=re.DOTALL
        )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'  cover OK: {fname}')

def lighten_closing(fname):
    """01, 02: cambiar el cierre de azul oscuro a claro."""
    path = os.path.join(BASE, fname)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # CSS del cierre: cambiar de dark a light
    c = c.replace(
        '      background: linear-gradient(160deg, #2c2f3a 0%, #1a1a2e 100%);\n    }',
        '      background: #f5f0e8;\n      border-top: 3px solid #C8AA32;\n    }',
    )
    c = c.replace(
        'background: linear-gradient(160deg, #2c2f3a 0%, #1a1a2e 100%);',
        'background: #f5f0e8; border-top: 3px solid #C8AA32;',
    )

    # Texto del h2: de blanco a oscuro
    c = c.replace(
        '      color: #ffffff;\n      margin-bottom: 16px;\n    }\n\n    .close p {\n      font-size: 15px;\n      color: #9090b0;',
        '      color: #2c2f3a;\n      margin-bottom: 16px;\n    }\n\n    .close p {\n      font-size: 15px;\n      color: #555;',
    )

    # strong dentro del cierre: mantener dorado
    # Ya tiene .close p strong { color: #C8AA32; } — no cambiar

    # footer-brand: de azul oscuro a claro
    c = c.replace(
        '      color: rgba(200,170,50,0.5);\n      text-align: center;\n      padding: 30px;\n      background: #1a1a2e;',
        '      color: #C8AA32;\n      text-align: center;\n      padding: 24px 30px;\n      background: #2c2f3a;',
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'  closing OK: {fname}')

print('=== Convirtiendo portadas (03, 04, 05) ===')
for fname, data in COVER_DATA.items():
    convert_to_dark_cover(fname, data)

print('\n=== Aclarando cierres (01, 02) ===')
for fname in ['01-espiral-negativa.html', '02-concentracion-bajo-presion.html']:
    lighten_closing(fname)

print('\nListo.')
