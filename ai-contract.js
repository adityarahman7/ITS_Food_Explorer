(function (root) {
  'use strict';
  const categories = ['', 'Makanan berat', 'Minuman', 'Camilan', 'Bakso & mie', 'Kopi', 'Dessert', 'Lainnya'];
  const campusAreas = ['Dalam Kampus', 'Luar Kampus'];
  const areas = ['Gebang Lor', 'Gebang Putih', 'Keputih', 'Mulyosari', 'Mulyorejo', 'Rungkut', 'Sukolilo'];
  const facilities = ['Wi-Fi', 'Tempat Duduk', 'Parkir Motor', 'AC / Indoor', 'Outdoor'];
  const sorts = ['relevant', 'nearest', 'price', 'rating'];
  const properties = {
    query: { type: 'string', description: 'Kata kunci inti makanan atau nama outlet. Tanpa kata pengantar, lokasi, fasilitas, anggaran. Kosong bila tidak diminta.' },
    queryKind: { type: 'string', enum: ['food', 'outlet', 'general'], description: 'food untuk makanan/menu, outlet untuk nama usaha tertentu, general untuk pencarian umum tanpa keduanya.' },
    category: { type: 'string', enum: categories },
    campusAreas: { type: 'array', items: { type: 'string', enum: campusAreas } },
    areas: { type: 'array', items: { type: 'string', enum: areas } },
    facilities: { type: 'array', items: { type: 'string', enum: facilities } },
    minPrice: { type: ['integer', 'null'], minimum: 0, maximum: 10000000 },
    maxPrice: { type: ['integer', 'null'], minimum: 0, maximum: 10000000 },
    maxDistanceKm: { type: ['number', 'null'], minimum: 0, maximum: 100 },
    sort: { type: 'string', enum: sorts },
    unsupported: { type: 'array', items: { type: 'string' }, description: 'Permintaan yang tidak dapat diperiksa: halal, pedas, buka sekarang, vegan, rute perjalanan, suasana, dan lainnya.' }
  };
  const schema = { type: 'object', properties, required: Object.keys(properties), additionalProperties: false };
  function validate(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !Object.hasOwn(properties, key))) throw new Error('Kriteria AI tidak valid.');
    if (typeof value.query !== 'string' || value.query.length > 160 || !['food', 'outlet', 'general'].includes(value.queryKind) || !categories.includes(value.category) || !sorts.includes(value.sort)) throw new Error('Kriteria AI tidak valid.');
    const result = { query: value.query.trim(), queryKind: value.queryKind, category: value.category, sort: value.sort };
    for (const [key, allowed] of Object.entries({ campusAreas, areas, facilities })) {
      if (!Array.isArray(value[key]) || value[key].length > allowed.length || value[key].some(item => !allowed.includes(item))) throw new Error('Filter AI tidak valid.');
      result[key] = [...new Set(value[key])];
    }
    for (const [key, max] of Object.entries({ minPrice: 10000000, maxPrice: 10000000, maxDistanceKm: 100 })) {
      const number = value[key];
      if (number !== null && (typeof number !== 'number' || !Number.isFinite(number) || number < 0 || number > max || (key !== 'maxDistanceKm' && !Number.isInteger(number)))) throw new Error('Batas angka AI tidak valid.');
      result[key] = number;
    }
    if (result.minPrice !== null && result.maxPrice !== null && result.minPrice > result.maxPrice) throw new Error('Rentang harga AI tidak valid.');
    if (!Array.isArray(value.unsupported) || value.unsupported.length > 8 || value.unsupported.some(item => typeof item !== 'string' || !item.trim() || item.length > 100)) throw new Error('Catatan AI tidak valid.');
    result.unsupported = [...new Set(value.unsupported.map(item => item.trim()))];
    return result;
  }
  function toSearch(value) {
    const c = validate(value);
    return { query: c.query, category: c.category, campusAreas: c.campusAreas, areas: c.areas, facilities: c.facilities,
      maxDistanceKm: c.maxDistanceKm, strictMenuQuery: c.queryKind === 'food',
      priceBands: c.minPrice === null && c.maxPrice === null ? [] : [{ min: c.minPrice ?? 0, max: c.maxPrice ?? Infinity }] };
  }
  function errorMessage(code) {
    return ({
      AI_NOT_CONFIGURED: 'Pencarian AI belum diaktifkan.',
      AI_QUOTA_EXCEEDED: 'Kuota atau batas pemakaian Gemini sedang tercapai. Coba lagi nanti.',
      RATE_LIMITED: 'Batas pencarian tercapai. Tunggu sekitar satu menit sebelum mencoba lagi.',
      AI_TIMEOUT: 'AI melewati batas waktu tunggu. Coba kirim lagi sebentar.',
      AI_PROVIDER_BUSY: 'Layanan Gemini sedang sibuk atau mengalami gangguan. Coba lagi nanti.',
      AI_ACCESS_DENIED: 'Akses Gemini ditolak. Periksa izin API key dan akses model pada proyek.',
      AI_MODEL_UNAVAILABLE: 'Model AI yang dikonfigurasi sedang tidak tersedia.',
      AI_INVALID_RESPONSE: 'AI belum berhasil memahami pesan ini. Coba sederhanakan kalimatnya.',
      AI_UNAVAILABLE: 'Backend belum berhasil menghubungi Gemini. Coba lagi sebentar.'
    })[code] || 'Koneksi ke backend terputus atau responsnya tidak terbaca. Coba kirim lagi.';
  }
  root.FoodAI = { schema, validate, toSearch, errorMessage };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.FoodAI;
})(globalThis);
