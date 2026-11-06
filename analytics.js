/* Яндекс Метрика 113988077 — загружается только после «Принять все» в cookie-баннере (localStorage gu_cookie = "all").
   На страницах без своего баннера (статьи) показывает такой же баннер сам. */
(function () {
  var ID = 113988077, KEY = 'gu_cookie', loaded = false;

  function choice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function loadMetrika() {
    if (loaded) return; loaded = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }

  /* метка источника для бота: заход из Яндекс Директа (yclid или utm_source=yandex) запоминается на сессию,
     и ссылки в бота получают ?start=ydirect — тогда /bill считает этих людей отдельно. Не cookie и не ПДн. */
  var SRC = (function () {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('yclid') || q.get('utm_source') === 'yandex') sessionStorage.setItem('gu_src', 'ydirect');
      return sessionStorage.getItem('gu_src');
    } catch (e) { return null; }
  })();

  /* переход в бота — главная цель: цель «bot» в Метрике */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="t.me/govoryu_uverenno_bot"]');
    if (a && SRC && a.href.indexOf('start=') < 0) a.href = 'https://t.me/govoryu_uverenno_bot?start=' + SRC;
    if (a && window.ym) ym(ID, 'reachGoal', 'bot');
  });

  function banner() {
    var ck = document.getElementById('cookie');
    if (!ck) {
      var st = document.createElement('style');
      /* тонкая полоска внизу, появляется только после прокрутки (как на главной) */
      st.textContent = '.cookie{position:fixed;left:0;right:0;bottom:0;z-index:50;background:#fff;color:#1e0c18;padding:8px 16px;box-shadow:0 -10px 30px -14px rgba(0,0,0,.35);font-size:12.5px;line-height:1.35;display:none;align-items:center;justify-content:center;gap:12px}'
        + '.cookie.show{display:flex}.cookie .t{min-width:0}.cookie .b{display:flex;gap:8px;flex-shrink:0}'
        + '.cookie button{min-height:34px;padding:0 14px;border:0;border-radius:99px;font:600 12.5px Montserrat,sans-serif;cursor:pointer;color:#1e0c18;white-space:nowrap}'
        + '.cookie .all{background:linear-gradient(100deg,#d6e595,#ddeaa1 45%,#e9f1c3)}.cookie .need{background:#f5f4ee}'
        + '@media (max-width:560px){.cookie{flex-wrap:wrap;gap:6px 8px;padding:8px 12px;font-size:12px}.cookie .t{flex:1 1 100%;text-align:center}.cookie button{min-height:32px;font-size:12px}}';
      document.head.appendChild(st);
      ck = document.createElement('div');
      ck.className = 'cookie'; ck.id = 'cookie'; ck.setAttribute('role', 'dialog'); ck.setAttribute('aria-label', 'Файлы cookie');
      ck.innerHTML = '<span class="t">Cookies — для статистики Яндекс Метрики. <a href="privacy.html">Подробнее</a></span>'
        + '<div class="b"><button class="all" data-c="all">Принять</button><button class="need" data-c="need">Только нужные</button></div>';
      document.body.appendChild(ck);
      ck.addEventListener('click', function (e) {
        var c = e.target.getAttribute('data-c'); if (!c) return;
        try { localStorage.setItem(KEY, c); } catch (_) {}
        ck.classList.remove('show'); document.body.style.paddingBottom = '';
      });
      if (!choice()) {
        var show = function () {
          if (window.scrollY > 250) {
            ck.classList.add('show'); document.body.style.paddingBottom = ck.offsetHeight + 'px';
            window.removeEventListener('scroll', show);
          }
        };
        window.addEventListener('scroll', show, { passive: true }); show();
      }
    }
    /* свой и чужой баннер: после «Принять все» сразу включаем Метрику */
    ck.addEventListener('click', function (e) { if (e.target.getAttribute('data-c') === 'all') loadMetrika(); });
  }

  if (choice() === 'all') loadMetrika();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
})();
