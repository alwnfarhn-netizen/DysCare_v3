# Catatan Migrasi Struktur Dokumentasi DYSCARE

Struktur ini disiapkan agar root project tetap bersih (hanya file yang
WAJIB dibaca otomatis oleh Claude Code di root), sementara dokumen
referensi/perencanaan dikelompokkan di folder docs/.

## Yang dihapus
- `CLAUDE (1).md` -> duplikat identik dari CLAUDE.md, dihapus tanpa kehilangan informasi

## Yang tetap di root (WAJIB, dibaca otomatis Claude Code)
- `CLAUDE.md` -> ground truth proyek, jangan dipindah
- `README.md` -> standar GitHub, harus di root agar tampil di halaman repo
- `.gitignore`

## Yang dipindah ke docs/
- `DEVELOPMENT_PROMPTS.md` -> docs/DEVELOPMENT_PROMPTS.md (histori prompt fase awal)
- `SDD.md` -> docs/SDD.md (spesifikasi audit & requirement terkini)
- `RDP.md` -> docs/RDP.md (prompt lanjutan berbasis SDD)

## Referensi internal yang perlu disesuaikan
SDD.md dan RDP.md saling merujuk dan merujuk ke CLAUDE.md serta
DEVELOPMENT_PROMPTS.md dengan nama file polos (tanpa path), contoh:
"Baca SDD.md Bagian 2" atau "Baca CLAUDE.md dan SDD.md".

Karena Claude Code membaca file relatif terhadap root project, referensi
ini perlu diperbarui menjadi path relatif docs/ saat dokumen-dokumen
tersebut saling merujuk, KECUALI saat merujuk ke CLAUDE.md (tetap di root,
tidak perlu prefix).

Pola penyesuaian:
- "SDD.md" -> "docs/SDD.md" (saat dirujuk dari root atau dari RDP.md ke SDD.md di lokasi berbeda)
- "RDP.md" -> "docs/RDP.md"
- "DEVELOPMENT_PROMPTS.md" -> "docs/DEVELOPMENT_PROMPTS.md"
- "CLAUDE.md" -> tetap "CLAUDE.md" (tidak berubah, masih di root)

Karena SDD.md dan RDP.md sama-sama berada di docs/, referensi ANTARA
keduanya (SDD.md <-> RDP.md) TIDAK perlu prefix docs/, cukup nama file saja,
karena mereka berada di direktori yang sama.

Referensi DARI docs/ KE root (CLAUDE.md) juga tidak perlu prefix khusus
selama dibaca sebagai instruksi prompt untuk Claude Code (Claude Code
akan tahu CLAUDE.md ada di root karena CLAUDE.md selalu di root project).

Referensi ke CLAUDE.md yang menyebut DEVELOPMENT_PROMPTS.md (di bagian
"Bonus: Prompt untuk Menulis Laporan Bab IV" dan sejenisnya, jika ada)
sebaiknya diperbarui menjadi docs/DEVELOPMENT_PROMPTS.md.
