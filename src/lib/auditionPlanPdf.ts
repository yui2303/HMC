/**
 * HMC Audition Plan & Official Rules PDF Generator
 * Content synchronized with the official recruitment announcement of HUFLIT Music Club 2026 - 2027.
 * Designed with rich navy aesthetic matching the web application.
 */

export const AUDITION_PLAN_CONTENT = {
  title: 'KẾ HOẠCH TỔ CHỨC TUYỂN THÀNH VIÊN',
  club: 'CLB ÂM NHẠC HUFLIT (HUFLIT MUSIC CLUB)',
  academicYear: 'Năm học 2026 – 2027',
  registrationTime: 'Từ 19g00 ngày 11/10/2026 đến 21g00 ngày 04/11/2026.',
  castingSchedule: [
    {
      date: 'Ngày 06/11/2026',
      shifts: [
        'Buổi sáng: 09g00 – 12g00',
        'Buổi chiều: 13g30 – 20g00',
      ],
    },
    {
      date: 'Ngày 07/11/2026',
      shifts: [
        'Buổi sáng: 09g00 – 12g00',
        'Buổi chiều: 13g30 – 17g00',
      ],
    },
  ],
  location: 'Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT).',
  audience: 'Sinh viên đang theo học tại Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT).',
  format: 'Casting và phỏng vấn trực tiếp tại địa điểm tổ chức.',
  divisions: ['Hát', 'Nhảy', 'Múa'],
  contact: {
    email: 'clbamnhac.huflit@gmail.com',
    fanpage: 'https://www.facebook.com/huflitmusicclub',
    hotline: 'Trần Như Lệ - 0812622268 - Phó Chủ nhiệm CLB Âm nhạc HUFLIT',
  },
}

/**
 * Returns full standalone HTML markup of the Audition Plan & Rules document
 * Styled with web dark theme (#050D1A, #09172B, #70D7FF, #FFE082) and optimized for A4 PDF printing.
 */
