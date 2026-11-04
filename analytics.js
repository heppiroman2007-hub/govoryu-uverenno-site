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
      st.textContent = '.cookie{position:fixed;right:20px;bottom:20px;z-index:50;width:min(380px,calc(100% - 40px));background:#fff;color:#1e0c18;padding:22px 24px;border-radius:18px;box-shadow:0 20px 50px -10px rgba(0,0,0,.3);font-size:13.5px;display:none}'
        + '.cookie.show{display:block}.cookie b{display:block;font-size:16px;font-weight:600;margin-bottom:6px}.cookie .b{display:flex;gap:10px;margin-top:16px}'
        + '.cookie button{flex:1;min-height:42px;border:0;border-radius:99px;font:600 13px Montserrat,sans-serif;cursor:pointer;color:#1e0c18}'
        + '.cookie .all{background:linear-gradient(100deg,#d6e595,#ddeaa1 45%,#e9f1c3)}.cookie .need{background:#f5f4ee}';
      document.head.appendChild(st);
      ck = document.createElement('div');
      ck.className = 'cookie'; ck.id = 'cookie'; ck.setAttribute('role', 'dialog'); ck.setAttribute('aria-label', 'Файлы cookie');
      ck.innerHTML = '<b>Мы используем cookies</b>Для статистики посещений — Яндекс Метрика. Подробнее — в <a href="privacy.html">политике</a>.'
        + '<div class="b"><button class="all" data-c="all">Принять все</button><button class="need" data-c="need">Только необходимые</button></div>';
      document.body.appendChild(ck);
      ck.addEventListener('click', function (e) {
        var c = e.target.getAttribute('data-c'); if (!c) return;
        try { localStorage.setItem(KEY, c); } catch (_) {}
        ck.classList.remove('show');
      });
      if (!choice()) setTimeout(function () { ck.classList.add('show'); }, 1200);
    }
    /* свой и чужой баннер: после «Принять все» сразу включаем Метрику */
    ck.addEventListener('click', function (e) { if (e.target.getAttribute('data-c') === 'all') loadMetrika(); });
  }

  if (choice() === 'all') loadMetrika();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
})();
