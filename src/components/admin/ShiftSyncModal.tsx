import React, { useState } from 'react'
import {
  X,
  FileSpreadsheet,
  Link,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  RefreshCw,
} from 'lucide-react'
import {
  getShiftWebhookUrl,
  saveShiftWebhookUrl,
  testShiftWebhookConnection,
  GOOGLE_APPS_SCRIPT_SHIFT_CODE,
  DEFAULT_SHIFT_WEBHOOK_URL,
} from '../../lib/castingShiftService'
import { sound } from '../../lib/audioSynth'

interface ShiftSyncModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ShiftSyncModal: React.FC<ShiftSyncModalProps> = ({ isOpen, onClose }) => {
  const [webhookUrl, setWebhookUrl] = useState(() => getShiftWebhookUrl())
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{ success?: boolean; message?: string } | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [hasCopiedCode, setHasCopiedCode] = useState(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'script_code' | 'guide'>('settings')

  if (!isOpen) return null

  const handleSaveUrl = () => {
    sound.playClick()
    saveShiftWebhookUrl(webhookUrl)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  const handleResetDefault = () => {
    sound.playClick()
    setWebhookUrl(DEFAULT_SHIFT_WEBHOOK_URL)
    saveShiftWebhookUrl(DEFAULT_SHIFT_WEBHOOK_URL)
    setCheckResult({
      success: true,
      message: 'Đã khôi phục về Webhook mặc định của HMC.',
    })
  }

  const handleTestConnection = async () => {
    sound.playClick()
    setIsChecking(true)
    setCheckResult(null)
    try {
      const result = await testShiftWebhookConnection(webhookUrl)
      setCheckResult(result)
      if (result.success) {
        sound.playSuccess()
      }
    } catch (err: any) {
      setCheckResult({
        success: false,
        message: err.message || 'Lỗi kiểm tra kết nối Webhook.',
      })
    } finally {
      setIsChecking(false)
    }
  }

  const handleCopyCode = async () => {
    sound.playClick()
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SHIFT_CODE)
      setHasCopiedCode(true)
      setTimeout(() => setHasCopiedCode(false), 2500)
    } catch {
      // fallback
      const textArea = document.createElement('textarea')
      textArea.value = GOOGLE_APPS_SCRIPT_SHIFT_CODE
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setHasCopiedCode(true)
      setTimeout(() => setHasCopiedCode(false), 2500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#071322] border-2 border-[#70D7FF]/40 shadow-[0_0_60px_rgba(57,139,255,0.4)] overflow-hidden">
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#092342] to-[#071B33] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#70D7FF]/20 border border-[#70D7FF] flex items-center justify-center text-[#70D7FF] shadow-[0_0_15px_rgba(112,215,255,0.5)]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#70D7FF]/20 text-[#70D7FF] text-[10px] font-mono font-bold uppercase tracking-wider">
                  ĐỒNG BỘ SIÊU TỐC
                </span>
                <span className="text-[10px] text-[#A5C2DE] font-semibold">
                  (Không gửi mail • Ghi trực tiếp vào Sheet)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Link Đồng Bộ Google Sheet Ca Casting
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onClose()
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex items-center border-b border-white/10 px-5 sm:px-6 bg-[#050D1A]/60">
          <button
            type="button"
            onClick={() => {
              sound.playClick()
              setActiveTab('settings')
            }}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#70D7FF] text-[#70D7FF]'
                : 'border-transparent text-[#91A4BB] hover:text-white'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Cấu Hình Link Webhook</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick()
              setActiveTab('script_code')
            }}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'script_code'
                ? 'border-[#70D7FF] text-[#70D7FF]'
                : 'border-transparent text-[#91A4BB] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFE082]" />
            <span>Mã Google Apps Script</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick()
              setActiveTab('guide')
            }}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#70D7FF] text-[#70D7FF]'
                : 'border-transparent text-[#91A4BB] hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hướng Dẫn 3 Phút</span>
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: CẤU HÌNH LINK WEBHOOK */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#0A1A2F] border border-[#70D7FF]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#70D7FF] flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    <span>Đường Link Webhook Google Apps Script</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="text-[11px] text-[#91A4BB] hover:text-[#70D7FF] underline cursor-pointer"
                  >
                    Dùng link mặc định HMC
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-4 py-3 rounded-xl bg-[#050D1A] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#70D7FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSaveUrl}
                    className="px-5 py-3 rounded-xl bg-[#398BFF] hover:bg-[#398BFF]/85 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isSaved ? 'Đã Lưu!' : 'Lưu Link'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-[#91A4BB] leading-relaxed">
                  Mỗi khi thí sinh bấm xác nhận chọn ca tại trang{' '}
                  <strong className="text-white">/dangkica</strong>, hệ thống sẽ tự động gửi thông tin trực tiếp tới đường link này để ghi vào Google Sheet dưới 1 giây.
                </p>
              </div>

              {/* TEST KẾT NỐI */}
              <div className="p-4 rounded-2xl bg-[#050D1A] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Kiểm Tra Trạng Thái Link Webhook</h3>
                    <p className="text-xs text-[#91A4BB]">
                      Bấm nút bên dưới để thử gửi tín hiệu kiểm tra xem link Google Sheet có phản hồi không.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isChecking}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>{isChecking ? 'Đang Kiểm Tra...' : 'Kiểm Tra Kết Nối'}</span>
                  </button>
                </div>

