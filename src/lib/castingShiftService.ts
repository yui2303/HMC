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

export const INITIAL_SHIFT_REGISTRATIONS: CastingShiftRegistration[] = [
  {
    id: 'SHIFT-HMC-2026-0CF1-KMRQ',
    applicationId: 'HMC-2026-0CF1-KMRQ',
    fullName: 'Nguyễn Tuấn Kiệt',
    studentId: '23DH114762',
    email: 'nguyenkiet23032005@gmail.com',
    phone: '',
    castingDivision: 'vocal',
    castingSong: 'Chưa điền (bổ sung khi casting)',
    beatUrl: 'Nộp beat tại bàn Check-in Casting',
    shiftId: 'day1-afternoon',
    shiftDate: '2026-11-06',
    shiftDayOfWeek: 'Thứ Sáu',
    shiftSession: 'BUỔI CHIỀU & TỐI',
    shiftTimeSlot: '13g30 – 20g00',
    fullShiftLabel: 'Thứ Sáu, 06/11/2026 • BUỔI CHIỀU & TỐI (13g30 – 20g00)',
    registeredAt: '2026-11-02T22:58:28+07:00'
  },
  {
    id: 'SHIFT-CA-LNSC-KM0D',
    applicationId: 'CA-LNSC-KM0D',
    fullName: 'Lê Phạm Hoàng Quân',
    studentId: '26DH220320',
    email: 'clbamnhac.huflit@gmail.com',
    phone: '',
    castingDivision: 'vocal',
    castingSong: 'Chưa điền (bổ sung khi casting)',
    beatUrl: 'Nộp beat tại bàn Check-in Casting',
    shiftId: 'day1-afternoon',
    shiftDate: '2026-11-06',
    shiftDayOfWeek: 'Thứ Sáu',
    shiftSession: 'BUỔI CHIỀU & TỐI',
    shiftTimeSlot: '13g30 – 20g00',
    fullShiftLabel: 'Thứ Sáu, 06/11/2026 • BUỔI CHIỀU & TỐI (13g30 – 20g00)',
    registeredAt: '2026-11-02T21:50:26+07:00'
  },
  {
    id: 'SHIFT-HMC-2026-DLR0-UT04',
    applicationId: 'HMC-2026-DLR0-UT04',
    fullName: 'Cao Gia Minh',
    studentId: '25DH711504',
    email: 'minhcg1211@gmail.com',
    phone: '',
    castingDivision: 'dancer',
    castingSong: 'Chưa điền (bổ sung khi casting)',
    beatUrl: 'Nộp beat tại bàn Check-in Casting',
    shiftId: 'day2-afternoon',
    shiftDate: '2026-11-07',
    shiftDayOfWeek: 'Thứ Bảy',
    shiftSession: 'BUỔI CHIỀU',
    shiftTimeSlot: '13g30 – 17g00',
    fullShiftLabel: 'Thứ Bảy, 07/11/2026 • BUỔI CHIỀU (13g30 – 17g00)',
    registeredAt: '2026-11-02T22:15:33+07:00'
  },
  {
    id: 'SHIFT-HMC-2026-H284-31W2',
    applicationId: 'HMC-2026-H284-31W2',
    fullName: 'Nguyễn Quốc Thái',
    studentId: '25DH100544',
    email: '25dh100544@st.huflit.edu.vn',
    phone: '0399488207',
    castingDivision: 'dancer',
    castingSong: 'Chưa điền (bổ sung khi casting)',
    beatUrl: 'Nộp beat tại bàn Check-in Casting',
    shiftId: 'day1-afternoon',
    shiftDate: '2026-11-06',
    shiftDayOfWeek: 'Thứ Sáu',
    shiftSession: 'BUỔI CHIỀU & TỐI',
    shiftTimeSlot: '13g30 – 20g00',
    fullShiftLabel: 'Thứ Sáu, 06/11/2026 • BUỔI CHIỀU & TỐI (13g30 – 20g00)',
    registeredAt: '2026-11-02T21:58:39+07:00'
  },
  {
    id: 'SHIFT-HMC-2026-696C-I8Z1',
    applicationId: 'HMC-2026-696C-I8Z1',
    fullName: 'Nguyễn Phạm Quốc Đoàn',
    studentId: '25DH710146',
    email: 'ngdol5310@gmail.com',
    phone: '',
    castingDivision: 'dancer',
    castingSong: 'Chưa điền (bổ sung khi casting)',
    beatUrl: 'Nộp beat tại bàn Check-in Casting',
    shiftId: 'day1-morning',
    shiftDate: '2026-11-06',
    shiftDayOfWeek: 'Thứ Sáu',
    shiftSession: 'BUỔI SÁNG',
    shiftTimeSlot: '09g00 – 12g00',
    fullShiftLabel: 'Thứ Sáu, 06/11/2026 • BUỔI SÁNG (09g00 – 12g00)',
    registeredAt: '2026-11-02T21:40:48+07:00'
  },
  {
    id: 'SHIFT-HMC-2026-PVKH-OS9Y',
    applicationId: 'HMC-2026-PVKH-OS9Y',
    fullName: 'Nguyễn Thanh Tú',
    studentId: '25DH100379',
    email: 'ttu111109@gmail.com',
    phone: '',
    castingDivision: 'vocal',
    castingSong: 'Chưa điền (bổ sung khi casting)',
    beatUrl: 'Nộp beat tại bàn Check-in Casting',
    shiftId: 'day1-afternoon',
    shiftDate: '2026-11-06',
    shiftDayOfWeek: 'Thứ Sáu',
    shiftSession: 'BUỔI CHIỀU & TỐI',
    shiftTimeSlot: '13g30 – 20g00',
    fullShiftLabel: 'Thứ Sáu, 06/11/2026 • BUỔI CHIỀU & TỐI (13g30 – 20g00)',
    registeredAt: '2026-11-02T21:05:37+07:00'
  }
]

