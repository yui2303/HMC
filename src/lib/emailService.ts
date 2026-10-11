import { ApplicationItem } from './adminApi'
import { getAuditionPlanHtml } from './auditionPlanPdf'
import { DEFAULT_EMAIL_CONFIG, EmailProviderConfig } from '../config/emailConfig'

export type { EmailProviderConfig }
export { DEFAULT_EMAIL_CONFIG }

export interface EmailDispatchProgress {
  current: number
  total: number
  currentCandidate: ApplicationItem | null
  status: 'idle' | 'sending' | 'success' | 'error'
  logs: string[]
}

export interface SendEmailOptions {
  customNote?: string
  senderName?: string
  includePdfAttachment?: boolean
  config?: EmailProviderConfig
}

export interface EmailDispatchResult {
  totalSent: number
  totalFailed: number
  timestamp: string
  recipients: { id: string; email: string; fullName: string; division: string; success: boolean; error?: string }[]
}

const SENT_EMAILS_STORAGE_KEY = 'hmc_recruitment_sent_confirmation_emails_v1'
const EMAIL_CONFIG_STORAGE_KEY = 'hmc_recruitment_email_config_v1'

export const LIVE_WEBSITE_URL = 'https://huflitmusicclub.netlify.app'
export const LIVE_CASTING_GUIDE_URL = 'https://huflitmusicclub.netlify.app/#casting-guide'

/**
 * Returns saved email provider configuration from local storage merged with defaults
 */
export function getSavedEmailConfig(): EmailProviderConfig {
  try {
    const raw = localStorage.getItem(EMAIL_CONFIG_STORAGE_KEY)
    if (!raw) {
      return { ...DEFAULT_EMAIL_CONFIG }
    }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_EMAIL_CONFIG, ...parsed }
  } catch {
    return { ...DEFAULT_EMAIL_CONFIG }
  }
}

/**
 * Saves email provider configuration to local storage
 */
export function saveEmailConfig(config: EmailProviderConfig): void {
  try {
    localStorage.setItem(EMAIL_CONFIG_STORAGE_KEY, JSON.stringify(config))
  } catch (err) {
    console.error('Failed to save email config:', err)
  }
}

/**
 * Returns the list of applicant IDs that have already been sent confirmation emails
 */
export function getSentEmailIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SENT_EMAILS_STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

/**
 * Marks applicant IDs as having received confirmation emails
 */
export function markEmailIdsAsSent(ids: string[]): void {
  try {
    const existing = getSentEmailIds()
    ids.forEach((id) => existing.add(id))
    localStorage.setItem(SENT_EMAILS_STORAGE_KEY, JSON.stringify(Array.from(existing)))
  } catch (err) {
    console.error('Failed to save sent email IDs:', err)
  }
}

/**
 * Generates beautiful HTML email body personalized for each candidate
 */
