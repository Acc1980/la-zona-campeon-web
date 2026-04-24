import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

interface DemoToken {
  createdAt: string
  used: boolean
  usedAt?: string
}

const TOKENS_FILE = path.join(process.cwd(), 'data', 'demo-tokens.json')

function readTokens(): Record<string, DemoToken> {
  const dir = path.dirname(TOKENS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(TOKENS_FILE)) return {}
  try {
    return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function writeTokens(tokens: Record<string, DemoToken>): void {
  const dir = path.dirname(TOKENS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), 'utf8')
}

export function crearToken(): string {
  const token = crypto.randomBytes(12).toString('hex')
  const tokens = readTokens()
  tokens[token] = { createdAt: new Date().toISOString(), used: false }
  writeTokens(tokens)
  return token
}

export function validarToken(token: string): { valid: boolean; used: boolean } {
  const tokens = readTokens()
  if (!tokens[token]) return { valid: false, used: false }
  return { valid: true, used: tokens[token].used }
}

export function consumirToken(token: string): boolean {
  const tokens = readTokens()
  if (!tokens[token] || tokens[token].used) return false
  tokens[token].used = true
  tokens[token].usedAt = new Date().toISOString()
  writeTokens(tokens)
  return true
}

export function listarTokens(): Array<DemoToken & { token: string }> {
  const tokens = readTokens()
  return Object.entries(tokens)
    .map(([token, data]) => ({ token, ...data }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
