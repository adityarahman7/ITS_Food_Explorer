const places = [
  {"id":"nasi","name":"Nasi Goreng ITS","category":"Makanan berat","icon":"🍚","color":"lilac","x":53,"y":42,"distance":0.3,"rating":4.7,"reviews":120,"hours":"07.00 – 21.00","area":"Dalam kampus ITS","tags":["Nasi Goreng","Aneka Nasi","Minuman"],"facilities":["Wi-Fi","Tempat Duduk"],"badge":"Dalam Kampus","tone":"purple","wifi":true,"menu":[["Nasi Goreng reguler",15000],["Paket makan",25000]],"coverX":445,"coverY":414},
  {"id":"mie","name":"Warung Bu Sari","category":"Bakso & mie","icon":"🍜","color":"peach","x":28,"y":58,"distance":0.5,"rating":4.5,"reviews":98,"hours":"06.00 – 22.00","area":"Kampus ITS (sekitar)","tags":["Nasi Goreng","Bakso","Mie"],"facilities":["Tempat Duduk","Parkir Motor"],"badge":"Favorit Mahasiswa","tone":"green","wifi":false,"menu":[["Nasi Goreng reguler",12000],["Paket makan",20000]],"coverX":762,"coverY":414},
  {"id":"ayam","name":"Nasi Goreng Cak Man","category":"Makanan berat","icon":"🍛","color":"peach","x":62,"y":25,"distance":0.8,"rating":4.6,"reviews":76,"hours":"07.00 – 23.00","area":"Kampus ITS (sekitar)","tags":["Nasi Goreng","Mie","Camilan"],"facilities":["Tempat Duduk","Outdoor"],"badge":"Harga Terjangkau","tone":"amber","wifi":false,"menu":[["Nasi Goreng reguler",10000],["Paket makan",18000]],"coverX":1079,"coverY":414},
  {"id":"warung","name":"Warung Maknyus","category":"Makanan berat","icon":"🍛","color":"peach","x":72,"y":47,"distance":1.2,"rating":4.4,"reviews":63,"hours":"10.00 – 22.00","area":"Keputih","tags":["Nasi Goreng","Ayam","Minuman"],"facilities":["Tempat Duduk","Parkir Motor"],"badge":"Dekat Keputih","tone":"blue","wifi":false,"menu":[["Nasi Goreng reguler",15000],["Paket makan",25000]],"coverX":1397,"coverY":414},
  {"id":"kantin","name":"Kantin Teknik","category":"Makanan berat","icon":"🍽️","color":"mint","x":40,"y":72,"distance":0.4,"rating":4.8,"reviews":210,"hours":"07.00 – 23.00","area":"Dalam kampus ITS","tags":["Nasi Goreng","Mie","Minuman"],"facilities":["Wi-Fi","Tempat Duduk","AC / Indoor"],"badge":"Ada Wi-Fi","tone":"green","wifi":true,"menu":[["Nasi Goreng reguler",12000],["Paket makan",22000]],"coverX":445,"coverY":698},
  {"id":"kopi","name":"Warkop Mahasiswa","category":"Kopi","icon":"☕","color":"mint","x":76,"y":66,"distance":1,"rating":4.5,"reviews":88,"hours":"06.00 – 23.00","area":"Sukolilo","tags":["Nasi Goreng","Kopi","Camilan"],"facilities":["Wi-Fi","Tempat Duduk","Outdoor"],"badge":"Populer","tone":"red","wifi":true,"menu":[["Nasi Goreng reguler",10000],["Paket kopi",20000]],"coverX":762,"coverY":698},
  {"id":"rini","name":"Nasi Goreng Mbak Rini","category":"Makanan berat","icon":"🍚","color":"lilac","x":23,"y":34,"distance":0.6,"rating":4.3,"reviews":54,"hours":"07.00 – 21.00","area":"Kampus ITS (sekitar)","tags":["Nasi Goreng","Ayam","Minuman"],"facilities":["Tempat Duduk","Parkir Motor"],"badge":"Dekat Kampus","tone":"purple","wifi":false,"menu":[["Nasi Goreng reguler",12000],["Paket makan",20000]],"coverX":1079,"coverY":698},
  {"id":"dapoer","name":"Dapoer Kampus","category":"Makanan berat","icon":"🍽️","color":"mint","x":54,"y":70,"distance":0.9,"rating":4.6,"reviews":91,"hours":"10.00 – 22.00","area":"Menur","tags":["Nasi Goreng","Seafood","Minuman"],"facilities":["Wi-Fi","Tempat Duduk","AC / Indoor","Outdoor"],"badge":"Suasana Nyaman","tone":"pink","wifi":true,"menu":[["Nasi Goreng reguler",15000],["Paket makan",30000]],"coverX":1397,"coverY":698}
];
const homeCategories = [{"key":"","label":"Semua","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/></svg>"},{"key":"Makanan berat","label":"Makanan Berat","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12h18a9 9 0 0 1-18 0ZM8 21h8M8 9c-2-2 2-3 0-5m5 5c-2-2 2-3 0-5\"/></svg>"},{"key":"Minuman","label":"Minuman","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 8h14l-2 13H7L5 8ZM4 8h16M12 8l2-5 4-1\"/></svg>"},{"key":"Camilan","label":"Camilan","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 3h10l-2 5 4 4 2 8-4 2H7l-4-2 2-8 4-4-2-5Z\"/><path d=\"M9 13h6m-6 4h6\"/></svg>"},{"key":"Bakso & mie","label":"Bakso & Mie","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12h18a9 9 0 0 1-18 0ZM8 21h8M8 9V6l12-4M12 9V7l8-2\"/></svg>"},{"key":"Kopi","label":"Kopi","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm13 1h2a2 2 0 0 1 0 4h-2M3 22h16M8 5V2m4 3V2\"/></svg>"},{"key":"Dessert","label":"Dessert","icon":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 12 12 22l5-10M6 12h12a3 3 0 0 0 0-6 6 6 0 0 0-12 0 3 3 0 0 0 0 6Z\"/></svg>"}];
const find = selector => document.querySelector(selector);
const filters = find('#filters');
const currency = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
const rupiah = amount => 'Rp' + currency.format(amount);
let selected = places[0];

