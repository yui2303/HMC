import { ApplicationItem } from './adminApi'
import { getClientApplications } from './clientStore'
import { getSavedEmailConfig } from './emailService'

export interface CastingShiftOption {
  id: string
  date: string // e.g. "2026-11-06"
  dateLabel: string // e.g. "Thứ Sáu, 06/11/2026"
  dayOfWeek: string // e.g. "Thứ Sáu"
  dayNumber: '01' | '02'
  session: 'morning' | 'afternoon'
  sessionLabel: string // e.g. "BUỔI SÁNG" | "BUỔI CHIỀU & TỐI"
  sessionTimeRange: string // e.g. "09g00 – 12g00"
  timeSlot: string // e.g. "09g00 – 10g00"
  timeSlotDescription?: string
  accentColor: 'cyan' | 'amber'
  maxCapacity?: number
}

export interface CastingShiftRegistration {
  id: string
  applicationId?: string
  fullName: string
  studentId: string
  email: string
  phone: string
  castingDivision: 'vocal' | 'dancer' | 'traditional_dance'
  castingSong?: string
  beatUrl?: string
  shiftId: string
  shiftDate: string
  shiftDayOfWeek: string
  shiftSession: string
  shiftTimeSlot: string
  fullShiftLabel: string
  note?: string
  registeredAt: string
}

// Danh sách các Ca & Khung giờ Casting chuẩn theo Lịch HMC
export const AVAILABLE_CASTING_SHIFTS: CastingShiftOption[] = [
  // ==========================================
  // NGÀY 01: THỨ SÁU - 06/11/2026
  // ==========================================
  // Ca Sáng: 09g00 - 12g00
  {
    id: 'day1-morning-slot1',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '09g00 – 10g00',
    timeSlotDescription: 'Ca sáng sớm (Phù hợp bạn học chiều)',
    accentColor: 'cyan',
    maxCapacity: 15,
  },
  {
    id: 'day1-morning-slot2',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '10g00 – 11g00',
    timeSlotDescription: 'Ca giữa buổi sáng',
    accentColor: 'cyan',
    maxCapacity: 15,
  },
  {
    id: 'day1-morning-slot3',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '11g00 – 12g00',
    timeSlotDescription: 'Ca cuối buổi sáng',
    accentColor: 'cyan',
    maxCapacity: 15,
  },
  {
    id: 'day1-morning-full',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: 'Trọn ca sáng (09g00 – 12g00)',
    timeSlotDescription: 'Linh hoạt đến trong buổi sáng',
    accentColor: 'cyan',
    maxCapacity: 20,
  },

  // Ca Chiều & Tối: 13g30 - 20g00
  {
    id: 'day1-afternoon-slot1',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU & TỐI',
    sessionTimeRange: '13g30 – 20g00',
    timeSlot: '13g30 – 15g30',
    timeSlotDescription: 'Ca đầu giờ chiều',
    accentColor: 'cyan',
    maxCapacity: 20,
  },
  {
    id: 'day1-afternoon-slot2',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU & TỐI',
    sessionTimeRange: '13g30 – 20g00',
    timeSlot: '15g30 – 17g30',
    timeSlotDescription: 'Ca cuối buổi chiều',
    accentColor: 'cyan',
    maxCapacity: 20,
  },
  {
    id: 'day1-afternoon-slot3',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU & TỐI',
    sessionTimeRange: '13g30 – 20g00',
    timeSlot: '17g30 – 20g00',
    timeSlotDescription: 'Ca tối sau giờ học',
    accentColor: 'cyan',
    maxCapacity: 25,
  },
  {
    id: 'day1-afternoon-full',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU & TỐI',
    sessionTimeRange: '13g30 – 20g00',
    timeSlot: 'Trọn ca chiều & tối (13g30 – 20g00)',
    timeSlotDescription: 'Linh hoạt đến trong buổi chiều/tối',
    accentColor: 'cyan',
    maxCapacity: 30,
  },

  // ==========================================
  // NGÀY 02: THỨ BẢY - 07/11/2026
  // ==========================================
  // Ca Sáng: 09g00 - 12g00
  {
    id: 'day2-morning-slot1',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '09g00 – 10g00',
    timeSlotDescription: 'Ca sáng sớm cuối tuần',
    accentColor: 'amber',
    maxCapacity: 15,
  },
  {
    id: 'day2-morning-slot2',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '10g00 – 11g00',
    timeSlotDescription: 'Ca giữa buổi sáng',
    accentColor: 'amber',
    maxCapacity: 15,
  },
  {
    id: 'day2-morning-slot3',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '11g00 – 12g00',
    timeSlotDescription: 'Ca cuối buổi sáng',
    accentColor: 'amber',
    maxCapacity: 15,
  },
  {
    id: 'day2-morning-full',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: 'Trọn ca sáng (09g00 – 12g00)',
    timeSlotDescription: 'Linh hoạt đến trong buổi sáng',
    accentColor: 'amber',
    maxCapacity: 20,
  },

  // Ca Chiều: 13g30 - 17g00
  {
    id: 'day2-afternoon-slot1',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU',
    sessionTimeRange: '13g30 – 17g00',
    timeSlot: '13g30 – 15g00',
    timeSlotDescription: 'Ca đầu buổi chiều',
    accentColor: 'amber',
    maxCapacity: 20,
  },
  {
    id: 'day2-afternoon-slot2',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU',
    sessionTimeRange: '13g30 – 17g00',
    timeSlot: '15g00 – 17g00',
    timeSlotDescription: 'Ca cuối buổi chiều đợt 2',
    accentColor: 'amber',
    maxCapacity: 20,
  },
  {
    id: 'day2-afternoon-full',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU',
    sessionTimeRange: '13g30 – 17g00',
    timeSlot: 'Trọn ca chiều (13g30 – 17g00)',
    timeSlotDescription: 'Linh hoạt đến trong buổi chiều',
    accentColor: 'amber',
    maxCapacity: 25,
  },
]

