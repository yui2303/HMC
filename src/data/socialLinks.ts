export interface ContactInfo {
  email: string
  facebook: {
    handle: string
    url: string
  }
  instagram: {
    handle: string
    url: string
  }
  tiktok: {
    handle: string
    url: string
  }
  location: string
  clubName: string
  establishedYear: string
  memberCount: string
  eventCount: string
  performanceCount: string
}

export interface RecruitmentScheduleItem {
  date: string
  label: string
  sessions: Array<{
    session: string
    time: string
  }>
}

export interface RecruitmentData {
  title: string
  registrationTime: {
    start: string
    end: string
    label: string
  }
  castingSchedule: RecruitmentScheduleItem[]
  location: string
  targetAudience: string
  format: string
  divisions: Array<{
    id: 'vocal' | 'dancer' | 'traditional_dance'
    name: string
    englishName: string
    desc: string
  }>
}

export const recruitmentInfo: RecruitmentData = {
  title: "Thời gian Tuyển CTV – CLB Âm nhạc HUFLIT",
  registrationTime: {
    start: "19g00 ngày 11/10/2026",
    end: "21g00 ngày 04/11/2026",
    label: "Từ 19g00 ngày 11/10/2026 đến 21g00 ngày 04/11/2026",
  },
  castingSchedule: [
    {
      date: "06/11/2026",
      label: "Ngày 06/11/2026",
      sessions: [
        { session: "Buổi sáng", time: "09g00 – 12g00" },
        { session: "Buổi chiều", time: "13g30 – 20g00" },
      ],
    },
    {
      date: "07/11/2026",
      label: "Ngày 07/11/2026",
      sessions: [
        { session: "Buổi sáng", time: "09g00 – 12g00" },
        { session: "Buổi chiều", time: "13g30 – 17g00" },
      ],
    },
  ],
  location: "Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT)",
  targetAudience: "Sinh viên đang theo học tại Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT)",
  format: "Casting và phỏng vấn trực tiếp tại địa điểm tổ chức",
  divisions: [
    {
      id: "vocal",
      name: "Hát",
      englishName: "Vocal",
      desc: "Một bài hát cá nhân (1–3 phút) và một bài hát bắt buộc khi tham gia casting (BGK chọn ngẫu nhiên 1 trong 3 bài: Linh thiêng Việt Nam, Khát vọng tuổi trẻ, Tàu anh qua núi – chuẩn bị trước ở nhà).",
    },
    {
      id: "dancer",
      name: "Nhảy",
      englishName: "Dance",
      desc: "Chuẩn bị một bài nhảy 1–3 phút thể hiện kỹ thuật và làm chủ sân khấu.",
    },
    {
      id: "traditional_dance",
      name: "Múa",
      englishName: "Dance / Contemporary",
      desc: "Chuẩn bị một bài múa 1–3 phút thể hiện sự dẻo dai, kỹ thuật hình thể và cảm xúc.",
    },
  ],
}

export const clubData: ContactInfo = {
  clubName: "Huflit Music Club",
  establishedYear: "2020",
  memberCount: "50+",
  eventCount: "20+",
  performanceCount: "100+",
  email: "clbamnhac.huflit@gmail.com",
  facebook: {
    handle: "fb.com/huflitmusicclub",
    url: "https://www.facebook.com/huflitmusicclub",
  },
  instagram: {
    handle: "@clbamnhac.huflit",
    url: "https://instagram.com",
  },
  tiktok: {
    handle: "@clbamnhac.huflit",
    url: "https://tiktok.com",
  },
  location: "Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, Trường Đại học Ngoại ngữ – Tin học Thành phố Hồ Chí Minh (HUFLIT)",
}

export const navItems = [
  { label: "Trang chủ", href: "#hero" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Tuyển CTV", href: "#family" },
  { label: "Lịch Casting", href: "#casting-guide" },
]
