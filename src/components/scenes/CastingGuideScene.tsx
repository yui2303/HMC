import React, { useRef } from 'react'
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Radio,
} from 'lucide-react'
import { sound } from '../../lib/audioSynth'
import { ReferenceOverlay } from '../common/ReferenceOverlay'
import { SpaceTourAnimation } from '../effects/SpaceTourAnimation'

interface CastingGuideSceneProps {
  onOpenRegister?: () => void
  showReferenceOverlay?: boolean
}

export const CastingGuideScene: React.FC<CastingGuideSceneProps> = ({
  onOpenRegister,
  showReferenceOverlay = false,
}) => {
  const sceneRef = useRef<HTMLElement>(null)

  const handleRegisterClick = () => {
    sound.playHover()
    if (onOpenRegister) {
      onOpenRegister()
    }
  }

  return (
    <section
      id="casting-guide"
      ref={sceneRef}
      className="scene scene-4 relative w-full min-h-screen overflow-hidden select-none bg-[#050D1A]"
      style={{
        isolation: 'isolate',
        paddingTop: 'clamp(90px, 12vh, 140px)',
        paddingBottom: 'clamp(60px, 8vh, 100px)',
      }}
    >
      {/* Reference Overlay (toggled via 'R') */}
      <ReferenceOverlay
        src="/assets/music-club/scene-04-contact/reference.png"
        show={showReferenceOverlay}
      />

      {/* LAYER 0: Top Entry Atmospheric Fade */}
      <div
        className="absolute top-0 left-0 right-0 h-40 lg:h-56 z-[10] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #050D1A 0%, rgba(5, 13, 26, 0.9) 40%, transparent 100%)',
        }}
      />

      {/* LAYER 1: Background - Late Night Music Studio & Audition Stage (z-index 1) */}
      <div className="casting-guide-bg absolute inset-0 z-[1] pointer-events-none">
        <img
          src="/assets/music-club/scene-04-contact/scene4_background.jpg"
          alt="Studio Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#050D1A]/65" />
      </div>

      {/* LAYER 2: Window Frame Props (z-index 2) */}
      <div className="casting-guide-props absolute top-0 right-0 w-[55%] h-[65%] z-[2] pointer-events-none opacity-60">
        <img
          src="/assets/music-club/scene-04-contact/scene4_window_frame.png"
          alt="Studio Window Frame"
          className="w-full h-full object-contain object-top-right"
          loading="lazy"
        />
      </div>

      {/* LAYER 3: Ambient Glow Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#398BFF]/20 blur-3xl pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/3 right-1/4 w-[420px] h-[420px] rounded-full bg-[#70D7FF]/15 blur-[100px] pointer-events-none mix-blend-screen" />

      {/* LAYER 4: Atmospheric Smoke & Soundwave */}
      <div className="contact-smoke absolute inset-0 z-[4] pointer-events-none opacity-50 mix-blend-screen">
        <img
          src="/assets/music-club/scene-04-contact/scene4_smoke.png"
          alt="Atmospheric Smoke"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="contact-soundwave absolute bottom-4 sm:bottom-6 left-0 right-0 h-36 sm:h-44 z-[5] pointer-events-none mix-blend-screen opacity-65">
        <img
          src="/assets/music-club/scene-04-contact/scene4_soundwave.png"
          alt="Continuous Soundwave Stream"
          className="w-full h-full object-cover sm:object-contain filter drop-shadow-[0_0_25px_rgba(112,215,255,0.7)]"
          loading="lazy"
        />
      </div>

      {/* Atmospheric Floor Vignette: Deep blue gradient fading upward */}
      <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 pointer-events-none z-[6] bg-gradient-to-t from-[#020813] via-[#020813]/85 to-transparent" />

      {/* LAYER 5: MAIN CONTENT */}
      <div className="relative z-[11] max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between min-h-[calc(100vh-180px)]">
        <div>
          {/* Header Row: Title on Left, Space Tour Astronaut in Empty Area on Right */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 mb-6 sm:mb-10 relative">
            <div className="casting-heading-group text-center sm:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0E2A4D]/80 border border-[#70D7FF]/30 text-[#70D7FF] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3.5 glow-text-cyan shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HƯỚNG DẪN ĐĂNG KÝ CASTING</span>
              </div>

              <h2 className="font-sans font-extrabold text-2xl sm:text-5xl lg:text-[54px] text-white tracking-tight leading-[1.15] mb-2 sm:mb-3">
                <span>LỊCH TRÌNH CASTING </span>
                <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
                  &amp; ĐỊA ĐIỂM
                </span>
              </h2>

              <p className="font-sans text-xs sm:text-base text-[#91A4BB] max-w-2xl leading-relaxed px-1">
                Hãy theo dõi kỹ khung giờ casting và chuẩn bị trang phục, beat nhạc để tỏa sáng tốt nhất trước Ban giám khảo nhé!
              </p>
            </div>

            {/* Astronaut Space Tour in the Empty Right Area Between the 2 Scenes */}
            <div className="hidden lg:block relative -mt-16 xl:-mt-24 mr-2 xl:mr-6 pointer-events-auto">
              <SpaceTourAnimation width={310} height={350} />
            </div>

            {/* Mobile / Tablet Space Tour View */}
            <div className="lg:hidden my-2 flex justify-center">
              <SpaceTourAnimation width={220} height={250} />
            </div>
          </div>

          {/* Grid Layout: Left 2 Casting Schedule Cards | Right Venue & Register CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
            {/* LEFT AREA: 2 Big Casting Schedule Cards (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#70D7FF] uppercase flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>THỜI GIAN CASTING CHI TIẾT</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#398BFF]/15 border border-[#70D7FF]/30 text-[#70D7FF] text-[10px] sm:text-[11px] font-mono">
                  <Radio className="w-3 h-3 text-[#70D7FF] animate-pulse" />
                  <span>2 ngày</span>
                </span>
              </div>

              {/* CARD 1: NGÀY 06/11/2026 */}
              <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#70D7FF]/25 hover:border-[#70D7FF]/60 transition-all group bg-[#09172B]/85 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                <div className="flex flex-row items-center justify-between gap-2 mb-3 sm:mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] font-mono font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(112,215,255,0.3)]">
                      01
                    </div>
                    <div>
                      <h3 className="font-serif-display text-base sm:text-xl font-bold text-white tracking-wide">
                        NGÀY 06/11/2026
                      </h3>
                      <span className="text-[11px] sm:text-xs text-[#91A4BB]">Ngày Casting đợt 1</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#398BFF]/15 text-[#70D7FF] border border-[#70D7FF]/30">
                    Thứ Sáu
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Buổi sáng */}
                  <div className="p-3.5 rounded-xl bg-[#050D1A]/70 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFB45C]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI SÁNG</span>
                    </div>
                    <div className="font-serif-display text-base sm:text-lg font-bold text-white">
                      09g00 – 12g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB]">
                      Check-in ca sáng và casting
                    </div>
                  </div>

                  {/* Buổi chiều */}
                  <div className="p-3.5 rounded-xl bg-[#050D1A]/70 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#70D7FF]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI CHIỀU & TỐI</span>
                    </div>
                    <div className="font-serif-display text-base sm:text-lg font-bold text-white">
                      13g30 – 20g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB]">
                      Check-in ca chiều và tiếp tục casting
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: NGÀY 07/11/2026 */}
              <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#70D7FF]/25 hover:border-[#70D7FF]/60 transition-all group bg-[#09172B]/85 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                <div className="flex flex-row items-center justify-between gap-2 mb-3 sm:mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFB45C]/20 border border-[#FFB45C]/40 flex items-center justify-center text-[#FFB45C] font-mono font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(255,180,92,0.3)]">
                      02
                    </div>
                    <div>
                      <h3 className="font-serif-display text-base sm:text-xl font-bold text-white tracking-wide">
                        NGÀY 07/11/2026
                      </h3>
                      <span className="text-[11px] sm:text-xs text-[#91A4BB]">Ngày Casting đợt 2</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#FFB45C]/15 text-[#FFB45C] border border-[#FFB45C]/30">
                    Thứ Bảy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Buổi sáng */}
                  <div className="p-3.5 rounded-xl bg-[#050D1A]/70 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFB45C]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI SÁNG</span>
                    </div>
                    <div className="font-serif-display text-base sm:text-lg font-bold text-white">
                      09g00 – 12g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB]">
                      Check-in ca sáng và casting
                    </div>
                  </div>

                  {/* Buổi chiều */}
                  <div className="p-3.5 rounded-xl bg-[#050D1A]/70 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#70D7FF]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>BUỔI CHIỀU</span>
                    </div>
                    <div className="font-serif-display text-base sm:text-lg font-bold text-white">
                      13g30 – 17g00
                    </div>
                    <div className="text-[11px] text-[#91A4BB]">
                      Check-in ca chiều và tiếp tục casting
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT AREA: Venue, Target Audience & Register CTA Box (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-5">
              {/* Location & Organization Card */}
              <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#70D7FF]/25 bg-[#09172B]/85 space-y-3.5 sm:space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shadow-[0_0_15px_rgba(112,215,255,0.3)] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold text-[#70D7FF] block mb-0.5">
                      ĐỊA ĐIỂM TỔ CHỨC
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                      Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT).
                    </p>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shrink-0 mt-0.5">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold text-[#70D7FF] block mb-0.5">
                      ĐỐI TƯỢNG THAM GIA
                    </span>
                    <p className="text-xs sm:text-sm text-[#F4F7FB]/90 leading-snug">
                      Sinh viên đang theo học tại Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT).
                    </p>
                  </div>
                </div>

                {/* Format */}
                <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold text-[#70D7FF] block mb-0.5">
                      HÌNH THỨC
                    </span>
                    <p className="text-xs sm:text-sm text-[#F4F7FB]/90 leading-snug">
                      Casting và phỏng vấn trực tiếp tại địa điểm tổ chức.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION CTA BOX */}
              <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#70D7FF]/40 bg-gradient-to-br from-[#09172B] via-[#0D2442] to-[#09172B] space-y-3 sm:space-y-4 shadow-[0_0_30px_rgba(57,139,255,0.25)]">
                <div className="flex items-center gap-2 text-xs text-[#34D399] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cổng đăng ký trực tuyến đang mở</span>
                </div>

                <button
                  type="button"
                  onClick={handleRegisterClick}
                  onMouseEnter={() => sound.playHover()}
                  className="btn-primary-glow w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold text-white tracking-wide cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.7)] active:scale-98 transition-all"
                  style={{ minHeight: '54px' }}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Đăng ký Casting ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-[11px] text-center text-[#91A4BB] italic">
                  * Thời gian đăng ký: Từ 19g00 ngày 11/10/2026 đến 21g00 ngày 04/11/2026.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-10 sm:mt-16 pt-5 border-t border-white/10 flex items-center justify-center text-xs text-[#91A4BB]/80 text-center relative z-[15]">
          <div>
            &copy; {new Date().getFullYear()} HUFLIT MUSIC CLUB. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  )
}
