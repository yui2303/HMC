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

  // Upsert/Seed all candidates from EmailJS backfilled list
  seedSampleApplications()
}

import { EMAILJS_BACKFILLED_CANDIDATES } from '../data/emailjsCandidates.ts'

function seedSampleApplications() {
  const insertStmt = db.prepare(`
    INSERT INTO applications (
      id, full_name, email, student_id, casting_division,
      casting_song, beat_url, has_performance_experience,
      performance_url, passion, status, admin_note,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      full_name = excluded.full_name,
      email = excluded.email,
      student_id = excluded.student_id,
      casting_division = excluded.casting_division,
      casting_song = excluded.casting_song,
      beat_url = excluded.beat_url,
      has_performance_experience = excluded.has_performance_experience,
      performance_url = excluded.performance_url,
      passion = excluded.passion,
      admin_note = CASE WHEN applications.admin_note IS NULL OR applications.admin_note = '' THEN excluded.admin_note ELSE applications.admin_note END,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at
  `)

  for (const app of EMAILJS_BACKFILLED_CANDIDATES) {
    insertStmt.run(
      app.id,
      app.fullName,
      app.email,
      app.studentId,
      app.castingDivision,
      app.castingSong,
      app.beatUrl,
      app.hasPerformanceExperience ? 1 : 0,
      app.performanceUrl,
      app.passion,
      app.status,
      app.adminNote,
      app.createdAt,
      app.updatedAt
    )
  }
}