                {checkResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                      checkResult.success
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-500/15 border-red-500/40 text-red-200'
                    }`}
                  >
                    {checkResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 leading-relaxed">{checkResult.message}</div>
                  </div>
                )}
              </div>

              {/* TÍNH CHẤT ĐỒNG BỘ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0A1A2F]/80 border border-white/10">
                  <div className="font-bold text-[#70D7FF] flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#70D7FF]" />
                    <span>LẬP TỨC &amp; TRỰC TIẾP</span>
                  </div>
                  <p className="text-[#91A4BB]">
                    Thí sinh bấm chọn ca xong là dòng thông tin xuất hiện ngay trên Google Sheet mà không cần chờ đợi.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A1A2F]/80 border border-white/10">
                  <div className="font-bold text-[#FFE082] flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#FFE082]" />
                    <span>KHÔNG GỬI EMAIL</span>
                  </div>
                  <p className="text-[#91A4BB]">
                    Quy trình đăng ký ca đã được tách biệt hoàn toàn, không gửi mail thông báo để tránh làm phiền thí sinh.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MÃ GOOGLE APPS SCRIPT */}
          {activeTab === 'script_code' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Mã Nguồn Google Apps Script Chuẩn Cho Ca Casting</h3>
                  <p className="text-xs text-[#91A4BB]">
                    Đã cấu hình tự động tạo Tab <strong className="text-white">"Đăng Ký Ca Casting"</strong> và format cột đẹp mắt.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 rounded-xl bg-[#70D7FF] hover:bg-[#70D7FF]/85 text-[#050D1A] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  {hasCopiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedCode ? 'Đã Sao Chép Toàn Bộ Mã!' : 'Sao Chép Toàn Bộ Mã'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#030914] border border-[#70D7FF]/30 p-4 overflow-hidden">
                <pre className="font-mono text-[11px] text-[#A5C2DE] overflow-x-auto max-h-[380px] leading-relaxed select-all">
                  {GOOGLE_APPS_SCRIPT_SHIFT_CODE}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: HƯỚNG DẪN CÀI ĐẶT 3 PHÚT */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs sm:text-sm text-[#C9D9EC]">
              <div className="p-4 rounded-2xl bg-[#0A1A2F] border border-white/10 space-y-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFE082]" />
                  <span>Cách tạo link đồng bộ vào Google Sheet của bạn (3 bước)</span>
                </h3>

                <ol className="list-decimal pl-5 space-y-2.5 text-[#A5C2DE]">
                  <li>
                    <strong className="text-white">Mở file Google Sheets</strong> mà bạn muốn lưu trữ danh sách ca (hoặc tạo file mới trên Google Drive).
                  </li>
                  <li>
                    Trên thanh menu trên cùng của Google Sheets, chọn:{' '}
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">
                      Tiện ích mở rộng (Extensions)
                    </span>{' '}
                    &gt;{' '}
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">Apps Script</span>.
                  </li>
                  <li>
                    Xóa sạch các dòng chữ mặc định, chuyển qua tab{' '}
                    <strong className="text-[#70D7FF]">"Mã Google Apps Script"</strong> ở trên và bấm{' '}
                    <strong className="text-white">"Sao chép toàn bộ mã"</strong>, sau đó dán vào khung soạn thảo của Apps Script. Nhấn{' '}
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">Ctrl + S</span> để Lưu.
                  </li>
                  <li>
                    Bấm nút màu xanh <strong className="text-white">"Triển khai" (Deploy)</strong> ở góc trên bên phải &gt; chọn{' '}
                    <strong className="text-white">"Tùy chọn triển khai mới" (New deployment)</strong>:
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-[#91A4BB]">
                      <li>Nhấn biểu tượng Bánh răng (⚙️) chọn loại: <strong>Ứng dụng web (Web app)</strong></li>
                      <li>Người thực thi (Execute as): <strong>Tôi (Me)</strong></li>
                      <li>
                        Quyền truy cập (Who has access):{' '}
                        <strong className="text-[#FFE082]">Bất kỳ ai (Anyone)</strong> *(BẮT BUỘC để web có thể gửi dòng vào sheet)*
                      </li>
                    </ul>
                  </li>
                  <li>
                    Bấm <strong className="text-white">Triển khai</strong>, Google sẽ hiện hộp thoại yêu cầu cấp quyền &gt; bấm{' '}
                    <strong className="text-white">Ủy quyền truy cập</strong> &gt; chọn tài khoản Google của bạn &gt; bấm{' '}
                    <strong className="text-white">Nâng cao (Advanced)</strong> &gt; bấm{' '}
                    <strong className="text-white">Đi tới ... (Không an toàn)</strong> &gt; bấm <strong className="text-white">Cho phép (Allow)</strong>.
                  </li>
                  <li>
                    Sao chép dòng <strong className="text-[#70D7FF]">URL ứng dụng web</strong> (có dạng <code>https://script.google.com/macros/s/.../exec</code>), quay lại đây dán vào tab <strong className="text-white">"Cấu Hình Link Webhook"</strong> và bấm <strong className="text-white">Lưu Link</strong>.
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Hoàn tất! Kể từ lúc này, mọi lượt đăng ký trên trang <strong>/dangkica</strong> sẽ nhảy thẳng vào file Google Sheet của bạn ngay lập tức!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 bg-[#050D1A] flex items-center justify-between">
          <div className="text-[11px] text-[#91A4BB] font-mono">
            HMC Shift Registration Sync Engine v2.0
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onClose()
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  )
}