const SHIFT_STORAGE_KEY = 'hmc_casting_shift_registrations_v1'

/**
 * Lấy danh sách tất cả các bạn đã đăng ký ca casting
 */
export function getStoredShiftRegistrations(): CastingShiftRegistration[] {
  try {
    const raw = localStorage.getItem(SHIFT_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Lưu danh sách đăng ký ca casting vào local storage
 */
export function persistShiftRegistrations(list: CastingShiftRegistration[]): void {
  try {
    localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(list))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hmc_shift_registrations_updated', { detail: list }))
    }
  } catch (err) {
    console.error('Failed to persist shift registrations:', err)
  }
}

/**
 * Tra cứu thông tin hồ sơ theo MSSV, Email hoặc Họ Tên từ kho dữ liệu ứng tuyển đã nộp
 */
export function lookupCandidateInfo(query: string): ApplicationItem | null {
  const cleanQ = query.trim().toLowerCase()
  if (!cleanQ || cleanQ.length < 2) return null

  const apps = getClientApplications()
  // Ưu tiên khớp chính xác MSSV hoặc Email
  const exactMatch = apps.find(
    (a) => a.studentId.toLowerCase() === cleanQ || a.email.toLowerCase() === cleanQ
  )
  if (exactMatch) return exactMatch

  // Khớp gần đúng (bắt đầu bằng MSSV hoặc Họ tên chứa từ khóa)
  const partialMatch = apps.find(
    (a) =>
      a.studentId.toLowerCase().includes(cleanQ) ||
      a.fullName.toLowerCase().includes(cleanQ) ||
      a.email.toLowerCase().includes(cleanQ)
  )
  return partialMatch || null
}

/**
 * Tìm kiếm danh sách gợi ý ứng viên (autocomplete) khi nhập ô tra cứu
 */
export function searchCandidateSuggestions(query: string, limit = 5): ApplicationItem[] {
  const cleanQ = query.trim().toLowerCase()
  if (!cleanQ || cleanQ.length < 2) return []

  const apps = getClientApplications()
  return apps
    .filter(
      (a) =>
        a.studentId.toLowerCase().includes(cleanQ) ||
        a.fullName.toLowerCase().includes(cleanQ) ||
        a.email.toLowerCase().includes(cleanQ)
    )
    .slice(0, limit)
}

/**
 * Đếm số lượng thí sinh đã đăng ký theo từng ca casting
 */
export function getShiftRegistrationCounts(): Record<string, number> {
  const list = getStoredShiftRegistrations()
  const counts: Record<string, number> = {}
  list.forEach((reg) => {
    counts[reg.shiftId] = (counts[reg.shiftId] || 0) + 1
  })
  return counts
}

/**
 * Kiểm tra xem một thí sinh (theo MSSV hoặc Email) đã đăng ký ca hay chưa
 */
export function findExistingRegistration(
  studentId: string,
  email: string
): CastingShiftRegistration | null {
  const list = getStoredShiftRegistrations()
  const cleanId = studentId.trim().toUpperCase()
  const cleanEmail = email.trim().toLowerCase()

  return (
    list.find(
      (r) =>
        (cleanId && r.studentId.trim().toUpperCase() === cleanId) ||
        (cleanEmail && r.email.trim().toLowerCase() === cleanEmail)
    ) || null
  )
}

/**
 * Ghi nhận lượt đăng ký ca casting vào Sheet Excel & Hệ thống
 */
export async function submitCastingShiftRegistration(
  data: Omit<CastingShiftRegistration, 'id' | 'registeredAt'>
): Promise<{ success: boolean; id: string; message: string; sheetSynced: boolean }> {
  const now = new Date().toISOString()
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  const id = `CA-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`

  const newRegistration: CastingShiftRegistration = {
    ...data,
    id,
    registeredAt: now,
  }

  // 1. Lưu vào LocalStorage (Cập nhật nếu đã có cùng MSSV/Email)
  const existingList = getStoredShiftRegistrations()
  const existingIndex = existingList.findIndex(
    (r) =>
      r.studentId.trim().toUpperCase() === data.studentId.trim().toUpperCase() ||
      r.email.trim().toLowerCase() === data.email.trim().toLowerCase()
  )

  let updatedList: CastingShiftRegistration[]
  if (existingIndex >= 0) {
    updatedList = [...existingList]
    updatedList[existingIndex] = { ...newRegistration, id: existingList[existingIndex].id }
  } else {
    updatedList = [newRegistration, ...existingList]
  }

  persistShiftRegistrations(updatedList)

  // 2. Đồng bộ trực tiếp vào Google Sheet qua Webhook
  let sheetSynced = false
  const fallbackWebhook =
    'https://script.google.com/macros/s/AKfycbzpEErb2FDabdq7MXR0WwoMZ1GKUF4G4ML7XUQEuEfJyUp3oa-zkezxsIIJrt3PpjYQWA/exec'
  const emailConfig = getSavedEmailConfig()
  const webhookUrl = (
    emailConfig.webhookUrl?.trim() ||
    (import.meta.env.VITE_WEBHOOK_URL as string)?.trim() ||
    fallbackWebhook
  ).trim()

  if (webhookUrl) {
    const divisionLabel =
      data.castingDivision === 'vocal'
        ? 'Hát (Vocal)'
        : data.castingDivision === 'dancer'
        ? 'Nhảy (Dance)'
        : 'Múa (Traditional / Contemporary)'

    const payload = {
      action: 'register_shift',
      type: 'casting_shift_registration',
      sheetName: 'Đăng Ký Ca Casting',
      skipEmail: true,
      sendEmail: false,
      id: newRegistration.id,
      fullName: data.fullName,
      studentId: data.studentId,
      email: data.email,
      phone: data.phone,
      castingDivision: divisionLabel,
      castingSong: data.castingSong || 'Chưa điền (Bổ sung khi casting)',
      beatUrl: data.beatUrl || 'Nộp beat tại bàn Check-in',
      shiftDate: data.shiftDate,
      shiftDayOfWeek: data.shiftDayOfWeek,
      shiftSession: data.shiftSession,
      shiftTimeSlot: data.shiftTimeSlot,
      fullShiftLabel: data.fullShiftLabel,
      note: data.note || '',
      registeredAt: new Date(now).toLocaleString('vi-VN'),
      candidate: {
        id: data.applicationId || newRegistration.id,
        fullName: data.fullName,
        studentId: data.studentId,
        email: data.email,
        phone: data.phone,
        castingDivision: divisionLabel,
        castingSong: data.castingSong || '',
        beatUrl: data.beatUrl || '',
        hasPerformanceExperience: true,
        performanceUrl: '',
        passion: `[ĐÃ CHỌN CA CASTING]: ${data.fullShiftLabel} | SĐT: ${data.phone} | Ghi chú: ${data.note || 'Không'}`,
      },
      timestamp: now,
    }

    try {
      // Netlify function proxy nếu có
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'webhook',
          webhookUrl,
          to: data.email,
          ...payload,
        }),
      }).catch(() => {})

      // Gửi thẳng Google Apps Script Webhook
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
      sheetSynced = true
    } catch (err) {
      console.warn('Webhook sync error for shift registration:', err)
    }
  }

  // 3. Cập nhật vào danh sách Application trong clientStore (ghi chú admin)
  try {
    const apps = getClientApplications()
    const targetApp = apps.find(
      (a) =>
        a.studentId.trim().toUpperCase() === data.studentId.trim().toUpperCase() ||
        a.email.trim().toLowerCase() === data.email.trim().toLowerCase()
    )
    if (targetApp) {
      targetApp.adminNote = `[Ca Casting: ${data.fullShiftLabel} | SĐT: ${data.phone}] ${targetApp.adminNote || ''}`.trim()
      localStorage.setItem('hmc_recruitment_store_v1', JSON.stringify(apps))
    }
  } catch {
    // ignore
  }

  return {
    success: true,
    id: newRegistration.id,
    message: 'Đăng ký ca casting thành công! Thông tin đã được ghi nhận vào hệ thống.',
    sheetSynced,
  }
}

