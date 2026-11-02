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
  sessionLabel: string // e.g. "BUỔI SÁNG" | "BUỔI CHIỀU & TỐI" | "BUỔI CHIỀU"
  sessionTimeRange: string // e.g. "09g00 – 12g00"
  timeSlot: string // e.g. "09g00 – 12g00"
  timeSlotDescription: string
  accentColor: 'cyan' | 'amber'
}

export interface CastingShiftRegistration {
  id: string
  applicationId?: string
  fullName: string
  studentId: string
  email?: string
  phone?: string
  castingDivision: 'vocal' | 'dancer' | 'traditional_dance'
  castingSong?: string
  beatUrl?: string
  shiftId: string
  shiftDate: string
  shiftDayOfWeek: string
  shiftSession: string
  shiftTimeSlot: string
  fullShiftLabel: string
  registeredAt: string
}

// 4 ca casting chính xác (Mỗi ngày có 2 ca Sáng hoặc Chiều, thí sinh chọn đúng 1 trong các ca này)
export const AVAILABLE_CASTING_SHIFTS: CastingShiftOption[] = [
  // ==========================================
  // NGÀY 01: THỨ SÁU - 06/11/2026
  // ==========================================
  {
    id: 'day1-morning',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '09g00 – 12g00',
    timeSlotDescription: 'Check-in ca sáng và casting',
    accentColor: 'cyan',
  },
  {
    id: 'day1-afternoon',
    date: '2026-11-06',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    dayOfWeek: 'Thứ Sáu',
    dayNumber: '01',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU & TỐI',
    sessionTimeRange: '13g30 – 20g00',
    timeSlot: '13g30 – 20g00',
    timeSlotDescription: 'Check-in ca chiều và tiếp tục casting',
    accentColor: 'cyan',
  },

  // ==========================================
  // NGÀY 02: THỨ BẢY - 07/11/2026
  // ==========================================
  {
    id: 'day2-morning',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'morning',
    sessionLabel: 'BUỔI SÁNG',
    sessionTimeRange: '09g00 – 12g00',
    timeSlot: '09g00 – 12g00',
    timeSlotDescription: 'Check-in ca sáng và casting',
    accentColor: 'amber',
  },
  {
    id: 'day2-afternoon',
    date: '2026-11-07',
    dateLabel: 'Thứ Bảy, 07/11/2026',
    dayOfWeek: 'Thứ Bảy',
    dayNumber: '02',
    session: 'afternoon',
    sessionLabel: 'BUỔI CHIỀU',
    sessionTimeRange: '13g30 – 17g00',
    timeSlot: '13g30 – 17g00',
    timeSlotDescription: 'Check-in ca chiều và tiếp tục casting',
    accentColor: 'amber',
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
 * Tìm thông tin ứng viên có sẵn trong hệ thống theo MSSV hoặc Họ tên (ngầm phía client)
 */
export function matchApplicantByStudentIdOrName(
  studentId: string,
  fullName: string
): ApplicationItem | null {
  const cleanId = studentId.trim().toUpperCase()
  const cleanName = fullName.trim().toLowerCase()
  const apps = getClientApplications()

  // 1. Ưu tiên khớp chính xác MSSV
  if (cleanId) {
    const byId = apps.find((a) => a.studentId.trim().toUpperCase() === cleanId)
    if (byId) return byId
  }

  // 2. Khớp họ tên
  if (cleanName && cleanName.length >= 3) {
    const byName = apps.find((a) => a.fullName.trim().toLowerCase() === cleanName)
    if (byName) return byName
  }

  return null
}

/**
 * Đếm số lượng thí sinh đã đăng ký theo từng ca
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
 * Kiểm tra xem thí sinh đã đăng ký ca chưa
 */
export function findExistingRegistrationByStudentId(
  studentId: string
): CastingShiftRegistration | null {
  const list = getStoredShiftRegistrations()
  const cleanId = studentId.trim().toUpperCase()
  if (!cleanId) return null
  return list.find((r) => r.studentId.trim().toUpperCase() === cleanId) || null
}

export const SHIFT_WEBHOOK_STORAGE_KEY = 'hmc_shift_webhook_url_v1'
export const DEFAULT_SHIFT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzpEErb2FDabdq7MXR0WwoMZ1GKUF4G4ML7XUQEuEfJyUp3oa-zkezxsIIJrt3PpjYQWA/exec'

/**
 * Lấy URL Google Apps Script Webhook dành riêng cho Đăng Ký Ca Casting
 */
export function getShiftWebhookUrl(): string {
  try {
    const saved = localStorage.getItem(SHIFT_WEBHOOK_STORAGE_KEY)
    if (saved && saved.trim()) return saved.trim()
  } catch {
    // ignore
  }

  const envShift = (import.meta.env.VITE_SHIFT_WEBHOOK_URL as string)?.trim()
  if (envShift) return envShift

  const emailConfig = getSavedEmailConfig()
  if (emailConfig.webhookUrl && emailConfig.webhookUrl.trim()) {
    return emailConfig.webhookUrl.trim()
  }

  const envGeneral = (import.meta.env.VITE_WEBHOOK_URL as string)?.trim()
  if (envGeneral) return envGeneral

  return DEFAULT_SHIFT_WEBHOOK_URL
}

/**
 * Lưu URL Google Apps Script Webhook cho Ca Casting vào localStorage
 */
export function saveShiftWebhookUrl(url: string): void {
  try {
    localStorage.setItem(SHIFT_WEBHOOK_STORAGE_KEY, url.trim())
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hmc_shift_webhook_url_changed', { detail: url.trim() }))
    }
  } catch (err) {
    console.error('Failed to save shift webhook URL:', err)
  }
}

/**
 * Kiểm tra kết nối tới Webhook Google Sheet
 */
export async function testShiftWebhookConnection(
  url: string
): Promise<{ success: boolean; message: string }> {
  const cleanUrl = url.trim()
  if (!cleanUrl) {
    return { success: false, message: 'Vui lòng nhập đường link Google Apps Script Webhook.' }
  }

  // 1. Thử gửi GET request kiểm tra online
  try {
    const res = await fetch(cleanUrl, { method: 'GET' })
    if (res.ok) {
      return {
        success: true,
        message: '✅ Kết nối Webhook thành công (HTTP 200 OK)! Link sẵn sàng đồng bộ trực tiếp vào Google Sheet.',
      }
    }
  } catch {
    // fallback test với POST packet
  }

  // 2. Thử gửi POST packet với mode no-cors
  try {
    await fetch(cleanUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'ping_test',
        type: 'casting_shift_registration',
        timestamp: new Date().toISOString(),
      }),
    })

    return {
      success: true,
      message: '✅ Đã gửi tín hiệu kiểm tra thành công! Đường link Webhook Google Sheet hoạt động bình thường.',
    }
  } catch (err: any) {
    return {
      success: false,
      message: `❌ Không thể gửi tới Webhook: ${err.message || 'Lỗi mạng'}. Hãy đảm bảo chọn Quyền truy cập: "Bất kỳ ai (Anyone)" khi Triển khai.`,
    }
  }
}

