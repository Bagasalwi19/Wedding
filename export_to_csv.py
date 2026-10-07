import json
import csv
import os

WISHES_FILE = "wishes.json"
OUTPUT_CSV = "rekap_kehadiran.csv"

def export_csv():
    if not os.path.exists(WISHES_FILE):
        print(f"File {WISHES_FILE} tidak ditemukan.")
        return

    with open(WISHES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    wishes = data.get("wishes", [])
    stats = data.get("stats", {})

    attendance_map = {
        "hadir": "Insya Allah Hadir",
        "tidak_hadir": "Tidak Dapat Hadir",
        "ragu": "Belum Pasti"
    }

    # Menggunakan utf-8-sig agar Microsoft Excel langsung membaca aksen/karakter dengan benar
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["No", "Nama Tamu", "Konfirmasi Kehadiran", "Doa & Pesan Ucapan", "Waktu Pengiriman"])
        
        for idx, item in enumerate(wishes, start=1):
            att_label = attendance_map.get(item.get("attendance", ""), item.get("attendance", ""))
            writer.writerow([
                idx,
                item.get("name", ""),
                att_label,
                item.get("message", ""),
                item.get("created_at", "")
            ])

    print(f" Berhasil mengekspor {len(wishes)} data ke: {OUTPUT_CSV}")
    print(f"Statistik: Total={stats.get('total', 0)}, Hadir={stats.get('hadir', 0)}, Tidak Hadir={stats.get('tidak_hadir', 0)}, Ragu={stats.get('ragu', 0)}")

if __name__ == "__main__":
    export_csv()
