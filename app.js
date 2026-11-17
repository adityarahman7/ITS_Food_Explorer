const homeCategories = [{"key":"","label":"Semua","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/></svg>"},{"key":"Makanan berat","label":"Makanan Berat","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12h18a9 9 0 0 1-18 0ZM8 21h8M8 9c-2-2 2-3 0-5m5 5c-2-2 2-3 0-5\"/></svg>"},{"key":"Minuman","label":"Minuman","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 8h14l-2 13H7L5 8ZM4 8h16M12 8l2-5 4-1\"/></svg>"},{"key":"Camilan","label":"Camilan","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 3h10l-2 5 4 4 2 8-4 2H7l-4-2 2-8 4-4-2-5Z\"/><path d=\"M9 13h6m-6 4h6\"/></svg>"},{"key":"Bakso & mie","label":"Bakso & Mie","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12h18a9 9 0 0 1-18 0ZM8 21h8M8 9V6l12-4M12 9V7l8-2\"/></svg>"},{"key":"Kopi","label":"Kopi","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm13 1h2a2 2 0 0 1 0 4h-2M3 22h16M8 5V2m4 3V2\"/></svg>"},{"key":"Dessert","label":"Dessert","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 12 12 22l5-10M6 12h12a3 3 0 0 0 0-6 6 6 0 0 0-12 0 3 3 0 0 0 0 6Z\"/></svg>"}];
function loadLeaflet() {
  const version = 'https://unpkg.com/leaflet@1.9.4/dist/';
  return Promise.all([
    loadMapAsset('link', { rel: 'stylesheet', href: version + 'leaflet.css', integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=' }),
    loadMapAsset('script', { src: version + 'leaflet.js', integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=' })
  ]);
}

function loadMapAsset(tag, attributes) {
  const url = attributes.href || attributes.src;
  if (mapAssets.has(url)) return mapAssets.get(url);
  const loading = new Promise((resolve, reject) => {
    const element = document.createElement(tag);
    Object.assign(element, attributes, { crossOrigin: 'anonymous' });
    const timeout = setTimeout(() => { element.remove(); reject(new Error('Timeout')); }, 8000);
    element.onload = () => { clearTimeout(timeout); resolve(); };
    element.onerror = () => { clearTimeout(timeout); element.remove(); reject(new Error('Aset peta gagal dimuat')); };
    document.head.append(element);
  }).catch(error => {
    mapAssets.delete(url);
    throw error;
  });
  mapAssets.set(url, loading);
  return loading;
}

const find = selector => document.querySelector(selector);
const esc = FoodCatalog.escape;
const filters = find('#filters');
const currency = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
const rupiah = amount => 'Rp' + currency.format(amount);
const categoryColors = { 'Makanan berat': '#6339f5', Minuman: '#c2410c', Camilan: '#15803d', 'Bakso & mie': '#be185d', Kopi: '#0f766e', Dessert: '#a16207', Lainnya: '#64748b' };
homeCategories.push({ key: 'Lainnya', label: 'Lainnya', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>' });
const categoryIcon = category => homeCategories.find(item => item.key === category)?.icon || homeCategories[0].icon;
const placeholder = place => `<span class="outlet-placeholder" style="--outlet-color:${categoryColors[place.category] || '#64748b'}">${categoryIcon(place.category)}<small>Foto belum tersedia</small></span>`;
const photo = place => place.photoUrl ? `<span class="outlet-photo"><img src="${esc(place.photoUrl)}" alt="${esc(place.name)}" loading="lazy" decoding="async" data-outlet-photo="${esc(place.id)}"><small class="photo-source-label">Google Maps</small></span>` : placeholder(place);
const minPrice = place => place.menu.length ? Math.min(...place.menu.map(menu => menu.price)) : null;
const rangePrice = place => place.menu.length ? rupiah(minPrice(place)) + ' – ' + rupiah(Math.max(...place.menu.map(menu => menu.price))) : 'Harga belum tersedia';
const menuCaption = place => place.menu.length ? 'Menu dan harga ilustratif' : 'Menu belum tersedia';
const distanceText = place => place.distance === null ? 'Lokasi belum tersedia' : `${place.distance.toFixed(2)} km · garis lurus`;
const ratingText = place => place.rating === null ? 'Rating belum tersedia' : `★ ${place.rating.toFixed(1)}${place.reviews === null ? '' : ` (${place.reviews})`}`;
const hoursText = place => esc(place.hours || 'Jam buka belum diketahui');
const safeMapsUrl = place => {
  try { const url = new URL(place.mapsUrl); return url.protocol === 'https:' && ['www.google.com', 'maps.google.com', 'maps.app.goo.gl'].includes(url.hostname) ? url.href : ''; } catch { return ''; }
};
const priceBands = [
  { label: '< Rp10.000', min: 0, max: 9999 },
  { label: 'Rp10.000 – Rp20.000', min: 10000, max: 20000 },
  { label: 'Rp20.001 – Rp35.000', min: 20001, max: 35000 },
  { label: '> Rp35.000', min: 35001, max: Infinity }
];
let places = [], campusCenter = [-7.2802494, 112.7932161], selected;
let favorites;
try { const saved = JSON.parse(localStorage.getItem('its-food-favorites') || '[]'); favorites = new Set(Array.isArray(saved) ? saved.filter(id => typeof id === 'string') : []); }
catch { favorites = new Set(); }
let mapCategory = '', mapCardOpen = false, liveMap, liveMarkers, mapAttempted = false;
const mapAssets = new Map();
const canLoadTiles = ['http:', 'https:'].includes(location.protocol);
const mapControl = find('#enable-map');
const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
let filterGroups = [];
let catalogReady = false;
const pageSize = 16;
let explorePage = 1, lastExploreCriteria = '';
let aiSearch = null, aiController = null;
let lastAnimatedRoute = '', routeAnimations = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animateRoute(page, id) {
  const key = `${page}/${id || ''}`;
  if (key === lastAnimatedRoute) return;
  lastAnimatedRoute = key;
  routeAnimations.forEach(animation => animation.cancel());
  routeAnimations = [];
  if (reducedMotion.matches || !Element.prototype.animate) return;
  const section = document.getElementById(page);
  // Never transform the entire page: it contains fixed filters and the map canvas.
  routeAnimations.push(section.animate([{ opacity: .25 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' }));
  const heading = section.querySelector('.hero-content, .explore-hero, .detail-intro');
  if (heading) routeAnimations.push(heading.animate([{ transform: 'translateY(6px)' }, { transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' }));
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { routeAnimations.forEach(animation => animation.cancel()); routeAnimations = []; }
});

function clearAISearch() {
  aiController?.abort(); aiController = null; aiSearch = null;
  find('#ai-search-status').hidden = true;
  find('#search-without-ai').hidden = true;
  find('#results').setAttribute('aria-busy', 'false');
}

function aiStatus(message, fallback = false) {
  find('#ai-search-status').textContent = message;
  find('#ai-search-status').hidden = false;
  find('#search-without-ai').hidden = !fallback;
}

async function searchWithAI() {
  clearAISearch(); explorePage = 1;
  const query = filters.elements.q.value.trim();
  if (!catalogReady || !query || !find('#use-ai').checked) { renderResults(); return; }
  const configured = globalThis.FOOD_AI_CONFIG?.endpoint || '';
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  let endpoint;
  try {
    endpoint = new URL(configured || '/api/search', location.href);
    if ((!configured && !local) || (endpoint.protocol !== 'https:' && !(local && endpoint.origin === location.origin))) throw new Error();
  } catch { aiStatus('Pencarian AI belum diaktifkan. Pencarian kata kunci dan filter tetap tersedia.', true); renderResults(); return; }
  const controller = new AbortController(); aiController = controller;
  const timeout = setTimeout(() => controller.abort(), 24000);
  aiStatus('AI sedang memahami pencarianmu…');
  find('#results').setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }), signal: controller.signal, credentials: 'omit' });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'AI_UNAVAILABLE');
    const criteria = FoodAI.validate(payload.criteria);
    if (aiController !== controller) return;
    aiSearch = { query, criteria };
    const parsed = [criteria.query, criteria.category, ...criteria.campusAreas, ...criteria.areas, ...criteria.facilities,
      criteria.minPrice !== null ? `minimal ${rupiah(criteria.minPrice)}` : '', criteria.maxPrice !== null ? `maksimal ${rupiah(criteria.maxPrice)}` : '',
      criteria.maxDistanceKm !== null ? `radius ${criteria.maxDistanceKm} km dari ITS (garis lurus)` : '',
      criteria.sort !== 'relevant' ? ({ nearest: 'jarak terdekat dari ITS', price: 'harga terendah', rating: 'rating tertinggi' })[criteria.sort] : ''].filter(Boolean);
    const notes = [];
    if (criteria.minPrice !== null || criteria.maxPrice !== null) notes.push('Pencocokan harga memakai menu ilustratif; outlet tanpa harga tidak disertakan.');
    if (criteria.unsupported.length) notes.push(`Belum dapat dipastikan: ${criteria.unsupported.join(', ')}. Hasil hanya mengikuti kriteria lain yang dapat diperiksa.`);
    aiStatus(`Dipahami: ${parsed.join(' · ') || 'semua outlet'}. ${notes.join(' ')}`.trim(), true);
    renderResults();
  } catch (error) {
    if (aiController !== controller) return;
    const message = FoodAI.errorMessage(controller.signal.aborted ? 'AI_TIMEOUT' : error.message);
    aiStatus(`${message} Hasil berikut memakai kata kunci biasa; gunakan kata singkat atau filter untuk mempersempitnya.`, true);
    renderResults();
  } finally {
    clearTimeout(timeout);
    if (aiController === controller) { aiController = null; find('#results').setAttribute('aria-busy', 'false'); }
  }
}
document.addEventListener('error', event => {
  const image = event.target;
  if (!image.matches?.('img[data-outlet-photo]')) return;
  const place = places.find(place => place.id === image.dataset.outletPhoto);
  if (place) image.closest('.outlet-photo').outerHTML = placeholder(place);
}, true);

function saveFavorite(id) {
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  try { localStorage.setItem('its-food-favorites', JSON.stringify([...favorites])); } catch {}
  return favorites.has(id);
}

function renderFilterGroups() {
  filterGroups = [
    { name: 'area', label: 'Lokasi', values: ['Dalam Kampus', 'Luar Kampus'], matches: (place, value) => place.campusArea === value },
    { name: 'price', label: 'Harga Menu Ilustratif', values: priceBands.map(band => band.label), matches: (place, value) => { const band = priceBands.find(band => band.label === value); return place.menu.some(menu => menu.price >= band.min && menu.price <= band.max); } },
    { name: 'food', label: 'Jenis Menu Ilustratif', values: ['Nasi', 'Ayam', 'Mie', 'Bakso', 'Seafood', 'Minuman', 'Camilan', 'Kopi'], matches: (place, value) => place.menu.some(menu => menu.name.toLowerCase().includes(value.toLowerCase()) || menu.category.toLowerCase() === value.toLowerCase()) },
    { name: 'facility', label: 'Fasilitas', values: ['Wi-Fi', 'Tempat Duduk', 'Parkir Motor', 'AC / Indoor', 'Outdoor'], matches: (place, value) => place.facilities.includes(value) }
  ];
  find('#filter-groups').innerHTML = filterGroups.map(group => `<details class="explore-filter-group" data-filter-group="${group.name}" ${group.name === 'facility' ? '' : 'open'}><summary>${group.label}</summary>${group.name === 'facility' ? '<p class="filter-note">Fasilitas belum didata. Opsi aktif setelah tersedia informasi.</p>' : ''}<div class="filter-options">${group.values.map(value => {
    const count = places.filter(place => group.matches(place, value)).length;
    return `<label><input type="checkbox" name="${group.name}" value="${esc(value)}" ${count ? '' : 'disabled'}><span>${esc(value)} <small>(${count})</small></span></label>`;
  }).join('')}</div></details>`).join('');
  find('#filter-groups').querySelectorAll('details').forEach(group => group.addEventListener('toggle', () => {
    if (group.open) fitFilterPanel(group);
  }));
  requestAnimationFrame(() => fitFilterPanel());
}

function fitFilterPanel(preferred) {
  if (find('#jelajahi').hidden) return;
  if (getComputedStyle(filters).position !== 'sticky' && getComputedStyle(filters).position !== 'fixed') return;
  const opened = [...find('#filter-groups').querySelectorAll('details[open]')].reverse();
  for (const group of opened) {
    if (filters.scrollHeight <= filters.clientHeight + 1) break;
    if (group !== preferred) group.open = false;
  }
}

function setExploreFiltersOpen(open) {
  find('#jelajahi').classList.toggle('explore-filters-open', open);
  find('#toggle-explore-filters').setAttribute('aria-expanded', String(open));
  if (open) requestAnimationFrame(() => fitFilterPanel());
}

function exploreCard(place) {
  return `<article class="explore-card"><div class="explore-cover"><a href="#detail/${encodeURIComponent(place.id)}" aria-label="Lihat detail ${esc(place.name)}">${photo(place)}</a><button type="button" class="favorite-button" data-favorite="${esc(place.id)}" aria-label="Favorit ${esc(place.name)}" aria-pressed="${favorites.has(place.id)}">${favorites.has(place.id) ? '♥' : '♡'}</button></div><div class="explore-card-body"><h3><a href="#detail/${encodeURIComponent(place.id)}">${esc(place.name)}</a></h3><div class="card-meta"><span>${rangePrice(place)}</span></div><p class="estimate-label">${menuCaption(place)}</p><div class="food-tags"><span>${esc(place.category)}</span><span>${esc(place.area)}</span></div><p class="hours">${esc(distanceText(place))}</p><p class="hours">${hoursText(place)}</p></div></article>`;
}

function renderResults() {
  if (!catalogReady) return;
  const data = new FormData(filters);
  const criteria = {
    query: aiSearch?.query === filters.elements.q.value.trim() ? '' : filters.elements.q.value, category: filters.elements.category.value,
    campusAreas: data.getAll('area'), foods: data.getAll('food'), facilities: data.getAll('facility'),
    priceBands: priceBands.filter(band => data.getAll('price').includes(band.label))
  };
  const activeAI = aiSearch?.query === filters.elements.q.value.trim() ? aiSearch.criteria : null;
  const criteriaKey = JSON.stringify({ ...criteria, ai: activeAI, sort: filters.elements.sort.value });
  if (criteriaKey !== lastExploreCriteria) { explorePage = 1; lastExploreCriteria = criteriaKey; }
  let matched = FoodCatalog.search(places, criteria);
  if (activeAI) matched = FoodCatalog.search(matched, FoodAI.toSearch(activeAI));
  const order = filters.elements.sort.value === 'relevant' && activeAI ? activeAI.sort : filters.elements.sort.value;
  const results = FoodCatalog.sort(matched, order);
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  explorePage = Math.max(1, Math.min(explorePage, totalPages));
  const start = (explorePage - 1) * pageSize, end = Math.min(start + pageSize, results.length);
  find('#result-count').textContent = (results.length ? `Menampilkan ${start + 1}–${end} dari ${results.length} outlet` : 'Tidak ada outlet yang cocok') + (filters.elements.q.value.trim() ? ` untuk “${filters.elements.q.value.trim()}”` : '');
  find('#results').innerHTML = results.length ? results.slice(start, end).map(exploreCard).join('') : '<div class="explore-empty"><h2>Belum ada hasil</h2><p>Coba kata kunci yang lebih singkat atau reset filter. Menu, harga, dan fasilitas belum tersedia pada semua outlet.</p></div>';
  const pagination = find('#explore-pagination');
  pagination.hidden = totalPages <= 1;
  const shownPages = [...new Set([1, totalPages, explorePage - 1, explorePage, explorePage + 1])].filter(page => page > 0 && page <= totalPages).sort((a, b) => a - b);
  const pageButtons = shownPages.map((page, index) => `${index && page - shownPages[index - 1] > 1 ? '<span class="page-gap" aria-hidden="true">…</span>' : ''}<button type="button" data-page="${page}" aria-label="Halaman ${page}" ${page === explorePage ? 'aria-current="page"' : ''}>${page}</button>`).join('');
  pagination.innerHTML = `<span class="page-status" role="status">Halaman ${explorePage} dari ${totalPages}</span><div class="page-controls"><button type="button" data-page="${explorePage - 1}" ${explorePage === 1 ? 'disabled' : ''}>← Sebelumnya</button>${pageButtons}<button type="button" data-page="${explorePage + 1}" ${explorePage === totalPages ? 'disabled' : ''}>Berikutnya →</button></div>`;
  find('#explore-categories').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === filters.elements.category.value)));
}

function homeCard(place) {
  return `<a class="card home-card" href="#detail/${encodeURIComponent(place.id)}"><div class="home-card-image">${photo(place)}</div><div class="home-card-body"><h3>${esc(place.name)}</h3><p>${rangePrice(place)}</p><p class="estimate-label">${menuCaption(place)}</p><span class="card-tag">${esc(place.category)}</span><span class="card-tag">${esc(place.area)}</span></div></a>`;
}

function renderDetail(place) {
  const mapsUrl = safeMapsUrl(place);
  const nearby = place.position ? places.filter(item => item.id !== place.id && item.position).sort((a, b) => FoodCatalog.distance(place.position, a.position) - FoodCatalog.distance(place.position, b.position)).slice(0, 3) : [];
  find('#place-detail').innerHTML = `<div class="detail-top"><div class="detail-main-photo">${photo(place)}</div><div class="detail-intro"><div class="detail-intro-top"><div><span class="card-tag">${esc(place.category)}</span></div><div class="detail-actions"><button class="secondary" type="button" id="detail-save" aria-pressed="${favorites.has(place.id)}">${favorites.has(place.id) ? '♥ Tersimpan' : '♡ Simpan'}</button><button type="button" id="detail-share">Bagikan</button></div></div><h1>${esc(place.name)}</h1><p>${esc(ratingText(place))}</p><p>Outlet dari pendataan awal di ${esc(place.area)}. ${place.menu.length ? "Menu dan harga di bawah bersifat ilustratif." : "Informasi menu dan harga belum tersedia."}</p><div class="detail-metrics"><div><strong>${rangePrice(place)}</strong><small>${place.menu.length ? "Estimasi dari menu ilustratif" : "Lihat informasi outlet"}</small></div><div><strong>${hoursText(place)}</strong><small>Status buka belum diketahui</small></div><div><strong>${esc(distanceText(place))}</strong><small>Dari titik acuan ITS, bukan rute perjalanan</small></div></div><p id="share-status" role="status"></p></div></div>
  <div class="detail-columns"><div><section class="panel detail-block"><h2>${place.menu.length ? "Menu Ilustratif" : "Menu"}</h2>${place.menu.length ? "<p>Pilihan menu dan harga ilustratif.</p>" : ""}<div class="detail-menu-grid">${place.menu.map(menu => `<article><strong>${esc(menu.name)}</strong><p>${rupiah(menu.price)}</p><small>${esc(menu.category)}</small></article>`).join('') || '<p>Menu belum tersedia.</p>'}</div></section><section class="panel detail-block"><h2>Ulasan</h2><p>Belum tersedia ulasan pengguna untuk outlet ini.</p></section></div>
  <section class="panel detail-block"><h2>Informasi Tempat</h2><dl class="place-facts"><dt>Alamat</dt><dd>${esc(place.address || 'Alamat lengkap belum didata')}</dd><dt>Area</dt><dd>${esc(place.area)}</dd><dt>Fasilitas</dt><dd>${place.facilities.length ? place.facilities.map(value => `<span class="card-tag">${esc(value)}</span>`).join('') : 'Belum didata'}</dd><dt>Jam operasional</dt><dd>${hoursText(place)}</dd></dl><h2>Lokasi</h2><p>${place.position ? 'Lokasi outlet berdasarkan koordinat pada katalog.' : 'Koordinat belum tersedia. Outlet ini tidak ditandai pada peta.'}</p>${place.position ? `<a class="button secondary" href="#peta/${encodeURIComponent(place.id)}">Lihat di Peta</a>` : ''}${mapsUrl ? ` <a class="button secondary" href="${esc(mapsUrl)}" target="_blank" rel="noopener noreferrer">Buka tautan Maps</a>` : ''}</section>
  <div><section class="panel detail-block"><h2>Asal Data</h2>${place.photoUrl && mapsUrl ? `<p>Foto: <a class="photo-credit-link" href="${esc(mapsUrl)}" target="_blank" rel="noopener noreferrer">Google Maps - ${esc(place.name)}</a></p>` : ""}<p>Nama dan lokasi dari katalog outlet. ${place.menu.length ? "Menu dan harga bersifat ilustratif." : "Menu dan harga belum tersedia dari sumber."}</p></section><section class="panel detail-block"><h2>Outlet di Sekitar Tempat Ini</h2>${nearby.length ? nearby.map(item => `<a class="nearby-item" href="#detail/${encodeURIComponent(item.id)}">${photo(item)}<span><b>${esc(item.name)}</b><br>${FoodCatalog.distance(place.position, item.position).toFixed(2)} km · garis lurus dari outlet ini</span></a>`).join('') : '<p>Lokasi belum cukup untuk menghitung outlet sekitar.</p>'}</section></div></div>`;
  find('#detail-save').addEventListener('click', event => {
    const active = saveFavorite(place.id);
    event.currentTarget.setAttribute('aria-pressed', String(active));
    event.currentTarget.textContent = active ? '♥ Tersimpan' : '♡ Simpan';
  });
  find('#detail-share').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); find('#share-status').textContent = 'Tautan disalin.'; }
    catch { find('#share-status').textContent = 'Salin alamat dari bilah URL browser.'; }
  });
}

