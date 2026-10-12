import React, { useState, useEffect } from 'react'
import {
  Search,
  Download,
  RotateCcw,
  Mic,
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  ThumbsDown,
  Sparkles,
  ExternalLink,
  Eye,
  LogOut,
  Users,
  User,
  AlertCircle,
  Loader2,
  Printer,
  FileText,
  ArrowDownAZ,
  Filter,
  X,
  Mail,
  Menu,
  Music,
  Video,
  Copy,
  Check,
  LayoutDashboard,
  Play,
  Edit2,
  Trash2,
  Plus,
  CheckSquare,
  Square,
} from 'lucide-react'
import {
  ApplicationItem,
  ApplicationCounts,
  CastingStatus,
  fetchApplications,
  logoutAdmin,
  AdminUser,
  exportClientCsv,
  deleteApplication,
  deleteBatchApplications,
} from '../../lib/adminApi'
import { exportScoreSheetPdf } from '../../lib/pdfScoreSheet'
import { getSentEmailIds } from '../../lib/emailService'
import { ApplicantDetailDrawer } from './ApplicantDetailDrawer'
import { EmailConfirmationModal } from './EmailConfirmationModal'
import { EditApplicantModal } from './EditApplicantModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import { sound } from '../../lib/audioSynth'

interface AdminApplicationsPageProps {
  currentUser: AdminUser
  onLogout: () => void
  onNavigateHome: () => void
}

type AdminTab = 'all' | 'search_music' | 'vocal' | 'dancer' | 'traditional_dance'

