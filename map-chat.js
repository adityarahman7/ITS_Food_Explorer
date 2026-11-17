(function (root) {
  'use strict';
  let callbacks, currentCriteria = null, history = [], controller = null;
  const messages = [], $ = selector => document.querySelector(selector);
  const esc = value => root.FoodCatalog.escape(value);
  const money = amount => 'Rp' + new Intl.NumberFormat('id-ID').format(amount);
  const smallScreen = () => window.matchMedia('(max-width: 999px)').matches;

  function setOpen(open, focus = false) {
    $('#map-chat-panel').hidden = !open;
    $('#peta').classList.toggle('map-chat-open', open);
    $('#toggle-map-chat').setAttribute('aria-expanded', String(open));
    if (open) {
      callbacks?.closeList();
      requestAnimationFrame(() => { $('#map-chat-messages').scrollTop = $('#map-chat-messages').scrollHeight; });
    }
    if (focus) (open ? $('#map-chat-input') : $('#toggle-map-chat')).focus({ preventScroll: true });
  }

  function appendMessage(role, text, results = [], criteria = null) {
    const article = document.createElement('div');
    article.className = `map-chat-message map-chat-${role}`;
    const paragraph = document.createElement('p'); paragraph.textContent = text; article.append(paragraph);
    if (results.length) {
      const cards = document.createElement('div'); cards.className = 'map-chat-cards';
      for (const place of results.slice(0, 5)) {
        const matchingMenus = criteria && (criteria.queryKind === 'food' || criteria.minPrice !== null || criteria.maxPrice !== null)
          ? place.menu.filter(menu => root.FoodCatalog.search([{ ...place, menu: [menu] }], root.FoodAI.toSearch(criteria)).length).sort((a, b) => a.price - b.price) : [];
        const priceCaption = matchingMenus.length ? `${matchingMenus[0].name} · ${money(matchingMenus[0].price)}` : callbacks.rangePrice(place);
        const card = document.createElement('button'); card.type = 'button'; card.className = 'map-chat-result';
        card.setAttribute('aria-label', `Lihat pada peta: ${place.name}`);
        card.innerHTML = `${callbacks.photo(place)}<span><strong>${esc(place.name)}</strong><small>${esc(place.area)}</small><small>${esc(priceCaption)}</small></span><span class="map-chat-arrow" aria-hidden="true">↗</span>`;
        card.addEventListener('click', () => {
          currentCriteria = root.FoodAI.validate(criteria);
          callbacks.applyCriteria(currentCriteria);
          updateSummary(); callbacks.selectPlace(place.id);
          if (smallScreen()) setOpen(false);
        });
        cards.append(card);
      }
      article.append(cards);
      if (results.length > 5) {
        const more = document.createElement('button'); more.type = 'button'; more.className = 'map-chat-more secondary'; more.textContent = `Lihat semua ${results.length} outlet`;
        more.addEventListener('click', () => {
          currentCriteria = root.FoodAI.validate(criteria); callbacks.applyCriteria(currentCriteria); updateSummary();
          if (smallScreen()) setOpen(false);
          callbacks.openList();
        }); article.append(more);
      }
    }
    messages.push(article); $('#map-chat-messages').append(article);
    while (messages.length > 16) messages.shift().remove();
    $('#map-chat-messages').scrollTop = $('#map-chat-messages').scrollHeight;
  }

  function updateSummary() {
    $('#map-chat-active').hidden = !currentCriteria;
    $('#clear-map-chat').hidden = !currentCriteria;
    if (!currentCriteria) return;
    const c = currentCriteria;
    $('#map-chat-summary').textContent = [c.query, c.category, ...c.campusAreas, ...c.areas, ...c.facilities,
      c.minPrice !== null ? `≥ ${money(c.minPrice)}` : '', c.maxPrice !== null ? `≤ ${money(c.maxPrice)}` : '',
      c.maxDistanceKm !== null ? `${c.maxDistanceKm} km dari ITS` : '',
      ({ nearest: 'Terdekat dari ITS', price: 'Harga terendah', rating: 'Rating tertinggi' })[c.sort]].filter(Boolean).join(' · ') || 'Semua outlet';
  }

  function setBusy(busy) {
    $('#send-map-chat').disabled = busy;
    $('#map-chat-input').disabled = busy;
    $('#map-chat-form').setAttribute('aria-busy', String(busy));
    $('#map-chat-progress').hidden = !busy;
    $('#map-chat-messages').scrollTop = $('#map-chat-messages').scrollHeight;
  }

  function release(announce = true) {
    const hadCriteria = Boolean(currentCriteria);
    controller?.abort(); controller = null; setBusy(false);
    currentCriteria = null; history = []; updateSummary();
    if (hadCriteria && announce) appendMessage('assistant', 'Pencarian manual aktif. Filter chat sebelumnya dilepas; kamu bisa mulai percakapan baru kapan saja.');
  }

  function reset() {
    release(false); messages.splice(0); $('#map-chat-messages').replaceChildren();
    $('#map-chat-input').value = ''; callbacks.applyCriteria(null);
    appendMessage('assistant', 'Mau makan apa di sekitar ITS? Coba “ayam maksimal 15 ribu”, lalu lanjutkan “yang di luar kampus saja”. Aku akan menyaring outlet di peta sesuai data yang tersedia.');
  }

  async function submit(event) {
    event.preventDefault();
    const query = $('#map-chat-input').value.trim();
    if (!query || query.length > 300 || controller) return;
    if (!callbacks.isReady()) { appendMessage('assistant', 'Katalog belum siap. Coba lagi setelah data selesai dimuat.'); return; }
    appendMessage('user', query); $('#map-chat-input').value = '';
    let endpoint;
    const local = ['localhost', '127.0.0.1'].includes(location.hostname), configured = root.FOOD_AI_CONFIG?.endpoint || '';
    try {
      endpoint = new URL(configured || '/api/search', location.href);
      if ((!configured && !local) || (endpoint.protocol !== 'https:' && !(local && endpoint.origin === location.origin))) throw new Error();
    } catch { appendMessage('assistant', 'AI belum aktif pada alamat website ini. Kamu tetap bisa memakai pencarian dan kategori di peta.'); return; }
    const active = new AbortController(); controller = active; setBusy(true);
    const timer = setTimeout(() => active.abort(), 24000);
    const body = { query };
    if (currentCriteria) body.context = { criteria: currentCriteria, history: history.slice(-4) };
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', body: JSON.stringify(body), signal: active.signal });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'AI_UNAVAILABLE');
      const criteria = root.FoodAI.validate(payload.criteria);
      if (controller !== active) return;
      currentCriteria = criteria; history.push(query); history = history.slice(-4);
      const results = root.FoodCatalog.sort(root.FoodCatalog.search(callbacks.getPlaces(), root.FoodAI.toSearch(criteria)), criteria.sort);
      callbacks.applyCriteria(criteria); updateSummary();
      const notes = [];
      if (criteria.minPrice !== null || criteria.maxPrice !== null) notes.push('Harga memakai menu ilustratif; outlet tanpa data harga tidak disertakan.');
      if (criteria.facilities.length) notes.push('Fasilitas hanya dicocokkan jika tercatat di katalog.');
      if (criteria.maxDistanceKm !== null || criteria.sort === 'nearest') notes.push('Jarak diukur garis lurus dari titik acuan ITS.');
      if (criteria.unsupported.length) notes.push(`Belum dapat dipastikan: ${criteria.unsupported.join(', ')}. Hasil mengikuti syarat lain yang dapat diperiksa.`);
      const intro = results.length ? `Ada ${results.length} outlet yang cocok. ${results.length > 5 ? 'Berikut lima pilihan; semua hasil ditandai di peta.' : 'Klik kartu untuk melihat lokasinya di peta.'}` : 'Belum ada outlet yang cocok pada data kita. Coba longgarkan syarat atau Mulai ulang; data menu, harga, dan fasilitas belum lengkap.';
      appendMessage('assistant', [intro, ...notes].join('\n\n'), results, criteria);
    } catch (error) {
      if (controller !== active) return;
      const text = root.FoodAI.errorMessage(active.signal.aborted ? 'AI_TIMEOUT' : error.message);
      appendMessage('assistant', `${text} Hasil peta sebelumnya tetap tersedia. Kamu bisa memakai pencarian manual di peta.`);
    } finally {
      clearTimeout(timer);
      if (controller === active) { controller = null; setBusy(false); if (!$('#map-chat-panel').hidden && !$('#peta').hidden) $('#map-chat-input').focus({ preventScroll: true }); }
    }
  }

  root.FoodMapChat = {
    get criteria() { return currentCriteria; },
    setOpen, release,
    init(options) {
      callbacks = options; reset();
      setOpen(!smallScreen());
      $('#map-chat-form').addEventListener('submit', submit);
      $('#toggle-map-chat').addEventListener('click', () => setOpen(true, true));
      $('#close-map-chat').addEventListener('click', () => setOpen(false, true));
      $('#clear-map-chat').addEventListener('click', reset);
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !$('#peta').hidden && !$('#map-chat-panel').hidden) setOpen(false, true);
      });
    }
  };
})(globalThis);
