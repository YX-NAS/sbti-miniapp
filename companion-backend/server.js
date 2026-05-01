const crypto = require('crypto')
const cors = require('cors')
const express = require('express')

const PORT = resolvePort()
const CODE_TTL_SECONDS = toPositiveInt(process.env.CODE_TTL_SECONDS, 300)
const SESSION_TTL_SECONDS = toPositiveInt(process.env.SESSION_TTL_SECONDS, 86400)
const ALLOWED_ORIGINS = parseCsv(process.env.ALLOWED_ORIGINS)

function resolvePort() {
  const argv = process.argv.slice(2)
  const portFlagIndex = argv.indexOf('--port')
  const cliPort =
    portFlagIndex >= 0
      ? argv[portFlagIndex + 1]
      : argv.find((item) => item.startsWith('--port='))?.split('=')[1]

  return toPositiveInt(cliPort || process.env.PORT, 8080)
}

function toPositiveInt(value, fallback) {
  const numeric = Number.parseInt(value, 10)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback
}

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function createTtlStore() {
  const store = new Map()

  function set(key, value, ttlSeconds) {
    store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  function get(key) {
    const entry = store.get(key)
    if (!entry) {
      return null
    }

    if (entry.expiresAt <= Date.now()) {
      store.delete(key)
      return null
    }

    return entry.value
  }

  function consume(key) {
    const value = get(key)
    if (!value) {
      return null
    }

    store.delete(key)
    return value
  }

  function cleanup() {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (entry.expiresAt <= now) {
        store.delete(key)
      }
    }
  }

  return { set, get, consume, cleanup }
}

function randomToken(prefix, bytes) {
  return `${prefix}${crypto.randomBytes(bytes).toString('hex')}`
}

function validateCreatePayload(body) {
  const requiredFields = ['source', 'roleHint', 'sceneHint', 'goal']
  for (const field of requiredFields) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return `missing_or_invalid_${field}`
    }
  }

  return null
}

function validateExchangePayload(body) {
  if (typeof body.code !== 'string' || !body.code.trim()) {
    return 'missing_or_invalid_code'
  }

  if (body.source !== undefined && (typeof body.source !== 'string' || !body.source.trim())) {
    return 'missing_or_invalid_source'
  }

  return null
}

const app = express()
const ttlStore = createTtlStore()

setInterval(() => ttlStore.cleanup(), 60_000).unref()

app.use(express.json({ limit: '64kb' }))
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('origin_not_allowed'))
    },
  })
)

app.get('/healthz', (_req, res) => {
  res.json({
    ok: true,
    service: 'sbti-companion-backend',
    codeTtlSeconds: CODE_TTL_SECONDS,
    sessionTtlSeconds: SESSION_TTL_SECONDS,
  })
})

app.post('/api/session/create-code', (req, res) => {
  const validationError = validateCreatePayload(req.body || {})
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }

  const payload = {
    source: req.body.source.trim(),
    roleHint: req.body.roleHint.trim(),
    sceneHint: req.body.sceneHint.trim(),
    goal: req.body.goal.trim(),
    nickname: typeof req.body.nickname === 'string' && req.body.nickname.trim() ? req.body.nickname.trim() : '同学',
    createdAt: Date.now(),
  }

  const code = randomToken('wx-', 12)
  ttlStore.set(`session:code:${code}`, payload, CODE_TTL_SECONDS)

  res.json({
    code,
    expiresIn: CODE_TTL_SECONDS,
  })
})

app.post('/api/session/exchange', (req, res) => {
  const validationError = validateExchangePayload(req.body || {})
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }

  const code = req.body.code.trim()
  const codeData = ttlStore.consume(`session:code:${code}`)

  if (!codeData) {
    res.status(404).json({ error: 'code_not_found_or_expired' })
    return
  }

  const sessionId = randomToken('sess_', 12)
  const sessionData = {
    ...codeData,
    sessionId,
    exchangedAt: Date.now(),
  }

  ttlStore.set(`session:${sessionId}`, sessionData, SESSION_TTL_SECONDS)

  res.json({
    sessionId,
    nickname: codeData.nickname,
    expiresIn: SESSION_TTL_SECONDS,
  })
})

app.get('/api/session/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId
  const sessionData = ttlStore.get(`session:${sessionId}`)

  if (!sessionData) {
    res.status(404).json({ error: 'session_not_found_or_expired' })
    return
  }

  res.json({
    sessionId: sessionData.sessionId,
    source: sessionData.source,
    roleHint: sessionData.roleHint,
    sceneHint: sessionData.sceneHint,
    goal: sessionData.goal,
    nickname: sessionData.nickname,
    exchangedAt: sessionData.exchangedAt,
  })
})

app.use((err, _req, res, _next) => {
  const status = err && err.message === 'origin_not_allowed' ? 403 : 500
  res.status(status).json({ error: err?.message || 'internal_error' })
})

app.listen(PORT, () => {
  console.log(`[sbti-companion-backend] listening on :${PORT}`)
})