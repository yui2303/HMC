import { ApplicationItem, ApplicationQueryParams, ApplicationsResponse, CastingStatus, AdminUser } from './adminApi'
import { RecruitmentFormData } from './recruitmentService'
import { EMAILJS_BACKFILLED_CANDIDATES } from '../data/emailjsCandidates'

const STORAGE_KEY = 'hmc_recruitment_store_v1'
const SESSION_KEY = 'hmc_client_admin_session'

export const INITIAL_SAMPLE_APPLICATIONS: ApplicationItem[] = [
  ...EMAILJS_BACKFILLED_CANDIDATES,
]

export function getClientApplications(): ApplicationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    let list: ApplicationItem[] = []
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) list = parsed
      } catch {
        // ignore
      }
    }

    // Purge any old fake sample applications (HMC-2026-001..008 or @student.edu.vn demo emails)
    list = list.filter((a) => !a.id.startsWith('HMC-2026-00') && !a.email.endsWith('@student.edu.vn'))

    // Ensure all stored applications have a valid castingDivision (fix previously corrupted entries)
    list = list.map((a: ApplicationItem) => {
      let div = (a.castingDivision as string) || ''
      if (div !== 'vocal' && div !== 'dancer' && div !== 'traditional_dance') {
        const raw = div.toLowerCase()
        if (raw === 'dancer' || raw === 'dance' || raw.includes('nhảy') || raw.includes('nhay')) {
          div = 'dancer'
        } else if (raw === 'traditional_dance' || raw.includes('múa') || raw.includes('mua')) {
          div = 'traditional_dance'
        } else {
          div = 'vocal'
        }
      }
      return {
        ...a,
        castingDivision: div as 'vocal' | 'dancer' | 'traditional_dance',
      }
    })

    // Merge seed candidates (real 62 candidates from EmailJS) with stored data
    const map = new Map<string, ApplicationItem>()
    list.forEach((a) => map.set(a.id, a))
    INITIAL_SAMPLE_APPLICATIONS.forEach((a) => {
      const existing = map.get(a.id)
      if (!existing) {
        map.set(a.id, a)
      } else {
        map.set(a.id, {
          ...a,
          castingDivision: existing.castingDivision || a.castingDivision || 'vocal',
          status: existing.status || a.status,
          adminNote: existing.adminNote || a.adminNote,
          updatedAt: existing.updatedAt || a.updatedAt,
        })
      }
    })

    const merged = Array.from(map.values())
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return merged
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

  let normalizedDivision: 'vocal' | 'dancer' | 'traditional_dance' = 'vocal'
  const rawDiv = String(data.castingDivision || '').trim().toLowerCase()
  if (rawDiv === 'dancer' || rawDiv === 'dance' || rawDiv.includes('nhảy') || rawDiv.includes('nhay')) {
    normalizedDivision = 'dancer'
  } else if (rawDiv === 'traditional_dance' || rawDiv.includes('múa') || rawDiv.includes('mua') || rawDiv.includes('traditional')) {
    normalizedDivision = 'traditional_dance'
  } else {
    normalizedDivision = 'vocal'
  }

  const newApp: ApplicationItem = {
    id,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    studentId: data.studentId.trim().toUpperCase(),
    castingDivision: normalizedDivision,
    castingSong: (data.castingSong || '').trim() || 'Chưa điền (bổ sung khi casting)',
    beatUrl: (data.beatUrl || '').trim() || 'Nộp beat tại bàn Check-in Casting',
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
    castingSong: (data.castingSong || '').trim() || 'Chưa điền (bổ sung khi casting)',
    beatUrl: (data.beatUrl || '').trim() || 'Nộp beat tại bàn Check-in Casting',
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