function minPrice(place) {
  return Math.min(...place.menu.map(([, price]) => price));
}

const priceBands = [
  { label: '< Rp10.000', min: 0, max: 9999 },
  { label: 'Rp10.000 – Rp20.000', min: 10000, max: 20000 },
  { label: 'Rp20.001 – Rp35.000', min: 20001, max: 35000 },
  { label: '> Rp35.000', min: 35001, max: Infinity }
];
const filterGroups = [
  { name: 'area', label: 'Lokasi', values: ['Dalam kampus ITS', 'Kampus ITS (sekitar)', 'Keputih', 'Menur', 'Sukolilo', 'Lainnya'], matches: (place, value) => place.area === value },
  { name: 'price', label: 'Rentang Harga', values: priceBands.map(band => band.label), matches: (place, value) => {
    const band = priceBands.find(item => item.label === value);
    return place.menu.some(([, price]) => price >= band.min && price <= band.max);
  }},
  { name: 'food', label: 'Jenis Makanan', values: ['Nasi Goreng', 'Mie', 'Bakso & Mie', 'Ayam', 'Seafood', 'Minuman', 'Camilan', 'Kopi'], matches: (place, value) => value === 'Bakso & Mie' ? place.tags.some(tag => ['Bakso', 'Mie'].includes(tag)) : place.tags.includes(value) },
  { name: 'facility', label: 'Fasilitas', values: ['Wi-Fi', 'Tempat Duduk', 'Parkir Motor', 'AC / Indoor', 'Outdoor'], matches: (place, value) => place.facilities.includes(value) }
];

function renderFilterGroups() {
  find('#filter-groups').innerHTML = filterGroups.map(group => `<fieldset class="explore-filter-group">
    <legend>${group.label}</legend>
    ${group.values.map(value => {
      const count = places.filter(place => group.matches(place, value)).length;
      return `<label><input type="checkbox" name="${group.name}" value="${value}"><span>${value} <small>(${count})</small></span></label>`;
    }).join('')}
  </fieldset>`).join('');
}

let favorites;
try { favorites = new Set(JSON.parse(localStorage.getItem('its-food-favorites') || '[]')); }
catch { favorites = new Set(); }

