import React, { useState, useRef } from 'react'
import { Mail, Send, MapPin, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react'
import { clubData } from '../../data/socialLinks'
import { sound } from '../../lib/audioSynth'
import confetti from 'canvas-confetti'
import { ReferenceOverlay } from '../common/ReferenceOverlay'

interface ContactSceneProps {
  showReferenceOverlay?: boolean
}

export const ContactScene: React.FC<ContactSceneProps> = ({ showReferenceOverlay = false }) => {
  const sceneRef = useRef<HTMLElement>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sound.playSuccess()

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#70D7FF', '#FFB45C', '#398BFF'],
    })

    setIsSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitted(false)
    }, 5000)
  }

  return (
    <section
      id="contact"
      ref={sceneRef}
      className="scene scene-4 relative w-full min-h-screen overflow-hidden select-none bg-[#050D1A]"
      style={{
        isolation: 'isolate',
        paddingTop: 'clamp(100px, 14vh, 160px)',
        paddingBottom: 'clamp(80px, 10vh, 120px)',
      }}
    >
      {/* Reference Overlay (toggled via 'R') */}
      <ReferenceOverlay
        src="/assets/music-club/scene-04-contact/reference.png"
        show={showReferenceOverlay}
      />

      {/* LAYER 0: Top Entry Atmospheric Fade (Smooth transition from Scene 3) */}
      <div
        className="absolute top-0 left-0 right-0 h-40 lg:h-56 z-[10] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #050D1A 0%, rgba(5, 13, 26, 0.9) 40%, transparent 100%)',
        }}
      />

      {/* LAYER 1: Background - Late Night Music Studio & City View (z-index 1) */}
      <div className="contact-bg absolute inset-0 z-[1] pointer-events-none">
        <img
          src="/assets/music-club/scene-04-contact/scene4_background.jpg"
          alt="Late Night Studio Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#050D1A]/55" />
      </div>

      {/* LAYER 2: Window Frame (z-index 2) */}
      <div className="contact-props absolute top-0 right-0 w-[60%] h-[70%] z-[2] pointer-events-none opacity-80">
        <img
          src="/assets/music-club/scene-04-contact/scene4_window_frame.png"
          alt="Studio Window Frame"
          className="w-full h-full object-contain object-top-right"
          loading="lazy"
        />
      </div>

      {/* LAYER 3: Studio Desk (z-index 3) */}
      <div className="contact-desk hidden lg:block absolute bottom-0 right-4 xl:right-12 w-[48%] max-w-[700px] h-[55%] z-[3] pointer-events-none opacity-85">
        <img
          src="/assets/music-club/scene-04-contact/scene4_desk.png"
          alt="Studio Desk and Keyboard"
          className="w-full h-full object-contain object-bottom-right"
          loading="lazy"
        />
      </div>

      {/* LAYER 4: Studio Speakers & Books (z-index 4) */}
      <div className="contact-props hidden lg:block absolute bottom-12 left-4 xl:left-10 w-[20%] max-w-[280px] z-[4] pointer-events-none opacity-85 drop-shadow-[0_12px_30px_rgba(0,0,0,0.8)]">
        <img
          src="/assets/music-club/scene-04-contact/scene4_speaker.png"
          alt="Studio Monitor Speakers"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>
      <div className="contact-props hidden lg:block absolute bottom-32 left-2 xl:left-6 w-[14%] max-w-[190px] z-[4] pointer-events-none opacity-80 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
        <img
          src="/assets/music-club/scene-04-contact/scene4_books.png"
          alt="Music Theory Books"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* LAYER 5: Studio Poster (z-index 5) */}
      <div className="contact-props hidden lg:block absolute top-10 left-6 xl:left-12 w-[14%] max-w-[190px] z-[5] pointer-events-none opacity-85 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
        <img
          src="/assets/music-club/scene-04-contact/scene4_poster.png"
          alt="Music Poster"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* LAYER 6: Guitar & Plant (z-index 6) */}
      <div className="contact-props hidden lg:block absolute bottom-4 left-24 xl:left-40 w-[16%] max-w-[230px] z-[6] pointer-events-none opacity-85 drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]">
        <img
          src="/assets/music-club/scene-04-contact/scene4_guitar.png"
          alt="Studio Guitar"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>
      <div className="contact-props hidden lg:block absolute bottom-6 right-2 xl:right-8 w-[14%] max-w-[190px] z-[6] pointer-events-none opacity-85">
        <img
          src="/assets/music-club/scene-04-contact/scene4_plant.png"
          alt="Studio Plant"
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* LAYER 7: Desk Lamp with Warm Accent Light (z-index 7) */}
      <div className="contact-lamp hidden lg:block absolute bottom-16 right-[38%] xl:right-[35%] w-[13%] max-w-[170px] z-[7] pointer-events-none opacity-90">
        <div className="relative">
          <img
            src="/assets/music-club/scene-04-contact/scene4_lamp.png"
            alt="Warm Studio Desk Lamp"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
          {/* Ambient Warm Amber Light Glow (5-10% of overall visual palette) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#FFB45C]/25 blur-3xl pointer-events-none mix-blend-screen animate-lamp-pulse" />
        </div>
      </div>

      {/* LAYER 8: Atmospheric Smoke (z-index 8) */}
      <div className="contact-smoke absolute inset-0 z-[8] pointer-events-none opacity-65 mix-blend-screen">
        <img
          src="/assets/music-club/scene-04-contact/scene4_smoke.png"
          alt="Studio Ambient Smoke"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* LAYER 9: Atmospheric Particles (z-index 9) */}
      <div className="absolute inset-0 z-[9] pointer-events-none opacity-70 mix-blend-screen">
        <img
          src="/assets/music-club/scene-04-contact/scene4_particles.png"
          alt="Studio Ambient Particles"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* LAYER 10: Soundwave Integrated into Lower Studio Floor */}
      <div className="contact-soundwave absolute bottom-4 sm:bottom-8 left-0 right-0 h-40 sm:h-52 z-[8] pointer-events-none mix-blend-screen opacity-70">
        <img
          src="/assets/music-club/scene-04-contact/scene4_soundwave.png"
          alt="Continuous Soundwave Stream"
          className="w-full h-full object-cover sm:object-contain filter drop-shadow-[0_0_25px_rgba(112,215,255,0.7)]"
          loading="lazy"
        />
      </div>

      {/* Atmospheric Floor Vignette: Deep blue gradient fading upward */}
      <div className="absolute bottom-0 left-0 right-0 h-52 sm:h-64 pointer-events-none z-[9] bg-gradient-to-t from-[#020813] via-[#020813]/90 to-transparent" />

      {/* LAYER 11: HTML CONTACT CONTENT (z-index 11) */}
      <div className="relative z-[11] max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* DESKTOP 2-COLUMN LAYOUT: Left 8-42% / Right 52-88% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT AREA: Heading + Contact Info Cards (~35-40% width) */}
          <div className="contact-left-col lg:col-span-5 flex flex-col items-start text-left">
            {/* Eyebrow & Heading */}
            <div className="contact-heading-group">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
                <span className="text-xs tracking-[0.35em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
                  <Sparkles className="w-3.5 h-3.5" />
                  LET&apos;S CONNECT
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-[56px] text-white tracking-tight leading-[1.1] mb-3 sm:mb-4">
                <span>LIÊN HỆ </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
                  VỚI CHÚNG MÌNH
                </span>
              </h2>

              {/* Description */}
              <p className="font-sans text-sm sm:text-base text-[#91A4BB] leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Nếu bạn có bất kỳ câu hỏi nào, muốn hợp tác, tham gia sự kiện hoặc đơn giản là muốn chia sẻ niềm yêu âm nhạc, đừng ngần ngại liên hệ với chúng mình nhé!
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="contact-info w-full space-y-3">
              {/* Email */}
              <a
                href={`mailto:${clubData.email}`}
                onMouseEnter={() => sound.playHover()}
                className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 sm:gap-4 hover:border-[#70D7FF]/60 hover:bg-[#0E2A4D]/60 transition-all group cursor-pointer block"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/30 flex items-center justify-center text-[#70D7FF] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(112,215,255,0.4)] transition-all shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] sm:text-[11px] text-[#91A4BB] uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-xs sm:text-sm text-white font-medium truncate group-hover:text-[#70D7FF] transition-colors">
                    {clubData.email}
                  </p>
                </div>
              </a>

              {/* Facebook Fanpage */}
              <a
                href={clubData.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sound.playHover()}
                className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 sm:gap-4 hover:border-[#1877F2]/60 hover:bg-[#0E2A4D]/60 transition-all group cursor-pointer block"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0E2A4D] border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] transition-all shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] sm:text-[11px] text-[#91A4BB] uppercase tracking-wider font-semibold">Fanpage Chính Thức</p>
                  <p className="text-xs sm:text-sm text-white font-medium truncate group-hover:text-[#70D7FF] transition-colors">
                    facebook.com/huflitmusicclub
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0E2A4D] border border-[#70D7FF]/30 flex items-center justify-center text-[#70D7FF] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] text-[#91A4BB] uppercase tracking-wider font-semibold">Địa điểm sinh hoạt</p>
                  <p className="text-xs sm:text-sm text-white font-medium leading-tight">
                    {clubData.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT AREA: Message Form (~40-45% width) */}
          <div className="contact-right-col lg:col-span-7 w-full flex justify-end">
            <div className="contact-form w-full max-w-lg glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden">
              {/* Form Ambient Top Glow Accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#398BFF]/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="font-sans font-bold text-lg sm:text-2xl text-white mb-5 sm:mb-6 flex items-center gap-2">
                <span>Gửi lời nhắn</span>
                <span className="w-2 h-2 rounded-full bg-[#70D7FF] animate-pulse" />
              </h3>

              {isSubmitted ? (
                <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#70D7FF]/20 border border-[#70D7FF] flex items-center justify-center text-[#70D7FF] shadow-[0_0_25px_rgba(112,215,255,0.5)]">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="font-serif-display text-lg sm:text-xl text-white font-semibold">Cảm ơn bạn đã liên hệ!</h4>
                  <p className="text-xs sm:text-sm text-[#91A4BB] max-w-xs">
                    Chúng mình đã nhận được tin nhắn và sẽ phản hồi cho bạn trong thời gian sớm nhất nhé.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1.5 sm:mb-2 text-left">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl bg-[#050D1A]/70 border border-[#70D7FF]/20 text-white placeholder-[#91A4BB]/40 focus:outline-none focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] transition-all text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1.5 sm:mb-2 text-left">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#050D1A]/70 border border-[#70D7FF]/20 text-white placeholder-[#91A4BB]/40 focus:outline-none focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] transition-all text-base sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-[#91A4BB] uppercase tracking-wider mb-1.5 sm:mb-2 text-left">
                      Tin nhắn của bạn
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Chia sẻ cùng CLB Âm nhạc nhé..."
                      className="w-full px-4 py-3 rounded-xl bg-[#050D1A]/70 border border-[#70D7FF]/20 text-white placeholder-[#91A4BB]/40 focus:outline-none focus:border-[#70D7FF] focus:ring-1 focus:ring-[#70D7FF] transition-all text-base sm:text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={() => sound.playHover()}
                    className="btn-primary-glow w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white tracking-wide cursor-pointer shadow-[0_0_20px_rgba(57,139,255,0.6)] hover:scale-[1.02] active:scale-98 transition-all mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi tin nhắn</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-center text-xs text-[#91A4BB]/80 text-center relative z-[15]">
          <div>
            &copy; {new Date().getFullYear()} HUFLIT MUSIC CLUB. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  )
}

