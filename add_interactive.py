#!/usr/bin/env python3
"""
Agrega interactividad a los manuales y planes de 4 semanas:
- Textareas debajo de cada pregunta en secciones .reflection
- Inputs inline en lugar de _______________ en ejercicios
- localStorage para persistir respuestas
"""

import os
import re

# CSS para agregar a los manuales
MANUAL_CSS = """
    /* ── INTERACTIVIDAD ── */
    .reflection-textarea {
      width: 100%;
      margin-top: 10px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(200,170,50,0.3);
      border-radius: 6px;
      color: #ddd;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      resize: vertical;
      min-height: 72px;
      box-sizing: border-box;
    }
    .reflection-textarea::placeholder { color: rgba(255,255,255,0.25); }
    .reflection-textarea:focus { outline: none; border-color: rgba(200,170,50,0.6); background: rgba(255,255,255,0.1); }

    .fill-blank {
      display: inline-block;
      border: none;
      border-bottom: 2px solid #c8aa32;
      background: transparent;
      color: #1a1a1a;
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      padding: 2px 6px;
      width: 180px;
      outline: none;
    }
    .fill-blank:focus { border-bottom-color: #a08020; background: rgba(200,170,50,0.08); }

    .exercise-textarea {
      width: 100%;
      margin-top: 10px;
      padding: 10px 14px;
      background: #fffef8;
      border: 1px solid #c8aa32;
      border-radius: 6px;
      color: #333;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      resize: vertical;
      min-height: 90px;
      box-sizing: border-box;
    }
    .exercise-textarea::placeholder { color: #bbb; }
    .exercise-textarea:focus { outline: none; border-color: #a08020; }
"""

# CSS para agregar a los planes de 4 semanas
PLAN_CSS = """
    /* ── INTERACTIVIDAD ── */
    .ficha-textarea {
      width: 100%;
      margin-top: 8px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(226,188,142,0.3);
      border-radius: 6px;
      color: #ddd;
      font-family: 'Open Sans', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      resize: vertical;
      min-height: 72px;
      box-sizing: border-box;
    }
    .ficha-textarea::placeholder { color: rgba(255,255,255,0.2); }
    .ficha-textarea:focus { outline: none; border-color: rgba(226,188,142,0.6); }
"""

LOCALSTORAGE_SCRIPT = """
<script>
(function() {{
  var KEY = '{storage_key}';
  function save() {{
    var data = {{}};
    document.querySelectorAll('textarea, input.fill-blank').forEach(function(el, i) {{
      data[i] = el.value;
    }});
    try {{ localStorage.setItem(KEY, JSON.stringify(data)); }} catch(e) {{}}
  }}
  function restore() {{
    var raw; try {{ raw = localStorage.getItem(KEY); }} catch(e) {{ return; }}
    if (!raw) return;
    var data = JSON.parse(raw);
    document.querySelectorAll('textarea, input.fill-blank').forEach(function(el, i) {{
      if (data[i] !== undefined) el.value = data[i];
    }});
  }}
  document.addEventListener('DOMContentLoaded', function() {{
    restore();
    document.querySelectorAll('textarea, input.fill-blank').forEach(function(el) {{
      el.addEventListener('input', save);
    }});
  }});
}})();
</script>
"""

def get_storage_key(filepath):
    """Genera clave única basada en el nombre del archivo."""
    basename = os.path.basename(filepath).replace('.html', '').replace('-', '_')
    folder = os.path.basename(os.path.dirname(filepath))
    return f"lzc_{folder}_{basename}"