function route() {
  setExploreFiltersOpen(false);
  const [requested, rawId] = location.hash.slice(1).split('/');
  let id; try { id = decodeURIComponent(rawId || ''); } catch { id = ''; }
  const page = ['beranda', 'jelajahi', 'detail', 'peta'].includes(requested) ? requested : 'beranda';
  document.querySelectorAll('.page').forEach(section => { section.hidden = section.id !== page; });
  document.querySelectorAll('.bar nav a').forEach(link => {
    if (link.hash === '#' + page) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (!catalogReady) return;
  const place = places.find(item => item.id === id);
  if (page === 'detail') {
    if (place) renderDetail(place); else find('#place-detail').innerHTML = '<p>Tempat tidak ditemukan. Pilih outlet dari Jelajahi.</p>';
  }
  if (page === 'jelajahi') { renderResults(); requestAnimationFrame(() => fitFilterPanel()); }
  if (page === 'peta') {
    setMapListOpen(false);
    mapCardOpen = false;
    if (place) { FoodMapChat.release(false); mapCategory = ''; find('#map-query').value = ''; selected = place; }
    renderMap();
    requestAnimationFrame(() => {
      if (find('#peta').hidden) return;
      if (liveMap) { liveMap.invalidateSize({ pan: true, animate: false }); if (place?.position) liveMap.panTo(place.position); }
      else if (!mapAttempted && canLoadTiles) activateMap();
    });
  }
  window.scrollTo(0, 0);
  animateRoute(page, id);
}

function explore(category = '', query = '') {
  filters.reset(); filters.elements.category.value = category; filters.elements.q.value = query;
  location.hash = 'jelajahi'; renderResults();
}

function mapPoint(position) {
  const positions = places.filter(place => place.position).map(place => place.position).concat([campusCenter]);
  const lats = positions.map(p => p[0]), lngs = positions.map(p => p[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats), minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  return { x: 8 + (position[1] - minLng) / (maxLng - minLng || 1) * 84, y: 8 + (maxLat - position[0]) / (maxLat - minLat || 1) * 84 };
}

function renderMap() {
  if (!catalogReady) return;
  let matched = FoodCatalog.search(places, { query: find('#map-query').value, category: mapCategory });
  if (FoodMapChat.criteria) matched = FoodCatalog.search(matched, FoodAI.toSearch(FoodMapChat.criteria));
  const manualOrder = find('#map-sort').value === 'near' ? 'nearest' : find('#map-sort').value;
  const visible = FoodCatalog.sort(matched, manualOrder || FoodMapChat.criteria?.sort);
  if (!visible.includes(selected)) { selected = undefined; mapCardOpen = false; }
  const located = visible.filter(place => place.position);
  find('#map-count').textContent = `Daftar Outlet (${visible.length})`;
  find('#map-list').innerHTML = visible.map(place => `<button type="button" class="map-place" data-map-place="${esc(place.id)}" aria-pressed="${place === selected && mapCardOpen}">${photo(place)}<span><b>${esc(place.name)}</b><small>${esc(distanceText(place))}</small><small>${rangePrice(place)} · ilustratif</small></span></button>`).join('') || '<p>Belum ada outlet yang cocok.</p>';
  find('#markers').innerHTML = located.map(place => { const point = mapPoint(place.position); return `<button type="button" class="map-marker" data-map-place="${esc(place.id)}" aria-label="${esc(place.name)}" aria-pressed="${place === selected && mapCardOpen}" style="left:${point.x}%;top:${point.y}%;--pin-color:${categoryColors[place.category]}"><span>${categoryIcon(place.category)}</span></button>`; }).join('');
  const center = mapPoint(campusCenter);
  find('.map-drawing').innerHTML = `<defs><pattern id="coordinate-grid" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#f0edf8"/><path d="M0 0H40V40" fill="none" stroke="#ded8ec"/></pattern></defs><rect width="800" height="600" fill="url(#coordinate-grid)"/><circle cx="${center.x * 8}" cy="${center.y * 6}" r="8" fill="#15132b"/><text x="${center.x * 8 + 12}" y="${center.y * 6}" fill="#15132b" font-size="16">Acuan ITS</text><text x="24" y="565" fill="#514477" font-size="16">Skema koordinat · bukan peta jalan</text>`;
  find('#map-categories').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === mapCategory)));
  const card = find('#map-selection');
  card.hidden = !selected || !mapCardOpen;
  card.innerHTML = card.hidden ? '' : `<div class="map-popup-summary">${photo(selected)}<div><h3>${esc(selected.name)}</h3><p>${rangePrice(selected)} · ilustratif</p><p>${esc(distanceText(selected))}</p></div></div><button type="button" class="map-close secondary" aria-label="Tutup ringkasan">×</button><a class="button" href="#detail/${encodeURIComponent(selected.id)}">Lihat Detail →</a>`;
  find('#map-status').textContent = `${liveMap && find('#live-map').classList.contains('ready') ? 'OSM' : 'Skema koordinat'} · ${located.length} penanda / ${visible.length} outlet${located.length < visible.length ? ' · ada lokasi belum tersedia' : ''}`;
  if (liveMarkers) {
    liveMarkers.clearLayers();
    for (const place of located) {
      const icon = L.divIcon({ className: 'live-pin', html: `<span style="--pin-color:${categoryColors[place.category]}">${categoryIcon(place.category)}</span>`, iconSize: [38, 38], iconAnchor: [19, 19] });
      L.marker(place.position, { icon, title: place.name, alt: place.name }).on('click', () => chooseMapPlace(place.id)).addTo(liveMarkers);
    }
  }
}

