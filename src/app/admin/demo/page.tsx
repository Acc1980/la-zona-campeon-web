'use client'

import { useState } from 'react'

export default function AdminDemoPage() {
  const [secret, setSecret]   = useState('')
  const [url, setUrl]         = useState('')
  const [tokens, setTokens]   = useState<Array<{ token: string; createdAt: string; used: boolean; usedAt?: string }>>([])
  const [error, setError]     = useState('')
  const [cargando, setCargando] = useState(false)
  const [copiado, setCopiado] = useState(false)

  async function generarLink() {
    if (!secret) return
    setCargando(true)
    setError('')
    setUrl('')
    try {
      const res = await fetch('/api/admin/demo', {
        method: 'POST',
        headers: { 'x-admin-secret': secret },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setUrl(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setCargando(false)
    }
  }

  async function verTokens() {
    if (!secret) return
    setCargando(true)
    setError('')
    try {
      const res = await fetch('/api/admin/demo', {
        headers: { 'x-admin-secret': secret },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setTokens(data.tokens)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setCargando(false)
    }
  }

  function copiar() {
    navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-2">Admin</p>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide">
            Links de Demo
          </h1>
          <p className="text-dark-400 text-sm mt-2">Genera un link de un solo uso para enviar a tu cita.</p>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 mb-4">
          <label className="block font-display font-bold text-xs text-dark-300 uppercase tracking-wider mb-2">
            Contraseña de admin
          </label>
          <input
            type="password"
            className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-3 text-white text-sm placeholder-dark-400 focus:outline-none focus:border-gold-500 transition-colors mb-4"
            placeholder="••••••••"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generarLink()}
          />

          <div className="flex gap-3">
            <button
              onClick={generarLink}
              disabled={!secret || cargando}
              className="btn-primary text-sm px-6 py-3 flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cargando ? 'Generando...' : 'Generar link nuevo'}
            </button>
            <button
              onClick={verTokens}
              disabled={!secret || cargando}
              className="btn-secondary text-sm px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ver historial
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {url && (
          <div className="bg-dark-800 border border-gold-500/30 rounded-xl p-6 mb-4">
            <p className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest mb-3">
              Link generado — solo se puede usar una vez
            </p>
            <div className="bg-dark-700 rounded-lg px-4 py-3 mb-3 break-all">
              <p className="text-white text-sm font-mono">{url}</p>
            </div>
            <button
              onClick={copiar}
              className="w-full bg-gold-500 hover:bg-gold-400 text-dark-900 font-display font-bold text-sm uppercase tracking-wider py-3 rounded-lg transition-colors"
            >
              {copiado ? '¡Copiado!' : 'Copiar link'}
            </button>
          </div>
        )}

        {tokens.length > 0 && (
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-6">
            <p className="font-display font-bold text-xs text-dark-300 uppercase tracking-widest mb-4">
              Historial de links
            </p>
            <div className="space-y-2">
              {tokens.map(t => (
                <div key={t.token} className={`flex items-center justify-between p-3 rounded-lg text-xs ${t.used ? 'bg-dark-700 opacity-50' : 'bg-dark-700 border border-gold-500/20'}`}>
                  <span className="font-mono text-dark-300 truncate flex-1 mr-3">{t.token.slice(0, 16)}...</span>
                  <span className={`font-bold uppercase shrink-0 ${t.used ? 'text-dark-500' : 'text-gold-500'}`}>
                    {t.used ? 'Usado' : 'Disponible'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