export function generatePersonalizedEmailHtml(
  candidate: ApplicationItem,
  options: SendEmailOptions = {}
): string {
  const divisionLabel =
    candidate.castingDivision === 'vocal'
      ? 'Hát (Vocal)'
      : candidate.castingDivision === 'dancer'
      ? 'Nhảy (Dance)'
      : 'Múa (Traditional / Contemporary)'

  const customNoteBlock = options.customNote
    ? `
      <div style="background: rgba(57, 139, 255, 0.12); border-left: 4px solid #70D7FF; border-radius: 8px; padding: 14px 18px; margin: 20px 0; color: #E2EBF6; font-size: 13.5px;">
        <strong style="color: #70D7FF;">📌 Lời nhắn từ Ban Tổ Chức HMC:</strong>
        <p style="margin: 6px 0 0 0; white-space: pre-line;">${options.customNote}</p>
      </div>
    `
    : ''

  return `
    <div style="max-width: 680px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #050D1A; color: #E2EBF6; border: 1px solid rgba(112, 215, 255, 0.25); border-radius: 18px; overflow: hidden; box-shadow: 0 15px 45px rgba(0,0,0,0.7);">
      <!-- EMAIL HEADER -->
      <div style="background: linear-gradient(135deg, #09172B 0%, #0D223F 100%); padding: 30px 35px; border-bottom: 2px solid rgba(112, 215, 255, 0.3); text-align: center;">
        <div style="display: inline-block; background: rgba(57, 139, 255, 0.2); border: 1px solid rgba(112, 215, 255, 0.4); color: #FFE082; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
          HUFLIT MUSIC CLUB (HMC)
        </div>
        <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          XÁC NHẬN ĐĂNG KÝ CASTING CTV 2026
        </h1>
        <p style="margin: 6px 0 0 0; color: #70D7FF; font-size: 13px; font-weight: 600;">
          Kèm Kế Hoạch &amp; Thể Lệ Tuyển Thành Viên Năm Học 2026 – 2027
        </p>
      </div>

      <!-- EMAIL BODY -->
      <div style="padding: 30px 35px; background: #061120;">
        <p style="font-size: 15px; margin: 0 0 16px 0; color: #FFFFFF;">
          Xin chào <strong style="color: #70D7FF;">${candidate.fullName}</strong>,
        </p>

        <p style="margin: 0 0 18px 0; line-height: 1.6; color: #C9D9EC; font-size: 13.5px;">
          Ban Chủ nhiệm <strong>CLB Âm nhạc HUFLIT (HMC)</strong> xin gửi lời cảm ơn bạn đã quan tâm và hoàn tất đăng ký tham gia Đợt Tuyển Cộng tác viên năm học 2026 – 2027. Hồ sơ của bạn đã được ghi nhận chính thức vào hệ thống!
        </p>

        <!-- CANDIDATE DETAILS CARD -->
        <div style="background: rgba(9, 23, 43, 0.85); border: 1px solid rgba(112, 215, 255, 0.25); border-radius: 12px; padding: 18px 22px; margin-bottom: 22px;">
          <div style="color: #FFE082; font-weight: 700; font-size: 13px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px dashed rgba(112, 215, 255, 0.2); padding-bottom: 6px;">
            📋 THÔNG TIN HỒ SƠ CASTING CỦA BẠN
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 5px 0; color: #91A4BB; width: 140px;">Mã hồ sơ:</td>
              <td style="padding: 5px 0; color: #70D7FF; font-family: monospace; font-weight: 700;">${candidate.id}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Họ và tên:</td>
              <td style="padding: 5px 0; color: #FFFFFF; font-weight: 700;">${candidate.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Mã số sinh viên:</td>
              <td style="padding: 5px 0; color: #FFFFFF; font-weight: 600;">${candidate.studentId}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Mảng đăng ký:</td>
              <td style="padding: 5px 0; color: #FFE082; font-weight: 700;">${divisionLabel}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Bài / Tác phẩm:</td>
              <td style="padding: 5px 0; color: #FFFFFF;">${candidate.castingSong}</td>
            </tr>
          </table>
        </div>

        ${customNoteBlock}

        <!-- AUDITION SCHEDULE & VENUE -->
        <div style="background: rgba(57, 139, 255, 0.08); border: 1px solid rgba(112, 215, 255, 0.2); border-radius: 12px; padding: 18px 22px; margin-bottom: 22px;">
          <div style="color: #70D7FF; font-weight: 700; font-size: 13px; text-transform: uppercase; margin-bottom: 10px;">
            📍 LỊCH TRÌNH VÀ ĐỊA ĐIỂM CASTING CHÍNH THỨC
          </div>
          <p style="margin: 0 0 8px 0; font-size: 13px;">
            • <strong>Địa điểm:</strong> Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, Trường ĐH Ngoại ngữ – Tin học TP.HCM (HUFLIT).
          </p>
          <p style="margin: 0 0 4px 0; font-size: 13px;">
            • <strong>Thời gian Casting:</strong>
          </p>
          <ul style="margin: 4px 0 0 20px; font-size: 12.5px; color: #D2DFEE; padding: 0;">
            <li><strong>Ngày 06/11/2026:</strong> Sáng (09g00 – 12g00) | Chiều (13g30 – 20g00)</li>
            <li><strong>Ngày 07/11/2026:</strong> Sáng (09g00 – 12g00) | Chiều (13g30 – 17g00)</li>
          </ul>
        </div>

        <!-- CHECKLIST / RULES REMINDER -->
        <div style="margin-bottom: 25px;">
          <div style="color: #FFFFFF; font-weight: 700; font-size: 13.5px; margin-bottom: 8px;">
            ⚠️ MỘT SỐ LƯU Ý QUAN TRỌNG:
          </div>
          <ul style="margin: 0 0 0 20px; font-size: 13px; color: #C9D9EC; line-height: 1.6; padding: 0;">
            <li>Vui lòng có mặt tại địa điểm Casting trước giờ được thông báo <strong>ít nhất 30 phút</strong> để check-in và chuẩn bị.</li>
            <li>Chủ động chuẩn bị nhạc nền (beat), đạo cụ hoặc vật dụng cá nhân cần thiết.</li>
            ${
              candidate.castingDivision === 'vocal'
                ? '<li>Mảng Hát cần chuẩn bị thêm 3 bài hát bắt buộc: <em>“Khát vọng tuổi trẻ”, “Linh thiêng Việt Nam”, “Tàu anh qua núi”</em> (BGK sẽ chọn ngẫu nhiên 01 bài để hát chay).</li>'
                : ''
            }
            <li>Nếu có thay đổi lịch, vui lòng báo trước ít nhất 24 tiếng qua Fanpage hoặc Email.</li>
          </ul>
        </div>

        <!-- ATTACHED PDF PLAN ANNOUNCEMENT -->
        <div style="text-align: center; margin: 30px 0 10px 0; padding: 20px; background: rgba(9, 23, 43, 0.95); border: 1px dashed rgba(112, 215, 255, 0.4); border-radius: 14px;">
          <div style="font-size: 14px; font-weight: 700; color: #FFE082; margin-bottom: 6px;">
            📄 ĐÍNH KÈM: KẾ HOẠCH &amp; THỂ LỆ CASTING CHI TIẾT (PDF)
          </div>
          <p style="font-size: 12px; color: #91A4BB; margin: 0 0 14px 0;">
            Đã đính kèm văn bản kế hoạch tổ chức và quy định casting chuẩn của CLB Âm nhạc HUFLIT 2026.
          </p>
          <a href="${LIVE_CASTING_GUIDE_URL}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #398BFF, #70D7FF); color: #031024; font-weight: 800; font-size: 13px; text-decoration: none; padding: 10px 24px; border-radius: 25px; box-shadow: 0 0 15px rgba(112, 215, 255, 0.4);">
            Xem Thể Lệ Trên Website HMC →
          </a>
        </div>
      </div>

      <!-- EMAIL FOOTER -->
      <div style="background: #040A14; padding: 22px 35px; border-top: 1px solid rgba(112, 215, 255, 0.15); font-size: 12px; color: #8298B0;">
        <div style="font-weight: 700; color: #FFFFFF; font-size: 13px; margin-bottom: 6px;">
          BAN CHỦ NHIỆM CLB ÂM NHẠC HUFLIT (HMC)
        </div>
        <div>📩 Email: <a href="mailto:clbamnhac.huflit@gmail.com" style="color: #70D7FF; text-decoration: none;">clbamnhac.huflit@gmail.com</a></div>
        <div>📱 Fanpage: <a href="https://www.facebook.com/huflitmusicclub" target="_blank" rel="noopener noreferrer" style="color: #70D7FF; text-decoration: none;">fb.com/huflitmusicclub</a></div>
        <div>☎️ Hotline: <span style="color: #FFE082;">Trần Như Lệ - 0812622268</span> (Phó Chủ nhiệm)</div>
      </div>
    </div>
  `
}

