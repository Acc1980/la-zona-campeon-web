// node scripts/carta-baldo.js
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const DORADO = [200, 170, 50]
const NEGRO  = [30, 30, 45]
const GRIS   = [130, 130, 140]
const FONDO  = [245, 244, 240]

const W   = 595   // A4 width
const H   = 841   // A4 height
const M   = 52    // margen horizontal

function hex([r, g, b]) {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false })
const out  = path.join(__dirname, '..', 'Carta-Baldo-Garcia-Terroba.pdf')
doc.pipe(fs.createWriteStream(out))
doc.addPage({ size: 'A4', margin: 0 })

// ── BANDA SUPERIOR ────────────────────────────────────────────────────────────
doc.rect(0, 0, W, 38).fill(hex(NEGRO))
doc.rect(0, 38, W, 4).fill(hex(DORADO))

doc.fillColor(hex(DORADO)).fontSize(9).font('Helvetica-Bold')
  .text('LA ZONA CAMPEON', 0, 10, { align: 'center', width: W })
doc.fillColor('#aaaaaa').fontSize(7.5).font('Helvetica-Oblique')
  .text('Tu juego cambia cuando tu mente cambia.', 0, 23, { align: 'center', width: W })

// ── META ──────────────────────────────────────────────────────────────────────
let y = 56

doc.fillColor(hex(GRIS)).fontSize(8).font('Helvetica')
  .text('PARA:', M, y)
doc.fillColor(hex(NEGRO)).fontSize(8).font('Helvetica-Bold')
  .text('Baldo Garcia Terroba', M + 36, y)
doc.fillColor(hex(GRIS)).fontSize(8).font('Helvetica')
  .text('DE:', M + 200, y)
doc.fillColor(hex(NEGRO)).fontSize(8).font('Helvetica-Bold')
  .text('Alexandra Cuartas Cruz — La Zona Campeon', M + 218, y)
y += 13
doc.fillColor(hex(GRIS)).fontSize(8).font('Helvetica')
  .text('FECHA:', M, y)
doc.fillColor(hex(NEGRO)).fontSize(8).font('Helvetica')
  .text(fecha, M + 40, y)
y += 10
doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#cccccc').lineWidth(0.3).stroke()
y += 14

// ── ASUNTO ────────────────────────────────────────────────────────────────────
doc.fillColor(hex(NEGRO)).fontSize(12.5).font('Helvetica-Bold')
  .text('Oportunidad para tu comunidad — Oferta Manual por Posicion', M, y, { width: W - M * 2 })
y = doc.y + 4
doc.fillColor(hex(DORADO)).fontSize(9).font('Helvetica-Oblique')
  .text('Oferta por tiempo limitado · Hasta el 14 de mayo de 2026', M, y)
y += 16
doc.moveTo(M, y).lineTo(W - M, y).strokeColor(hex(DORADO)).lineWidth(0.5).stroke()
y += 16

// ── HELPERS ───────────────────────────────────────────────────────────────────
function seccion(titulo) {
  doc.fillColor(hex(DORADO)).fontSize(8).font('Helvetica-Bold')
    .text(titulo.toUpperCase(), M, y, { characterSpacing: 0.5 })
  y += 11
  doc.moveTo(M, y).lineTo(W - M, y).strokeColor(hex(DORADO)).lineWidth(0.25).stroke()
  y += 7
}

function parrafo(texto, size = 10) {
  doc.fillColor(hex(NEGRO)).fontSize(size).font('Helvetica')
    .text(texto, M, y, { width: W - M * 2, lineGap: 2.5 })
  y = doc.y + 5
}

function bullet(texto) {
  doc.fillColor(hex(DORADO)).fontSize(9.5).font('Helvetica-Bold').text('*', M, y)
  const by = y
  doc.fillColor(hex(NEGRO)).fontSize(10).font('Helvetica')
    .text(texto, M + 13, by, { width: W - M * 2 - 13, lineGap: 2 })
  y = doc.y + 4
}