function chooseMapPlace(id) {
  selected = places.find(place => place.id === id); mapCardOpen = true; renderMap();
  if (window.matchMedia('(max-width: 690px)').matches) setMapListOpen(false);
  if (liveMap && selected?.position) liveMap.panTo(selected.position);
}

function setMapListOpen(open) {
  if (open && window.matchMedia('(max-width: 999px)').matches) FoodMapChat.setOpen(false);
  find('#map-outlet-panel').hidden = !open;
  find('#toggle-map-list').setAttribute('aria-expanded', String(open));
  find('#toggle-map-list').textContent = open ? '☰ Tutup Daftar' : '☰ Daftar Outlet';
}

async function activateMap() {
  if (!catalogReady || !canLoadTiles || mapControl.disabled || liveMap) return;
  mapAttempted = true; mapControl.disabled = true;
  const status = find('#map-status'), canvas = find('#live-map');
  status.textContent = 'Memuat peta dasar…';
  let timeout, attemptMap;
  const fallback = () => {
    clearTimeout(timeout);
    if (attemptMap && liveMap === attemptMap) { attemptMap.remove(); liveMap = liveMarkers = undefined; }
    canvas.hidden = true; canvas.classList.remove('ready'); find('#map-scheme').hidden = false;
    mapControl.disabled = false; mapControl.hidden = false;
    status.textContent = 'Peta dasar belum tersedia · skema koordinat aktif';
  };
  try {
    await loadLeaflet();
    if (find('#peta').hidden) { mapAttempted = false; mapControl.disabled = false; return; }
    canvas.hidden = false;
    attemptMap = liveMap = L.map(canvas, { scrollWheelZoom: true, touchZoom: true, doubleClickZoom: true, zoomControl: false, maxZoom: 19 }).setView(campusCenter, 15);
    L.control.zoom({ position: 'bottomright' }).addTo(liveMap);
    L.control.scale({ imperial: false, position: 'bottomright' }).addTo(liveMap);
    liveMarkers = L.layerGroup().addTo(liveMap);
    const positions = places.filter(place => place.position).map(place => place.position);
    if (positions.length) liveMap.fitBounds(positions, { padding: [35, 35], maxZoom: 16 });
    if (selected?.position) liveMap.panTo(selected.position);
    const layer = L.tileLayer(tileUrl, { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
    timeout = setTimeout(fallback, 12000);
    let loadedTiles = 0;
    layer.on('tileload', () => { loadedTiles++; });
    layer.once('load', () => {
      if (liveMap !== attemptMap) return;
      if (!loadedTiles) return fallback();
      clearTimeout(timeout); find('#map-scheme').hidden = true; canvas.classList.add('ready'); mapControl.hidden = true; renderMap();
    });
    layer.addTo(liveMap); renderMap();
  } catch { fallback(); }
}

for (const item of homeCategories) {
  const home = document.createElement('button');
  home.type = 'button'; home.className = item.key ? 'category-button' : 'category-button all'; home.innerHTML = item.icon + '<span>' + item.label + '</span>';
  home.addEventListener('click', () => explore(item.key)); find('#categories').append(home);
  for (const target of ['#explore-categories', '#map-categories']) {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.category = item.key;
    button.innerHTML = item.icon + '<span>' + item.label + '</span>';
    if (target === '#map-categories') button.className = 'secondary';
    button.addEventListener('click', () => { if (target === '#map-categories') { FoodMapChat.release(); mapCategory = item.key; renderMap(); } else { filters.elements.category.value = item.key; renderResults(); } });
    find(target).append(button);
  }
}
find('#legend-items').innerHTML = homeCategories.filter(item => item.key).map(item => `<span><i style="background:${categoryColors[item.key]}"></i>${item.label}</span>`).join('');
find('#results').addEventListener('click', event => {
  const button = event.target.closest('[data-favorite]'); if (!button) return;
  const active = saveFavorite(button.dataset.favorite); button.setAttribute('aria-pressed', String(active)); button.textContent = active ? '♥' : '♡';
});
find('#home-all').addEventListener('click', event => { event.preventDefault(); explore(); });
find('.header-search').addEventListener('click', () => { location.hash = 'beranda'; requestAnimationFrame(() => find('#home-query').focus()); });
find('#home-search').addEventListener('submit', event => { event.preventDefault(); explore('', event.currentTarget.elements.q.value); queueMicrotask(searchWithAI); });
filters.addEventListener('input', renderResults);
// These controls are associated with the form but are outside its DOM subtree.
filters.elements.q.addEventListener('input', () => { clearAISearch(); renderResults(); });
filters.elements.sort.addEventListener('input', renderResults);
filters.addEventListener('reset', () => { clearAISearch(); explorePage = 1; queueMicrotask(renderResults); });
filters.addEventListener('submit', event => { event.preventDefault(); searchWithAI(); });
find('#use-ai').addEventListener('change', () => { clearAISearch(); renderResults(); });
find('#search-without-ai').addEventListener('click', () => { clearAISearch(); find('#use-ai').checked = false; renderResults(); });
find('#explore-pagination').addEventListener('click', event => {
  const button = event.target.closest('button[data-page]');
  if (!button || button.disabled) return;
  explorePage = Number(button.dataset.page);
  renderResults();
  find('.results-toolbar').scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
find('#toggle-explore-filters').addEventListener('click', () => setExploreFiltersOpen(!find('#jelajahi').classList.contains('explore-filters-open')));
for (const id of ['#close-explore-filters', '#explore-filter-backdrop']) find(id).addEventListener('click', () => { setExploreFiltersOpen(false); find('#toggle-explore-filters').focus(); });
find('#map-query').addEventListener('input', () => { FoodMapChat.release(); renderMap(); });
find('#map-sort').addEventListener('change', renderMap);
find('.bar nav a[href="#peta"]').addEventListener('click', () => {
  setMapListOpen(false);
  mapCardOpen = false;
  if (catalogReady) renderMap();
});
find('#toggle-map-list').addEventListener('click', () => setMapListOpen(find('#map-outlet-panel').hidden));
find('#close-map-list').addEventListener('click', () => { setMapListOpen(false); find('#toggle-map-list').focus(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && find('#jelajahi').classList.contains('explore-filters-open')) {
    setExploreFiltersOpen(false); find('#toggle-explore-filters').focus();
  }
  if (event.key === 'Escape' && !find('#peta').hidden && !find('#map-outlet-panel').hidden) {
    setMapListOpen(false); find('#toggle-map-list').focus();
  }
});
// Header height changes when navigation wraps on mobile or when a route changes.
const headerObserver = new ResizeObserver(() => {
  document.documentElement.style.setProperty('--nav-height', find('.top').getBoundingClientRect().height + 'px');
  if (!find('#jelajahi').hidden) requestAnimationFrame(() => fitFilterPanel());
  if (liveMap && !find('#peta').hidden) requestAnimationFrame(() => liveMap?.invalidateSize({ pan: true, animate: false }));
});
headerObserver.observe(find('.top'));
window.addEventListener('resize', () => fitFilterPanel());
find('#peta').addEventListener('click', event => {
  const button = event.target.closest('[data-map-place]'); if (button) chooseMapPlace(button.dataset.mapPlace);
  if (event.target.closest('.map-close')) { mapCardOpen = false; renderMap(); }
});
mapControl.hidden = !canLoadTiles;
mapControl.addEventListener('click', activateMap);
window.addEventListener('hashchange', route);

async function loadCatalog() {
  const status = find('#catalog-status');
  status.hidden = false;
  status.textContent = 'Memuat katalog outlet…';
  try {
    const response = await fetch('data/catalog.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Katalog gagal dimuat.');
    const catalog = FoodCatalog.load(await response.json());
    places = catalog.places; campusCenter = catalog.campusCenter; selected = undefined; catalogReady = true;
    if (!places.some(place => place.rating !== null)) {
      for (const select of [filters.elements.sort, find('#map-sort')]) {
        const option = select.querySelector('option[value="rating"]');
        if (option) { option.disabled = true; option.textContent = 'Rating belum tersedia'; }
      }
    }
    status.textContent = '';
    status.hidden = true;
    find('#recommendations').innerHTML = places.slice(0, 5).map(homeCard).join('');
    renderFilterGroups(); renderResults(); route();
  } catch {
    status.innerHTML = 'Katalog belum dapat dimuat. Buka website melalui server lokal atau GitHub Pages, lalu coba lagi. <button type="button" class="secondary" id="retry-catalog">Muat ulang katalog</button>';
    find('#retry-catalog').addEventListener('click', loadCatalog);
  }
}
FoodMapChat.init({
  isReady: () => catalogReady,
  getPlaces: () => places,
  photo, rangePrice,
  closeList: () => setMapListOpen(false),
  openList: () => setMapListOpen(true),
  selectPlace: chooseMapPlace,
  applyCriteria(criteria) {
    find('#map-query').value = ''; mapCategory = ''; find('#map-sort').value = '';
    mapCardOpen = false; selected = undefined;
    renderMap();
    if (liveMap) {
      const results = criteria ? FoodCatalog.search(places, FoodAI.toSearch(criteria)) : places;
      const positions = results.filter(place => place.position).map(place => place.position);
      const desktop = !window.matchMedia('(max-width: 999px)').matches && !find('#map-chat-panel').hidden;
      if (positions.length) liveMap.fitBounds(positions, { paddingTopLeft: [desktop ? 400 : 40, 40], paddingBottomRight: [40, 40], maxZoom: 16, animate: !reducedMotion.matches });
    }
  }
});
route();
loadCatalog();