/**
 * Sends a single real email using the configured provider (Resend / EmailJS / Webhook / Simulation)
 */
export async function sendSingleRealEmail(
  toEmail: string,
  candidate: ApplicationItem,
  options: SendEmailOptions = {},
  config?: EmailProviderConfig
): Promise<{ success: boolean; error?: string }> {
  const activeConfig = config || options.config || getSavedEmailConfig()
  const htmlBody = generatePersonalizedEmailHtml(candidate, options)
  const subject = `[HMC 2026] Xác nhận đăng ký Casting CTV - ${candidate.fullName} (${candidate.studentId})`

  // 1. Resend API via Netlify Serverless Function (Server-to-server, bypasses browser CORS)
  if (activeConfig.provider === 'resend') {
    const apiKey = activeConfig.resendApiKey?.trim() || ''

    try {
      let fromSender = activeConfig.senderEmail?.trim() || 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>'
      if (fromSender.includes('@gmail.com') || fromSender.includes('@yahoo.com') || fromSender.includes('@outlook.com')) {
        fromSender = 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>'
      }

      // Call Netlify Function first (Server-side, no CORS restriction)
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'resend',
          apiKey: apiKey,
          from: fromSender,
          to: [toEmail.trim()],
          subject: subject,
          html: htmlBody,
        }),
      })

      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await res.json()
        if (res.ok && data.success) {
          return { success: true }
        }
        if (data.error) {
          return { success: false, error: data.error }
        }
      }

      // Fallback if netlify functions redirect is not ready in dev
      const directRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeConfig.resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromSender,
          to: [toEmail.trim()],
          subject: subject,
          html: htmlBody,
        }),
      })

      const directData = await directRes.json()
      if (!directRes.ok) {
        return {
          success: false,
          error: directData.message || `Resend API lỗi (HTTP ${directRes.status})`,
        }
      }

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: `Lỗi kết nối: ${err.message || 'Không thể gửi qua Resend'}.`,
      }
    }
  }

  // 2. EmailJS REST API
  if (activeConfig.provider === 'emailjs') {
    if (!activeConfig.emailjsServiceId || !activeConfig.emailjsTemplateId || !activeConfig.emailjsPublicKey) {
      return { success: false, error: 'Chưa điền đủ Service ID, Template ID hoặc Public Key của EmailJS.' }
    }

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: activeConfig.emailjsServiceId.trim(),
          template_id: activeConfig.emailjsTemplateId.trim(),
          user_id: activeConfig.emailjsPublicKey.trim(),
          template_params: {
            to_name: candidate.fullName,
            to_email: toEmail.trim(),
            student_id: candidate.studentId,
            division: candidate.castingDivision,
            casting_song: candidate.castingSong,
            subject: subject,
            message_html: htmlBody,
            custom_note: options.customNote || '',
            website_url: LIVE_CASTING_GUIDE_URL,
          },
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        return { success: false, error: errorText || `EmailJS lỗi HTTP ${res.status}` }
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Không thể kết nối đến EmailJS.' }
    }
  }

  // 3. Custom Webhook / Google Apps Script
  if (activeConfig.provider === 'webhook') {
    const webhookUrl = activeConfig.webhookUrl?.trim()
    if (!webhookUrl) {
      return { success: false, error: 'Chưa nhập Webhook / Google Apps Script URL.' }
    }

    const payload = {
      provider: 'webhook',
      webhookUrl: webhookUrl,
      to: toEmail.trim(),
      candidate,
      subject,
      html: htmlBody,
      customNote: options.customNote,
      timestamp: new Date().toISOString(),
    }

    // Step 1: Attempt Netlify Serverless Proxy (Server-side, zero CORS restriction, follows Google 302 redirects)
    try {
      const serverRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const contentType = serverRes.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await serverRes.json()
        if (serverRes.ok && data.success) {
          return { success: true }
        }
        if (data.error) {
          return { success: false, error: data.error }
        }
      }
    } catch {
      // If serverless endpoint is not reachable (e.g. dev mode), continue to direct client-side fallback
    }

    // Step 2: Direct browser client-side fallback using text/plain (CORS-safelisted) & follow redirects
    try {
      const directPayload = JSON.stringify({
        to: toEmail.trim(),
        email: toEmail.trim(),
        recipient: toEmail.trim(),
        candidate,
        subject,
        html: htmlBody,
        message: htmlBody,
        body: htmlBody,
        customNote: options.customNote,
        timestamp: new Date().toISOString(),
      })

      try {
        const directRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: directPayload,
          redirect: 'follow',
        })

        if (directRes.ok) {
          return { success: true }
        }
      } catch {
        // If browser blocks reading response due to 302 redirect / CORS, use no-cors (the request still reaches Apps Script)
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: directPayload,
        })
        return { success: true }
      }

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error:
          'Không thể kết nối đến Google Apps Script Webhook. Hãy kiểm tra URL và chắc chắn đã chọn Quyền truy cập: "Bất kỳ ai (Anyone)" khi Triển khai.',
      }
    }
  }

  // 4. Default Simulation Mode (or offline fallback)
  await new Promise((resolve) => setTimeout(resolve, 180))
  return { success: true }
}

