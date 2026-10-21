import React, { useState, useEffect, useRef, useId } from 'react'
import {
  X,
  Sparkles,
  Mic,
  Activity,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  Music,
  Heart,
  HelpCircle,
  Flame,
  Calendar,
  Clock,
  Mail,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sound } from '../../lib/audioSynth'
import { clubData } from '../../data/socialLinks'
import { submitApplication, RecruitmentFormData } from '../../lib/recruitmentService'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormErrors {
  fullName?: string
  email?: string
  studentId?: string
  castingDivision?: string
  castingSong?: string
  beatUrl?: string
  performanceUrl?: string
  passion?: string
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const formId = useId()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Form State — Preserves data across division switches & experience toggles
  const [formData, setFormData] = useState<RecruitmentFormData>({
    fullName: '',
    email: '',
    studentId: '',
    castingDivision: null,
    castingSong: '',
    beatUrl: '',
    hasPerformanceExperience: false,
    performanceUrl: '',
    passion: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState('')
  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState<{ sent?: boolean; error?: string } | null>(null)
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  // Check if user has entered significant data
  const isFormDirty = Boolean(
    formData.fullName.trim() ||
      formData.email.trim() ||
      formData.studentId.trim() ||
      formData.castingSong.trim() ||
      formData.beatUrl.trim() ||
      formData.passion.trim().length > 10
  )

  // Body Scroll Lock & Lenis Pause & Escape Key Support
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Pause Lenis smooth scroll while modal is active
    const lenisInstance = (window as any).__hmc_lenis
    lenisInstance?.stop?.()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleRequestClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Auto-focus first input on open
    const timer = setTimeout(() => {
      firstInputRef.current?.focus()
    }, 150)

    return () => {
      document.body.style.overflow = originalOverflow
      lenisInstance?.start?.()
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Validation Logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn.'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên quá ngắn.'
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Địa chỉ email chưa đúng định dạng (VD: name@example.com).'
    }

    // Student ID (MSSV) - Normalize & Validate
    const normalizedStudentId = formData.studentId.trim().toUpperCase()
    if (!normalizedStudentId) {
      newErrors.studentId = 'Vui lòng nhập mã số sinh viên.'
    } else if (normalizedStudentId.length < 5) {
      newErrors.studentId = 'Mã số sinh viên chưa đúng định dạng. Ví dụ: 23DHXXXXXX'
    }

    // Casting Division
    if (!formData.castingDivision) {
      newErrors.castingDivision = 'Vui lòng chọn mảng casting (Hát, Nhảy hoặc Múa).'
    }

    // Casting Song / Track - Không bắt buộc (có thể đợi tới buổi casting để điền)

    // Beat / Music URL - Không bắt buộc (có thể đợi tới buổi casting nộp)
    // Nếu có nhập thì kiểm tra định dạng URL hợp lệ
    const urlRegex = /^https?:\/\/.+/i
    if (formData.beatUrl.trim() && !urlRegex.test(formData.beatUrl.trim())) {
      newErrors.beatUrl = 'Link chưa đúng định dạng URL (bắt đầu bằng http:// hoặc https://).'
    }

    // Performance URL is required ONLY when hasPerformanceExperience === true
    if (formData.hasPerformanceExperience === true) {
      if (!formData.performanceUrl?.trim()) {
        newErrors.performanceUrl = 'Vui lòng nhập link một phần trình diễn của bạn.'
      } else if (!urlRegex.test(formData.performanceUrl.trim())) {
        newErrors.performanceUrl = 'Link chưa đúng định dạng URL (bắt đầu bằng http:// hoặc https://).'
      }
    }

    // Passion Textarea (Optional, Max 800)
    const passionLength = (formData.passion || '').trim().length
    if (passionLength > 800) {
      newErrors.passion = `Nội dung vượt quá giới hạn 800 ký tự (hiện tại ${passionLength}/800).`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      sound.playError()
      // Scroll to first error
      const firstErrorEl = modalRef.current?.querySelector('[aria-invalid="true"]')
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)
    sound.playClick()

    try {
      const result = await submitApplication(formData)
      if (result.success) {
        sound.playSuccess()
        setSubmissionId(result.id)
        setEmailDeliveryStatus({ sent: result.emailSent, error: result.emailError })
        setIsSubmitted(true)

        // Celebration Confetti
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#70D7FF', '#398BFF', '#FFB45C', '#ffffff'],
        })
      }
    } catch (err) {
      console.error('Submission error:', err)
      sound.playError()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Request Close with Safety Guard
  const handleRequestClose = () => {
    if (isFormDirty && !isSubmitted) {
      setShowConfirmClose(true)
    } else {
      handleForceClose()
    }
  }

  const handleForceClose = () => {
    sound.playClick()
    setShowConfirmClose(false)
    setIsSubmitted(false)
    setEmailDeliveryStatus(null)
    setErrors({})
    setFormData({
      fullName: '',
      email: '',
      studentId: '',
      castingDivision: null,
      castingSong: '',
      beatUrl: '',
      hasPerformanceExperience: false,
      performanceUrl: '',
      passion: '',
    })
    onClose()
  }

  // Calculate Progress
  const calculateProgress = (): number => {
    let score = 0
    if (formData.fullName.trim() && formData.email.trim() && formData.studentId.trim()) score += 50
    if (formData.castingDivision) score += 30
    if (formData.castingSong.trim()) score += 10
    if (formData.beatUrl.trim()) score += 10
    return Math.min(100, score)
  }

  const progressPercent = calculateProgress()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden selection:bg-[#398BFF] selection:text-white"
    >
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-[#050D1A]/88 backdrop-blur-md transition-opacity duration-300"
        onClick={handleRequestClose}
      />

      {/* 2. Main Modal Window */}
      <div
        ref={modalRef}
        data-lenis-prevent="true"
        className="relative w-full sm:max-w-[1040px] h-[100dvh] sm:h-auto sm:max-h-[90vh] bg-[#050D1A]/96 border border-[#70D7FF]/20 rounded-none sm:rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.92),0_0_40px_rgba(57,139,255,0.18)] text-[#F4F7FB] z-10 flex flex-col overflow-hidden my-0 sm:my-auto transition-all duration-300"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 10%, rgba(57, 139, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(112, 215, 255, 0.06) 0%, transparent 50%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with safe area padding */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-10 py-3.5 sm:py-4 bg-[#050D1A]/95 backdrop-blur-md border-b border-white/10 pt-safe">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-2 h-2 rounded-full bg-[#70D7FF] shadow-[0_0_8px_#70D7FF]" />
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.28em] text-[#70D7FF] uppercase font-semibold">
              HMC RECRUITMENT 2026
            </span>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            aria-label="Đóng biểu mẫu"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-[#F4F7FB] border border-white/10 transition-all cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#071A33] h-1 shrink-0 relative">
          <div
            className="h-full bg-gradient-to-r from-[#398BFF] via-[#70D7FF] to-[#398BFF] transition-all duration-300 shadow-[0_0_10px_#70D7FF]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body with safe bottom padding */}
        <div
          data-lenis-prevent="true"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-10 py-5 sm:py-8 custom-scrollbar pb-safe"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {isSubmitted ? (
            /* SUCCESS STATE */
            <div className="text-center py-8 sm:py-16 max-w-xl mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#70D7FF]/15 border border-[#70D7FF]/50 flex items-center justify-center text-[#70D7FF] shadow-[0_0_30px_rgba(112,215,255,0.4)] mb-5 sm:mb-6">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#398BFF]/15 border border-[#70D7FF]/30 text-[11px] sm:text-xs font-semibold text-[#70D7FF] tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MÃ HỒ SƠ: {submissionId}</span>
              </div>

              <h3 className="font-serif-display text-2xl sm:text-4xl text-white tracking-tight leading-tight mb-2.5 sm:mb-3">
                ĐƠN ĐĂNG KÝ ĐÃ ĐƯỢC GỬI!
              </h3>

              <p className="font-sans text-sm sm:text-base text-[#91A4BB] leading-relaxed mb-6">
                Cảm ơn <span className="text-[#F4F7FB] font-semibold">{formData.fullName}</span> đã dành thời gian chia sẻ với HMC. Hãy theo dõi email <span className="text-[#70D7FF]">{formData.email}</span> và fanpage để không bỏ lỡ thông tin về buổi casting nhé!
              </p>

              {/* Selected Division Chip */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0E2A4D]/80 border border-[#70D7FF]/30 text-xs font-semibold text-white mb-5">
                {formData.castingDivision === 'vocal' ? (
                  <>
                    <Mic className="w-4 h-4 text-[#70D7FF]" />
                    <span>MẢNG CASTING: HÁT (VOCAL)</span>
                  </>
                ) : formData.castingDivision === 'dancer' ? (
                  <>
                    <Activity className="w-4 h-4 text-[#70D7FF]" />
                    <span>MẢNG CASTING: NHẢY (DANCE)</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-[#FFB45C]" />
                    <span>MẢNG CASTING: MÚA</span>
                  </>
                )}
              </div>

              {/* Email Delivery Notification Banner */}
              <div className="w-full max-w-lg mx-auto mb-7 p-3.5 sm:p-4 rounded-2xl bg-[#09172B] border border-[#70D7FF]/30 text-xs text-left shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-2 font-bold text-[#70D7FF] mb-1.5 uppercase tracking-wide">
                  <Mail className="w-4 h-4 text-[#70D7FF]" />
                  <span>XÁC NHẬN HỘP THƯ EMAIL:</span>
                </div>
                {emailDeliveryStatus?.sent ? (
                  <p className="text-[#34D399] leading-relaxed">
                    ✅ Email xác nhận đăng ký &amp; thể lệ casting đã được tự động gửi đến <strong>{formData.email}</strong>. Vui lòng kiểm tra Hộp thư đến (hoặc hòm thư Spam/Quảng cáo)!
                  </p>
                ) : emailDeliveryStatus?.error ? (
                  <p className="text-[#FFE082] leading-relaxed">
                    📩 Đơn đăng ký đã lưu thành công! Email xác nhận đang được xử lý chuyển tiếp tới <strong>{formData.email}</strong>. Ban tổ chức sẽ liên hệ hỗ trợ bạn qua email/SĐT trước ngày casting.
                  </p>
                ) : (
                  <p className="text-[#C9D9EC] leading-relaxed">
                    📩 Hệ thống đã ghi nhận email <strong>{formData.email}</strong>. Email xác nhận và thể lệ casting đang được tự động chuyển phát tới hòm thư của bạn!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleForceClose}
                  className="w-full sm:w-auto btn-primary-glow px-8 py-3.5 rounded-full text-sm font-semibold text-white tracking-wide cursor-pointer"
                >
                  Quay lại trang chủ
                </button>

                <a
                  href={clubData.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#071A33]/80 hover:bg-[#0E2A4D] border border-[#70D7FF]/25 text-sm font-semibold text-[#91A4BB] hover:text-white transition-all cursor-pointer"
                >
                  <span>Theo dõi HMC Fanpage</span>
                  <ExternalLink className="w-4 h-4 text-[#70D7FF]" />
                </a>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Form Title Heading & Recruitment Meta */}
              <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8">
                <h2
                  id={`${formId}-title`}
                  className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-white tracking-tight leading-[1.15] mb-2.5"
                >
                  <span>TRỞ THÀNH MỘT PHẦN </span>
                  <br className="hidden sm:block" />
                  <span>CỦA </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
                    HMC
                  </span>
                </h2>

                <p className="font-sans text-sm sm:text-base text-[#91A4BB] leading-relaxed mb-3">
                  Chọn lĩnh vực bạn muốn casting (Hát, Nhảy, Múa) và chia sẻ cùng chúng mình nhé.
                </p>

                {/* Recruitment Period Quick Banner */}
                <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-xl bg-[#09172B] border border-[#70D7FF]/25 text-xs text-[#C4D5E8] mb-3">
                  <span className="flex items-center gap-1 text-[#70D7FF] font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Đăng ký: 19g00 11/10 – 21g00 04/11/2026
                  </span>
                  <span className="text-[#70D7FF]/40 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 text-[#B8CDE5]">
                    <Calendar className="w-3.5 h-3.5 text-[#FFB45C]" />
                    Casting: 06/11 & 07/11/2026
                  </span>
                </div>

                {/* Casting Status Chip */}
                {formData.castingDivision && (
                  <div className="mt-2 flex justify-center">
                    <div
                      key={`status-chip-${formData.castingDivision}`}
                      className="animate-chip-fade select-none"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: 'rgba(70, 140, 255, 0.12)',
                        border: '1px solid rgba(110, 195, 255, 0.3)',
                        color: '#BFE8FF',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {formData.castingDivision === 'vocal' ? (
                        <>
                          <Mic className="w-4 h-4 text-[#70D7FF] shrink-0" />
                          <span>Đang chọn: Hát (Vocal)</span>
                        </>
                      ) : formData.castingDivision === 'dancer' ? (
                        <>
                          <Activity className="w-4 h-4 text-[#70D7FF] shrink-0" />
                          <span>Đang chọn: Nhảy (Dance)</span>
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4 text-[#FFB45C] shrink-0" />
                          <span>Đang chọn: Múa</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 01 — THÔNG TIN CỦA BẠN */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    01
                  </span>
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
                    Thông tin của bạn
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                  {/* Họ và tên */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-name`}
                      className="block text-xs sm:text-sm font-medium text-[#B8CDE5]"
                    >
                      Họ và tên <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id={`${formId}-name`}
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value })
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                      }}
                      aria-invalid={Boolean(errors.fullName)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                        errors.fullName
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-email`}
                      className="block text-xs sm:text-sm font-medium text-[#B8CDE5]"
                    >
                      Email <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (errors.email) setErrors({ ...errors, email: undefined })
                      }}
                      aria-invalid={Boolean(errors.email)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                        errors.email
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Mã số sinh viên */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label
                      htmlFor={`${formId}-studentId`}
                      className="block text-xs sm:text-sm font-medium text-[#B8CDE5]"
                    >
                      Mã số sinh viên <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <input
                      id={`${formId}-studentId`}
                      type="text"
                      required
                      placeholder="23DHXXXXXX"
                      value={formData.studentId}
                      onChange={(e) => {
                        // Normalize to uppercase
                        const val = e.target.value.toUpperCase()
                        setFormData({ ...formData, studentId: val })
                        if (errors.studentId) setErrors({ ...errors, studentId: undefined })
                      }}
                      aria-invalid={Boolean(errors.studentId)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] font-mono tracking-wider outline-none transition-all placeholder:text-[#91A4BB]/45 uppercase ${
                        errors.studentId
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs text-[#91A4BB]/70 mt-1">
                      <span>Ví dụ: 23DHXXXXXX</span>
                    </div>
                    {errors.studentId && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.studentId}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 02 — MẢNG CASTING */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    02
                  </span>
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
                    Lĩnh vực tuyển chọn <span className="text-[#70D7FF]">*</span>
                  </h3>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Chọn lĩnh vực casting"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
                >
                  {/* Option 1: HÁT (VOCAL) */}
                  <div
                    role="radio"
                    aria-checked={formData.castingDivision === 'vocal'}
                    tabIndex={0}
                    onClick={() => {
                      sound.playClick()
                      setFormData((prev) => ({ ...prev, castingDivision: 'vocal' }))
                      if (errors.castingDivision) setErrors((prev) => ({ ...prev, castingDivision: undefined }))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        sound.playClick()
                        setFormData((prev) => ({ ...prev, castingDivision: 'vocal' }))
                      }
                    }}
                    className={`relative p-4 rounded-[22px] cursor-pointer transition-all duration-250 border flex flex-col justify-between select-none ${
                      formData.castingDivision === 'vocal'
                        ? 'bg-[#0E2A4D]/95 border-[#70D7FF] shadow-[0_0_24px_rgba(112,215,255,0.25)] ring-1 ring-[#70D7FF]'
                        : 'bg-[#0A1A33]/70 border-[#70D7FF]/15 hover:border-[#70D7FF]/40 hover:bg-[#0E2A4D]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                          formData.castingDivision === 'vocal'
                            ? 'bg-[#398BFF] border-[#70D7FF] text-white shadow-[0_0_15px_#398BFF]'
                            : 'bg-[#0C1D3A] border-[#70D7FF]/20 text-[#70D7FF]'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          formData.castingDivision === 'vocal'
                            ? 'border-[#70D7FF] bg-[#70D7FF] shadow-[0_0_10px_#70D7FF]'
                            : 'border-white/30 bg-transparent'
                        }`}
                      >
                        {formData.castingDivision === 'vocal' && (
                          <span className="w-2 h-2 rounded-full bg-[#050D1A]" />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-serif-display text-lg font-bold text-white tracking-wide">
                          HÁT
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#70D7FF]/15 text-[#70D7FF] font-semibold">
                          VOCAL
                        </span>
                      </div>
                      <p className="text-xs text-[#91A4BB] leading-relaxed">
                        Thể hiện màu giọng, cảm xúc và phong cách âm nhạc của bạn.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: NHẢY (DANCE) */}
                  <div
                    role="radio"
                    aria-checked={formData.castingDivision === 'dancer'}
                    tabIndex={0}
                    onClick={() => {
                      sound.playClick()
                      setFormData((prev) => ({ ...prev, castingDivision: 'dancer' }))
                      if (errors.castingDivision) setErrors((prev) => ({ ...prev, castingDivision: undefined }))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        sound.playClick()
                        setFormData((prev) => ({ ...prev, castingDivision: 'dancer' }))
                      }
                    }}
                    className={`relative p-4 rounded-[22px] cursor-pointer transition-all duration-250 border flex flex-col justify-between select-none ${
                      formData.castingDivision === 'dancer'
                        ? 'bg-[#0E2A4D]/95 border-[#70D7FF] shadow-[0_0_24px_rgba(112,215,255,0.25)] ring-1 ring-[#70D7FF]'
                        : 'bg-[#0A1A33]/70 border-[#70D7FF]/15 hover:border-[#70D7FF]/40 hover:bg-[#0E2A4D]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                          formData.castingDivision === 'dancer'
                            ? 'bg-[#398BFF] border-[#70D7FF] text-white shadow-[0_0_15px_#398BFF]'
                            : 'bg-[#0C1D3A] border-[#70D7FF]/20 text-[#70D7FF]'
                        }`}
                      >
                        <Activity className="w-5 h-5" />
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          formData.castingDivision === 'dancer'
                            ? 'border-[#70D7FF] bg-[#70D7FF] shadow-[0_0_10px_#70D7FF]'
                            : 'border-white/30 bg-transparent'
                        }`}
                      >
                        {formData.castingDivision === 'dancer' && (
                          <span className="w-2 h-2 rounded-full bg-[#050D1A]" />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-serif-display text-lg font-bold text-white tracking-wide">
                          NHẢY
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#70D7FF]/15 text-[#70D7FF] font-semibold">
                          DANCE
                        </span>
                      </div>
                      <p className="text-xs text-[#91A4BB] leading-relaxed">
                        K-Pop, Urban, Hiphop, Choreo, năng lượng làm chủ sân khấu.
                      </p>
                    </div>
                  </div>

                  {/* Option 3: MÚA */}
                  <div
                    role="radio"
                    aria-checked={formData.castingDivision === 'traditional_dance'}
                    tabIndex={0}
                    onClick={() => {
                      sound.playClick()
                      setFormData((prev) => ({ ...prev, castingDivision: 'traditional_dance' }))
                      if (errors.castingDivision) setErrors((prev) => ({ ...prev, castingDivision: undefined }))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        sound.playClick()
                        setFormData((prev) => ({ ...prev, castingDivision: 'traditional_dance' }))
                      }
                    }}
                    className={`relative p-4 rounded-[22px] cursor-pointer transition-all duration-250 border flex flex-col justify-between select-none ${
                      formData.castingDivision === 'traditional_dance'
                        ? 'bg-[#0E2A4D]/95 border-[#FFB45C] shadow-[0_0_24px_rgba(255,180,92,0.25)] ring-1 ring-[#FFB45C]'
                        : 'bg-[#0A1A33]/70 border-[#70D7FF]/15 hover:border-[#FFB45C]/40 hover:bg-[#0E2A4D]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                          formData.castingDivision === 'traditional_dance'
                            ? 'bg-[#FFB45C] border-[#FFB45C] text-[#050D1A] shadow-[0_0_15px_#FFB45C]'
                            : 'bg-[#0C1D3A] border-[#FFB45C]/30 text-[#FFB45C]'
                        }`}
                      >
                        <Flame className="w-5 h-5" />
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          formData.castingDivision === 'traditional_dance'
                            ? 'border-[#FFB45C] bg-[#FFB45C] shadow-[0_0_10px_#FFB45C]'
                            : 'border-white/30 bg-transparent'
                        }`}
                      >
                        {formData.castingDivision === 'traditional_dance' && (
                          <span className="w-2 h-2 rounded-full bg-[#050D1A]" />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-serif-display text-lg font-bold text-white tracking-wide">
                          MÚA
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FFB45C]/15 text-[#FFB45C] font-semibold">
                          TRADITIONAL / CONTEMPORARY
                        </span>
                      </div>
                      <p className="text-xs text-[#91A4BB] leading-relaxed">
                        Dân gian đương đại, múa truyền thống, ballet và kỹ thuật hình thể.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 03 — DYNAMIC CASTING SECTION */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                {/* 1. Dynamic Section Header Title */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    03
                  </span>
                  <h3
                    key={`title-${formData.castingDivision || 'default'}`}
                    className="text-sm font-semibold tracking-wider text-white uppercase font-sans animate-division-change"
                  >
                    {formData.castingDivision === 'vocal'
                      ? 'HÁT (VOCAL CASTING)'
                      : formData.castingDivision === 'dancer'
                      ? 'NHẢY (DANCE CASTING)'
                      : formData.castingDivision === 'traditional_dance'
                      ? 'MÚA (CASTING)'
                      : 'PHẦN BIỂU DIỄN CASTING'}
                  </h3>
                </div>

                {/* 2. Dynamic Section Helper / Intro Text */}
                <p
                  key={`intro-${formData.castingDivision || 'default'}`}
                  className="text-xs sm:text-sm text-[#91A4BB] leading-relaxed animate-division-change"
                >
                  {formData.castingDivision === 'vocal'
                    ? 'Hãy chuẩn bị một phần trình bày thể hiện màu giọng, cảm xúc và phong cách âm nhạc của bạn.'
                    : formData.castingDivision === 'traditional_dance'
                    ? 'Hãy chuẩn bị một phần trình diễn thể hiện sự dẻo dai, kỹ thuật hình thể, cảm xúc và khả năng cảm nhạc của bạn.'
                    : 'Hãy chuẩn bị một phần trình diễn thể hiện kỹ thuật, năng lượng và khả năng làm chủ sân khấu của bạn.'}
                </p>

                {/* Optional Song & Beat Callout */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#398BFF]/10 border border-[#70D7FF]/30 flex items-start gap-2.5 text-xs sm:text-sm text-[#C9D9EC]">
                  <Sparkles className="w-4 h-4 text-[#70D7FF] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="text-[#70D7FF] font-semibold">Lưu ý tiện lợi: </span>
                    <span>Bạn <strong>không bắt buộc phải ghi tên bài hát và nộp link beat ngay lúc này</strong>. Nếu chưa chuẩn bị xong, bạn hoàn toàn có thể để trống và <strong className="text-[#FFE082]">đợi tới buổi casting điền thông tin và nộp beat trực tiếp tại bàn Check-in</strong> nhé!</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                  {/* Vocal Mandatory Songs Notice Box */}
                  {formData.castingDivision === 'vocal' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#09172B]/95 border border-[#70D7FF]/35 space-y-3 sm:col-span-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#70D7FF] uppercase tracking-wider font-mono">
                        <Sparkles className="w-4 h-4 text-[#70D7FF]" />
                        <span>QUY ĐỊNH BÀI HÁT BẮT BUỘC KHI ĐI CASTING</span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#F4F7FB]/95 leading-relaxed">
                        Ban giám khảo sẽ <span className="text-[#70D7FF] font-bold">chọn ngẫu nhiên 1 trong 3 bài hát</span> sau và bạn <span className="text-[#FFB45C] font-bold">bắt buộc cần chuẩn bị trước ở nhà</span>:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <div className="p-3 rounded-xl bg-[#050D1A]/80 border border-[#70D7FF]/25 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm">
                          <Music className="w-4 h-4 text-[#70D7FF] shrink-0" />
                          <span>1. Linh thiêng Việt Nam</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#050D1A]/80 border border-[#70D7FF]/25 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm">
                          <Music className="w-4 h-4 text-[#70D7FF] shrink-0" />
                          <span>2. Khát vọng tuổi trẻ</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#050D1A]/80 border border-[#70D7FF]/25 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm">
                          <Music className="w-4 h-4 text-[#70D7FF] shrink-0" />
                          <span>3. Tàu anh qua núi</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Song / Track / Piece Name Input Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-song`}
                      className="block text-sm font-medium text-[#B8CDE5]"
                    >
                      {formData.castingDivision === 'vocal'
                        ? 'Bài hát cá nhân tự chọn (1–3 phút)'
                        : formData.castingDivision === 'traditional_dance'
                        ? 'Tác phẩm / bài múa bạn chọn khi đi casting'
                        : 'Bài hát / track nhảy bạn chọn khi đi casting'}{' '}
                      <span className="text-xs font-normal text-[#91A4BB] ml-1">
                        (Không bắt buộc - Có thể điền tại buổi casting)
                      </span>
                    </label>
                    <input
                      id={`${formId}-song`}
                      type="text"
                      placeholder={
                        formData.castingDivision === 'vocal'
                          ? 'Ví dụ: Ngày chưa giông bão... (hoặc để trống điền tại buổi casting)'
                          : formData.castingDivision === 'traditional_dance'
                          ? 'Ví dụ: Cò Lả, Múa Đương Đại... (hoặc để trống điền tại buổi casting)'
                          : 'Ví dụ: Supernova, Hiphop... (hoặc để trống điền tại buổi casting)'
                      }
                      value={formData.castingSong}
                      onChange={(e) => {
                        setFormData({ ...formData, castingSong: e.target.value })
                        if (errors.castingSong) setErrors({ ...errors, castingSong: undefined })
                      }}
                      aria-invalid={Boolean(errors.castingSong)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                        errors.castingSong
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    <p
                      key={`song-helper-${formData.castingDivision || 'default'}`}
                      className="text-xs text-[#91A4BB]/75 animate-division-change"
                    >
                      {formData.castingDivision === 'vocal'
                        ? '💡 Bài hát cá nhân bạn sẽ thể hiện trước BGK. Có thể để trống và đợi tới buổi casting điền tại bàn Check-in.'
                        : formData.castingDivision === 'traditional_dance'
                        ? '💡 Tác phẩm múa bạn thể hiện. Có thể để trống và đợi tới buổi casting điền tại bàn Check-in.'
                        : '💡 Track nhạc biểu diễn vũ đạo. Có thể để trống và đợi tới buổi casting điền tại bàn Check-in.'}
                    </p>
                    {errors.castingSong && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.castingSong}</span>
                      </p>
                    )}
                  </div>

                  {/* Beat / Audio Link Input Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-beat`}
                      className="block text-sm font-medium text-[#B8CDE5]"
                    >
                      {formData.castingDivision === 'vocal'
                        ? 'Link beat bài hát cá nhân tự chọn (1–3 phút)'
                        : formData.castingDivision === 'traditional_dance'
                        ? 'Link nhạc / beat múa (1–3 phút)'
                        : 'Link nhạc casting (1–3 phút)'}{' '}
                      <span className="text-xs font-normal text-[#91A4BB] ml-1">
                        (Không bắt buộc - Có thể nộp tại buổi casting)
                      </span>
                    </label>
                    <input
                      id={`${formId}-beat`}
                      type="url"
                      placeholder="https://drive.google.com/... (hoặc để trống nộp tại buổi casting)"
                      value={formData.beatUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, beatUrl: e.target.value })
                        if (errors.beatUrl) setErrors({ ...errors, beatUrl: undefined })
                      }}
                      aria-invalid={Boolean(errors.beatUrl)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                        errors.beatUrl
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    <p
                      key={`beat-helper-${formData.castingDivision || 'default'}`}
                      className="text-xs text-[#91A4BB]/75 animate-division-change"
                    >
                      💡 Bạn có thể dán link tại đây (Drive/YouTube/SoundCloud) hoặc đợi tới buổi casting để nộp USB / gửi file trực tiếp tại bàn Check-in.
                    </p>
                    {errors.beatUrl && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.beatUrl}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 5. Performance Experience Question & Segmented Control */}
                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-medium text-[#B8CDE5]">
                    Bạn đã từng biểu diễn ở bên ngoài bao giờ chưa?{' '}
                    <span className="text-[#70D7FF] font-bold">*</span>
                  </label>

                  {/* Modern Segmented Control: CÓ / CHƯA */}
                  <div className="inline-flex p-1 rounded-2xl bg-[#08172E] border border-[#78B9F0]/20 gap-1.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        setFormData((prev) => ({ ...prev, hasPerformanceExperience: true }))
                      }}
                      className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none ${
                        formData.hasPerformanceExperience === true
                          ? 'bg-gradient-to-r from-[#398BFF] to-[#1A64D8] text-white border border-[#70D7FF]/60 shadow-[0_0_18px_rgba(57,139,255,0.6)]'
                          : 'text-[#91A4BB] hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      CÓ
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        setFormData((prev) => ({
                          ...prev,
                          hasPerformanceExperience: false,
                        }))
                        if (errors.performanceUrl) {
                          setErrors((prev) => ({ ...prev, performanceUrl: undefined }))
                        }
                      }}
                      className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none ${
                        formData.hasPerformanceExperience === false
                          ? 'bg-gradient-to-r from-[#398BFF] to-[#1A64D8] text-white border border-[#70D7FF]/60 shadow-[0_0_18px_rgba(57,139,255,0.6)]'
                          : 'text-[#91A4BB] hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      CHƯA
                    </button>
                  </div>

                  {/* 6. "CÓ" BEHAVIOR: Smooth Reveal of Performance Link */}
                  {formData.hasPerformanceExperience === true && (
                    <div className="space-y-1.5 pt-2 animate-perf-reveal">
                      <label
                        htmlFor={`${formId}-perfUrl`}
                        className="block text-sm font-medium text-[#B8CDE5]"
                      >
                        Link một phần trình diễn của bạn <span className="text-[#70D7FF] font-bold">*</span>
                      </label>
                      <input
                        id={`${formId}-perfUrl`}
                        type="url"
                        required
                        placeholder="https://youtube.com/... hoặc TikTok, Facebook, Google Drive"
                        value={formData.performanceUrl || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, performanceUrl: e.target.value })
                          if (errors.performanceUrl) setErrors({ ...errors, performanceUrl: undefined })
                        }}
                        aria-invalid={Boolean(errors.performanceUrl)}
                        className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                          errors.performanceUrl
                            ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                            : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                        }`}
                      />
                      <p className="text-xs text-[#91A4BB]/70">
                        Bạn có thể gửi link YouTube, TikTok, Facebook hoặc Google Drive.
                      </p>
                      {errors.performanceUrl && (
                        <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.performanceUrl}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* 7. "CHƯA" BEHAVIOR: Encouraging Positive Note */}
                  {formData.hasPerformanceExperience === false && (
                    <div className="pt-2 animate-division-change">
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#071A33]/80 border border-[#70D7FF]/20 text-xs sm:text-sm text-[#91A4BB] shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
                        <Heart className="w-4 h-4 text-[#70D7FF] shrink-0" />
                        <span>Không sao nhé — HMC luôn chào đón những bạn muốn thử sức và phát triển cùng CLB.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 04 — MỘT CHÚT VỀ BẠN */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    04
                  </span>
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
                    Một chút về bạn
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`${formId}-passion`}
                      className="block text-sm font-medium text-[#B8CDE5]"
                    >
                      Chia sẻ niềm yêu thích âm nhạc / nghệ thuật của bạn với HMC nhé{' '}
                      <span className="text-[#91A4BB] font-normal text-xs">(Không bắt buộc)</span>
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        formData.passion.length > 800
                          ? 'text-[#FF6B6B] font-bold'
                          : 'text-[#91A4BB]'
                      }`}
                    >
                      {formData.passion.length} / 800
                    </span>
                  </div>

                  {/* Dynamic placeholder personalized for Vocal vs Dancer vs Múa */}
                  <textarea
                    id={`${formId}-passion`}
                    rows={4}
                    placeholder={
                      formData.castingDivision === 'vocal'
                        ? 'Bạn yêu thích điều gì ở việc ca hát và âm nhạc? Bạn mong muốn trải nghiệm điều gì khi tham gia HMC? (Không bắt buộc)'
                        : formData.castingDivision === 'traditional_dance'
                        ? 'Bạn yêu thích điều gì ở bộ môn múa và nghệ thuật biểu diễn? Bạn mong muốn trải nghiệm điều gì khi tham gia HMC? (Không bắt buộc)'
                        : 'Điều gì khiến bạn yêu thích nhảy và biểu diễn? Bạn mong muốn trải nghiệm điều gì khi tham gia HMC? (Không bắt buộc)'
                    }
                    value={formData.passion}
                    onChange={(e) => {
                      setFormData({ ...formData, passion: e.target.value })
                      if (errors.passion) setErrors({ ...errors, passion: undefined })
                    }}
                    aria-invalid={Boolean(errors.passion)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 resize-none leading-relaxed ${
                      errors.passion
                        ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                        : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                    }`}
                  />
                  {errors.passion && (
                    <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.passion}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SUBMIT AREA */}
              {/* ---------------------------------------------------- */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
                <p className="text-xs text-[#91A4BB] flex items-center gap-1.5 text-center sm:text-left">
                  <HelpCircle className="w-3.5 h-3.5 text-[#70D7FF] shrink-0" />
                  <span>Kiểm tra lại thông tin trước khi gửi nhé.</span>
                </p>

                <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleRequestClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-[#91A4BB] hover:text-white hover:bg-white/5 transition-all cursor-pointer text-center active:scale-95"
                    style={{ minHeight: '48px' }}
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto btn-primary-glow flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white tracking-wide cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.6)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
                    style={{ minHeight: '52px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <span>GỬI ĐƠN ĐĂNG KÝ</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* 3. Close Safety Confirmation Dialog */}
        {showConfirmClose && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#050D1A]/90 backdrop-blur-md animate-in fade-in duration-150">
            <div className="max-w-md w-full p-6 rounded-3xl bg-[#071A33] border border-[#70D7FF]/30 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B] mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif-display text-xl text-white">
                Bạn chưa gửi đơn đăng ký
              </h4>
              <p className="text-sm text-[#91A4BB] leading-relaxed">
                Thông tin bạn vừa điền sẽ bị mất nếu đóng ngay lúc này. Bạn có chắc chắn muốn đóng không?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmClose(false)}
                  className="btn-primary-glow px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white"
                >
                  Tiếp tục điền
                </button>
                <button
                  type="button"
                  onClick={handleForceClose}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold text-[#FF6B6B] transition-colors cursor-pointer"
                >
                  Đóng form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