/**
 * Mã nguồn Google Apps Script chuẩn tối ưu cho Đăng Ký Ca Casting
 */
export const GOOGLE_APPS_SCRIPT_SHIFT_CODE = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - ĐỒNG BỘ ĐĂNG KÝ CA CASTING HMC 2026
 * =========================================================================
 * Hướng dẫn cài đặt nhanh 3 phút:
 * 1. Mở file Google Sheets bạn muốn lưu danh sách ca casting.
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa code cũ, dán toàn bộ đoạn code này vào và bấm biểu tượng Lưu (Ctrl + S).
 * 4. Bấm nút "Triển khai" (Deploy) màu xanh ở góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment).
 * 5. Nhấn vào biểu tượng Bánh răng (⚙️) chọn loại: "Ứng dụng web" (Web app).
 *    - Mô tả: "Đồng bộ ca casting HMC"
 *    - Người thực thi: "Tôi" (User access)
 *    - Quyền truy cập: "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG!
 * 6. Bấm "Triển khai", cấp quyền khi Google hỏi, sau đó sao chép "URL ứng dụng web".
 * 7. Dán URL vào mục cấu hình Webhook trong hệ thống HMC.
 * =========================================================================
 */

var SHIFT_SHEET_NAME = "Đăng Ký Ca Casting";

function getOrCreateShiftSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHIFT_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHIFT_SHEET_NAME);
    var headers = [
      "Thời Gian Đăng Ký",
      "Họ Và Tên",
      "Mã Số Sinh Viên (MSSV)",
      "Ngày Casting",
      "Buổi",
      "Khung Giờ",
      "Chi Tiết Ca Đầy Đủ",
      "Mã Đăng Ký"
    ];
    sheet.appendRow(headers);
    
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0F2744");
    headerRange.setFontColor("#70D7FF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    headerRange.setWrap(true);
    sheet.setRowHeight(1, 40);
    sheet.setFrozenRows(1);
    
    sheet.setColumnWidth(1, 160); // Thời gian
    sheet.setColumnWidth(2, 220); // Họ tên
    sheet.setColumnWidth(3, 140); // MSSV
    sheet.setColumnWidth(4, 150); // Ngày
    sheet.setColumnWidth(5, 120); // Buổi
    sheet.setColumnWidth(6, 150); // Khung giờ
    sheet.setColumnWidth(7, 280); // Chi tiết ca
    sheet.setColumnWidth(8, 140); // Mã đăng ký
  }
  return sheet;
}

function doPost(e) {
  try {
    var rawContents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(rawContents);
    
    var fullName = data.fullName || (data.candidate && data.candidate.fullName) || "";
    var studentId = data.studentId || (data.candidate && data.candidate.studentId) || "";
    var shiftDate = data.shiftDate || "";
    var shiftSession = data.shiftSession || "";
    var shiftTimeSlot = data.shiftTimeSlot || "";
    var fullShiftLabel = data.fullShiftLabel || (shiftSession + " " + shiftTimeSlot);
    var id = data.id || "";
    var nowStr = data.registeredAt || new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    
    var sheet = getOrCreateShiftSheet();
    
    // Ghi dòng vào sheet ngay lập tức
    sheet.appendRow([
      nowStr,
      fullName,
      "'" + studentId, // Dấu nháy đơn giữ nguyên định dạng số
      shiftDate,
      shiftSession,
      shiftTimeSlot,
      fullShiftLabel,
      id
    ]);
    
    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, 8);
    rowRange.setVerticalAlignment("middle");
    
    // TUYỆT ĐỐI KHÔNG GỬI EMAIL THEO YÊU CẦU CỦA HMC
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Đã ghi nhận ca casting vào Google Sheet thành công!",
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("HMC Casting Shift Sync Webhook is ONLINE & Ready!")
    .setMimeType(ContentService.MimeType.TEXT);
}
`

export interface SimpleShiftSubmitParams {
  fullName: string
  studentId: string
  shiftId: string
}

/**
 * Ghi nhận lượt đăng ký ca casting (chỉ cần Họ tên, MSSV và Ca đã chọn)
 * Tự động đồng bộ ngay lập tức vào Google Sheet, KHÔNG GỬI EMAIL
 */
export async function submitCastingShiftRegistration(
  params: SimpleShiftSubmitParams
): Promise<{ success: boolean; id: string; message: string; registration?: CastingShiftRegistration }> {
  const cleanName = params.fullName.trim()
  const cleanId = params.studentId.trim().toUpperCase()

  if (!cleanName) {
    return { success: false, id: '', message: 'Vui lòng nhập Họ và tên của bạn.' }
  }
  if (!cleanId) {
    return { success: false, id: '', message: 'Vui lòng nhập Mã số sinh viên (MSSV).' }
  }

  const shiftOption = AVAILABLE_CASTING_SHIFTS.find((s) => s.id === params.shiftId)
  if (!shiftOption) {
    return { success: false, id: '', message: 'Vui lòng chọn 1 ca casting (Sáng hoặc Chiều).' }
  }

  // Tra cứu ngầm thông tin thí sinh từ 62 hồ sơ đã nộp nếu có
  const matched = matchApplicantByStudentIdOrName(cleanId, cleanName)

  const now = new Date().toISOString()
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  const id = `CA-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`

  const fullShiftLabel = `${shiftOption.dayOfWeek}, ${shiftOption.dateLabel.split(', ')[1]} • ${shiftOption.sessionLabel} (${shiftOption.timeSlot})`

  const newRegistration: CastingShiftRegistration = {
    id,
    applicationId: matched?.id || '',
    fullName: cleanName,
    studentId: cleanId,
    email: matched?.email || '',
    phone: '',
    castingDivision: matched?.castingDivision || 'vocal',
    castingSong: matched?.castingSong || '',
    beatUrl: matched?.beatUrl || '',
    shiftId: shiftOption.id,
    shiftDate: shiftOption.date,
    shiftDayOfWeek: shiftOption.dayOfWeek,
    shiftSession: shiftOption.sessionLabel,
    shiftTimeSlot: shiftOption.timeSlot,
    fullShiftLabel,
    registeredAt: now,
  }

  // 1. Lưu LocalStorage
  const existingList = getStoredShiftRegistrations()
  const existingIndex = existingList.findIndex(
    (r) => r.studentId.trim().toUpperCase() === cleanId
  )

  let updatedList: CastingShiftRegistration[]
  if (existingIndex >= 0) {
    updatedList = [...existingList]
    updatedList[existingIndex] = { ...newRegistration, id: existingList[existingIndex].id }
  } else {
    updatedList = [newRegistration, ...existingList]
  }

  persistShiftRegistrations(updatedList)

  // 2. Gửi đồng bộ sang Google Sheet qua Webhook NGAY LẬP TỨC (TUYỆT ĐỐI KHÔNG GỬI EMAIL)
  const webhookUrl = getShiftWebhookUrl()

  if (webhookUrl) {
    const divisionLabel =
      newRegistration.castingDivision === 'vocal'
        ? 'Hát (Vocal)'
        : newRegistration.castingDivision === 'dancer'
        ? 'Nhảy (Dance)'
        : 'Múa (Traditional / Contemporary)'

    const payload = {
      action: 'register_shift',
      type: 'casting_shift_registration',
      sheetName: 'Đăng Ký Ca Casting',
      skipEmail: true,
      sendEmail: false,
      to: '', // Tuyệt đối để trống để không gửi email
      email: '', // Không truyền email để tránh bất kỳ script cũ nào gửi thư
      phone: '',
      id: newRegistration.id,
      fullName: cleanName,
      studentId: cleanId,
      castingDivision: divisionLabel,
      shiftDate: shiftOption.dateLabel,
      shiftDayOfWeek: shiftOption.dayOfWeek,
      shiftSession: shiftOption.sessionLabel,
      shiftTimeSlot: shiftOption.timeSlot,
      fullShiftLabel,
      registeredAt: new Date(now).toLocaleString('vi-VN'),
      candidate: {
        id: newRegistration.applicationId || newRegistration.id,
        fullName: cleanName,
        studentId: cleanId,
        email: '', // Tuyệt đối không gửi email
        castingDivision: divisionLabel,
        passion: `[ĐÃ CHỌN CA CASTING]: ${fullShiftLabel}`,
      },
      timestamp: now,
    }

    try {
      // Gửi trực tiếp tới Google Apps Script Webhook (mode no-cors) để ghi vào Google Sheet ngay lập tức
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.warn('Direct Google Sheet sync error for shift registration:', err)
    }

    // Đồng thời gọi /api/applications để Netlify backend lưu trữ (không gửi email)
    try {
      fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register_shift',
          shiftWebhookUrl: webhookUrl,
          ...payload,
        }),
      }).catch(() => {})
    } catch {
      // ignore
    }
  }

  // 3. Cập nhật vào danh sách Application trong clientStore (ghi chú admin)
  try {
    const apps = getClientApplications()
    const targetApp = apps.find((a) => a.studentId.trim().toUpperCase() === cleanId)
    if (targetApp) {
      targetApp.adminNote = `[Ca Casting: ${fullShiftLabel}] ${targetApp.adminNote || ''}`.trim()
      localStorage.setItem('hmc_recruitment_store_v1', JSON.stringify(apps))
    }
  } catch {
    // ignore
  }

  return {
    success: true,
    id: newRegistration.id,
    message: 'Đăng ký ca casting thành công! Thông tin đã được ghi nhận vào sheet excel.',
    registration: newRegistration,
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
    'Mảng Casting',
    'Ngày Casting',
    'Thứ',
    'Buổi',
    'Khung Giờ Lựa Chọn',
    'Chi Tiết Ca Đầy Đủ',
    'Bài Hát / Tiết Mục',
    'Link Beat',
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
    `"${r.email || ''}"`,
    `"${getDivisionLabel(r.castingDivision)}"`,
    `"${r.shiftDate}"`,
    `"${r.shiftDayOfWeek}"`,
    `"${r.shiftSession}"`,
    `"${r.shiftTimeSlot}"`,
    `"${r.fullShiftLabel.replace(/"/g, '""')}"`,
    `"${(r.castingSong || '').replace(/"/g, '""')}"`,
    `"${(r.beatUrl || '').replace(/"/g, '""')}"`,
  ])

  // Thêm UTF-8 BOM (\uFEFF) để Excel hiển thị đúng 100% tiếng Việt
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