function exploreCard(place) {
  const prices = place.menu.map(([, price]) => price);
  const favorite = favorites.has(place.id);
  return `<article class="explore-card">
    <div class="explore-cover">
      <a href="#detail/${place.id}" aria-label="Lihat detail ${place.name}">
        <svg viewBox="${place.coverX + 8} ${place.coverY - 3} 135 63" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <image href="UI/2.png" width="1672" height="941"/>
        </svg>
      </a>
      <span class="explore-badge ${place.tone}">♧ ${place.badge}</span>
      <button type="button" class="favorite-button" data-favorite="${place.id}" aria-label="Favorit ${place.name}" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
      <span class="rating"><span aria-hidden="true">★</span> ${place.rating.toFixed(1)} <small>(${place.reviews})</small></span>
    </div>
    <div class="explore-card-body">
      <h3><a href="#detail/${place.id}">${place.name}</a></h3>
      <div class="card-meta"><span>${rupiah(minPrice(place))} – ${currency.format(Math.max(...prices))}</span><span>♧ ${place.distance.toFixed(1)} km</span></div>
      <div class="food-tags">${place.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
      <p class="hours"><strong>Buka</strong> <span>·</span> ${place.hours}</p>
    </div>
  </article>`;
}

function renderResults() {
  const originalQuery = filters.elements.q.value.trim();
  const query = originalQuery.toLowerCase().replace(/\b(dekat|sekitar)\s+(kampus\s+)?its\s*$/i, '').trim();
  const category = filters.elements.category.value;
  const data = new FormData(filters);
  const activeGroups = filterGroups.map(group => ({ ...group, selected: data.getAll(group.name) }));
  const results = places.filter(place => {
    const searchable = [place.name, place.category, place.area, ...place.tags, ...place.menu.map(([name]) => name)].join(' ').toLowerCase();
    const matchesCategory = !category || place.category === category || place.tags.some(tag => tag.toLowerCase() === category.toLowerCase());
    return searchable.includes(query) && matchesCategory && activeGroups.every(group => !group.selected.length || group.selected.some(value => group.matches(place, value)));
  });
  const sort = filters.elements.sort.value;
  if (sort === 'nearest') results.sort((a, b) => a.distance - b.distance);
  if (sort === 'price') results.sort((a, b) => minPrice(a) - minPrice(b));
  if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  find('#result-count').textContent = 'Menampilkan ' + results.length + ' hasil' + (originalQuery ? ' untuk “' + originalQuery + '”' : '');
  find('#results').innerHTML = results.length ? results.map(exploreCard).join('') : '<div class="explore-empty"><h2>Belum ada hasil</h2><p>Coba ganti kata kunci atau reset filter.</p></div>';
  for (const chip of find('#explore-categories').querySelectorAll('button')) {
    chip.setAttribute('aria-pressed', String(chip.dataset.category === category));
  }
}

const categoryColors = {
  'Makanan berat': '#6339f5', 'Minuman': '#c2410c', 'Camilan': '#15803d',
  'Bakso & mie': '#be185d', 'Kopi': '#0f766e', 'Dessert': '#a16207'
};
const picture = (file, box, className = '') => `<svg class="${className}" viewBox="${box}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="UI/${file}" width="1672" height="941"/></svg>`;
const placePicture = place => picture('2.png', `${place.coverX + 8} ${place.coverY - 3} 135 63`);
const rangePrice = place => rupiah(minPrice(place)) + ' – ' + currency.format(Math.max(...place.menu.map(([, price]) => price)));
const ratingText = place => `<span class="detail-star">★</span> <strong>${place.rating.toFixed(1)}</strong> <span>(${place.reviews} ulasan contoh)</span>`;

function saveFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  try { localStorage.setItem('its-food-favorites', JSON.stringify([...favorites])); } catch {}
  return favorites.has(id);
}

