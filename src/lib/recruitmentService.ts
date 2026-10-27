import { addClientApplication } from './clientStore'
import { sendAutomaticRegistrationEmail, syncToGoogleSheetWebhook } from './emailService'
import { ApplicationItem } from './adminApi'

export interface RecruitmentFormData {
  fullName: string
  email: string
  studentId: string
  castingDivision: 'vocal' | 'dancer' | 'traditional_dance' | null
  castingSong: string
  beatUrl: string
  hasPerformanceExperience: boolean | null
  performanceUrl?: string
  passion: string
}

export interface SubmissionResponse {
  success: boolean
  id: string
  submittedAt: string
  message: string
  emailSent?: boolean
  emailError?: string
}

/**
 * Clean submit abstraction for HMC Collaborator Casting.
 * Works seamlessly on static deployments (Netlify) via client storage
 * and connects to REST API/backend servers when available.
 * Automatically dispatches confirmation email with rules & schedule to candidate.
 */
export async function submitApplication(
  data: RecruitmentFormData
): Promise<SubmissionResponse> {
  const now = new Date().toISOString()
  let createdApp: ApplicationItem | null = null

  // 1. Try server endpoints (standard rewrite & direct Netlify function)
  const candidateEndpoints = ['/api/applications', '/.netlify/functions/applications']
  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const contentType = res.headers.get('content-type') || ''
      if (res.ok && contentType.includes('application/json')) {
        const result = await res.json()
        if (result && result.success) {
          try {
            if (result.application) {
              createdApp = addClientApplication(
                {
                  fullName: result.application.fullName,
                  email: result.application.email,
                  studentId: result.application.studentId,
                  castingDivision: result.application.castingDivision || data.castingDivision,
                  castingSong: result.application.castingSong,
                  beatUrl: result.application.beatUrl,
                  hasPerformanceExperience: result.application.hasPerformanceExperience,
                  performanceUrl: result.application.performanceUrl,
                  passion: result.application.passion,
                },
                result.application.id || result.id
              )
            } else {
              createdApp = addClientApplication(data, result.id)
            }

            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('hmc_application_created', { detail: createdApp }))
            }
          } catch {
            // ignore
          }

          // Tự động gửi email xác nhận cho thí sinh & đồng bộ Google Sheets
          let emailResult: { success: boolean; error?: string } = { success: false, error: '' }
          if (createdApp) {
            // Đồng bộ tức thì vào Google Sheets Webhook nếu cấu hình
            syncToGoogleSheetWebhook(createdApp).catch((e) => console.warn('Google Sheets sync error:', e))

            try {
              emailResult = await sendAutomaticRegistrationEmail(createdApp)
            } catch (e: any) {
              console.warn('Auto email dispatch error:', e)
            }
          }

          return {
            success: true,
            id: result.id,
            submittedAt: now,
            message: result.message || 'Đơn đăng ký đã được ghi nhận thành công!',
            emailSent: emailResult.success,
            emailError: emailResult.error,
          }
        }
      }
    } catch {
      // try next endpoint
    }
  }

  // 2. Client-side storage fallback (Netlify)
  try {
    const newApp = addClientApplication(data)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hmc_application_created', { detail: newApp }))
    }

    // Đồng bộ tức thì vào Google Sheets Webhook nếu cấu hình
    syncToGoogleSheetWebhook(newApp).catch((e) => console.warn('Google Sheets sync error:', e))

    // Tự động gửi email xác nhận cho thí sinh
    let emailResult: { success: boolean; error?: string } = { success: false, error: '' }
    try {
      emailResult = await sendAutomaticRegistrationEmail(newApp)
    } catch (e: any) {
      console.warn('Auto email dispatch error:', e)
    }

    return {
      success: true,
      id: newApp.id,
      submittedAt: now,
      message: 'Đơn đăng ký của bạn đã được ghi nhận thành công!',
      emailSent: emailResult.success,
      emailError: emailResult.error,
    }
  } catch (err: any) {
    console.error('Submission request failed:', err)
    throw new Error(err.message || 'Chưa thể gửi đơn. Vui lòng thử lại.')
  }
}


