#!/usr/bin/env python3
"""
Convierte las tablas de seguimiento de portero y defensa-central
al estilo del lateral: marco dorado, inputs, 7 filas, bordes verticales.
"""
import os, re

BASE = r'd:\automatizaciones\la-zona-campeon-web\public\n3-pos-f4c9d2'

# CSS a agregar (igual que lateral)
TRACKING_CSS = """    /* tracking */
    .tracking-section {
      background: #fff;
      border-radius: 10px;
      padding: 32px 30px;
      margin: 50px 0;
      border: 2px solid #c8aa32;
    }
    .tracking-section h2 {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.2rem;
      font-weight: 800;
      color: #2c2f3a;
      margin-bottom: 8px;
    }
    .tracking-section .track-desc {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 22px;
    }
    .tracking-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .tracking-table { width: 100%; min-width: 620px; border-collapse: collapse; font-size: 0.82rem; }
    .tracking-table th {
      background: #2c2f3a;
      border-right: 1px solid rgba(255,255,255,0.15);
      color: #c8aa32;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 11px 12px;
      text-align: left;
      white-space: normal;
      word-break: break-word;
    }
    .tracking-table th:last-child { border-right: none; }
    .tracking-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #ede7d8;
      border-right: 1px solid #ede7d8;
      vertical-align: middle;
      min-height: 48px;
    }
    .tracking-table td:last-child { border-right: none; }
    .tracking-table tr:nth-child(even) td { background: #faf6ee; }
    .tracking-table td.example { font-style: italic; color: #888; font-size: 0.82rem; }
    .tracking-note { font-size: 0.82rem; color: #888; margin-top: 14px; font-style: italic; }"""

INPUT_CELL = '<td><input type="text" style="width:100%;border:none;background:transparent;font-size:13px;padding:6px 4px;outline:none;font-family:inherit;min-height:40px;display:block;"></td>'

def input_row(ncols):
    return '        <tr>' + INPUT_CELL * ncols + '</tr>'

def build_tracking_html(title, desc, cols, example_row, note, n_rows=7):
    ncols = len(cols)
    headers = '\n          '.join(f'<th>{h}</th>' for h in cols)
    example = '\n          '.join(f'<td class="example">{v}</td>' for v in example_row)
    blank_rows = '\n'.join(input_row(ncols) for _ in range(n_rows))
    return f"""  <!-- DIARIO -->
  <div class="tracking-section">
    <h2>{title}</h2>
    <p class="track-desc">{desc}</p>
    <div class="tracking-table-wrap"><table class="tracking-table">
      <thead>
        <tr>
          {headers}
        </tr>
      </thead>
      <tbody>
        <tr>
          {example}
        </tr>
{blank_rows}
      </tbody>
    </table></div>
    <p class="tracking-note">{note}</p>
  </div>"""

MANUALS = {
    '01-portero.html': {
        'title': 'Diario del Portero',
        'desc': 'Llena esta tabla después de cada partido. Los patrones que más afectan tu rendimiento solo se ven cuando los registras.',
        'cols': ['Partido / Fecha', 'Situación crítica', 'Reacción inicial', 'Reset usado', 'Foco post-reset 1–10'],
        'example': ['Ej: vs. Atlético — 09/04', 'Gol encajado por mala salida (min. 34)', 'Cabeza baja, tensión en hombros', 'Toqué el poste, exhale, "quedan 56"', '8'],
        'note': 'Situaciones clave: gol encajado · penalti · salida fallida · grito del entrenador · error en el pase corto',
        'comment': '<!-- DIARIO DEL PORTERO -->',
    },
    '02-defensa-central.html': {
        'title': 'Diario del Defensa Central',
        'desc': 'Los patrones defensivos solo se ven cuando se registran. Llena esta tabla después de cada partido.',
        'cols': ['Partido / Fecha', 'Duelo / situación clave', 'Resultado', 'Estado mental', 'Lección concreta'],
        'example': ['Ej: vs. River — 10/04', '1v1 con el 9 en el min. 67', 'Gané el duelo, despejes', 'Concentrado, anticipé bien', 'Bajar la línea antes del córner'],
        'note': 'Situaciones clave: duelo 1v1 · error que cuesta gol · organización de línea · córner en contra · últimos 10 minutos',
        'comment': '<!-- DIARIO DEL DEFENSA -->',
    },
}

for fname, d in MANUALS.items():
    path = os.path.join(BASE, fname)
    with open(path, encoding='utf-8') as f:
        c = f.read()

    # 1. Add CSS before .closing or .divider CSS
    if '.tracking-section' not in c:
        c = c.replace('    .divider {', TRACKING_CSS + '\n\n    .divider {', 1)
        if '.tracking-section' not in c:  # fallback
            c = c.replace('    .closing {', TRACKING_CSS + '\n\n    .closing {', 1)

    # 2. Replace the entire tracking section HTML
    new_html = build_tracking_html(d['title'], d['desc'], d['cols'], d['example'], d['note'])
    c = re.sub(
        r'  ' + re.escape(d['comment']) + r'.*?</div>\s*\n  (?=<!-- CTA|<!-- CLOSING)',
        new_html + '\n\n  ',
        c,
        count=1,
        flags=re.DOTALL
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'OK: {fname}')

print('\nListo.')
