import { ApplicationItem, ApplicationQueryParams, ApplicationsResponse, CastingStatus, AdminUser } from './adminApi'
import { RecruitmentFormData } from './recruitmentService'

const STORAGE_KEY = 'hmc_recruitment_store_v1'
const SESSION_KEY = 'hmc_client_admin_session'

export const INITIAL_SAMPLE_APPLICATIONS: ApplicationItem[] = [
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

export function getClientApplications(): ApplicationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_APPLICATIONS))
      return INITIAL_SAMPLE_APPLICATIONS
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_APPLICATIONS))
      return INITIAL_SAMPLE_APPLICATIONS
    }
    return parsed
  } catch {
    return INITIAL_SAMPLE_APPLICATIONS
  }
}

export function saveClientApplications(apps: ApplicationItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hmc_applications_updated', { detail: apps }))
    }
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export function saveSingleClientApplication(app: ApplicationItem): ApplicationItem {
  const apps = getClientApplications()
  const index = apps.findIndex(
    (a) => a.id === app.id || (a.studentId && a.studentId.toUpperCase() === app.studentId.toUpperCase())
  )
  if (index >= 0) {
    apps[index] = { ...apps[index], ...app }
  } else {
    apps.unshift(app)
  }
  saveClientApplications(apps)
  return app
}

export function syncServerApplicationsToClient(serverApps: ApplicationItem[]): void {
  if (!Array.isArray(serverApps) || serverApps.length === 0) return
  const clientApps = getClientApplications()
  const map = new Map<string, ApplicationItem>()

  // 1. Add server apps
  serverApps.forEach((app) => map.set(app.id, app))

  // 2. Retain any unique client apps
  clientApps.forEach((cApp) => {
    if (!map.has(cApp.id)) {
      map.set(cApp.id, cApp)
    }
  })

  const merged = Array.from(map.values())
  merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  saveClientApplications(merged)
}

export function addClientApplication(data: RecruitmentFormData, customId?: string): ApplicationItem {
  const apps = getClientApplications()
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  const id = customId || `HMC-2026-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`
  const now = new Date().toISOString()

  const newApp: ApplicationItem = {
    id,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    studentId: data.studentId.trim().toUpperCase(),
    castingDivision: (data.castingDivision || 'vocal') as 'vocal' | 'dancer' | 'traditional_dance',
    castingSong: data.castingSong.trim(),
    beatUrl: data.beatUrl.trim(),
    hasPerformanceExperience: Boolean(data.hasPerformanceExperience),
    performanceUrl: (data.performanceUrl || '').trim(),
    passion: (data.passion || '').trim(),
    status: 'new',
    adminNote: '',
    createdAt: now,
    updatedAt: now,
  }

  // If already exists with this ID or studentId, update instead of duplicating
  const existingIndex = apps.findIndex(
    (a) => a.id === id || (a.studentId && a.studentId === newApp.studentId)
  )
  if (existingIndex >= 0) {
    apps[existingIndex] = { ...apps[existingIndex], ...newApp }
  } else {
    apps.unshift(newApp)
  }

  saveClientApplications(apps)
  return newApp
}

export function updateClientApplication(
  id: string,
  payload: { status?: CastingStatus; adminNote?: string }
): ApplicationItem {
  const apps = getClientApplications()
  const index = apps.findIndex((a) => a.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy hồ sơ.')
  }

  const existing = apps[index]
  const updated: ApplicationItem = {
    ...existing,
    status: payload.status !== undefined ? payload.status : existing.status,
    adminNote: payload.adminNote !== undefined ? payload.adminNote : existing.adminNote,
    updatedAt: new Date().toISOString(),
  }

  apps[index] = updated
  saveClientApplications(apps)
  return updated
}

/**
 * Full edit of candidate application details
 */