export const AdminApplicationsPage: React.FC<AdminApplicationsPageProps> = ({
  currentUser,
  onLogout,
  onNavigateHome,
}) => {
  // Navigation & Active View State
  const [activeTab, setActiveTab] = useState<AdminTab>('all')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Data State
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [counts, setCounts] = useState<ApplicationCounts>({
    total: 0,
    vocal: 0,
    dancer: 0,
    traditional_dance: 0,
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    rejected: 0,
    accepted: 0,
  })
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [divisionFilter, setDivisionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [sortOption, setSortOption] = useState('newest')

  // Music Link Filter for search_music tab
  const [musicFilter, setMusicFilter] = useState<'all' | 'has_beat' | 'no_beat' | 'has_video'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Multi-Selection State for Batch Operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<ApplicationItem | null>(null)

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingCandidate, setDeletingCandidate] = useState<ApplicationItem | null>(null)
  const [isBatchDelete, setIsBatchDelete] = useState(false)
  const [isDeletingProgress, setIsDeletingProgress] = useState(false)

  // PDF Score Sheet Export Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [pdfDivisionScope, setPdfDivisionScope] = useState<'all' | 'vocal' | 'dancer' | 'traditional_dance'>('all')
  const [pdfJudgeName, setPdfJudgeName] = useState('')
  const [pdfRoomName, setPdfRoomName] = useState('Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, HUFLIT')
  const [pdfAuditionDate, setPdfAuditionDate] = useState('06/11 & 07/11/2026')
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  // Email Confirmation Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [allCandidatesForEmail, setAllCandidatesForEmail] = useState<ApplicationItem[]>([])
  const [isLoadingEmailCandidates, setIsLoadingEmailCandidates] = useState(false)
  const [sentEmailIdsSet, setSentEmailIdsSet] = useState<Set<string>>(() => getSentEmailIds())

  // Selected Detail Drawer
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Switch tabs & sync filters
  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab)
    setIsMobileSidebarOpen(false)
    setCurrentPage(1)
    setSelectedIds(new Set())

    if (tab === 'vocal') {
      setDivisionFilter('vocal')
    } else if (tab === 'dancer') {
      setDivisionFilter('dancer')
    } else if (tab === 'traditional_dance') {
      setDivisionFilter('traditional_dance')
    } else {
      setDivisionFilter('all')
    }
  }

  // Fetch applications
  const loadData = async (isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true)
    }
    setErrorMessage('')
    try {
      const data = await fetchApplications({
        q: debouncedQuery,
        division: divisionFilter,
        status: statusFilter,
        experience: experienceFilter,
        sort: sortOption,
        page: currentPage,
        limit: 25,
      })

      setApplications(data.applications)
      setTotalCount(data.total)
      setTotalPages(data.totalPages)
      setCounts(data.counts)
      setSentEmailIdsSet(getSentEmailIds())
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        onLogout()
        return
      }
      if (!isBackground) {
        setErrorMessage(err.message || 'Không thể tải danh sách đăng ký.')
      }
    } finally {
      if (!isBackground) {
        setIsLoading(false)
      }
    }
  }

  const handleOpenEmailModal = async () => {
    setIsLoadingEmailCandidates(true)
    try {
      const res = await fetchApplications({ page: 1, limit: 1000 })
      setAllCandidatesForEmail(res.applications)
    } catch {
      setAllCandidatesForEmail(applications)
    } finally {
      setIsLoadingEmailCandidates(false)
      setIsEmailModalOpen(true)
    }
  }

  useEffect(() => {
    loadData(false)
  }, [debouncedQuery, divisionFilter, statusFilter, experienceFilter, sortOption, currentPage])

  // Real-time synchronization: Silent auto-refresh when candidate registers in another tab, modal, or store
  useEffect(() => {
    const handleSync = () => {
      loadData(true)
    }

    window.addEventListener('hmc_application_created', handleSync)
    window.addEventListener('hmc_applications_updated', handleSync)
    window.addEventListener('storage', handleSync)

    // Smooth silent background polling every 5s to pull incoming candidate applications seamlessly without UI jitter
    const interval = setInterval(() => {
      loadData(true)
    }, 5000)

    return () => {
      window.removeEventListener('hmc_application_created', handleSync)
      window.removeEventListener('hmc_applications_updated', handleSync)
      window.removeEventListener('storage', handleSync)
      clearInterval(interval)
    }
  }, [debouncedQuery, divisionFilter, statusFilter, experienceFilter, sortOption, currentPage])

  const handleResetFilters = () => {
    setSearchQuery('')
    setDebouncedQuery('')
    if (activeTab === 'vocal') {
      setDivisionFilter('vocal')
    } else if (activeTab === 'dancer') {
      setDivisionFilter('dancer')
    } else if (activeTab === 'traditional_dance') {
      setDivisionFilter('traditional_dance')
    } else {
      setDivisionFilter('all')
    }
    setStatusFilter('all')
    setExperienceFilter('all')
    setMusicFilter('all')
    setSortOption('newest')
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  const handleQuickSortByDivision = () => {
    setSortOption('division_name_asc')
    setCurrentPage(1)
  }

  const handleOpenPdfModal = (defaultDivision: 'all' | 'vocal' | 'dancer' | 'traditional_dance' = 'all') => {
    setPdfDivisionScope(defaultDivision)
    setIsPdfModalOpen(true)
  }

  const handleExecutePdfExport = async () => {
    setIsExportingPdf(true)
    try {
      const res = await fetchApplications({
        q: debouncedQuery,
        division: pdfDivisionScope !== 'all' ? pdfDivisionScope : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        experience: experienceFilter !== 'all' ? experienceFilter : undefined,
        sort: 'division_name_asc',
        page: 1,
        limit: 1000,
      })

      const listToExport = res.applications
      if (!listToExport || listToExport.length === 0) {
        alert('Không có thí sinh nào phù hợp với điều kiện để xuất phiếu chấm điểm.')
        return
      }

      exportScoreSheetPdf(listToExport, {
        division: pdfDivisionScope,
        judgeName: pdfJudgeName.trim(),
        roomName: pdfRoomName.trim() || 'Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, HUFLIT',
        auditionDate: pdfAuditionDate.trim() || '06/11 & 07/11/2026',
      })
      setIsPdfModalOpen(false)
    } catch (err: any) {
      alert('Lỗi xuất PDF: ' + (err.message || 'Không thể tạo file PDF.'))
    } finally {
      setIsExportingPdf(false)
    }
  }

  // Multi-Selection Toggle Handlers
  const handleToggleSelectCandidate = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleToggleSelectAllOnPage = () => {
    if (selectedIds.size === displayedApplications.length && displayedApplications.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(displayedApplications.map((a) => a.id)))
    }
  }

  // Edit Modal Triggers
  const handleOpenEdit = (app: ApplicationItem) => {
    setEditingCandidate(app)
    setIsEditModalOpen(true)
  }

  const handleCandidateSaved = (updated: ApplicationItem) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    loadData()
  }

  // Delete Single Candidate
  const handleOpenDeleteSingle = (app: ApplicationItem) => {
    setDeletingCandidate(app)
    setIsBatchDelete(false)
    setIsDeleteModalOpen(true)
  }

  // Delete Batch Candidates
  const handleOpenDeleteBatch = () => {
    if (selectedIds.size === 0) return
    setIsBatchDelete(true)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeletingProgress(true)
    try {
      if (isBatchDelete) {
        const idsToDelete = Array.from(selectedIds)
        await deleteBatchApplications(idsToDelete)
        setSelectedIds(new Set())
      } else if (deletingCandidate) {
        await deleteApplication(deletingCandidate.id)
      }
      sound.playSuccess()
      setIsDeleteModalOpen(false)
      loadData()
      if (selectedAppId && (isBatchDelete ? selectedIds.has(selectedAppId) : deletingCandidate?.id === selectedAppId)) {
        setSelectedAppId(null)
      }
    } catch (err: any) {
      alert('Lỗi khi xóa thí sinh: ' + (err.message || 'Không xóa được.'))
    } finally {
      setIsDeletingProgress(false)
    }
  }

  const handleApplicationUpdated = (updated: ApplicationItem) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    loadData()
  }

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(key)
    sound.playSuccess()
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAdmin()
      onLogout()
    } catch {
      onLogout()
    }
  }

  // Filter applications for search_music tab quick pills
  let displayedApplications = [...applications]
  if (activeTab === 'search_music') {
    if (musicFilter === 'has_beat') {
      displayedApplications = displayedApplications.filter((a) => a.beatUrl && a.beatUrl.trim() !== '')
    } else if (musicFilter === 'no_beat') {
      displayedApplications = displayedApplications.filter((a) => !a.beatUrl || a.beatUrl.trim() === '')
    } else if (musicFilter === 'has_video') {
      displayedApplications = displayedApplications.filter((a) => a.performanceUrl && a.performanceUrl.trim() !== '')
    }
  }

  const startRecord = (currentPage - 1) * 25 + 1
  const endRecord = Math.min(currentPage * 25, totalCount)
  const candidatesWithBeatCount = applications.filter((a) => a.beatUrl && a.beatUrl.trim() !== '').length
  const candidatesWithVideoCount = applications.filter((a) => a.performanceUrl && a.performanceUrl.trim() !== '').length

  const selectedCandidatesList = applications.filter((a) => selectedIds.has(a.id))

  const renderStatusBadge = (status: CastingStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#398BFF]/15 text-[#70D7FF] border border-[#398BFF]/30">
            <Clock className="w-3 h-3" />
            <span>Mới</span>
          </span>
        )
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FFB45C]/15 text-[#FFB45C] border border-[#FFB45C]/35">
            <Eye className="w-3 h-3" />
            <span>Đang xem</span>
          </span>
        )
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/35">
            <Sparkles className="w-3 h-3" />
            <span>Shortlist</span>
          </span>
        )
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/35">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã chọn</span>
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FF6B6B]/15 text-[#FF8E8E] border border-[#FF6B6B]/35">
            <ThumbsDown className="w-3 h-3" />
            <span>Không hợp</span>
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#050D1A] text-[#F4F7FB] flex flex-col lg:flex-row font-sans selection:bg-[#70D7FF]/30 selection:text-[#70D7FF]">
      {/* MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* LEFT ADMIN SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[270px] bg-[#09172B] border-r border-[#78B9F0]/20 flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & System Brand */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#398BFF] to-[#70D7FF] flex items-center justify-center text-[#050D1A] font-extrabold text-base shadow-[0_0_15px_rgba(112,215,255,0.4)]">
                HMC
              </div>
              <div>
                <div className="font-serif-display font-bold text-white text-sm leading-tight tracking-wide">
                  HUFLIT MUSIC CLUB
                </div>
                <div className="text-[10px] text-[#70D7FF] font-mono font-semibold uppercase tracking-wider">
                  Recruitment Admin 2026
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#91A4BB] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <div className="px-3 pb-1.5 text-[10px] font-mono uppercase text-[#91A4BB]/70 font-semibold tracking-wider">
              QUẢN LÝ ỨNG VIÊN
            </div>

            <button
              type="button"
              onClick={() => handleSelectTab('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#398BFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(57,139,255,0.4)]'
                  : 'text-[#C9D9EC] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Tổng danh sách thí sinh</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/25">
                {counts.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('search_music')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'search_music'
                  ? 'bg-gradient-to-r from-[#398BFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(57,139,255,0.4)]'
                  : 'text-[#C9D9EC] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-[#70D7FF]" />
                <span>Tra cứu Beat &amp; MSSV</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#70D7FF]/20 text-[#70D7FF]">
                {candidatesWithBeatCount}
              </span>
            </button>

            <div className="pt-3 px-3 pb-1.5 text-[10px] font-mono uppercase text-[#91A4BB]/70 font-semibold tracking-wider">
              PHÂN LOẠI MẢNG CASTING
            </div>

            <button
              type="button"
              onClick={() => handleSelectTab('vocal')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'vocal'
                  ? 'bg-gradient-to-r from-[#398BFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(57,139,255,0.4)]'
                  : 'text-[#C9D9EC] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-[#70D7FF]" />
                <span>Mảng Hát (Vocal)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/25">
                {counts.vocal}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('dancer')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dancer'
                  ? 'bg-gradient-to-r from-[#398BFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(57,139,255,0.4)]'
                  : 'text-[#C9D9EC] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#D8B4FE]" />
                <span>Mảng Nhảy (Dance)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/25">
                {counts.dancer}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('traditional_dance')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'traditional_dance'
                  ? 'bg-gradient-to-r from-[#398BFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(57,139,255,0.4)]'
                  : 'text-[#C9D9EC] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FB7185]" />
                <span>Mảng Múa (Traditional)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/25">
                {counts.traditional_dance || 0}
              </span>
            </button>
          </nav>
        </div>

        {/* Footer Admin User Card */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Ban Chủ Nhiệm HMC</div>
              <div className="text-[11px] text-[#91A4BB] font-mono truncate">{currentUser.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#91A4BB] hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <span>Trang chủ</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF8E8E] border border-[#FF6B6B]/25 text-xs font-medium transition-colors cursor-pointer disabled:opacity-60"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#09172B]/95 backdrop-blur-md border-b border-[#78B9F0]/15 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#70D7FF] border border-white/10"
              title="Mở menu quản trị"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Current View Indicator */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[#91A4BB] hidden sm:inline">Admin /</span>
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                {activeTab === 'all' && (
                  <>
                    <LayoutDashboard className="w-4 h-4 text-[#398BFF]" />
                    <span>Tổng danh sách thí sinh</span>
                  </>
                )}
                {activeTab === 'search_music' && (
                  <>
                    <Music className="w-4 h-4 text-[#70D7FF]" />
                    <span>Tra cứu Họ tên, MSSV &amp; Link nhạc</span>
                  </>
                )}
                {activeTab === 'vocal' && (
                  <>
                    <Mic className="w-4 h-4 text-[#70D7FF]" />
                    <span>Mảng Hát (Vocal)</span>
                  </>
                )}
                {activeTab === 'dancer' && (
                  <>
                    <Activity className="w-4 h-4 text-[#D8B4FE]" />
                    <span>Mảng Nhảy (Dance)</span>
                  </>
                )}
                {activeTab === 'traditional_dance' && (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FB7185]" />
                    <span>Mảng Múa (Traditional)</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đồng bộ thời gian thực</span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenPdfModal(divisionFilter as any)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#398BFF] to-[#70D7FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(57,139,255,0.35)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất PDF Chấm Điểm</span>
              <span className="sm:hidden">In PDF</span>
            </button>

            <button
              type="button"
              onClick={() => loadData(false)}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Tải lại dữ liệu"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
          {/* TAB 1: ALL / OVERVIEW / DIVISION SPECIFIC VIEW */}
          {activeTab !== 'search_music' && (
            <>
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif-display text-2xl sm:text-3xl text-white tracking-tight">
                    {activeTab === 'all'
                      ? 'TỔNG DANH SÁCH THÍ SINH'
                      : activeTab === 'vocal'
                      ? 'DANH SÁCH THÍ SINH — MẢNG HÁT (VOCAL)'
                      : activeTab === 'dancer'
                      ? 'DANH SÁCH THÍ SINH — MẢNG NHẢY (DANCE)'
                      : 'DANH SÁCH THÍ SINH — MẢNG MÚA (TRADITIONAL)'}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#91A4BB] mt-0.5">
                    Quản lý hồ sơ, sửa xóa thông tin, gửi email xác nhận và chấm điểm Ban Giám Khảo CLB Âm nhạc HUFLIT 2026.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenEmailModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6366F1]/20 hover:bg-[#6366F1]/30 text-[#A5B4FC] border border-[#6366F1]/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#818CF8]" />
                    <span>Gửi Mail Xác Nhận</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportClientCsv({
                        q: debouncedQuery,
                        division: divisionFilter,
                        status: statusFilter,
                        experience: experienceFilter,
                        sort: sortOption,
                      })
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#B8CDE5] border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất CSV</span>
                  </button>
                </div>
              </div>

              {/* Summary Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
                    <span>Tổng đơn</span>
                    <Users className="w-4 h-4 text-[#398BFF]" />
                  </div>
                  <div className="font-serif-display text-2xl sm:text-3xl text-white">
                    {counts.total}
                  </div>
                </div>

                <div
                  onClick={() => handleSelectTab('vocal')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    activeTab === 'vocal'
                      ? 'bg-[#398BFF]/20 border-[#70D7FF] shadow-[0_0_15px_rgba(57,139,255,0.3)]'
                      : 'bg-[#09172B] border-[#78B9F0]/15 hover:border-[#70D7FF]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
                    <span>Hát (Vocal)</span>
                    <Mic className="w-4 h-4 text-[#70D7FF]" />
                  </div>
                  <div className="font-serif-display text-2xl sm:text-3xl text-[#70D7FF]">
                    {counts.vocal}
                  </div>
                </div>

                <div
                  onClick={() => handleSelectTab('dancer')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    activeTab === 'dancer'
                      ? 'bg-[#A855F7]/20 border-[#C084FC] shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-[#09172B] border-[#78B9F0]/15 hover:border-[#C084FC]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
                    <span>Nhảy (Dance)</span>
                    <Activity className="w-4 h-4 text-[#D8B4FE]" />
                  </div>
                  <div className="font-serif-display text-2xl sm:text-3xl text-[#D8B4FE]">
                    {counts.dancer}
                  </div>
                </div>

                <div
                  onClick={() => handleSelectTab('traditional_dance')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    activeTab === 'traditional_dance'
                      ? 'bg-[#F43F5E]/20 border-[#FB7185] shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-[#09172B] border-[#78B9F0]/15 hover:border-[#FB7185]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
                    <span>Múa</span>
                    <Sparkles className="w-4 h-4 text-[#FB7185]" />
                  </div>
                  <div className="font-serif-display text-2xl sm:text-3xl text-[#FB7185]">
                    {counts.traditional_dance || 0}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1 col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
                    <span>Hồ sơ mới</span>
                    <Clock className="w-4 h-4 text-[#FFB45C]" />
                  </div>
                  <div className="font-serif-display text-2xl sm:text-3xl text-[#FFB45C]">
                    {counts.new}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SPECIALIZED SEARCH & MUSIC LINK FILTER VIEW */}
          {activeTab === 'search_music' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif-display text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
                    <Music className="w-7 h-7 text-[#70D7FF]" />
                    <span>TRA CỨU HỌ TÊN, MSSV &amp; LINK NHẠC CASTING</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-[#91A4BB] mt-0.5">
                    Tìm kiếm nhanh thông tin thí sinh, kiểm tra bài hát casting, link beat/nhạc nền và video biểu diễn.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-2 rounded-xl bg-[#09172B] border border-[#78B9F0]/20 text-xs font-mono">
                    Đã có beat: <strong className="text-[#34D399]">{candidatesWithBeatCount}</strong> / {totalCount}
                  </div>
                </div>
              </div>

              {/* Music Link Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15">
                <span className="text-xs text-[#91A4BB] font-mono mr-1">LỌC NHANH:</span>

                <button
                  type="button"
                  onClick={() => setMusicFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    musicFilter === 'all'
                      ? 'bg-[#398BFF] text-white shadow-[0_0_12px_rgba(57,139,255,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-[#B8CDE5]'
                  }`}
                >
                  Tất cả ({applications.length})
                </button>

                <button
                  type="button"
                  onClick={() => setMusicFilter('has_beat')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    musicFilter === 'has_beat'
                      ? 'bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'bg-[#10B981]/15 text-[#34D399] hover:bg-[#10B981]/25 border border-[#10B981]/30'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Đã có Link Beat ({candidatesWithBeatCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMusicFilter('no_beat')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    musicFilter === 'no_beat'
                      ? 'bg-[#FF6B6B] text-white shadow-[0_0_12px_rgba(255,107,107,0.4)]'
                      : 'bg-[#FF6B6B]/15 text-[#FF8E8E] hover:bg-[#FF6B6B]/25 border border-[#FF6B6B]/30'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Chưa nộp Link Beat ({applications.length - candidatesWithBeatCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMusicFilter('has_video')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    musicFilter === 'has_video'
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                      : 'bg-[#8B5CF6]/15 text-[#C4B5FD] hover:bg-[#8B5CF6]/25 border border-[#8B5CF6]/30'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Có Video Biểu Diễn ({candidatesWithVideoCount})</span>
                </button>
              </div>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Input */}
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Tìm theo Họ tên, MSSV, Tên bài hát, Link nhạc/beat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[44px] pl-10 pr-4 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 focus:border-[#70D7FF]"
                />
                <Search className="w-4 h-4 text-[#91A4BB] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Casting Division Filter */}
              {activeTab === 'all' || activeTab === 'search_music' ? (
                <div className="md:col-span-2">
                  <select
                    value={divisionFilter}
                    onChange={(e) => {
                      setDivisionFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full h-[44px] px-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#F4F7FB] outline-none transition-all focus:border-[#70D7FF] cursor-pointer"
                  >
                    <option value="all">Mảng: Tất cả</option>
                    <option value="vocal">Hát (Vocal)</option>
                    <option value="dancer">Nhảy (Dance)</option>
                    <option value="traditional_dance">Múa</option>
                  </select>
                </div>
              ) : (
                <div className="md:col-span-2 flex items-center px-3 rounded-xl bg-[#050D1A]/50 border border-[#78B9F0]/20 text-xs font-semibold text-[#70D7FF]">
                  {activeTab === 'vocal' ? '🎤 Mảng Hát' : activeTab === 'dancer' ? '💃 Mảng Nhảy' : '✨ Mảng Múa'}
                </div>
              )}

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full h-[44px] px-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#F4F7FB] outline-none transition-all focus:border-[#70D7FF] cursor-pointer"
                >
                  <option value="all">Trạng thái: Tất cả</option>
                  <option value="new">Mới</option>
                  <option value="reviewing">Đang xem</option>
                  <option value="shortlisted">Shortlist</option>
                  <option value="accepted">Đã chọn</option>
                  <option value="rejected">Không phù hợp</option>
                </select>
              </div>

              {/* Sort Order Selector */}
              <div className="md:col-span-3">
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full h-[44px] px-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#70D7FF] font-medium outline-none transition-all focus:border-[#70D7FF] cursor-pointer"
                >
                  <option value="newest">Mới nhất (Mặc định)</option>
                  <option value="division_name_asc">Tên (A → Z theo mảng)</option>
                  <option value="name_asc">Tên (A → Z toàn bộ)</option>
                  <option value="name_desc">Tên (Z → A)</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="mssv_asc">MSSV tăng dần</option>
                </select>
              </div>
            </div>

            {/* Quick Sort Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#91A4BB] text-[11px] font-mono flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-[#70D7FF]" />
                  SẮP XẾP:
                </span>

                <button
                  type="button"
                  onClick={handleQuickSortByDivision}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    sortOption === 'division_name_asc'
                      ? 'bg-[#398BFF]/25 text-[#70D7FF] border border-[#70D7FF]/50 shadow-[0_0_12px_rgba(57,139,255,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 text-[#B8CDE5] border border-white/10'
                  }`}
                >
                  <ArrowDownAZ className="w-3.5 h-3.5 text-[#70D7FF]" />
                  <span>Sắp xếp A → Z theo Tên</span>
                </button>
              </div>

              {(searchQuery || divisionFilter !== 'all' || statusFilter !== 'all' || experienceFilter !== 'all' || musicFilter !== 'all' || sortOption !== 'newest') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[11px] text-[#FF8E8E] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* BATCH ACTION FLOATING BAR */}
          {selectedIds.size > 0 && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#09172B] via-[#0E2A4D] to-[#09172B] border border-[#70D7FF]/40 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#70D7FF]" />
                  <span>Đã chọn <strong className="text-[#70D7FF] font-mono text-sm">{selectedIds.size}</strong> thí sinh</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenDeleteBatch}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Xóa {selectedIds.size} thí sinh đã chọn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          )}

          {/* Applications Table / Cards View */}
          <div className="rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {isLoading ? (
              <div className="p-12 text-center space-y-3">
                <div className="flex items-center justify-center gap-2.5 text-[#70D7FF]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm font-medium">Đang tải danh sách thí sinh...</span>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="text-center py-16 px-4 space-y-3">
                <AlertCircle className="w-10 h-10 text-[#FF6B6B] mx-auto" />
                <p className="text-sm text-[#FF8E8E]">{errorMessage}</p>
                <button
                  type="button"
                  onClick={loadData}
                  className="btn-primary-glow px-5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            ) : displayedApplications.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#91A4BB] mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">Không tìm thấy thí sinh phù hợp.</h3>
                <p className="text-xs text-[#91A4BB] max-w-sm mx-auto">
                  Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bấm Đặt lại bộ lọc.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <span>Xóa bộ lọc</span>
                </button>
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#050D1A]/50 text-[11px] font-mono uppercase tracking-wider text-[#91A4BB]">
                        <th className="py-3.5 px-3 w-10 text-center">
                          <button
                            type="button"
                            onClick={handleToggleSelectAllOnPage}
                            className="text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
                            title="Chọn tất cả trên trang này"
                          >
                            {selectedIds.size === displayedApplications.length && displayedApplications.length > 0 ? (
                              <CheckSquare className="w-4 h-4 text-[#70D7FF]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="py-3.5 px-3 w-12 text-center">STT</th>
                        <th className="py-3.5 px-4">Họ và tên</th>
                        <th className="py-3.5 px-4">MSSV</th>
                        <th className="py-3.5 px-4">Mảng</th>
                        <th className="py-3.5 px-4">Bài casting</th>
                        <th className="py-3.5 px-4">Link Beat / Nhạc</th>
                        <th className="py-3.5 px-4">Video Demo</th>
                        <th className="py-3.5 px-4">Trạng thái</th>
                        <th className="py-3.5 px-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {displayedApplications.map((app, index) => {
                        const stt = (currentPage - 1) * 25 + index + 1
                        const isSelected = selectedIds.has(app.id)

                        return (
                          <tr
                            key={app.id}
                            onClick={() => setSelectedAppId(app.id)}
                            className={`h-[64px] transition-colors cursor-pointer group ${
                              isSelected ? 'bg-[#398BFF]/10' : 'hover:bg-[#0E2A4D]/50'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleToggleSelectCandidate(app.id)}
                                className="text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-[#70D7FF]" />
                                ) : (
                                  <Square className="w-4 h-4 text-white/30 hover:text-white" />
                                )}
                              </button>
                            </td>

                            <td className="py-3 px-3 text-center font-mono text-[#91A4BB]/70">
                              {stt < 10 ? `0${stt}` : stt}
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white group-hover:text-[#70D7FF] transition-colors">
                                  {app.fullName}
                                </span>
                                {sentEmailIdsSet.has(app.id) && (
                                  <span
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#10B981]/15 text-[#34D399] text-[10px] font-mono border border-[#10B981]/30"
                                    title="Đã gửi email xác nhận kèm file thể lệ"
                                  >
                                    <Mail className="w-2.5 h-2.5" />
                                    <span>Đã gửi mail</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#91A4BB]/70 truncate max-w-[160px]">
                                {app.email}
                              </div>
                            </td>

                            <td className="py-3 px-4 font-mono text-[#B8CDE5] font-semibold">
                              {app.studentId}
                            </td>

                            <td className="py-3 px-4">
                              {app.castingDivision === 'vocal' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#398BFF]/20 text-[#70D7FF] border border-[#70D7FF]/35">
                                  <Mic className="w-3 h-3" />
                                  <span>Hát</span>
                                </span>
                              ) : app.castingDivision === 'dancer' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#A855F7]/20 text-[#D8B4FE] border border-[#C084FC]/35">
                                  <Activity className="w-3 h-3" />
                                  <span>Nhảy</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F43F5E]/20 text-[#FDA4AF] border border-[#FB7185]/35">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Múa</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 max-w-[160px] truncate text-white/95 font-medium">
                              {app.castingSong || <span className="text-[#91A4BB]/50 italic">(Chưa điền)</span>}
                            </td>

                            {/* LINK BEAT / NHẠC */}
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              {app.beatUrl && app.beatUrl.trim() !== '' ? (
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={app.beatUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#398BFF]/15 hover:bg-[#398BFF]/30 text-[#70D7FF] text-[11px] font-semibold border border-[#70D7FF]/35 transition-all shadow-sm"
                                    title="Mở link Beat trong tab mới"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Mở Beat</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => handleCopy(app.id + '_beat', app.beatUrl)}
                                    className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
                                    title="Copy link Beat"
                                  >
                                    {copiedId === app.id + '_beat' ? (
                                      <Check className="w-3.5 h-3.5 text-[#34D399]" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-[#FF8E8E]/70 italic flex items-center gap-1">
                                  <span>Chưa nộp</span>
                                </span>
                              )}
                            </td>

                            {/* VIDEO BIỂU DIỄN */}
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              {app.performanceUrl && app.performanceUrl.trim() !== '' ? (
                                <a
                                  href={app.performanceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 text-[#C4B5FD] text-[11px] font-semibold border border-[#8B5CF6]/35 transition-all"
                                  title="Xem Video biểu diễn"
                                >
                                  <Video className="w-3 h-3" />
                                  <span>Xem Video</span>
                                </a>
                              ) : (
                                <span className="text-[#91A4BB]/40 font-mono">—</span>
                              )}
                            </td>

                            <td className="py-3 px-4">{renderStatusBadge(app.status)}</td>

                            {/* ROW ACTIONS: SỬA & XÓA & XEM */}
                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(app)}
                                  className="p-1.5 rounded-lg bg-[#398BFF]/15 hover:bg-[#398BFF]/30 text-[#70D7FF] border border-[#70D7FF]/30 transition-all cursor-pointer"
                                  title="Sửa thông tin thí sinh"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenDeleteSingle(app)}
                                  className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 transition-all cursor-pointer"
                                  title="Xóa hồ sơ thí sinh này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedAppId(app.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-semibold text-[#B8CDE5] hover:text-white border border-white/10 transition-all cursor-pointer"
                                  title="Xem chi tiết hồ sơ"
                                >
                                  Xem
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARDS VIEW */}
                <div className="md:hidden divide-y divide-white/5 p-3 space-y-3">
                  {displayedApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/15 space-y-3 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectCandidate(app.id)}
                            className="mt-0.5 text-[#91A4BB] hover:text-white"
                          >
                            {selectedIds.has(app.id) ? (
                              <CheckSquare className="w-4 h-4 text-[#70D7FF]" />
                            ) : (
                              <Square className="w-4 h-4 text-white/30" />
                            )}
                          </button>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{app.fullName}</span>
                              {sentEmailIdsSet.has(app.id) && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#10B981]/15 text-[#34D399] text-[10px] font-mono border border-[#10B981]/30">
                                  <Mail className="w-2.5 h-2.5" />
                                  <span>Đã gửi</span>
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-mono text-[#70D7FF]">MSSV: {app.studentId}</div>
                          </div>
                        </div>
                        {renderStatusBadge(app.status)}
                      </div>

                      <div className="text-xs text-white/90">
                        <span className="text-[#91A4BB]">Bài: </span>
                        <strong>{app.castingSong || 'Chưa điền'}</strong>
                      </div>

                      {/* Beat / Music links on mobile */}
                      {app.beatUrl && (
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                          <span className="text-[#70D7FF] text-[11px] font-semibold flex items-center gap-1">
                            <Music className="w-3 h-3" /> Link Beat
                          </span>
                          <a
                            href={app.beatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#70D7FF] hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span>Mở link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* Mobile Actions: Sửa, Xóa, Xem */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(app)}
                          className="py-1.5 rounded-xl bg-[#398BFF]/20 text-[#70D7FF] text-xs font-semibold flex items-center justify-center gap-1 border border-[#70D7FF]/30"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDeleteSingle(app)}
                          className="py-1.5 rounded-xl bg-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-1 border border-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedAppId(app.id)}
                          className="py-1.5 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center justify-center"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION BAR */}
                <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#91A4BB]">
                  <div>
                    Hiển thị <span className="text-white font-semibold">{totalCount > 0 ? startRecord : 0}</span>–
                    <span className="text-white font-semibold">{endRecord}</span> trong tổng số{' '}
                    <span className="text-[#70D7FF] font-semibold">{totalCount}</span> hồ sơ
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3 py-1 font-mono text-white">
                      Trang {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Edit Candidate Modal */}
      <EditApplicantModal
        isOpen={isEditModalOpen}
        application={editingCandidate}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingCandidate(null)
        }}
        onSaved={handleCandidateSaved}
        onDeleted={(deletedId) => {
          setApplications((prev) => prev.filter((a) => a.id !== deletedId))
          loadData()
          if (selectedAppId === deletedId) setSelectedAppId(null)
        }}
      />

      {/* Delete Confirmation Modal (Single & Batch) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        candidate={deletingCandidate}
        candidateList={selectedCandidatesList}
        isBatch={isBatchDelete}
        isDeleting={isDeletingProgress}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeletingCandidate(null)
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* PDF Score Sheet Export Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#09172B] border border-[#78B9F0]/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#050D1A]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-lg sm:text-xl text-white">
                    Xuất Phiếu Chấm Điểm Casting
                  </h3>
                  <p className="text-xs text-[#91A4BB]">
                    Bảng 2 cột, sắp xếp A → Z theo Tên &amp; 3 dòng nhận xét cho Giám Khảo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
              {/* Division Scope */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                  1. Chọn mảng casting cần in
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('all')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'all'
                        ? 'bg-[#398BFF]/20 border-[#70D7FF] text-[#70D7FF] shadow-[0_0_12px_rgba(57,139,255,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Tất cả ({counts.total})
                  </button>

                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('vocal')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'vocal'
                        ? 'bg-[#398BFF]/20 border-[#70D7FF] text-[#70D7FF] shadow-[0_0_12px_rgba(57,139,255,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Hát ({counts.vocal})
                  </button>

                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('dancer')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'dancer'
                        ? 'bg-[#A855F7]/20 border-[#C084FC] text-[#D8B4FE] shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Nhảy ({counts.dancer})
                  </button>

                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('traditional_dance')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'traditional_dance'
                        ? 'bg-[#F43F5E]/20 border-[#FB7185] text-[#FDA4AF] shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Múa ({counts.traditional_dance || 0})
                  </button>
                </div>
              </div>

              {/* Judge Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                  2. Tên Giám Khảo (Tùy chọn - In sẵn vào phiếu)
                </label>
                <input
                  type="text"
                  placeholder="VD: Thầy / Cô / Anh / Chị Giám Khảo..."
                  value={pdfJudgeName}
                  onChange={(e) => setPdfJudgeName(e.target.value)}
                  className="w-full h-[42px] px-3.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-white outline-none focus:border-[#70D7FF] transition-all placeholder:text-[#91A4BB]/40"
                />
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                    3. Địa điểm Casting
                  </label>
                  <input
                    type="text"
                    value={pdfRoomName}
                    onChange={(e) => setPdfRoomName(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-white outline-none focus:border-[#70D7FF] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                    4. Thời gian Casting
                  </label>
                  <input
                    type="text"
                    value={pdfAuditionDate}
                    onChange={(e) => setPdfAuditionDate(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-white outline-none focus:border-[#70D7FF] transition-all"
                  />
                </div>
              </div>

              {/* Info Highlight Box */}
              <div className="p-4 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/20 text-xs space-y-2 text-[#91A4BB]">
                <div className="flex items-center gap-2 text-[#70D7FF] font-semibold">
                  <FileText className="w-4 h-4" />
                  <span>Quy cách mẫu phiếu chấm điểm HMC 2026:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed text-[#B8CDE5]">
                  <li>Bảng dạng 2 cột: Cột trái (Thông tin + MSSV), Cột phải (Nhận xét 3 dòng).</li>
                  <li>Sắp xếp <strong>A → Z theo TÊN thí sinh chuẩn tiếng Việt</strong>.</li>
                  <li>Tối ưu diện tích in A4, chứa được 6–7 thí sinh/trang.</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#050D1A]/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={isExportingPdf}
                onClick={handleExecutePdfExport}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#398BFF] to-[#70D7FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(57,139,255,0.4)] disabled:opacity-60"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo file PDF...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Xem &amp; In Phiếu PDF (A4)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      <EmailConfirmationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        applications={allCandidatesForEmail.length > 0 ? allCandidatesForEmail : applications}
        onSuccess={() => {
          setSentEmailIdsSet(getSentEmailIds())
          loadData()
        }}
      />

      {/* Detail Slide Drawer */}
      {selectedAppId && (
        <ApplicantDetailDrawer
          applicationId={selectedAppId}
          applications={applications}
          onClose={() => setSelectedAppId(null)}
          onApplicationUpdated={handleApplicationUpdated}
          onEditRequest={(app) => {
            setSelectedAppId(null)
            handleOpenEdit(app)
          }}
          onDeleteRequest={(app) => {
            handleOpenDeleteSingle(app)
          }}
        />
      )}
    </div>
  )
}
