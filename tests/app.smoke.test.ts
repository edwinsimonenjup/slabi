import { describe, it, expect, vi, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/lib/prisma'

describe('Avalon Baseline Smoke Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('GET /health returns 200 when database is reachable', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('GET /health returns 503 when database query fails', async () => {
    const spy = vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('DB down'))

    const res = await request(app).get('/health')
    expect(res.status).toBe(503)
    expect(res.body).toEqual({ status: 'down' })

    spy.mockRestore()
  })

  it('returns 404 JSON for unregistered routes', async () => {
    const res = await request(app).get('/api/v1/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ success: false, message: 'Not found' })
  })

  it('returns 400 JSON for malformed JSON payloads', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send('{broken-json')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ success: false, message: 'Invalid JSON payload' })
  })

  it('rejects unauthenticated requests to protected routes with 401', async () => {
    const whoamiRes = await request(app).get('/api/v1/whoami')
    expect(whoamiRes.status).toBe(401)

    const weatherRes = await request(app).get('/api/v1/weather')
    expect(weatherRes.status).toBe(401)
  })
})