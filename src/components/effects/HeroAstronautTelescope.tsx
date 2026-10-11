import React, { useEffect, useRef, useState } from 'react'
import lottie, { AnimationItem } from 'lottie-web'
import { Sparkles, Telescope } from 'lucide-react'
import { sound } from '../../lib/audioSynth'
import telescopeData from '../../data/cuteAstronautTelescopeLottie.json'

interface HeroAstronautTelescopeProps {
  className?: string
  width?: number | string
  height?: number | string
}

export const HeroAstronautTelescope: React.FC<HeroAstronautTelescopeProps> = ({
  className = '',
  width = 280,
  height = 280,
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
        animationData: telescopeData,
      })
    } catch (e) {
      console.warn('Lottie Telescope fallback', e)
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
      className={`hero-telescope-wrapper relative flex flex-col items-center justify-center cursor-pointer select-none group ${className}`}
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
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2A4D]/95 border border-[#70D7FF]/60 text-[#70D7FF] text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap shadow-[0_0_20px_rgba(57,139,255,0.45)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB45C] shrink-0" />
          <span>Ngắm sao cùng HMC nào! 🔭🌟</span>
        </div>
      </div>

      {/* Main Cosmic Floating Astronaut Container */}
      <div
        className={`animate-space-tour relative transition-transform duration-300 ${
          clicked ? 'scale-110' : 'group-hover:scale-105'
        }`}
        style={{
          filter:
            'drop-shadow(0 0 20px rgba(112, 215, 255, 0.45)) drop-shadow(0 0 40px rgba(57, 139, 255, 0.25))',
        }}
      >
        {/* Lottie Animation Container */}
        <div
          ref={containerRef}
          style={{ width, height }}
          className="w-full h-full max-w-full max-h-full"
        />

        {/* Ambient Radial Starlight Glow Behind Astronaut */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#70D7FF]/15 via-[#398BFF]/20 to-transparent blur-2xl pointer-events-none transform scale-90" />
      </div>

      {/* Subtle Bottom Explorer Tag */}
      <div className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-[10px] text-[#91A4BB] font-mono tracking-wider flex items-center gap-1">
          <Telescope className="w-3 h-3 text-[#70D7FF]" />
          STARGAZER • HMC
        </span>
      </div>
    </div>
  )
}
