

const WEATHER_DESCRIPTIONS = {
  0: "Cerah",
  1: "Sebagian Besar Cerah",
  2: "Cerah Berawan",
  3: "Berawan",
  45: "Berkabut",
  48: "Kabut Tebal",
  51: "Gerimis Ringan",
  53: "Gerimis Sedang",
  55: "Gerimis Lebat",
  61: "Hujan Ringan",
  63: "Hujan Sedang",
  65: "Hujan Lebat",
  80: "Hujan Lokal",
  81: "Hujan Lokal Sedang",
  82: "Hujan Lokal Lebat",
  95: "Badai Petir Ringan",
  96: "Badai Petir disertai Es"
};

const WEATHER_ICONS = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌧️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "⛈️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
  96: "⛈️"
};

// Ambil cuaca kampus; nilai fallback menjaga widget tetap informatif saat offline.
export const fetchCampusWeather = async () => {
  const latitude = -5.36;
  const longitude = 105.31;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const { current_weather } = await response.json();
    const { temperature, windspeed, weathercode } = current_weather;

    return {
      success: true,
      location: "ITERA, Lampung Selatan",
      temperature: Math.round(temperature),
      windspeed,
      condition: WEATHER_DESCRIPTIONS[weathercode] || "Berawan",
      icon: WEATHER_ICONS[weathercode] || "🌤️"
    };
  } catch (error) {
    console.warn("Koneksi cuaca gagal, menggunakan data fallback:", error.message);
    return {
      success: false,
      location: "ITERA, Lampung Selatan",
      temperature: 30,
      windspeed: 10,
      condition: "Cerah Berawan (Offline)",
      icon: "⛅"
    };
  }
};
