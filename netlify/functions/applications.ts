import type { Handler, HandlerEvent } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

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
  {
    id: 'HMC-2026-001',
    fullName: 'Nguyễn Hoàng Minh',
    email: 'minh.nguyen@student.edu.vn',
    studentId: '23DH101234',
    castingDivision: 'vocal',
    castingSong: 'Linh thiêng Việt Nam',
    beatUrl: 'https://drive.google.com/file/d/1A2B3C4D_sample_beat/view',
    hasPerformanceExperience: true,
    performanceUrl: 'https://youtube.com/watch?v=sample_minh_live',
    passion: 'Mình đam mê ca hát từ nhỏ và có 2 năm sinh hoạt văn nghệ tại trường THPT. Mình mong muốn được học hỏi thêm về kỹ thuật bè, hòa thanh và tỏa sáng trên các sân khấu lớn cùng đại gia đình HMC.',
    status: 'shortlisted',
    adminNote: 'Giọng nam trầm ấm, phát âm rõ chữ, rất tự tin trên sân khấu. Ưu tiên xếp lịch casting ca 1.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-002',
    fullName: 'Trần Thảo Linh',
    email: 'linh.tt@student.edu.vn',
    studentId: '23DH202345',
    castingDivision: 'vocal',
    castingSong: 'Tàu anh qua núi',
    beatUrl: 'https://soundcloud.com/sample_tau_anh_qua_nui',
    hasPerformanceExperience: true,
    performanceUrl: 'https://tiktok.com/@linh_vocals/video/123456789',
    passion: 'Âm nhạc là hơi thở của mình. Mình yêu thích các dòng nhạc truyền thống cách mạng kết hợp pop đương đại. Mong muốn mang giọng ca của mình hòa cùng dàn vocal đầy nhiệt huyết của HMC.',
    status: 'reviewing',
    adminNote: 'Cao độ tốt, xử lý nốt cao mượt mà. Cần kiểm tra kỹ năng đọc xướng âm.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-003',
    fullName: 'Lê Quốc Bảo',
    email: 'bao.le@student.edu.vn',
    studentId: '24DH303456',
    castingDivision: 'dancer',
    castingSong: 'Supernova – aespa',
    beatUrl: 'https://drive.google.com/file/d/sample_dancer_track_1/view',
    hasPerformanceExperience: true,
    performanceUrl: 'https://facebook.com/watch/?v=sample_dance_clip',
    passion: 'Mình chuyên về Urban Dance và Hiphop Choreography. Tham gia HMC là ước mơ ngay từ khi bước chân vào giảng đường đại học để cùng cháy hết mình trong các đêm diễn của trường.',
    status: 'accepted',
    adminNote: 'Kỹ thuật popping và bắt beat rất chuẩn. Năng lượng làm chủ sân khấu tuyệt vời.',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-004',
    fullName: 'Phạm Quỳnh Như',
    email: 'quynhnhu.pham@student.edu.vn',
    studentId: '24DH404567',
    castingDivision: 'dancer',
    castingSong: 'Mantra – Jennie',
    beatUrl: 'https://youtube.com/watch?v=sample_dance_track_2',
    hasPerformanceExperience: false,
    performanceUrl: '',
    passion: 'Em tự học nhảy qua các video K-Pop và dance cover. Tuy chưa có kinh nghiệm diễn sân khấu lớn nhưng em rất kiên trì, học vũ đạo nhanh và luôn sẵn sàng luyện tập cùng đội ngũ HMC.',
    status: 'new',
    adminNote: '',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-005',
    fullName: 'Vũ Đức Thịnh',
    email: 'thinh.vu@student.edu.vn',
    studentId: '22DH505678',
    castingDivision: 'vocal',
    castingSong: 'Khát vọng tuổi trẻ',
    beatUrl: 'https://drive.google.com/file/d/sample_khat_vong/view',
    hasPerformanceExperience: false,
    performanceUrl: '',
    passion: 'Mình yêu ca hát và muốn thử thách bản thân ở môi trường câu lạc bộ chuyên nghiệp. HMC là nơi tràn đầy năng lượng và tình cảm anh em mà mình luôn tìm kiếm.',
    status: 'new',
    adminNote: '',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-006',
    fullName: 'Đặng Mai Phương',
    email: 'phuong.dang@student.edu.vn',
    studentId: '23DH606789',
    castingDivision: 'vocal',
    castingSong: 'Ngày chưa giông bão',
    beatUrl: 'https://drive.google.com/file/d/sample_ngay_chua_giong_bao/view',
    hasPerformanceExperience: true,
    performanceUrl: 'https://youtube.com/watch?v=sample_phuong_dan_ca',
    passion: 'Âm hưởng đương đại luôn là niềm đam mê lớn nhất của mình. Hy vọng có cơ hội cống hiến màu giọng đặc trưng này cho các tiết mục đặc sắc của CLB.',
    status: 'shortlisted',
    adminNote: 'Màu giọng dân ca ngọt ngào, cảm xúc rất sâu lắng.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-007',
    fullName: 'Hoàng Yến Nhi',
    email: 'yennhi.hoang@student.edu.vn',
    studentId: '24DH707890',
    castingDivision: 'traditional_dance',
    castingSong: 'Múa Dân Gian – Cò Lả',
    beatUrl: 'https://youtube.com/watch?v=sample_mua_dan_gian',
    hasPerformanceExperience: true,
    performanceUrl: 'https://tiktok.com/@yennhi_dance/video/987654321',
    passion: 'Em theo học múa dân gian và đương đại được 3 năm. Em muốn mang nét đẹp truyền thống kết hợp biểu diễn đương đại vào các sân khấu văn nghệ trẻ trung của HMC.',
    status: 'shortlisted',
    adminNote: 'Độ dẻo tốt, biểu cảm sân khấu xuất sắc. Rất tiềm năng cho ban Múa.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
]

