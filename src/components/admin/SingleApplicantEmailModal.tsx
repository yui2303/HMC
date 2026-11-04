import React, { useState, useEffect } from 'react'
import {
  X,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  CreditCard,
  Music,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  ShieldCheck,
} from 'lucide-react'
import { ApplicationItem } from '../../lib/adminApi'
import {
  sendSingleRealEmail,
  getSavedEmailConfig,
  generatePersonalizedEmailHtml,
  LIVE_WEBSITE_URL,
} from '../../lib/emailService'
import { sound } from '../../lib/audioSynth'

interface SingleApplicantEmailModalProps {
  isOpen: boolean
  candidate: ApplicationItem | null
  onClose: () => void
  currentAdminEmail?: string
}

export const SingleApplicantEmailModal: React.FC<SingleApplicantEmailModalProps> = ({
  isOpen,
  candidate,
  onClose,
  currentAdminEmail = '',
}) => {
  const [targetType, setTargetType] = useState<'candidate' | 'custom'>('candidate')
  const [customEmail, setCustomEmail] = useState('')
  const [emailType, setEmailType] = useState<'reminder' | 'confirmation'>('reminder')
  const [customNote, setCustomNote] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (isOpen && candidate) {
      setTargetType('candidate')
      setCustomEmail(currentAdminEmail && currentAdminEmail.includes('@') ? currentAdminEmail : '')
      setEmailType('reminder')
      setCustomNote('')
      setShowPreview(false)
      setSendResult(null)
      setIsSending(false)
    }
  }, [isOpen, candidate, currentAdminEmail])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSending) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSending, onClose])

  if (!isOpen || !candidate) return null

  const resolvedRecipientEmail =
    targetType === 'candidate' ? candidate.email.trim() : customEmail.trim()

  const subject =
    emailType === 'reminder'
      ? `[HMC 2026] ⏰ Sắp đến ngày Casting rồi bạn ơi! Đăng ký ca casting ngay nhé 🎵 - ${candidate.fullName}`
      : `[HMC 2026] Xác nhận đăng ký Casting CTV - ${candidate.fullName} (${candidate.studentId})`

  const handleSend = async () => {
    if (!resolvedRecipientEmail) {
      alert('Vui lòng nhập địa chỉ email nhận thư.')
      return
    }

    if (!resolvedRecipientEmail.includes('@') || !resolvedRecipientEmail.includes('.')) {
      alert('Địa chỉ email không hợp lệ.')
      return
    }

    setIsSending(true)
    setSendResult(null)
    sound.playClick()

    try {
      const config = getSavedEmailConfig()
      const res = await sendSingleRealEmail(
        resolvedRecipientEmail,
        candidate,
        {
          emailType,
          customNote: customNote.trim() || undefined,
        },
        config
      )

      if (res.success) {
        sound.playSuccess()
        setSendResult({
          success: true,
          message: `Đã gửi thành công 1 email thử nghiệm đến "${resolvedRecipientEmail}"! Vui lòng kiểm tra Hộp thư đến (hoặc hòm thư Rác/Spam).`,
        })
      } else {
        sound.playError()
        setSendResult({
          success: false,
          message: `Gửi thất bại: ${res.error || 'Vui lòng kiểm tra lại cấu hình gửi email.'}`,
        })
      }
    } catch (err: any) {
      sound.playError()
      setSendResult({
        success: false,
        message: `Lỗi kết nối mạng: ${err.message || 'Không thể gửi email.'}`,
      })
    } finally {
      setIsSending(false)
    }
  }

  const divisionLabel =
    candidate.castingDivision === 'vocal'
      ? 'Hát (Vocal)'
      : candidate.castingDivision === 'dancer'
      ? 'Nhảy (Dance)'
      : candidate.castingDivision === 'traditional_dance'
      ? 'Múa truyền thống'
      : 'Hát (Vocal)'

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-[#091528] border border-[#78B9F0]/30 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#050D1A]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#34D399]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gửi Thử Email Cho Thí Sinh</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40">
                  1 Thí Sinh
                </span>
              </h2>
              <p className="text-xs text-[#91A4BB]">
                Kiểm tra giao diện & gửi thử 1 email riêng lẻ trước khi gửi hàng loạt
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            aria-label="Đóng"
            className="p-2 rounded-xl text-[#91A4BB] hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
          {/* Candidate Card */}
          <div className="p-3.5 rounded-2xl bg-[#050D1A]/60 border border-white/10 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#70D7FF]" />
                  <span>{candidate.fullName}</span>
                </div>
                <div className="text-[11px] font-mono text-[#70D7FF] flex items-center gap-2 mt-0.5">
                  <CreditCard className="w-3 h-3" />
                  <span>MSSV: {candidate.studentId}</span>
                  <span className="text-[#91A4BB]">•</span>
                  <span>{divisionLabel}</span>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg text-[10px] font-mono bg-[#398BFF]/15 text-[#70D7FF] border border-[#70D7FF]/30">
                {candidate.id}
              </span>
            </div>

            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[#91A4BB]">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                <span className="text-white font-medium truncate">{candidate.email}</span>
              </div>
              {candidate.castingSong && (
                <div className="flex items-center gap-1.5 truncate text-[#D8B4FE]">
                  <Music className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{candidate.castingSong}</span>
                </div>
              )}
            </div>
          </div>

          {/* Destination Selection */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B8CDE5]">
              Nơi nhận Email thử nghiệm:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  targetType === 'candidate'
                    ? 'bg-[#10B981]/15 border-[#10B981]/50 text-white shadow-sm'
                    : 'bg-[#050D1A]/40 border-white/10 text-[#91A4BB] hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="single-email-target"
                  checked={targetType === 'candidate'}
                  onChange={() => setTargetType('candidate')}
                  className="mt-0.5 accent-[#10B981]"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-white">Gửi đến thí sinh này</div>
                  <div className="text-[11px] text-[#34D399] truncate mt-0.5">{candidate.email}</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  targetType === 'custom'
                    ? 'bg-[#398BFF]/15 border-[#70D7FF]/50 text-white shadow-sm'
                    : 'bg-[#050D1A]/40 border-white/10 text-[#91A4BB] hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="single-email-target"
                  checked={targetType === 'custom'}
                  onChange={() => setTargetType('custom')}
                  className="mt-0.5 accent-[#398BFF]"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-white">Gửi thử vào Email của tôi</div>
                  <div className="text-[11px] text-[#70D7FF] mt-0.5">Admin kiểm tra trước giao diện</div>
                </div>
              </label>
            </div>

            {targetType === 'custom' && (
              <div className="pt-1.5 animate-in fade-in duration-150">
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="Nhập email cá nhân/admin của bạn để nhận thử..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A] border border-[#70D7FF]/40 text-white text-xs focus:border-[#70D7FF] focus:outline-none placeholder-[#91A4BB]/50"
                />
                <p className="text-[10px] text-[#91A4BB] mt-1">
                  💡 Thư gửi tới sẽ hiển thị đúng tên và thông tin của thí sinh {candidate.fullName} để bạn duyệt thử.
                </p>
              </div>
            )}
          </div>

          {/* Email Type Selection */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B8CDE5]">
              Mẫu nội dung Email:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  emailType === 'reminder'
                    ? 'bg-[#398BFF]/20 border-[#70D7FF]/50 text-white'
                    : 'bg-[#050D1A]/40 border-white/10 text-[#91A4BB] hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="single-email-type"
                  checked={emailType === 'reminder'}
                  onChange={() => setEmailType('reminder')}
                  className="mt-0.5 accent-[#398BFF]"
                />
                <div>
                  <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#70D7FF]" />
                    <span>Nhắc nhở Casting & Chọn ca</span>
                  </div>
                  <div className="text-[10px] text-[#70D7FF] mt-0.5">
                    Khuyên dùng • Kèm link /dangkica
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  emailType === 'confirmation'
                    ? 'bg-[#398BFF]/20 border-[#70D7FF]/50 text-white'
                    : 'bg-[#050D1A]/40 border-white/10 text-[#91A4BB] hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="single-email-type"
                  checked={emailType === 'confirmation'}
                  onChange={() => setEmailType('confirmation')}
                  className="mt-0.5 accent-[#398BFF]"
                />
                <div>
                  <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Xác nhận nộp đơn ban đầu</span>
                  </div>
                  <div className="text-[10px] text-[#91A4BB] mt-0.5">
                    Mẫu thư chào mừng & đăng ký
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Note (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B8CDE5]">
              Lời nhắn riêng của Admin (Tùy chọn):
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="VD: Bạn nhớ mang theo thẻ sinh viên và có mặt trước 15 phút nhé..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[#050D1A] border border-white/15 text-white text-xs focus:border-[#70D7FF] focus:outline-none resize-none placeholder-[#91A4BB]/50"
            />
          </div>

          {/* Toggle Live Preview */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-xs font-semibold text-[#70D7FF] hover:underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Ẩn xem trước thư' : 'Xem trước tiêu đề & nội dung email'}</span>
              {showPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showPreview && (
              <div className="mt-2.5 p-3.5 rounded-2xl bg-[#050D1A] border border-[#78B9F0]/20 space-y-2 animate-in fade-in duration-150">
                <div className="text-[11px] text-[#91A4BB]">
                  <span className="font-bold text-white">Tiêu đề: </span>
                  <span className="text-[#34D399] font-mono">{subject}</span>
                </div>
                <div className="text-[11px] text-[#91A4BB]">
                  <span className="font-bold text-white">Người nhận: </span>
                  <span className="text-white font-mono">{resolvedRecipientEmail}</span>
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-[#B8CDE5] leading-relaxed">
                  {emailType === 'reminder' ? (
                    <p>
                      Email sẽ chứa thông điệp nhắc nhở thời gian Casting (06/11 & 07/11/2026), hướng dẫn nộp beat, và nút bấm đưa thẳng vào trang Đăng ký ca casting: <span className="text-[#70D7FF] underline font-mono">{LIVE_WEBSITE_URL}/dangkica</span>.
                    </p>
                  ) : (
                    <p>
                      Email sẽ chứa thông tin hồ sơ đã nộp của thí sinh, bài hát, beat nhạc và hướng dẫn tham gia buổi casting.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Result Alert */}
          {sendResult && (
            <div
              className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-medium animate-in fade-in duration-150 ${
                sendResult.success
                  ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399]'
                  : 'bg-red-500/20 border border-red-500/50 text-red-300'
              }`}
            >
              {sendResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#34D399] mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">{sendResult.message}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#050D1A]/90 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#91A4BB] hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer disabled:opacity-40"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || !resolvedRecipientEmail}
            className="btn-primary-glow px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi email...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {targetType === 'candidate'
                    ? `Gửi Thử Cho ${candidate.fullName}`
                    : 'Gửi Thử Vào Email Của Tôi'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
