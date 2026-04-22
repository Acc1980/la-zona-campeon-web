/**
 * Google Apps Script — Dashboard de Ventas La Zona Campeón
 *
 * CÓMO DESPLEGAR:
 * 1. Ir a script.google.com → Nuevo proyecto
 * 2. Pegar este código completo
 * 3. Guardar con nombre "Dashboard Ventas LZC"
 * 4. Clic en "Implementar" → "Nueva implementación"
 * 5. Tipo: "Aplicación web"
 * 6. Ejecutar como: "Yo (tu email)"
 * 7. Quién tiene acceso: "Cualquier usuario"
 * 8. Clic en "Implementar" → Autorizar → Copiar URL
 * 9. Pegar la URL en GOOGLE_SCRIPT_VENTAS_URL del .env.local y en el VPS
 */

const SHEET_NAME_VENTAS = 'Ventas';
const SHEET_NAME_DASHBOARD = 'Dashboard';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    initSheets(ss);
    registrarVenta(ss, data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function initSheets(ss) {
  // Hoja Ventas
  let ventas = ss.getSheetByName(SHEET_NAME_VENTAS);
  if (!ventas) {
    ventas = ss.insertSheet(SHEET_NAME_VENTAS);
    const headers = ['Fecha', 'Hora', 'Nivel', 'Producto', 'Monto USD', 'Email', 'Afiliado', 'Payment ID'];
    ventas.getRange(1, 1, 1, headers.length).setValues([headers]);
    ventas.getRange(1, 1, 1, headers.length)
      .setBackground('#1a1a2e')
      .setFontColor('#c8aa32')
      .setFontWeight('bold');
    ventas.setFrozenRows(1);
    ventas.setColumnWidth(1, 100);  // Fecha
    ventas.setColumnWidth(2, 70);   // Hora
    ventas.setColumnWidth(3, 60);   // Nivel
    ventas.setColumnWidth(4, 220);  // Producto
    ventas.setColumnWidth(5, 90);   // Monto
    ventas.setColumnWidth(6, 220);  // Email
    ventas.setColumnWidth(7, 110);  // Afiliado
    ventas.setColumnWidth(8, 160);  // Payment ID
  }

  // Hoja Dashboard
  let dash = ss.getSheetByName(SHEET_NAME_DASHBOARD);
  if (!dash) {
    dash = ss.insertSheet(SHEET_NAME_DASHBOARD, 0); // primera pestaña
    buildDashboard(dash);
  }
}

function registrarVenta(ss, data) {
  const ventas = ss.getSheetByName(SHEET_NAME_VENTAS);
  const now = new Date();
  const fecha = Utilities.formatDate(now, 'America/Bogota', 'yyyy-MM-dd');
  const hora = Utilities.formatDate(now, 'America/Bogota', 'HH:mm');

  ventas.appendRow([
    fecha,
    hora,
    data.nivel || '',
    data.producto || '',
    data.monto || 0,
    data.email || '',
    data.afiliado || '',
    data.paymentId || '',
  ]);

  // Actualizar dashboard
  refreshDashboard(ss);
}

function buildDashboard(dash) {
  dash.clearContents();
  dash.clearFormats();

  // Título
  dash.getRange('A1').setValue('DASHBOARD DE VENTAS — La Zona Campeón');
  dash.getRange('A1').setFontSize(14).setFontWeight('bold').setFontColor('#1a1a2e');
  dash.getRange('A1:F1').merge().setBackground('#c8aa32');

  dash.getRange('A2').setValue('Actualizado automáticamente con cada venta');
  dash.getRange('A2').setFontColor('#888888').setFontSize(10);
  dash.getRange('A2:F2').merge();

  // Sección: Totales generales (fila 4)
  dash.getRange('A4').setValue('TOTALES GENERALES').setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#c8aa32');
  dash.getRange('A4:F4').merge().setBackground('#1a1a2e').setFontColor('#c8aa32').setFontWeight('bold');

  dash.getRange('A5:C5').setValues([['Ventas totales', 'Ingresos totales USD', 'Ticket promedio']]);
  dash.getRange('A5:C5').setFontWeight('bold').setBackground('#f5f0e8');

  // Los valores se actualizan en refreshDashboard()

  // Sección: Por nivel (fila 8)
  dash.getRange('A8:F8').merge().setValue('POR NIVEL').setBackground('#1a1a2e').setFontColor('#c8aa32').setFontWeight('bold');
  dash.getRange('A9:D9').setValues([['Nivel', 'Ventas', 'Ingresos USD', '% del total']]);
  dash.getRange('A9:D9').setFontWeight('bold').setBackground('#f5f0e8');

  // Sección: Por producto (fila 14)
  dash.getRange('A14:F14').merge().setValue('POR PRODUCTO').setBackground('#1a1a2e').setFontColor('#c8aa32').setFontWeight('bold');
  dash.getRange('A15:D15').setValues([['Producto', 'Ventas', 'Ingresos USD', 'Último']]);
  dash.getRange('A15:D15').setFontWeight('bold').setBackground('#f5f0e8');

  // Sección: Últimas 10 ventas (fila col F)
  dash.getRange('F4').setValue('ÚLTIMAS 10 VENTAS').setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#c8aa32');
  dash.getRange('F4:I4').merge().setBackground('#1a1a2e').setFontColor('#c8aa32').setFontWeight('bold');
  dash.getRange('F5:I5').setValues([['Fecha', 'Producto', 'Monto', 'Email']]);
  dash.getRange('F5:I5').setFontWeight('bold').setBackground('#f5f0e8');

  dash.setColumnWidth(1, 160);
  dash.setColumnWidth(2, 90);
  dash.setColumnWidth(3, 110);
  dash.setColumnWidth(4, 90);
  dash.setColumnWidth(5, 20);
  dash.setColumnWidth(6, 100);
  dash.setColumnWidth(7, 220);
  dash.setColumnWidth(8, 80);
  dash.setColumnWidth(9, 200);
}

function refreshDashboard(ss) {
  const ventas = ss.getSheetByName(SHEET_NAME_VENTAS);
  const dash = ss.getSheetByName(SHEET_NAME_DASHBOARD);
  if (!ventas || !dash) return;

  const data = ventas.getDataRange().getValues();
  if (data.length <= 1) return; // solo headers

  const rows = data.slice(1); // sin headers
  const total = rows.length;
  const ingresos = rows.reduce((sum, r) => sum + (parseFloat(r[4]) || 0), 0);
  const ticket = total > 0 ? ingresos / total : 0;

  dash.getRange('A6:C6').setValues([[total, ingresos.toFixed(2), ticket.toFixed(2)]]);
  dash.getRange('B6').setNumberFormat('$#,##0.00');
  dash.getRange('C6').setNumberFormat('$#,##0.00');

  // Por nivel
  const niveles = ['N2', 'N3', 'N4'];
  const nivelRows = niveles.map(n => {
    const filtered = rows.filter(r => (r[2] || '').toUpperCase() === n);
    const cnt = filtered.length;
    const ing = filtered.reduce((s, r) => s + (parseFloat(r[4]) || 0), 0);
    const pct = total > 0 ? ((cnt / total) * 100).toFixed(1) + '%' : '0%';
    return [n, cnt, ing.toFixed(2), pct];
  });
  dash.getRange(10, 1, niveles.length, 4).setValues(nivelRows);
  dash.getRange(10, 3, niveles.length, 1).setNumberFormat('$#,##0.00');

  // Por producto
  const productoMap = {};
  rows.forEach(r => {
    const prod = r[3] || 'Sin nombre';
    const fecha = r[0] || '';
    if (!productoMap[prod]) productoMap[prod] = { cnt: 0, ing: 0, ultimo: fecha };
    productoMap[prod].cnt++;
    productoMap[prod].ing += parseFloat(r[4]) || 0;
    if (fecha > productoMap[prod].ultimo) productoMap[prod].ultimo = fecha;
  });
  const prodRows = Object.entries(productoMap)
    .sort((a, b) => b[1].cnt - a[1].cnt)
    .map(([prod, v]) => [prod, v.cnt, v.ing.toFixed(2), v.ultimo]);

  if (prodRows.length > 0) {
    dash.getRange(16, 1, prodRows.length, 4).setValues(prodRows);
    dash.getRange(16, 3, prodRows.length, 1).setNumberFormat('$#,##0.00');
  }

  // Últimas 10 ventas (más recientes al final de la hoja = últimas filas)
  const ultimas = rows.slice(-10).reverse();
  const ultimasData = ultimas.map(r => [r[0], r[3], parseFloat(r[4]).toFixed(2), r[5]]);
  if (ultimasData.length > 0) {
    dash.getRange(6, 6, Math.min(10, ultimasData.length), 4).setValues(ultimasData);
    dash.getRange(6, 8, Math.min(10, ultimasData.length), 1).setNumberFormat('$#,##0.00');
  }

  // Timestamp de última actualización
  const ts = Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd HH:mm');
  dash.getRange('A3').setValue('Última actualización: ' + ts).setFontColor('#aaaaaa').setFontSize(9);
}
