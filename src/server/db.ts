import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { hashPassword } from './auth.ts'

const DATA_DIR = join(process.cwd(), 'data')
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

const DB_PATH = join(DATA_DIR, 'recruitment.db')

export const db = new DatabaseSync(DB_PATH)

// Initialize Tables & Indexes
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY(admin_id) REFERENCES admins(id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      student_id TEXT NOT NULL,
      casting_division TEXT NOT NULL,
      casting_song TEXT NOT NULL,
      beat_url TEXT NOT NULL,
      has_performance_experience INTEGER NOT NULL DEFAULT 0,
      performance_url TEXT DEFAULT '',
      passion TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      admin_note TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_apps_student_id ON applications(student_id);
    CREATE INDEX IF NOT EXISTS idx_apps_email ON applications(email);
    CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);
    CREATE INDEX IF NOT EXISTS idx_apps_division ON applications(casting_division);
    CREATE INDEX IF NOT EXISTS idx_apps_created_at ON applications(created_at);
  `)

  // Seed / Ensure Admin Accounts are present
  const adminAccounts = [
    { id: 'admin_hmc_01', email: 'admin@hmcmusic.club', password: 'HmcAdmin@2026' },
    { id: 'admin_hmc_02', email: 'clbamnhac.huflit@gmail.com', password: 'HmcAdmin@2026' },
    { id: 'admin_hmc_03', email: 'admin', password: 'HmcAdmin@2026' },
  ]

  for (const acc of adminAccounts) {
    const existingAdmin = db.prepare('SELECT id FROM admins WHERE LOWER(email) = ?').get(acc.email.toLowerCase())
    if (!existingAdmin) {
      const passwordHash = hashPassword(acc.password)
      const now = new Date().toISOString()
      db.prepare(`
        INSERT INTO admins (id, email, password_hash, created_at)
        VALUES (?, ?, ?, ?)
      `).run(acc.id, acc.email, passwordHash, now)
    }
  }

  // Seed Sample Recruitment Applications for rich Admin Experience if empty
  const appCount = db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number }
  if (appCount.count === 0) {
    seedSampleApplications()
  }
}

function seedSampleApplications() {
  const sampleApps = [
    {
      id: 'HMC-2026-001',
      fullName: 'Nguyễn Hoàng Minh',
      email: 'minh.nguyen@student.edu.vn',
      studentId: '23DH101234',
      castingDivision: 'vocal',
      castingSong: 'Linh thiêng Việt Nam',
      beatUrl: 'https://drive.google.com/file/d/1A2B3C4D_sample_beat/view',
      hasPerformanceExperience: 1,
      performanceUrl: 'https://youtube.com/watch?v=sample_minh_live',
      passion: 'Mình đam mê ca hát từ nhỏ và có 2 năm sinh hoạt văn nghệ tại trường THPT. Mình mong muốn được học hỏi thêm về kỹ thuật bè, hòa thanh và tỏa sáng trên các sân khấu lớn cùng đại gia đình HMC.',
      status: 'shortlisted',
      adminNote: 'Giọng nam trầm ấm, phát âm rõ chữ, rất tự tin trên sân khấu. Ưu tiên xếp lịch casting ca 1.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'HMC-2026-002',
      fullName: 'Trần Thảo Linh',
      email: 'linh.tt@student.edu.vn',
      studentId: '23DH202345',
      castingDivision: 'vocal',
      castingSong: 'Tàu anh qua núi',
      beatUrl: 'https://soundcloud.com/sample_tau_anh_qua_nui',
      hasPerformanceExperience: 1,
      performanceUrl: 'https://tiktok.com/@linh_vocals/video/123456789',
      passion: 'Âm nhạc là hơi thở của mình. Mình yêu thích các dòng nhạc truyền thống cách mạng kết hợp pop đương đại. Mong muốn mang giọng ca của mình hòa cùng dàn vocal đầy nhiệt huyết của HMC.',
      status: 'reviewing',
      adminNote: 'Cao độ tốt, xử lý nốt cao mượt mà. Cần kiểm tra kỹ năng đọc xướng âm.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'HMC-2026-003',
      fullName: 'Lê Quốc Bảo',
      email: 'bao.le@student.edu.vn',
      studentId: '24DH303456',
      castingDivision: 'dancer',
      castingSong: 'Supernova – aespa',
      beatUrl: 'https://drive.google.com/file/d/sample_dancer_track_1/view',
      hasPerformanceExperience: 1,
      performanceUrl: 'https://facebook.com/watch/?v=sample_dance_clip',
      passion: 'Mình chuyên về Urban Dance và Hiphop Choreography. Tham gia HMC là ước mơ ngay từ khi bước chân vào giảng đường đại học để cùng cháy hết mình trong các đêm diễn của trường.',
      status: 'accepted',
      adminNote: 'Kỹ thuật popping và bắt beat rất chuẩn. Năng lượng làm chủ sân khấu tuyệt vời.',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'HMC-2026-004',
      fullName: 'Phạm Quỳnh Như',
      email: 'quynhnhu.pham@student.edu.vn',
      studentId: '24DH404567',
      castingDivision: 'dancer',
      castingSong: 'Mantra – Jennie',
      beatUrl: 'https://youtube.com/watch?v=sample_dance_track_2',
      hasPerformanceExperience: 0,
      performanceUrl: '',
      passion: 'Em tự học nhảy qua các video K-Pop và dance cover. Tuy chưa có kinh nghiệm diễn sân khấu lớn nhưng em rất kiên trì, học vũ đạo nhanh và luôn sẵn sàng luyện tập cùng đội ngũ HMC.',
      status: 'new',
      adminNote: '',
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'HMC-2026-005',
      fullName: 'Vũ Đức Thịnh',
      email: 'thinh.vu@student.edu.vn',
      studentId: '22DH505678',
      castingDivision: 'vocal',
      castingSong: 'Khát vọng tuổi trẻ',
      beatUrl: 'https://drive.google.com/file/d/sample_khat_vong/view',
      hasPerformanceExperience: 0,
      performanceUrl: '',
      passion: 'Mình yêu ca hát và muốn thử thách bản thân ở môi trường câu lạc bộ chuyên nghiệp. HMC là nơi tràn đầy năng lượng và tình cảm anh em mà mình luôn tìm kiếm.',
      status: 'new',
      adminNote: '',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'HMC-2026-006',
      fullName: 'Đặng Mai Phương',
      email: 'phuong.dang@student.edu.vn',
      studentId: '23DH606789',
      castingDivision: 'vocal',
      castingSong: 'Ngày chưa giông bão',
      beatUrl: 'https://drive.google.com/file/d/sample_ngay_chua_giong_bao/view',
      hasPerformanceExperience: 1,
      performanceUrl: 'https://youtube.com/watch?v=sample_phuong_dan_ca',
      passion: 'Âm hưởng đương đại luôn là niềm đam mê lớn nhất của mình. Hy vọng có cơ hội cống hiến màu giọng đặc trưng này cho các tiết mục đặc sắc của CLB.',
      status: 'shortlisted',
      adminNote: 'Màu giọng dân ca ngọt ngào, cảm xúc rất sâu lắng.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'HMC-2026-007',
      fullName: 'Hoàng Yến Nhi',
      email: 'yennhi.hoang@student.edu.vn',
      studentId: '24DH707890',
      castingDivision: 'traditional_dance',
      castingSong: 'Múa Dân Gian – Cò Lả',
      beatUrl: 'https://youtube.com/watch?v=sample_mua_dan_gian',
      hasPerformanceExperience: 1,
      performanceUrl: 'https://tiktok.com/@yennhi_dance/video/987654321',
      passion: 'Em theo học múa dân gian và đương đại được 3 năm. Em muốn mang nét đẹp truyền thống kết hợp biểu diễn đương đại vào các sân khấu văn nghệ trẻ trung của HMC.',
      status: 'shortlisted',
      adminNote: 'Độ dẻo tốt, biểu cảm sân khấu xuất sắc. Rất tiềm năng cho ban Múa.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const insertStmt = db.prepare(`
    INSERT INTO applications (
      id, full_name, email, student_id, casting_division,
      casting_song, beat_url, has_performance_experience,
      performance_url, passion, status, admin_note,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const app of sampleApps) {
    insertStmt.run(
      app.id,
      app.fullName,
      app.email,
      app.studentId,
      app.castingDivision,
      app.castingSong,
      app.beatUrl,
      app.hasPerformanceExperience,
      app.performanceUrl,
      app.passion,
      app.status,
      app.adminNote,
      app.createdAt,
      app.createdAt
    )
  }
}
