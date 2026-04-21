/* ==========================================================================
   STATE APLIKASI GLOBAL
   Menyimpan seluruh data runtime dan konten per level
   ========================================================================== */

const appState = {
    currentScreen: 'home-screen',
    currentLevel: 1, // 1=Mudah, 2=Sedang, 3=Sulit

    // Progress per modul
    progress: {
        reading: 0,
        spelling: 0,
        math: 0
    },

    // MODUL MEMBACA (konten disusun per level)
    reading: {
        // Level 1: 2-3 kata sederhana
        sentencesEasy: [
            "ibu masak",
            "ayah baca",
            "adik main",
            "kucing lucu",
            "bunga harum"
        ],
        // Level 2: 4-5 kata, kalimat utuh
        sentencesMedium: [
            "ibu masak nasi goreng",
            "ayah baca koran pagi",
            "kakak pergi ke sekolah",
            "kucing itu sangat lucu",
            "bunga mawar di taman"
        ],
        // Level 3: 6+ kata, struktur lebih kompleks
        sentencesHard: [
            "ibu memasak nasi goreng untuk sarapan pagi",
            "ayah membaca koran sambil minum kopi hangat",
            "kakak berangkat ke sekolah dengan sepeda baru",
            "kucing kecil itu bermain di halaman rumah",
            "bunga mawar merah mekar di taman belakang"
        ],
        currentSentence: "",
        isListening: false
    },

    // MODUL MENGEJA (konten disusun per level)
    spelling: {
        // Level 1: 3 huruf, sangat familiar
        wordsEasy: [
            { word: "apa", imagePrompt: "ilustrasi anak kecil sedang bertanya kartun", fallbackEmoji: "❓" },
            { word: "ibu", imagePrompt: "ilustrasi seorang ibu tersenyum kartun", fallbackEmoji: "👩" },
            { word: "air", imagePrompt: "segelas air putih kartun sederhana", fallbackEmoji: "💧" },
            { word: "api", imagePrompt: "api kecil oranye kartun", fallbackEmoji: "🔥" },
            { word: "sapi", imagePrompt: "sapi hitam putih kartun", fallbackEmoji: "🐄" }
        ],
        // Level 2: 4 huruf
        wordsMedium: [
            { word: "apel", imagePrompt: "sebuah apel merah segar kartun", fallbackEmoji: "🍎" },
            { word: "buku", imagePrompt: "sebuah buku tertutup kartun warna biru", fallbackEmoji: "📘" },
            { word: "ikan", imagePrompt: "seekor ikan oranye kartun berenang", fallbackEmoji: "🐟" },
            { word: "meja", imagePrompt: "sebuah meja kayu sederhana kartun", fallbackEmoji: "🪑" },
            { word: "susu", imagePrompt: "segelas susu putih segar kartun", fallbackEmoji: "🥛" }
        ],
        // Level 3: 5-6 huruf
        wordsHard: [
            { word: "pisang", imagePrompt: "setandan pisang kuning matang kartun", fallbackEmoji: "🍌" },
            { word: "gajah",  imagePrompt: "seekor gajah abu-abu besar kartun", fallbackEmoji: "🐘" },
            { word: "sepatu", imagePrompt: "sepasang sepatu olahraga kartun", fallbackEmoji: "👟" },
            { word: "jendela", imagePrompt: "jendela rumah dengan tirai kartun", fallbackEmoji: "🪟" },
            { word: "bintang", imagePrompt: "bintang kuning bersinar di langit malam kartun", fallbackEmoji: "⭐" }
        ],
        currentWordObj: null
    },

    // MODUL BERHITUNG (konten disusun per level)
    math: {
        // Level 1: angka 1-5, operasi +
        problemsEasy: [
            { name: "apel",   visual1: "🍎", visual2: "🍎", num1: 1, num2: 1, op: "+" },
            { name: "kucing", visual1: "🐱", visual2: "🐱", num1: 2, num2: 1, op: "+" },
            { name: "kue",    visual1: "🍪", visual2: "🍪", num1: 1, num2: 2, op: "+" },
            { name: "balon",  visual1: "🎈", visual2: "🎈", num1: 2, num2: 2, op: "+" },
            { name: "bunga",  visual1: "🌸", visual2: "🌸", num1: 3, num2: 1, op: "+" }
        ],
        // Level 2: angka 1-10, operasi + dan -
        problemsMedium: [
            { name: "jeruk",  visual1: "🍊", visual2: "🍊", num1: 3, num2: 4, op: "+" },
            { name: "bebek",  visual1: "🦆", visual2: "🦆", num1: 5, num2: 2, op: "+" },
            { name: "pensil", visual1: "✏️", visual2: "✏️", num1: 6, num2: 3, op: "-" },
            { name: "bola",   visual1: "⚽", visual2: "⚽", num1: 7, num2: 2, op: "-" },
            { name: "pisang", visual1: "🍌", visual2: "🍌", num1: 4, num2: 5, op: "+" }
        ],
        // Level 3: angka 1-20, operasi + dan -
        problemsHard: [
            { name: "anggur",  visual1: "🍇", visual2: "🍇", num1: 8,  num2: 5, op: "+" },
            { name: "strawberry", visual1: "🍓", visual2: "🍓", num1: 12, num2: 4, op: "-" },
            { name: "roti",    visual1: "🍞", visual2: "🍞", num1: 9,  num2: 7, op: "+" },
            { name: "donat",   visual1: "🍩", visual2: "🍩", num1: 15, num2: 6, op: "-" },
            { name: "mangga",  visual1: "🥭", visual2: "🥭", num1: 10, num2: 8, op: "+" }
        ],
        currentIndex: 0
    },

    // MODUL MENULIS (tidak ber-level, tapi urutan progresif: huruf→kata)
    writing: {
        alphabets: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        numbers:   ['1','2','3','4','5','6','7','8','9','10'],
        currentMode: 'alphabets',
        currentIdx: 0
    }
};