export function getAuditionPlanHtml(candidateName?: string, candidateStudentId?: string, candidateDivision?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>HMC_Ke_Hoach_Tuyen_Thanh_Vien_2026_2027</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Fira+Code:wght@400;600&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #050D1A;
          color: #E2EBF6;
          line-height: 1.65;
          font-size: 13.5px;
          padding: 30px 20px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .no-print-toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(9, 23, 43, 0.95);
          backdrop-filter: blur(12px);
          color: #fff;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 99999;
          border-bottom: 1px solid rgba(112, 215, 255, 0.25);
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6);
        }

        .no-print-toolbar .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .no-print-toolbar .btn-group {
          display: flex;
          gap: 10px;
        }

        .btn-print {
          background: linear-gradient(135deg, #398BFF, #70D7FF);
          color: #031024;
          font-weight: 700;
          border: none;
          padding: 8px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 0 15px rgba(112, 215, 255, 0.4);
          transition: transform 0.15s ease;
        }

        .btn-print:hover {
          transform: translateY(-1px);
        }

        .btn-close {
          background: rgba(255, 255, 255, 0.08);
          color: #E2EBF6;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
        }

        .document-wrapper {
          max-width: 860px;
          margin: 60px auto 30px auto;
          background: linear-gradient(180deg, #09172B 0%, #061120 100%);
          border: 1px solid rgba(112, 215, 255, 0.25);
          border-radius: 20px;
          padding: 45px 50px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(57, 139, 255, 0.12);
          position: relative;
          overflow: hidden;
        }

        .document-wrapper::before {
          content: '';
          position: absolute;
          top: -150px;
          right: -150px;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(57, 139, 255, 0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid rgba(112, 215, 255, 0.3);
          padding-bottom: 20px;
          margin-bottom: 25px;
        }

        .header-left {
          text-align: center;
          width: 48%;
        }

        .header-left .school {
          font-size: 12px;
          font-weight: 600;
          color: #91A4BB;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-left .org {
          font-size: 13px;
          font-weight: 700;
          color: #70D7FF;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .header-left .divider {
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #70D7FF, transparent);
          margin: 6px auto;
        }

        .header-right {
          text-align: center;
          width: 48%;
        }

        .header-right .club-badge {
          display: inline-block;
          background: rgba(57, 139, 255, 0.15);
          border: 1px solid rgba(112, 215, 255, 0.4);
          color: #FFE082;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .header-right .club-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #FFFFFF;
          text-transform: uppercase;
        }

        .doc-title-block {
          text-align: center;
          margin: 25px 0 30px 0;
          padding: 15px 20px;
          background: rgba(57, 139, 255, 0.08);
          border: 1px solid rgba(112, 215, 255, 0.2);
          border-radius: 14px;
        }

        .doc-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 700;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          background: linear-gradient(135deg, #FFFFFF 30%, #70D7FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .doc-subtitle {
          font-size: 15px;
          font-weight: 600;
          color: #FFE082;
          margin-top: 4px;
        }

        .doc-year {
          font-size: 13px;
          font-weight: 500;
          color: #91A4BB;
          font-style: italic;
          margin-top: 2px;
        }

        ${
          candidateName
            ? `
        .candidate-welcome-box {
          background: rgba(112, 215, 255, 0.1);
          border: 1px solid rgba(112, 215, 255, 0.35);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .candidate-welcome-box .name {
          font-size: 15px;
          font-weight: 700;
          color: #70D7FF;
        }
        .candidate-welcome-box .mssv {
          font-size: 12.5px;
          color: #B8CDE5;
          font-family: 'Fira Code', monospace;
        }
        .candidate-welcome-box .badge {
          background: #398BFF;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 6px;
        }
        `
            : ''
        }

        /* SECTION STYLING */
        .section-box {
          margin-bottom: 28px;
          page-break-inside: auto;
        }

        .section-heading {
          font-size: 15px;
          font-weight: 700;
          color: #70D7FF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-left: 4px solid #398BFF;
          padding-left: 12px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .subsection-title {
          font-size: 14px;
          font-weight: 700;
          color: #FFE082;
          margin: 14px 0 8px 0;
        }

        .subsubsection-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 10px 0 6px 0;
        }

        p {
          margin-bottom: 8px;
          color: #D2DFEE;
        }

        ul, ol {
          margin: 8px 0 14px 22px;
        }

        li {
          margin-bottom: 6px;
          color: #D2DFEE;
        }

        .highlight-text {
          color: #FFFFFF;
          font-weight: 600;
        }

        .accent-cyan {
          color: #70D7FF;
          font-weight: 600;
        }

        .accent-gold {
          color: #FFE082;
          font-weight: 600;
        }

        /* SCHEDULE CARD */
        .schedule-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 12px 0 16px 0;
        }

        .schedule-card {
          background: rgba(5, 13, 26, 0.7);
          border: 1px solid rgba(112, 215, 255, 0.2);
          border-radius: 12px;
          padding: 14px 16px;
        }

        .schedule-card .date-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #70D7FF;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px dashed rgba(112, 215, 255, 0.2);
        }

        .schedule-card .shift-item {
          font-size: 12.5px;
          color: #E2EBF6;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* DIVISION BADGES */
        .divisions-container {
          display: flex;
          gap: 12px;
          margin: 10px 0 15px 0;
        }

        .div-pill {
          flex: 1;
          background: rgba(57, 139, 255, 0.12);
          border: 1px solid rgba(112, 215, 255, 0.3);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
          font-weight: 700;
          color: #FFFFFF;
          font-size: 13px;
        }

        /* SONG LIST BOX */
        .song-box {
          background: rgba(112, 215, 255, 0.06);
          border: 1px solid rgba(112, 215, 255, 0.25);
          border-radius: 12px;
          padding: 14px 18px;
          margin: 10px 0 14px 0;
        }

        .song-box .song-item {
          padding: 4px 0;
          color: #FFE082;
          font-weight: 600;
        }

        /* CONTACT CARD */
        .contact-card {
          background: rgba(9, 23, 43, 0.9);
          border: 1px solid rgba(112, 215, 255, 0.3);
          border-radius: 14px;
          padding: 18px 22px;
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #E2EBF6;
        }

        .contact-item .icon {
          font-size: 15px;
        }

        .contact-item a {
          color: #70D7FF;
          text-decoration: none;
        }

        .doc-signatures {
          margin-top: 35px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }

        .sig-col {
          text-align: center;
          width: 45%;
        }

        .sig-col .role {
          font-weight: 700;
          color: #FFFFFF;
          font-size: 13px;
          text-transform: uppercase;
        }

        .sig-col .date {
          font-size: 12px;
          font-style: italic;
          color: #91A4BB;
          margin-bottom: 50px;
        }

        .sig-col .name {
          font-weight: 700;
          color: #FFE082;
          border-top: 1px dotted rgba(255, 255, 255, 0.3);
          padding-top: 6px;
          display: inline-block;
          min-width: 170px;
        }

        /* PRINT STYLES */
        @media print {
          .no-print-toolbar {
            display: none !important;
          }

          body {
            background: #050D1A !important;
            color: #E2EBF6 !important;
            padding: 0 !important;
          }

          .document-wrapper {
            margin: 0 !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 12mm 15mm !important;
          }

          .section-box {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm 10mm;
          }
        }
      </style>
    </head>
    <body>
      <!-- Top Action Toolbar for Print/Download -->
      <div class="no-print-toolbar">
        <div class="brand">
          <strong style="color: #70D7FF;">HUFLIT MUSIC CLUB (HMC)</strong>
          <span style="font-size: 12px; color: #91A4BB;">— Kế hoạch Tuyển Thành Viên 2026 - 2027</span>
        </div>
        <div class="btn-group">
          <button class="btn-print" onclick="window.print()">🖨️ In hoặc Tải File PDF</button>
          <button class="btn-close" onclick="window.close()">Đóng</button>
        </div>
      </div>

      <div class="document-wrapper">
        <!-- HEADER -->
        <div class="doc-header">
          <div class="header-left">
            <div class="school">TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – TIN HỌC TP.HCM</div>
            <div class="org">ĐOÀN THANH NIÊN – HỘI SINH VIÊN</div>
            <div class="divider"></div>
          </div>
          <div class="header-right">
            <div class="club-badge">CLB ÂM NHẠC HUFLIT</div>
            <div class="club-title">HUFLIT MUSIC CLUB (HMC)</div>
          </div>
        </div>

        <!-- TITLE BLOCK -->
        <div class="doc-title-block">
          <div class="doc-title">KẾ HOẠCH TỔ CHỨC TUYỂN THÀNH VIÊN</div>
          <div class="doc-subtitle">CLB ÂM NHẠC HUFLIT</div>
          <div class="doc-year">Năm học 2026 – 2027</div>
        </div>

        ${
          candidateName
            ? `
        <!-- CANDIDATE CONFIRMATION BADGE -->
        <div class="candidate-welcome-box">
          <div>
            <div class="name">KÍNH GỬI THÍ SINH: ${candidateName.toUpperCase()}</div>
            <div class="mssv">Mã số sinh viên: <strong>${candidateStudentId || 'N/A'}</strong> | Mảng: <strong>${candidateDivision || 'N/A'}</strong></div>
          </div>
          <div class="badge">ĐÃ XÁC NHẬN ĐĂNG KÝ</div>
        </div>
        `
            : ''
        }

        <!-- I. THÔNG TIN CHUNG -->
        <div class="section-box">
          <div class="section-heading">I. THÔNG TIN CHUNG</div>

          <div class="subsection-title">1. Mục đích và yêu cầu</div>
          
          <div class="subsubsection-title">1.1. Mục đích</div>
          <ul>
            <li>Tuyển chọn Cộng tác viên (CTV) cho CLB Âm nhạc HUFLIT trong năm học 2026 – 2027.</li>
            <li>Tìm kiếm những sinh viên có năng khiếu, tinh thần trách nhiệm và phù hợp với định hướng hoạt động của CLB.</li>
            <li>Tạo môi trường để sinh viên HUFLIT có cơ hội phát triển năng khiếu, kỹ năng biểu diễn và làm việc tập thể trong lĩnh vực âm nhạc.</li>
            <li>Xây dựng lực lượng CTV có khả năng tham gia và đồng hành cùng các hoạt động của CLB trong thời gian tới.</li>
          </ul>

          <div class="subsubsection-title">1.2. Yêu cầu</div>
          <ul>
            <li>Đảm bảo công tác tuyển chọn được thực hiện công khai, và phù hợp với định hướng hoạt động của CLB.</li>
            <li>Nội dung Casting được xây dựng phù hợp với đặc thù của từng lĩnh vực tuyển chọn.</li>
            <li>Đảm bảo quá trình Casting diễn ra nghiêm túc, công bằng và đúng thời gian quy định.</li>
          </ul>

          <div class="subsection-title">2. Thời gian, địa điểm và đối tượng</div>

          <p><span class="accent-cyan">2.1. Thời gian đăng ký:</span> Từ <strong class="highlight-text">19g00 ngày 11/10/2026</strong> đến <strong class="highlight-text">21g00 ngày 04/11/2026</strong>.</p>
          <p><span class="accent-cyan">Thời gian Casting chính thức:</span></p>

          <div class="schedule-grid">
            <div class="schedule-card">
              <div class="date-title">📅 Ngày 06/11/2026</div>
              <div class="shift-item">• <strong>Buổi sáng:</strong> 09g00 – 12g00</div>
              <div class="shift-item">• <strong>Buổi chiều:</strong> 13g30 – 20g00</div>
            </div>

            <div class="schedule-card">
              <div class="date-title">📅 Ngày 07/11/2026</div>
              <div class="shift-item">• <strong>Buổi sáng:</strong> 09g00 – 12g00</div>
              <div class="shift-item">• <strong>Buổi chiều:</strong> 13g30 – 17g00</div>
            </div>
          </div>

          <p><span class="accent-cyan">2.2. Địa điểm:</span> <strong class="highlight-text">Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh</strong>, Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT).</p>
          <p><span class="accent-cyan">2.3. Đối tượng tham gia:</span> Sinh viên đang theo học tại Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT).</p>
          <p><span class="accent-cyan">2.4. Hình thức:</span> Casting và phỏng vấn trực tiếp tại địa điểm tổ chức.</p>
          <p><span class="accent-cyan">2.5. Các lĩnh vực tuyển chọn:</span></p>

          <div class="divisions-container">
            <div class="div-pill">🎤 MẢNG HÁT (VOCAL)</div>
            <div class="div-pill">⚡ MẢNG NHẢY (DANCE)</div>
            <div class="div-pill">🌸 MẢNG MÚA (TRADITIONAL / CONTEMPORARY)</div>
          </div>
        </div>

        <!-- II. YÊU CẦU ĐỐI VỚI THÍ SINH -->
        <div class="section-box">
          <div class="section-heading">II. YÊU CẦU ĐỐI VỚI THÍ SINH</div>
          <p>Thí sinh tham gia Casting cần thực hiện đầy đủ các yêu cầu sau:</p>
          <ol>
            <li><strong>Có mặt tại địa điểm Casting trước giờ được thông báo ít nhất 30 phút</strong> để thực hiện check-in và chuẩn bị.</li>
            <li>Thực hiện check-in tại khu vực được Ban Tổ chức bố trí.</li>
            <li>Chuẩn bị đầy đủ nội dung Casting theo yêu cầu của lĩnh vực đã đăng ký.</li>
            <li>Chủ động chuẩn bị các thiết bị, nhạc nền (beat), đạo cụ hoặc vật dụng cần thiết cho phần Casting (nếu có).</li>
            <li>Tuân thủ sự hướng dẫn và điều phối của Ban Tổ chức trong suốt quá trình Casting.</li>
            <li>Có thái độ nghiêm túc, lịch sự và tôn trọng BGK, thành viên CLB và các thí sinh khác.</li>
            <li>Đảm bảo giữ gìn vệ sinh, tài sản và cơ sở vật chất tại khu vực Casting.</li>
          </ol>
        </div>

        <!-- III. NỘI DUNG VÀ THỂ LỆ CASTING -->
        <div class="section-box">
          <div class="section-heading">III. NỘI DUNG VÀ THỂ LỆ CASTING</div>

          <div class="subsection-title">Điều 1. Đăng ký tham gia Casting</div>
          <p>Thí sinh đăng ký Casting thông qua Form đăng ký chính thức của CLB.</p>
          <p>• Thời gian mở đăng ký: <strong class="highlight-text">19g00 ngày 11/10/2026</strong></p>
          <p>• Thời gian đóng đăng ký: <strong class="highlight-text">21g00 ngày 04/11/2026</strong></p>
          <p><em>*Hình thức đăng ký nhiều lĩnh vực:</em> Thí sinh được phép đăng ký nhiều lĩnh vực. Đối với mỗi lĩnh vực đăng ký, thí sinh cần thực hiện một lần đăng ký riêng (Ví dụ: Thí sinh đăng ký cả Hát và Nhảy → thực hiện 02 lần đăng ký tương ứng với từng lĩnh vực).</p>

          <div class="subsection-title">Điều 2. Nội dung Casting chi tiết</div>
          <p>Thí sinh thực hiện Casting theo nội dung tương ứng với lĩnh vực đã đăng ký:</p>

          <div class="subsubsection-title">2.1. LĨNH VỰC HÁT (VOCAL)</div>
          <ul>
            <li>
              <strong>Phần 1 – Trình diễn tiết mục tự chọn:</strong>
              <br />• Nội dung: Thí sinh trình diễn một tiết mục hát do bản thân lựa chọn.
              <br />• Thời lượng: Tối đa 01 – 03 phút.
              <br />• Hình thức: Hát trên beat hoặc hát chay.
            </li>
            <li>
              <strong>Phần 2 – Tiết mục bắt buộc:</strong>
              <br />Thí sinh cần chuẩn bị <strong>03 bài hát</strong> sau:
              <div class="song-box">
                <div class="song-item">1. “Khát vọng tuổi trẻ”</div>
                <div class="song-item">2. “Linh thiêng Việt Nam”</div>
                <div class="song-item">3. “Tàu anh qua núi”</div>
              </div>
              <em>Ban Giám khảo sẽ lựa chọn ngẫu nhiên 01 trong 03 bài hát trên để yêu cầu thí sinh trình bày tại buổi casting (Hình thức: Hát chay).</em>
            </li>
            <li>
              <strong>Phần 3 – Phỏng vấn:</strong> Thí sinh tham gia trao đổi ngắn với BGK Casting.
            </li>
          </ul>

          <div class="subsubsection-title">2.2. LĨNH VỰC NHẢY / MÚA</div>
          <ul>
            <li>
              <strong>Phần 1 – Trình diễn tiết mục tự chọn:</strong>
              <br />• Nội dung: Thí sinh trình diễn tiết mục nhảy/múa do bản thân lựa chọn.
              <br />• Thể loại: Tự do.
              <br />• Thời lượng: Tối đa 01 – 03 phút.
              <br />• Hình thức: Nhảy / Múa trên nhạc nền chuẩn bị trước.
            </li>
            <li>
              <strong>Phần 2 – Freestyle:</strong> Thí sinh thực hiện phần Freestyle theo yêu cầu và giai điệu ngẫu nhiên từ BGK.
            </li>
            <li>
              <strong>Phần 3 – Phỏng vấn:</strong> Thí sinh tham gia trao đổi ngắn cùng BGK Casting.
            </li>
          </ul>

          <div class="subsection-title">Điều 3. Quy định về thời lượng</div>
          <ol>
            <li>Thời lượng tối đa cho phần trình diễn của mỗi thí sinh: <strong>01 – 03 phút</strong>.</li>
            <li>Thí sinh cần chủ động chuẩn bị và đảm bảo tiết mục nằm trong thời lượng quy định.</li>
            <li>Trong trường hợp thí sinh vượt quá thời lượng cho phép, Ban Casting có quyền kết thúc phần trình diễn.</li>
          </ol>

          <div class="subsection-title">Điều 4. Quyền lợi Cộng tác viên (CTV)</div>
          <p>• Được cấp <strong>Điểm rèn luyện</strong> theo quy định của Đoàn trường – Hội Sinh viên HUFLIT.</p>
          <p>• Cơ hội tham gia tập luyện chuyên môn, biểu diễn tại các sự kiện âm nhạc quy mô lớn của trường và các chương trình giao lưu bên ngoài.</p>

          <div class="subsection-title">Điều 5. Thay đổi lịch Casting</div>
          <p>Trong trường hợp không thể tham gia Casting vào thời gian đã đăng ký trước đó, thí sinh cần chủ động thông báo cho Ban Tổ chức.</p>
          <p>• <strong>Thời hạn thông báo trước:</strong> <span class="accent-gold">Ít nhất 24 tiếng</span> trước giờ đăng ký Casting.</p>
          <p>• <strong>Kênh liên hệ hỗ trợ:</strong></p>
          <ul>
            <li>Fanpage: <a href="https://www.facebook.com/huflitmusicclub" target="_blank" style="color: #70D7FF;">fb.com/huflitmusicclub</a></li>
            <li>Email: <a href="mailto:clbamnhac.huflit@gmail.com" style="color: #70D7FF;">clbamnhac.huflit@gmail.com</a></li>
          </ul>
          <p><em>*Việc thay đổi lịch Casting sẽ được Ban Tổ chức xem xét và sắp xếp tùy theo tình hình thực tế.</em></p>
        </div>

        <!-- IV. LƯU Ý -->
        <div class="section-box">
          <div class="section-heading">IV. LƯU Ý QUAN TRỌNG</div>
          <ol>
            <li>Thí sinh có trách nhiệm đọc kỹ toàn bộ nội dung và thể lệ trước khi tham gia Casting.</li>
            <li>Việc hoàn tất biểu mẫu đăng ký đồng nghĩa với việc thí sinh xác nhận đã đọc, hiểu và đồng ý với các quy định của đợt Casting.</li>
            <li>Thí sinh chịu trách nhiệm về nội dung tiết mục, nhạc nền, đạo cụ và các vật dụng cá nhân sử dụng trong quá trình Casting.</li>
            <li>Thí sinh phải tuân thủ hướng dẫn của Ban Tổ chức và BGK trong suốt quá trình tham gia.</li>
            <li>Ban Tổ chức có quyền điều phối thứ tự và thời gian Casting phù hợp với tình hình thực tế, đồng thời thông báo đến thí sinh khi có thay đổi liên quan.</li>
          </ol>
        </div>

        <!-- V. THÔNG TIN LIÊN HỆ -->
        <div class="section-box">
          <div class="section-heading">V. THÔNG TIN LIÊN HỆ CHÍNH THỨC</div>
          
          <div class="contact-card">
            <div class="contact-item">
              <span class="icon">📩</span>
              <div><strong>Email:</strong> <a href="mailto:clbamnhac.huflit@gmail.com">clbamnhac.huflit@gmail.com</a></div>
            </div>
            <div class="contact-item">
              <span class="icon">📱</span>
              <div><strong>Fanpage chính thức:</strong> <a href="https://www.facebook.com/huflitmusicclub" target="_blank">https://www.facebook.com/huflitmusicclub</a></div>
            </div>
            <div class="contact-item">
              <span class="icon">☎️</span>
              <div><strong>Hotline hỗ trợ:</strong> <span class="accent-gold">Trần Như Lệ - 0812622268</span> (Phó Chủ nhiệm CLB Âm nhạc HUFLIT)</div>
            </div>
          </div>

          <p style="margin-top: 15px; font-style: italic; text-align: center; color: #91A4BB;">
            Mọi thắc mắc liên quan đến Casting, vui lòng liên hệ thông qua các kênh liên hệ chính thức nêu trên.
          </p>
        </div>

        <!-- SIGNATURE -->
        <div class="doc-signatures">
          <div class="sig-col">
            <div class="role">ĐOÀN HỘI TRƯỜNG HUFLIT</div>
            <div class="date">Đã phê duyệt</div>
            <div class="name">Đoàn TN – Hội SV HUFLIT</div>
          </div>

          <div class="sig-col">
            <div class="role">BAN CHỦ NHIỆM CLB ÂM NHẠC</div>
            <div class="date">TP. Hồ Chí Minh, Tháng 10/2026</div>
            <div class="name">HUFLIT MUSIC CLUB</div>
          </div>
        </div>
      </div>

      <script>
        // Auto trigger print when requested
        if (window.location.search.includes('print=true')) {
          window.addEventListener('load', () => {
            setTimeout(() => window.print(), 400);
          });
        }
      </script>
    </body>
    </html>
  `
}

/**
 * Opens a print-ready window with the Audition Plan PDF styled with the web application theme.
 */
export function exportAuditionPlanPdf(candidateName?: string, candidateStudentId?: string, candidateDivision?: string): void {
  const printWindow = window.open('', '_blank', 'width=950,height=900')
  if (!printWindow) {
    alert('Trình duyệt đang chặn cửa sổ pop-up. Vui lòng cho phép pop-up để xem và tải file PDF thể lệ.')
    return
  }

  const html = getAuditionPlanHtml(candidateName, candidateStudentId, candidateDivision)
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}
