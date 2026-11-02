import type { Handler, HandlerEvent } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { EMAILJS_BACKFILLED_CANDIDATES } from '../../src/data/emailjsCandidates'

interface ApplicationItem {
  id: string
  fullName: string
  email: string
  studentId: string
  castingDivision: 'vocal' | 'dancer' | 'traditional_dance'
  castingSong: string
  beatUrl: string
  hasPerformanceExperience: boolean
  performanceUrl: string
  passion: string
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'
  adminNote: string
  createdAt: string
  updatedAt: string
}

const INITIAL_SAMPLE_APPLICATIONS: ApplicationItem[] = [
  ...EMAILJS_BACKFILLED_CANDIDATES,
]

// In-memory fallback cache
let memoryApps: ApplicationItem[] = [...INITIAL_SAMPLE_APPLICATIONS]

async function getStoredApplications(): Promise<ApplicationItem[]> {
  try {
    const store = getStore('hmc_recruitment_data')
    const data = await store.get('applications', { type: 'json' })
    if (Array.isArray(data) && data.length > 0) {
      // Purge any fake sample applications
      const cleanData = data.filter((a: ApplicationItem) => !a.id.startsWith('HMC-2026-00') && !a.email.endsWith('@student.edu.vn'))
      const map = new Map<string, ApplicationItem>()
      cleanData.forEach((a: ApplicationItem) => map.set(a.id, a))
      INITIAL_SAMPLE_APPLICATIONS.forEach((a) => {
        const existing = map.get(a.id)
        if (!existing) {
          map.set(a.id, a)
        } else {
          map.set(a.id, {
            ...a,
            status: existing.status || a.status,
            adminNote: existing.adminNote || a.adminNote,
            updatedAt: existing.updatedAt || a.updatedAt,
          })
        }
      })
      const merged = Array.from(map.values())
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      memoryApps = merged
      return merged
    }
  } catch (err) {
    // Netlify Blobs not available (local or non-blobs context)
  }
  return memoryApps
}

