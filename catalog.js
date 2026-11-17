(function (root) {
  'use strict';
  const text = value => String(value ?? '').trim();
  const number = value => value === null || value === '' || value === undefined ? null : Number.isFinite(Number(value)) ? Number(value) : null;
  const normalize = value => text(value).toLocaleLowerCase('id-ID');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const categories = { 'makanan berat': 'Makanan berat', 'bakso & mie': 'Bakso & mie', kopi: 'Kopi', dessert: 'Dessert', camilan: 'Camilan', minuman: 'Minuman', lainnya: 'Lainnya' };
  const localPhoto = value => /^assets\/outlets\/[A-Z0-9-]+\.(jpg|jpeg|png|webp)$/.test(text(value)) ? text(value) : '';
  function coordinates(latitude, longitude) {
    const lat = number(latitude), lng = number(longitude);
    return lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [lat, lng] : null;
  }
  function distance(a, b) {
    if (!a || !b) return null;
    const rad = degrees => degrees * Math.PI / 180;
    const h = Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
  }
  function load(raw) {
    if (!Array.isArray(raw.outlets) || !Array.isArray(raw.menus) || !coordinates(...(raw.campusCenter || []))) throw new Error('Format katalog tidak valid.');
    const ids = new Set(), menuIds = new Set();
    for (const row of raw.outlets) {
      if (!text(row.id_tempat) || ids.has(row.id_tempat)) throw new Error('ID tempat kosong atau duplikat.');
      ids.add(row.id_tempat);
    }
    const grouped = new Map();
    for (const row of raw.menus) {
      if (!ids.has(row.id_tempat) || !text(row.id_menu) || menuIds.has(row.id_menu)) throw new Error('Relasi atau ID menu tidak valid.');
      const price = number(row.harga);
      if (price === null || price < 0 || !text(row.nama_menu)) throw new Error('Harga atau nama menu tidak valid.');
      menuIds.add(row.id_menu);
      if (!grouped.has(row.id_tempat)) grouped.set(row.id_tempat, []);
      grouped.get(row.id_tempat).push({ id: row.id_menu, name: text(row.nama_menu), price, category: text(row.kategori), status: text(row.status), description: text(row.deskripsi) });
    }
    const places = raw.outlets.map(row => {
      const position = coordinates(row.latitude, row.longitude);
      const menu = grouped.get(row.id_tempat) || [];
      const category = categories[normalize(row.kategori)] || 'Lainnya';
      return { id: row.id_tempat, name: text(row.nama), category, area: text(row.area), address: text(row.alamat),
        campusArea: !text(row.area) ? '' : normalize(row.area).startsWith('dalam kampus') ? 'Dalam Kampus' : 'Luar Kampus',
        position, distance: distance(raw.campusCenter, position), menu,
        facilities: text(row.fasilitas).split(/[,;\n]/).map(text).filter(Boolean), hours: text(row.jam_operasional),
        status: text(row.status), verifiedAt: text(row.terakhir_verifikasi), source: text(row.sumber_data), mapsUrl: text(row.google_maps_url), osmUrl: text(row.osm_url),
        photoUrl: localPhoto(row.foto_url), photoCredit: text(row.foto_kredit),
        tags: [...new Set(menu.map(item => item.category))], rating: number(row.rating), reviews: number(row.jumlah_rating) };
    });
    return { places, campusCenter: raw.campusCenter, notice: text(raw.notice), importedAt: text(raw.importedAt), sourceUrl: text(raw.sourceUrl) };
  }
  const queryText = query => normalize(query).replace(/\b(dekat|sekitar)\s+(kampus\s+)?its\s*$/i, '').trim();
  const menuMatches = (menu, food) => normalize(menu.name).includes(normalize(food)) || normalize(menu.category) === normalize(food) || (food === 'Bakso & Mie' && /bakso|mie/i.test(menu.name));
  function matchesCategory(place, category) {
    return !category || normalize(place.category) === normalize(category) || place.menu.some(item => normalize(item.category) === normalize(category));
  }
  function search(places, criteria = {}) {
    const query = queryText(criteria.query);
    const words = query.split(/\s+/).filter(Boolean);
    return places.filter(place => {
      const searchable = normalize([place.name, place.category, place.area, place.address || '', ...place.menu.map(menu => menu.name)].join(' '));
      if (!words.every(word => searchable.includes(word)) || !matchesCategory(place, criteria.category)) return false;
      // A dish query must match one menu, not words scattered across different dishes.
      // With no menu data, an outlet's own name can indicate relevance, never its address.
      if (criteria.strictMenuQuery && words.length && !(place.menu.length
        ? place.menu.some(menu => words.every(word => normalize(menu.name).includes(word)))
        : words.every(word => normalize(place.name).includes(word)))) return false;
      if (criteria.areas?.length && !criteria.areas.includes(place.area)) return false;
      if (criteria.campusAreas?.length && !criteria.campusAreas.includes(place.campusArea)) return false;
      if (criteria.facilities?.length && !criteria.facilities.every(value => place.facilities.includes(value))) return false;
      if (criteria.maxDistanceKm != null && (place.distance === null || place.distance > criteria.maxDistanceKm)) return false;
      const foods = criteria.foods || [], bands = criteria.priceBands || [];
      // Food and budget must match the same menu item. Name/menu queries also constrain budget matching.
      const namedPlace = !criteria.strictMenuQuery && normalize(place.name).includes(query);
      if (foods.length || bands.length) return place.menu.some(menu =>
        (!foods.length || foods.some(food => menuMatches(menu, food))) &&
        (!bands.length || bands.some(band => menu.price >= band.min && menu.price <= band.max)) &&
        (!bands.length || !query || namedPlace || words.every(word => normalize(menu.name).includes(word))));
      return true;
    });
  }
  function sort(places, order) {
    const known = value => value === null || value === undefined ? Infinity : value;
    const minPrice = place => place.menu.length ? Math.min(...place.menu.map(item => item.price)) : null;
    return [...places].sort((a, b) => order === 'nearest' ? known(a.distance) - known(b.distance) : order === 'price' ? known(minPrice(a)) - known(minPrice(b)) : order === 'rating' ? known(a.rating === null ? null : -a.rating) - known(b.rating === null ? null : -b.rating) : 0);
  }
  const api = { load, search, sort, distance, coordinates, escape, matchesCategory };
  root.FoodCatalog = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
