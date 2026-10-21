const fs = require('fs');

// Read all candidates from src/data/emailjsCandidates.ts
const raw = fs.readFileSync('src/data/emailjsCandidates.ts', 'utf8');
const startIdx = raw.indexOf('= [') + 2;
const endIdx = raw.lastIndexOf(']');
const jsonStr = raw.substring(startIdx, endIdx + 1).trim();
const allCandidates = JSON.parse(jsonStr);

// Read current sheet
const sheetContent = fs.readFileSync('current_sheet.csv', 'utf8');

const getDivisionLabel = (div) => {
  switch (div) {
    case 'vocal': return 'Hát (Vocal)';
    case 'dancer': return 'Vũ đạo (Dancer)';
    case 'traditional_dance': return 'Múa Truyền Thống';
    default: return div;
  }
};

const formatRow = (stt, c) => {
  const dateFormatted = new Date(c.createdAt).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/,/, '');

  const escape = (val) => {
    if (val === undefined || val === null) return '';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const expLabel = c.hasPerformanceExperience ? 'Đã có' : 'Chưa có';
  const statusLabel = c.status === 'new' ? 'Mới (new)' : c.status;

  return [
    stt,
    escape(dateFormatted),
    escape(c.id),
    escape(c.fullName),
    escape(c.studentId),
    escape(getDivisionLabel(c.castingDivision)),
    escape(c.castingSong),
    escape(c.beatUrl),
    escape(expLabel),
    escape(c.performanceUrl || ''),
    escape(c.email),
    escape(c.passion || ''),
    escape(statusLabel)
  ].join(',');
};

const header = 'STT,Thời Gian Nộp,Mã Hồ Sơ,Họ Và Tên,MSSV,Mảng Casting,Bài Hát / Tiết Mục,Link Beat / Nhạc,Kinh Nghiệm,Link Video Diễn,Email Thí Sinh,Nguyện Vọng / Đam Mê,Trạng Thái';

// 1. Sort all candidates chronologically ascending (from earliest 11/10 to latest 16/10)
const sortedAll = [...allCandidates].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
const fullCsvLines = [header];
sortedAll.forEach((c, idx) => {
  fullCsvLines.push(formatRow(idx + 1, c));
});
fs.writeFileSync('HMC_All_62_Candidates_GoogleSheet.csv', '\uFEFF' + fullCsvLines.join('\r\n'), 'utf8');

// 2. Filter missing 20
const missing = sortedAll.filter(c => {
  return !sheetContent.toLowerCase().includes(c.studentId.toLowerCase()) &&
         !sheetContent.toLowerCase().includes(c.fullName.toLowerCase());
});

const missingCsvLines = [header];
missing.forEach((c, idx) => {
  missingCsvLines.push(formatRow(idx + 1, c));
});
fs.writeFileSync('HMC_Missing_20_Candidates.csv', '\uFEFF' + missingCsvLines.join('\r\n'), 'utf8');

console.log(`Generated HMC_All_62_Candidates_GoogleSheet.csv with ${sortedAll.length} rows.`);
console.log(`Generated HMC_Missing_20_Candidates.csv with ${missing.length} rows.`);