def process_manual(filepath):
    """Procesa un manual: agrega textareas en reflexiones e inputs en ejercicios."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Verificar que no se haya procesado antes
    if 'reflection-textarea' in content:
        print(f"  SKIP (ya procesado): {os.path.basename(filepath)}")
        return

    # 1. Agregar CSS antes del cierre de </style>
    content = content.replace('</style>', MANUAL_CSS + '\n  </style>', 1)

    # 2. Agregar textarea debajo de cada <li> dentro de secciones .reflection
    # Busca el patrón: <li>texto de pregunta</li>  (solo en contexto reflection)
    # Usamos un enfoque de procesamiento por secciones

    # Encontrar todas las secciones reflection y procesarlas
    def add_textareas_to_reflection(match):
        block = match.group(0)
        # Agregar textarea después de cada </li> dentro de la reflexión
        # pero solo los <li> que tienen preguntas (no los de listas de puntos)
        def replace_li(m):
            li_content = m.group(1)
            # Solo si el li contiene una pregunta (tiene ¿ o es suficientemente largo)
            if '¿' in li_content or len(li_content) > 40:
                placeholder = 'Escribe tu respuesta aquí...'
                return f'<li>{li_content}<br><textarea class="reflection-textarea" placeholder="{placeholder}" rows="3"></textarea></li>'
            return m.group(0)
        block = re.sub(r'<li>(.*?)</li>', replace_li, block, flags=re.DOTALL)
        return block

    content = re.sub(
        r'<div class="reflection">.*?</div>\s*</div>',
        add_textareas_to_reflection,
        content,
        flags=re.DOTALL
    )

    # 3. Reemplazar _______________ con inputs fill-blank
    content = re.sub(
        r'_______________+',
        '<input type="text" class="fill-blank" placeholder="Tu respuesta...">',
        content
    )

    # 4. Para ejercicios con lista de viñetas sin input (ej: banco de confianza)
    # Detectar <ul> dentro de .exercise seguido de <li>¿... y agregar textarea al final
    def add_exercise_textarea(match):
        block = match.group(0)
        if '¿' in block and 'exercise-textarea' not in block and 'fill-blank' not in block:
            # Buscar el </ul> del ejercicio y agregar textareas para respuesta libre
            # Agregamos un textarea de respuesta libre al final del exercise
            # Para ejercicios tipo "banco de confianza" con 5 momentos
            if 'momentos' in block or 'Escribe' in block or 'anota' in block:
                block = block.replace(
                    '</div>',
                    '\n      <textarea class="exercise-textarea" placeholder="Escribe aquí tus respuestas..." rows="8"></textarea>\n    </div>',
                    1  # solo el primer </div> al final
                )
        return block

    content = re.sub(
        r'<div class="exercise">.*?</div>\s*</div>',
        add_exercise_textarea,
        content,
        flags=re.DOTALL
    )

    # 5. Agregar script localStorage antes de </body>
    storage_key = get_storage_key(filepath)
    script = LOCALSTORAGE_SCRIPT.format(storage_key=storage_key)
    content = content.replace('</body>', script + '\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  OK: {os.path.basename(filepath)}")

def process_plan(filepath):
    """Procesa un plan de 4 semanas: agrega localStorage para checkboxes y fichas."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Verificar que no se haya procesado antes
    if "'lzc_" in content and 'localStorage' in content:
        print(f"  SKIP (ya procesado): {os.path.basename(filepath)}")
        return

    # 1. Agregar CSS si hay fichas con textarea
    if 'ficha-textarea' not in content:
        content = content.replace('</style>', PLAN_CSS + '\n  </style>', 1)

    # 2. Agregar script localStorage (maneja checkboxes + textarea + inputs)
    storage_key = get_storage_key(filepath)

    # Script especial para planes que también guarda checkboxes
    plan_script = """
<script>
(function() {{
  var KEY = '{key}';
  function save() {{
    var data = {{ checks: {{}}, texts: {{}} }};
    document.querySelectorAll('input[type="checkbox"].day-check').forEach(function(el, i) {{
      data.checks[i] = el.checked;
    }});
    document.querySelectorAll('textarea, input[type="text"]').forEach(function(el, i) {{
      data.texts[i] = el.value;
    }});
    try {{ localStorage.setItem(KEY, JSON.stringify(data)); }} catch(e) {{}}
  }}
  function restore() {{
    var raw; try {{ raw = localStorage.getItem(KEY); }} catch(e) {{ return; }}
    if (!raw) return;
    var data = JSON.parse(raw);
    if (data.checks) {{
      document.querySelectorAll('input[type="checkbox"].day-check').forEach(function(el, i) {{
        if (data.checks[i] !== undefined) el.checked = data.checks[i];
      }});
    }}
    if (data.texts) {{
      document.querySelectorAll('textarea, input[type="text"]').forEach(function(el, i) {{
        if (data.texts[i] !== undefined) el.value = data.texts[i];
      }});
    }}
  }}
  document.addEventListener('DOMContentLoaded', function() {{
    restore();
    document.querySelectorAll('input[type="checkbox"].day-check').forEach(function(el) {{
      el.addEventListener('change', save);
    }});
    document.querySelectorAll('textarea, input[type="text"]').forEach(function(el) {{
      el.addEventListener('input', save);
    }});
  }});
}})();
</script>
""".format(key=storage_key)

    content = content.replace('</body>', plan_script + '\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  OK: {os.path.basename(filepath)}")

def main():
    base = r'd:\automatizaciones\la-zona-campeon-web\public'

    n3_dir = os.path.join(base, 'n3-pos-f4c9d2')
    n2_dir = os.path.join(base, 'n2-rev-c3a8f1')

    print("\n=== Procesando manuales N3 ===")
    for f in sorted(os.listdir(n3_dir)):
        if f.startswith('0') and f.endswith('.html'):
            process_manual(os.path.join(n3_dir, f))

    print("\n=== Procesando manuales N2 ===")
    for f in sorted(os.listdir(n2_dir)):
        if f.startswith('0') and f.endswith('.html'):
            process_manual(os.path.join(n2_dir, f))

    print("\n=== Procesando planes 4 semanas N3 ===")
    for f in sorted(os.listdir(n3_dir)):
        if f.endswith('-4-semanas.html'):
            process_plan(os.path.join(n3_dir, f))

    print("\n=== Procesando planes 4 semanas N2 ===")
    for f in sorted(os.listdir(n2_dir)):
        if f.endswith('-4-semanas.html'):
            process_plan(os.path.join(n2_dir, f))

    print("\n✓ Listo.")

if __name__ == '__main__':
    main()
