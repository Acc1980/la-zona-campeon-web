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

function rgb(doc: PDFKit.PDFDocument, color: [number, number, number]) {
  return `rgb(${color[0]},${color[1]},${color[2]})`
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
    const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const W = doc.page.width   // 595
    const M = 42               // margen lateral
    const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

    // ── PORTADA ──────────────────────────────────────────────────────────────
    // Fondo negro superior
    doc.rect(0, 0, W, 255).fill(hexColor(NEGRO))
    // Franja dorada
    doc.rect(0, 255, W, 8).fill(hexColor(DORADO))

    // Título principal
    doc.fillColor(hexColor(DORADO)).fontSize(28).font('Helvetica-Bold')
      .text('LA ZONA CAMPEÓN', 0, 50, { align: 'center', width: W })

    doc.fillColor('#c8c8c8').fontSize(11).font('Helvetica-Oblique')
      .text('Tu juego cambia cuando tu mente cambia.', 0, 88, { align: 'center', width: W })

    doc.fillColor(hexColor(BLANCO)).fontSize(18).font('Helvetica-Bold')
      .text('PROPUESTA DE ALIANZA', 0, 140, { align: 'center', width: W })
    doc.fillColor(hexColor(DORADO)).fontSize(18).font('Helvetica-Bold')
      .text('ESTRATÉGICA', 0, 165, { align: 'center', width: W })

    // Datos en portada
    const datosY = 280
    const labelX = M
    const valorX = M + 140
    const datos = [
      ['PREPARADO PARA', nombreAfiliado],
      ['CUENTA', handleTiktok],
      ['PERFIL', tipoCuenta],
      ['FECHA', fecha],
    ]
    let dy = datosY
    for (const [etiqueta, valor] of datos) {
      doc.fillColor(hexColor(GRIS)).fontSize(9).font('Helvetica-Bold')
        .text(etiqueta, labelX, dy)
      doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica')
        .text(valor, valorX, dy)
      dy += 22
      doc.moveTo(M, dy - 4).lineTo(W - M, dy - 4)
        .strokeColor('#dcd7c8').lineWidth(0.5).stroke()
    }

    // Pie de portada
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique')
      .text('Documento confidencial · lazonacampeon.com · info@lazonacampeon.com', M, 800, { align: 'center', width: W - M * 2 })

    // ── PÁGINA DE CONTENIDO ───────────────────────────────────────────────────
    doc.addPage({ margin: 0 })

    // Header páginas internas
    function drawHeader() {
      doc.rect(0, 0, W, 40).fill(hexColor(NEGRO))
      doc.fillColor(hexColor(DORADO)).fontSize(8).font('Helvetica-Bold')
        .text('LA ZONA CAMPEÓN  ·  Propuesta de Alianza Estratégica', 0, 15, { align: 'center', width: W })
    }

    function drawFooter(pageNum: number) {
      const fy = doc.page.height - 40
      doc.moveTo(M, fy).lineTo(W - M, fy).strokeColor(hexColor(DORADO)).lineWidth(0.4).stroke()
      doc.fillColor(hexColor(GRIS)).fontSize(8).font('Helvetica-Oblique')
        .text(`lazonacampeon.com  ·  info@lazonacampeon.com  ·  Página ${pageNum}`, 0, fy + 8, { align: 'center', width: W })
    }

    function tituloSeccion(texto: string, y: number): number {
      doc.fillColor(hexColor(DORADO)).fontSize(10).font('Helvetica-Bold')
        .text(texto.toUpperCase(), M, y)
      const newY = y + 16
      doc.moveTo(M, newY).lineTo(W - M, newY).strokeColor(hexColor(DORADO)).lineWidth(0.3).stroke()
      return newY + 8
    }

    function campoDato(etiqueta: string, valor: string, y: number): number {
      doc.fillColor(hexColor(GRIS)).fontSize(9.5).font('Helvetica-Bold').text(etiqueta + ':', M, y, { continued: false, width: 130 })
      doc.fillColor(hexColor(NEGRO)).fontSize(9.5).font('Helvetica').text(valor, M + 130, y, { width: W - M * 2 - 130 })
      return y + 16
    }

    function parrafo(texto: string, y: number, size = 10): number {
      doc.fillColor(hexColor(NEGRO)).fontSize(size).font('Helvetica').text(texto, M, y, { width: W - M * 2, lineGap: 2 })
      return doc.y + 6
    }

    drawHeader()
    let y = 55

    // 1. Las Partes
    y = tituloSeccion('1. Las Partes', y)
    y = campoDato('Plataforma', 'La Zona Campeón — Entrenamiento mental para deportistas', y)
    y = campoDato('Representante', nombreRepresentante, y)
    y = campoDato('Correo', 'info@lazonacampeon.com', y)
    y = campoDato('Web', 'lazonacampeon.com', y)
    y += 8
    y = campoDato('Afiliado', nombreAfiliado, y)
    y = campoDato('Cuenta TikTok', handleTiktok, y)
    y = campoDato('Perfil', tipoCuenta, y)

    // 2. Objeto
    y = tituloSeccion('2. Objeto', y + 6)
    y = parrafo(
      `Las partes acuerdan una alianza de afiliación mediante la cual ${nombreAfiliado} promociona los productos de La Zona Campeón entre su comunidad a cambio de una comisión por ventas confirmadas, en los términos descritos en este documento.`,
      y
    )

    // 3. Productos
    y = tituloSeccion('3. Productos', y + 4)

    // Encabezado tabla
    doc.rect(M, y, W - M * 2, 18).fill(hexColor(NEGRO))
    doc.fillColor(hexColor(DORADO)).fontSize(9).font('Helvetica-Bold')
    const cols = [200, 90, 90, 79]
    const headers = ['Producto', 'Precio público', 'Precio afiliado', 'Descuento']
    let cx = M
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], cx + 4, y + 5, { width: cols[i] - 4, align: i === 0 ? 'left' : 'center' })
      cx += cols[i]
    }
    y += 18

    const filas = [
      ['Manuales N2 — Entrenamiento Mental Base (×5)', '$9.99 USD', '$8.99 USD', '10%'],
      ['Manuales N3 — Por posición en fútbol (×6)', '$14.99 USD', '$13.49 USD', '10%'],
      ['Análisis Personalizado N4 con IA', '$29.99 USD', '$26.99 USD', '10%'],
    ]
    for (const fila of filas) {
      doc.rect(M, y, W - M * 2, 18).fill(hexColor(FONDO))
      doc.fillColor(hexColor(NEGRO)).fontSize(9).font('Helvetica')
      cx = M
      for (let i = 0; i < fila.length; i++) {
        doc.text(fila[i], cx + 4, y + 5, { width: cols[i] - 4, align: i === 0 ? 'left' : 'center' })
        cx += cols[i]
      }
      y += 18
    }
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique')
      .text('* El descuento se aplica automáticamente al usar el link personalizado del afiliado.', M, y + 4)
    y += 20

    // 4. Términos
    y = tituloSeccion('4. Términos de la Alianza', y + 4)
    const terminos = [
      ['Link de afiliado', `La Zona Campeón entrega a ${nombreAfiliado} un link único y personalizado. Toda compra realizada a través de ese link queda registrada a su nombre de forma automática.`],
      ['Comisión', `${nombreAfiliado} recibe el 35% del valor neto de cada venta confirmada generada desde su link.`],
      ['Confirmación de venta', 'Una venta se considera confirmada transcurridos 8 días calendario desde la fecha de compra, en concordancia con la garantía de devolución de 7 días ofrecida a los clientes.'],
      ['Transparencia y seguimiento', `${nombreAfiliado} tiene acceso permanente a un panel en Google Sheets donde puede consultar en tiempo real: fecha de cada venta, producto vendido, valor, comisión generada y estado del pago.`],
      ['Pago de comisiones', 'Los pagos se realizan vía MercadoPago dentro de los 5 días hábiles siguientes a la confirmación de cada venta.'],
    ]
    for (const [titulo, desc] of terminos) {
      doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica-Bold').text(titulo, M, y)
      y = doc.y + 2
      y = parrafo(desc, y, 9.5)
    }

    // 5. Compromisos
    y = tituloSeccion('5. Compromisos', y + 4)
    doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica-Bold').text(`De ${nombreAfiliado}:`, M, y)
    y = doc.y + 4

    const compAfiliado = [
      'Promocionar los productos de manera auténtica y honesta con su comunidad.',
      'No hacer afirmaciones sobre los productos que no estén respaldadas por el material oficial.',
      'Usar únicamente el link y materiales proporcionados por La Zona Campeón.',
    ]
    for (const c of compAfiliado) {
      doc.fillColor(hexColor(DORADO)).fontSize(10).font('Helvetica-Bold').text('•', M, y)
      doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica').text(c, M + 14, y, { width: W - M * 2 - 14 })
      y = doc.y + 4
    }

    y += 4
    doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica-Bold').text('De La Zona Campeón:', M, y)
    y = doc.y + 4

    const compLZC = [
      'Proveer materiales de apoyo: imágenes, copies, acceso a productos de muestra.',
      'Mantener el panel de seguimiento actualizado en tiempo real.',
      'Realizar los pagos en los plazos acordados.',
      `Notificar a ${nombreAfiliado} con 15 días de anticipación cualquier cambio en las condiciones.`,
    ]
    for (const c of compLZC) {
      doc.fillColor(hexColor(DORADO)).fontSize(10).font('Helvetica-Bold').text('•', M, y)
      doc.fillColor(hexColor(NEGRO)).fontSize(10).font('Helvetica').text(c, M + 14, y, { width: W - M * 2 - 14 })
      y = doc.y + 4
    }

    // 6. Vigencia
    y = tituloSeccion('6. Vigencia', y + 4)
    y = parrafo(
      'Esta alianza inicia en la fecha de firma y tiene una duración de 12 meses, con renovación automática salvo que cualquiera de las partes notifique su intención de no renovar con 30 días de anticipación. Cualquiera de las partes puede dar por terminado el acuerdo en cualquier momento con aviso de 15 días, sin penalización.',
      y
    )

    // 7. Firmas
    y = tituloSeccion('7. Firmas', y + 4)
    y = parrafo('Las partes expresan su aceptación de los términos anteriores mediante su firma a continuación.', y)
    y += 16

    // Bloque firma izquierdo
    doc.moveTo(M, y).lineTo(M + 200, y).strokeColor(hexColor(DORADO)).lineWidth(0.4).stroke()
    doc.fillColor(hexColor(NEGRO)).fontSize(9).font('Helvetica-Bold').text(nombreRepresentante, M, y + 4)
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique').text('La Zona Campeón', M, y + 16)

    // Bloque firma derecho
    const fx2 = M + 280
    doc.moveTo(fx2, y).lineTo(fx2 + 200, y).strokeColor(hexColor(DORADO)).lineWidth(0.4).stroke()
    doc.fillColor(hexColor(NEGRO)).fontSize(9).font('Helvetica-Bold').text(nombreAfiliado, fx2, y + 4)
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique').text(tipoCuenta, fx2, y + 16)

    y += 48
    doc.fillColor(hexColor(GRIS)).fontSize(8.5).font('Helvetica-Oblique')
      .text('Fecha de firma: ________________________     Fecha de firma: ________________________', M, y, { align: 'center', width: W - M * 2 })

    drawFooter(1)

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
