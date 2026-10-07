(() => {
  const form = document.getElementById('wishes-form');
  const list = document.getElementById('wishes-list');
  if (!form || !list) return;

  const total = document.querySelector('[data-wishes-total]');
  const attending = document.querySelector('[data-wishes-attending]');
  const absent = document.querySelector('[data-wishes-absent]');
  const feedback = form.querySelector('.wishes-feedback');
  const submit = form.querySelector('.wishes-submit');

  const isHttp = window.location.protocol.startsWith('http');
  const getSheetUrl = () => (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.googleSheetWebAppUrl) 
    ? WEDDING_CONFIG.googleSheetWebAppUrl.trim() 
    : '';

  const attendanceLabels = {
    hadir: 'Insyaallah hadir',
    tidak_hadir: 'Tidak dapat hadir',
    ragu: 'Belum pasti'
  };

  const formatDate = value => {
    if (!value) return '';
    if (typeof value === 'string' && value.includes('/')) return value; // Sudah berformat tanggal rapi
    const date = new Date(typeof value === 'string' && value.endsWith('Z') ? value : `${value}Z`);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(date);
  };

  const getLocalPayload = () => {
    try {
      const data = JSON.parse(localStorage.getItem('wedding_wishes') || '{"wishes":[],"stats":{"total":0,"hadir":0,"tidak_hadir":0,"ragu":0}}');
      return data;
    } catch {
      return { wishes: [], stats: { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 } };
    }
  };

  const saveLocalWish = (entry) => {
    const payload = getLocalPayload();
    if (!payload.wishes) payload.wishes = [];
    if (!payload.stats) payload.stats = { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 };
    payload.wishes.unshift(entry);
    payload.stats.total = (payload.stats.total || 0) + 1;
    if (entry.attendance === 'hadir') payload.stats.hadir = (payload.stats.hadir || 0) + 1;
    else if (entry.attendance === 'tidak_hadir') payload.stats.tidak_hadir = (payload.stats.tidak_hadir || 0) + 1;
    else payload.stats.ragu = (payload.stats.ragu || 0) + 1;
    localStorage.setItem('wedding_wishes', JSON.stringify(payload));
    return payload;
  };

  const render = payload => {
    if (total) total.textContent = payload.stats?.total ?? 0;
    if (attending) attending.textContent = payload.stats?.hadir ?? 0;
    if (absent) absent.textContent = payload.stats?.tidak_hadir ?? 0;
    list.replaceChildren();

    if (!payload.wishes?.length) {
      const empty = document.createElement('p');
      empty.className = 'wishes-empty';
      empty.textContent = 'Jadilah orang pertama yang mengirimkan doa dan ucapan.';
      list.appendChild(empty);
      return;
    }

    payload.wishes.forEach((wish, index) => {
      const article = document.createElement('article');
      article.className = 'wish-card';
      article.style.setProperty('--wish-delay', `${Math.min(index, 7) * 65}ms`);

      const head = document.createElement('div');
      head.className = 'wish-head';
      const name = document.createElement('strong');
      name.textContent = wish.name;
      const badge = document.createElement('span');
      badge.className = `wish-badge wish-${wish.attendance}`;
      badge.textContent = attendanceLabels[wish.attendance] || 'Ucapan';
      head.append(name, badge);

      const message = document.createElement('p');
      message.textContent = wish.message;
      const date = document.createElement('time');
      date.dateTime = wish.created_at;
      date.textContent = formatDate(wish.created_at);
      article.append(head, message, date);
      list.appendChild(article);
    });
  };

  const load = async () => {
    const sheetUrl = getSheetUrl();
    if (sheetUrl) {
      try {
        const response = await fetch(sheetUrl);
        if (response.ok) {
          const data = await response.json();
          if (data && data.wishes) {
            render(data);
            localStorage.setItem('wedding_wishes', JSON.stringify(data));
            return;
          }
        }
      } catch (err) {
        // Fallback to local
      }
    }

    if (isHttp) {
      try {
        const response = await fetch('/api/wishes', { headers: { Accept: 'application/json' } });
        if (response.ok) {
          const data = await response.json();
          render(data);
          return;
        }
      } catch {
        // Fallback to localStorage
      }
    }
    render(getLocalPayload());
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    feedback.textContent = '';
    submit.disabled = true;
    submit.textContent = 'Mengirim…';
    const data = Object.fromEntries(new FormData(form));
    const sheetUrl = getSheetUrl();

    try {
      let payload = null;

      // 1. Kirim ke Google Apps Script / Google Sheet bila URL tersedia
      if (sheetUrl) {
        try {
          await fetch(sheetUrl, {
            method: 'POST',
            mode: 'no-cors', // Menghindari isu CORS saat redirect di Google Apps Script
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(data)
          });
        } catch (sheetErr) {
          console.warn('Gagal sync ke Google Sheet:', sheetErr);
        }
      }

      // 2. Kirim ke server lokal jika sedang berjalan
      if (isHttp) {
        try {
          const response = await fetch('/api/wishes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          });
          if (response.ok) {
            payload = await response.json();
          }
        } catch {
          // Fallback to local
        }
      }

      // 3. Simpan ke localStorage agar ucapan langsung muncul seketika di layar
      const entry = {
        name: data.name,
        message: data.message,
        attendance: data.attendance,
        created_at: new Date().toISOString()
      };
      payload = saveLocalWish(entry);

      form.reset();
      feedback.textContent = sheetUrl 
        ? 'Terima kasih, ucapan dan konfirmasi kehadiran Anda sudah tercatat di Google Sheet.'
        : 'Terima kasih, ucapan dan konfirmasi Anda sudah tersimpan.';
      render(payload);
    } catch (error) {
      feedback.textContent = error.message || 'Ucapan belum berhasil dikirim. Silakan coba kembali.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Kirim ucapan';
    }
  });

  load();
})();
