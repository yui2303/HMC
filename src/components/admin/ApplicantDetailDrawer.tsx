import React, { useState, useEffect } from 'react'
import {
  X,
  Mic,
  Activity,
  Calendar,
  Mail,
  CreditCard,
  Music,
  ExternalLink,
  CheckCircle2,
  Clock,
  ThumbsDown,
  Sparkles,
  Save,
  Loader2,
  FileText,
  UserCheck,
} from 'lucide-react'
import { ApplicationItem, CastingStatus, updateApplication } from '../../lib/adminApi'
import { Edit2, Trash2 } from 'lucide-react'

interface ApplicantDetailDrawerProps {
  applicationId: string | null
  applications: ApplicationItem[]
  onClose: () => void
  onApplicationUpdated: (updated: ApplicationItem) => void
  onEditRequest?: (app: ApplicationItem) => void
  onDeleteRequest?: (app: ApplicationItem) => void
}

export const ApplicantDetailDrawer: React.FC<ApplicantDetailDrawerProps> = ({
  applicationId,
  applications,
  onClose,
  onApplicationUpdated,
  onEditRequest,
  onDeleteRequest,
}) => {
  const application = applications.find((a) => a.id === applicationId) || null

  const [currentStatus, setCurrentStatus] = useState<CastingStatus>('new')
  const [adminNote, setAdminNote] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (application) {
      setCurrentStatus(application.status)
      setAdminNote(application.adminNote || '')
    }
  }, [application])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!application) return null

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleStatusChange = async (newStatus: CastingStatus) => {
    if (newStatus === currentStatus || isUpdatingStatus) return
    setIsUpdatingStatus(true)

    try {
      const updated = await updateApplication(application.id, { status: newStatus })
      setCurrentStatus(updated.status)
      onApplicationUpdated(updated)
      showToast('Đã cập nhật trạng thái.')
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSaveNote = async () => {
    setIsSavingNote(true)
    try {
      const updated = await updateApplication(application.id, { adminNote })
      onApplicationUpdated(updated)
      showToast('Đã lưu ghi chú admin.')
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu ghi chú.')
    } finally {
      setIsSavingNote(false)
    }
  }

  const statusConfig: Record<
    CastingStatus,
    { label: string; bg: string; text: string; border: string; icon: React.FC<{ className?: string }> }
  > = {
    new: {
      label: 'Mới',
      bg: 'bg-[#398BFF]/15',
      text: 'text-[#70D7FF]',
      border: 'border-[#398BFF]/30',
      icon: Clock,
    },
    reviewing: {
      label: 'Đang xem',
      bg: 'bg-[#FFB45C]/15',
      text: 'text-[#FFB45C]',
      border: 'border-[#FFB45C]/35',
      icon: EyeIcon,
    },
    shortlisted: {
      label: 'Shortlist',
      bg: 'bg-[#00E5FF]/15',
      text: 'text-[#00E5FF]',
      border: 'border-[#00E5FF]/35',
      icon: Sparkles,
    },
    rejected: {
      label: 'Không phù hợp',
      bg: 'bg-[#FF6B6B]/15',
      text: 'text-[#FF8E8E]',
      border: 'border-[#FF6B6B]/35',
      icon: ThumbsDown,
    },
    accepted: {
      label: 'Đã chọn',
      bg: 'bg-[#10B981]/15',
      text: 'text-[#34D399]',
      border: 'border-[#10B981]/35',
      icon: CheckCircle2,
    },
  }

  function EyeIcon({ className }: { className?: string }) {
    return <Clock className={className} />
  }

  const currentBadge = statusConfig[currentStatus] || statusConfig.new

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#050D1A]/70 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        data-lenis-prevent="true"
        className="relative w-full sm:w-[560px] max-w-full h-full bg-[#09172B] border-l border-[#78B9F0]/20 shadow-[-20px_0_60px_rgba(0,0,0,0.85)] z-10 flex flex-col overflow-hidden text-[#F4F7FB] animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#050D1A]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#70D7FF] font-bold px-2.5 py-1 rounded-lg bg-[#398BFF]/15 border border-[#70D7FF]/30">
              {application.id}
            </span>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentBadge.bg} ${currentBadge.text} ${currentBadge.border}`}
            >
              <currentBadge.icon className="w-3.5 h-3.5" />
              <span>{currentBadge.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEditRequest && (
              <button
                type="button"
                onClick={() => onEditRequest(application)}
                className="px-3 py-1.5 rounded-xl bg-[#398BFF]/20 hover:bg-[#398BFF]/35 text-[#70D7FF] border border-[#70D7FF]/35 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Chỉnh sửa thông tin thí sinh"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Sửa</span>
              </button>
            )}

            {onDeleteRequest && (
              <button
                type="button"
                onClick={() => onDeleteRequest(application)}
                className="p-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 transition-all cursor-pointer"
                title="Xóa hồ sơ thí sinh này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng chi tiết"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Drawer Content */}
        <div
          data-lenis-prevent="true"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6 custom-scrollbar"
        >
          {/* Main Info Card */}
          <div className="p-5 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/15 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif-display text-2xl text-white tracking-tight">
                  {application.fullName}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-[#70D7FF] mt-0.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>MSSV: {application.studentId}</span>
                </div>
              </div>

              {/* Division Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  application.castingDivision === 'vocal'
                    ? 'bg-[#398BFF]/20 text-[#70D7FF] border-[#70D7FF]/40'
                    : application.castingDivision === 'dancer'
                    ? 'bg-[#A855F7]/20 text-[#D8B4FE] border-[#C084FC]/40'
                    : application.castingDivision === 'traditional_dance'
                    ? 'bg-[#F43F5E]/20 text-[#FDA4AF] border-[#FB7185]/40'
                    : 'bg-[#398BFF]/20 text-[#70D7FF] border-[#70D7FF]/40'
                }`}
              >
                {application.castingDivision === 'vocal' ? (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>HÁT (VOCAL)</span>
                  </>
                ) : application.castingDivision === 'dancer' ? (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>NHẢY (DANCE)</span>
                  </>
                ) : application.castingDivision === 'traditional_dance' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MÚA</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>HÁT (VOCAL)</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs text-[#91A4BB]">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-[#70D7FF] shrink-0" />
                <a
                  href={`mailto:${application.email}`}
                  className="hover:text-white transition-colors truncate underline underline-offset-2"
                >
                  {application.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#70D7FF] shrink-0" />
                <span>{new Date(application.createdAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* Quick Status Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider font-mono">
              Cập nhật trạng thái hồ sơ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['new', 'reviewing', 'shortlisted', 'accepted', 'rejected'] as CastingStatus[]).map((st) => {
                const cfg = statusConfig[st]
                const isActive = currentStatus === st
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(st)}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      isActive
                        ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-1 ring-current shadow-sm`
                        : 'bg-[#050D1A]/50 text-[#91A4BB] border-white/10 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <cfg.icon className="w-3.5 h-3.5" />
                    <span>{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Casting Song / Track & Beat Link */}
          <div className="p-5 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/15 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-[#70D7FF] font-mono">
              <Music className="w-4 h-4" />
              <span>Phần biểu diễn đăng ký</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#91A4BB]">
                {application.castingDivision === 'vocal'
                  ? 'Bài hát casting đã chọn:'
                  : application.castingDivision === 'dancer'
                  ? 'Bài nhảy / Track casting:'
                  : 'Tác phẩm múa / Nhạc nền:'}
              </span>
              <p className="text-sm font-semibold text-white">
                {application.castingSong || (
                  <span className="text-[#91A4BB]/60 italic font-normal">
                    (Chưa điền - Bổ sung tại buổi casting)
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-xs text-[#91A4BB]">Link Beat / Instrumental:</span>
              {application.beatUrl && (application.beatUrl.startsWith('http://') || application.beatUrl.startsWith('https://')) ? (
                <div className="flex items-center gap-3">
                  <a
                    href={application.beatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#398BFF]/20 hover:bg-[#398BFF]/30 text-[#70D7FF] border border-[#70D7FF]/30 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <span>Mở link Beat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-xs text-[#91A4BB]/60 truncate max-w-[220px]">
                    {application.beatUrl}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-[#FFE082] font-medium bg-[#FFE082]/10 border border-[#FFE082]/20 rounded-lg px-3 py-1.5 inline-block">
                  {application.beatUrl || 'Chưa nộp beat (Nộp tại bàn Check-in Casting)'}
                </p>
              )}
            </div>
          </div>

          {/* Performance Experience Section */}
          <div className="p-5 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/15 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-[#70D7FF] font-mono">
              <UserCheck className="w-4 h-4" />
              <span>Kinh nghiệm biểu diễn sân khấu</span>
            </div>

            {application.hasPerformanceExperience ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-semibold text-[#34D399]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã từng biểu diễn bên ngoài</span>
                </div>

                {application.performanceUrl && (
                  <div className="pt-1">
                    <a
                      href={application.performanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#70D7FF]/15 hover:bg-[#70D7FF]/25 text-[#70D7FF] border border-[#70D7FF]/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span>Xem phần trình diễn</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#91A4BB]">
                <span>Chưa từng biểu diễn bên ngoài (HMC sẵn sàng đồng hành và đào tạo từ đầu).</span>
              </div>
            )}
          </div>

          {/* Passion Sharing Section */}
          <div className="p-5 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/15 space-y-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-[#70D7FF] font-mono">
              <FileText className="w-4 h-4" />
              <span>Chia sẻ niềm yêu thích âm nhạc</span>
            </div>
            <p className="text-sm text-[#F4F7FB]/90 leading-relaxed whitespace-pre-wrap">
              {application.passion}
            </p>
          </div>

          {/* Admin Private Note */}
          <div className="p-5 rounded-2xl bg-[#0E2A4D]/50 border border-[#70D7FF]/20 space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="admin-note-input"
                className="text-xs font-semibold uppercase tracking-wider text-[#70D7FF] font-mono flex items-center gap-2"
              >
                <span>Ghi chú nội bộ của Admin</span>
                <span className="text-[10px] text-[#91A4BB] lowercase font-normal">(chỉ admin thấy)</span>
              </label>

              <button
                type="button"
                disabled={isSavingNote}
                onClick={handleSaveNote}
                className="btn-primary-glow px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isSavingNote ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Lưu ghi chú</span>
              </button>
            </div>

            <textarea
              id="admin-note-input"
              rows={3}
              placeholder="Nhập ghi chú đánh giá giọng hát, vũ đạo, lịch phỏng vấn, ấn tượng cá nhân..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/40 resize-none focus:border-[#70D7FF]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