async function persistApplications(apps: ApplicationItem[]): Promise<void> {
  memoryApps = apps
  try {
    const store = getStore('hmc_recruitment_data')
    await store.setJSON('applications', apps)
  } catch (err) {
    // ignore
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  }

  const rawPath = event.path || '/'
  // Normalize path removing function prefix
  const cleanPath = rawPath
    .replace(/^\/\.netlify\/functions\/applications/, '')
    .replace(/^\/api\/applications/, '')
    .replace(/\/+$/, '')

  const method = event.httpMethod.toUpperCase()

  try {
    // ----------------------------------------------------
    // 1. PUBLIC: POST /api/applications (CTV Registration & Shift Selection)
    // ----------------------------------------------------
    if ((cleanPath === '' || cleanPath === '/' || cleanPath === '/shift') && method === 'POST') {
      const body = JSON.parse(event.body || '{}')

      // Xử lý riêng cho Đăng Ký Ca Casting (/dangkica)
      if (body.action === 'register_shift' || cleanPath === '/shift') {
        const apps = await getStoredApplications()
        const studentId = String(body.studentId || '').trim().toUpperCase()
        const email = String(body.email || '').trim().toLowerCase()
        const fullName = String(body.fullName || '').trim()
        const fullShiftLabel = String(body.fullShiftLabel || '').trim()
        const phone = String(body.phone || '').trim()
        const note = String(body.note || '').trim()
        const now = new Date().toISOString()

        const existingIndex = apps.findIndex(
          (a) =>
            (studentId && a.studentId.toUpperCase() === studentId) ||
            (email && a.email.toLowerCase() === email)
        )

        let targetApp: ApplicationItem
        if (existingIndex >= 0) {
          const prev = apps[existingIndex]
          const shiftNote = `[Ca Casting: ${fullShiftLabel} | SĐT: ${phone}]${note ? ` [Ghi chú: ${note}]` : ''}`
          apps[existingIndex] = {
            ...prev,
            adminNote: prev.adminNote && !prev.adminNote.includes(fullShiftLabel)
              ? `${shiftNote} ${prev.adminNote}`
              : shiftNote,
            updatedAt: now,
          }
          targetApp = apps[existingIndex]
        } else {
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
          const id = `HMC-2026-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`
          targetApp = {
            id,
            fullName: fullName || 'Thí sinh đăng ký ca',
            studentId: studentId || 'N/A',
            email: email || 'N/A',
            castingDivision: body.castingDivision || 'vocal',
            castingSong: body.castingSong || '',
            beatUrl: body.beatUrl || '',
            hasPerformanceExperience: false,
            performanceUrl: '',
            passion: `[ĐĂNG KÝ CA]: ${fullShiftLabel}. SĐT: ${phone}`,
            status: 'new',
            adminNote: `[Ca Casting: ${fullShiftLabel} | SĐT: ${phone}]`,
            createdAt: now,
            updatedAt: now,
          }
          apps.unshift(targetApp)
        }

        await persistApplications(apps)

        // Đồng bộ sang Google Apps Script Webhook (Tuyệt đối không gửi email)
        const webhookUrl =
          body.shiftWebhookUrl ||
          process.env.VITE_SHIFT_WEBHOOK_URL ||
          process.env.SHIFT_WEBHOOK_URL ||
          process.env.VITE_WEBHOOK_URL ||
          process.env.WEBHOOK_URL ||
          'https://script.google.com/macros/s/AKfycbzpEErb2FDabdq7MXR0WwoMZ1GKUF4G4ML7XUQEuEfJyUp3oa-zkezxsIIJrt3PpjYQWA/exec'
        
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'register_shift',
            type: 'casting_shift_registration',
            sheetName: 'Đăng Ký Ca Casting',
            skipEmail: true,
            sendEmail: false,
            to: '', // Tuyệt đối không gửi email
            email: '',
            fullName: fullName || targetApp.fullName,
            studentId: studentId || targetApp.studentId,
            shiftDate: body.shiftDate || '',
            shiftSession: body.shiftSession || '',
            shiftTimeSlot: body.shiftTimeSlot || '',
            fullShiftLabel,
            id: body.id || targetApp.id,
            registeredAt: new Date(now).toLocaleString('vi-VN'),
            candidate: {
              ...targetApp,
              email: '', // Không gửi email
            },
            timestamp: now,
          }),
        }).catch(() => {})

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Đã ghi nhận ca casting thành công!',
            application: targetApp,
          }),
        }
      }

      const fullName = String(body.fullName || '').trim()
      const email = String(body.email || '').trim().toLowerCase()
      const studentId = String(body.studentId || '').trim().toUpperCase()
      let castingDivision: 'vocal' | 'dancer' | 'traditional_dance' = 'vocal'
      const rawDiv = String(body.castingDivision || '').trim().toLowerCase()
      if (rawDiv === 'dancer' || rawDiv === 'dance' || rawDiv.includes('nhảy') || rawDiv.includes('nhay')) {
        castingDivision = 'dancer'
      } else if (rawDiv === 'traditional_dance' || rawDiv.includes('múa') || rawDiv.includes('mua') || rawDiv.includes('traditional')) {
        castingDivision = 'traditional_dance'
      } else {
        castingDivision = 'vocal'
      }
      const castingSong = String(body.castingSong || 'Chưa điền (bổ sung khi casting)').trim()
      const beatUrl = String(body.beatUrl || 'Nộp beat tại bàn Check-in Casting').trim()
      const hasPerformanceExperience = Boolean(body.hasPerformanceExperience)
      const performanceUrl = String(body.performanceUrl || '').trim()
      const passion = String(body.passion || '').trim()

      if (!fullName || !email || !studentId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Vui lòng điền họ tên, email và MSSV hợp lệ.' }),
        }
      }

      const apps = await getStoredApplications()
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
      const id = `HMC-2026-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`
      const now = new Date().toISOString()

      const newApp: ApplicationItem = {
        id,
        fullName,
        email,
        studentId,
        castingDivision,
        castingSong,
        beatUrl,
        hasPerformanceExperience,
        performanceUrl,
        passion,
        status: 'new',
        adminNote: '',
        createdAt: now,
        updatedAt: now,
      }

      apps.unshift(newApp)
      await persistApplications(apps)

      // Forward to Google Apps Script Webhook if configured
      const webhookUrl = process.env.VITE_WEBHOOK_URL || process.env.WEBHOOK_URL
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            candidate: newApp,
            type: 'new_registration',
            action: 'sync_sheet_only',
            skipEmail: true,
            sendEmail: false,
            timestamp: now,
          }),
        }).catch(() => {})
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          id,
          message: 'Đơn đăng ký đã được ghi nhận vào hệ thống HMC!',
          application: newApp,
        }),
      }
    }

    // ----------------------------------------------------
    // 2. GET /api/applications (List with filters)
    // ----------------------------------------------------
    if ((cleanPath === '' || cleanPath === '/') && method === 'GET') {
      const params = event.queryStringParameters || {}
      const q = (params.q || '').trim().toLowerCase()
      const division = (params.division || 'all').trim().toLowerCase()
      const status = (params.status || 'all').trim().toLowerCase()
      const experience = (params.experience || 'all').trim().toLowerCase()
      const sort = (params.sort || 'newest').trim().toLowerCase()
      const page = Math.max(1, parseInt(params.page || '1', 10))
      const limit = Math.max(1, Math.min(2000, parseInt(params.limit || '25', 10)))

      const allApps = await getStoredApplications()

      const counts = {
        total: allApps.length,
        vocal: allApps.filter((a) => a.castingDivision === 'vocal').length,
        dancer: allApps.filter((a) => a.castingDivision === 'dancer').length,
        traditional_dance: allApps.filter((a) => a.castingDivision === 'traditional_dance').length,
        new: allApps.filter((a) => a.status === 'new').length,
        reviewing: allApps.filter((a) => a.status === 'reviewing').length,
        shortlisted: allApps.filter((a) => a.status === 'shortlisted').length,
        rejected: allApps.filter((a) => a.status === 'rejected').length,
        accepted: allApps.filter((a) => a.status === 'accepted').length,
      }

      let filtered = [...allApps]

      if (q) {
        filtered = filtered.filter(
          (a) =>
            a.fullName.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.studentId.toLowerCase().includes(q) ||
            a.castingSong.toLowerCase().includes(q) ||
            (a.beatUrl && a.beatUrl.toLowerCase().includes(q)) ||
            (a.performanceUrl && a.performanceUrl.toLowerCase().includes(q)) ||
            (a.passion && a.passion.toLowerCase().includes(q)) ||
            a.id.toLowerCase().includes(q)
        )
      }

      if (division !== 'all') {
        filtered = filtered.filter((a) => a.castingDivision === division)
      }

      if (status !== 'all') {
        filtered = filtered.filter((a) => a.status === status)
      }

      if (experience !== 'all') {
        const hasExp = experience === 'yes' || experience === 'true'
        filtered = filtered.filter((a) => a.hasPerformanceExperience === hasExp)
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sort) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          case 'name_asc':
            return a.fullName.localeCompare(b.fullName, 'vi')
          case 'name_desc':
            return b.fullName.localeCompare(a.fullName, 'vi')
          case 'division_name_asc': {
            const divOrder: Record<string, number> = { vocal: 1, dancer: 2, traditional_dance: 3 }
            const oA = divOrder[a.castingDivision] || 99
            const oB = divOrder[b.castingDivision] || 99
            if (oA !== oB) return oA - oB
            return a.fullName.localeCompare(b.fullName, 'vi')
          }
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
      })

      const total = filtered.length
      const totalPages = Math.max(1, Math.ceil(total / limit))
      const startIndex = (page - 1) * limit
      const paginated = filtered.slice(startIndex, startIndex + limit)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          applications: paginated,
          total,
          page,
          limit,
          totalPages,
          counts,
        }),
      }
    }

    // ----------------------------------------------------
    // 3. SINGLE APPLICANT / BATCH OPERATIONS
    // ----------------------------------------------------
    const singleMatch = cleanPath.match(/^\/([A-Za-z0-9_-]+)$/)
    const editMatch = cleanPath.match(/^\/([A-Za-z0-9_-]+)\/edit$/)

    // GET /api/applications/:id
    if (singleMatch && method === 'GET') {
      const id = singleMatch[1]
      const apps = await getStoredApplications()
      const found = apps.find((a) => a.id === id)
      if (!found) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Không tìm thấy hồ sơ.' }) }
      }
      return { statusCode: 200, headers, body: JSON.stringify({ application: found }) }
    }

    // PATCH /api/applications/:id (Update status / note)
    if (singleMatch && method === 'PATCH') {
      const id = singleMatch[1]
      const body = JSON.parse(event.body || '{}')
      const apps = await getStoredApplications()
      const index = apps.findIndex((a) => a.id === id)
      if (index === -1) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Không tìm thấy hồ sơ.' }) }
      }

      apps[index] = {
        ...apps[index],
        status: body.status !== undefined ? body.status : apps[index].status,
        adminNote: body.adminNote !== undefined ? body.adminNote : apps[index].adminNote,
        updatedAt: new Date().toISOString(),
      }
      await persistApplications(apps)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, application: apps[index] }),
      }
    }

    // PUT /api/applications/:id/edit
    if (editMatch && method === 'PUT') {
      const id = editMatch[1]
      const body = JSON.parse(event.body || '{}')
      const apps = await getStoredApplications()
      const index = apps.findIndex((a) => a.id === id)
      if (index === -1) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Không tìm thấy hồ sơ.' }) }
      }

      apps[index] = {
        ...apps[index],
        ...body,
        id: apps[index].id,
        updatedAt: new Date().toISOString(),
      }
      await persistApplications(apps)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, application: apps[index] }),
      }
    }

    // DELETE /api/applications/:id
    if (singleMatch && method === 'DELETE') {
      const id = singleMatch[1]
      const apps = await getStoredApplications()
      const remaining = apps.filter((a) => a.id !== id)
      await persistApplications(remaining)
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, deletedCount: 1 }) }
    }

    // POST /api/applications/batch-delete
    if (cleanPath === '/batch-delete' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const idsToDelete = new Set(Array.isArray(body.ids) ? body.ids : [])
      const apps = await getStoredApplications()
      const remaining = apps.filter((a) => !idsToDelete.has(a.id))
      const deletedCount = apps.length - remaining.length
      await persistApplications(remaining)
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, deletedCount }) }
    }

    // POST /api/applications/manual
    if (cleanPath === '/manual' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const apps = await getStoredApplications()
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
      const id = body.id || `HMC-2026-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`
      const now = new Date().toISOString()

      let manualDivision: 'vocal' | 'dancer' | 'traditional_dance' = 'vocal'
      const rawManualDiv = String(body.castingDivision || '').trim().toLowerCase()
      if (rawManualDiv === 'dancer' || rawManualDiv === 'dance' || rawManualDiv.includes('nhảy') || rawManualDiv.includes('nhay')) {
        manualDivision = 'dancer'
      } else if (rawManualDiv === 'traditional_dance' || rawManualDiv.includes('múa') || rawManualDiv.includes('mua') || rawManualDiv.includes('traditional')) {
        manualDivision = 'traditional_dance'
      } else {
        manualDivision = 'vocal'
      }

      const newApp: ApplicationItem = {
        id,
        fullName: String(body.fullName || 'Thí sinh mới').trim(),
        email: String(body.email || '').trim().toLowerCase(),
        studentId: String(body.studentId || '').trim().toUpperCase(),
        castingDivision: manualDivision,
        castingSong: String(body.castingSong || 'Chưa điền (bổ sung khi casting)').trim(),
        beatUrl: String(body.beatUrl || 'Nộp beat tại bàn Check-in Casting').trim(),
        hasPerformanceExperience: Boolean(body.hasPerformanceExperience),
        performanceUrl: String(body.performanceUrl || '').trim(),
        passion: String(body.passion || '').trim(),
        status: (body.status || 'new') as any,
        adminNote: String(body.adminNote || '').trim(),
        createdAt: now,
        updatedAt: now,
      }

      apps.unshift(newApp)
      await persistApplications(apps)

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, application: newApp }),
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint không tồn tại.' }),
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Lỗi server xử lý đơn đăng ký.' }),
    }
  }
}