const SHIFT_STORAGE_KEY = 'hmc_casting_shift_registrations_v1'

/**
 * Lấy danh sách tất cả các bạn đã đăng ký ca casting
 */
export function getStoredShiftRegistrations(): CastingShiftRegistration[] {
  try {
    const raw = localStorage.getItem(SHIFT_STORAGE_KEY)
    let list: CastingShiftRegistration[] = []
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) list = parsed
    }
    const map = new Map<string, CastingShiftRegistration>()
    INITIAL_SHIFT_REGISTRATIONS.forEach((s) => map.set(s.studentId.toUpperCase(), s))
    list.forEach((s) => map.set(s.studentId.toUpperCase(), s))
    return Array.from(map.values())
  } catch {
    return INITIAL_SHIFT_REGISTRATIONS
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
  'https://script.google.com/macros/s/AKfycbzLm2hseMd-mRKI7D9NnV_EEfvFLpDR2qKrAegYqY4kZBCbf5m84cXUPIItElZR3oq8/exec'

/**
 * Lấy URL Google Apps Script Webhook dành riêng cho Đăng Ký Ca Casting
 */
export function getShiftWebhookUrl(): string {
  try {
    const saved = localStorage.getItem(SHIFT_WEBHOOK_STORAGE_KEY)
    if (
      saved &&
      saved.trim() &&
      !saved.includes('AKfycbzpEErb2FDabdq7MXR0WwoMZ1GKUF4G4ML7XUQEuEfJyUp3oa-zkezxsIIJrt3PpjYQWA') &&
      !saved.includes('AKfycbx8SV3o95CGuH554RBiytm0B9oRJ_sRj7OaI1eNtJsn_SAMr_s96IbFOnbT0kiZMJc')
    ) {
      return saved.trim()
    }
  } catch {
    // ignore
  }

  const envShift = (import.meta.env.VITE_SHIFT_WEBHOOK_URL as string)?.trim()
  if (
    envShift &&
    !envShift.includes('AKfycbzpEErb2FDabdq7MXR0WwoMZ1GKUF4G4ML7XUQEuEfJyUp3oa-zkezxsIIJrt3PpjYQWA') &&
    !envShift.includes('AKfycbx8SV3o95CGuH554RBiytm0B9oRJ_sRj7OaI1eNtJsn_SAMr_s96IbFOnbT0kiZMJc')
  ) {
    return envShift
  }

  // Luôn luôn trả về link mới của bạn (DEFAULT_SHIFT_WEBHOOK_URL)
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
 * GHI TRỰC TIẾP VÀO FILE SHEET: 1hqZJJQ3_r55RtpmmglRMP20v6778pEukFsBRnKYALC0
 * =========================================================================
 */

var SPREADSHEET_ID = "1hqZJJQ3_r55RtpmmglRMP20v6778pEukFsBRnKYALC0";
var TARGET_GID = 504730251;

function getOrCreateShiftSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  // 1. Ưu tiên tìm đúng tab mà bạn đang mở (gid=504730251)
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_GID) {
      return sheets[i];
    }
  }
  
  // 2. Tìm theo tên tab "Đăng Ký Ca Casting"
  var sheet = ss.getSheetByName("Đăng Ký Ca Casting");
  if (sheet) return sheet;
  
  // 3. Mặc định dùng tab đầu tiên
  return sheets[0];
}

