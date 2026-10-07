(() => {
  const main = document.getElementById('main');
  const editorial = main?.querySelector('.editorial');
  const scheduleInner = main?.querySelector('.schedule .narrow');
  const eventGrid = scheduleInner?.querySelector('.event-grid');
  const gift = main?.querySelector('.gift');

  if (editorial && !editorial.querySelector('.editorial-garland')) {
    const editorialInner = editorial.querySelector('.narrow');
    const intro = editorialInner?.querySelector('.intro');
    const couple = editorialInner?.querySelector('.couple');
    const overline = editorialInner?.querySelector('.overline');
    const heading = editorialInner?.querySelector('h2');
    if (editorialInner && intro && couple && overline && heading) {
      const introWrap = document.createElement('div');
      introWrap.className = 'editorial-intro';
      editorialInner.insertBefore(introWrap, overline);
      introWrap.append(overline, heading, intro);

      const garland = document.createElement('img');
      garland.className = 'editorial-garland';
      garland.src = 'ornaments/botanical-garland.webp';
      garland.alt = '';
      garland.loading = 'lazy';
      garland.setAttribute('aria-hidden', 'true');
      couple.before(garland);

      couple.querySelectorAll('.person').forEach((person, index) => {
        const role = document.createElement('span');
        role.className = 'person-role';
        role.textContent = index ? 'Mempelai wanita' : 'Mempelai pria';
        person.prepend(role);
      });
    }
  }

  if (eventGrid && !eventGrid.querySelector('.event-date')) {
    const events = eventGrid.querySelectorAll('.event');
    const details = [
      {
        label: 'Ikrar suci',
        title: 'Akad Nikah',
        time: '09.00 WIB',
        place: 'Kantor Urusan Agama (KUA)<br>Ketanen, Kecamatan Trangkil,<br>Kabupaten Pati'
      },
      {
        label: 'Perayaan cinta',
        title: 'Resepsi',
        time: '10.00 WIB – selesai',
        place: 'Kediaman mempelai wanita<br>Desa Mojoagung RT 03/RW 02, Trangkil',
        href: 'https://maps.app.goo.gl/hrZVxfkpQYuadmTk6',
        action: 'Lokasi Resepsi'
      }
    ];

    events.forEach((event, index) => {
      const item = details[index];
      if (!item) return;
      event.innerHTML = `
        <span class="event-label">${item.label}</span>
        <h3>${item.title}</h3>
        <div class="event-date"><b>24</b><span>Selasa<br>November 2026</span></div>
        <strong>${item.time}</strong>
        <span class="event-divider" aria-hidden="true">⌂</span>
        <p>${item.place}</p>
        ${item.href ? `<a class="button map-button" href="${item.href}" target="_blank" rel="noopener noreferrer">${item.action}</a>` : ''}`;
    });

    if (events.length === 2) {
      const divider = document.createElement('div');
      divider.className = 'event-floral-divider';
      divider.setAttribute('aria-hidden', 'true');
      divider.innerHTML = '<img src="ornaments/botanical-cluster.webp" alt="" loading="lazy">';
      events[1].before(divider);
    }
  }

  if (gift && !main.querySelector('.wishes')) {
    const wishes = document.createElement('section');
    wishes.className = 'wishes';
    wishes.id = 'wishes';
    wishes.innerHTML = `
      <div class="wishes-shell narrow">
        <div class="overline reveal">Doa & harapan</div>
        <h2 class="reveal">Wishes</h2>
        <p class="wishes-copy reveal">Tuliskan doa terbaik Anda untuk perjalanan baru Bagas dan Vania.</p>
        <div class="wishes-stats reveal" aria-live="polite">
          <div><b data-wishes-total>0</b><span>Ucapan</span></div>
          <div><b data-wishes-attending>0</b><span>Hadir</span></div>
          <div><b data-wishes-absent>0</b><span>Tidak hadir</span></div>
        </div>
        <form class="wishes-form reveal" id="wishes-form">
          <label><span>Nama</span><input name="name" maxlength="60" autocomplete="name" required placeholder="Nama Anda"></label>
          <label><span>Ucapan</span><textarea name="message" maxlength="500" rows="5" required placeholder="Tuliskan doa dan ucapan terbaik"></textarea></label>
          <label><span>Konfirmasi kehadiran</span><select name="attendance" required><option value="">Pilih konfirmasi</option><option value="hadir">Insya Allah hadir</option><option value="tidak_hadir">Maaf, tidak dapat hadir</option><option value="ragu">Masih belum pasti</option></select></label>
          <input class="wishes-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="button wishes-submit" type="submit">Kirim ucapan</button>
          <p class="wishes-feedback" role="status" aria-live="polite"></p>
        </form>
        <div class="wishes-list reveal" id="wishes-list" aria-live="polite"><p class="wishes-empty">Memuat ucapan…</p></div>
      </div>`;
    gift.before(wishes);
  }

  if (editorial && !main.querySelector('.opening-scene')) {
    const scene = document.createElement('section');
    scene.className = 'opening-scene';
    scene.setAttribute('aria-label', 'Pembuka undangan Bagas dan Vania');
    scene.innerHTML = `
      <div class="opening-stage scene-reveal">
        <img class="opening-floral-arch" src="ornaments/botanical-arch.webp" alt="" aria-hidden="true">
        <div class="opening-scene-copy">
          <span class="opening-corner corner-a" aria-hidden="true"></span>
          <span class="opening-corner corner-b" aria-hidden="true"></span>
          <span class="opening-kicker">The wedding celebration</span>
          <div class="opening-monogram" aria-hidden="true">B<i>&</i>V</div>
          <span class="opening-divider" aria-hidden="true"><i></i></span>
          <h2><span class="opening-name">Bagas</span> <span class="opening-name-amp">&amp;</span> <span class="opening-name">Vania</span></h2>
          <time datetime="2026-11-24">Selasa · 24 November 2026</time>
          <p class="opening-note">Dengan penuh cinta, kami mengundang Anda menjadi bagian dari hari bahagia kami.</p>
          <div class="opening-scroll"><b aria-hidden="true"></b><small>Gulir untuk melihat</small></div>
        </div>
      </div>`;
    editorial.before(scene);
  }

  if (!main?.querySelector('.section-transition')) {
    const transitions = [
      ['.opening-scene', 'editorial'],
      ['.editorial', 'portrait'],
      ['.portrait-band', 'schedule'],
      ['.schedule', 'gallery'],
      ['.gallery', 'wishes'],
      ['.wishes', 'gift'],
      ['.gift', 'closing']
    ];

    transitions.forEach(([selector, nextSection]) => {
      const section = main.querySelector(selector);
      if (!section) return;
      const transition = document.createElement('div');
      transition.className = `section-transition transition-to-${nextSection}`;
      transition.setAttribute('aria-hidden', 'true');
      section.appendChild(transition);
    });
  }

  if (scheduleInner && eventGrid && !scheduleInner.querySelector('.countdown-stage')) {
    const stage = document.createElement('div');
    stage.className = 'countdown-stage scene-reveal';
    stage.setAttribute('aria-label', 'Hitung mundur menuju hari pernikahan');
    stage.innerHTML = `
      <div class="countdown-photo"><img src="photos/prewed-countdown-v2.jpg" alt="Bagas dan Vania mengenakan busana adat" loading="lazy"></div>
      <div class="countdown-shade"></div>
      <div class="countdown-copy">
        <span>Menuju hari bahagia</span>
        <div class="countdown-units">
          <div><b data-count="days">0</b><small>Hari</small></div>
          <div><b data-count="hours">00</b><small>Jam</small></div>
          <div><b data-count="minutes">00</b><small>Menit</small></div>
          <div><b data-count="seconds">00</b><small>Detik</small></div>
        </div>
      </div>`;
    eventGrid.before(stage);

    const weddingTime = new Date('2026-11-24T09:00:00+07:00').getTime();
    const update = () => {
      const remaining = Math.max(0, weddingTime - Date.now());
      const total = Math.floor(remaining / 1000);
      const values = {
        days: Math.floor(total / 86400),
        hours: String(Math.floor(total % 86400 / 3600)).padStart(2, '0'),
        minutes: String(Math.floor(total % 3600 / 60)).padStart(2, '0'),
        seconds: String(total % 60).padStart(2, '0')
      };
      Object.entries(values).forEach(([key, value]) => {
        const target = stage.querySelector(`[data-count="${key}"]`);
        if (target) target.textContent = value;
      });
    };
    update();
    setInterval(update, 1000);
  }

  if (!document.querySelector('.botanical-ornament')) {
    const placements = [
      { section: '.cover-content', position: 'top-left', motif: 'vine' },
      { section: '.cover-content', position: 'top-right', motif: 'corner' },
      { section: '.cover-content', position: 'bottom-right', motif: 'cluster' },
      { section: '.cover-content', position: 'bottom-center', motif: 'garland' },
      { section: '.opening-scene', position: 'top-left', motif: 'cluster' },
      { section: '.opening-scene', position: 'top-right', motif: 'corner' },
      { section: '.opening-scene', position: 'mid-left', motif: 'vine' },
      { section: '.opening-scene', position: 'mid-right', motif: 'vine' },
      { section: '.opening-scene', position: 'bottom-left', motif: 'vine' },
      { section: '.opening-scene', position: 'bottom-right', motif: 'cluster' },
      { section: '.opening-scene', position: 'bottom-center', motif: 'garland' },
      { section: '.editorial', position: 'top-left', motif: 'vine' },
      { section: '.editorial', position: 'top-right', motif: 'corner' },
      { section: '.editorial', position: 'bottom-left', motif: 'cluster' },
      { section: '.editorial', position: 'bottom-right', motif: 'cluster' },
      { section: '.editorial', position: 'bottom-center', motif: 'garland' },
      { section: '.schedule', position: 'top-left', motif: 'corner' },
      { section: '.schedule', position: 'top-right', motif: 'cluster' },
      { section: '.schedule', position: 'mid-left', motif: 'vine' },
      { section: '.schedule', position: 'bottom-right', motif: 'vine' },
      { section: '.schedule', position: 'bottom-center', motif: 'garland' },
      { section: '.gallery', position: 'top-left', motif: 'corner' },
      { section: '.gallery', position: 'top-right', motif: 'vine' },
      { section: '.gallery', position: 'bottom-left', motif: 'cluster' },
      { section: '.gallery', position: 'bottom-right', motif: 'cluster' },
      { section: '.gallery', position: 'bottom-center', motif: 'garland' },
      { section: '.wishes', position: 'top-left', motif: 'corner' },
      { section: '.wishes', position: 'top-right', motif: 'vine' },
      { section: '.wishes', position: 'mid-left', motif: 'cluster' },
      { section: '.wishes', position: 'bottom-right', motif: 'cluster' },
      { section: '.wishes', position: 'bottom-center', motif: 'garland' },
      { section: '.gift', position: 'top-left', motif: 'corner' },
      { section: '.gift', position: 'top-right', motif: 'vine' },
      { section: '.gift', position: 'bottom-left', motif: 'cluster' },
      { section: '.gift', position: 'bottom-right', motif: 'corner' },
      { section: '.gift', position: 'bottom-center', motif: 'garland' },
      { section: '.closing', position: 'top-left', motif: 'vine' },
      { section: '.closing', position: 'top-right', motif: 'cluster' },
      { section: '.closing', position: 'bottom-left', motif: 'cluster' },
      { section: '.closing', position: 'bottom-right', motif: 'corner' }
    ];

    const sources = {
      corner: 'ornaments/botanical-corner.webp',
      vine: 'ornaments/botanical-vine.webp',
      cluster: 'ornaments/botanical-cluster.webp',
      garland: 'ornaments/botanical-garland.webp'
    };

    placements.forEach(({ section: selector, position, motif }, index) => {
      const section = document.querySelector(selector);
      if (!section) return;
      const ornament = document.createElement('span');
      ornament.className = `botanical-ornament botanical-${position} motif-${motif}`;
      ornament.setAttribute('aria-hidden', 'true');
      ornament.style.setProperty('--floral-delay', `${(index % 5) * -1.15}s`);
      ornament.style.setProperty('--floral-direction', index % 2 ? '-1' : '1');
      ornament.innerHTML = `<img src="${sources[motif]}" alt="" loading="lazy">`;
      section.appendChild(ornament);
    });

    const ornaments = document.querySelectorAll('.botanical-ornament');
    if ('IntersectionObserver' in window) {
      const floralObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-blooming');
            floralObserver.unobserve(entry.target);
          }
        });
      }, { threshold: .08 });
      ornaments.forEach(item => floralObserver.observe(item));
    } else {
      ornaments.forEach(item => item.classList.add('is-blooming'));
    }

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let floralFrame = 0;
      const updateFloralParallax = () => {
        floralFrame = 0;
        ornaments.forEach((ornament, index) => {
          const rect = ornament.parentElement.getBoundingClientRect();
          const distance = (rect.top + rect.height / 2) - innerHeight / 2;
          const direction = index % 2 ? -1 : 1;
          const shift = Math.max(-18, Math.min(18, distance * .018 * direction));
          ornament.style.setProperty('--floral-shift', `${shift.toFixed(1)}px`);
        });
      };
      addEventListener('scroll', () => {
        if (!floralFrame) floralFrame = requestAnimationFrame(updateFloralParallax);
      }, { passive: true });
      updateFloralParallax();
    }
  }

  const staged = document.querySelectorAll('.scene-reveal, .wishes .reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    staged.forEach(item => observer.observe(item));
  } else {
    staged.forEach(item => item.classList.add('visible'));
  }
})();