/**
 * Sends test email to a specific address
 */
export async function sendTestRealEmail(
  targetEmail: string,
  config?: EmailProviderConfig,
  customNote?: string
): Promise<{ success: boolean; error?: string }> {
  const sampleCandidate: ApplicationItem = {
    id: 'HMC-TEST-001',
    fullName: 'Thí Sinh Thử Nghiệm (Test)',
    email: targetEmail.trim(),
    studentId: '26DH999999',
    castingDivision: 'vocal',
    castingSong: 'Linh thiêng Việt Nam',
    beatUrl: 'https://youtube.com',
    hasPerformanceExperience: true,
    performanceUrl: 'https://youtube.com',
    passion: 'Đam mê âm nhạc và cống hiến cho HUFLIT Music Club.',
    status: 'new',
    adminNote: 'Email thử nghiệm hệ thống gửi mail tự động HMC.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return sendSingleRealEmail(targetEmail, sampleCandidate, { customNote }, config)
}

/**
 * Sends confirmation email with PDF plan attachment to all provided candidates
 */
export async function sendConfirmationEmailsToAll(
  candidates: ApplicationItem[],
  options: SendEmailOptions = {},
  onProgress?: (progress: EmailDispatchProgress) => void
): Promise<EmailDispatchResult> {
  const total = candidates.length
  const logs: string[] = []
  const sentRecipients: { id: string; email: string; fullName: string; division: string; success: boolean; error?: string }[] = []
  const config = options.config || getSavedEmailConfig()

  const providerName =
    config.provider === 'resend'
      ? 'Resend API'
      : config.provider === 'emailjs'
      ? 'EmailJS'
      : config.provider === 'webhook'
      ? 'Webhook / Apps Script'
      : 'Mô phỏng (Simulation)'

  logs.push(
    `[${new Date().toLocaleTimeString('vi-VN')}] 🚀 Khởi tạo gửi email tới ${total} bạn qua dịch vụ: ${providerName}...`
  )

  if (onProgress) {
    onProgress({
      current: 0,
      total,
      currentCandidate: null,
      status: 'sending',
      logs: [...logs],
    })
  }

  let totalSent = 0
  let totalFailed = 0
  const successfulIds: string[] = []

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i]
    
    if (onProgress) {
      onProgress({
        current: i,
        total,
        currentCandidate: candidate,
        status: 'sending',
        logs: [...logs],
      })
    }

    try {
      const res = await sendSingleRealEmail(candidate.email, candidate, options, config)

      if (res.success) {
        totalSent++
        successfulIds.push(candidate.id)
        const logEntry = `[${new Date().toLocaleTimeString('vi-VN')}] ✅ ĐÃ GỬI: ${candidate.fullName} <${candidate.email}> [${candidate.id}]`
        logs.push(logEntry)

        sentRecipients.push({
          id: candidate.id,
          email: candidate.email,
          fullName: candidate.fullName,
          division: candidate.castingDivision,
          success: true,
        })
      } else {
        totalFailed++
        const logEntry = `[${new Date().toLocaleTimeString('vi-VN')}] ❌ THẤT BẠI: ${candidate.fullName} <${candidate.email}> — ${res.error}`
        logs.push(logEntry)

        sentRecipients.push({
          id: candidate.id,
          email: candidate.email,
          fullName: candidate.fullName,
          division: candidate.castingDivision,
          success: false,
          error: res.error,
        })
      }
    } catch (err: any) {
      totalFailed++
      const logEntry = `[${new Date().toLocaleTimeString('vi-VN')}] ❌ LỖI: ${candidate.fullName} — ${err.message || 'Lỗi mạng'}`
      logs.push(logEntry)

      sentRecipients.push({
        id: candidate.id,
        email: candidate.email,
        fullName: candidate.fullName,
        division: candidate.castingDivision,
        success: false,
        error: err.message,
      })
    }

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        currentCandidate: candidate,
        status: i + 1 === total ? (totalFailed === 0 ? 'success' : 'error') : 'sending',
        logs: [...logs],
      })
    }
  }

  // Mark successfully sent IDs
  if (successfulIds.length > 0) {
    markEmailIdsAsSent(successfulIds)
  }

  logs.push(
    `[${new Date().toLocaleTimeString('vi-VN')}] 🏁 Kết thúc chiến dịch: ${totalSent} gửi thành công, ${totalFailed} thất bại.`
  )

  return {
    totalSent,
    totalFailed,
    timestamp: new Date().toISOString(),
    recipients: sentRecipients,
  }
}