function renderDetail(place) {
  const slides = place.id === 'nasi' ? [
    picture('3.png', '97 122 380 245'),
    picture('3.png', '548 118 150 77'),
    picture('3.png', '548 211 150 72')
  ] : [placePicture(place)];
  const relativeDistance = item => Math.hypot(item.x - place.x, item.y - place.y);
  const nearby = places.filter(item => item.id !== place.id).sort((a, b) => relativeDistance(a) - relativeDistance(b)).slice(0, 3);
  const menuPhotos = ['60 536 133 109', '209 536 135 109', '360 536 134 109', '510 536 135 109', '662 536 135 109'];
  const sampleMenu = place.id === 'nasi'
    ? [['Nasi Goreng Spesial', 18000], ['Nasi Goreng Ayam', 15000], ['Nasi Goreng Seafood', 22000], ['Mie Goreng', 15000], ['Es Teh Manis', 5000]]
    : place.menu;
  find('#place-detail').innerHTML = `
    <div class="detail-top">
      <div class="detail-gallery">
        <div class="detail-main-photo">
          <div id="main-photo">${slides[0]}</div>
          ${slides.length > 1 ? '<button class="gallery-arrow prev" type="button" aria-label="Foto sebelumnya">‹</button><button class="gallery-arrow next" type="button" aria-label="Foto berikutnya">›</button><span id="photo-count">1 / 3</span>' : ''}
        </div>
        ${slides.length > 1 ? `<div class="detail-thumbs">${slides.slice(1).map((slide, i) => `<button type="button" data-photo="${i + 1}" aria-label="Tampilkan foto ${i + 2}">${slide}</button>`).join('')}<a href="#detail-foto" data-jump="detail-foto">▣<br>Lihat Semua Foto</a></div>` : ''}
      </div>
      <div class="detail-intro">
        <div class="detail-intro-top">
          <div><span class="pill">${place.badge}</span> <span class="card-tag">${place.category}</span></div>
          <div class="detail-actions"><button class="secondary" type="button" id="detail-save" aria-pressed="${favorites.has(place.id)}">${favorites.has(place.id) ? '♥ Tersimpan' : '♡ Simpan'}</button><button type="button" id="detail-share">Bagikan</button></div>
        </div>
        <h1>${place.name}</h1>
        <p class="detail-rating">${ratingText(place)}</p>
        <p>Pilihan kuliner contoh di ${place.area}. Informasi harga, fasilitas, foto, dan ulasan bersifat ilustratif.</p>
        <div class="detail-metrics">
          <div><strong>${rangePrice(place)}</strong><small>Kisaran paket utama</small></div>
          <div><strong>${place.hours}</strong><small>Jam operasional contoh</small></div>
          <div><strong>${place.distance.toFixed(1)} km</strong><small>Jarak contoh dari ITS</small></div>
          <span class="detail-open">● Buka · Contoh</span>
        </div>
        <p id="share-status" role="status"></p>
      </div>
    </div>
    <div class="detail-columns">
      <div>
        <nav class="detail-tabs" aria-label="Bagian detail">
          ${[['Menu','menu'],['Ulasan','ulasan'],['Informasi','informasi'],['Lokasi','lokasi'],['Foto','foto']].map(([label, id], i) => `<button type="button" class="secondary" data-jump="detail-${id}" ${i === 0 ? 'aria-current="location"' : ''}>${label}</button>`).join('')}
        </nav>
        <section class="panel detail-block" id="detail-menu"><h2>Menu Andalan</h2><div class="detail-menu-grid">
          ${sampleMenu.map(([name, price], index) => `<article>${place.id === 'nasi' ? picture('3.png', menuPhotos[index]) : placePicture(place)}<strong>${name}</strong><p>${rupiah(price)}</p></article>`).join('')}
        </div></section>
        <section class="panel detail-block" id="detail-ulasan"><h2>Ulasan Pengguna <small>Contoh</small></h2>
          <div class="review-grid"><article><b>Pengunjung A</b><p class="detail-star">★★★★★</p><p>Porsinya pas untuk makan siang di sekitar kampus.</p></article><article><b>Pengunjung B</b><p class="detail-star">★★★★☆</p><p>Pilihan menu mudah dibandingkan sebelum berkunjung.</p></article></div>
        </section>
        <section class="panel detail-block" id="detail-foto"><h2>Foto Ilustratif</h2><div class="detail-photo-grid">${slides.join('')}</div></section>
      </div>
      <section class="panel detail-block" id="detail-informasi">
        <h2>Informasi Tempat</h2>
        <dl class="place-facts"><dt>Lokasi contoh</dt><dd>${place.area}, Surabaya</dd><dt>Kategori</dt><dd>${place.tags.join(', ')}</dd><dt>Harga</dt><dd>${rangePrice(place)}</dd><dt>Jam Operasional</dt><dd>${place.hours}</dd><dt>Fasilitas</dt><dd>${place.facilities.map(item => `<span class="card-tag">${item}</span>`).join('')}</dd></dl>
        <div id="detail-lokasi"><h2>Lokasi</h2><a href="#peta/${place.id}" class="detail-mini-map" aria-label="Lihat lokasi contoh di Peta Kuliner">${picture('3.png','853 828 373 92')}<span>Lihat di Peta →</span></a></div>
      </section>
      <div>
        <div class="detail-promo"><h2>Makan enak bareng teman, lebih seru!</h2><a class="button" href="#jelajahi">Jelajahi Tempat Lain →</a></div>
        <section class="panel detail-block"><h2>Tempat Makan Terdekat <small>Contoh</small></h2>
          ${nearby.map(item => `<a class="nearby-item" href="#detail/${item.id}">${placePicture(item)}<span><b>${item.name}</b><br><span class="detail-star">★</span> ${item.rating.toFixed(1)} · ${item.distance.toFixed(1)} km</span></a>`).join('')}
        </section>
      </div>
    </div>`;
  let photo = 0;
  function showPhoto(index) {
    photo = (index + slides.length) % slides.length;
    find('#main-photo').innerHTML = slides[photo];
    find('#photo-count').textContent = (photo + 1) + ' / ' + slides.length;
  }
  find('.gallery-arrow.prev')?.addEventListener('click', () => showPhoto(photo - 1));
  find('.gallery-arrow.next')?.addEventListener('click', () => showPhoto(photo + 1));
  document.querySelectorAll('#detail [data-photo]').forEach(button => button.addEventListener('click', () => showPhoto(Number(button.dataset.photo))));
  document.querySelectorAll('#detail [data-jump]').forEach(control => control.addEventListener('click', event => {
    event.preventDefault();
    document.querySelectorAll('.detail-tabs [aria-current]').forEach(button => button.removeAttribute('aria-current'));
    if (control.matches('.detail-tabs button')) control.setAttribute('aria-current', 'location');
    document.getElementById(control.dataset.jump).scrollIntoView({ block: 'start' });
  }));
  find('#detail-save').addEventListener('click', event => {
    const active = saveFavorite(place.id);
    event.currentTarget.setAttribute('aria-pressed', String(active));
    event.currentTarget.textContent = active ? '♥ Tersimpan' : '♡ Simpan';
  });
  find('#detail-share').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); find('#share-status').textContent = 'Tautan disalin untuk pratinjau ini.'; }
    catch { find('#share-status').textContent = 'Salin alamat dari bilah URL browser.'; }
  });
}