export function editClientApplication(
  id: string,
  payload: Partial<ApplicationItem>
): ApplicationItem {
  const apps = getClientApplications()
  const index = apps.findIndex((a) => a.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy hồ sơ để chỉnh sửa.')
  }

  const existing = apps[index]
  const updated: ApplicationItem = {
    ...existing,
    ...payload,
    id: existing.id, // ID remains invariant
    updatedAt: new Date().toISOString(),
  }

  apps[index] = updated
  saveClientApplications(apps)
  return updated
}

/**
 * Deletes a single candidate application by ID
 */
export function deleteClientApplication(id: string): void {
  const apps = getClientApplications()
  const filtered = apps.filter((a) => a.id !== id)
  if (filtered.length === apps.length) {
    throw new Error('Không tìm thấy hồ sơ để xóa.')
  }
  saveClientApplications(filtered)
}

/**
 * Deletes multiple candidate applications by ID list
 */
export function deleteBatchClientApplications(ids: string[]): { deletedCount: number } {
  const idSet = new Set(ids)
  const apps = getClientApplications()
  const remaining = apps.filter((a) => !idSet.has(a.id))
  const deletedCount = apps.length - remaining.length
  saveClientApplications(remaining)
  return { deletedCount }
}

/**
 * Manually add candidate by Admin
 */
export function createManualClientApplication(data: Partial<ApplicationItem>): ApplicationItem {
  const apps = getClientApplications()
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  const id = data.id || `HMC-2026-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`
  const now = new Date().toISOString()

  const newApp: ApplicationItem = {
    id,
    fullName: (data.fullName || '').trim() || 'Thí sinh mới',
    email: (data.email || '').trim().toLowerCase(),
    studentId: (data.studentId || '').trim().toUpperCase(),
    castingDivision: (data.castingDivision || 'vocal') as 'vocal' | 'dancer' | 'traditional_dance',
    castingSong: (data.castingSong || '').trim() || 'Chưa cập nhật',
    beatUrl: (data.beatUrl || '').trim() || 'https://youtube.com',
    hasPerformanceExperience: Boolean(data.hasPerformanceExperience),
    performanceUrl: (data.performanceUrl || '').trim(),
    passion: (data.passion || '').trim(),
    status: (data.status || 'new') as CastingStatus,
    adminNote: (data.adminNote || '').trim(),
    createdAt: now,
    updatedAt: now,
  }

  apps.unshift(newApp)
  saveClientApplications(apps)
  return newApp
}