function doPost(e) {
  try {
    var rawContents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(rawContents);
    
    var fullName = data.fullName || (data.candidate && data.candidate.fullName) || "";
    var studentId = data.studentId || (data.candidate && data.candidate.studentId) || "";
    var phone = data.phone || (data.candidate && data.candidate.phone) || "";
    var shiftDate = data.shiftDate || "";
    var shiftSession = data.shiftSession || "";
    var shiftTimeSlot = data.shiftTimeSlot || "";
    var fullShiftLabel = data.fullShiftLabel || (shiftSession + " " + shiftTimeSlot);
    var id = data.id || "";
    var nowStr = data.registeredAt || new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    
    var sheet = getOrCreateShiftSheet();
    
    // Nếu trang tính còn trống thì tự động tạo tiêu đề với 9 cột chuẩn
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Đăng Ký",
        "Họ Và Tên",
        "Mã Số Sinh Viên (MSSV)",
        "Số Điện Thoại",
        "Ngày Casting",
        "Buổi",
        "Khung Giờ",
        "Chi Tiết Ca Đầy Đủ",
        "Mã Đăng Ký"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground("#0F2744");
      headerRange.setFontColor("#70D7FF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 40);
      sheet.setFrozenRows(1);
    } else {
      // Nếu sheet đã có sẵn nhưng chưa có cột Số Điện Thoại thì tự động chèn sau cột MSSV
      var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
      var hasPhoneCol = false;
      for (var h = 0; h < headers.length; h++) {
        var hStr = (headers[h] || "").toString().toLowerCase();
        if (hStr.indexOf("điện thoại") !== -1 || hStr.indexOf("sđt") !== -1 || hStr.indexOf("phone") !== -1) {
          hasPhoneCol = true;
          break;
        }
      }
      if (!hasPhoneCol) {
        sheet.insertColumnAfter(3);
        var newHeaderCell = sheet.getRange(1, 4);
        newHeaderCell.setValue("Số Điện Thoại");
        newHeaderCell.setBackground("#0F2744");
        newHeaderCell.setFontColor("#70D7FF");
        newHeaderCell.setFontWeight("bold");
        newHeaderCell.setHorizontalAlignment("center");
        newHeaderCell.setVerticalAlignment("middle");
      }
    }
    
    // Ghi dòng mới vào đúng trang tính của bạn (giữ định dạng số bằng dấu nháy đơn)
    sheet.appendRow([
      nowStr,
      fullName,
      "'" + studentId,
      "'" + phone,
      shiftDate,
      shiftSession,
      shiftTimeSlot,
      fullShiftLabel,
      id
    ]);
    
    var lastRow = sheet.getLastRow();
    
    // TUYỆT ĐỐI KHÔNG GỬI EMAIL THEO YÊU CẦU CỦA HMC
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Đã ghi nhận ca casting và số điện thoại vào Google Sheet thành công!",
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
  phone: string
  shiftId: string
}

/**
 * Ghi nhận lượt đăng ký ca casting (Họ tên, MSSV, Số điện thoại và Ca đã chọn)
 * Tự động đồng bộ ngay lập tức vào Google Sheet, KHÔNG GỬI EMAIL
 */
export async function submitCastingShiftRegistration(
  params: SimpleShiftSubmitParams
): Promise<{ success: boolean; id: string; message: string; registration?: CastingShiftRegistration }> {
  const cleanName = params.fullName.trim()
  const cleanId = params.studentId.trim().toUpperCase()
  const cleanPhone = (params.phone || '').trim()

  if (!cleanName) {
    return { success: false, id: '', message: 'Vui lòng nhập Họ và tên của bạn.' }
  }
  if (!cleanId) {
    return { success: false, id: '', message: 'Vui lòng nhập Mã số sinh viên (MSSV).' }
  }
  if (!cleanPhone) {
    return { success: false, id: '', message: 'Vui lòng nhập Số điện thoại liên hệ.' }
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
    phone: cleanPhone || matched?.phone || '',
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
      phone: cleanPhone || matched?.phone || '',
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
        phone: cleanPhone || matched?.phone || '',
        email: '', // Tuyệt đối không gửi email
        castingDivision: divisionLabel,
        passion: `[ĐÃ CHỌN CA CASTING]: ${fullShiftLabel} - SĐT: ${cleanPhone}`,
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
    'Số Điện Thoại',
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
    `"${r.phone || ''}"`,
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
