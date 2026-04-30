// ai-config.js
// Konfigurasi Gemini AI untuk DysCare
// API key dibaca dari meta tag di index.html
// sehingga bisa dikontrol tanpa mengubah file JS ini

const GEMINI_API_KEY = document
  .querySelector('meta[name="dyscare-ai-key"]')
  ?.getAttribute("content") ?? "";

const GEMINI_MODEL = "gemini-1.5-flash";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Validasi key saat aplikasi dimuat
if (!GEMINI_API_KEY) {
  console.warn("DysCare: API key tidak ditemukan. Fitur AI tidak akan berfungsi.");
}
