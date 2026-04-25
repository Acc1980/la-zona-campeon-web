import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export const runtime = 'nodejs'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

const DORADO: [number, number, number] = [200, 170, 50]
const NEGRO: [number, number, number] = [30, 30, 45]
const GRIS: [number, number, number] = [100, 100, 110]
const BLANCO: [number, number, number] = [255, 255, 255]
const FONDO: [number, number, number] = [245, 244, 240]

function checkSecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret') || ''
  return secret === ADMIN_SECRET
}

function hexColor(color: [number, number, number]): string {
  return '#' + color.map(c => c.toString(16).padStart(2, '0')).join('')
}

function generatePDF(
  nombreAfiliado: string,
  handleTiktok: string,
  tipoCuenta: string,
  nombreRepresentante: string = 'Alexandra Cuartas'
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const W = 595
    const M = 42
    const TOP = 50   // espacio para header en páginas internas
    const BOT = 50   // espacio para footer

    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      bufferPages: true,
      autoFirstPage: false,
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('error', reject)

    const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

    function drawHeader() {
      doc.save()
      doc.rect(0, 0, W, 40).fill(hexColor(NEGRO))
      doc.fillColor(hexColor(DORADO)).fontSize(8).font('Helvetica-Bold')
        .text('LA ZONA CAMPEÓN  ·  Propuesta de Alianza Estratégica', 0, 15, { align: 'center', width: W })
      doc.restore()
    }

    function drawFooter(pageNum: number) {
      doc.save()
      const fy = doc.page.height - 38
      doc.moveTo(M, fy).lineTo(W - M, fy).strokeColor(hexColor(DORADO)).lineWidth(0.4).stroke()
      doc.fillColor(hexColor(GRIS)).fontSize(8).font('Helvetica-Oblique')
        .text(`lazonacampeon.com  ·  info@lazonacampeon.com  ·  Página ${pageNum}`, 0, fy + 8, { align: 'center', width: W })
      doc.restore()
    }

    // ── PORTADA ──────────────────────────────────────────────────────────────
    doc.addPage({ size: 'A4', margin: 0 })

    doc.rect(0, 0, W, 255).fill(hexColor(NEGRO))
    doc.rect(0, 255, W, 8).fill(hexColor(DORADO))

    doc.fillColor(hexColor(DORADO)).fontSize(28).font('Helvetica-Bold')
      .text('LA ZONA CAMPEÓN', 0, 50, { align: 'center', width: W })
    doc.fillColor('#c8c8c8').fontSize(11).font('Helvetica-Oblique')
      .text('Tu juego cambia cuando tu mente cambia.', 0, 88, { align: 'center', width: W })
    doc.fillColor(hexColor(BLANCO)).fontSize(18).font('Helvetica-Bold')
      .text('PROPUESTA DE ALIANZA', 0, 140, { align: 'center', width: W })
    doc.fillColor(hexColor(DORADO)).fontSize(18).font('Helvetica-Bold')
      .text('ESTRATÉGICA', 0, 165, { align: 'center', width: W })

    let dy = 280
    for (const [etiqueta, valor] of [
      ['PREPARADO PARA', nombreAfiliado],
      ['CUENTA', handleTiktok],
      ['PERFIL', tipoCuenta],
      ['FECHA', fecha],
    ]) {
      doc.fillColor(hexColor(GRIS)).fontSize(9).font('Helvetica-Bold').text(etiqueta, M, dy)
      doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica').text(valor, M + 140, dy)
      dy += 22
      doc.moveTo(M, dy - 4).lineTo(W - M, dy - 4).strokeColor('#dcd7c8').lineWidth(0.5).stroke()
    }

    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique')
      .text('Documento confidencial · lazonacampeon.com · info@lazonacampeon.com', M, 800, { align: 'center', width: W - M * 2 })

    // ── PÁGINAS DE CONTENIDO ─────────────────────────────────────────────────
    // Registrar header automático en cada nueva página
    doc.on('pageAdded', drawHeader)

    doc.addPage({ size: 'A4', margin: 0 })
    doc.x = M
    doc.y = TOP + 10

    function seccion(titulo: string) {
      if (doc.y > doc.page.height - BOT - 60) {
        doc.addPage({ size: 'A4', margin: 0 })
        doc.y = TOP + 10
      }
      doc.moveDown(0.4)
      doc.fillColor(hexColor(DORADO)).fontSize(10).font('Helvetica-Bold')
        .text(titulo.toUpperCase(), M, doc.y)
      doc.moveDown(0.2)
      doc.moveTo(M, doc.y).lineTo(W - M, doc.y).strokeColor(hexColor(DORADO)).lineWidth(0.3).stroke()
      doc.moveDown(0.4)
    }

    function campo(etiqueta: string, valor: string) {
      const y = doc.y
      doc.fillColor(hexColor(GRIS)).fontSize(9.5).font('Helvetica-Bold')
        .text(etiqueta + ':', M, y, { width: 130 })
      doc.fillColor(hexColor(NEGRO)).fontSize(9.5).font('Helvetica')
        .text(valor, M + 130, y, { width: W - M * 2 - 130 })
      doc.y = Math.max(doc.y, y + 16)
    }

    function parrafo(texto: string, size = 10) {
      doc.fillColor(hexColor(NEGRO)).fontSize(size).font('Helvetica')
        .text(texto, M, doc.y, { width: W - M * 2, lineGap: 2 })
      doc.moveDown(0.3)
    }

    function bullet(texto: string) {
      const bx = M
      const tx = M + 14
      doc.fillColor(hexColor(DORADO)).fontSize(10).font('Helvetica-Bold').text('•', bx, doc.y)
      const by = doc.y - doc.currentLineHeight()
      doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica')
        .text(texto, tx, by, { width: W - tx - M })
      doc.moveDown(0.2)
    }

    // 1. Las Partes
    seccion('1. Las Partes')
    campo('Plataforma', 'La Zona Campeón — Entrenamiento mental para deportistas')
    campo('Representante', nombreRepresentante)
    campo('Correo', 'info@lazonacampeon.com')
    campo('Web', 'lazonacampeon.com')
    doc.moveDown(0.3)
    campo('Afiliado', nombreAfiliado)
    campo('Cuenta TikTok', handleTiktok)
    campo('Perfil', tipoCuenta)

    // 2. Objeto
    seccion('2. Objeto')
    parrafo(`Las partes acuerdan una alianza de afiliación mediante la cual ${nombreAfiliado} promociona los productos de La Zona Campeón entre su comunidad a cambio de una comisión por ventas confirmadas, en los términos descritos en este documento.`)

    // 3. Productos
    seccion('3. Productos')
    const cols = [200, 90, 90, 79]
    const headers = ['Producto', 'Precio público', 'Precio afiliado', 'Descuento']
    const tableY = doc.y
    doc.rect(M, tableY, W - M * 2, 18).fill(hexColor(NEGRO))
    doc.fillColor(hexColor(DORADO)).fontSize(9).font('Helvetica-Bold')
    let cx = M
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], cx + 4, tableY + 5, { width: cols[i] - 4, align: i === 0 ? 'left' : 'center' })
      cx += cols[i]
    }
    let ry = tableY + 18
    for (const fila of [
      ['Manuales N2 — Entrenamiento Mental Base (×5)', '$9.99 USD', '$8.99 USD', '10%'],
      ['Manuales N3 — Por posición en fútbol (×6)', '$14.99 USD', '$13.49 USD', '10%'],
      ['Análisis Personalizado N4 con IA', '$29.99 USD', '$26.99 USD', '10%'],
    ]) {
      doc.rect(M, ry, W - M * 2, 18).fill(hexColor(FONDO))
      doc.fillColor(hexColor(NEGRO)).fontSize(9).font('Helvetica')
      cx = M
      for (let i = 0; i < fila.length; i++) {
        doc.text(fila[i], cx + 4, ry + 5, { width: cols[i] - 4, align: i === 0 ? 'left' : 'center' })
        cx += cols[i]
      }
      ry += 18
    }
    doc.y = ry + 4
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique')
      .text('* El descuento se aplica automáticamente al usar el link personalizado del afiliado.', M, doc.y)
    doc.moveDown(0.4)

    // 4. Términos
    seccion('4. Términos de la Alianza')
    for (const [titulo, desc] of [
      ['Link de afiliado', `La Zona Campeón entrega a ${nombreAfiliado} un link único y personalizado. Toda compra realizada a través de ese link queda registrada a su nombre de forma automática.`],
      ['Comisión', `${nombreAfiliado} recibe el 35% del valor neto de cada venta confirmada generada desde su link.`],
      ['Confirmación de venta', 'Una venta se considera confirmada transcurridos 8 días calendario desde la fecha de compra, en concordancia con la garantía de devolución de 7 días ofrecida a los clientes.'],
      ['Transparencia y seguimiento', `${nombreAfiliado} tiene acceso permanente a un panel en Google Sheets donde puede consultar en tiempo real: fecha de cada venta, producto vendido, valor, comisión generada y estado del pago.`],
      ['Pago de comisiones', 'Los pagos se realizan vía MercadoPago dentro de los 5 días hábiles siguientes a la confirmación de cada venta.'],
    ]) {
      doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica-Bold').text(titulo as string, M, doc.y)
      doc.moveDown(0.1)
      parrafo(desc as string, 9.5)
    }

    // 5. Compromisos
    seccion('5. Compromisos')
    doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica-Bold').text(`De ${nombreAfiliado}:`, M, doc.y)
    doc.moveDown(0.3)
    for (const c of [
      'Promocionar los productos de manera auténtica y honesta con su comunidad.',
      'No hacer afirmaciones sobre los productos que no estén respaldadas por el material oficial.',
      'Usar únicamente el link y materiales proporcionados por La Zona Campeón.',
    ]) bullet(c)

    doc.moveDown(0.3)
    doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica-Bold').text('De La Zona Campeón:', M, doc.y)
    doc.moveDown(0.3)
    for (const c of [
      'Proveer materiales de apoyo: imágenes, copies, acceso a productos de muestra.',
      'Mantener el panel de seguimiento actualizado en tiempo real.',
      'Realizar los pagos en los plazos acordados.',
      `Notificar a ${nombreAfiliado} con 15 días de anticipación cualquier cambio en las condiciones.`,
    ]) bullet(c)

    // 6. Vigencia
    seccion('6. Vigencia')
    parrafo('Esta alianza inicia en la fecha de firma y tiene una duración de 12 meses, con renovación automática salvo que cualquiera de las partes notifique su intención de no renovar con 30 días de anticipación. Cualquiera de las partes puede dar por terminado el acuerdo en cualquier momento con aviso de 15 días, sin penalización.')

    // 7. Firmas
    seccion('7. Firmas')
    parrafo('Las partes expresan su aceptación de los términos anteriores mediante su firma a continuación.')
    doc.moveDown(0.8)

    const fy = doc.y
    doc.moveTo(M, fy).lineTo(M + 200, fy).strokeColor(hexColor(DORADO)).lineWidth(0.4).stroke()
    doc.fillColor(hexColor(NEGRO)).fontSize(9).font('Helvetica-Bold').text(nombreRepresentante, M, fy + 4)
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique').text('La Zona Campeón', M, fy + 16)

    doc.moveTo(M + 280, fy).lineTo(M + 480, fy).strokeColor(hexColor(DORADO)).lineWidth(0.4).stroke()
    doc.fillColor(hexColor(NEGRO)).fontSize(9).font('Helvetica-Bold').text(nombreAfiliado, M + 280, fy + 4)
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique').text(tipoCuenta, M + 280, fy + 16)

    doc.moveDown(2.5)
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique')
      .text('Fecha de firma: ________________________     Fecha de firma: ________________________', M, doc.y, { align: 'center', width: W - M * 2 })

    // ── Footers en todas las páginas de contenido ────────────────────────────
    const range = doc.bufferedPageRange()
    for (let i = 1; i < range.count; i++) {
      doc.switchToPage(range.start + i)
      drawFooter(i)
    }

    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.end()
  })
}

export async function POST(req: NextRequest) {
  if (!checkSecret(req)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre_afiliado, handle_tiktok, tipo_cuenta, nombre_representante } = body

  if (!nombre_afiliado || !handle_tiktok || !tipo_cuenta) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const pdfBuffer = await generatePDF(nombre_afiliado, handle_tiktok, tipo_cuenta, nombre_representante)

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Propuesta Afiliado - ${nombre_afiliado}.pdf"`,
    },
  })
}
