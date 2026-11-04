import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  User,
  ShieldCheck,
  Phone,
  AlertCircle,
  Loader2,
  Radio,
  RefreshCw,
  Check,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sound } from '../../lib/audioSynth'
import {
  AVAILABLE_CASTING_SHIFTS,
  CastingShiftOption,
  CastingShiftRegistration,
  submitCastingShiftRegistration,
  matchApplicantByStudentIdOrName,
} from '../../lib/castingShiftService'

interface CastingShiftRegistrationPageProps {
  onNavigateHome: () => void
}

export const CastingShiftRegistrationPage: React.FC<CastingShiftRegistrationPageProps> = ({
  onNavigateHome,
}) => {
  // 3 trường thông tin cần thiết: Họ và tên, MSSV & Số điện thoại
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [phone, setPhone] = useState('')

  // Tự động khớp số điện thoại nếu thí sinh đã nộp hồ sơ trước đó
  useEffect(() => {
    if ((studentId.trim() || fullName.trim()) && !phone) {
      const matched = matchApplicantByStudentIdOrName(studentId, fullName)
      if (matched?.phone) {
        setPhone(matched.phone)
      }
    }
  }, [studentId, fullName])

  // Chọn 1 trong các ca (Sáng hoặc Chiều của 1 ngày)
  const [selectedShift, setSelectedShift] = useState<CastingShiftOption | null>(null)

  // Trạng thái gửi
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState<CastingShiftRegistration | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Phân loại ca theo Ngày 1 và Ngày 2
  const day1Morning = AVAILABLE_CASTING_SHIFTS.find((s) => s.id === 'day1-morning')!
  const day1Afternoon = AVAILABLE_CASTING_SHIFTS.find((s) => s.id === 'day1-afternoon')!
  const day2Morning = AVAILABLE_CASTING_SHIFTS.find((s) => s.id === 'day2-morning')!
  const day2Afternoon = AVAILABLE_CASTING_SHIFTS.find((s) => s.id === 'day2-afternoon')!

  const handleSelectShift = (shift: CastingShiftOption) => {
    sound.playHover()
    setSelectedShift(shift)
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.')
      return
    }
    if (!studentId.trim()) {
      setErrorMessage('Vui lòng nhập Mã số sinh viên (MSSV).')
      return
    }
    if (!phone.trim()) {
      setErrorMessage('Vui lòng nhập Số điện thoại liên hệ của bạn.')
      return
    }
    const cleanPhoneDigits = phone.trim().replace(/[\s.-]/g, '')
    if (!/^(0|\+84)[0-9]{9,10}$/.test(cleanPhoneDigits)) {
      setErrorMessage('Số điện thoại không đúng định dạng (Ví dụ: 0912345678).')
      return
    }
    if (!selectedShift) {
      setErrorMessage('Vui lòng chọn 1 ca casting (Sáng hoặc Chiều) ở bảng bên dưới!')
      const scheduleEl = document.getElementById('schedule-cards-section')
      if (scheduleEl) {
        scheduleEl.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitCastingShiftRegistration({
        fullName: fullName.trim(),
        studentId: studentId.trim().toUpperCase(),
        phone: phone.trim(),
        shiftId: selectedShift.id,
      })

      if (res.success && res.registration) {
        sound.playSuccess()

        // Bắn pháo hoa ăn mừng
        try {
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#70D7FF', '#398BFF', '#FFE082', '#FFFFFF'],
          })
        } catch {
          // ignore
        }

        setSubmissionSuccess(res.registration)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setErrorMessage(res.message || 'Chưa thể ghi nhận ca. Vui lòng thử lại.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối. Vui lòng kiểm tra lại mạng.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050D1A] text-[#F4F7FB] relative selection:bg-[#398BFF] selection:text-white pb-24 overflow-x-hidden">
      {/* Background Ambient Glows & Cosmic Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#398BFF]/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-[#70D7FF]/10 blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0E2A4D]/40 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#70D7FF_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.035]" />
      </div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#050D1A]/90 backdrop-blur-md border-b border-[#70D7FF]/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Back Home Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onNavigateHome()
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E2A4D]/70 hover:bg-[#0E2A4D] border border-[#70D7FF]/30 text-[#70D7FF] hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ HMC</span>
          </button>

          {/* HMC Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#70D7FF]/50 shadow-[0_0_12px_rgba(112,215,255,0.4)] bg-[#071A33]">
              <img
                src="/assets/music-club/shared/hmc_logo.jpg"
                alt="HMC Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif-display text-sm font-bold tracking-wide text-white">
                HUFLIT MUSIC CLUB
              </span>
              <span className="text-[10px] font-mono text-[#70D7FF] uppercase tracking-wider">
                Đăng Ký Ca Casting 2026
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* SUCCESS CONFIRMATION MODAL / TICKET */}
        {submissionSuccess && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#092342] via-[#0E2F5A] to-[#071B33] border-2 border-[#70D7FF] shadow-[0_0_50px_rgba(112,215,255,0.4)] animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-[#70D7FF]/30">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#70D7FF]/20 border border-[#70D7FF] flex items-center justify-center text-[#70D7FF] shadow-[0_0_20px_rgba(112,215,255,0.5)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#70D7FF]/20 text-[#70D7FF] text-[11px] font-mono font-bold tracking-wider uppercase mb-1">
                    ĐÃ GHI NHẬN VÀO SHEET EXCEL
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Đăng Ký Ca Casting Thành Công!
                  </h2>
                </div>
              </div>

              {/* Mã ca */}
              <div className="bg-[#050D1A]/80 px-3.5 py-1.5 rounded-xl border border-white/10 font-mono text-xs">
                <span className="text-[#91A4BB]">Mã ca: </span>
                <span className="text-[#FFE082] font-bold">{submissionSuccess.id}</span>
              </div>
            </div>

            {/* Thông tin vé */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-[#050D1A]/70 border border-white/10 space-y-2 text-xs sm:text-sm">
                <div className="text-[11px] font-mono text-[#70D7FF] uppercase font-bold">
                  👤 THÔNG TIN THÍ SINH
                </div>
                <div className="flex justify-between">
                  <span className="text-[#91A4BB]">Họ và tên:</span>
                  <span className="text-white font-bold">{submissionSuccess.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#91A4BB]">Mã số sinh viên:</span>
                  <span className="text-white font-mono font-semibold">{submissionSuccess.studentId}</span>
                </div>
                {submissionSuccess.phone && (
                  <div className="flex justify-between">
                    <span className="text-[#91A4BB]">Số điện thoại:</span>
                    <span className="text-[#70D7FF] font-mono font-semibold">{submissionSuccess.phone}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#050D1A]/70 border border-[#70D7FF]/30 space-y-2 text-xs sm:text-sm">
                <div className="text-[11px] font-mono text-[#70D7FF] uppercase font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>CA CASTING ĐÃ CHỌN</span>
                </div>
                <div className="text-base sm:text-lg font-serif-display font-bold text-[#70D7FF]">
                  {submissionSuccess.fullShiftLabel}
                </div>
                <div className="text-xs text-[#91A4BB] flex items-start gap-1.5 pt-1 border-t border-white/10">
                  <MapPin className="w-4 h-4 text-[#70D7FF] shrink-0 mt-0.5" />
                  <span>Phòng Hội thảo, tầng 1 – HUFLIT Cơ sở Sư Vạn Hạnh</span>
                </div>
              </div>
            </div>

            {/* Xác nhận đồng bộ trực tiếp vào Sheet */}
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-xs text-emerald-200 flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="leading-relaxed">
                Thông tin ca casting và số điện thoại của bạn đã được <strong className="text-white">lưu trực tiếp vào Google Sheet</strong> của ban tổ chức ngay lập tức. Lựa chọn của bạn đã được bảo đảm!
              </div>
            </div>

            {/* Thao tác */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  sound.playClick()
                  setSubmissionSuccess(null)
                  setSelectedShift(null)
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Đăng ký cho bạn khác / Chọn lại ca</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick()
                  onNavigateHome()
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#398BFF] hover:bg-[#398BFF]/85 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
              >
                <span>Về Trang Chủ HMC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* HERO TITLE */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E2A4D]/80 border border-[#70D7FF]/30 text-[#70D7FF] text-xs font-semibold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(112,215,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#70D7FF]" />
            <span>HỘI TUYỂN CỘNG TÁC VIÊN HMC 2026</span>
          </div>

          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[46px] text-white tracking-tight leading-[1.18] mb-3">
            <span>ĐĂNG KÝ </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
              CA CASTING
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#91A4BB] leading-relaxed">
            Điền Họ tên, MSSV, Số điện thoại và chọn <strong>1 trong 2 ca (Sáng hoặc Chiều)</strong> trong ngày bạn muốn tham gia casting.
          </p>
        </div>

        {/* FORM NHẬP THÔNG TIN (HỌ TÊN, MSSV & SĐT) */}
        <section className="mb-8">
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[#70D7FF]/25 bg-[#09172B]/85 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
              <div className="w-8 h-8 rounded-xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] font-mono font-bold text-xs">
                01
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Thông Tin Thí Sinh
                </h2>
                <p className="text-xs text-[#91A4BB]">
                  Vui lòng nhập chính xác họ tên, mã số sinh viên và số điện thoại liên hệ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-medium text-[#C9D9EC] mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#70D7FF]" />
                  <span>Họ và tên thí sinh <span className="text-red-400">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Phan Thị Thuỳ Dương"
                  className="w-full px-4 py-3 rounded-2xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-2 focus:ring-[#70D7FF]/30 text-white text-sm outline-none transition-all placeholder-[#91A4BB]/40"
                />
              </div>

              {/* Mã số sinh viên */}
              <div>
                <label className="block text-xs font-medium text-[#C9D9EC] mb-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#70D7FF]" />
                  <span>Mã số sinh viên (MSSV) <span className="text-red-400">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Ví dụ: 25DH711114"
                  className="w-full px-4 py-3 rounded-2xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-2 focus:ring-[#70D7FF]/30 text-white text-sm uppercase font-mono outline-none transition-all placeholder-[#91A4BB]/40"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-medium text-[#C9D9EC] mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#70D7FF]" />
                  <span>Số điện thoại <span className="text-red-400">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0901234567"
                  className="w-full px-4 py-3 rounded-2xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-2 focus:ring-[#70D7FF]/30 text-white text-sm font-mono outline-none transition-all placeholder-[#91A4BB]/40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* KHUNG CHỌN THỜI GIAN CASTING NHƯ HÌNH (CHỈ CHỌN 1 TRONG 2 CA SÁNG HOẶC CHIỀU) */}
        <section id="schedule-cards-section" className="mb-8">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] font-mono font-bold text-xs">
                02
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#70D7FF]" />
                  <span>Chọn 1 Trong 2 Ca Sáng Hoặc Chiều</span>
                </h2>
                <p className="text-xs text-[#91A4BB]">
                  Bấm trực tiếp vào ca bạn muốn tham gia casting
                </p>
              </div>
            </div>

            {selectedShift && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#398BFF]/20 border border-[#70D7FF]/40 text-[#70D7FF] text-xs font-mono font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Đã chọn ca</span>
              </span>
            )}
          </div>

          {/* 2 NGÀY CASTING NHƯ HÌNH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* ======================================================== */}
            {/* THẺ 1: NGÀY 06/11/2026 - THỨ SÁU */}
            {/* ======================================================== */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[#70D7FF]/30 bg-[#09172B]/90 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div>
                {/* Header Thẻ 1 */}
                <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] font-mono font-bold text-sm shadow-[0_0_15px_rgba(112,215,255,0.3)]">
                      01
                    </div>
                    <div>
                      <h3 className="font-serif-display text-lg sm:text-xl font-bold text-white tracking-wide">
                        NGÀY 06/11/2026
                      </h3>
                      <span className="text-xs text-[#91A4BB]">Ngày Casting đợt 1</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#398BFF]/15 text-[#70D7FF] border border-[#70D7FF]/30">
                    Thứ Sáu
                  </span>
                </div>

                <div className="space-y-3">
                  {/* CA 1: BUỔI SÁNG (09g00 – 12g00) */}
                  <button
                    type="button"
                    onClick={() => handleSelectShift(day1Morning)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedShift?.id === day1Morning.id
                        ? 'bg-[#398BFF]/30 border-[#70D7FF] shadow-[0_0_20px_rgba(112,215,255,0.4)] text-white scale-[1.01]'
                        : 'bg-[#050D1A]/80 border-white/10 hover:border-[#70D7FF]/50 text-[#C9D9EC]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFB45C]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>BUỔI SÁNG</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedShift?.id === day1Morning.id
                          ? 'bg-[#70D7FF] border-[#70D7FF] text-[#050D1A]'
                          : 'border-white/20'
                      }`}>
                        {selectedShift?.id === day1Morning.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="font-serif-display text-lg sm:text-xl font-bold text-white">
                      09g00 – 12g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB] mt-0.5">
                      Check-in ca sáng và casting
                    </div>
                  </button>

                  {/* CA 2: BUỔI CHIỀU & TỐI (13g30 – 20g00) */}
                  <button
                    type="button"
                    onClick={() => handleSelectShift(day1Afternoon)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedShift?.id === day1Afternoon.id
                        ? 'bg-[#398BFF]/30 border-[#70D7FF] shadow-[0_0_20px_rgba(112,215,255,0.4)] text-white scale-[1.01]'
                        : 'bg-[#050D1A]/80 border-white/10 hover:border-[#70D7FF]/50 text-[#C9D9EC]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#70D7FF]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>BUỔI CHIỀU &amp; TỐI</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedShift?.id === day1Afternoon.id
                          ? 'bg-[#70D7FF] border-[#70D7FF] text-[#050D1A]'
                          : 'border-white/20'
                      }`}>
                        {selectedShift?.id === day1Afternoon.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="font-serif-display text-lg sm:text-xl font-bold text-white">
                      13g30 – 20g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB] mt-0.5">
                      Check-in ca chiều và tiếp tục casting
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* THẺ 2: NGÀY 07/11/2026 - THỨ BẢY */}
            {/* ======================================================== */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[#FFB45C]/30 bg-[#09172B]/90 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div>
                {/* Header Thẻ 2 */}
                <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFB45C]/20 border border-[#FFB45C]/40 flex items-center justify-center text-[#FFB45C] font-mono font-bold text-sm shadow-[0_0_15px_rgba(255,180,92,0.3)]">
                      02
                    </div>
                    <div>
                      <h3 className="font-serif-display text-lg sm:text-xl font-bold text-white tracking-wide">
                        NGÀY 07/11/2026
                      </h3>
                      <span className="text-xs text-[#91A4BB]">Ngày Casting đợt 2</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFB45C]/15 text-[#FFB45C] border border-[#FFB45C]/30">
                    Thứ Bảy
                  </span>
                </div>

                <div className="space-y-3">
                  {/* CA 1: BUỔI SÁNG (09g00 – 12g00) */}
                  <button
                    type="button"
                    onClick={() => handleSelectShift(day2Morning)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedShift?.id === day2Morning.id
                        ? 'bg-[#FFB45C]/25 border-[#FFB45C] shadow-[0_0_20px_rgba(255,180,92,0.4)] text-white scale-[1.01]'
                        : 'bg-[#050D1A]/80 border-white/10 hover:border-[#FFB45C]/50 text-[#C9D9EC]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFB45C]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>BUỔI SÁNG</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedShift?.id === day2Morning.id
                          ? 'bg-[#FFB45C] border-[#FFB45C] text-[#050D1A]'
                          : 'border-white/20'
                      }`}>
                        {selectedShift?.id === day2Morning.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="font-serif-display text-lg sm:text-xl font-bold text-white">
                      09g00 – 12g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB] mt-0.5">
                      Check-in ca sáng và casting
                    </div>
                  </button>

                  {/* CA 2: BUỔI CHIỀU (13g30 – 17g00) */}
                  <button
                    type="button"
                    onClick={() => handleSelectShift(day2Afternoon)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedShift?.id === day2Afternoon.id
                        ? 'bg-[#FFB45C]/25 border-[#FFB45C] shadow-[0_0_20px_rgba(255,180,92,0.4)] text-white scale-[1.01]'
                        : 'bg-[#050D1A]/80 border-white/10 hover:border-[#FFB45C]/50 text-[#C9D9EC]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#70D7FF]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>BUỔI CHIỀU</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedShift?.id === day2Afternoon.id
                          ? 'bg-[#FFB45C] border-[#FFB45C] text-[#050D1A]'
                          : 'border-white/20'
                      }`}>
                        {selectedShift?.id === day2Afternoon.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="font-serif-display text-lg sm:text-xl font-bold text-white">
                      13g30 – 17g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB] mt-0.5">
                      Check-in ca chiều và tiếp tục casting
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* XÁC NHẬN LỰA CHỌN VÀ NÚT GỬI */}
        <section className="mb-12">
          {errorMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Box */}
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border-2 border-[#70D7FF]/40 bg-gradient-to-br from-[#09172B] via-[#0D2442] to-[#09172B] shadow-[0_0_40px_rgba(57,139,255,0.3)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Tóm tắt */}
              <div className="space-y-1 text-center md:text-left w-full md:w-auto">
                <span className="text-[11px] font-mono uppercase font-bold text-[#70D7FF] tracking-wider block">
                  LỰA CHỌN CỦA BẠN:
                </span>

                {selectedShift ? (
                  <div>
                    <div className="text-base sm:text-lg font-extrabold text-white">
                      {selectedShift.dayOfWeek}, {selectedShift.dateLabel.split(', ')[1]} • {selectedShift.sessionLabel} ({selectedShift.timeSlot})
                    </div>
                    <div className="text-xs text-[#91A4BB]">
                      Thí sinh: <strong className="text-white">{fullName || '(Chưa nhập tên)'}</strong> {studentId && `— MSSV: ${studentId}`} {phone && `— SĐT: ${phone}`}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-[#91A4BB] italic">
                    ⚠️ Bạn chưa chọn ca casting. Vui lòng bấm chọn 1 ca Sáng hoặc Chiều ở trên!
                  </div>
                )}
              </div>

              {/* Nút gửi */}
              <div className="w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary-glow w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white tracking-wide cursor-pointer shadow-[0_0_30px_rgba(57,139,255,0.7)] active:scale-98 transition-all disabled:opacity-50"
                  style={{ minHeight: '54px' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang Lưu Vào Google Sheet...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Xác Nhận Lựa Chọn</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 border-t border-white/10 text-center text-xs text-[#91A4BB]">
          <div className="mb-1.5 font-bold text-white">
            CLB ÂM NHẠC HUFLIT (HMC)
          </div>
          <div>
            Địa điểm Casting: Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, HUFLIT
          </div>
        </footer>
      </main>
    </div>
  )
}
