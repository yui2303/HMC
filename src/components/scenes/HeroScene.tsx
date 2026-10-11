import React, { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { sound } from '../../lib/audioSynth'
import { ReferenceOverlay } from '../common/ReferenceOverlay'
import { HeroParticlesBack, HeroParticlesFront } from '../effects/HeroFallingParticles'
import { HeroAstronautTelescope } from '../effects/HeroAstronautTelescope'
import { HeroPlanetOrbit } from '../effects/HeroPlanetOrbit'

interface HeroSceneProps {
  onOpenRegister: () => void
  onExplore: () => void
  showReferenceOverlay?: boolean
}

export const HeroScene: React.FC<HeroSceneProps> = ({ onOpenRegister, onExplore, showReferenceOverlay = false }) => {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-visible pt-24 sm:pt-28 pb-20 sm:pb-28 select-none bg-transparent"
    >
      {/* Reference Overlay (toggled via 'R') */}
      <ReferenceOverlay
        src="/assets/music-club/scene-01-hero/reference.png"
        show={showReferenceOverlay}
      />

      {/* LAYER 1: Background - Concert Stage with Bottom Vertical Fade Mask */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 80%, rgba(0,0,0,0.4) 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, rgba(0,0,0,0.4) 92%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-01-hero/background.png"
          alt="Concert Stage Background"
          className="w-full h-full object-cover object-center scale-100"
          loading="eager"
        />
        {/* Deep ambient gradient overlay for smooth visual blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050D1A]/60 via-transparent to-[#050D1A]/80" />
      </div>

      {/* LAYER 3: Stage Smoke Atmosphere */}
      <div
        className="hero-smoke absolute inset-0 z-[3] pointer-events-none opacity-70 mix-blend-screen"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-01-hero/smoke.png"
          alt="Stage Smoke"
          className="w-full h-full object-cover object-bottom"
          loading="eager"
        />
      </div>

      {/* LAYER 3.5: Back Falling Particles (Far & Mid Layers behind content - z-index 15) */}
      <HeroParticlesBack />

      {/* LAYER 3.8: Floating Cosmic Planet with Orbit Ring & Stars (Upper-Left Corner of Hero) */}
      <div className="absolute top-20 left-3 sm:top-24 sm:left-6 lg:top-28 lg:left-10 xl:top-32 xl:left-14 z-20 pointer-events-auto">
        {/* Desktop View */}
        <div className="hidden sm:block">
          <HeroPlanetOrbit width={200} height={200} />
        </div>
        {/* Mobile View */}
        <div className="sm:hidden">
          <HeroPlanetOrbit width={110} height={110} />
        </div>
      </div>

      {/* LAYER 4: Center HTML Content Group (Eyebrow, Heading, Description, Buttons) */}
      <div className="hero-content relative z-30 max-w-5xl mx-auto px-4 text-center flex flex-col items-center my-auto">
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-5">
          <span className="w-5 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#70D7FF]/80" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.35em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
            <Sparkles className="w-3.5 h-3.5 inline-block" />
            HUFLIT MUSIC CLUB
          </span>
          <span className="w-5 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#70D7FF]/80" />
        </div>

        {/* Main Heading */}
        <h1 className="hero-heading font-serif-display text-3xl leading-[1.1] sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white mb-3 sm:mb-5 max-w-4xl">
          <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">JOIN THE </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
            RHYTHM
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="hero-desc font-sans text-xs sm:text-base md:text-lg text-[#91A4BB] max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 text-balance px-2">
          Nơi những người yêu âm nhạc cùng kết nối, biểu diễn và tạo nên những khoảnh khắc đáng nhớ bằng đam mê và sáng tạo.
        </p>

        {/* Action Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto max-w-xs sm:max-w-none">
          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onOpenRegister()
            }}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto btn-primary-glow flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white tracking-wide cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.6)] active:scale-95 transition-all"
            style={{ minHeight: '48px' }}
          >
            <span>Đăng ký CTV</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onExplore()
            }}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto btn-secondary-glow flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-sm sm:text-base font-medium text-[#F4F7FB] tracking-wide cursor-pointer hover:text-[#70D7FF] active:scale-95 transition-all"
            style={{ minHeight: '48px' }}
          >
            <span>Khám phá CLB</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LAYER 7: Front Falling Particles (Low density 3D foreground floating - z-index 35) */}
      <HeroParticlesFront />

      {/* LAYER 8: Cute Astronaut with Telescope looking at stars (Bottom-Right Corner of Hero) */}
      <div className="absolute bottom-2 right-2 sm:bottom-5 sm:right-6 lg:bottom-6 lg:right-10 xl:bottom-8 xl:right-14 z-30 pointer-events-auto">
        {/* Desktop View */}
        <div className="hidden sm:block">
          <HeroAstronautTelescope width={280} height={280} />
        </div>
        {/* Mobile View */}
        <div className="sm:hidden">
          <HeroAstronautTelescope width={170} height={170} />
        </div>
      </div>
    </section>
  )
}
