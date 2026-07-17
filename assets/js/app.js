/* ==========================================================================
   Team Prototypes — app shell
   라우팅: #/{owner}/{page}   예) #/laseon/home
   ========================================================================== */

(function () {
  'use strict';

  var TEAM = window.TEAM || [];

  var tree    = document.getElementById('tree');
  var stage   = document.getElementById('stage');
  var phone   = document.getElementById('phone');
  var frame   = phone.querySelector('.phone__frame');
  var screen  = document.getElementById('screen');
  var zoomSel = document.getElementById('zoom');

  var crumbOwner = document.getElementById('crumbOwner');
  var crumbPage  = document.getElementById('crumbPage');
  var openNew    = document.getElementById('openNew');

  var current = null;

  /* ------------------------------------------------------------ 사이드바 */

  function buildTree() {
    TEAM.forEach(function (member) {
      var folder = document.createElement('details');
      folder.className = 'folder';
      folder.open = true;

      var summary = document.createElement('summary');
      summary.className = 'folder__btn';
      summary.innerHTML =
        '<span class="folder__caret">▶</span>' +
        '<span class="folder__icon">📁</span>' +
        '<span>' + member.name + '</span>' +
        '<span class="folder__count">' + member.pages.length + '</span>';
      folder.appendChild(summary);

      var list = document.createElement('ul');
      list.className = 'folder__list';

      member.pages.forEach(function (page) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.className = 'page__btn';
        btn.type = 'button';
        btn.textContent = page.title;
        btn.dataset.route = member.id + '/' + page.id;
        btn.addEventListener('click', function () {
          location.hash = '#/' + member.id + '/' + page.id;
        });
        li.appendChild(btn);
        list.appendChild(li);
      });

      folder.appendChild(list);
      tree.appendChild(folder);
    });
  }

  function markActive(route) {
    var buttons = tree.querySelectorAll('.page__btn');
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.setAttribute('aria-current', String(btn.dataset.route === route));
    });
  }

  /* ------------------------------------------------------------- 라우팅 */

  function find(ownerId, pageId) {
    var member = TEAM.filter(function (m) { return m.id === ownerId; })[0];
    if (!member) return null;
    var page = member.pages.filter(function (p) { return p.id === pageId; })[0];
    if (!page) return null;
    return { member: member, page: page };
  }

  function firstRoute() {
    for (var i = 0; i < TEAM.length; i++) {
      if (TEAM[i].pages.length) return TEAM[i].id + '/' + TEAM[i].pages[0].id;
    }
    return null;
  }

  function parseHash() {
    // '#/laseon/home' -> ['laseon', 'home']
    return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  }

  function show(hit) {
    current = hit;

    screen.src = hit.page.file;
    openNew.href = hit.page.file;

    crumbOwner.textContent = hit.member.name;
    crumbPage.textContent = hit.page.title;
    document.title = hit.member.name + ' / ' + hit.page.title + ' — Prototypes';

    stage.classList.add('is-loaded');
    markActive(hit.member.id + '/' + hit.page.id);
  }

  function route() {
    var parts = parseHash();
    var hit = parts.length === 2 ? find(parts[0], parts[1]) : null;

    if (!hit) {
      var fallback = firstRoute();
      if (fallback) {
        location.replace('#/' + fallback);   // 히스토리 오염 없이 교체
        return;
      }
      stage.classList.remove('is-loaded');
      return;
    }

    show(hit);
  }

  /* --------------------------------------------------------------- 배율 */

  function applyZoom() {
    var mode = zoomSel.value;
    var scale = 1;

    if (mode === 'fit') {
      var padding = 64;
      var availH = stage.clientHeight - padding;
      var availW = stage.clientWidth - padding;
      // offsetWidth/Height 는 transform 영향을 받지 않는 레이아웃 실측값
      scale = Math.min(1, availH / frame.offsetHeight, availW / frame.offsetWidth);
    } else {
      scale = parseFloat(mode);
    }

    phone.style.setProperty('--scale', Math.max(scale, 0.2).toFixed(3));
  }

  /* ---------------------------------------------------------------- 이벤트 */

  zoomSel.addEventListener('change', applyZoom);
  window.addEventListener('resize', applyZoom);
  window.addEventListener('hashchange', route);

  document.getElementById('reload').addEventListener('click', function () {
    if (current) screen.src = current.page.file;
  });

  /* ----------------------------------------------------------------- init */

  buildTree();
  route();
  applyZoom();
})();
