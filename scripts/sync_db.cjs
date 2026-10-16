const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'recruitment.db');
const db = new DatabaseSync(DB_PATH);

// Clean up fake test / corrupt dates if any
db.exec(`
  DELETE FROM applications WHERE id LIKE 'HMC-2026-00%' OR email LIKE '%@student.edu.vn';
`);

const targetPath = path.join(__dirname, '..', 'src', 'data', 'emailjsCandidates.ts');
const content = fs.readFileSync(targetPath, 'utf8');
const match = content.match(/export const EMAILJS_BACKFILLED_CANDIDATES: ApplicationItem\[\] = (\[[\s\S]*?\]);?\s*$/);
const candidates = JSON.parse(match[1]);

console.log('Syncing ' + candidates.length + ' candidates into recruitment.db...');

const upsertStmt = db.prepare(`
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
`);

let inserted = 0;
for (const app of candidates) {
  upsertStmt.run(
    app.id,
    app.fullName,
    app.email,
    app.studentId,
    app.castingDivision,
    app.castingSong,
    app.beatUrl,
    app.hasPerformanceExperience ? 1 : 0,
    app.performanceUrl || '',
    app.passion || '',
    app.status || 'new',
    app.adminNote || '',
    app.createdAt,
    app.updatedAt
  );
  inserted++;
}

console.log(`Successfully synced ${inserted} candidates.`);

const count = db.prepare('SELECT COUNT(*) as count FROM applications').get();
console.log('Total applications in recruitment.db:', count);

const top10 = db.prepare('SELECT id, full_name, student_id, casting_division, casting_song, created_at FROM applications ORDER BY created_at DESC LIMIT 10').all();
console.log('Top 10 candidates in DB:');
console.table(top10);