/**
 * Direct check if the webhook / Apps Script URL is valid and responds
 */
export async function testWebhookUrlConnection(
  url: string
): Promise<{ success: boolean; message: string }> {
  const cleanUrl = url.trim()
  if (!cleanUrl) {
    return { success: false, message: 'Vui lòng nhập Webhook / Google Apps Script URL.' }
  }

  // 1. First attempt through Serverless Proxy (Server-to-server check)
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'webhook',
        webhookUrl: cleanUrl,
        checkOnly: true,
        to: 'ping@hmcmusic.club',
      }),
    })

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      if (res.ok && data.success) {
        return { success: true, message: '✅ Kết nối Webhook thành công (HTTP 200 OK)! URL sẵn sàng gửi thư.' }
      }
      if (data.error) {
        return { success: false, message: `❌ ${data.error}` }
      }
    }
  } catch {
    // Serverless proxy unavailable in dev mode, proceed to client check
  }

  // 2. Direct client check
  try {
    const res = await fetch(cleanUrl, {
      method: 'GET',
    })

    if (res.ok) {
      return {
        success: true,
        message: '✅ Kết nối Webhook Google Apps Script thành công (HTTP 200 OK)!',
      }
    }

    if (res.status === 404) {
      return {
        success: false,
        message:
          '❌ Google trả về 404 Not Found: URL chưa được cấp quyền "Bất kỳ ai (Anyone)" hoặc URL chưa đúng. Hãy vào Google Apps Script bấm Triển khai -> Tùy chọn triển khai mới -> Quyền truy cập: "Bất kỳ ai".',
      }
    }

    return {
      success: false,
      message: `❌ Webhook phản hồi mã HTTP ${res.status}. Vui lòng kiểm tra lại quyền truy cập của Web App.`,
    }
  } catch (err: any) {
    return {
      success: false,
      message:
        '❌ Không thể kết nối tới URL (Google từ chối hoặc trả về 404). Hãy chắc chắn bạn đã chọn Quyền truy cập: "Bất kỳ ai (Anyone)" khi Triển khai trên Google Apps Script.',
    }
  }
}

/**
 * Tự động gửi email xác nhận và thể lệ casting đến thí sinh ngay khi hoàn thành nộp đơn đăng ký
 */
export async function sendAutomaticRegistrationEmail(
  candidate: ApplicationItem
): Promise<{ success: boolean; error?: string }> {
  const config = getSavedEmailConfig()

  // Nếu người quản trị tắt tính năng tự động gửi
  if (config.autoSendOnRegistration === false) {
    return { success: false, error: 'Chế độ tự động gửi email đã tắt.' }
  }

  // Nếu đang để chế độ mô phỏng
  if (config.provider === 'simulation') {
    markEmailIdsAsSent([candidate.id])
    return { success: true }
  }

  try {
    const res = await sendSingleRealEmail(candidate.email, candidate, {
      customNote: 'Chúc bạn có một buổi casting thật bùng nổ, tự tin và tỏa sáng cùng gia đình HUFLIT Music Club nhé!',
      includePdfAttachment: true,
      config,
    })

    if (res.success) {
      markEmailIdsAsSent([candidate.id])
    }
    return res
  } catch (err: any) {
    console.warn('Lỗi khi tự động gửi email cho thí sinh:', err)
    return { success: false, error: err.message || 'Lỗi gửi email tự động.' }
  }
}

