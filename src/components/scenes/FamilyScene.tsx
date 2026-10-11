import React, { useRef } from 'react'
import { Sparkles, Mic, Zap, Flame, Clock, ArrowDown } from 'lucide-react'
import { sound } from '../../lib/audioSynth'

interface FamilySceneProps {
  onOpenRegister?: () => void
}

export const FamilyScene: React.FC<FamilySceneProps> = () => {
  const sceneRef = useRef<HTMLElement>(null)

  const scrollToCastingGuide = () => {
    sound.playClick()
    const target = document.querySelector('#casting-guide')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="family"
      ref={sceneRef}
      className="relative w-full min-h-0 lg:min-h-[105vh] lg:h-auto py-12 sm:py-16 lg:py-24 overflow-visible select-none bg-transparent"
    >
      {/* LAYER 1: Deep Blue Concert Stage / Backstage Continuity Background */}
      <div
        className="family-bg absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 6%, black 18%, black 85%, rgba(0,0,0,0.3) 95%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 6%, black 18%, black 85%, rgba(0,0,0,0.3) 95%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-02-about/background.png"
          alt="Backstage Studio Atmosphere"
          className="w-full h-full object-cover object-bottom"
          style={{ filter: 'brightness(0.65) contrast(1.15) saturate(1.15)' }}
          loading="lazy"
        />
        {/* Deep Blue Gradients for Visual Consistency */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050D1A]/75 via-[#050D1A]/40 to-[#050D1A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/85 via-transparent to-[#050D1A]/85" />
      </div>

      {/* LAYER 2: Text Readability Gradient Overlay */}
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-[62%] z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(3, 10, 24, 0.92) 0%, rgba(3, 10, 24, 0.72) 52%, rgba(3, 10, 24, 0) 90%)',
        }}
      />

      {/* LAYER 3: Ambient Stage Lights & Smoke Glow */}
      <div className="family-ambient absolute inset-0 z-[2] pointer-events-none opacity-30 mix-blend-screen">
        <div className="absolute top-[18%] left-[8%] w-[480px] h-[480px] rounded-full bg-[#1A3E6D]/35 blur-[110px]" />
        <div className="absolute top-[48%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#0E2A4D]/40 blur-[100px]" />
      </div>

      {/* LAYER 4: Background Soundwave */}
      <div
        className="family-wave absolute pointer-events-none mix-blend-screen z-[3]"
        style={{
          left: '2%',
          top: '18%',
          width: '78%',
          height: '70%',
          opacity: 0.22,
        }}
      >
        <img
          src="/assets/music-club/scene-02-about/soundwave_main.png"
          alt="Soundwave Energy Line"
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(112,215,255,0.3)]"
          loading="lazy"
        />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP 2-COLUMN EDITORIAL COMPOSITION (lg screens)                       */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative z-[10] w-full max-w-[1540px] mx-auto px-[5vw] xl:px-[7vw]">
        <div className="grid grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: Editorial Typography Directly On Scene Background        */}
          {/* ===================================================================== */}
          <div className="casting-guide-left col-span-7 xl:col-span-7 flex flex-col text-left pr-4 pt-1">
            {/* 1. EYEBROW */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
              <span className="text-xs tracking-[0.32em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
                <Sparkles className="w-3.5 h-3.5" />
                HMC RECRUITMENT 2026
              </span>
            </div>

            {/* 2. HEADING */}
            <h2
              className="font-sans font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-4"
              style={{ fontSize: 'clamp(36px, 3.4vw, 52px)' }}
            >
              <span className="block text-white">THỜI GIAN TUYỂN CTV</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
                CLB ÂM NHẠC HUFLIT
              </span>
            </h2>

            {/* 3. REGISTRATION TIME HIGHLIGHT BANNER */}
            <div className="p-4 rounded-2xl bg-[#09172B]/90 border border-[#70D7FF]/35 shadow-[0_0_25px_rgba(57,139,255,0.2)] mb-7 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#70D7FF] uppercase tracking-wider mb-1.5">
                <Clock className="w-4 h-4 text-[#70D7FF]" />
                <span>THỜI GIAN ĐĂNG KÝ CASTING</span>
              </div>
              <p className="text-[16px] xl:text-[17px] text-white font-medium">
                Từ <span className="text-[#70D7FF] font-bold">19g00 ngày 11/10/2026</span> đến{' '}
                <span className="text-[#70D7FF] font-bold">21g00 ngày 04/11/2026</span>.
              </p>
            </div>

            {/* 4. THREE RECRUITMENT FIELDS (Hát • Nhảy • Múa) */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-[#70D7FF] uppercase">
                  CÁC LĨNH VỰC TUYỂN CHỌN
                </span>
                <span className="h-[1px] flex-1 bg-[#70D7FF]/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. HÁT (VOCAL) */}
                <div className="p-4 rounded-2xl bg-[#09172B]/80 border border-[#70D7FF]/25 hover:border-[#70D7FF]/50 transition-all group">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#3C96FF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shadow-[0_0_10px_rgba(112,215,255,0.2)] group-hover:scale-110 transition-transform">
                      <Mic className="w-4 h-4" />
                    </div>
                    <span className="font-serif-display text-[17px] font-bold text-white tracking-wide">
                      HÁT
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-[12.5px] text-[#C4D5E8] pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
                      <span>1 bài cá nhân tự chọn (1–3 phút)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
                      <span>1 bài bắt buộc (BGK chọn ngẫu nhiên 1 trong 3 bài: <em>Linh thiêng Việt Nam, Khát vọng tuổi trẻ, Tàu anh qua núi</em> – chuẩn bị trước ở nhà)</span>
                    </li>
                  </ul>
                </div>

                {/* 2. NHẢY (DANCE) */}
                <div className="p-4 rounded-2xl bg-[#09172B]/80 border border-[#70D7FF]/25 hover:border-[#70D7FF]/50 transition-all group">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#3C96FF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shadow-[0_0_10px_rgba(112,215,255,0.2)] group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-serif-display text-[17px] font-bold text-white tracking-wide">
                      NHẢY
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-[12.5px] text-[#C4D5E8] pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
                      <span>1 bài nhảy tự chọn (1–3 phút)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
                      <span>K-Pop, Urban, Hiphop, Choreo...</span>
                    </li>
                  </ul>
                </div>

                {/* 3. MÚA */}
                <div className="p-4 rounded-2xl bg-[#09172B]/80 border border-[#70D7FF]/25 hover:border-[#70D7FF]/50 transition-all group">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FFB45C]/20 border border-[#FFB45C]/40 flex items-center justify-center text-[#FFB45C] shadow-[0_0_10px_rgba(255,180,92,0.2)] group-hover:scale-110 transition-transform">
                      <Flame className="w-4 h-4" />
                    </div>
                    <span className="font-serif-display text-[17px] font-bold text-white tracking-wide">
                      MÚA
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-[12.5px] text-[#C4D5E8] pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#FFB45C] mt-1.5 shrink-0" />
                      <span>1 bài múa tự chọn (1–3 phút)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#FFB45C] mt-1.5 shrink-0" />
                      <span>Dân gian, đương đại, ballet...</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. SMOOTH SCROLL TO SCENE 4 */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={scrollToCastingGuide}
                onMouseEnter={() => sound.playHover()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-[14px] font-semibold text-[#70D7FF] bg-[#0E2A4D]/80 hover:bg-[#133866] border border-[#70D7FF]/40 cursor-pointer shadow-[0_0_20px_rgba(57,139,255,0.25)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Xem lịch casting & địa điểm</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: Two Large Real HMC Photos (Cinematic Depth)             */}
          {/* ===================================================================== */}
          <div className="col-span-5 xl:col-span-5 relative h-[640px] xl:h-[680px] pointer-events-auto">
            {/* PHOTO 01 */}
            <div
              className="casting-photo-1-wrap absolute cursor-pointer group transition-transform duration-500"
              style={{
                right: '2%',
                top: '6%',
                width: '94%',
                maxWidth: '520px',
                zIndex: 6,
              }}
            >
              <div
                className="casting-photo-1 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ transform: 'rotate(-1.5deg)' }}
              >
                <div className="rounded-[24px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.88),0_0_25px_rgba(57,139,255,0.22)] border border-[#70D7FF]/30 aspect-[3/2] bg-[#0A1A2F]">
                  <img
                    src="/assets/music-club/scene-02-about/club_concert_team.jpg"
                    alt="Đại gia đình CLB Âm nhạc trên sân khấu rực rỡ"
                    className="w-full h-full object-cover object-center group-hover:brightness-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* PHOTO 02 */}
            <div
              className="casting-photo-2-wrap absolute cursor-pointer group transition-transform duration-500"
              style={{
                right: '8%',
                top: '48%',
                width: '86%',
                maxWidth: '460px',
                zIndex: 8,
              }}
            >
              <div
                className="casting-photo-2 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ transform: 'rotate(2deg)' }}
              >
                <div className="rounded-[22px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.94),0_0_30px_rgba(112,215,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2] bg-[#0A1A2F]">
                  <img
                    src="/assets/music-club/scene-02-about/club_blooming_bravery.jpg"
                    alt="Đêm diễn Blooming Bravery - Đại gia đình CLB Âm nhạc HUFLIT"
                    className="w-full h-full object-cover object-center group-hover:brightness-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET EDITORIAL COMPOSITION (< lg screens)                      */}
      {/* ========================================================================= */}
      <div className="lg:hidden relative z-[10] max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col text-left">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-[1px] bg-[#70D7FF]" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            HMC RECRUITMENT 2026
          </span>
          <span className="w-5 h-[1px] bg-[#70D7FF]" />
        </div>

        {/* Heading */}
        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-3">
          <span>THỜI GIAN TUYỂN CTV </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] block">
            CLB ÂM NHẠC HUFLIT
          </span>
        </h2>

        {/* Registration Time Banner */}
        <div className="p-4 rounded-2xl bg-[#09172B]/95 border border-[#70D7FF]/35 text-xs text-white mb-5 shadow-[0_0_20px_rgba(57,139,255,0.15)]">
          <div className="flex items-center gap-1.5 text-[#70D7FF] font-mono uppercase font-bold text-[11px] mb-1.5">
            <Clock className="w-3.5 h-3.5 text-[#70D7FF]" />
            <span>THỜI GIAN ĐĂNG KÝ CASTING</span>
          </div>
          <p className="text-[13.5px] sm:text-sm font-medium leading-relaxed">
            Từ <span className="font-bold text-[#70D7FF]">19g00 ngày 11/10/2026</span> đến{' '}
            <span className="font-bold text-[#70D7FF]">21g00 ngày 04/11/2026</span>.
          </p>
        </div>

        {/* 3 Fields Stack */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#70D7FF] uppercase">
              CÁC LĨNH VỰC TUYỂN CHỌN
            </span>
            <span className="text-[10px] text-[#91A4BB]">3 mảng chính</span>
          </div>

          {/* Vocal */}
          <div className="p-4 rounded-2xl bg-[#08172E]/90 border border-[#70D7FF]/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display text-base font-bold text-white">HÁT</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#398BFF]/20 text-[#70D7FF] font-semibold">
                VOCAL
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C4D5E8] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
                <span>1 bài cá nhân tự chọn (1–3 phút).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
                <span>1 bài bắt buộc (BGK chọn ngẫu nhiên 1 trong 3 bài: <em>Linh thiêng Việt Nam, Khát vọng tuổi trẻ, Tàu anh qua núi</em> – chuẩn bị trước ở nhà).</span>
              </li>
            </ul>
          </div>

          {/* Dance */}
          <div className="p-4 rounded-2xl bg-[#08172E]/90 border border-[#70D7FF]/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display text-base font-bold text-white">NHẢY</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#398BFF]/20 text-[#70D7FF] font-semibold">
                DANCE
              </span>
            </div>
            <ul className="space-y-1 text-xs text-[#C4D5E8] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
                <span>1 bài nhảy tự chọn (1–3 phút): K-Pop, Urban, Hiphop, Choreo...</span>
              </li>
            </ul>
          </div>

          {/* Múa */}
          <div className="p-4 rounded-2xl bg-[#08172E]/90 border border-[#FFB45C]/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFB45C]/20 border border-[#FFB45C]/40 flex items-center justify-center text-[#FFB45C]">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display text-base font-bold text-white">MÚA</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFB45C]/20 text-[#FFB45C] font-semibold">
                TRADITIONAL
              </span>
            </div>
            <ul className="space-y-1 text-xs text-[#C4D5E8] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C] mt-1.5 shrink-0" />
                <span>1 bài múa tự chọn (1–3 phút): Dân gian đương đại, truyền thống, ballet...</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2 Photos for Mobile */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl overflow-hidden border border-[#70D7FF]/30 shadow-md aspect-[3/2] relative group">
            <img
              src="/assets/music-club/scene-02-about/club_concert_team.jpg"
              alt="HMC Concert Stage"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/90 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[10px] font-medium text-white/95 truncate">
                Đại gia đình HMC
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#70D7FF]/30 shadow-md aspect-[3/2] relative group">
            <img
              src="/assets/music-club/scene-02-about/club_blooming_bravery.jpg"
              alt="Đêm diễn Blooming Bravery"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/90 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[10px] font-medium text-white/95 truncate">
                Blooming Bravery
              </span>
            </div>
          </div>
        </div>

        {/* Scroll CTA Button */}
        <button
          type="button"
          onClick={scrollToCastingGuide}
          onMouseEnter={() => sound.playHover()}
          className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-semibold text-[#70D7FF] bg-[#0E2A4D] hover:bg-[#133866] border border-[#70D7FF]/40 text-center shadow-[0_0_20px_rgba(57,139,255,0.25)] active:scale-98 transition-all"
          style={{ minHeight: '50px' }}
        >
          <span>Xem lịch casting & địa điểm</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  )
}
