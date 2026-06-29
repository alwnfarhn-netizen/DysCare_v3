/* ==========================================================================
   STATE APLIKASI GLOBAL
   Menyimpan seluruh data runtime dan konten per level
   ========================================================================== */

const appState = {
    currentScreen: 'home-screen',

    /**
     * Level saat ini: 1-6 sesuai Task Analysis Bab III proposal.
     * Naik level: akurasi ≥80% pada 3 sesi berturut-turut
     * (Cooper, Heron & Heward, 2020 - mastery learning criterion).
     */
    currentLevel: 1,

    /**
     * Pelacak sesi untuk adaptive progression berbasis akurasi.
     * Setiap EXERCISES_PER_SESSION latihan dihitung sebagai 1 sesi.
     * Konsisten dengan mekanisme rule-based adaptive learning Bab III.
     */
    sessionTracker: {
        correct:  0,  // latihan benar dalam sesi ini
        attempts: 0,  // total latihan dalam sesi ini (benar + salah)
        consecutivePass: 0, // sesi berturut-turut dengan akurasi ≥80%
        history: []   // [{level, accuracy, passed, timestamp}]
    },

    // Progress per modul (jumlah latihan selesai, digunakan untuk tampilan)
    progress: {
        reading: 0,
        spelling: 0,
        writing: 0,
        math: 0   // dipertahankan untuk future development (Modul Berhitung)
    },

    // MODUL MEMBACA (konten disusun per level)
    reading: {
        /**
         * DEPRECATED: dipertahankan untuk kompatibilitas, tidak lagi dirujuk oleh
         * getReadingSentencesByLevel(). Lihat sentencesL1-L6. Referensi SDD.md REQ-LVL-02.
         */
        sentencesEasy: [
            "ibu masak",
            "ayah baca",
            "adik main",
            "kucing lucu",
            "bunga harum"
        ],
        // DEPRECATED
        sentencesMedium: [
            "ibu masak nasi goreng",
            "ayah baca koran pagi",
            "kakak pergi ke sekolah",
            "kucing itu sangat lucu",
            "bunga mawar di taman"
        ],
        // DEPRECATED
        sentencesHard: [
            "ibu memasak nasi goreng untuk sarapan pagi",
            "ayah membaca koran sambil minum kopi hangat",
            "kakak berangkat ke sekolah dengan sepeda baru",
            "kucing kecil itu bermain di halaman rumah",
            "bunga mawar merah mekar di taman belakang"
        ],

        /**
         * Level 1: Pengenalan Huruf
         * Sub-keterampilan: Identifikasi huruf A-Z, hindari b/d p/q m/w u/n berdekatan.
         * Tema: Hewan.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        sentencesL1: [
            "a y a m",
            "i k a n",
            "k u c i n g",
            "u l a r",
            "r u s a",
            "s i n g a",
            "g a j a h",
            "e l a n g"
        ],

        /**
         * Level 2: Kesadaran Fonologis
         * Sub-keterampilan: Bunyi huruf dan fonem, suku kata terbuka (KV).
         * Tema: Keluarga.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        sentencesL2: [
            "ma mi mu",
            "ka ki ku",
            "sa si su",
            "ta ti tu",
            "na ni nu",
            "ya yi yu",
            "la li lu",
            "ra ri ru"
        ],

        /**
         * Level 3: Korespondensi Grafem-Fonem (Blending menjadi Kata)
         * Sub-keterampilan: Menggabungkan suku kata menjadi kata 2 suku kata (KV-KV).
         * Tema: Sekolah.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        sentencesL3: [
            "buku",
            "meja",
            "guru",
            "pena",
            "baca",
            "sapu",
            "kaca",
            "nama",
            "tata",
            "pita"
        ],

        /**
         * Level 4: Blending Suku Kata (Pengenalan Kata Kompleks)
         * Sub-keterampilan: Kata 3+ suku kata atau tertutup (KVK).
         * Tema: Bermain.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        sentencesL4: [
            "mainan",
            "boneka",
            "sepeda",
            "ayunan",
            "kelereng",
            "layangan",
            "lompat",
            "robot",
            "lari",
            "kejar"
        ],

        /**
         * Level 5: Membaca Kata (Frasa dan Kalimat Pendek)
         * Sub-keterampilan: Membaca kata bermakna dalam konteks frasa 2-3 kata.
         * Tema: Makanan.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        sentencesL5: [
            "makan roti",
            "minum susu",
            "nasi goreng",
            "sayur sop",
            "ayam bakar",
            "pisang manis",
            "kue bolu",
            "buah apel",
            "ikan goreng",
            "jeruk segar"
        ],

        /**
         * Level 6: Kelancaran Membaca
         * Sub-keterampilan: Akurasi dan kecepatan, kalimat utuh SPOK (4-6 kata).
         * Tema: Kegiatan sehari-hari.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        sentencesL6: [
            "ibu memasak nasi di dapur",
            "adik bermain bola di halaman",
            "ayah membaca koran pagi ini",
            "kakak menyapu lantai setiap hari",
            "saya sikat gigi sebelum tidur",
            "paman mencuci mobil di depan",
            "kucing tidur di atas kursi",
            "bibi menyiram bunga di taman",
            "kami makan malam bersama keluarga",
            "saya bangun pagi hari ini"
        ],

        currentSentence: "",
        isListening: false
    },

    // MODUL MENGEJA (konten disusun per level)
    spelling: {
        /**
         * DEPRECATED: dipertahankan untuk kompatibilitas, tidak lagi dirujuk oleh
         * getSpellingWordsByLevel(). Lihat wordsL1-L6. Referensi SDD.md REQ-LVL-02.
         */
        wordsEasy: [
            { word: "apa", imagePrompt: "ilustrasi anak kecil sedang bertanya kartun", fallbackEmoji: "❓" },
            { word: "ibu", imagePrompt: "ilustrasi seorang ibu tersenyum kartun", fallbackEmoji: "👩" },
            { word: "air", imagePrompt: "segelas air putih kartun sederhana", fallbackEmoji: "💧" },
            { word: "api", imagePrompt: "api kecil oranye kartun", fallbackEmoji: "🔥" },
            { word: "sapi", imagePrompt: "sapi hitam putih kartun", fallbackEmoji: "🐄" }
        ],
        // DEPRECATED
        wordsMedium: [
            { word: "apel", imagePrompt: "sebuah apel merah segar kartun", fallbackEmoji: "🍎" },
            { word: "buku", imagePrompt: "sebuah buku tertutup kartun warna biru", fallbackEmoji: "📘" },
            { word: "ikan", imagePrompt: "seekor ikan oranye kartun berenang", fallbackEmoji: "🐟" },
            { word: "meja", imagePrompt: "sebuah meja kayu sederhana kartun", fallbackEmoji: "🪑" },
            { word: "susu", imagePrompt: "segelas susu putih segar kartun", fallbackEmoji: "🥛" }
        ],
        // DEPRECATED
        wordsHard: [
            { word: "pisang", imagePrompt: "setandan pisang kuning matang kartun", fallbackEmoji: "🍌" },
            { word: "gajah",  imagePrompt: "seekor gajah abu-abu besar kartun", fallbackEmoji: "🐘" },
            { word: "sepatu", imagePrompt: "sepasang sepatu olahraga kartun", fallbackEmoji: "👟" },
            { word: "jendela", imagePrompt: "jendela rumah dengan tirai kartun", fallbackEmoji: "🪟" },
            { word: "bintang", imagePrompt: "bintang kuning bersinar di langit malam kartun", fallbackEmoji: "⭐" }
        ],

        /**
         * Level 1: Pengenalan Huruf
         * Sub-keterampilan: Kesadaran fonologis tingkat awal, ejaan kata 2 huruf.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        wordsL1: [
            { word: "es", imagePrompt: "an ice cube, simple cartoon illustration, white background", fallbackEmoji: "🧊", category: "benda" },
            { word: "mi", imagePrompt: "a bowl of noodles, simple cartoon illustration, white background", fallbackEmoji: "🍜", category: "makanan" },
            { word: "tv", imagePrompt: "a television set, simple cartoon illustration, white background", fallbackEmoji: "📺", category: "elektronik" },
            { word: "hi", imagePrompt: "a hand waving hi, simple cartoon illustration, white background", fallbackEmoji: "👋", category: "sapaan" },
            { word: "ya", imagePrompt: "a thumbs up gesture, simple cartoon illustration, white background", fallbackEmoji: "👍", category: "sapaan" },
            { word: "oh", imagePrompt: "a surprised face emoji, simple cartoon illustration, white background", fallbackEmoji: "😮", category: "ekspresi" }
        ],

        /**
         * Level 2: Kesadaran Fonologis
         * Sub-keterampilan: Kata 3 huruf pola KV-V atau V-KV.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        wordsL2: [
            { word: "air", imagePrompt: "a water drop, simple cartoon illustration, white background", fallbackEmoji: "💧", category: "alam" },
            { word: "oli", imagePrompt: "a barrel of oil, simple cartoon illustration, white background", fallbackEmoji: "🛢️", category: "benda" },
            { word: "kue", imagePrompt: "a slice of cake, simple cartoon illustration, white background", fallbackEmoji: "🍰", category: "makanan" },
            { word: "hiu", imagePrompt: "a shark, simple cartoon illustration, white background", fallbackEmoji: "🦈", category: "hewan" },
            { word: "aki", imagePrompt: "a car battery, simple cartoon illustration, white background", fallbackEmoji: "🔋", category: "benda" },
            { word: "gua", imagePrompt: "a dark cave, simple cartoon illustration, white background", fallbackEmoji: "🦇", category: "alam" }
        ],

        /**
         * Level 3: Korespondensi Grafem-Fonem
         * Sub-keterampilan: Ejaan kata 4 huruf pola KV-KV.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        wordsL3: [
            { word: "buku", imagePrompt: "a closed book, simple cartoon illustration, white background", fallbackEmoji: "📕", category: "sekolah" },
            { word: "meja", imagePrompt: "a wooden desk, simple cartoon illustration, white background", fallbackEmoji: "🪑", category: "perabotan" },
            { word: "susu", imagePrompt: "a glass of milk, simple cartoon illustration, white background", fallbackEmoji: "🥛", category: "minuman" },
            { word: "ikan", imagePrompt: "a swimming fish, simple cartoon illustration, white background", fallbackEmoji: "🐟", category: "hewan" },
            { word: "apel", imagePrompt: "a red apple, simple cartoon illustration, white background", fallbackEmoji: "🍎", category: "buah" },
            { word: "topi", imagePrompt: "a baseball cap, simple cartoon illustration, white background", fallbackEmoji: "🧢", category: "pakaian" },
            { word: "roti", imagePrompt: "a loaf of bread, simple cartoon illustration, white background", fallbackEmoji: "🍞", category: "makanan" },
            { word: "bola", imagePrompt: "a soccer ball, simple cartoon illustration, white background", fallbackEmoji: "⚽", category: "mainan" }
        ],

        /**
         * Level 4: Blending Suku Kata
         * Sub-keterampilan: Ejaan kata 5 huruf.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        wordsL4: [
            { word: "gajah", imagePrompt: "an elephant, simple cartoon illustration, white background", fallbackEmoji: "🐘", category: "hewan" },
            { word: "kursi", imagePrompt: "a wooden chair, simple cartoon illustration, white background", fallbackEmoji: "🪑", category: "perabotan" },
            { word: "balon", imagePrompt: "a red balloon, simple cartoon illustration, white background", fallbackEmoji: "🎈", category: "mainan" },
            { word: "mobil", imagePrompt: "a red car, simple cartoon illustration, white background", fallbackEmoji: "🚗", category: "kendaraan" },
            { word: "botol", imagePrompt: "a glass bottle, simple cartoon illustration, white background", fallbackEmoji: "🍾", category: "benda" },
            { word: "pintu", imagePrompt: "a wooden door, simple cartoon illustration, white background", fallbackEmoji: "🚪", category: "bangunan" },
            { word: "rumah", imagePrompt: "a small house, simple cartoon illustration, white background", fallbackEmoji: "🏠", category: "bangunan" },
            { word: "kapal", imagePrompt: "a ship, simple cartoon illustration, white background", fallbackEmoji: "🚢", category: "kendaraan" }
        ],

        /**
         * Level 5: Membaca Kata
         * Sub-keterampilan: Ejaan kata 6 huruf.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        wordsL5: [
            { word: "sepatu", imagePrompt: "a pair of shoes, simple cartoon illustration, white background", fallbackEmoji: "👟", category: "pakaian" },
            { word: "boneka", imagePrompt: "a teddy bear, simple cartoon illustration, white background", fallbackEmoji: "🧸", category: "mainan" },
            { word: "gunung", imagePrompt: "a mountain, simple cartoon illustration, white background", fallbackEmoji: "⛰️", category: "alam" },
            { word: "pisang", imagePrompt: "a yellow banana, simple cartoon illustration, white background", fallbackEmoji: "🍌", category: "buah" },
            { word: "pensil", imagePrompt: "a yellow pencil, simple cartoon illustration, white background", fallbackEmoji: "✏️", category: "alat tulis" },
            { word: "payung", imagePrompt: "a colorful umbrella, simple cartoon illustration, white background", fallbackEmoji: "☔", category: "benda" },
            { word: "kucing", imagePrompt: "a cute cat, simple cartoon illustration, white background", fallbackEmoji: "🐱", category: "hewan" },
            { word: "sepeda", imagePrompt: "a bicycle, simple cartoon illustration, white background", fallbackEmoji: "🚲", category: "kendaraan" }
        ],

        /**
         * Level 6: Kelancaran Membaca
         * Sub-keterampilan: Ejaan kata kompleks 7+ huruf.
         * Referensi: Simple View of Reading (Gough & Tunmer, 1986)
         */
        wordsL6: [
            { word: "kacamata", imagePrompt: "a pair of glasses, simple cartoon illustration, white background", fallbackEmoji: "👓", category: "aksesori" },
            { word: "pelangi", imagePrompt: "a colorful rainbow, simple cartoon illustration, white background", fallbackEmoji: "🌈", category: "alam" },
            { word: "matahari", imagePrompt: "a shining sun, simple cartoon illustration, white background", fallbackEmoji: "☀️", category: "alam" },
            { word: "pesawat", imagePrompt: "an airplane, simple cartoon illustration, white background", fallbackEmoji: "✈️", category: "kendaraan" },
            { word: "harimau", imagePrompt: "a tiger, simple cartoon illustration, white background", fallbackEmoji: "🐯", category: "hewan" },
            { word: "komputer", imagePrompt: "a desktop computer, simple cartoon illustration, white background", fallbackEmoji: "💻", category: "elektronik" },
            { word: "helikopter", imagePrompt: "a helicopter, simple cartoon illustration, white background", fallbackEmoji: "🚁", category: "kendaraan" }
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
        alphabets: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
        numbers:   ['1','2','3','4','5','6','7','8','9','10'],
        currentMode: 'alphabets',
        currentIdx: 0
    }
};