// In-memory fallback cache
let memoryApps: ApplicationItem[] = [...INITIAL_SAMPLE_APPLICATIONS]

async function getStoredApplications(): Promise<ApplicationItem[]> {
  try {
    const store = getStore('hmc_recruitment_data')
    const data = await store.get('applications', { type: 'json' })
    if (Array.isArray(data) && data.length > 0) {
      memoryApps = data
      return data
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
    // 1. PUBLIC: POST /api/applications (CTV Registration)
    // ----------------------------------------------------
    if ((cleanPath === '' || cleanPath === '/') && method === 'POST') {
      const body = JSON.parse(event.body || '{}')

      const fullName = String(body.fullName || '').trim()
      const email = String(body.email || '').trim().toLowerCase()
      const studentId = String(body.studentId || '').trim().toUpperCase()
      const castingDivision = String(body.castingDivision || 'vocal').trim().toLowerCase()
      const castingSong = String(body.castingSong || '').trim()
      const beatUrl = String(body.beatUrl || '').trim()
      const hasPerformanceExperience = Boolean(body.hasPerformanceExperience)
      const performanceUrl = String(body.performanceUrl || '').trim()
      const passion = String(body.passion || '').trim()

      if (!fullName || !email || !studentId || !castingDivision || !castingSong || !beatUrl) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' }),
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
        castingDivision: castingDivision as any,
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

      const newApp: ApplicationItem = {
        id,
        fullName: String(body.fullName || 'Thí sinh mới').trim(),
        email: String(body.email || '').trim().toLowerCase(),
        studentId: String(body.studentId || '').trim().toUpperCase(),
        castingDivision: (body.castingDivision || 'vocal') as any,
        castingSong: String(body.castingSong || 'Chưa cập nhật').trim(),
        beatUrl: String(body.beatUrl || 'https://youtube.com').trim(),
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
