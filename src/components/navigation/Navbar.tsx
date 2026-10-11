import React, { useState, useEffect } from 'react'
import { sound } from '../../lib/audioSynth'
import { Volume2, VolumeX, Menu, X, ArrowRight } from 'lucide-react'
import { navItems } from '../../data/socialLinks'

interface NavbarProps {
  onOpenRegister: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)

      // Determine active section
      const sections = ['hero', 'about', 'stages', 'family', 'casting-guide']
      const scrollPos = window.scrollY + 250

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSound = () => {
    const muted = sound.toggleMute()
    setIsMuted(muted)
    if (!muted) {
      sound.playSuccess()
    }
  }

  const handleNavClick = (href: string) => {
    sound.playClick()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={`navbar-container fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050D1A]/90 backdrop-blur-md border-b border-[#70D7FF]/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
            : 'bg-[#050D1A]/45 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#hero')
            }}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none"
          >
            {/* Official HMC Club Logo Badge */}
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#70D7FF]/40 group-hover:border-[#70D7FF] group-hover:shadow-[0_0_16px_rgba(112,215,255,0.6)] transition-all bg-[#071A33] shrink-0">
              <img
                src="/assets/music-club/shared/hmc_logo.jpg"
                alt="HUFLIT Music Club Logo"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-display text-base sm:text-lg tracking-wider text-[#F4F7FB] font-semibold group-hover:text-[#70D7FF] transition-colors leading-none">
                MUSIC CLUB
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#91A4BB] uppercase font-mono mt-0.5">
                HUFLIT • 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#071A33]/70 backdrop-blur-lg border border-[#70D7FF]/20 shadow-[0_0_20px_rgba(5,13,26,0.6)]">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '')
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-[#70D7FF] bg-[#0E2A4D]/90 shadow-[0_0_12px_rgba(112,215,255,0.25)]'
                      : 'text-[#91A4BB] hover:text-[#F4F7FB] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-[#70D7FF] rounded-full shadow-[0_0_6px_#70D7FF]" />
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
              className="p-2.5 rounded-full bg-[#071A33]/70 border border-[#70D7FF]/20 text-[#91A4BB] hover:text-[#70D7FF] hover:border-[#70D7FF]/50 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#70D7FF]" />}
            </button>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => {
                sound.playClick()
                onOpenRegister()
              }}
              onMouseEnter={() => sound.playHover()}
              className="btn-primary-glow flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white tracking-wide cursor-pointer"
            >
              <span>Đăng ký CTV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="w-10 h-10 rounded-xl bg-[#071A33]/80 border border-[#70D7FF]/25 flex items-center justify-center text-[#91A4BB] active:scale-95 transition-transform"
              aria-label={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#70D7FF]" />}
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="w-10 h-10 rounded-xl bg-[#071A33]/80 border border-[#70D7FF]/30 flex items-center justify-center text-[#F4F7FB] active:scale-95 transition-transform"
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#70D7FF]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu & Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-start">
          {/* Backdrop Blur that dismisses on tap */}
          <div
            className="fixed inset-0 bg-[#050D1A]/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Drawer Box */}
          <div className="relative z-50 mt-18 mx-3 p-5 rounded-3xl bg-[#071A33]/98 border border-[#70D7FF]/35 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(57,139,255,0.25)] animate-in slide-in-from-top-4 duration-250 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#70D7FF]/40 bg-[#071A33]">
                  <img
                    src="/assets/music-club/shared/hmc_logo.jpg"
                    alt="HMC Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#70D7FF]">
                  CLB ÂM NHẠC HUFLIT
                </span>
              </div>
              <span className="text-[10px] text-[#91A4BB] font-mono">2026</span>
            </div>

            <div className="flex flex-col gap-1.5 py-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '')
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-medium transition-all ${
                      isActive
                        ? 'text-[#70D7FF] bg-[#0E2A4D] border border-[#70D7FF]/40 shadow-[0_0_15px_rgba(112,215,255,0.2)]'
                        : 'text-[#F4F7FB] hover:text-[#70D7FF] hover:bg-white/5 border border-transparent'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#70D7FF] shadow-[0_0_8px_#70D7FF]" />
                    )}
                  </a>
                )
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick()
                  setMobileMenuOpen(false)
                  onOpenRegister()
                }}
                className="w-full btn-primary-glow flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold text-white shadow-[0_0_20px_rgba(57,139,255,0.6)] active:scale-98 transition-all"
                style={{ minHeight: '52px' }}
              >
                <span>Đăng ký Casting ngay</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
