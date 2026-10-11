import React, { useRef } from 'react'
import { Sparkles, Trophy, Star, Award } from 'lucide-react'
import { ReferenceOverlay } from '../common/ReferenceOverlay'

interface AboutSceneProps {
  onOpenRegister?: () => void
  showReferenceOverlay?: boolean
}

export const AboutScene: React.FC<AboutSceneProps> = ({ showReferenceOverlay = false }) => {
  const sceneRef = useRef<HTMLElement>(null)

  return (
    <section
      id="about"
      ref={sceneRef}
      className="relative w-full min-h-0 lg:h-screen lg:min-h-[820px] pt-12 sm:pt-16 lg:pt-[18vh] pb-8 lg:pb-0 overflow-visible select-none bg-transparent"
    >
      {/* Reference Overlay (toggled via 'R') */}
      <ReferenceOverlay
        src="/assets/music-club/scene-02-about/reference.png"
        show={showReferenceOverlay}
      />

      {/* LAYER 1: Background - Backstage Environment with Top & Bottom Gradient Masks for Seamless Overlaps */}
      <div
        className="about-bg absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 12%, black 35%, black 82%, rgba(0,0,0,0.4) 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 12%, black 35%, black 82%, rgba(0,0,0,0.4) 92%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-02-about/background.png"
          alt="Backstage Studio Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/85 via-[#050D1A]/45 to-[#050D1A]/80" />
      </div>

      {/* DESKTOP TARGET COMPOSITION (lg screens: 1440x900 target artboard) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-auto">
        {/* TEXT GROUP: left 10%, top 10%, width 35% */}
        <div
          className="about-text-group absolute z-20 flex flex-col items-start text-left"
          style={{
            left: '10%',
            top: '10%',
            width: '35%',
            maxWidth: '500px',
          }}
        >
          {/* Eyebrow: top ~10% */}
          <div className="about-eyebrow flex items-center gap-3 mb-2.5">
            <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
            <span className="text-xs tracking-[0.35em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              MUSIC • COMMUNITY • PASSION
            </span>
          </div>

          {/* Heading */}
          <h2
            className="about-heading font-serif-display text-4xl xl:text-5xl text-white tracking-tight leading-[1.06] mb-3"
            style={{ maxWidth: '460px' }}
          >
            <span>WE ARE </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
              THE SOUND
            </span>
          </h2>

          {/* Description */}
          <p
            className="about-desc font-sans text-xs xl:text-sm text-[#91A4BB] leading-relaxed mb-3.5"
            style={{ maxWidth: '440px' }}
          >
            CLB Âm nhạc là nơi những người trẻ yêu âm nhạc cùng nhau tạo nên những sân khấu đáng nhớ. Từ những buổi tập nhỏ đến các liên hoan và đại nhạc hội toàn thành, HMC luôn khẳng định bản sắc qua từng giải thưởng và đêm diễn bùng nổ.
          </p>

          {/* ACHIEVEMENTS & NOTABLE MILESTONES */}
          <div className="space-y-2.5 w-full max-w-[460px]">
            {/* 1. GIẢI VÀNG CHUNG CUỘC */}
            <div className="p-3 rounded-2xl bg-[#09172B]/85 border border-[#FFB45C]/40 hover:border-[#FFB45C]/70 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-white/10">
                <div className="w-5 h-5 rounded-md bg-[#FFB45C]/20 border border-[#FFB45C]/40 flex items-center justify-center text-[#FFB45C]">
                  <Trophy className="w-3 h-3" />
                </div>
                <span className="text-[12px] xl:text-[12.5px] font-bold text-[#FFB45C] tracking-wide">
                  GIẢI VÀNG CHUNG CUỘC – DANH HIỆU QUÁN QUÂN
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-1 text-[11px] xl:text-[11.5px] text-[#E1ECF7]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C] shrink-0" />
                  <span><strong>Giải Nhất</strong> thể loại Tốp ca</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C] shrink-0" />
                  <span><strong>Giải Nhất</strong> thể loại Múa độc lập</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] shrink-0" />
                  <span><strong>Giải Ba</strong> thể loại Song / Tam / Tứ ca</span>
                </li>
              </ul>
            </div>

            {/* 2. DẤU ẤN LIÊN HOAN & SÂN KHẤU LỚN */}
            <div className="p-3 rounded-2xl bg-[#09172B]/85 border border-[#70D7FF]/30 hover:border-[#70D7FF]/60 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-white/10">
                <div className="w-5 h-5 rounded-md bg-[#3C96FF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                  <Star className="w-3 h-3" />
                </div>
                <span className="text-[12px] xl:text-[12.5px] font-bold text-[#70D7FF] tracking-wide">
                  DẤU ẤN LIÊN HOAN &amp; ĐÊM NHẠC LỚN
                </span>
              </div>
              <ul className="space-y-1 text-[11px] xl:text-[11.5px] text-[#C4D5E8]">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1 shrink-0" />
                  <span><strong>Giải Ba</strong> Liên hoan Các câu lạc bộ, đội, nhóm nhảy toàn thành năm 2026 - <strong>Youth Fest 2026</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#398BFF] mt-1 shrink-0" />
                  <span>Đêm nhạc <strong>BLOOMING BRAVERY</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C] mt-1 shrink-0" />
                  <span>CTV biểu diễn tại <strong>Concert Anh Trai Vượt Ngàn Chông Gai 2025 Day 3 Day 4 HCM</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PHOTO COLLAGE (3D Depth Group) */}
        <div
          className="photo-cluster scene2-collage absolute z-[5] pointer-events-auto"
          style={{
            left: '45%',
            top: '14%',
            width: '50%',
            height: '72%',
          }}
        >
          {/* PHOTO 01: Top photo - Live Theatrical Stage Performance (z-index: 5) */}
          <div
            className="photo photo-1 about-photo-1 about-photo-slot-1 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '19%',
              top: '0%',
              width: '67%',
              transform: 'rotate(-1deg)',
              zIndex: 5,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(57,139,255,0.2)] border border-[#70D7FF]/30 aspect-[3/2] relative group">
              <img
                src="/assets/music-club/scene-02-about/club_stage_performance.jpg"
                alt="Đêm nhạc BLOOMING BRAVERY & Concert Anh Trai Vượt Ngàn Chông Gai 2025 Day 3 Day 4 HCM"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-3.5">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB45C]" />
                    Đêm nhạc BLOOMING BRAVERY
                  </span>
                  <span className="text-[10px] text-[#C4D5E8] block mt-0.5">
                    CTV biểu diễn tại Concert Anh Trai Vượt Ngàn Chông Gai 2025 Day 3 Day 4 HCM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO 02: Far Left photo - Giải Vàng CLB Âm Nhạc (z-index: 7) */}
          <div
            className="photo photo-2 about-photo-2 about-photo-slot-2 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '1%',
              top: '42%',
              width: '52%',
              transform: 'rotate(-2deg)',
              zIndex: 7,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(112,215,255,0.25)] border border-[#FFB45C]/40 aspect-[3/2] relative group">
              <img
                src="/assets/music-club/scene-02-about/club_award_gold.jpg"
                alt="Lễ trao giải - Giải Vàng Câu lạc bộ Âm nhạc"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-2.5">
                <div>
                  <span className="text-[11px] font-bold text-[#FFB45C] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-[#FFB45C]" />
                    GIẢI VÀNG CHUNG CUỘC
                  </span>
                  <span className="text-[9.5px] text-[#C4D5E8] block mt-0.5">
                    Quán quân • Nhất Tốp ca • Nhất Múa • Ba Song/Tam/Tứ ca
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO 03: Bottom photo - Youth Fest 2026 Live Performance (z-index: 8) */}
          <div
            className="photo photo-3 about-photo-3 about-photo-slot-3 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '48%',
              top: '50%',
              width: '50%',
              transform: 'rotate(2deg)',
              zIndex: 8,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(57,139,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2] relative group">
              <img
                src="/assets/music-club/scene-02-about/club_youth_fest.jpg"
                alt="Tiết mục biểu diễn tại Youth Fest 2026"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-2.5">
                <div>
                  <span className="text-[11px] font-bold text-[#70D7FF] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#70D7FF]" />
                    YOUTH FEST 2026
                  </span>
                  <span className="text-[9.5px] text-[#C4D5E8] block mt-0.5 truncate">
                    Giải Ba Liên hoan Nhóm nhảy toàn thành
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET RESPONSIVE FALLBACK (< lg) */}
      <div className="lg:hidden relative z-20 max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-[1px] bg-[#70D7FF]" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            MUSIC • COMMUNITY • PASSION
          </span>
          <span className="w-5 h-[1px] bg-[#70D7FF]" />
        </div>

        <h2 className="font-serif-display text-3xl sm:text-4xl text-white mb-2.5 tracking-tight">
          WE ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">THE SOUND</span>
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#91A4BB] leading-relaxed mb-4 max-w-md px-2">
          CLB Âm nhạc là nơi những người trẻ yêu âm nhạc cùng nhau tạo nên những sân khấu đáng nhớ. Từ những buổi tập nhỏ đến các liên hoan và đại nhạc hội toàn thành, HMC luôn khẳng định bản sắc qua từng giải thưởng và đêm diễn bùng nổ.
        </p>

        {/* Mobile Achievement Cards */}
        <div className="w-full space-y-2.5 mb-4 text-left">
          {/* Card 1: Giải Vàng */}
          <div className="p-3 rounded-xl bg-[#09172B]/90 border border-[#FFB45C]/40">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-[#FFB45C]">
              <Trophy className="w-3.5 h-3.5" />
              <span>GIẢI VÀNG CHUNG CUỘC – DANH HIỆU QUÁN QUÂN</span>
            </div>
            <ul className="text-[11px] text-[#E1ECF7] space-y-0.5 pl-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C]" />
                <span><strong>Giải Nhất</strong> thể loại Tốp ca</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C]" />
                <span><strong>Giải Nhất</strong> thể loại Múa độc lập</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF]" />
                <span><strong>Giải Ba</strong> thể loại Song / Tam / Tứ ca</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Sân khấu & Liên hoan */}
          <div className="p-3 rounded-xl bg-[#09172B]/90 border border-[#70D7FF]/30">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-[#70D7FF]">
              <Star className="w-3.5 h-3.5" />
              <span>DẤU ẤN LIÊN HOAN &amp; ĐÊM NHẠC LỚN</span>
            </div>
            <ul className="text-[11px] text-[#C4D5E8] space-y-1 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1 shrink-0" />
                <span><strong>Giải Ba</strong> Liên hoan Các câu lạc bộ, đội, nhóm nhảy toàn thành năm 2026 - <strong>Youth Fest 2026</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#398BFF] mt-1 shrink-0" />
                <span>Đêm nhạc <strong>BLOOMING BRAVERY</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C] mt-1 shrink-0" />
                <span>CTV biểu diễn tại <strong>Concert Anh Trai Vượt Ngàn Chông Gai 2025 Day 3 Day 4 HCM</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Responsive 3-Photo Showcase for Mobile */}
        <div className="w-full space-y-3">
          {/* Main Photo 1 */}
          <div className="rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.85)] border border-[#70D7FF]/30 aspect-[16/10] bg-[#0A1A2F] relative group">
            <img
              src="/assets/music-club/scene-02-about/club_stage_performance.jpg"
              alt="Đêm nhạc BLOOMING BRAVERY & Concert Anh Trai Vượt Ngàn Chông Gai 2025 Day 3 Day 4 HCM"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-3">
              <span className="text-[11px] font-medium text-white flex items-center gap-1.5 text-left">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB45C] shrink-0" />
                Đêm nhạc BLOOMING BRAVERY &amp; Concert ATVNCG 2025
              </span>
            </div>
          </div>

          {/* Side-by-side Photo 2 & 3 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.85)] border border-[#FFB45C]/40 aspect-[4/3] bg-[#0A1A2F] relative">
              <img
                src="/assets/music-club/scene-02-about/club_award_gold.jpg"
                alt="Giải Vàng CLB Âm nhạc"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/30 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-[#FFB45C] truncate flex items-center gap-1">
                  <Trophy className="w-3 h-3 shrink-0" />
                  Giải Vàng Quán Quân
                </span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.85)] border border-[#70D7FF]/30 aspect-[4/3] bg-[#0A1A2F] relative">
              <img
                src="/assets/music-club/scene-02-about/club_youth_fest.jpg"
                alt="Youth Fest 2026"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/30 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-[#70D7FF] truncate flex items-center gap-1">
                  <Award className="w-3 h-3 shrink-0" />
                  Youth Fest 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
