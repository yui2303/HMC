import React, { useState, useEffect, useRef } from 'react'
import {
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Search,
  User,
  Mail,
  Phone,
  Mic,
  Activity,
  Music,
  Download,
  AlertCircle,
  HelpCircle,
  Loader2,
  Radio,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  Users,
  ShieldCheck,
  ChevronDown,
  X,
  RefreshCw,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sound } from '../../lib/audioSynth'
import {
  AVAILABLE_CASTING_SHIFTS,
  CastingShiftOption,
  CastingShiftRegistration,
  getStoredShiftRegistrations,
  getShiftRegistrationCounts,
  lookupCandidateInfo,
  searchCandidateSuggestions,
  findExistingRegistration,
  submitCastingShiftRegistration,
  exportShiftRegistrationsCsv,
} from '../../lib/castingShiftService'
import { ApplicationItem } from '../../lib/adminApi'

interface CastingShiftRegistrationPageProps {
  onNavigateHome: () => void
}

export const CastingShiftRegistrationPage: React.FC<CastingShiftRegistrationPageProps> = ({
  onNavigateHome,
}) => {
  // Form State
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [castingDivision, setCastingDivision] = useState<'vocal' | 'dancer' | 'traditional_dance'>('vocal')
  const [castingSong, setCastingSong] = useState('')
  const [beatUrl, setBeatUrl] = useState('')
  const [note, setNote] = useState('')
  const [applicationId, setApplicationId] = useState('')

  // Shift Selection State
  const [selectedShift, setSelectedShift] = useState<CastingShiftOption | null>(null)

  // Lookup & Autocomplete State
  const [lookupQuery, setLookupQuery] = useState('')
  const [suggestions, setSuggestions] = useState<ApplicationItem[]>([])
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [matchedCandidate, setMatchedCandidate] = useState<ApplicationItem | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Registration & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState<CastingShiftRegistration | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedId, setCopiedId] = useState(false)

  // Shift Registration Counts
  const [shiftCounts, setShiftCounts] = useState<Record<string, number>>({})
  const [allRegistrations, setAllRegistrations] = useState<CastingShiftRegistration[]>([])
  const [showAdminListModal, setShowAdminListModal] = useState(false)

  // Load counts on mount
  useEffect(() => {
    const refreshData = () => {
      setShiftCounts(getShiftRegistrationCounts())
      setAllRegistrations(getStoredShiftRegistrations())
    }
    refreshData()

    window.addEventListener('hmc_shift_registrations_updated', refreshData)
    return () => window.removeEventListener('hmc_shift_registrations_updated', refreshData)
  }, [])

  // Autocomplete suggestions as user types in quick lookup
  useEffect(() => {
    if (!lookupQuery.trim() || lookupQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(() => {
      const results = searchCandidateSuggestions(lookupQuery, 5)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    }, 150)

    return () => clearTimeout(timer)
  }, [lookupQuery])

  // Select a suggestion from autocomplete
  const handleSelectSuggestion = (candidate: ApplicationItem) => {
    sound.playSuccess()
    setMatchedCandidate(candidate)
    setFullName(candidate.fullName)
    setStudentId(candidate.studentId)
    setEmail(candidate.email)
    setCastingDivision(candidate.castingDivision)
    setCastingSong(candidate.castingSong || '')
    setBeatUrl(candidate.beatUrl || '')
    setApplicationId(candidate.id)
    setShowSuggestions(false)
    setLookupQuery(`${candidate.fullName} (${candidate.studentId})`)

    // Check if candidate already registered a shift
    const existing = findExistingRegistration(candidate.studentId, candidate.email)
    if (existing) {
      const shiftOption = AVAILABLE_CASTING_SHIFTS.find((s) => s.id === existing.shiftId)
      if (shiftOption) {
        setSelectedShift(shiftOption)
      }
      if (existing.phone) setPhone(existing.phone)
      if (existing.note) setNote(existing.note)
    }
  }

  // Handle direct Quick Lookup search submit
  const handleQuickLookup = () => {
    if (!lookupQuery.trim()) return
    setIsLookingUp(true)
    const found = lookupCandidateInfo(lookupQuery)
    if (found) {
      handleSelectSuggestion(found)
    } else {
      sound.playClick()
      setMatchedCandidate(null)
      setErrorMessage(`Không tìm thấy thí sinh với từ khóa "${lookupQuery}". Bạn có thể tự điền thông tin bên dưới!`)
      setTimeout(() => setErrorMessage(''), 4000)
    }
    setIsLookingUp(false)
  }

  // Select a shift slot
  const handleSelectShift = (shift: CastingShiftOption) => {
    sound.playHover()
    setSelectedShift(shift)
  }

  // Submit Shift Registration
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
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ để nhận thông báo.')
      return
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Vui lòng nhập Số điện thoại hoặc Zalo liên hệ (tối thiểu 9 số).')
      return
    }
    if (!selectedShift) {
      setErrorMessage('Vui lòng chọn 01 Ca hoặc Khung giờ casting trong bảng bên dưới!')
      const scheduleEl = document.getElementById('casting-schedule-picker')
      if (scheduleEl) {
        scheduleEl.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    setIsSubmitting(true)
    try {
      const fullShiftLabel = `${selectedShift.dayOfWeek}, ${selectedShift.dateLabel.split(', ')[1] || selectedShift.date} • ${selectedShift.sessionLabel} (${selectedShift.timeSlot})`

      const result = await submitCastingShiftRegistration({
        applicationId,
        fullName: fullName.trim(),
        studentId: studentId.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        castingDivision,
        castingSong: castingSong.trim(),
        beatUrl: beatUrl.trim(),
        shiftId: selectedShift.id,
        shiftDate: selectedShift.date,
        shiftDayOfWeek: selectedShift.dayOfWeek,
        shiftSession: selectedShift.sessionLabel,
        shiftTimeSlot: selectedShift.timeSlot,
        fullShiftLabel,
        note: note.trim(),
      })

      if (result.success) {
        sound.playSuccess()

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#70D7FF', '#398BFF', '#FFE082', '#FFFFFF'],
          })
        } catch {
          // ignore
        }

        const registeredItem: CastingShiftRegistration = {
          id: result.id,
          applicationId,
          fullName: fullName.trim(),
          studentId: studentId.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          castingDivision,
          castingSong: castingSong.trim(),
          beatUrl: beatUrl.trim(),
          shiftId: selectedShift.id,
          shiftDate: selectedShift.date,
          shiftDayOfWeek: selectedShift.dayOfWeek,
          shiftSession: selectedShift.sessionLabel,
          shiftTimeSlot: selectedShift.timeSlot,
          fullShiftLabel,
          note: note.trim(),
          registeredAt: new Date().toISOString(),
        }

        setSubmissionSuccess(registeredItem)
        setShiftCounts(getShiftRegistrationCounts())
        setAllRegistrations(getStoredShiftRegistrations())
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setErrorMessage(result.message || 'Chưa thể gửi đăng ký ca. Vui lòng thử lại.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối. Vui lòng thử lại sau.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Copy registration ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Filter shifts by Day 1 & Day 2
  const day1Shifts = AVAILABLE_CASTING_SHIFTS.filter((s) => s.dayNumber === '01')
  const day2Shifts = AVAILABLE_CASTING_SHIFTS.filter((s) => s.dayNumber === '02')

  const day1MorningSlots = day1Shifts.filter((s) => s.session === 'morning')
  const day1AfternoonSlots = day1Shifts.filter((s) => s.session === 'afternoon')

  const day2MorningSlots = day2Shifts.filter((s) => s.session === 'morning')
  const day2AfternoonSlots = day2Shifts.filter((s) => s.session === 'afternoon')

  return (
    <div className="min-h-screen bg-[#050D1A] text-[#F4F7FB] relative selection:bg-[#398BFF] selection:text-white pb-24 overflow-x-hidden">
      {/* Background Ambient Glows & Cosmic Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#398BFF]/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-[#70D7FF]/10 blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0E2A4D]/40 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#70D7FF_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.035]" />
      </div>

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#050D1A]/90 backdrop-blur-md border-b border-[#70D7FF]/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
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

          {/* HMC Branding Center */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#70D7FF]/50 shadow-[0_0_12px_rgba(112,215,255,0.4)] bg-[#071A33]">
              <img
                src="/assets/music-club/shared/hmc_logo.jpg"
                alt="HMC Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-serif-display text-sm font-bold tracking-wide text-white">
                HUFLIT MUSIC CLUB
              </span>
              <span className="text-[10px] font-mono text-[#70D7FF] uppercase tracking-wider">
                Cổng Đăng Ký Ca Casting 2026
              </span>
            </div>
          </div>

          {/* Quick Actions (Admin / View List & Excel) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick()
                setShowAdminListModal(true)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#398BFF]/15 hover:bg-[#398BFF]/25 border border-[#70D7FF]/30 text-[#70D7FF] text-xs font-mono font-medium transition-all cursor-pointer"
              title="Xem danh sách các bạn đã đăng ký ca và tải Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Xem Danh Sách &amp;</span>
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* SUCCESS CONFIRMATION MODAL / BANNER */}
        {submissionSuccess && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#092342] via-[#0E2F5A] to-[#071B33] border-2 border-[#70D7FF] shadow-[0_0_50px_rgba(112,215,255,0.4)] animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-[#70D7FF]/30">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#70D7FF]/20 border border-[#70D7FF] flex items-center justify-center text-[#70D7FF] shadow-[0_0_20px_rgba(112,215,255,0.5)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#70D7FF]/20 text-[#70D7FF] text-[11px] font-mono font-bold tracking-wider uppercase mb-1">
                    ĐÃ GHI NHẬN THÀNH CÔNG VÀO SHEET EXCEL
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    Đăng Ký Ca Casting Thành Công!
                  </h2>
                </div>
              </div>

              {/* Mã xác nhận */}
              <div className="flex items-center gap-2 bg-[#050D1A]/80 px-3.5 py-1.5 rounded-xl border border-white/10 font-mono text-xs">
                <span className="text-[#91A4BB]">Mã ca:</span>
                <span className="text-[#FFE082] font-bold">{submissionSuccess.id}</span>
                <button
                  type="button"
                  onClick={() => handleCopyId(submissionSuccess.id)}
                  className="text-[#70D7FF] hover:text-white ml-1 cursor-pointer"
                  title="Sao chép mã"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Thông tin vé casting */}
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
                <div className="flex justify-between">
                  <span className="text-[#91A4BB]">Số điện thoại:</span>
                  <span className="text-white font-mono">{submissionSuccess.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#91A4BB]">Mảng dự thi:</span>
                  <span className="text-[#FFE082] font-bold">
                    {submissionSuccess.castingDivision === 'vocal'
                      ? 'Hát (Vocal)'
                      : submissionSuccess.castingDivision === 'dancer'
                      ? 'Nhảy (Dance)'
                      : 'Múa (Traditional)'}
                  </span>
                </div>
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

            {/* Lưu ý quan trọng */}
            <div className="p-4 rounded-2xl bg-[#FFE082]/10 border border-[#FFE082]/30 text-xs text-[#E2EBF6] space-y-1 mb-6">
              <div className="font-bold text-[#FFE082] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>LƯU Ý DÀNH CHO BẠN KHI ĐI CASTING:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#C9D9EC]">
                <li>Có mặt tại phòng casting trước ca thi ít nhất <strong>15 – 30 phút</strong> để check-in và chuẩn bị giọng/khởi động.</li>
                <li>Mang theo <strong>Thẻ sinh viên HUFLIT</strong> (hoặc CCCD / VNeID) để ban tổ chức kiểm tra danh sách.</li>
                <li>Chủ động chuẩn bị sẵn beat nhạc hoặc đạo cụ cá nhân.</li>
              </ul>
            </div>

            {/* Nút thao tác sau đăng ký */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => exportShiftRegistrationsCsv()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#398BFF]/20 hover:bg-[#398BFF]/35 border border-[#70D7FF]/40 text-[#70D7FF] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải File Excel Tổng Hợp Ca (.csv / .xlsx)</span>
              </button>

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
            </div>
          </div>
        )}

        {/* HERO TITLE SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E2A4D]/80 border border-[#70D7FF]/30 text-[#70D7FF] text-xs font-semibold uppercase tracking-wider mb-3.5 shadow-[0_0_15px_rgba(112,215,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#70D7FF]" />
            <span>HỘI TUYỂN CỘNG TÁC VIÊN HMC 2026 – 2027</span>
          </div>

          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-[52px] text-white tracking-tight leading-[1.15] mb-3">
            <span>ĐĂNG KÝ </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
              CA &amp; KHUNG GIỜ CASTING
            </span>
          </h1>

          <p className="text-xs sm:text-base text-[#91A4BB] max-w-2xl mx-auto leading-relaxed">
            Chọn ca casting và khung giờ phù hợp với thời khóa biểu của bạn. Toàn bộ thông tin lựa chọn sẽ được tự động ghi nhận vào sheet quản lý của Ban giám khảo!
          </p>

          {/* Quick info badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09172B] border border-white/10 text-xs text-[#C9D9EC]">
              <Calendar className="w-3.5 h-3.5 text-[#70D7FF]" />
              <span>06/11 &amp; 07/11/2026</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09172B] border border-white/10 text-xs text-[#C9D9EC]">
              <MapPin className="w-3.5 h-3.5 text-[#70D7FF]" />
              <span>Phòng Hội thảo tầng 1 HUFLIT</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09172B] border border-white/10 text-xs text-[#34D399]">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#34D399]" />
              <span>Cổng đăng ký đang mở</span>
            </span>
          </div>
        </div>

        {/* STEP 1: TRA CỨU HỒ SƠ ĐÃ NỘP HOẶC NHẬP THÔNG TIN */}
        <section className="mb-10">
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-[#70D7FF]/25 bg-[#09172B]/85 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] font-mono font-bold text-xs">
                  01
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Thông Tin Thí Sinh Đăng Ký
                  </h2>
                  <p className="text-xs text-[#91A4BB]">
                    Bạn có thể tra cứu nhanh từ đơn đã nộp hoặc điền thông tin trực tiếp
                  </p>
                </div>
              </div>

              {matchedCandidate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã khớp hồ sơ HMC</span>
                </span>
              )}
            </div>

            {/* Quick Lookup Bar */}
            <div className="relative mb-6">
              <label className="block text-xs font-medium text-[#70D7FF] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Tra cứu nhanh hồ sơ đã đăng ký (Gõ MSSV, Email hoặc Họ Tên):</span>
                </span>
                <span className="text-[11px] text-[#91A4BB] font-normal">
                  Tự động điền nhanh hồ sơ
                </span>
              </label>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true)
                  }}
                  placeholder="Ví dụ: 25DH711114, chickd128@gmail.com, Thuỳ Dương..."
                  className="w-full pl-10 pr-24 py-3 rounded-2xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-2 focus:ring-[#70D7FF]/30 text-white placeholder-[#91A4BB]/50 text-sm outline-none transition-all"
                />
                <Search className="w-4 h-4 text-[#91A4BB] absolute left-3.5 pointer-events-none" />

                <button
                  type="button"
                  onClick={handleQuickLookup}
                  className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-[#398BFF] hover:bg-[#398BFF]/85 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  {isLookingUp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Tìm'}
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-[#09172B] border border-[#70D7FF]/40 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div className="p-2 border-b border-white/10 text-[11px] font-mono text-[#70D7FF] uppercase">
                    Tìm thấy {suggestions.length} thí sinh phù hợp:
                  </div>
                  {suggestions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(c)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#0E2A4D] transition-colors border-b border-white/5 last:border-none cursor-pointer"
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">{c.fullName}</div>
                        <div className="text-[11px] text-[#91A4BB] font-mono">
                          MSSV: {c.studentId} • {c.email}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#70D7FF]/15 text-[#70D7FF] border border-[#70D7FF]/25">
                        {c.castingDivision === 'vocal'
                          ? 'Hát'
                          : c.castingDivision === 'dancer'
                          ? 'Nhảy'
                          : 'Múa'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] text-white text-sm outline-none transition-all"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] text-white text-sm uppercase font-mono outline-none transition-all"
                  />
                </div>

                {/* Số điện thoại / Zalo */}
                <div>
                  <label className="block text-xs font-medium text-[#C9D9EC] mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#70D7FF]" />
                    <span>Số điện thoại / Zalo <span className="text-red-400">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] text-white text-sm font-mono outline-none transition-all"
                  />
                </div>

                {/* Email nhận xác nhận */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-medium text-[#C9D9EC] mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#70D7FF]" />
                    <span>Email thí sinh <span className="text-red-400">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] text-white text-sm outline-none transition-all"
                  />
                </div>

                {/* Bài hát / Tiết mục */}
                <div>
                  <label className="block text-xs font-medium text-[#C9D9EC] mb-1.5 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-[#70D7FF]" />
                    <span>Tên bài hát / Tiết mục casting</span>
                  </label>
                  <input
                    type="text"
                    value={castingSong}
                    onChange={(e) => setCastingSong(e.target.value)}
                    placeholder="Tên bài hát dự thi..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] text-white text-sm outline-none transition-all"
                  />
                </div>

                {/* Link Beat / Nhạc nền */}
                <div>
                  <label className="block text-xs font-medium text-[#C9D9EC] mb-1.5 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-[#70D7FF]" />
                    <span>Link Beat (Youtube / Drive) nếu có</span>
                  </label>
                  <input
                    type="text"
                    value={beatUrl}
                    onChange={(e) => setBeatUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A] border border-white/15 focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] text-white text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Mảng tuyển chọn (Division) */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-[#C9D9EC] mb-2">
                  Mảng bạn đăng ký casting <span className="text-red-400">*</span>:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playHover()
                      setCastingDivision('vocal')
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      castingDivision === 'vocal'
                        ? 'bg-[#398BFF]/25 border-[#70D7FF] shadow-[0_0_15px_rgba(112,215,255,0.3)] text-white'
                        : 'bg-[#050D1A]/70 border-white/10 text-[#91A4BB] hover:border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">Hát (Vocal)</div>
                      <div className="text-[10px] text-[#91A4BB]">Đơn ca, song ca, bè</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playHover()
                      setCastingDivision('dancer')
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      castingDivision === 'dancer'
                        ? 'bg-[#398BFF]/25 border-[#70D7FF] shadow-[0_0_15px_rgba(112,215,255,0.3)] text-white'
                        : 'bg-[#050D1A]/70 border-white/10 text-[#91A4BB] hover:border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">Nhảy (Dance)</div>
                      <div className="text-[10px] text-[#91A4BB]">Choreography, Kpop, HipHop</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playHover()
                      setCastingDivision('traditional_dance')
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      castingDivision === 'traditional_dance'
                        ? 'bg-[#398BFF]/25 border-[#70D7FF] shadow-[0_0_15px_rgba(112,215,255,0.3)] text-white'
                        : 'bg-[#050D1A]/70 border-white/10 text-[#91A4BB] hover:border-white/30'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold">Múa (Traditional)</div>
                      <div className="text-[10px] text-[#91A4BB]">Dân gian, đương đại</div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* STEP 2: KHUNG CHỌN THỜI GIAN & CA CASTING (NHƯ HÌNH) */}
        <section id="casting-schedule-picker" className="mb-10">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] font-mono font-bold text-xs">
                02
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#70D7FF]" />
                  <span>Chọn Ca &amp; Khung Giờ Bạn Muốn Casting</span>
                </h2>
                <p className="text-xs text-[#91A4BB]">
                  Bấm trực tiếp vào khung giờ bạn mong muốn để lựa chọn
                </p>
              </div>
            </div>

            {selectedShift && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#398BFF]/20 border border-[#70D7FF]/40 text-[#70D7FF] text-xs font-mono font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Đã chọn 1 khung giờ</span>
              </span>
            )}
          </div>

          {/* 2 BIG SCHEDULE CARDS (EXACT MATCH VỚI LỊCH NHƯ HÌNH) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* ======================================================== */}
            {/* CARD 1: NGÀY 06/11/2026 - THỨ SÁU */}
            {/* ======================================================== */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[#70D7FF]/30 bg-[#09172B]/90 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div>
                {/* Header Card 1 */}
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

                {/* BUỔI SÁNG (09g00 – 12g00) */}
                <div className="mb-4 p-4 rounded-2xl bg-[#050D1A]/80 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFB45C]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI SÁNG (09g00 – 12g00)</span>
                    </div>
                    <span className="text-[10px] text-[#91A4BB]">Check-in ca sáng</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {day1MorningSlots.map((slot) => {
                      const isSelected = selectedShift?.id === slot.id
                      const count = shiftCounts[slot.id] || 0
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSelectShift(slot)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#398BFF]/30 border-[#70D7FF] shadow-[0_0_18px_rgba(112,215,255,0.4)] text-white scale-[1.02]'
                              : 'bg-[#09172B]/90 border-white/10 hover:border-[#70D7FF]/50 text-[#C9D9EC]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs sm:text-sm">
                              {slot.timeSlot}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#70D7FF]" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#91A4BB] mt-0.5 line-clamp-1">
                            {slot.timeSlotDescription}
                          </div>
                          {count > 0 && (
                            <span className="inline-block mt-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#70D7FF]">
                              Đã có {count} bạn
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* BUỔI CHIỀU & TỐI (13g30 – 20g00) */}
                <div className="p-4 rounded-2xl bg-[#050D1A]/80 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#70D7FF]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI CHIỀU &amp; TỐI (13g30 – 20g00)</span>
                    </div>
                    <span className="text-[10px] text-[#91A4BB]">Check-in ca chiều/tối</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {day1AfternoonSlots.map((slot) => {
                      const isSelected = selectedShift?.id === slot.id
                      const count = shiftCounts[slot.id] || 0
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSelectShift(slot)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#398BFF]/30 border-[#70D7FF] shadow-[0_0_18px_rgba(112,215,255,0.4)] text-white scale-[1.02]'
                              : 'bg-[#09172B]/90 border-white/10 hover:border-[#70D7FF]/50 text-[#C9D9EC]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs sm:text-sm">
                              {slot.timeSlot}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#70D7FF]" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#91A4BB] mt-0.5 line-clamp-1">
                            {slot.timeSlotDescription}
                          </div>
                          {count > 0 && (
                            <span className="inline-block mt-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#70D7FF]">
                              Đã có {count} bạn
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CARD 2: NGÀY 07/11/2026 - THỨ BẢY */}
            {/* ======================================================== */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[#FFB45C]/30 bg-[#09172B]/90 shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div>
                {/* Header Card 2 */}
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

                {/* BUỔI SÁNG (09g00 – 12g00) */}
                <div className="mb-4 p-4 rounded-2xl bg-[#050D1A]/80 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFB45C]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI SÁNG (09g00 – 12g00)</span>
                    </div>
                    <span className="text-[10px] text-[#91A4BB]">Check-in ca sáng</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {day2MorningSlots.map((slot) => {
                      const isSelected = selectedShift?.id === slot.id
                      const count = shiftCounts[slot.id] || 0
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSelectShift(slot)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#FFB45C]/25 border-[#FFB45C] shadow-[0_0_18px_rgba(255,180,92,0.4)] text-white scale-[1.02]'
                              : 'bg-[#09172B]/90 border-white/10 hover:border-[#FFB45C]/50 text-[#C9D9EC]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs sm:text-sm">
                              {slot.timeSlot}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#FFB45C]" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#91A4BB] mt-0.5 line-clamp-1">
                            {slot.timeSlotDescription}
                          </div>
                          {count > 0 && (
                            <span className="inline-block mt-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#FFB45C]">
                              Đã có {count} bạn
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* BUỔI CHIỀU (13g30 – 17g00) */}
                <div className="p-4 rounded-2xl bg-[#050D1A]/80 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#70D7FF]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI CHIỀU (13g30 – 17g00)</span>
                    </div>
                    <span className="text-[10px] text-[#91A4BB]">Check-in ca chiều</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {day2AfternoonSlots.map((slot) => {
                      const isSelected = selectedShift?.id === slot.id
                      const count = shiftCounts[slot.id] || 0
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSelectShift(slot)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#FFB45C]/25 border-[#FFB45C] shadow-[0_0_18px_rgba(255,180,92,0.4)] text-white scale-[1.02]'
                              : 'bg-[#09172B]/90 border-white/10 hover:border-[#FFB45C]/50 text-[#C9D9EC]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs sm:text-sm">
                              {slot.timeSlot}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#FFB45C]" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#91A4BB] mt-0.5 line-clamp-1">
                            {slot.timeSlotDescription}
                          </div>
                          {count > 0 && (
                            <span className="inline-block mt-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#FFB45C]">
                              Đã có {count} bạn
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 3: XÁC NHẬN LỰA CHỌN & NÚT GỬI */}
        <section className="mb-12">
          {/* Error alert */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sticky / Floating Action Panel */}
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border-2 border-[#70D7FF]/40 bg-gradient-to-br from-[#09172B] via-[#0D2442] to-[#09172B] shadow-[0_0_40px_rgba(57,139,255,0.3)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Summary of what user has selected */}
              <div className="space-y-1.5 text-center md:text-left w-full md:w-auto">
                <span className="text-[11px] font-mono uppercase font-bold text-[#70D7FF] tracking-wider block">
                  TỔNG HỢP LỰA CHỌN CỦA BẠN:
                </span>

                {selectedShift ? (
                  <div>
                    <div className="text-base sm:text-xl font-extrabold text-white">
                      {selectedShift.dayOfWeek}, {selectedShift.dateLabel.split(', ')[1]} • {selectedShift.sessionLabel}
                    </div>
                    <div className="text-sm font-mono text-[#FFE082] font-bold">
                      Khung giờ: {selectedShift.timeSlot}
                    </div>
                    <div className="text-xs text-[#91A4BB]">
                      Thí sinh: <strong className="text-white">{fullName || '(Chưa nhập tên)'}</strong> {studentId && `(${studentId})`}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[#91A4BB] italic">
                    ⚠️ Bạn chưa chọn ca casting. Vui lòng bấm vào 1 khung giờ ở bảng trên!
                  </div>
                )}
              </div>

              {/* Confirm & Submit Button */}
              <div className="w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary-glow w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white tracking-wide cursor-pointer shadow-[0_0_30px_rgba(57,139,255,0.7)] active:scale-98 transition-all disabled:opacity-50"
                  style={{ minHeight: '56px' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang Ghi Vào Sheet...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Xác Nhận Lựa Chọn Này</span>
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
          <div className="mb-2">
            <strong>CLB ÂM NHẠC HUFLIT (HMC)</strong> • Ban Chủ nhiệm &amp; Ban Tổ Chức Casting 2026
          </div>
          <div>
            Hotline hỗ trợ: <span className="text-[#FFE082] font-semibold">0812 622 268</span> (Trần Như Lệ - Phó Chủ nhiệm) • Email: clbamnhac.huflit@gmail.com
          </div>
        </footer>
      </main>

      {/* MODAL: DANH SÁCH THÍ SINH ĐÃ CHỌN CA & XUẤT EXCEL */}
      {showAdminListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-4xl max-h-[85vh] rounded-3xl border border-[#70D7FF]/40 bg-[#09172B] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-[#70D7FF]" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Danh Sách Đăng Ký Ca Casting ({allRegistrations.length} bạn)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminListModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Table */}
            <div className="p-5 overflow-y-auto flex-1 text-xs">
              {allRegistrations.length === 0 ? (
                <div className="text-center py-12 text-[#91A4BB]">
                  <p className="text-sm font-semibold mb-2">Chưa có bạn nào đăng ký ca trên thiết bị này.</p>
                  <p className="text-xs">Khi thí sinh xác nhận ca, danh sách sẽ hiển thị đầy đủ tại đây.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[#70D7FF] font-mono text-[11px] uppercase">
                        <th className="py-2.5 px-3">STT</th>
                        <th className="py-2.5 px-3">Họ và Tên</th>
                        <th className="py-2.5 px-3">MSSV</th>
                        <th className="py-2.5 px-3">SĐT</th>
                        <th className="py-2.5 px-3">Mảng</th>
                        <th className="py-2.5 px-3">Ca Đã Chọn</th>
                        <th className="py-2.5 px-3">Thời Gian Đăng Ký</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allRegistrations.map((r, idx) => (
                        <tr key={r.id || idx} className="hover:bg-white/5">
                          <td className="py-2 px-3 font-mono text-[#91A4BB]">{idx + 1}</td>
                          <td className="py-2 px-3 font-bold text-white">{r.fullName}</td>
                          <td className="py-2 px-3 font-mono text-[#70D7FF]">{r.studentId}</td>
                          <td className="py-2 px-3 font-mono">{r.phone || '—'}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#398BFF]/15 text-[#70D7FF]">
                              {r.castingDivision === 'vocal'
                                ? 'Hát'
                                : r.castingDivision === 'dancer'
                                ? 'Nhảy'
                                : 'Múa'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[#FFE082] font-semibold">{r.fullShiftLabel}</td>
                          <td className="py-2 px-3 text-[#91A4BB] font-mono text-[10px]">
                            {new Date(r.registeredAt).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#050D1A]/50">
              <span className="text-xs text-[#91A4BB]">
                Tự động đồng bộ với Google Sheets Webhook
              </span>
              <button
                type="button"
                onClick={() => exportShiftRegistrationsCsv()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#398BFF] hover:bg-[#398BFF]/85 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Xuất File Excel (.csv)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
