import { notFound } from 'next/navigation'
import { validarToken } from '@/lib/affiliate-token'

const SHEET_ID = process.env.GOOGLE_SHEET_AFILIADOS_ID || '18IB7QBQwT0heg0hFgW4UxFvWDryrGSWg7iNbkRuJqNU'
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || ''
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ refresh_token: REFRESH_TOKEN, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'refresh_token' }).toString(),
    cache: 'no-store',
  })
  const data = await res.json()
  return data.access_token as string
}

async function getVentas(handle: string) {
  const token = await getAccessToken()
  const tab = encodeURIComponent(`Afiliado - ${handle}`)
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${tab}!A:F`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.values || []).slice(1) as string[][]
}

export default async function AfiliadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ codigo: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { codigo } = await params
  const { token } = await searchParams

  if (!token || !validarToken(codigo, token)) return notFound()

  const ventas = await getVentas(codigo)

  const totalVentas = ventas.length
  const totalComision = ventas.reduce((s, r) => s + parseFloat((r[3] || '0').replace(',', '.')), 0)
  const pagado = ventas.filter(r => (r[4] || '').toLowerCase() === 'pagado')
    .reduce((s, r) => s + parseFloat((r[3] || '0').replace(',', '.')), 0)
  const pendiente = totalComision - pagado

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#111122', minHeight: '100vh', color: '#f5f0e8' }}>
      {/* Header */}
      <div style={{ background: '#1a1a2e', borderBottom: '1px solid rgba(200,170,50,0.2)', padding: '20px 24px' }}>
        <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#c8aa32', margin: '0 0 4px' }}>La Zona Campeón</p>
        <h1 style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: 0 }}>
          Panel de Afiliado — @{codigo}
        </h1>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
        {/* Resumen */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Ventas totales', value: totalVentas.toString() },
            { label: 'Comisión pendiente', value: `$${pendiente.toFixed(2)}` },
            { label: 'Total pagado', value: `$${pagado.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#1a1a2e', border: '1px solid rgba(200,170,50,0.2)', borderRadius: 8, padding: '16px 12px', textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#c8aa32', margin: '0 0 8px' }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabla de ventas */}
        <div style={{ background: '#1a1a2e', border: '1px solid rgba(200,170,50,0.15)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(200,170,50,0.15)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#c8aa32', margin: 0 }}>
              Historial de ventas
            </p>
          </div>

          {ventas.length === 0 ? (
            <div style={{ padding: '40px 18px', textAlign: 'center', color: 'rgba(245,240,232,0.4)', fontSize: 13 }}>
              Aún no hay ventas registradas. Comparte tu link para empezar.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(200,170,50,0.15)' }}>
                    {['Fecha', 'Producto', 'Venta', 'Comisión', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((row, i) => {
                    const estado = (row[4] || 'Pendiente')
                    const pagada = estado.toLowerCase() === 'pagado'
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 14px', color: 'rgba(245,240,232,0.6)', whiteSpace: 'nowrap' }}>{row[0] || '—'}</td>
                        <td style={{ padding: '12px 14px', color: '#f5f0e8' }}>{row[1] || '—'}</td>
                        <td style={{ padding: '12px 14px', color: '#f5f0e8' }}>${parseFloat((row[2] || '0').replace(',', '.')).toFixed(2)}</td>
                        <td style={{ padding: '12px 14px', color: '#c8aa32', fontWeight: 700 }}>${parseFloat((row[3] || '0').replace(',', '.')).toFixed(2)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                            background: pagada ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                            color: pagada ? '#4ade80' : '#fbbf24',
                          }}>{estado}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(245,240,232,0.3)', marginTop: 24 }}>
          Los pagos se realizan dentro de los 5 días hábiles siguientes a la confirmación de compra · <a href="mailto:info@lazonacampeon.com" style={{ color: '#c8aa32', textDecoration: 'none' }}>info@lazonacampeon.com</a>
        </p>
      </div>
    </div>
  )
}
