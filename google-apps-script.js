/**
 * =====================================================================
 * GOOGLE APPS SCRIPT - DATABASE REKAP KEHADIRAN & UCAPAN (BAGAS & VANIA)
 * =====================================================================
 * 
 * PANDUAN SINGKAT:
 * 1. Buka https://sheets.new di browser Anda untuk membuat Google Spreadsheet baru.
 * 2. Beri nama file Spreadsheet, misalnya: "Rekap Kehadiran - Bagas & Vania".
 * 3. Buka menu: Ekstensi > Apps Script (Extensions > Apps Script).
 * 4. Hapus semua kode default di Apps Script, lalu salin dan tempel SELURUH KODE di file ini.
 * 5. Pilih fungsi 'setupSheet' di toolbar atas, lalu klik tombol 'Jalankan' (Run).
 *    (Beri izin akses Google jika diminta). Ini akan otomatis membuat header tabel yang rapi.
 * 6. Klik tombol 'Terapkan' (Deploy) di kanan atas > 'Penerapan baru' (New deployment).
 * 7. Pada jenis penerapan (ikon gerigi), pilih 'Aplikasi Web' (Web app).
 * 8. Konfigurasi:
 *    - Deskripsi: Rekap Kehadiran Pernikahan
 *    - Jalankan sebagai: Saya (email Anda)
 *    - Siapa yang memiliki akses: Siapa saja (Anyone) -> [PENTING!]
 * 9. Klik 'Terapkan' (Deploy) dan salin URL Aplikasi Web yang diberikan
 *    (contoh: https://script.google.com/macros/s/AKfycb.../exec).
 * 10. Tempelkan URL tersebut ke file 'config.js' di proyek website Anda.
 */

// 1. Fungsi Setup Otomatis Header Tabel di Google Sheet
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.setName('Data Kehadiran');
  sheet.clear();
  
  // Header kolom
  var headers = ['No', 'Waktu Pengisian', 'Nama Tamu', 'Konfirmasi Kehadiran', 'Doa & Ucapan'];
  sheet.appendRow(headers);
  
  // Format Header (Warna Elegan Senada Undangan)
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#2d2926'); // Warna dark slate/ink
  headerRange.setFontColor('#f7f3ec'); // Warna paper/gold text
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Montserrat');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 40);
  
  // Kunci baris pertama (Freeze header)
  sheet.setFrozenRows(1);
  
  // Lebar kolom
  sheet.setColumnWidth(1, 50);  // No
  sheet.setColumnWidth(2, 170); // Waktu
  sheet.setColumnWidth(3, 220); // Nama
  sheet.setColumnWidth(4, 180); // Kehadiran
  sheet.setColumnWidth(5, 420); // Pesan Ucapan
  
  // Format alignment kolom default
  sheet.getRange("A2:A").setHorizontalAlignment('center');
  sheet.getRange("B2:B").setHorizontalAlignment('center');
  sheet.getRange("D2:D").setHorizontalAlignment('center');
}

// 2. Menerima Data Masuk dari Website Undangan (POST)
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Cegah race condition bila banyak tamu submit bersamaan
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = e.postData ? e.postData.contents : '';
    var data = {};
    
    try {
      data = JSON.parse(contents);
    } catch (err) {
      data = e.parameter || {};
    }
    
    var nama = (data.name || '').trim();
    var kehadiran = (data.attendance || 'ragu').trim();
    var ucapan = (data.message || '').trim();
    
    if (!nama && !ucapan) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Nama dan ucapan tidak boleh kosong' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Label kehadiran yang ramah dibaca
    var statusLabel = {
      'hadir': ' Insyaallah Hadir',
      'tidak_hadir': '❌ Tidak Dapat Hadir',
      'ragu': '❓ Belum Pasti'
    }[kehadiran] || kehadiran;
    
    var waktuSekarang = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    var noUrut = Math.max(1, sheet.getLastRow()); // Row 1 adalah header, baris 2 nomor 1
    
    // Tambah baris baru
    sheet.appendRow([noUrut, waktuSekarang, nama, statusLabel, ucapan]);
    
    // Warnai badge status kehadiran secara otomatis
    var lastRow = sheet.getLastRow();
    var statusCell = sheet.getRange(lastRow, 4);
    if (kehadiran === 'hadir') {
      statusCell.setBackground('#e2f0d9').setFontColor('#276a3c').setFontWeight('bold');
    } else if (kehadiran === 'tidak_hadir') {
      statusCell.setBackground('#fce4d6').setFontColor('#c00000').setFontWeight('bold');
    } else {
      statusCell.setBackground('#fff2cc').setFontColor('#b25900').setFontWeight('bold');
    }
    
    // Hitung statistik terkini
    var stats = hitungStatistik(sheet);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        sheet_synced: true,
        message: 'Data berhasil dicatat ke Google Sheet',
        stats: stats
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 3. Mengambil Data untuk Ditampilkan di Website (GET)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({
          wishes: [],
          stats: { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    var wishes = [];
    var stats = { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 };
    
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var nama = row[2];
      var rawKehadiran = String(row[3]);
      var pesan = row[4];
      var waktu = row[1];
      
      if (!nama && !pesan) continue;
      
      var attCode = 'ragu';
      if (rawKehadiran.indexOf('Hadir') !== -1 && rawKehadiran.indexOf('Tidak') === -1) {
        attCode = 'hadir';
      } else if (rawKehadiran.indexOf('Tidak') !== -1) {
        attCode = 'tidak_hadir';
      }
      
      stats.total++;
      stats[attCode] = (stats[attCode] || 0) + 1;
      
      wishes.push({
        name: nama,
        attendance: attCode,
        message: pesan,
        created_at: waktu
      });
    }
    
    // Balik urutan agar ucapan terbaru muncul pertama
    wishes.reverse();
    
    return ContentService
      .createTextOutput(JSON.stringify({
        wishes: wishes,
        stats: stats
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        wishes: [],
        stats: { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 },
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function hitungStatistik(sheet) {
  var lastRow = sheet.getLastRow();
  var stats = { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 };
  if (lastRow <= 1) return stats;
  
  var statusValues = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
  for (var i = 0; i < statusValues.length; i++) {
    var val = String(statusValues[i][0]);
    stats.total++;
    if (val.indexOf('Hadir') !== -1 && val.indexOf('Tidak') === -1) {
      stats.hadir++;
    } else if (val.indexOf('Tidak') !== -1) {
      stats.tidak_hadir++;
    } else {
      stats.ragu++;
    }
  }
  return stats;
}
