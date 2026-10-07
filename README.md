# Website Undangan Pernikahan — Bagas & Vania

Website undangan pernikahan digital interaktif dengan desain editorial bernuansa *quiet luxury*, animasi botanical floristik, musik latar, hitung mundur (countdown), galeri foto prewedding, peta lokasi, amplop digital, dan buku ucapan (wishes/RSVP) yang terintegrasi dengan Google Sheets.

---

## 📁 Struktur Direktori

```text
wedding-bagas-vania/
├── index.html                   # Halaman utama undangan
├── account-number-fix.css       # Perbaikan styling nomor rekening
├── gallery-v2.css               # Styling galeri foto
├── portrait-refinement.css      # Styling potret & bingkai editorial
├── reference-inspired.css       # Desain utama, tipografi, dan ornamen
├── reference-structure.js       # Script animasi botanical, arch, & countdown
├── config.js                    # Konfigurasi integrasi Google Sheets Web App
├── wishes.js                    # Logika buku ucapan / RSVP & sinkronisasi
├── google-apps-script.js        # Script siap pakai untuk Google Apps Script
├── export_to_csv.py             # Script ekspor data kehadiran ke file CSV / Excel
├── server.py                    # Server lokal Python + endpoint /api/wishes
├── wishes.json                  # Database ucapan tamu (format JSON)
├── rekap_kehadiran.csv          # Hasil ekspor data kehadiran (Excel-ready)
├── favicon.ico                  # Ikon tab peramban
├── audio/
│   └── anugerah-terindah.mp3    # Lagu latar (Andmesh - Anugerah Terindah)
├── ornaments/                   # Ornamen floral & botanical
│   ├── botanical-arch.webp
│   ├── botanical-cluster.webp
│   ├── botanical-corner.webp
│   ├── botanical-garland.webp
│   └── botanical-vine.webp
└── photos/                      # Foto-foto prewedding & mempelai
    ├── bagas-biodata.jpg
    ├── vania-biodata.jpg
    ├── prewed-cover-v2.jpg
    ├── prewed-countdown-v2.jpg
    ├── prewed-intimate-v2.jpg
    ├── story-walking.jpg
    ├── story-tea.jpg
    ├── story-hands.jpg
    ├── story-chair.jpg
    ├── story-lantern.jpg
    ├── story-fan.jpg
    ├── story-seated.jpg
    ├── story-regal.jpg
    └── og-bagas-vania-portrait-v3.jpg
```

---

## 📊 Integrasi Database Rekap Kehadiran via Google Sheets

Anda dapat menghubungkan formulir ucapan & konfirmasi kehadiran langsung ke Google Spreadsheet pribadi Anda hanya dalam beberapa langkah mudah:

### Langkah 1: Buat Google Sheet
1. Buka browser dan kunjungi [https://sheets.new](https://sheets.new) (atau buat spreadsheet baru di Google Drive).
2. Beri nama file, misalnya: **`Rekap Kehadiran - Bagas & Vania`**.

### Langkah 2: Pasang Apps Script
1. Di Google Sheets, klik menu **Ekstensi** > **Apps Script** (*Extensions > Apps Script*).
2. Hapus seluruh baris kode bawaan yang ada di editor.
3. Buka file [`google-apps-script.js`](google-apps-script.js), salin seluruh isinya, lalu tempelkan ke editor Apps Script.
4. Klik ikon **Simpan** (ikon disket) atau tekan `Ctrl + S`.

### Langkah 3: Format Header Otomatis
1. Pada toolbar atas Apps Script, pilih fungsi **`setupSheet`** pada menu dropdown fungsi.
2. Klik tombol **Jalankan** (*Run*).
3. Jika Google meminta izin akses (*Authorization Required*), klik *Tinjau Izin* > pilih akun Google Anda > klik *Lanjutan (Advanced)* > klik *Buka Proyek (tidak aman)* > klik *Izinkan (Allow)*.
4. Lembar Google Sheet Anda sekarang otomatis memiliki tabel rapi dengan kolom:
   - **No** | **Waktu Pengisian** | **Nama Tamu** | **Konfirmasi Kehadiran** | **Doa & Ucapan**

### Langkah 4: Terapkan Sebagai Web App (Deploy)
1. Di pojok kanan atas Apps Script, klik tombol biru **Terapkan** (*Deploy*) > **Penerapan baru** (*New deployment*).
2. Klik ikon gerigi di sebelah kiri 'Pilih jenis', lalu pilih **Aplikasi Web** (*Web app*).
3. Atur konfigurasi berikut:
   - **Deskripsi**: `Webhook Kehadiran Undangan`
   - **Jalankan sebagai**: `Saya (email Anda)`
   - **Siapa yang memiliki akses**: **`Siapa saja`** (*Anyone*) ⚠️ **[PENTING!]**
4. Klik tombol **Terapkan** (*Deploy*).
5. Salin **URL Aplikasi Web** yang muncul (berakhiran `/exec`).

### Langkah 5: Hubungkan ke Website
1. Buka file [`config.js`](config.js) di folder proyek.
2. Tempelkan URL yang sudah disalin ke variabel `googleSheetWebAppUrl`:
   ```javascript
   const WEDDING_CONFIG = {
     googleSheetWebAppUrl: "https://script.google.com/macros/s/AKfycb.../exec"
   };
   ```
3. Simpan file `config.js`. Selesai! Sekarang setiap kali tamu mengisi form ucapan dan konfirmasi kehadiran, data otomatis masuk ke Google Sheets secara real-time.

---

## 📥 Ekspor Data Lokal ke Excel / CSV

Jika Anda menjalankan server lokal dan data tersimpan di `wishes.json`, Anda dapat mengekspor seluruh rekapan kehadiran ke format Excel/CSV kapan saja:

```powershell
python export_to_csv.py
```
File `rekap_kehadiran.csv` akan otomatis dibuat/diperbarui dan dapat langsung dibuka di Microsoft Excel atau diimpor ke Google Sheets.

---

## 🚀 Cara Menjalankan Website

### Menggunakan Server Python (Disarankan)
```powershell
cd "C:\Users\IP-CORE\.gemini\antigravity-ide\scratch\wedding-bagas-vania"
python server.py
```

Buka peramban di:
👉 **[http://localhost:8000](http://localhost:8000)**

Atau dengan nama tamu khusus:
👉 **[http://localhost:8000/?to=Bapak+Joko+dan+Keluarga](http://localhost:8000/?to=Bapak+Joko+dan+Keluarga)**
