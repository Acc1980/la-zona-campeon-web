const SHEET_ID = process.env.GOOGLE_SHEET_AFILIADOS_ID || '18IB7QBQwT0heg0hFgW4UxFvWDryrGSWg7iNbkRuJqNU'
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || ''
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: REFRESH_TOKEN,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
    }).toString(),
  })
  const data = await res.json()
  return data.access_token
}

export async function registrarVentaAfiliado(params: {
  handle: string
  fecha: string
  producto: string
  montoUSD: number
  comision: number
}) {
  if (!REFRESH_TOKEN || !CLIENT_ID || !CLIENT_SECRET) return

  try {
    const token = await getAccessToken()
    const tab = encodeURIComponent(`Afiliado - ${params.handle}`)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${tab}!A:F:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          params.fecha,
          params.producto,
          params.montoUSD,
          params.comision,
          'Pendiente',
          '',
        ]],
      }),
    })
  } catch {
    // No bloquear el flujo de compra si falla el tracking
  }
}