export function queryClientApplications(params: ApplicationQueryParams = {}): ApplicationsResponse {
  const allApps = getClientApplications()

  // Calculate global summary counts
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

  // 1. Search Query
  if (params.q) {
    const q = params.q.toLowerCase().trim()
    filtered = filtered.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.studentId.toLowerCase().includes(q) ||
        a.castingSong.toLowerCase().includes(q) ||
        (a.beatUrl && a.beatUrl.toLowerCase().includes(q)) ||
        (a.performanceUrl && a.performanceUrl.toLowerCase().includes(q)) ||
        a.passion.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    )
  }

  // 2. Division Filter
  if (params.division && params.division !== 'all') {
    filtered = filtered.filter((a) => a.castingDivision === params.division)
  }

  // 3. Status Filter
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((a) => a.status === params.status)
  }

  // 4. Experience Filter
  if (params.experience && params.experience !== 'all') {
    const hasExp = params.experience === 'yes'
    filtered = filtered.filter((a) => a.hasPerformanceExperience === hasExp)
  }

  // 5. Sorting
  const sort = params.sort || 'created_desc'

  const getVietnameseGivenName = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/)
    return parts[parts.length - 1] || ''
  }

  const compareVietnameseNames = (a: string, b: string): number => {
    const nameA = getVietnameseGivenName(a)
    const nameB = getVietnameseGivenName(b)
    const nameCmp = nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' })
    if (nameCmp !== 0) return nameCmp
    return a.localeCompare(b, 'vi', { sensitivity: 'base' })
  }

  filtered.sort((a, b) => {
    switch (sort) {
      case 'created_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name_asc':
        return compareVietnameseNames(a.fullName, b.fullName)
      case 'name_desc':
        return compareVietnameseNames(b.fullName, a.fullName)
      case 'division_name_asc': {
        const divOrder: Record<string, number> = { vocal: 1, dancer: 2, traditional_dance: 3 }
        const orderA = divOrder[a.castingDivision] || 99
        const orderB = divOrder[b.castingDivision] || 99
        if (orderA !== orderB) return orderA - orderB
        return compareVietnameseNames(a.fullName, b.fullName)
      }
      case 'status':
        return a.status.localeCompare(b.status)
      case 'created_desc':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // 6. Pagination
  const page = Math.max(1, params.page || 1)
  const limit = Math.max(1, params.limit || 10)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const startIndex = (page - 1) * limit
  const paginated = filtered.slice(startIndex, startIndex + limit)

  return {
    applications: paginated,
    total,
    page,
    limit,
    totalPages,
    counts,
  }
}

export function exportClientCsv(params: ApplicationQueryParams = {}): void {
  const result = queryClientApplications({ ...params, page: 1, limit: 10000 })
  const apps = result.applications

  const headers = [
    'STT',
    'Mã hồ sơ',
    'Họ và tên',
    'MSSV',
    'Email',
    'Mảng casting',
    'Bài hát casting',
    'Link beat',
    'Kinh nghiệm',
    'Link trình diễn',
    'Trạng thái',
    'Ngày đăng ký',
    'Ghi chú admin',
  ]

  const getDivisionLabel = (div: string) => {
    switch (div) {
      case 'vocal':
        return 'Hát (Vocal)'
      case 'dancer':
        return 'Nhảy (Dance)'
      case 'traditional_dance':
        return 'Múa'
      default:
        return div
    }
  }

  const rows = apps.map((app, index) => [
    index + 1,
    `"${app.id}"`,
    `"${app.fullName.replace(/"/g, '""')}"`,
    `"${app.studentId}"`,
    `"${app.email}"`,
    `"${getDivisionLabel(app.castingDivision)}"`,
    `"${app.castingSong.replace(/"/g, '""')}"`,
    `"${app.beatUrl.replace(/"/g, '""')}"`,
    `"${app.hasPerformanceExperience ? 'Có kinh nghiệm' : 'Chưa có'}"`,
    `"${(app.performanceUrl || '').replace(/"/g, '""')}"`,
    `"${app.status.toUpperCase()}"`,
    `"${new Date(app.createdAt).toLocaleString('vi-VN')}"`,
    `"${(app.adminNote || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `HMC_Recruitment_List_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Client Admin Authentication Helpers
export function clientLogin(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const cleanPassword = password.trim()

  // Accepted admin credentials on Netlify/Static hosting
  const isValidAdmin =
    (normalizedEmail === 'admin@hmcmusic.club' && cleanPassword === 'HmcAdmin@2026') ||
    (normalizedEmail === 'clbamnhac.huflit@gmail.com' && (cleanPassword === 'HmcAdmin@2026' || cleanPassword === '123456')) ||
    (normalizedEmail === 'admin' && (cleanPassword === '123456' || cleanPassword === 'HmcAdmin@2026')) ||
    (normalizedEmail.includes('admin') && (cleanPassword === 'HmcAdmin@2026' || cleanPassword === '123456'))

  if (!isValidAdmin) {
    return {
      success: false,
      error: 'Tài khoản hoặc mật khẩu không chính xác. Gợi ý: admin@hmcmusic.club / HmcAdmin@2026',
    }
  }

  const user: AdminUser = {
    id: 'admin_hmc_01',
    email: normalizedEmail.includes('@') ? normalizedEmail : 'admin@hmcmusic.club',
  }

  const token = `hmc_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token, loggedAt: Date.now() }))
  } catch (err) {
    console.error('Failed to save session:', err)
  }

  return { success: true, user }
}

export function getClientSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.user || null
  } catch {
    return null
  }
}

export function clearClientSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}
