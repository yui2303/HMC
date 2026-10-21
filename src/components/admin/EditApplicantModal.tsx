import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Mail,
  CreditCard,
  Music,
  ExternalLink,
  Save,
  Trash2,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  Clock,
  ThumbsDown,
  Eye,
  Video,
  FileText,
} from 'lucide-react'
import { ApplicationItem, CastingStatus, editApplication, deleteApplication } from '../../lib/adminApi'
import { sound } from '../../lib/audioSynth'

interface EditApplicantModalProps {
  isOpen: boolean
  application: ApplicationItem | null
  onClose: () => void
  onSaved: (updated: ApplicationItem) => void
  onDeleted?: (deletedId: string) => void
}

export const EditApplicantModal: React.FC<EditApplicantModalProps> = ({
  isOpen,
  application,
  onClose,
  onSaved,
  onDeleted,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    castingDivision: 'vocal' as 'vocal' | 'dancer' | 'traditional_dance',
    castingSong: '',
    beatUrl: '',
    hasPerformanceExperience: false,
    performanceUrl: '',
    passion: '',
    status: 'new' as CastingStatus,
    adminNote: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (application) {
      setFormData({
        fullName: application.fullName,
        email: application.email,
        studentId: application.studentId,
        castingDivision: application.castingDivision,
        castingSong: application.castingSong,
        beatUrl: application.beatUrl,
        hasPerformanceExperience: Boolean(application.hasPerformanceExperience),
        performanceUrl: application.performanceUrl || '',
        passion: application.passion || '',
        status: application.status,
        adminNote: application.adminNote || '',
      })
      setErrorMessage('')
      setShowDeleteConfirm(false)
    }
  }, [application, isOpen])

  if (!isOpen || !application) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.studentId.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên, Email và MSSV.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const updated = await editApplication(application.id, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        studentId: formData.studentId.trim().toUpperCase(),
        castingDivision: formData.castingDivision,
        castingSong: formData.castingSong.trim(),
        beatUrl: formData.beatUrl.trim(),
        hasPerformanceExperience: formData.hasPerformanceExperience,
        performanceUrl: formData.performanceUrl.trim(),
        passion: formData.passion.trim(),
        status: formData.status,
        adminNote: formData.adminNote.trim(),
      })

      sound.playSuccess()
      onSaved(updated)
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi lưu thông tin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteApplication(application.id)
      sound.playClick()
      if (onDeleted) {
        onDeleted(application.id)
      }
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi xóa hồ sơ.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#09172B] border border-[#78B9F0]/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#061120]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Chỉnh sửa hồ sơ thí sinh</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#70D7FF]/15 text-[#70D7FF] border border-[#70D7FF]/30">
                  {application.id}
                </span>
              </h3>
              <p className="text-xs text-[#91A4BB]">Cập nhật thông tin chi tiết hoặc trạng thái casting</p>
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

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Họ và tên <span className="text-[#FF7070]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Mã số sinh viên (MSSV) <span className="text-[#FF7070]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm font-mono focus:border-[#70D7FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Email nhận thông báo <span className="text-[#FF7070]">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Mảng ứng tuyển
              </label>
              <select
                value={formData.castingDivision}
                onChange={(e) => setFormData({ ...formData, castingDivision: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="vocal">🎤 Hát (Vocal)</option>
                <option value="dancer">💃 Nhảy (Dance)</option>
                <option value="traditional_dance">🪭 Múa (Traditional / Contemporary)</option>
              </select>
            </div>
          </div>

          {/* PERFORMANCE & SONG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Bài hát / Tác phẩm casting <span className="text-[#91A4BB] text-[10px] font-normal normal-case">(Không bắt buộc)</span>
              </label>
              <input
                type="text"
                value={formData.castingSong}
                onChange={(e) => setFormData({ ...formData, castingSong: e.target.value })}
                placeholder="Để trống nếu bổ sung tại buổi casting"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Link Beat / Nhạc nền <span className="text-[#91A4BB] text-[10px] font-normal normal-case">(Không bắt buộc)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.beatUrl}
                  onChange={(e) => setFormData({ ...formData, beatUrl: e.target.value })}
                  placeholder="https://... hoặc nộp tại bàn Check-in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors"
                />
                {formData.beatUrl && (
                  <a
                    href={formData.beatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#0E2A4D] hover:bg-[#163866] border border-[#70D7FF]/30 text-[#70D7FF] flex items-center justify-center shrink-0"
                    title="Mở link beat"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* EXPERIENCE & PERFORMANCE LINK */}
          <div className="p-4 rounded-2xl bg-[#050D1A]/60 border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="editExp"
                checked={formData.hasPerformanceExperience}
                onChange={(e) => setFormData({ ...formData, hasPerformanceExperience: e.target.checked })}
                className="w-4 h-4 rounded text-[#398BFF] focus:ring-0 bg-[#09172B] border-white/20 cursor-pointer"
              />
              <label htmlFor="editExp" className="text-sm font-medium text-white cursor-pointer select-none">
                Đã có kinh nghiệm biểu diễn văn nghệ / tham gia CLB trước đây
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Link video trình diễn / Portfolio (tùy chọn)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.performanceUrl}
                  onChange={(e) => setFormData({ ...formData, performanceUrl: e.target.value })}
                  placeholder="https://youtube.com/... hoặc TikTok, Facebook, Drive"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09172B] border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors"
                />
                {formData.performanceUrl && (
                  <a
                    href={formData.performanceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#0E2A4D] hover:bg-[#163866] border border-[#70D7FF]/30 text-[#70D7FF] flex items-center justify-center shrink-0"
                    title="Mở link video"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* PASSION */}
          <div>
            <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
              Chia sẻ niềm yêu thích &amp; kỳ vọng
            </label>
            <textarea
              rows={3}
              value={formData.passion}
              onChange={(e) => setFormData({ ...formData, passion: e.target.value })}
              placeholder="Chia sẻ của thí sinh..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* STATUS & ADMIN NOTE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Trạng thái tuyển chọn
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CastingStatus })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="new">🔵 Mới đăng ký (New)</option>
                <option value="reviewing">🟡 Đang xem xét (Reviewing)</option>
                <option value="shortlisted">✨ Shortlist tuyển chọn</option>
                <option value="accepted">🟢 Đã nhận / Trúng tuyển (Accepted)</option>
                <option value="rejected">🔴 Không phù hợp (Rejected)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1">
                Ghi chú nội bộ Ban Chủ Nhiệm
              </label>
              <input
                type="text"
                value={formData.adminNote}
                onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
                placeholder="Ví dụ: Giọng tốt, xếp ca chiều ngày 06/11..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050D1A]/80 border border-white/15 text-white text-sm focus:border-[#70D7FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* DELETE CONFIRMATION SECTION */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-300 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>Xác nhận xóa hồ sơ này vĩnh viễn?</span>
              </div>
              <p className="text-xs text-red-200/80 leading-relaxed">
                Hồ sơ của <strong>{application.fullName}</strong> ({application.studentId}) sẽ bị xóa khỏi danh sách ứng tuyển và không thể hoàn tác.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Xác nhận xóa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa hồ sơ</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-glow px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(57,139,255,0.5)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
