

const FALLBACK_QUOTES = [
  {
    quote: "Pendidikan adalah senjata paling ampuh untuk mengubah dunia.",
    author: "Nelson Mandela"
  },
  {
    quote: "Kesuksesan adalah jumlah dari usaha-usaha kecil yang diulang setiap hari.",
    author: "Robert Collier"
  },
  {
    quote: "Fokuslah pada proses dan konsistensi, hasil akan mengikuti kerja kerasmu.",
    author: "Anonim"
  },
  {
    quote: "Hal besar tidak dikerjakan sekaligus, melainkan sekumpulan hal kecil yang disatukan.",
    author: "Vincent Van Gogh"
  }
];

// Ambil kutipan daring dan gunakan koleksi lokal bila API tidak tersedia.
export const fetchDailyQuote = async () => {
  const url = "https://dummyjson.com/quotes/random";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil kutipan: Status ${response.status}`);
    }

    const { quote, author } = await response.json();
    return {
      quote,
      author,
      source: "online"
    };
  } catch (error) {
    console.warn("API kutipan offline, beralih ke kutipan lokal:", error.message);
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    const fallback = FALLBACK_QUOTES[randomIndex];
    return {
      ...fallback,
      source: "offline"
    };
  }
};
