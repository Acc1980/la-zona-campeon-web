'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AFILIADOS } from '@/lib/afiliados'

export default function RefPage() {
  const { codigo } = useParams<{ codigo: string }>()
  const router = useRouter()

  useEffect(() => {
    const afiliado = AFILIADOS[codigo?.toLowerCase()]
    if (afiliado?.activo) {
      document.cookie = `afiliado=${codigo.toLowerCase()}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    }
    router.replace('/productos')
  }, [codigo, router])

  return null
}