// ── CUERPO ────────────────────────────────────────────────────────────────────
parrafo('Hola Baldo Garcia Terroba,')
parrafo('Arrancamos manana con una estrategia de ofertas mensuales en La Zona Campeon, y queria avisarte primero porque esto crea una oportunidad real para que la uses con tu comunidad.')
y += 6

seccion('Ajuste de precios')
parrafo('Para posicionar mejor la marca y que no se perciba como producto barato, actualizamos los precios:')
bullet('Manual General: $9.99 USD   >>   $12.99 USD')
bullet('Manual por Posicion: $14.99 USD   >>   $17.99 USD')
y += 8

seccion('La oportunidad — comienza manana')
parrafo('Lanzamos una oferta por tiempo limitado:')

doc.rect(M, y, W - M * 2, 30).fill('#1e2030')
doc.fillColor(hex(DORADO)).fontSize(10.5).font('Helvetica-Bold')
  .text('"Manual por Posicion: $14.99 USD hasta el 14 de mayo. Despues sube a $17.99 USD."',
    M + 12, y + 8, { width: W - M * 2 - 24, align: 'center' })
y += 38

parrafo('Tus referidos aplican su 10% de descuento adicional con tu link. Eso significa:')

// Tabla
const cols = [220, 130, 130]
const hdrs  = ['Producto', 'En oferta + tu link', 'Precio regular + tu link']
doc.rect(M, y, W - M * 2, 18).fill(hex(NEGRO))
doc.fillColor(hex(DORADO)).fontSize(8).font('Helvetica-Bold')
let cx = M
for (let i = 0; i < hdrs.length; i++) {
  doc.text(hdrs[i], cx + 4, y + 5, { width: cols[i] - 4, align: i === 0 ? 'left' : 'center' })
  cx += cols[i]
}
y += 18
doc.rect(M, y, W - M * 2, 18).fill(hex(FONDO))
doc.fillColor(hex(NEGRO)).fontSize(9).font('Helvetica')
const fila = ['Manual por Posicion', '$14.99 - 10% = $13.49 USD', '$17.99 - 10% = $16.19 USD']
cx = M
for (let i = 0; i < fila.length; i++) {
  doc.text(fila[i], cx + 4, y + 5, { width: cols[i] - 4, align: i === 0 ? 'left' : 'center' })
  cx += cols[i]
}
y += 24

parrafo('Tu comision sigue igual: 35% sobre cada venta que generes desde tu link.', 10)
y += 6

seccion('Por que esto es una oportunidad para ti')
bullet('Tus seguidores acceden a mejor precio que cualquier persona en redes')
bullet('Tienes un argumento fuerte: "consegui un descuento exclusivo para ustedes"')
bullet('Cada venta desde tu link = comision directa para ti')
bullet('Habra 2 o mas ofertas asi cada mes')
y += 8

seccion('Mi recomendacion')
parrafo('Esta primera oferta dura hasta el 14 de mayo. Es el momento perfecto para presentarle el manual a tu comunidad con el descuento de entrada. El argumento se vende solo.')
parrafo('Dudas o quieres que ajuste algo? Con gusto.')
y += 8

parrafo('Un abrazo,')
y += 6

// ── FIRMA ─────────────────────────────────────────────────────────────────────
doc.moveTo(M, y + 28).lineTo(M + 190, y + 28).strokeColor(hex(DORADO)).lineWidth(0.5).stroke()
doc.fillColor(hex(NEGRO)).fontSize(10).font('Helvetica-Bold').text('Alexandra Cuartas Cruz', M, y + 32)
doc.fillColor(hex(GRIS)).fontSize(8.5).font('Helvetica-Oblique').text('La Zona Campeon', M, y + 45)

// ── BANDA INFERIOR ────────────────────────────────────────────────────────────
doc.rect(0, H - 28, W, 4).fill(hex(DORADO))
doc.rect(0, H - 24, W, 24).fill(hex(NEGRO))
doc.fillColor(hex(GRIS)).fontSize(7.5).font('Helvetica-Oblique')
  .text('lazonacampeon.com  ·  info@lazonacampeon.com  ·  Documento confidencial', 0, H - 15, { align: 'center', width: W })

doc.on('end', () => console.log('PDF generado:', out))
doc.end()
