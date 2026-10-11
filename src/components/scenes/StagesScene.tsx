import React, { useRef } from 'react'
import { Sparkles, Trophy, Star, Award, Flame, Music, CheckCircle2 } from 'lucide-react'

interface StagesSceneProps {
  onOpenRegister?: () => void
}

export const StagesScene: React.FC<StagesSceneProps> = () => {
  const sceneRef = useRef<HTMLElement>(null)

  return (
    <section
      id="stages"
      ref={sceneRef}
      className="relative w-full min-h-0 lg:min-h-[960px] pt-12 sm:pt-16 lg:pt-[12vh] pb-12 lg:pb-16 overflow-visible select-none bg-transparent"
    >
      {/* LAYER 1: Ambient Background & Stage Spotlight Gradients */}
      <div
        className="stages-bg absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 25%, black 85%, rgba(0,0,0,0.4) 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 25%, black 85%, rgba(0,0,0,0.4) 95%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-02-about/background.png"
          alt="Concert Stages Background"
          className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.1]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050D1A]/95 via-[#07172C]/75 to-[#050D1A]/95" />
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#398BFF]/10 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#FFB45C]/10 blur-[130px]" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (lg screens)                                               */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative z-20 w-full max-w-[1540px] mx-auto px-[5vw] xl:px-[6vw]">
        <div className="grid grid-cols-12 gap-8 xl:gap-12 items-start">
          
          {/* LEFT COLUMN: DẤU ẤN & THÀNH TÍCH (Col span 7) */}
          <div className="col-span-7 flex flex-col text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="w-8 h-[1px] bg-[#FFB45C]/80" />
              <span className="text-xs tracking-[0.35em] text-[#FFB45C] font-semibold uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FFB45C]" />
                STAGES &amp; ACHIEVEMENTS • HMC JOURNEY
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif-display text-4xl xl:text-5xl text-white tracking-tight leading-[1.08] mb-3">
              <span>DẤU ẤN TRÊN </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB45C] via-[#FFE082] to-[#70D7FF]">
                NHỮNG SÂN KHẤU
              </span>
            </h2>

            {/* Lead description */}
            <p className="font-sans text-xs xl:text-sm text-[#C4D5E8] leading-relaxed mb-4">
              Hành trình của HMC được ghi dấu qua nhiều hoạt động biểu diễn và thành tích nổi bật:
            </p>

            {/* ACHIEVEMENTS CARDS CONTAINER */}
            <div className="space-y-3 w-full mb-4">
              {/* 1. ĐÊM NHẠC BLOOMING BRAVERY */}
              <div className="p-3.5 rounded-2xl bg-[#09172B]/85 border border-[#70D7FF]/30 hover:border-[#70D7FF]/60 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.45)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#3C96FF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Đêm nhạc BLOOMING BRAVERY
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#70D7FF]/15 text-[#70D7FF] border border-[#70D7FF]/30">
                        Thường niên HMC
                      </span>
                    </h3>
                    <p className="text-xs text-[#91A4BB] leading-relaxed mt-1">
                      Chương trình âm nhạc thường niên do HMC tổ chức, nơi hội tụ những cá tính nghệ thuật và tinh thần dám thử sức, dám bứt phá.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. CONCERT ANH TRAI VƯỢT NGÀN CHÔNG GAI */}
              <div className="p-3.5 rounded-2xl bg-[#09172B]/85 border border-[#398BFF]/35 hover:border-[#398BFF]/70 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.45)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#398BFF]/25 border border-[#398BFF]/50 flex items-center justify-center text-[#70D7FF] shrink-0 mt-0.5">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Concert Anh Trai Vượt Ngàn Chông Gai 2025
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#398BFF]/20 text-[#70D7FF] border border-[#398BFF]/40">
                        Day 3 &amp; Day 4 HCM
                      </span>
                    </h3>
                    <p className="text-xs text-[#91A4BB] leading-relaxed mt-1">
                      Cộng tác viên biểu diễn tại Concert Anh Trai Vượt Ngàn Chông Gai 2025 – Day 3 &amp; Day 4, TP.HCM.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. GIẢI VÀNG 50 NĂM TỰ HÀO BẢN HÙNG CA HUFLIT */}
              <div className="p-3.5 rounded-2xl bg-[#09172B]/90 border border-[#FFB45C]/40 hover:border-[#FFB45C]/75 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFB45C]/20 border border-[#FFB45C]/50 flex items-center justify-center text-[#FFB45C] shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#FFB45C] flex items-center gap-2">
                      Giải Vàng Cuộc thi “50 năm tự hào bản hùng ca HUFLIT”
                    </h3>
                    <p className="text-xs text-[#C4D5E8] mt-1 mb-2">
                      Cùng bảng thành tích xuất sắc tại các hạng mục thi đấu:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-[#E1ECF7]">
                      <li className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB45C] shrink-0" />
                        <span><strong>Giải Nhất</strong> Tốp ca</span>
                      </li>
                      <li className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB45C] shrink-0" />
                        <span><strong>Giải Nhất</strong> Múa độc lập</span>
                      </li>
                      <li className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#70D7FF] shrink-0" />
                        <span><strong>Giải Ba</strong> Song/Tam/Tứ ca</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. LIÊN HOAN YOUTH FEST 2026 */}
              <div className="p-3.5 rounded-2xl bg-[#09172B]/85 border border-[#70D7FF]/35 hover:border-[#70D7FF]/65 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.45)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#70D7FF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Liên hoan Nhóm nhảy toàn thành 2026 – Youth Fest 2026
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFB45C]/20 text-[#FFB45C] border border-[#FFB45C]/40">
                        Giải Ba
                      </span>
                    </h3>
                    <p className="text-xs text-[#91A4BB] leading-relaxed mt-1">
                      Giải Ba tại Liên hoan các Câu lạc bộ, Đội, Nhóm nhảy toàn thành năm 2026 - Youth Fest 2026.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Closing statement paragraph */}
            <p className="font-sans text-xs xl:text-sm text-[#91A4BB] leading-relaxed border-l-2 border-[#70D7FF]/50 pl-3.5 italic bg-[#0A1A2F]/40 py-2 rounded-r-xl">
              Với tinh thần không ngừng học hỏi, sáng tạo và chinh phục những giới hạn mới, HMC vẫn đang tiếp tục hành trình đưa âm nhạc đến gần hơn với cộng đồng sinh viên, đồng thời tạo nên một môi trường để những tài năng trẻ được kết nối, trưởng thành và tự tin thể hiện dấu ấn của mình.
            </p>
          </div>

          {/* RIGHT COLUMN: 3-PHOTO COLLAGE (Col span 5 - 3 ảnh sân khấu / giải thưởng của scene 2 cũ) */}
          <div className="col-span-5 relative min-h-[580px] xl:min-h-[620px] pointer-events-auto">
            {/* Photo 1: CTV Concert ATVNCG (Top) */}
            <div
              className="stages-photo-1 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
              style={{
                left: '8%',
                top: '0%',
                width: '84%',
                transform: 'rotate(-1.5deg)',
                zIndex: 5,
              }}
            >
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(57,139,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2] relative group">
                <img
                  src="/assets/music-club/scene-02-about/hmc_ctv_concert_atvncg.jpg"
                  alt="Cộng tác viên biểu diễn tại Concert Anh Trai Vượt Ngàn Chông Gai 2025 – Day 3 & Day 4 HCM"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-3.5">
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-[#FFB45C]" />
                      CONCERT ANH TRAI VƯỢT NGÀN CHÔNG GAI 2025
                    </span>
                    <span className="text-[10px] text-[#C4D5E8] block mt-0.5">
                      CTV biểu diễn tại Concert ATVNCG – Day 3 &amp; Day 4 TP.HCM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo 2: Lễ trao giải - Giải Vàng (Left bottom) */}
            <div
              className="stages-photo-2 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
              style={{
                left: '0%',
                top: '46%',
                width: '60%',
                transform: 'rotate(-2.5deg)',
                zIndex: 7,
              }}
            >
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,180,92,0.25)] border border-[#FFB45C]/45 aspect-[3/2] relative group">
                <img
                  src="/assets/music-club/scene-02-about/club_award_gold.jpg"
                  alt="Giải Vàng Chung Cuộc"
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
                      Bản hùng ca HUFLIT – Nhất Tốp ca, Nhất Múa
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo 3: Youth Fest (Right bottom) */}
            <div
              className="stages-photo-3 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
              style={{
                left: '46%',
                top: '52%',
                width: '58%',
                transform: 'rotate(2.5deg)',
                zIndex: 8,
              }}
            >
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(57,139,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2] relative group">
                <img
                  src="/assets/music-club/scene-02-about/club_youth_fest.jpg"
                  alt="Youth Fest 2026"
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
                      Giải Ba Nhóm nhảy toàn thành
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET LAYOUT (< lg)                                             */}
      {/* ========================================================================= */}
      <div className="lg:hidden relative z-20 max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-[1px] bg-[#FFB45C]" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#FFB45C] font-semibold uppercase flex items-center gap-1.5">
            <Flame className="w-3 h-3" />
            STAGES &amp; ACHIEVEMENTS
          </span>
          <span className="w-5 h-[1px] bg-[#FFB45C]" />
        </div>

        {/* Heading */}
        <h2 className="font-serif-display text-2xl sm:text-3xl text-white mb-2.5 tracking-tight">
          DẤU ẤN TRÊN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB45C] via-[#FFE082] to-[#70D7FF]">NHỮNG SÂN KHẤU</span>
        </h2>

        {/* Lead */}
        <p className="font-sans text-xs sm:text-sm text-[#C4D5E8] leading-relaxed mb-4 max-w-md px-1">
          Hành trình của HMC được ghi dấu qua nhiều hoạt động biểu diễn và thành tích nổi bật:
        </p>

        {/* Mobile Achievement Cards */}
        <div className="w-full space-y-2.5 mb-5 text-left">
          {/* Card 1: Blooming Bravery */}
          <div className="p-3 rounded-xl bg-[#09172B]/90 border border-[#70D7FF]/30">
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#70D7FF]" />
              <span>Đêm nhạc BLOOMING BRAVERY</span>
            </div>
            <p className="text-[11px] text-[#C4D5E8] leading-relaxed">
              Chương trình âm nhạc thường niên do HMC tổ chức, nơi hội tụ những cá tính nghệ thuật và tinh thần dám thử sức, dám bứt phá.
            </p>
          </div>

          {/* Card 2: Concert ATVNCG */}
          <div className="p-3 rounded-xl bg-[#09172B]/90 border border-[#398BFF]/35">
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-white">
              <Star className="w-3.5 h-3.5 text-[#70D7FF]" />
              <span>Concert Anh Trai Vượt Ngàn Chông Gai 2025</span>
            </div>
            <p className="text-[11px] text-[#C4D5E8] leading-relaxed">
              Cộng tác viên biểu diễn tại Concert Anh Trai Vượt Ngàn Chông Gai 2025 – Day 3 &amp; Day 4, TP.HCM.
            </p>
          </div>

          {/* Card 3: Giải Vàng 50 năm */}
          <div className="p-3 rounded-xl bg-[#09172B]/90 border border-[#FFB45C]/40">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-[#FFB45C]">
              <Trophy className="w-3.5 h-3.5" />
              <span>Giải Vàng Cuộc thi “50 năm tự hào bản hùng ca HUFLIT”</span>
            </div>
            <ul className="text-[11px] text-[#E1ECF7] space-y-0.5 pl-1 mb-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C]" />
                <span><strong>Giải Nhất</strong> thể loại Tốp ca.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C]" />
                <span><strong>Giải Nhất</strong> thể loại Múa độc lập.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF]" />
                <span><strong>Giải Ba</strong> thể loại Song/Tam/Tứ ca.</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Youth Fest */}
          <div className="p-3 rounded-xl bg-[#09172B]/90 border border-[#70D7FF]/30">
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-[#70D7FF]">
              <Award className="w-3.5 h-3.5" />
              <span>Liên hoan Nhóm nhảy toàn thành – Youth Fest 2026</span>
            </div>
            <p className="text-[11px] text-[#C4D5E8] leading-relaxed">
              Giải Ba tại Liên hoan các Câu lạc bộ, Đội, Nhóm nhảy toàn thành năm 2026 - Youth Fest 2026.
            </p>
          </div>
        </div>

        {/* 3 Photos Mobile Showcase */}
        <div className="w-full space-y-3 mb-5">
          {/* Main Photo 1: CTV Concert ATVNCG */}
          <div className="rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.85)] border border-[#70D7FF]/35 aspect-[16/10] bg-[#0A1A2F] relative group">
            <img
              src="/assets/music-club/scene-02-about/hmc_ctv_concert_atvncg.jpg"
              alt="Cộng tác viên biểu diễn tại Concert Anh Trai Vượt Ngàn Chông Gai 2025"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A]/95 via-[#050D1A]/35 to-transparent flex items-end p-3">
              <span className="text-[11px] font-medium text-white flex items-center gap-1.5 text-left">
                <Star className="w-3.5 h-3.5 text-[#FFB45C] shrink-0" />
                Concert Anh Trai Vượt Ngàn Chông Gai 2025
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

        {/* Mobile Closing Statement */}
        <p className="font-sans text-xs text-[#91A4BB] leading-relaxed border-l-2 border-[#70D7FF]/50 pl-3 text-left italic bg-[#0A1A2F]/50 py-2.5 rounded-r-xl">
          Với tinh thần không ngừng học hỏi, sáng tạo và chinh phục những giới hạn mới, HMC vẫn đang tiếp tục hành trình đưa âm nhạc đến gần hơn với cộng đồng sinh viên, đồng thời tạo nên một môi trường để những tài năng trẻ được kết nối, trưởng thành và tự tin thể hiện dấu ấn của mình.
        </p>
      </div>
    </section>
  )
}
