import React, { useEffect, useRef, useState } from 'react'
import lottie, { AnimationItem } from 'lottie-web'
import { Sparkles, Globe } from 'lucide-react'
import { sound } from '../../lib/audioSynth'
import planetOrbitData from '../../data/planetOrbitLottie.json'

interface HeroPlanetOrbitProps {
  className?: string
  width?: number | string
  height?: number | string
}

export const HeroPlanetOrbit: React.FC<HeroPlanetOrbitProps> = ({
  className = '',
  width = 220,
  height = 220,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<AnimationItem | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: planetOrbitData,
      })
    } catch (e) {
      console.warn('Lottie Planet Orbit fallback', e)
    }

    return () => {
      animRef.current?.destroy()
      animRef.current = null
    }
  }, [])

  const handleClick = () => {
    sound.playSuccess()
    setClicked(true)
    setTimeout(() => setClicked(false), 800)
  }

  return (
    <div
      className={`hero-planet-wrapper relative flex flex-col items-center justify-center cursor-pointer select-none group ${className}`}
      onMouseEnter={() => {
        setIsHovered(true)
        sound.playHover()
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Interactive Speech Tag on Hover / Click */}
      <div
        className={`absolute -top-7 sm:-top-8 z-30 transition-all duration-300 pointer-events-none ${
          isHovered || clicked
            ? 'opacity-100 transform translate-y-0 scale-100'
            : 'opacity-0 transform translate-y-2 scale-95'
        }`}
      >
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2A4D]/95 border border-[#FF9800]/50 text-[#FFE0B2] text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap shadow-[0_0_20px_rgba(255,152,0,0.35)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB45C] shrink-0" />
          <span>Hành tinh âm nhạc HMC 🪐✨</span>
        </div>
      </div>

      {/* Main Cosmic Floating Planet Container */}
      <div
        className={`animate-planet-orbit relative transition-transform duration-300 ${
          clicked ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          filter:
            'drop-shadow(0 0 18px rgba(255, 152, 0, 0.45)) drop-shadow(0 0 35px rgba(112, 215, 255, 0.25))',
        }}
      >
        {/* Lottie Animation Container */}
        <div
          ref={containerRef}
          style={{ width, height }}
          className="w-full h-full max-w-full max-h-full"
        />

        {/* Ambient Radial Glow Behind Planet */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#FF9800]/15 via-[#70D7FF]/15 to-transparent blur-2xl pointer-events-none transform scale-90" />
      </div>

      {/* Subtle Tag */}
      <div className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-[10px] text-[#91A4BB] font-mono tracking-wider flex items-center gap-1">
          <Globe className="w-3 h-3 text-[#FFB45C]" />
          ORBIT • HMC
        </span>
      </div>
    </div>
  )
}
