import React, { useState, useEffect } from 'react'
import {
  Mail,
  Send,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Printer,
  Sparkles,
  Eye,
  ListFilter,
  Check,
  Download,
  ExternalLink,
  Settings2,
  Key,
  ShieldCheck,
  SendHorizontal,
  Copy,
  Code,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { ApplicationItem } from '../../lib/adminApi'
import {
  sendConfirmationEmailsToAll,
  sendTestRealEmail,
  testWebhookUrlConnection,
  generatePersonalizedEmailHtml,
  getSentEmailIds,
  getSavedEmailConfig,
  saveEmailConfig,
  EmailProviderConfig,
  EmailDispatchProgress,
  EmailDispatchResult,
  LIVE_CASTING_GUIDE_URL,
} from '../../lib/emailService'
import { exportAuditionPlanPdf, getAuditionPlanHtml } from '../../lib/auditionPlanPdf'
import { sound } from '../../lib/audioSynth'

const APPS_SCRIPT_SAMPLE_CODE = `/**
 * 1. Hàm lấy hoặc tạo trang tính Google Sheet cho HMC
 */
function getHmcSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Vui lòng mở Google Sheet -> Tiện ích mở rộng -> Apps Script để liên kết với trang tính.");
  }
  
  var sheet = ss.getSheetByName("Danh Sách Casting") || ss.getActiveSheet();
  
  // Tự động khởi tạo dòng tiêu đề nếu sheet còn trống
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Thời Gian Nộp",
      "Mã Hồ Sơ",
      "Họ Và Tên",
      "MSSV",
      "Email Thí Sinh",
      "Mảng Casting",
      "Bài Hát / Tác Phẩm",
      "Link Beat (Nhạc Nền)",
      "Kinh Nghiệm Sân Khấu",
      "Link Clip Biểu Diễn",
      "Động Lực / Lời Nhắn"
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#D9E1F2");
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

/**
 * 2. Hàm test thử nghiệm: Bạn có thể chọn hàm này và bấm nút "▶ Chạy" trên thanh công cụ
 */
function testRun() {
  var testCandidate = {
    id: "HMC-TEST-" + Math.floor(Math.random() * 1000),
    fullName: "Thí Sinh Thử Nghiệm",
    studentId: "24DH123456",
    email: "test@gmail.com",
    castingDivision: "Hát (Vocal)",
    castingSong: "Linh thiêng Việt Nam",
    beatUrl: "https://www.youtube.com/watch?v=sample-beat",
    hasPerformanceExperience: true,
    performanceUrl: "https://www.youtube.com/watch?v=sample-clip",
    passion: "Đam mê ca hát và muốn tham gia HMC."
  };
  
  var sheet = getHmcSheet();
  sheet.appendRow([
    new Date().toLocaleString("vi-VN"),
    testCandidate.id,
    testCandidate.fullName,
    testCandidate.studentId,
    testCandidate.email,
    testCandidate.castingDivision,
    testCandidate.castingSong,
    testCandidate.beatUrl,
    "Đã có kinh nghiệm",
    testCandidate.performanceUrl,
    testCandidate.passion
  ]);
  
  Logger.log("✅ Đã ghi thành công 1 dòng thử nghiệm vào Google Sheet!");
}

/**
 * 3. Hàm nhận dữ liệu tự động từ Website HMC khi thí sinh nộp hồ sơ
 */
function doPost(e) {
  try {
    var rawContents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(rawContents);
    var candidate = data.candidate || {};
    var to = data.to || data.email || candidate.email || data.recipient;
    var subject = data.subject || "[HMC 2026] Xác nhận đăng ký Casting CTV - CLB Âm nhạc HUFLIT";
    var htmlBody = data.html || data.message || data.body || "<p>Xác nhận đăng ký casting HMC 2026</p>";
    
    // ========================================================
    // TỰ ĐỘNG LƯU VÀO GOOGLE SHEET (ĐẦY ĐỦ CỘT & LINK BEAT)
    // ========================================================
    try {
      var sheet = getHmcSheet();
      sheet.appendRow([
        new Date().toLocaleString("vi-VN"),
        candidate.id || data.id || "",
        candidate.fullName || data.fullName || "",
        candidate.studentId || data.studentId || "",
        to || candidate.email || "",
        candidate.castingDivision || data.castingDivision || "",
        candidate.castingSong || data.castingSong || "",
        candidate.beatUrl || data.beatUrl || "",
        candidate.hasPerformanceExperience ? "Đã có kinh nghiệm" : "Chưa có",
        candidate.performanceUrl || data.performanceUrl || "",
        candidate.passion || data.passion || ""
      ]);
    } catch (sheetErr) {
      Logger.log("Lỗi ghi Sheet: " + sheetErr.toString());
    }
    
    // ========================================================
    // GỬI EMAIL XÁC NHẬN CHO THÍ SINH
    // ========================================================
    if (to && to.indexOf("@") !== -1) {
      try {
        MailApp.sendEmail({
          to: to,
          subject: subject,
          htmlBody: htmlBody,
          name: "CLB Âm nhạc HUFLIT (HMC)"
        });
      } catch (mailErr) {
        Logger.log("Lỗi gửi mail: " + mailErr.toString());
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: "Đã lưu vào Google Sheet và gửi email cho thí sinh thành công!" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 4. Hàm kiểm tra trạng thái Online của Webhook
 */
function doGet(e) {
  return ContentService.createTextOutput("HMC Webhook & Google Sheets Sync is ONLINE & Ready!")
    .setMimeType(ContentService.MimeType.TEXT);
}`

interface EmailConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  applications: ApplicationItem[]
  onSuccess?: () => void
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  applications,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'preview_email' | 'preview_pdf' | 'recipients_list' | 'email_settings'>(
    'preview_email'
  )
  const [divisionScope, setDivisionScope] = useState<'all' | 'vocal' | 'dancer' | 'traditional_dance'>('all')
  const [customNote, setCustomNote] = useState(
    'Lưu ý: Các bạn vui lòng mang theo Thẻ sinh viên HUFLIT (hoặc CCCD/VNeID) khi đến check-in tại Phòng Hội thảo nhé!'
  )
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState<EmailDispatchProgress>({
    current: 0,
    total: 0,
    currentCandidate: null,
    status: 'idle',
    logs: [],
  })
  const [sentResult, setSentResult] = useState<EmailDispatchResult | null>(null)
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)

  // Real Email Provider Settings State
  const [emailConfig, setEmailConfig] = useState<EmailProviderConfig>(() => getSavedEmailConfig())
  const [testEmailTarget, setTestEmailTarget] = useState('clbamnhac.huflit@gmail.com')
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testSendStatus, setTestSendStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  const [showAppsScriptGuide, setShowAppsScriptGuide] = useState(true)
  const [hasCopiedScript, setHasCopiedScript] = useState(false)
  const [isCheckingWebhook, setIsCheckingWebhook] = useState(false)
  const [webhookCheckResult, setWebhookCheckResult] = useState<{ success?: boolean; message?: string } | null>(null)

  const sentEmailIds = getSentEmailIds()

  // Filter recipient candidates based on selected division scope
  const targetCandidates = applications.filter((app) => {
    if (divisionScope === 'all') return true
    return app.castingDivision === divisionScope
  })

  const previewCandidate =
    targetCandidates[selectedPreviewIndex] || targetCandidates[0] || applications[0]

  useEffect(() => {
    if (isOpen) {
      setSentResult(null)
      setIsSending(false)
      setTestSendStatus(null)
      setEmailConfig(getSavedEmailConfig())
      setProgress({
        current: 0,
        total: targetCandidates.length,
        currentCandidate: null,
        status: 'idle',
        logs: [],
      })
      setSelectedPreviewIndex(0)
    }
  }, [isOpen, divisionScope])

  if (!isOpen) return null

  const handleSaveConfig = (newConfig: EmailProviderConfig) => {
    setEmailConfig(newConfig)
    saveEmailConfig(newConfig)
    sound.playSuccess()
  }

  const handleCheckWebhook = async () => {
    const url = emailConfig.webhookUrl?.trim()
    if (!url) {
      alert('Vui lòng dán đường link Google Apps Script / Webhook URL trước khi kiểm tra.')
      return
    }

    setIsCheckingWebhook(true)
    setWebhookCheckResult(null)
    sound.playClick()

    try {
      const res = await testWebhookUrlConnection(url)
      setWebhookCheckResult(res)
      if (res.success) {
        sound.playSuccess()
      } else {
        sound.playError()
      }
    } catch (err: any) {
      setWebhookCheckResult({
        success: false,
        message: `❌ Lỗi kiểm tra: ${err.message || 'Không kết nối được tới URL.'}`,
      })
      sound.playError()
    } finally {
      setIsCheckingWebhook(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmailTarget.trim()) {
      alert('Vui lòng nhập địa chỉ email nhận test.')
      return
    }

    setIsSendingTest(true)
    setTestSendStatus(null)
    sound.playClick()

    try {
      const res = await sendTestRealEmail(testEmailTarget, emailConfig, customNote)
      if (res.success) {
        sound.playSuccess()
        setTestSendStatus({
          success: true,
          message: `✅ Đã gửi thành công 1 email thử nghiệm đến ${testEmailTarget}! Vui lòng kiểm tra Hộp thư đến (hoặc thư mục Spam).`,
        })
      } else {
        setTestSendStatus({
          success: false,
          message: `❌ Lỗi gửi email thử nghiệm: ${res.error}`,
        })
      }
    } catch (err: any) {
      setTestSendStatus({
        success: false,
        message: `❌ Lỗi kết nối: ${err.message || 'Không gửi được.'}`,
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleStartSending = async () => {
    if (targetCandidates.length === 0) {
      alert('Không có thí sinh nào trong danh sách được chọn.')
      return
    }

    const confirmSend = window.confirm(
      `Xác nhận gửi email xác nhận tham gia Casting kèm liên kết thể lệ website cho ${targetCandidates.length} thí sinh?`
    )
    if (!confirmSend) return

    setIsSending(true)
    setSentResult(null)
    sound.playClick()

    try {
      const result = await sendConfirmationEmailsToAll(
        targetCandidates,
        {
          customNote: customNote.trim(),
          includePdfAttachment: true,
          config: emailConfig,
        },
        (p) => setProgress(p)
      )

      setSentResult(result)
      sound.playSuccess()
      if (onSuccess) onSuccess()
    } catch (err: any) {
      alert('Có lỗi khi gửi email: ' + (err.message || 'Lỗi không xác định.'))
    } finally {
      setIsSending(false)
    }
  }

  const handleOpenPdfFullWindow = () => {
    if (previewCandidate) {
      const divLabel =
        previewCandidate.castingDivision === 'vocal'
          ? 'Hát (Vocal)'
          : previewCandidate.castingDivision === 'dancer'
          ? 'Nhảy (Dance)'
          : 'Múa (Traditional / Contemporary)'
      exportAuditionPlanPdf(previewCandidate.fullName, previewCandidate.studentId, divLabel)
    } else {
      exportAuditionPlanPdf()
    }
  }

  const percentComplete =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#09172B] border border-[#78B9F0]/30 rounded-3xl w-full max-w-5xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#061120]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#398BFF] to-[#70D7FF] flex items-center justify-center text-[#030F20] shadow-[0_0_15px_rgba(112,215,255,0.4)]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Gửi Email Xác Nhận &amp; Thể Lệ Casting</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#70D7FF]/20 text-[#70D7FF] border border-[#70D7FF]/40 font-mono">
                  {targetCandidates.length} thí sinh
                </span>
              </h3>
              <p className="text-xs text-[#91A4BB]">
                Tự động cá nhân hóa thông tin, kèm lịch casting và đường dẫn thể lệ chuẩn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#91A4BB] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* SCOPE SELECTOR & TABS */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            {/* Division Scope Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#91A4BB] uppercase font-mono font-semibold">
                Đối tượng nhận:
              </span>
              <div className="flex rounded-xl bg-[#050D1A] p-1 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setDivisionScope('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                    divisionScope === 'all'
                      ? 'bg-[#398BFF] text-white shadow-sm'
                      : 'text-[#91A4BB] hover:text-white'
                  }`}
                >
                  Tất cả ({applications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDivisionScope('vocal')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                    divisionScope === 'vocal'
                      ? 'bg-[#398BFF] text-white shadow-sm'
                      : 'text-[#91A4BB] hover:text-white'
                  }`}
                >
                  Hát ({applications.filter((a) => a.castingDivision === 'vocal').length})
                </button>
                <button
                  type="button"
                  onClick={() => setDivisionScope('dancer')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                    divisionScope === 'dancer'
                      ? 'bg-[#398BFF] text-white shadow-sm'
                      : 'text-[#91A4BB] hover:text-white'
                  }`}
                >
                  Nhảy ({applications.filter((a) => a.castingDivision === 'dancer').length})
                </button>
                <button
                  type="button"
                  onClick={() => setDivisionScope('traditional_dance')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                    divisionScope === 'traditional_dance'
                      ? 'bg-[#398BFF] text-white shadow-sm'
                      : 'text-[#91A4BB] hover:text-white'
                  }`}
                >
                  Múa ({applications.filter((a) => a.castingDivision === 'traditional_dance').length})
                </button>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex rounded-xl bg-[#050D1A] p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('preview_email')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
                  activeTab === 'preview_email'
                    ? 'bg-[#70D7FF]/20 text-[#70D7FF] border border-[#70D7FF]/40'
                    : 'text-[#91A4BB] hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem Thư Mẫu</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview_pdf')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
                  activeTab === 'preview_pdf'
                    ? 'bg-[#70D7FF]/20 text-[#70D7FF] border border-[#70D7FF]/40'
                    : 'text-[#91A4BB] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Xem Thể Lệ (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recipients_list')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
                  activeTab === 'recipients_list'
                    ? 'bg-[#70D7FF]/20 text-[#70D7FF] border border-[#70D7FF]/40'
                    : 'text-[#91A4BB] hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Danh Sách ({targetCandidates.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('email_settings')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-semibold ${
                  activeTab === 'email_settings'
                    ? 'bg-[#FFE082]/20 text-[#FFE082] border border-[#FFE082]/40'
                    : 'text-[#91A4BB] hover:text-[#FFE082]'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Cấu Hình Gửi Thật</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PREVIEW EMAIL */}
          {activeTab === 'preview_email' && (
            <div className="space-y-4">
              {/* Provider Status Banner */}
              {emailConfig.provider === 'simulation' ? (
                <div className="p-3.5 rounded-2xl bg-[#FFE082]/10 border border-[#FFE082]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5 text-[#FFE082]">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-[#E2EBF6]">
                      <span className="font-bold text-[#FFE082]">Chế độ hiện tại: Mô phỏng (Chưa kết nối API Mail Server)</span>
                      <p className="text-[11.5px] text-[#91A4BB]">
                        Để hệ thống tự động gửi thẳng vào hộp thư Gmail của thí sinh, bạn chuyển sang tab <strong className="text-[#FFE082]">“Cấu Hình Gửi Thật”</strong> (chỉ cần dán Resend API Key miễn phí).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('email_settings')}
                      className="px-3 py-1.5 rounded-xl bg-[#FFE082]/20 hover:bg-[#FFE082]/30 text-[#FFE082] font-bold text-xs border border-[#FFE082]/40 transition-colors cursor-pointer"
                    >
                      ⚙️ Cài đặt API
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const emails = targetCandidates.map((c) => c.email).join(',')
                        navigator.clipboard.writeText(emails)
                        sound.playSuccess()
                        alert(`Đã sao chép ${targetCandidates.length} địa chỉ email vào bộ nhớ tạm!`)
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
                      title="Sao chép toàn bộ email để dán vào ô BCC của Gmail"
                    >
                      📋 Copy BCC
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-between text-xs text-[#34D399]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Đã kết nối dịch vụ gửi email tự động: <strong>{emailConfig.provider.toUpperCase()}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('email_settings')}
                    className="text-xs text-[#70D7FF] underline hover:text-white"
                  >
                    Thay đổi cấu hình
                  </button>
                </div>
              )}

              {/* Custom Note input from Admin */}
              <div className="p-4 rounded-2xl bg-[#050D1A]/70 border border-[#78B9F0]/20 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#70D7FF] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lời nhắn bổ sung từ Ban Tổ Chức (chèn vào trong email):</span>
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Nhập lời nhắn hoặc lưu ý riêng cho đợt casting..."
                  className="w-full p-3 rounded-xl bg-[#09172B] border border-white/10 text-xs text-[#F4F7FB] focus:border-[#70D7FF] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Sample Candidate Switcher */}
              {targetCandidates.length > 1 && (
                <div className="flex items-center justify-between text-xs text-[#91A4BB] px-2">
                  <span>
                    Đang xem trước nội dung cho:{' '}
                    <strong className="text-white">
                      {previewCandidate?.fullName} ({previewCandidate?.studentId})
                    </strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={selectedPreviewIndex === 0}
                      onClick={() => setSelectedPreviewIndex((prev) => Math.max(0, prev - 1))}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      ← Trước
                    </button>
                    <span className="font-mono">
                      {selectedPreviewIndex + 1} / {targetCandidates.length}
                    </span>
                    <button
                      type="button"
                      disabled={selectedPreviewIndex >= targetCandidates.length - 1}
                      onClick={() =>
                        setSelectedPreviewIndex((prev) =>
                          Math.min(targetCandidates.length - 1, prev + 1)
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      Sau →
                    </button>
                  </div>
                </div>
              )}

              {/* Email Live HTML Preview */}
              {previewCandidate ? (
                <div
                  className="rounded-2xl overflow-hidden border border-white/10 bg-[#050D1A] p-3 max-h-[420px] overflow-y-auto custom-scrollbar"
                  dangerouslySetInnerHTML={{
                    __html: generatePersonalizedEmailHtml(previewCandidate, {
                      customNote: customNote.trim(),
                    }),
                  }}
                />
              ) : (
                <div className="p-8 text-center text-[#91A4BB] text-xs">
                  Không có ứng viên nào trong danh mục đã chọn để hiển thị bản xem trước.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PREVIEW PDF AUDITION PLAN */}
          {activeTab === 'preview_pdf' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050D1A]/80 border border-[#78B9F0]/20">
                <div className="text-xs text-[#91A4BB]">
                  Văn bản Kế hoạch &amp; Thể Lệ Tuyển CTV 2026 chính thức của Ban Tổ Chức HMC.
                </div>
                <button
                  type="button"
                  onClick={handleOpenPdfFullWindow}
                  className="btn-primary-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Mở / Tải File PDF Thể Lệ</span>
                </button>
              </div>

              {/* PDF Preview in IFrame */}
              <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-white">
                <iframe
                  title="Audition Plan PDF Preview"
                  className="w-full h-full border-none"
                  srcDoc={getAuditionPlanHtml(
                    previewCandidate?.fullName,
                    previewCandidate?.studentId,
                    previewCandidate?.castingDivision
                  )}
                />
              </div>
            </div>
          )}

          {/* TAB 3: RECIPIENTS LIST */}
          {activeTab === 'recipients_list' && (
            <div className="space-y-3">
              <div className="text-xs text-[#91A4BB] flex items-center justify-between">
                <span>
                  Danh sách <strong>{targetCandidates.length}</strong> thí sinh sẽ nhận email:
                </span>
                <span className="text-[11px] text-[#70D7FF]">
                  Đã gửi trước đó: {targetCandidates.filter((c) => sentEmailIds.has(c.id)).length} /{' '}
                  {targetCandidates.length}
                </span>
              </div>

              <div className="max-h-[380px] overflow-y-auto rounded-2xl bg-[#050D1A]/80 border border-white/10 custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#030811] text-[#91A4BB] font-mono uppercase tracking-wider sticky top-0 border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-4">MSSV</th>
                      <th className="py-2.5 px-4">Họ và tên</th>
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4">Mảng</th>
                      <th className="py-2.5 px-4 text-center">Trạng thái gửi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {targetCandidates.map((c) => {
                      const isSent = sentEmailIds.has(c.id)
                      return (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-4 font-mono font-bold text-[#70D7FF]">{c.studentId}</td>
                          <td className="py-2.5 px-4 font-semibold text-white">{c.fullName}</td>
                          <td className="py-2.5 px-4 text-[#B8CDE5] font-mono">{c.email}</td>
                          <td className="py-2.5 px-4">
                            {c.castingDivision === 'vocal' ? (
                              <span className="text-[#70D7FF] font-medium">Hát</span>
                            ) : c.castingDivision === 'dancer' ? (
                              <span className="text-[#D8B4FE] font-medium">Nhảy</span>
                            ) : (
                              <span className="text-[#FDA4AF] font-medium">Múa</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {isSent ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                                <Check className="w-3 h-3" />
                                Đã gửi trước đó
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#91A4BB]">Sẵn sàng gửi</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: EMAIL SERVICE CONFIGURATION & TEST SEND */}
          {activeTab === 'email_settings' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#050D1A]/80 border border-[#FFE082]/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#FFE082]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFE082]">
                      Chọn dịch vụ gửi Email thật vào hộp thư (Inbox):
                    </span>
                  </div>
                  <span className="text-[11px] text-[#91A4BB]">
                    Được lưu an toàn trên trình duyệt Admin
                  </span>
                </div>

                {/* Auto Send on Registration Toggle */}
                <div className="p-3.5 rounded-xl bg-[#09172B] border border-[#70D7FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#70D7FF] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#70D7FF]" />
                      <span>Tự động gửi Email xác nhận ngay khi thí sinh nộp đơn đăng ký:</span>
                    </div>
                    <p className="text-[11px] text-[#91A4BB]">
                      Hệ thống sẽ lập tức cá nhân hóa thư và chuyển phát thẳng vào hòm thư thí sinh kèm lịch casting và đường dẫn thể lệ.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveConfig({
                        ...emailConfig,
                        autoSendOnRegistration: emailConfig.autoSendOnRegistration === false ? true : false,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center ${
                      emailConfig.autoSendOnRegistration !== false ? 'bg-[#398BFF]' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        emailConfig.autoSendOnRegistration !== false ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Provider Selector Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSaveConfig({ ...emailConfig, provider: 'emailjs' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      emailConfig.provider === 'emailjs'
                        ? 'bg-[#398BFF]/20 border-[#70D7FF] text-white shadow-[0_0_15px_rgba(112,215,255,0.3)]'
                        : 'bg-[#09172B] border-white/10 text-[#91A4BB] hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>EmailJS</span>
                      {emailConfig.provider === 'emailjs' && <Check className="w-3.5 h-3.5 text-[#70D7FF]" />}
                    </div>
                    <p className="text-[11px] text-[#C9D9EC]/70">Miễn phí 200 mail/tháng. Gửi từ Gmail/Outlook.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveConfig({ ...emailConfig, provider: 'resend' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      emailConfig.provider === 'resend'
                        ? 'bg-[#398BFF]/20 border-[#70D7FF] text-white shadow-[0_0_15px_rgba(112,215,255,0.3)]'
                        : 'bg-[#09172B] border-white/10 text-[#91A4BB] hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>Resend API</span>
                      {emailConfig.provider === 'resend' && <Check className="w-3.5 h-3.5 text-[#70D7FF]" />}
                    </div>
                    <p className="text-[11px] text-[#C9D9EC]/70">Miễn phí 3.000 mail/tháng. Tỷ lệ vào Inbox cao.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveConfig({ ...emailConfig, provider: 'webhook' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      emailConfig.provider === 'webhook'
                        ? 'bg-[#398BFF]/20 border-[#70D7FF] text-white shadow-[0_0_15px_rgba(112,215,255,0.3)]'
                        : 'bg-[#09172B] border-white/10 text-[#91A4BB] hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>Google Apps Script / Webhook</span>
                      {emailConfig.provider === 'webhook' && <Check className="w-3.5 h-3.5 text-[#70D7FF]" />}
                    </div>
                    <p className="text-[11px] text-[#C9D9EC]/70">Gửi qua Google Sheet / Apps Script Web App.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveConfig({ ...emailConfig, provider: 'simulation' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      emailConfig.provider === 'simulation'
                        ? 'bg-[#FFE082]/20 border-[#FFE082] text-white shadow-[0_0_15px_rgba(255,224,130,0.3)]'
                        : 'bg-[#09172B] border-white/10 text-[#91A4BB] hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between mb-1">
                      <span>Mô phỏng (Test)</span>
                      {emailConfig.provider === 'simulation' && <Check className="w-3.5 h-3.5 text-[#FFE082]" />}
                    </div>
                    <p className="text-[11px] text-[#C9D9EC]/70">Chạy thử nghiệm giao diện, ghi log hệ thống.</p>
                  </button>
                </div>

                {/* Specific Config Inputs */}
                {emailConfig.provider === 'resend' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                        Resend API Key (Bắt đầu bằng re_...)
                      </label>
                      <input
                        type="password"
                        value={emailConfig.resendApiKey || ''}
                        onChange={(e) => handleSaveConfig({ ...emailConfig, resendApiKey: e.target.value })}
                        placeholder="re_123456789abcdef..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-xs font-mono focus:border-[#70D7FF] focus:outline-none"
                      />
                      <p className="text-[11px] text-[#91A4BB] mt-1">
                        Lấy API key miễn phí tại{' '}
                        <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#70D7FF] underline">
                          resend.com/api-keys
                        </a>.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                        Email Người Gửi (From Header)
                      </label>
                      <input
                        type="text"
                        value={emailConfig.senderEmail || 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>'}
                        onChange={(e) => handleSaveConfig({ ...emailConfig, senderEmail: e.target.value })}
                        placeholder="CLB Âm nhạc HUFLIT <onboarding@resend.dev>"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-xs focus:border-[#70D7FF] focus:outline-none"
                      />
                      <div className="mt-1.5 p-2.5 rounded-xl bg-[#0E2A4D]/60 border border-[#70D7FF]/20 text-[11px] text-[#C9D9EC] leading-relaxed">
                        💡 <strong>Lưu ý về Resend:</strong> Nếu bạn chưa xác thực tên miền riêng trên Resend, ô Người Gửi hãy để mặc định là <code className="text-[#FFE082] bg-black/40 px-1.5 py-0.5 rounded font-mono">CLB Âm nhạc HUFLIT &lt;onboarding@resend.dev&gt;</code> (Resend không cho phép nhập đuôi @gmail.com làm From header). Nếu bạn muốn gửi trực tiếp từ chính Gmail của CLB, hãy bấm chọn tab <strong>EmailJS</strong>!
                      </div>
                    </div>
                  </div>
                )}

                {emailConfig.provider === 'emailjs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                        EmailJS Service ID
                      </label>
                      <input
                        type="text"
                        value={emailConfig.emailjsServiceId || ''}
                        onChange={(e) => handleSaveConfig({ ...emailConfig, emailjsServiceId: e.target.value })}
                        placeholder="service_xxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-xs font-mono focus:border-[#70D7FF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                        EmailJS Template ID
                      </label>
                      <input
                        type="text"
                        value={emailConfig.emailjsTemplateId || ''}
                        onChange={(e) => handleSaveConfig({ ...emailConfig, emailjsTemplateId: e.target.value })}
                        placeholder="template_xxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-xs font-mono focus:border-[#70D7FF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                        EmailJS Public Key
                      </label>
                      <input
                        type="text"
                        value={emailConfig.emailjsPublicKey || ''}
                        onChange={(e) => handleSaveConfig({ ...emailConfig, emailjsPublicKey: e.target.value })}
                        placeholder="public_xxxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-xs font-mono focus:border-[#70D7FF] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {emailConfig.provider === 'webhook' && (
                  <div className="pt-2 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider">
                          Webhook / Google Apps Script Web App URL
                        </label>
                        <span className="text-[11px] text-[#FFE082] font-medium">
                          Bắt buộc kết thúc bằng <code className="text-[#70D7FF]">/exec</code>
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          value={emailConfig.webhookUrl || ''}
                          onChange={(e) => {
                            handleSaveConfig({ ...emailConfig, webhookUrl: e.target.value })
                            setWebhookCheckResult(null)
                          }}
                          placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-xs font-mono focus:border-[#70D7FF] focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isCheckingWebhook || !emailConfig.webhookUrl?.trim()}
                          onClick={handleCheckWebhook}
                          className="px-4 py-2.5 rounded-xl bg-[#70D7FF]/20 hover:bg-[#70D7FF]/30 text-[#70D7FF] border border-[#70D7FF]/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-40"
                        >
                          {isCheckingWebhook ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Đang kiểm tra...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Kiểm Tra URL Ngay</span>
                            </>
                          )}
                        </button>
                      </div>

                      {webhookCheckResult && (
                        <div
                          className={`mt-2 p-3 rounded-xl text-xs font-medium leading-relaxed ${
                            webhookCheckResult.success
                              ? 'bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399]'
                              : 'bg-red-500/20 border border-red-500/40 text-red-300'
                          }`}
                        >
                          {webhookCheckResult.message}
                        </div>
                      )}
                    </div>

                    {/* Google Apps Script Guide & Code Helper */}
                    <div className="rounded-xl bg-[#061120] border border-[#70D7FF]/30 p-3.5 text-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setShowAppsScriptGuide(!showAppsScriptGuide)}
                          className="flex items-center gap-2 text-[#70D7FF] font-bold hover:underline cursor-pointer"
                        >
                          <Code className="w-4 h-4" />
                          <span>
                            {showAppsScriptGuide ? 'Ẩn hướng dẫn & Mã Apps Script' : '📖 Xem Hướng Dẫn Cài Đặt Google Apps Script (1 Phút) & Lấy Code'}
                          </span>
                          {showAppsScriptGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(APPS_SCRIPT_SAMPLE_CODE)
                            setHasCopiedScript(true)
                            sound.playSuccess()
                            setTimeout(() => setHasCopiedScript(false), 2500)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#70D7FF]/20 text-[#70D7FF] hover:bg-[#70D7FF]/30 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {hasCopiedScript ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{hasCopiedScript ? 'Đã sao chép code!' : '📋 Sao chép mã Apps Script'}</span>
                        </button>
                      </div>

                      {showAppsScriptGuide && (
                        <div className="space-y-3 pt-2 text-[#C9D9EC] leading-relaxed border-t border-white/10">
                          <div className="p-2.5 rounded-lg bg-[#FFE082]/15 border border-[#FFE082]/40 text-[12px] text-[#FFE082] space-y-1">
                            <p className="font-bold flex items-center gap-1.5">
                              ⚠️ NGUYÊN NHÂN GÂY LỖI "FAILED TO FETCH" HOẶC 404:
                            </p>
                            <p>
                              Khi bạn bấm <strong>Triển khai (Deploy)</strong> trong Google Apps Script, mục <strong>"Ai có quyền truy cập" (Who has access)</strong> mặc định là <em>"Chỉ mình tôi"</em>. Bạn <strong>BẮT BUỘC</strong> phải chuyển thành 👉 <strong>"Bất kỳ ai" (Anyone)</strong> để ứng dụng web có thể kết nối gửi mail!
                            </p>
                          </div>

                          <div className="space-y-2 text-[11.5px]">
                            <p><strong>Bước 1:</strong> Truy cập <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-[#70D7FF] underline font-bold">script.google.com</a> và bấm <strong>Dự án mới (New project)</strong>.</p>
                            <p><strong>Bước 2:</strong> Xóa hết nội dung trong file <code className="text-[#FFE082] font-mono">Code.gs</code>, sau đó bấm nút <em>"📋 Sao chép mã Apps Script"</em> ở góc trên bên phải rồi dán vào.</p>
                            <p><strong>Bước 3:</strong> Bấm nút <strong>Triển khai (Deploy)</strong> ở góc phải trên màn hình &gt; Chọn <strong>Tùy chọn triển khai mới (New deployment)</strong>:</p>
                            <ul className="list-disc pl-5 space-y-1 text-[#C9D9EC] bg-[#030811] p-3 rounded-lg border border-white/10">
                              <li>Chọn loại: Bấm biểu tượng ⚙️ bánh răng &gt; Chọn <strong>Ứng dụng web (Web app)</strong></li>
                              <li>Mô tả: <em>HMC Email Webhook</em></li>
                              <li>Người thực thi (Execute as): <strong>Tôi (Tài khoản Gmail của bạn)</strong></li>
                              <li>Ai có quyền truy cập (Who has access): 👉 <strong className="text-[#FFE082] underline">Bất kỳ ai (Anyone)</strong> <em>(Không chọn "Chỉ mình tôi")</em></li>
                            </ul>
                            <p><strong>Bước 4:</strong> Bấm <strong>Triển khai (Deploy)</strong> &gt; Bấm <strong>Cấp quyền truy cập (Authorize Access)</strong> &gt; Chọn tài khoản Google &gt; Bấm <strong>Nâng cao (Advanced)</strong> &gt; Bấm <strong>Đi tới... (không an toàn) / Go to ... (unsafe)</strong> &gt; Bấm <strong>Cho phép (Allow)</strong>.</p>
                            <p><strong>Bước 5:</strong> Copy đường link <strong>Ứng dụng web (Web App URL)</strong> (link kết thúc bằng <code className="text-[#70D7FF] font-mono">/exec</code>) dán vào ô bên trên và bấm nút <strong>"Kiểm Tra URL Ngay"</strong>.</p>
                          </div>

                          <div className="relative">
                            <pre className="p-3 rounded-lg bg-[#030811] border border-white/10 font-mono text-[11px] text-[#70D7FF] overflow-x-auto max-h-[160px] custom-scrollbar">
                              {APPS_SCRIPT_SAMPLE_CODE}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* TEST EMAIL SENDER BOX */}
              <div className="p-4 rounded-2xl bg-[#050D1A]/90 border border-[#70D7FF]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <SendHorizontal className="w-4 h-4 text-[#70D7FF]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#70D7FF]">
                    Gửi thử 1 Email kiểm tra vào Hộp thư cá nhân:
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={testEmailTarget}
                    onChange={(e) => setTestEmailTarget(e.target.value)}
                    placeholder="Nhập email của bạn để nhận thử..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-xs focus:border-[#70D7FF] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isSendingTest}
                    onClick={handleSendTestEmail}
                    className="btn-primary-glow px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isSendingTest ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang gửi thử...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⚡ Gửi Thử 1 Email Ngay</span>
                      </>
                    )}
                  </button>
                </div>

                {testSendStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      testSendStatus.success
                        ? 'bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399]'
                        : 'bg-red-500/20 border border-red-500/40 text-red-300'
                    }`}
                  >
                    {testSendStatus.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DISPATCH PROGRESS & LOG TERMINAL */}
          {(isSending || sentResult) && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B8CDE5] font-medium flex items-center gap-1.5">
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#70D7FF]" />
                        <span>
                          Đang gửi email: <strong>{progress.current}</strong> / {progress.total} (
                          {percentComplete}%)
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                        <span className="text-[#34D399] font-bold">
                          Đã gửi thành công {sentResult?.totalSent} email
                          {sentResult?.totalFailed ? ` (${sentResult.totalFailed} thất bại)` : ''}!
                        </span>
                      </>
                    )}
                  </span>
                  <span className="font-mono text-xs text-[#70D7FF] font-bold">
                    {percentComplete}%
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-[#050D1A] overflow-hidden border border-[#78B9F0]/20">
                  <div
                    className="h-full bg-gradient-to-r from-[#398BFF] via-[#70D7FF] to-[#34D399] transition-all duration-300"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              {/* Logs Terminal */}
              <div className="bg-[#030811] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-[#70D7FF] max-h-[140px] overflow-y-auto space-y-1 custom-scrollbar">
                {progress.logs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#050D1A]/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#91A4BB]">
            {sentResult ? (
              <span className="text-[#34D399] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Hoàn tất chiến dịch gửi email xác nhận.
              </span>
            ) : (
              <span>
                Nút thể lệ trong email dẫn trực tiếp tới:{' '}
                <a href={LIVE_CASTING_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="text-[#70D7FF] underline">
                  huflitmusicclub.netlify.app
                </a>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSending}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
            >
              {sentResult ? 'Đóng' : 'Hủy bỏ'}
            </button>

            <button
              type="button"
              disabled={isSending || targetCandidates.length === 0}
              onClick={handleStartSending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#398BFF] via-[#2563EB] to-[#70D7FF] hover:from-[#1D4ED8] hover:to-[#38BDF8] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(57,139,255,0.4)] disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tiến hành gửi...</span>
                </>
              ) : sentResult ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi lại cho danh sách này</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Bắt Đầu Gửi Email ({targetCandidates.length} Thí Sinh)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