function route() {
  const [requested, id] = location.hash.slice(1).split('/');
  const page = ['beranda', 'jelajahi', 'detail', 'peta'].includes(requested) ? requested : 'beranda';
  for (const section of document.querySelectorAll('.page')) section.hidden = section.id !== page;
  for (const link of document.querySelectorAll('nav a')) {
    if (link.hash === '#' + page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  const place = places.find(item => item.id === id);
  if (page === 'detail') {
    if (place) renderDetail(place);
    else find('#place-detail').innerHTML = '<p>Tempat tidak ditemukan. Pilih tempat dari Jelajahi.</p>';
  }
  if (page === 'jelajahi') renderResults();
  if (page === 'peta') {
    if (place) {
      mapCategory = '';
      find('#map-query').value = '';
      selected = place;
      mapCardOpen = true;
    }
    renderMap();
    requestAnimationFrame(() => {
      if (find('#peta').hidden) return;
      if (liveMap) {
        liveMap.invalidateSize({ pan: false });
        if (place) liveMap.panTo(sampleLatLng(place));
      } else if (!mapAttempted && canLoadTiles) {
        activateMap();
      }
    });
  }
  window.scrollTo(0, 0);
}

const covers = {
  nasi: { x: 146, label: 'Dalam Kampus', tone: 'purple' },
  mie: { x: 452, label: 'Pilihan Kuliner', tone: 'green' },
  ayam: { x: 758, label: 'Harga Terjangkau', tone: 'amber' },
  warung: { x: 1060, label: 'Sekitar Kampus', tone: 'blue' },
  kantin: { x: 1377, label: 'Ada Wi-Fi', tone: 'green' }
};

function homeCard(place) {
  const cover = covers[place.id];
  const prices = place.menu.map(([, price]) => price);
  return `<a class="card home-card" href="#detail/${place.id}">
    <div class="home-card-image">
      <svg viewBox="${cover.x} 745 144 68" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <image href="UI/1.png" width="1672" height="941"/>
      </svg>
      <span class="card-badge ${cover.tone}">${cover.label}</span>
    </div>
    <div class="home-card-body">
      <h3>${place.name}</h3><p>${rupiah(minPrice(place))} – ${rupiah(Math.max(...prices))}</p>
      <span class="card-tag">${place.category}</span>${place.wifi ? '<span class="card-tag">Wi-Fi</span>' : ''}
    </div>
  </a>`;
}

function explore(category = '', query = '') {
  filters.reset();
  filters.elements.category.value = category;
  filters.elements.q.value = query;
  location.hash = 'jelajahi';
  renderResults();
}

find('#recommendations').innerHTML = ['nasi', 'mie', 'ayam', 'warung', 'kantin']
  .map(id => homeCard(places.find(place => place.id === id))).join('');
renderFilterGroups();
for (const item of homeCategories) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.dataset.category = item.key;
  chip.innerHTML = item.icon + '<span>' + item.label + '</span>';
  chip.addEventListener('click', () => {
    filters.elements.category.value = item.key;
    renderResults();
  });
  find('#explore-categories').append(chip);
}
find('#results').addEventListener('click', event => {
  const button = event.target.closest('[data-favorite]');
  if (!button) return;
  const id = button.dataset.favorite;
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  const active = favorites.has(id);
  button.setAttribute('aria-pressed', String(active));
  button.textContent = active ? '♥' : '♡';
  try { localStorage.setItem('its-food-favorites', JSON.stringify([...favorites])); } catch {}
});
for (const item of homeCategories) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = item.key ? 'category-button' : 'category-button all';
  button.innerHTML = item.icon + '<span>' + item.label + '</span>';
  button.addEventListener('click', () => explore(item.key));
  find('#categories').append(button);
}
find('#home-all').addEventListener('click', event => {
  event.preventDefault();
  explore();
});
find('.header-search').addEventListener('click', () => {
  if (find('#beranda').hidden) location.hash = 'beranda';
  else find('#home-query').focus();
  requestAnimationFrame(() => find('#home-query').focus());
});
find('#home-search').addEventListener('submit', event => {
  event.preventDefault();
  explore('', event.currentTarget.elements.q.value);
});
filters.addEventListener('input', renderResults);
filters.elements.q.addEventListener('input', renderResults);
filters.elements.sort.addEventListener('input', renderResults);
filters.addEventListener('reset', () => queueMicrotask(renderResults));
filters.addEventListener('submit', event => {
  event.preventDefault();
  renderResults();
});

