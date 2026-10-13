import type { Handler, HandlerEvent } from '@netlify/functions'

interface SendEmailPayload {
  provider?: 'resend' | 'emailjs' | 'webhook'
  apiKey?: string
  from?: string
  to?: string | string[]
  subject?: string
  html?: string
  customNote?: string
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Chỉ chấp nhận phương thức POST.' }),
    }
  }

  try {
    const body: SendEmailPayload & { webhookUrl?: string; candidate?: any } = JSON.parse(event.body || '{}')
    const provider = body.provider || 'resend'
    const rawTo = body.to
    const recipients = Array.isArray(rawTo) ? rawTo : [rawTo || '']
    const cleanRecipients = recipients.map((r) => String(r).trim()).filter(Boolean)

    if (cleanRecipients.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Thiếu địa chỉ email người nhận (to).' }),
      }
    }

    // ==========================================
    // 1. GOOGLE APPS SCRIPT / WEBHOOK PROVIDER
    // ==========================================
    if (provider === 'webhook') {
      const webhookUrl = (
        body.webhookUrl ||
        process.env.VITE_WEBHOOK_URL ||
        'https://script.google.com/macros/s/AKfycbzpEErb2FDabdq7MXR0WwoMZ1GKUF4G4ML7XUQEuEfJyUp3oa-zkezxsIIJrt3PpjYQWA/exec'
      ).trim()
      if (!webhookUrl) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Chưa cung cấp Webhook / Google Apps Script URL.' }),
        }
      }

      const isCheckOnly = (body as any).checkOnly === true

      try {
        if (isCheckOnly) {
          const testRes = await fetch(webhookUrl, {
            method: 'GET',
            redirect: 'follow',
          })
          const testStatus = testRes.status
          const testText = await testRes.text()

          if (testStatus === 404 || testText.includes('không tồn tại') || testText.includes('Not Found')) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                success: false,
                error: 'Google trả về 404: Link Apps Script chưa được cấp quyền "Bất kỳ ai (Anyone)" hoặc URL chưa đúng. Hãy kiểm tra lại phần Triển khai (Deploy) trong Google Apps Script.',
              }),
            }
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Kết nối Webhook Google Apps Script thành công (HTTP 200 OK)!',
            }),
          }
        }

        const primaryRecipient = cleanRecipients[0]
        const webhookPayload = {
          to: primaryRecipient,
          recipients: cleanRecipients,
          candidate: body.candidate || { fullName: 'Thí sinh', email: primaryRecipient },
          subject: body.subject || '[HMC 2026] Xác nhận đăng ký Casting CTV - CLB Âm nhạc HUFLIT',
          html: body.html || '<p>Xác nhận đăng ký casting HMC 2026</p>',
          customNote: body.customNote || '',
          timestamp: new Date().toISOString(),
        }

        // Server-side fetch to Google Apps Script (automatically follows 302 redirects)
        const webhookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(webhookPayload),
          redirect: 'follow',
        })

        const status = webhookRes.status
        const rawText = await webhookRes.text()

        if (status === 404 || rawText.includes('không tồn tại') || rawText.includes('Not Found')) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Google trả về 404: Link Apps Script chưa được cấp quyền "Bất kỳ ai (Anyone)" hoặc URL đã bị xóa/thay đổi. Vui lòng vào Google Apps Script bấm Triển khai mới -> Chọn Quyền truy cập: "Bất kỳ ai (Anyone)".',
            }),
          }
        }

        if (!webhookRes.ok) {
          return {
            statusCode: status,
            headers,
            body: JSON.stringify({
              success: false,
              error: `Google Apps Script Webhook trả về mã HTTP ${status}: ${rawText.slice(0, 150)}`,
            }),
          }
        }

        // Parse response if JSON
        let parsedResult: any = null
        try {
          parsedResult = JSON.parse(rawText)
        } catch {
          // Plain text response is also fine if HTTP status is 200
        }

        if (parsedResult && parsedResult.success === false) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: parsedResult.error || 'Google Apps Script thực thi thất bại.',
            }),
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Đã gửi qua Google Apps Script Webhook thành công.',
            detail: parsedResult || rawText.slice(0, 100),
          }),
        }
      } catch (webhookErr: any) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: `Lỗi kết nối tới Google Apps Script Webhook: ${webhookErr.message || 'Không thể kết nối'}`,
          }),
        }
      }
    }

    // ==========================================
    // 2. RESEND API PROVIDER
    // ==========================================
    const apiKey = (body.apiKey || process.env.RESEND_API_KEY || '').trim()
    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Chưa có Resend API Key. Vui lòng nhập API Key bắt đầu bằng re_...',
        }),
      }
    }

    // Determine sender address
    let sender = body.from?.trim() || 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>'
    if (sender.includes('@gmail.com') || sender.includes('@yahoo.com') || sender.includes('@outlook.com')) {
      sender = 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>'
    }

    // Call Resend API server-to-server (No CORS issues)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: cleanRecipients,
        subject: body.subject || '[HMC 2026] Xác nhận đăng ký Casting CTV - CLB Âm nhạc HUFLIT',
        html: body.html || '<p>Xác nhận đăng ký casting HMC 2026</p>',
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      let errorMessage = resendData.message || `Resend trả về mã lỗi HTTP ${resendResponse.status}`
      if (resendData.name === 'validation_error' && resendData.message?.includes('testing emails')) {
        errorMessage =
          'Tài khoản Resend miễn phí (chưa gắn tên miền riêng) chỉ cho phép gửi email thử nghiệm đến chính email đăng ký Resend của bạn. Để gửi cho tất cả thí sinh (@student.edu.vn, @gmail.com), bạn nên dùng phương thức Google Apps Script hoặc EmailJS.'
      }

      return {
        statusCode: resendResponse.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: errorMessage,
          raw: resendData,
        }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: resendData.id,
        message: 'Đã chuyển phát email thành công qua Resend.',
      }),
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: err.message || 'Lỗi xử lý gửi email trên Netlify Function.',
      }),
    }
  }
}
