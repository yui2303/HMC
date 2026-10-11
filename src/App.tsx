import { useState, useEffect, useRef } from 'react'
import { Navbar } from './components/navigation/Navbar'
import { HeroScene } from './components/scenes/HeroScene'
import { AboutScene } from './components/scenes/AboutScene'
import { StagesScene } from './components/scenes/StagesScene'
import { FamilyScene } from './components/scenes/FamilyScene'
import { CastingGuideScene } from './components/scenes/CastingGuideScene'
import { SoundWaveLayer } from './components/effects/SoundWaveLayer'
import { FloatingOrangeMascot } from './components/common/FloatingOrangeMascot'
import { RegistrationModal } from './components/common/RegistrationModal'
import { AdminLoginPage } from './components/admin/AdminLoginPage'
import { AdminApplicationsPage } from './components/admin/AdminApplicationsPage'
import { checkAuth, AdminUser } from './lib/adminApi'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { gsap, ScrollTrigger } from './lib/gsap'
import { Loader2 } from 'lucide-react'

export function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showReferenceOverlay, setShowReferenceOverlay] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const appRef = useRef<HTMLDivElement>(null)

  const isAdminRoute = currentPath.startsWith('/admin')

  // Navigation Helper
  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo(0, 0)
  }

  // Popstate Listener
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Verify Admin Auth Status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      setIsAuthChecking(true)
      try {
        const res = await checkAuth()
        if (res.authenticated && res.user) {
          setCurrentUser(res.user)
        } else {
          setCurrentUser(null)
        }
      } catch {
        setCurrentUser(null)
      } finally {
        setIsAuthChecking(false)
      }
    }
    verifyAuth()
  }, [currentPath])

  // Initialize Lenis smooth scroll if on public website and reduced motion is disabled
  useLenis(!prefersReducedMotion && !isAdminRoute)

  // Keyboard shortcut 'R' to toggle design reference overlay during development
  useEffect(() => {
    if (isAdminRoute) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement
      const isInput = activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)
      if ((e.key === 'r' || e.key === 'R') && !isInput) {
        setShowReferenceOverlay((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAdminRoute])

  // GSAP Animations: 100% Reversible, Cinematic Scroll-Linked Scrub System (Public website only)
  useEffect(() => {
    if (prefersReducedMotion || isAdminRoute) return

    const ctx = gsap.context(() => {
      // ==========================================
      // 1. HERO LOAD ENTRANCE (Initial page reveal)
      // ==========================================
      const heroLoadTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      heroLoadTl
        .fromTo(
          '.navbar-container',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
        )
        .fromTo(
          '.hero-eyebrow',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-heading',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          '.hero-desc',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-buttons',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )

      // ==========================================
      // 2. HERO SCROLL EXIT (100% Reversible Scrub)
      // ==========================================
      // Hero Content fades out & moves up gently on scroll down, restores on scroll up
      gsap.fromTo(
        '.hero-content',
        { autoAlpha: 1, y: 0 },
        {
          autoAlpha: 0,
          y: -55,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '55% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Hero Smoke: Moves slightly upward during exit
      gsap.fromTo(
        '.hero-smoke',
        { y: 0 },
        {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '80% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Hero Falling Particles: Fades gracefully into transition, 100% reversible
      gsap.fromTo(
        '.hero-particles',
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '75% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // ==========================================
      // 3. ABOUT SCENE ENTRY & REVEAL (Reversible)
      // ==========================================
      // About Background gradual blend in
      gsap.fromTo(
        '.about-bg',
        { opacity: 0.6 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // About Heading: Reveal from left
      gsap.fromTo(
        '.about-heading',
        { autoAlpha: 0, x: -30 },
        {
          autoAlpha: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // About Description: Reveal from bottom
      gsap.fromTo(
        '.about-desc',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 01 Entry: Top photo (Stage Performance)
      gsap.fromTo(
        '.about-photo-1',
        { y: 35, scale: 0.98, autoAlpha: 0.4 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            end: 'top 55%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 02 Entry: Far Left photo (Giai Vang)
      gsap.fromTo(
        '.about-photo-2',
        { y: 50, scale: 0.98, autoAlpha: 0.4 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 03 Entry: Bottom photo (Youth Fest)
      gsap.fromTo(
        '.about-photo-3',
        { y: 30, scale: 0.98, autoAlpha: 0.4 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // ==========================================
      // 4. ABOUT PHOTO PARALLAX
      // ==========================================
      // Subtle depth parallax while scrolling through About scene
      gsap.to('.about-photo-1', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.about-photo-2', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.about-photo-3', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // About exit transition toward WE ARE FAMILY (last ~15-18vh of About)
      gsap.to('.about-heading, .about-desc', {
        opacity: 0.35,
        y: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'bottom 50%',
          end: 'bottom 15%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.about-photo-1, .about-photo-2, .about-photo-3', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'bottom 50%',
          end: 'bottom 15%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // ==========================================
      // 4B. STAGES & ACHIEVEMENTS PARALLAX
      // ==========================================
      gsap.to('.stages-photo-1', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#stages',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.stages-photo-2', {
        y: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#stages',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.stages-photo-3', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#stages',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // ==========================================
      // 4C. WE ARE FAMILY SCENE ENTRY & REVEAL (100% Reversible)
      // ==========================================
      // Family Background gradual blend in
      gsap.fromTo(
        '.family-bg',
        { opacity: 0.5 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Title & Left Typography Reveal: x -24px -> 0, opacity 0 -> 1
      gsap.fromTo(
        '.casting-guide-left',
        { autoAlpha: 0, x: -24 },
        {
          autoAlpha: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 1 Entry (Dominant Upper-Right): y 24px -> 0, opacity 0 -> 1
      gsap.fromTo(
        '.casting-photo-1-wrap',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 2 Entry (Secondary Lower-Right): y 36px -> 0, opacity 0 -> 1
      gsap.fromTo(
        '.casting-photo-2-wrap',
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 75%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // ==========================================
      // 4C. CASTING PHOTO PARALLAX & SOUNDWAVE
      // ==========================================
      // Parallax while scrolling across Casting scene
      gsap.to('.casting-photo-1-wrap', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'top 45%',
          end: 'bottom 45%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.casting-photo-2-wrap', {
        y: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'top 45%',
          end: 'bottom 45%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Weaving Soundwave light motion through Casting scene
      gsap.fromTo(
        '.family-wave',
        { y: 10, opacity: 0.18 },
        {
          y: -12,
          opacity: 0.28,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // CASTING -> CASTING GUIDE EXIT TRANSITION (last 18-20vh)
      gsap.to('.casting-photo-1-wrap', {
        y: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 40%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.casting-photo-2-wrap', {
        y: -24,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 40%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.casting-guide-left', {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 35%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.family-wave', {
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 35%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // ==========================================
      // 6. CASTING GUIDE SCENE ENTRY (Audition Stage Mood)
      // ==========================================
      // Casting Guide Background
      gsap.fromTo(
        '.casting-guide-bg',
        { opacity: 0.4 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#casting-guide',
            start: 'top 90%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Heading Reveal: From Left
      gsap.fromTo(
        '.casting-heading-group',
        { autoAlpha: 0, x: -25 },
        {
          autoAlpha: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#casting-guide',
            start: 'top 75%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )
    }, appRef)

    // Ensure ScrollTrigger accurately calculates positions after fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    return () => ctx.revert()
  }, [prefersReducedMotion])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 1. ADMIN ROUTING BRANCH
  if (isAdminRoute) {
    if (isAuthChecking) {
      return (
        <div className="min-h-screen bg-[#050D1A] flex items-center justify-center text-[#70D7FF]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-mono tracking-widest uppercase">Đang xác thực hệ thống...</span>
          </div>
        </div>
      )
    }

    if (currentPath === '/admin/login') {
      if (currentUser) {
        return (
          <AdminApplicationsPage
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null)
              navigate('/admin/login')
            }}
            onNavigateHome={() => navigate('/')}
          />
        )
      }
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            navigate('/admin/applications')
          }}
          onNavigateHome={() => navigate('/')}
        />
      )
    }

    // Any other /admin route (e.g. /admin/applications, /admin)
    if (!currentUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            navigate('/admin/applications')
          }}
          onNavigateHome={() => navigate('/')}
        />
      )
    }

    return (
      <AdminApplicationsPage
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null)
          navigate('/admin/login')
        }}
        onNavigateHome={() => navigate('/')}
      />
    )
  }

  // 2. PUBLIC WEBSITE BRANCH
  return (
    <div ref={appRef} className="min-h-screen bg-[#050D1A] text-[#F4F7FB] relative selection:bg-[#398BFF] selection:text-white overflow-x-hidden">
      {/* Global SoundWave Narrative Ribbon */}
      <SoundWaveLayer />

      {/* Global Navigation Bar */}
      <Navbar onOpenRegister={() => setIsRegisterOpen(true)} />


      {/* Main Continuous Musical World with Seamless Overlaps */}
      <main className="music-world relative w-full overflow-hidden">
        {/* SCENE 01: HERO (Concert Stage) */}
        <div className="relative z-[2]">
          <HeroScene
            onOpenRegister={() => setIsRegisterOpen(true)}
            onExplore={() => scrollToSection('about')}
            showReferenceOverlay={showReferenceOverlay}
          />
        </div>

        {/* SCENE 02: ABOUT (WE ARE HMC - Overlaps Hero ~18vh on Desktop) */}
        <div className="lg:-mt-[18vh] -mt-0 relative z-[3]">
          <AboutScene
            showReferenceOverlay={showReferenceOverlay}
          />
        </div>

        {/* SCENE 02B: STAGES & ACHIEVEMENTS (Dấu ấn trên những sân khấu) */}
        <div className="relative z-[4]">
          <StagesScene
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        </div>

        {/* SCENE 03: TUYỂN CTV (Thời gian đăng ký, 2 ảnh, 3 lĩnh vực tuyển chọn) */}
        <div className="lg:-mt-[10vh] -mt-0 relative z-[5]">
          <FamilyScene
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        </div>

        {/* SCENE 04: HƯỚNG DẪN & LỊCH CASTING (Thời gian casting, địa điểm, nút đăng ký) */}
        <div className="relative z-[6]">
          <CastingGuideScene
            onOpenRegister={() => setIsRegisterOpen(true)}
            showReferenceOverlay={showReferenceOverlay}
          />
        </div>
      </main>

      {/* Persistent Floating Orange Mascot at Bottom-Left Screen */}
      <FloatingOrangeMascot onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  )
}
export default App
