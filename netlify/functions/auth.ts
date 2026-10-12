import type { Handler, HandlerEvent } from '@netlify/functions'

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  }

  const rawPath = event.path || '/'
  const cleanPath = rawPath
    .replace(/^\/\.netlify\/functions\/auth/, '')
    .replace(/^\/api\/auth/, '')
    .replace(/\/+$/, '')

  const method = event.httpMethod.toUpperCase()

  // POST /api/auth/login
  if (cleanPath === '/login' && method === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')
      const email = String(body.email || body.username || '').trim().toLowerCase()
      const password = String(body.password || '').trim()

      const isValidAdmin =
        (email === 'admin@hmcmusic.club' && (password === 'HmcAdmin@2026' || password === '123456')) ||
        (email === 'clbamnhac.huflit@gmail.com' && (password === 'HmcAdmin@2026' || password === '123456')) ||
        (email === 'admin' && (password === '123456' || password === 'HmcAdmin@2026')) ||
        (email.includes('admin') && (password === 'HmcAdmin@2026' || password === '123456'))

      if (!isValidAdmin) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Thông tin đăng nhập không chính xác.' }),
        }
      }

      const token = `hmc_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
      const user = {
        id: 'admin_hmc_01',
        email: email.includes('@') ? email : 'admin@hmcmusic.club',
      }

      const cookieHeader = `hmc_admin_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Set-Cookie': cookieHeader,
        },
        body: JSON.stringify({
          success: true,
          token,
          user,
        }),
      }
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Payload không hợp lệ.' }),
      }
    }
  }

  // POST /api/auth/logout
  if (cleanPath === '/logout' && method === 'POST') {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Set-Cookie': 'hmc_admin_session=; HttpOnly; Path=/; Max-Age=0',
      },
      body: JSON.stringify({ success: true, message: 'Đăng xuất thành công.' }),
    }
  }

  // GET /api/auth/me
  if (cleanPath === '/me' && method === 'GET') {
    const authHeader = event.headers.authorization || event.headers.Authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          authenticated: true,
          user: { id: 'admin_hmc_01', email: 'admin@hmcmusic.club' },
        }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ authenticated: false }),
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Auth endpoint không tồn tại.' }),
  }
}
