#!/usr/bin/env python3
"""
Convierte los manuales N3 (lateral, mediocampista, extremo, delantero-centro)
al mismo estilo visual del portero y defensa central.
"""
import re

# CSS del portero para brand + cover (reemplaza el header azul/gradiente)
BRAND_COVER_CSS = """
    /* ── BRAND & COVER ── */
    .container { max-width: 780px; margin: 0 auto; padding: 48px 32px 80px; }

    .brand { text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #c8aa32; }
    .brand-name { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase; color: #c8aa32; margin-bottom: 4px; }
    .brand-tagline { font-family: 'Montserrat', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; }
    .level-badge { display: inline-block; margin-top: 16px; padding: 4px 14px; background: #c8aa32; color: #fff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; border-radius: 20px; }

    .cover { text-align: center; padding: 40px 0 48px; border-bottom: 1px solid #d4c99a; margin-bottom: 48px; }
    .manual-num { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #888; margin-bottom: 12px; }
    .cover h1 { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 42px; line-height: 1.1; color: #111; text-transform: uppercase; letter-spacing: -0.01em; margin-bottom: 8px; }
    .cover h1 span { color: #c8aa32; }
    .cover-sub { font-family: 'Montserrat', sans-serif; font-size: 14px; color: #555; letter-spacing: 0.05em; margin-top: 12px; margin-bottom: 32px; }
    .cover-desc { font-size: 15px; color: #444; max-width: 560px; margin: 0 auto 32px; line-height: 1.8; }
    .cover-stats { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
    .cover-stat span { display: block; font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: 26px; color: #c8aa32; }
    .cover-stat small { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; }
"""

# Datos específicos de cada manual
MANUALS = {
    '03-lateral.html': {
        'num': '03 de 06',
        'title_main': 'La Mente del',
        'title_span': 'Lateral',
        'sub': 'Fútbol · Lateral',
        'desc': 'Duelo defensivo, incorporación al ataque, recuperación de posición y la concentración de quien cubre un flanco entero durante noventa minutos.',
        'caps': '6',
    },
    '04-mediocampista.html': {
        'num': '04 de 06',
        'title_main': 'La Mente del',
        'title_span': 'Mediocampista',
        'sub': 'Fútbol · Mediocampista',
        'desc': 'Decisiones bajo presión, errores de pase, fatiga mental y la concentración que el partido exige durante noventa minutos.',
        'caps': '6',
    },
    '05-extremo.html': {
        'num': '05 de 06',
        'title_main': 'La Mente del',
        'title_span': 'Extremo',
        'sub': 'Fútbol · Extremo',
        'desc': 'Desborde, duelo 1v1, resiliencia después del fallo y la mentalidad de quien lo intenta una vez más.',
        'caps': '6',
    },
    '06-delantero-centro.html': {
        'num': '06 de 06',
        'title_main': 'La Mente del',
        'title_span': 'Delantero Centro',
        'sub': 'Fútbol · Delantero Centro',
        'desc': 'Sequías de gol, presión del equipo, instinto anotador y la mentalidad de quien vive para definir.',
        'caps': '6',
    },
}

def build_new_cover(data):
    return f"""<div class="brand">
    <div class="brand-name">La Zona Campeón</div>
    <div class="brand-tagline">Psicología Deportiva · Nivel 3</div>
    <span class="level-badge">Manuales por Posición</span>
  </div>

  <div class="cover">
    <div class="manual-num">Manual {data['num']}</div>
    <h1>{data['title_main']} <span>{data['title_span']}</span></h1>
    <div class="cover-sub">{data['sub']}</div>
    <p class="cover-desc">{data['desc']}</p>
    <div class="cover-stats">
      <div class="cover-stat"><span>{data['caps']}</span><small>Capítulos</small></div>
      <div class="cover-stat"><span>1</span><small>Posición</small></div>
    </div>
  </div>"""

def process(filepath, data):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Reemplazar la fuente (portero usa 900, lateral 800)
    c = c.replace("family=Montserrat:wght@400;600;700;800&family=Open+Sans:ital,wght@0,400;0,600;1,400",
                  "family=Montserrat:wght@400;600;700;900&family=Open+Sans:wght@400;600")

    # 2. Eliminar CSS de brand-header
    c = re.sub(r'\s*\.brand-header \{[^}]+\}', '', c)

    # 3. Reemplazar CSS de .cover (con gradiente) y .level-badge, .position-label, .subtitle
    # Insertar el nuevo CSS antes de .content o del siguiente bloque
    old_cover_css = re.search(
        r'\s*\.cover \{.*?\.cover \.subtitle \{.*?\}',
        c, re.DOTALL
    )
    if old_cover_css:
        c = c[:old_cover_css.start()] + '\n' + BRAND_COVER_CSS + c[old_cover_css.end():]

    # 4. Actualizar colores en todo el CSS y HTML
    c = c.replace('#e8c84a', '#c8aa32')
    c = c.replace('#16213e', '#2c2f3a')
    # Solo en chapter headers (no en reflection backgrounds que son dark)
    c = c.replace('color: #1a1a2e;', 'color: #2c2f3a;')
    c = c.replace('background: #1a1a2e;', 'background: #2c2f3a;')
    # Tabla headers
    c = c.replace('background: #1a1a2e\n', 'background: #2c2f3a\n')

    # 5. Reemplazar HTML del brand-header + cover
    # Patrón: <div class="brand-header">...</div> \n\n <!-- COVER --> \n <div class="cover">...</div>
    old_html = re.search(
        r'<div class="brand-header">.*?</div>\s*\n\s*(?:<!-- COVER -->\s*\n\s*)?<div class="cover">.*?</div>',
        c, re.DOTALL
    )
    if old_html:
        new_cover_html = '<div class="container">\n\n  ' + build_new_cover(data)
        c = c[:old_html.start()] + new_cover_html + c[old_html.end():]

    # 6. Renombrar <div class="content"> → quitar esa capa (ya estamos en .container)
    # Reemplazar <div class="content"> por vacío y ajustar el cierre
    c = c.replace('\n<div class="content">\n', '\n\n', 1)
    # El cierre: buscar el último </div> antes de </body> que corresponde a content
    # En el lateral el cierre es </div>\n\n</body>
    # Necesitamos agregar cierre de .container
    c = c.replace('\n</div>\n\n\n</body>', '\n\n</div><!-- /container -->\n\n</body>', 1)
    if '</div><!-- /container -->' not in c:
        c = c.replace('\n</div>\n\n</body>', '\n\n</div><!-- /container -->\n\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"OK: {filepath.split(chr(92))[-1]}")

base = r'd:\automatizaciones\la-zona-campeon-web\public\n3-pos-f4c9d2'

for filename, data in MANUALS.items():
    process(f'{base}\\{filename}', data)

print("\nListo.")
