import React, { useState, useEffect, useRef } from 'react'
import lottie, { AnimationItem } from 'lottie-web'
import { Sparkles, MessageCircle, X, Music } from 'lucide-react'
import { sound } from '../../lib/audioSynth'
import { orangeWalkingLottieData } from '../../data/orangeWalkingLottie'

interface FloatingOrangeMascotProps {
  onOpenRegister?: () => void
}

const FUN_QUOTES = [
  'nhấn vào mình điii 🍊👆',
  'HMC - Hai một cún 🐶🎵',
  'Đăng ký CTV ngay 🎤✨',
  'Cam vừa hát hay, vừa nhảy đẹp 💃🕺',
  'Cam đã đăng ký rồi, còn bạn thì sao? 🧡',
]

export const FloatingOrangeMascot: React.FC<FloatingOrangeMascotProps> = ({ onOpenRegister }) => {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [showSpeech, setShowSpeech] = useState(true)
  const [isJumping, setIsJumping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const lottieContainerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<AnimationItem | null>(null)

  // Initialize and load Lottie walking animation
  useEffect(() => {
    if (isMinimized || !lottieContainerRef.current) return

    animRef.current = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: orangeWalkingLottieData,
    })

    return () => {
      animRef.current?.destroy()
      animRef.current = null
    }
  }, [isMinimized])

  // Auto cycle fun quotes periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % FUN_QUOTES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleClick = () => {
    sound.playSuccess()
    setIsJumping(true)
    setTimeout(() => setIsJumping(false), 800)
    setQuoteIndex((prev) => (prev + 1) % FUN_QUOTES.length)
    setShowSpeech(true)
  }

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    sound.playClick()
    if (onOpenRegister) {
      onOpenRegister()
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 left-5 z-40 select-none animate-fadeIn">
        <button
          type="button"
          onClick={() => {
            sound.playClick()
            setIsMinimized(false)
          }}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#09172B]/95 hover:bg-[#0D223F] border border-[#FF8C00]/50 text-[#FFA500] hover:text-white shadow-[0_4px_25px_rgba(255,140,0,0.4)] backdrop-blur-md transition-all cursor-pointer active:scale-95"
          title="Mở Linh vật Cam HMC"
        >
          <span className="text-lg group-hover:scale-125 transition-transform inline-block">🍊</span>
          <span className="text-xs font-bold font-mono tracking-wide">HMC Mascot 🎶</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 select-none pointer-events-auto flex flex-col items-start group">
      {/* Speech Bubble Above Mascot */}
      {showSpeech && (
        <div
          onClick={handleAction}
          className="relative mb-2.5 ml-2 px-4 py-2.5 rounded-2xl bg-[#09172B]/95 hover:bg-[#0E2544] border border-[#FF9800]/40 text-white text-xs sm:text-[13px] font-medium shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer animate-fadeIn flex items-center gap-2 max-w-[260px] sm:max-w-[300px] group/bubble"
        >
          <span className="text-[12px] sm:text-[13px] leading-snug text-[#FFE0B2]">
            {FUN_QUOTES[quoteIndex]}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowSpeech(false)
            }}
            className="text-[#91A4BB] hover:text-white p-0.5 rounded-full hover:bg-white/10 shrink-0 ml-auto cursor-pointer"
            title="Đóng lời thoại"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Speech Bubble Arrow Indicator */}
          <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-[#09172B] border-r border-b border-[#FF9800]/40 rotate-45" />
        </div>
      )}

      {/* Floating Music Notes Animation */}
      <div className="absolute -top-7 left-4 pointer-events-none">
        <span className="absolute text-[#FF9800] text-base animate-mascot-note-1 drop-shadow-[0_0_8px_rgba(255,152,0,0.8)]">
          ♪
        </span>
        <span className="absolute left-8 text-[#70D7FF] text-sm animate-mascot-note-2 drop-shadow-[0_0_8px_rgba(112,215,255,0.8)]">
          ♫
        </span>
      </div>

      {/* Mascot Orange Container */}
      <div
        onClick={handleClick}
        onMouseEnter={() => sound.playHover()}
        className="relative flex flex-col items-center cursor-pointer group/mascot"
        title="Bấm vào tớ để nhảy múa nha! 🍊"
      >
        {/* The Animated Walking Orange Lottie Container */}
        <div
          className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 relative filter drop-shadow-[0_10px_25px_rgba(255,140,0,0.45)] transition-all duration-300 ${
            isJumping
              ? 'animate-bounce scale-110'
              : 'hover:scale-110'
          }`}
        >
          <div
            ref={lottieContainerRef}
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
          />
        </div>
      </div>

      {/* Quick Tiny Minimize Button on Hover */}
      <button
        type="button"
        onClick={() => {
          sound.playClick()
          setIsMinimized(true)
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 p-1 rounded-full bg-[#050D1A]/90 border border-white/20 text-[#91A4BB] hover:text-white text-[10px] shadow-sm cursor-pointer"
        title="Thu nhỏ linh vật"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