/**
 * Xuất toàn bộ danh sách đăng ký ca casting ra file Excel/CSV chuẩn UTF-8
 * Mở trực tiếp trên Microsoft Excel không bị lỗi font tiếng Việt.
 */
export function exportShiftRegistrationsCsv(
  items?: CastingShiftRegistration[]
): void {
  const registrations = items || getStoredShiftRegistrations()
  if (registrations.length === 0) {
    alert('Hiện chưa có dữ liệu đăng ký ca casting nào để xuất file.')
    return
  }

  const headers = [
    'STT',
    'Mã Đăng Ký',
    'Thời Gian Ghi Nhận',
    'Họ Và Tên',
    'MSSV',
    'Email',
    'Số Điện Thoại',
    'Mảng Casting',
    'Ngày Casting',
    'Thứ',
    'Buổi',
    'Khung Giờ Lựa Chọn',
    'Chi Tiết Ca Đầy Đủ',
    'Bài Hát / Tiết Mục',
    'Link Beat / Nhạc Nền',
    'Ghi Chú',
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

  const rows = registrations.map((r, index) => [
    index + 1,
    `"${r.id}"`,
    `"${new Date(r.registeredAt).toLocaleString('vi-VN')}"`,
    `"${r.fullName.replace(/"/g, '""')}"`,
    `"${r.studentId}"`,
    `"${r.email}"`,
    `"${r.phone || ''}"`,
    `"${getDivisionLabel(r.castingDivision)}"`,
    `"${r.shiftDate}"`,
    `"${r.shiftDayOfWeek}"`,
    `"${r.shiftSession}"`,
    `"${r.shiftTimeSlot}"`,
    `"${r.fullShiftLabel.replace(/"/g, '""')}"`,
    `"${(r.castingSong || '').replace(/"/g, '""')}"`,
    `"${(r.beatUrl || '').replace(/"/g, '""')}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
  ])

  // Thêm UTF-8 BOM (\uFEFF) để Excel trên Windows hiển thị đúng 100% tiếng Việt
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `HMC_Danh_Sach_Dang_Ky_Ca_Casting_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