let mapCategory = '';
let mapCardOpen = true;
let liveMap;
let liveMarkers;
let mapAttempted = false;
const canLoadTiles = ['http:', 'https:'].includes(location.protocol);
const mapAssets = new Map();
const campusCenter = [-7.281, 112.795];
const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const mapIcon = key => homeCategories.find(item => item.key === key)?.icon || '●';
const sampleLatLng = place => [
  campusCenter[0] - (place.y - 50) * 0.00009,
  campusCenter[1] + (place.x - 50) * 0.00012
];

function renderMap() {
  const query = find('#map-query').value.trim().toLowerCase();
  const visible = places.filter(place => place.name.toLowerCase().includes(query) &&
    (!mapCategory || place.category === mapCategory || place.tags.some(tag => tag.toLowerCase() === mapCategory.toLowerCase())));
  const sort = find('#map-sort').value;
  if (sort === 'near') visible.sort((a, b) => a.distance - b.distance);
  if (sort === 'rating') visible.sort((a, b) => b.rating - a.rating);
  if (!visible.includes(selected)) selected = visible[0];
  find('#map-count').textContent = 'Daftar Tempat Makan (' + visible.length + ')';
  find('#map-list').innerHTML = visible.length ? visible.map(place => `
    <button type="button" class="map-place" data-map-place="${place.id}" aria-pressed="${place === selected && mapCardOpen}">
      ${placePicture(place)}<span><b>${place.name}</b><small><span class="detail-star">★</span> ${place.rating.toFixed(1)} · ${place.distance.toFixed(1)} km</small><small>${rangePrice(place)}</small></span>
    </button>`).join('') : '<p>Belum ada tempat yang cocok.</p>';
  find('#markers').innerHTML = visible.map(place => `
    <button type="button" class="map-marker" data-map-place="${place.id}" aria-label="${place.name}" aria-pressed="${place === selected && mapCardOpen}"
      style="left:${place.x}%;top:${place.y}%;--pin-color:${categoryColors[place.category]}"><span>${mapIcon(place.category)}</span></button>`).join('');
  for (const chip of find('#map-categories').querySelectorAll('button')) {
    chip.setAttribute('aria-pressed', String(chip.dataset.category === mapCategory));
  }
  const card = find('#map-selection');
  card.hidden = !selected || !mapCardOpen;
  card.innerHTML = card.hidden ? '' : `<div class="map-popup-summary">${placePicture(selected)}
    <div><h3>${selected.name}</h3><p>${ratingText(selected)}</p><p>${rangePrice(selected)}</p><p>${selected.hours} · Contoh</p></div></div>
    <button type="button" class="map-close secondary" aria-label="Tutup ringkasan">×</button>
    <a class="button" href="#detail/${selected.id}">Lihat Detail →</a>`;
  if (liveMarkers) {
    liveMarkers.clearLayers();
    for (const place of visible) {
      const icon = L.divIcon({
        className: 'live-pin',
        html: `<span style="--pin-color:${categoryColors[place.category]}">${mapIcon(place.category)}</span>`,
        iconSize: [38, 38], iconAnchor: [19, 19]
      });
      L.marker(sampleLatLng(place), { icon, title: place.name, alt: place.name })
        .on('click', () => chooseMapPlace(place.id)).addTo(liveMarkers);
    }
  }
}

