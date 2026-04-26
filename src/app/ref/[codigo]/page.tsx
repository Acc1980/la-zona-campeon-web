'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function RefPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const router = useRouter()

  useEffect(() => {
    const code = codigo?.toLowerCase()
    if (!code) { router.replace('/productos'); return }

    fetch(`/api/ref/validate?codigo=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          document.cookie = `afiliado=${code}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
        }
      })
      .catch(() => {})
      .finally(() => router.replace('/productos'))
  }, [codigo, router])

  return null
}
