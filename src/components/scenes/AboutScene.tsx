import React, { useRef } from 'react'
import { Sparkles, Users, Music, HeartHandshake } from 'lucide-react'
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
      className="relative w-full min-h-0 lg:h-screen lg:min-h-[840px] pt-12 sm:pt-16 lg:pt-[18vh] pb-8 lg:pb-0 overflow-visible select-none bg-transparent"
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/90 via-[#050D1A]/55 to-[#050D1A]/85" />
      </div>

      {/* DESKTOP TARGET COMPOSITION (lg screens: 1440x900 target artboard) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-auto">
        {/* TEXT GROUP: left 8%, top 12%, width 40% */}
        <div
          className="about-text-group absolute z-20 flex flex-col items-start text-left"
          style={{
            left: '8%',
            top: '12%',
            width: '40%',
            maxWidth: '540px',
          }}
        >
          {/* Eyebrow */}
          <div className="about-eyebrow flex items-center gap-3 mb-2.5">
            <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
            <span className="text-xs tracking-[0.35em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              MUSIC • COMMUNITY • PASSION
            </span>
          </div>

          {/* Heading */}
          <h2
            className="about-heading font-serif-display text-4xl xl:text-5xl text-white tracking-tight leading-[1.06] mb-4"
            style={{ maxWidth: '480px' }}
          >
            <span>WE ARE </span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
              HMC
            </span>
          </h2>

          {/* Description Paragraph 1 */}
          <p
            className="about-desc font-sans text-xs xl:text-sm text-[#E2EBF6] leading-relaxed mb-3.5 text-justify"
            style={{ maxWidth: '500px' }}
          >
            <strong>HUFLIT MUSIC CLUB (HMC)</strong> là Câu lạc bộ Âm nhạc trực thuộc Hội Sinh viên Trường Đại học Ngoại ngữ – Tin học TP.HCM (HUFLIT), nơi kết nối những người trẻ có chung niềm đam mê âm nhạc, nghệ thuật biểu diễn và khát khao tỏa sáng trên sân khấu.
          </p>

          {/* Description Paragraph 2 */}
          <p
            className="about-desc font-sans text-xs xl:text-sm text-[#91A4BB] leading-relaxed mb-5 text-justify"
            style={{ maxWidth: '500px' }}
          >
            Không chỉ nuôi dưỡng tình yêu âm nhạc, HMC còn là môi trường để mỗi thành viên khám phá tiềm năng, phát triển bản thân và thể hiện cá tính qua từng màn trình diễn. Với HMC, mỗi sân khấu là cơ hội để thử sức, mỗi tiết mục là một câu chuyện được kể bằng âm nhạc, cùng nhau tạo nên những trải nghiệm nghệ thuật sáng tạo, giàu cảm xúc và mang đậm dấu ấn riêng.
          </p>

          {/* Core Values Badges */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-[500px]">
            <div className="p-3 rounded-2xl bg-[#09172B]/85 border border-[#70D7FF]/30 flex items-center gap-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <div className="w-8 h-8 rounded-lg bg-[#3C96FF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-white block">Trực thuộc HSV HUFLIT</span>
                <span className="text-[10px] text-[#91A4BB]">Môi trường kết nối &amp; trưởng thành</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#09172B]/85 border border-[#FFB45C]/35 flex items-center gap-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              <div className="w-8 h-8 rounded-lg bg-[#FFB45C]/20 border border-[#FFB45C]/40 flex items-center justify-center text-[#FFB45C] shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-white block">Âm Nhạc &amp; Nghệ Thuật</span>
                <span className="text-[10px] text-[#91A4BB]">Khám phá cá tính riêng</span>
              </div>
            </div>
          </div>
        </div>

        {/* PHOTO COLLAGE (3D Depth Group - With 3 New HMC Family & Activity Photos) */}
        <div
          className="photo-cluster scene2-collage absolute z-[5] pointer-events-auto"
          style={{
            left: '49%',
            top: '12%',
            width: '46%',
            height: '75%',
          }}
        >
          {/* PHOTO 01: Top photo - HMC Family Celebration & Graduation (z-index: 5) */}
          <div
            className="photo photo-1 about-photo-1 about-photo-slot-1 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '16%',
              top: '0%',
              width: '70%',
              transform: 'rotate(-1deg)',
              zIndex: 5,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(57,139,255,0.2)] border border-[#70D7FF]/35 aspect-[3/2] relative group">
              <img
                src="/assets/music-club/scene-02-about/hmc_family_graduation.jpg"
                alt="Gia đình HMC"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-3.5">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#FFB45C]" />
                    GIA ĐÌNH HMC
                  </span>
                  <span className="text-[10px] text-[#C4D5E8] block mt-0.5">
                    Nơi gắn kết đam mê, sẻ chia niềm vui và cùng nhau tỏa sáng
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO 02: Far Left photo - 50 Năm Tự Hào Bản Hùng Ca HUFLIT (z-index: 7) */}
          <div
            className="photo photo-2 about-photo-2 about-photo-slot-2 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '0%',
              top: '42%',
              width: '54%',
              transform: 'rotate(-2deg)',
              zIndex: 7,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,180,92,0.25)] border border-[#FFB45C]/45 aspect-[3/2] relative group">
              <img
                src="/assets/music-club/scene-02-about/hmc_50_nam_ban_hung_ca.jpg"
                alt="HMC tại Cuộc thi 50 năm tự hào bản hùng ca HUFLIT"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-2.5">
                <div>
                  <span className="text-[11px] font-bold text-[#FFB45C] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB45C]" />
                    BẢN HÙNG CA HUFLIT
                  </span>
                  <span className="text-[9.5px] text-[#C4D5E8] block mt-0.5">
                    Tập thể HMC bùng nổ tài năng &amp; nhiệt huyết
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO 03: Bottom Right photo - Đấu Trường Tài Năng HUFLIT (z-index: 8) */}
          <div
            className="photo photo-3 about-photo-3 about-photo-slot-3 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '48%',
              top: '50%',
              width: '52%',
              transform: 'rotate(2deg)',
              zIndex: 8,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(57,139,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2] relative group">
              <img
                src="/assets/music-club/scene-02-about/hmc_dau_truong_tai_nang.jpg"
                alt="HMC tại Đấu Trường Tài Năng HUFLIT"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-2.5">
                <div>
                  <span className="text-[11px] font-bold text-[#70D7FF] flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-[#70D7FF]" />
                    ĐẤU TRƯỜNG TÀI NĂNG
                  </span>
                  <span className="text-[9.5px] text-[#C4D5E8] block mt-0.5 truncate">
                    Vòng Groundbreaking – Khẳng định dấu ấn riêng
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

        <h2 className="font-serif-display text-3xl sm:text-4xl text-white mb-3 tracking-tight">
          WE ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">HMC</span>
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#E2EBF6] leading-relaxed mb-3 max-w-md px-1 text-justify">
          <strong>HUFLIT MUSIC CLUB (HMC)</strong> là Câu lạc bộ Âm nhạc trực thuộc Hội Sinh viên Trường Đại học Ngoại ngữ – Tin học TP.HCM (HUFLIT), nơi kết nối những người trẻ có chung niềm đam mê âm nhạc, nghệ thuật biểu diễn và khát khao tỏa sáng trên sân khấu.
        </p>

        <p className="font-sans text-xs sm:text-sm text-[#91A4BB] leading-relaxed mb-5 max-w-md px-1 text-justify">
          Không chỉ nuôi dưỡng tình yêu âm nhạc, HMC còn là môi trường để mỗi thành viên khám phá tiềm năng, phát triển bản thân và thể hiện cá tính qua từng màn trình diễn. Với HMC, mỗi sân khấu là cơ hội để thử sức, mỗi tiết mục là một câu chuyện được kể bằng âm nhạc, cùng nhau tạo nên những trải nghiệm nghệ thuật sáng tạo, giàu cảm xúc và mang đậm dấu ấn riêng.
        </p>

        {/* Mobile Badges */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-6">
          <div className="p-2.5 rounded-xl bg-[#09172B]/90 border border-[#70D7FF]/30 flex items-center gap-2 text-left">
            <Users className="w-4 h-4 text-[#70D7FF] shrink-0" />
            <span className="text-[11px] font-bold text-white">Trực thuộc HSV HUFLIT</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#09172B]/90 border border-[#FFB45C]/40 flex items-center gap-2 text-left">
            <Music className="w-4 h-4 text-[#FFB45C] shrink-0" />
            <span className="text-[11px] font-bold text-white">Khám phá &amp; Tỏa sáng</span>
          </div>
        </div>

        {/* Clean Responsive 3-Photo Showcase for Mobile */}
        <div className="w-full space-y-3">
          {/* Main Photo 1 */}
          <div className="rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.85)] border border-[#70D7FF]/35 aspect-[16/10] bg-[#0A1A2F] relative group">
            <img
              src="/assets/music-club/scene-02-about/hmc_family_graduation.jpg"
              alt="Gia đình HMC"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-3">
              <span className="text-[11px] font-medium text-white flex items-center gap-1.5 text-left">
                <HeartHandshake className="w-3.5 h-3.5 text-[#FFB45C] shrink-0" />
                Gia đình HMC
              </span>
            </div>
          </div>

          {/* Side-by-side Photo 2 & 3 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.85)] border border-[#FFB45C]/40 aspect-[4/3] bg-[#0A1A2F] relative">
              <img
                src="/assets/music-club/scene-02-about/hmc_50_nam_ban_hung_ca.jpg"
                alt="50 năm tự hào bản hùng ca HUFLIT"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/30 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-[#FFB45C] truncate flex items-center gap-1">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  Bản Hùng Ca HUFLIT
                </span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.85)] border border-[#70D7FF]/35 aspect-[4/3] bg-[#0A1A2F] relative">
              <img
                src="/assets/music-club/scene-02-about/hmc_dau_truong_tai_nang.jpg"
                alt="Đấu Trường Tài Năng HUFLIT"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/30 to-transparent flex items-end p-2">
                <span className="text-[10px] font-bold text-[#70D7FF] truncate flex items-center gap-1">
                  <Music className="w-3 h-3 shrink-0" />
                  Đấu Trường Tài Năng
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