function chooseMapPlace(id) {
  selected = places.find(place => place.id === id);
  mapCardOpen = true;
  renderMap();
  if (liveMap && selected) liveMap.panTo(sampleLatLng(selected));
}

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

const mapControl = find('#enable-map');
mapControl.hidden = !canLoadTiles;
if (!canLoadTiles) find('#map-status').textContent = 'Skema lokal · Buka lewat localhost untuk menampilkan OSM';
mapControl.addEventListener('click', activateMap);

async function activateMap() {
  const control = mapControl;
  if (!canLoadTiles || control.disabled || liveMap) return;
  mapAttempted = true;
  const status = find('#map-status');
  control.disabled = true;
  status.textContent = 'Memuat peta dasar…';
  try {
    await loadLeaflet();
    if (find('#peta').hidden) {
      mapAttempted = false;
      control.disabled = false;
      status.textContent = 'Skema peta lokal';
      return;
    }
    const canvas = find('#live-map');
    canvas.hidden = false;
    liveMap = L.map(canvas, { scrollWheelZoom: false, maxZoom: 19 })
      .setView(selected ? sampleLatLng(selected) : campusCenter, 16);
    L.control.scale({ imperial: false, position: 'bottomright' }).addTo(liveMap);
    liveMarkers = L.layerGroup().addTo(liveMap);
    const layer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const fallback = () => {
      clearTimeout(timeout);
      liveMap.remove();
      liveMap = liveMarkers = undefined;
      canvas.hidden = true;
      control.disabled = false;
      status.textContent = 'Peta dasar belum tersedia · Skema lokal aktif';
    };
    const timeout = setTimeout(fallback, 12000);
    let loadedTiles = 0;
    layer.on('tileload', () => { loadedTiles += 1; });
    layer.once('load', () => {
      if (!loadedTiles) return fallback();
      clearTimeout(timeout);
      find('#map-scheme').hidden = true;
      canvas.classList.add('ready');
      control.hidden = true;
      status.textContent = 'Peta dasar OSM · Posisi penanda dummy';
    });
    layer.addTo(liveMap);
    renderMap();
  } catch {
    if (liveMap) liveMap.remove();
    liveMap = liveMarkers = undefined;
    find('#live-map').hidden = true;
    status.textContent = 'Peta dasar gagal dimuat · Skema lokal aktif';
    control.disabled = false;
  }
}

for (const item of homeCategories) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'secondary';
  chip.dataset.category = item.key;
  chip.innerHTML = item.icon + '<span>' + item.label + '</span>';
  chip.addEventListener('click', () => { mapCategory = item.key; renderMap(); });
  find('#map-categories').append(chip);
}
find('#legend-items').innerHTML = homeCategories.filter(item => item.key).map(item =>
  `<span><i style="background:${categoryColors[item.key]}"></i>${item.label}</span>`).join('');
find('#map-query').addEventListener('input', renderMap);
find('#map-sort').addEventListener('change', renderMap);
find('#peta').addEventListener('click', event => {
  const button = event.target.closest('[data-map-place]');
  if (button) chooseMapPlace(button.dataset.mapPlace);
  if (event.target.closest('.map-close')) { mapCardOpen = false; renderMap(); }
});

window.addEventListener('hashchange', route);
route();
