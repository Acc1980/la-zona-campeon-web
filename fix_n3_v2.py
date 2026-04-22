#!/usr/bin/env python3
"""
Fix 3 issues in N3 manuals (lateral, mediocampista, extremo, delantero-centro):
1. Remove leftover old cover content (position-label, old h1, old subtitle)
2. Fix flow-node boxes to equal height
3. Fix tracking table (column borders + blank cells → inputs)
"""
import re

BASE = r'd:\automatizaciones\la-zona-campeon-web\public\n3-pos-f4c9d2'

MANUALS = ['03-lateral.html', '04-mediocampista.html', '05-extremo.html', '06-delantero-centro.html']
MANUALS_NUM = {
    '03-lateral.html': '03 de 06',
    '04-mediocampista.html': '04 de 06',
    '05-extremo.html': '05 de 06',
    '06-delantero-centro.html': '06 de 06',
}

INPUT_CELL = '<td><input type="text" style="width:100%;border:none;background:transparent;font-size:13px;padding:6px 4px;outline:none;font-family:inherit;min-height:40px;display:block;"></td>'

def fix_file(fname):
    path = BASE + '\\' + fname
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # ── 1. Eliminar contenido duplicado del cover viejo ──────────────────────
    # Después del nuevo </div> del cover (que cierra cover-stats → cover → brand)
    # quedan: <div class="position-label">...</div>  <h1>...</h1>  <p class="subtitle">...</p>
    # seguido del cierre del viejo </div> (cover)
    c = re.sub(
        r'\s*<div class="position-label">[^<]*</div>\s*\n\s*<h1>La Mente del<br>[^<]*</h1>\s*\n\s*<p class="subtitle">[^<]*</p>\s*\n</div>',
        '',
        c
    )

    # ── 2. Igualar recuadros del ciclo (flow-node) ───────────────────────────
    # CSS actual: .flow-node { ... }  → agregar min-height y flex centering
    old_flow = '.flow-node {\n      background: #2c2f3a;\n      color: #f5f0e8;\n      border-radius: 8px;\n      padding: 14px 16px;\n      text-align: center;\n      min-width: 110px;\n    }'
    new_flow = '.flow-node {\n      background: #2c2f3a;\n      color: #f5f0e8;\n      border-radius: 8px;\n      padding: 14px 16px;\n      text-align: center;\n      min-width: 110px;\n      min-height: 100px;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n    }'
    if old_flow in c:
        c = c.replace(old_flow, new_flow)

    # También asegurar que flow-horizontal use align-items: stretch
    c = c.replace(
        '      align-items: stretch;\n      justify-content: center;\n      flex-wrap: wrap;',
        '      align-items: stretch;\n      justify-content: center;\n      flex-wrap: wrap;\n      row-gap: 12px;'
    )

    # ── 3. Arreglar tabla de tracking ────────────────────────────────────────
    # a) Bordes entre columnas
    if 'border-right: 1px solid #ede7d8' not in c:
        c = c.replace(
            '.tracking-table td {\n      padding: 12px 12px;\n      border-bottom: 1px solid #ede7d8;\n      vertical-align: top;\n    }',
            '.tracking-table td {\n      padding: 10px 12px;\n      border-bottom: 1px solid #ede7d8;\n      border-right: 1px solid #ede7d8;\n      vertical-align: middle;\n      min-height: 48px;\n    }\n    .tracking-table td:last-child { border-right: none; }'
        )
        c = c.replace(
            '      background: #2c2f3a;\n      color: #c8aa32;\n      font-family: \'Montserrat\', sans-serif;\n      font-size: 0.78rem;\n      font-weight: 700;\n      letter-spacing: 1px;\n      text-transform: uppercase;\n      padding: 11px 12px;\n      text-align: left;\n      white-space: nowrap;\n    }',
            '      background: #2c2f3a;\n      color: #c8aa32;\n      font-family: \'Montserrat\', sans-serif;\n      font-size: 0.78rem;\n      font-weight: 700;\n      letter-spacing: 1px;\n      text-transform: uppercase;\n      padding: 11px 12px;\n      text-align: left;\n      white-space: nowrap;\n      border-right: 1px solid rgba(255,255,255,0.15);\n    }\n    .tracking-table th:last-child { border-right: none; }'
        )

    # b) Reemplazar filas blank con inputs (5 columnas)
    blank_row_5 = '<tr><td class="blank">.</td><td class="blank">.</td><td class="blank">.</td><td class="blank">.</td><td class="blank">.</td></tr>'
    input_row_5 = '<tr>' + INPUT_CELL * 5 + '</tr>'
    c = c.replace(blank_row_5, input_row_5)

    # También para tablas de 4 columnas (por si acaso)
    blank_row_4 = '<tr><td class="blank">.</td><td class="blank">.</td><td class="blank">.</td><td class="blank">.</td></tr>'
    input_row_4 = '<tr>' + INPUT_CELL * 4 + '</tr>'
    c = c.replace(blank_row_4, input_row_4)

    # ── 4. Agregar frases activadoras en el closing ───────────────────────────
    # Reemplazar el párrafo final del closing viejo con el nuevo formato
    c = c.replace(
        '    <p style="margin-top:24px; font-family:\'Montserrat\',sans-serif; font-weight:700; color:#1a1a2e;">La Zona Campe\u00f3n \u00b7 lazonacampeon.com</p>\n  </div>',
        '    <p class="url"><a href="https://lazonacampeon.com" target="_blank" style="color:inherit; text-decoration:none;">lazonacampeon.com</a></p>\n    <p style="margin-top:6px; font-size:13px; color:#888;">Frases activadoras diarias &rarr; <a href="https://lazonacampeon.com/frases" target="_blank" style="color:inherit;">lazonacampeon.com/frases</a></p>\n    <p style="margin-top:16px; font-size:13px; color:#888;">Manual {num} &mdash; Nivel 3 &mdash; La Zona Campe&oacute;n &copy; 2025</p>\n  </div>'.format(num=MANUALS_NUM[fname])
    )

    # Agregar CSS .url si no existe aún
    if '.closing .url' not in c and "'.url {'" not in c:
        c = c.replace(
            '    .closing p {',
            "    .closing .url { font-family: 'Montserrat', sans-serif; font-weight: 700; color: #c8aa32; font-size: 14px; margin-bottom: 4px; }\n    .closing p {"
        )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'OK: {fname}')

for m in MANUALS:
    fix_file(m)

print('\nListo.')
