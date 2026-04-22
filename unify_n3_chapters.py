import re

NEW_CHAPTER_CSS = """    .chapter-number {
      font-family: 'Montserrat', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #c8aa32;
      margin-bottom: 6px;
    }
    .chapter h2 {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      color: #2c2f3a;
      margin-bottom: 20px;
      border-bottom: 2px solid #c8aa32;
      padding-bottom: 10px;
    }
    .chapter p { margin-bottom: 16px; color: #333; font-size: 15px; }
    .chapter strong { color: #111; }"""

# CSS patterns to replace (portero uses multiline, defensa uses single-line)
CSS_PATTERN = re.compile(
    r'\.chapter-header\s*\{[^}]*\}\s*'
    r'\.chapter-num\s*\{[^}]*\}\s*'
    r'\.chapter-title\s*\{[^}]*\}\s*'
    r'\.chapter-body p\s*\{[^}]*\}\s*'
    r'\.chapter-body strong\s*\{[^}]*\}',
    re.DOTALL
)

# HTML chapter-header pattern -> new format
CHAPTER_HEADER_PATTERN = re.compile(
    r'<div class="chapter-header">\s*'
    r'<div class="chapter-num">(\d+)</div>\s*'
    r'<div class="chapter-title">(.*?)</div>\s*'
    r'</div>\s*'
    r'<div class="chapter-body">',
    re.DOTALL
)

def replace_header(m):
    num = int(m.group(1))
    title = m.group(2).strip()
    return f'<p class="chapter-number">Capítulo {num}</p>\n    <h2>{title}</h2>'

files = [
    "d:/automatizaciones/la-zona-campeon-web/public/n3-pos-f4c9d2/01-portero.html",
    "d:/automatizaciones/la-zona-campeon-web/public/n3-pos-f4c9d2/02-defensa-central.html",
]

for path in files:
    with open(path, encoding='utf-8') as f:
        content = f.read()

    # 1. Replace CSS
    new_content = CSS_PATTERN.sub(NEW_CHAPTER_CSS, content)
    if new_content == content:
        print(f"WARNING: CSS pattern not found in {path}")
    else:
        print(f"CSS replaced in {path}")

    # 2. Replace chapter-header HTML
    new_content, n = CHAPTER_HEADER_PATTERN.subn(replace_header, new_content)
    print(f"  {n} chapter headers replaced")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Done.")
