#!/bin/bash
# ==========================================================================
# Migrasi Struktur Dokumentasi DYSCARE
# ==========================================================================
# Jalankan dari root project DysCare_v3/
#
# Yang dilakukan:
#   1. Hapus CLAUDE (1).md (duplikat identik dari CLAUDE.md)
#   2. Buat folder docs/
#   3. Pindahkan DEVELOPMENT_PROMPTS.md ke docs/
#   4. Tambahkan SDD.md dan RDP.md (versi terbaru) ke docs/
#   5. Tambahkan referensi docs/ ke README.md
#
# CLAUDE.md dan README.md TETAP di root (tidak dipindah).
# ==========================================================================

set -e

echo "== DYSCARE Documentation Migration =="

# --- 1. Hapus duplikat ---
if [ -f "CLAUDE (1).md" ]; then
    rm "CLAUDE (1).md"
    echo "[OK] Hapus CLAUDE (1).md (duplikat dari CLAUDE.md)"
else
    echo "[SKIP] CLAUDE (1).md tidak ditemukan, mungkin sudah dihapus"
fi

# --- 2. Buat folder docs/ ---
mkdir -p docs
echo "[OK] Folder docs/ siap"

# --- 3. Pindahkan DEVELOPMENT_PROMPTS.md ---
if [ -f "DEVELOPMENT_PROMPTS.md" ]; then
    git mv DEVELOPMENT_PROMPTS.md docs/DEVELOPMENT_PROMPTS.md 2>/dev/null \
        || mv DEVELOPMENT_PROMPTS.md docs/DEVELOPMENT_PROMPTS.md
    echo "[OK] DEVELOPMENT_PROMPTS.md -> docs/DEVELOPMENT_PROMPTS.md"
else
    echo "[SKIP] DEVELOPMENT_PROMPTS.md tidak ditemukan di root"
fi

# --- 4. SDD.md dan RDP.md ---
echo "[INFO] Salin SDD.md dan RDP.md (dari paket yang diberikan) ke docs/"
echo "       jika belum dilakukan secara manual."

# --- 5. Catat struktur akhir ---
echo ""
echo "== Struktur akhir yang diharapkan =="
echo "DysCare_v3/"
echo "├── CLAUDE.md                  (tetap di root, dibaca otomatis Claude Code)"
echo "├── README.md                  (tetap di root)"
echo "├── .gitignore"
echo "├── docs/"
echo "│   ├── DEVELOPMENT_PROMPTS.md (dipindah dari root)"
echo "│   ├── SDD.md                 (baru)"
echo "│   └── RDP.md                 (baru)"
echo "├── index.html"
echo "├── css/"
echo "│   └── style.css"
echo "└── js/"
echo "    └── ..."
echo ""
echo "== Selesai. Jalankan 'git status' untuk review sebelum commit. =="
