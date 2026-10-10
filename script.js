/* Сайт адвоката Ахметжанова А. К. Ванильный JS: плиты и сгиб листа, меню, якоря, язык, кейсы, видео, форма. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };
  var LANG = "ru";

  /* ---------- WhatsApp: текст собирается в момент клика (фаза захвата на window, совместимо с LeadBot) ---------- */
  var WA_NUM = "77072713575";
  var WA = {
    ru: {
      "default": "Здравствуйте, Асхат Канатович! Пишу с сайта. Нужна консультация.",
      hero: "Здравствуйте, Асхат Канатович! Пишу с сайта. Моя ситуация: ",
      razdel: "Здравствуйте! Нужна консультация по разделу имущества. Моя ситуация: ",
      razvod: "Здравствуйте! Нужна консультация по разводу и семейному спору. Моя ситуация: ",
      nasl: "Здравствуйте! Нужна консультация по наследству. Моя ситуация: ",
      bankr: "Здравствуйте! Нужна консультация по банкротству. Моя ситуация: ",
      biznes: "Здравствуйте! Нужна консультация по сопровождению бизнеса (ТОО). Моя ситуация: ",
      raspiska: "Здравствуйте! Нужна консультация по взысканию долга. Моя ситуация: ",
      avr: "Здравствуйте! Заказчик не подписывает акты и не платит. Моя ситуация: ",
      nalogi: "Здравствуйте! Нужна консультация по налоговому или таможенному спору. Моя ситуация: ",
      mediaciya: "Здравствуйте! Нужна консультация по медиации. Моя ситуация: ",
      stoimost: "Здравствуйте, Асхат Канатович! Хочу узнать стоимость по моему делу. Моя ситуация: ",
      kontakty: "Здравствуйте, Асхат Канатович! Пишу с сайта. Моя ситуация: ",
      sticky: "Здравствуйте, Асхат Канатович! Пишу с сайта. Моя ситуация: "
    }
  };
  var FORM_LABELS = { ru: { head: "Заявка с сайта адвоката Ахметжанова А. К.", name: "Имя", phone: "Телефон", msg: "Ситуация" } };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var dict = WA[LANG] || WA.ru;
    var text = dict[key] || WA.ru[key] || WA.ru["default"];
    a.setAttribute("href", "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- fitText для заголовка героя ---------- */
  var h1 = doc.getElementById("h1");
  function fitText() {
    if (!h1) return;
    var l2 = h1.querySelector(".l2");
    var avail = h1.clientWidth;
    if (!avail || !l2) return;
    h1.style.removeProperty("--fs");
    var fs = parseFloat(getComputedStyle(l2).fontSize);
    var guard = 0;
    while (guard++ < 30 && l2.scrollWidth > avail + 1 && fs > 22) {
      fs *= 0.95; h1.style.setProperty("--fs", fs + "px");
    }
  }

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 320);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 68; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) { if (!t.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (err2) {} }
    }
  });

  /* ---------- Плиты и сгиб ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var firstSec = doc.querySelector("main > .sec");
  var sticky = doc.getElementById("sticky"), zay = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;

  function update() {
    ticking = false;
    var H = W.innerHeight;
    var rects = pws.map(function (el) { return el.getBoundingClientRect(); });
    var secTop = firstSec ? firstSec.getBoundingClientRect().top : null;
    var zayTop = zay ? zay.getBoundingClientRect().top : null;
    var pageY = W.pageYOffset;
    for (var i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i];
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var nxtTop = i + 1 < pws.length ? rects[i + 1].top : secTop;
      var exit = nxtTop !== null ? clamp(1 - nxtTop / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      pw.style.setProperty("--enter", enter.toFixed(4));
      pw.style.setProperty("--stay", stay.toFixed(4));
      pw.style.setProperty("--exit", exit.toFixed(4));
      if (isHero) {
        var f1 = REDUCED ? 1 : easeOut(clamp(INTRO / 0.55));
        var f2 = REDUCED ? 1 : easeOut(clamp((INTRO - 0.42) / 0.58));
        pw.style.setProperty("--f1", f1.toFixed(4));
        pw.style.setProperty("--f2", f2.toFixed(4));
        pw.style.setProperty("--intro", easeOut(INTRO).toFixed(4));
      } else {
        /* лист раскрывается, когда плита въехала почти на половину: сгиб виден в кадре */
        var open = REDUCED ? 1 : smooth((enter - 0.4) / 0.5);
        pw.style.setProperty("--open", open.toFixed(4));
      }
      var plate = pw.firstElementChild;
      if (plate) plate.classList.toggle("gone", exit >= 1);
      var txts = pw.querySelectorAll(".txt");
      for (var k = 0; k < txts.length; k++) txts[k].classList.toggle("on", isHero ? INTRO > 0.3 : enter > 0.68);
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (zayTop !== null && zayTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) {
      hdr.classList.toggle("scrolled", pageY > 12);
      var probe = doc.elementFromPoint(Math.min(W.innerWidth - 1, 24), HDR() + 2);
      var themed = probe && probe.closest ? probe.closest("[data-theme]") : null;
      var light = !!(themed && themed.getAttribute("data-theme") === "light");
      hdr.classList.toggle("on-light", light);
      hdr.classList.toggle("on-blue", !!(themed && themed.classList.contains("t-blue")));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () { fitText(); onScroll(); updateRails(); });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = clamp((ts - introStart) / 1400);
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Ленты со стрелками ---------- */
  var rails = [].slice.call(doc.querySelectorAll(".rail"));
  function railStep(rail) {
    var card = rail.firstElementChild; if (!card) return 300;
    var cs = getComputedStyle(rail);
    var gap = parseFloat(cs.columnGap || cs.gap) || 16;
    return card.getBoundingClientRect().width + gap;
  }
  function updateRail(rail) {
    var btns = doc.querySelectorAll('.arr[data-for="' + rail.id + '"]');
    var max = rail.scrollWidth - rail.clientWidth;
    var none = max <= 1;
    [].forEach.call(btns, function (b) {
      b.hidden = none;
      var dir = +b.getAttribute("data-dir");
      b.disabled = dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2;
    });
  }
  function updateRails() { rails.forEach(updateRail); }
  rails.forEach(function (rail) {
    rail.addEventListener("scroll", function () { updateRail(rail); }, { passive: true });
    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); rail.scrollBy({ left: railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); rail.scrollBy({ left: -railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
    });
  });
  [].forEach.call(doc.querySelectorAll(".arr[data-for]"), function (b) {
    b.addEventListener("click", function () {
      var rail = doc.getElementById(b.getAttribute("data-for")); if (!rail) return;
      rail.scrollBy({ left: railStep(rail) * (+b.getAttribute("data-dir")), behavior: REDUCED ? "auto" : "smooth" });
    });
  });

  /* ---------- Кейсы из assets/cases.js: фильтр по направлению, итог, скан решения ---------- */
  var CASE_LABELS = { ru: { sit: "Ситуация", did: "Что сделали", res: "Итог", term: "Срок", court: "Суд", proof: "Решение суда", proofNote: "обезличено, открыть", proofEmpty: "Копия решения суда", proofEmptyNote: "появится после скрытия данных", draft: "Образец", none: "По этому направлению кейсы скоро появятся" } };
  var railCases = doc.getElementById("rail-cases");
  var caseFilter = "all";
  var ZOOM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.2 16.2 21 21M11 8.4v5.2M8.4 11h5.2"/></svg>';
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function renderCases() {
    if (!railCases || !W.SITE_CASES) return;
    var L = CASE_LABELS[LANG] || CASE_LABELS.ru;
    var KK = LANG === "kk" && W.SITE_KK_CASES ? W.SITE_KK_CASES : null;
    var list = W.SITE_CASES.filter(function (c) { return caseFilter === "all" || c.dk === caseFilter; });
    if (!list.length) { railCases.innerHTML = '<p class="case-none">' + esc(L.none) + '</p>'; updateRails(); return; }
    railCases.innerHTML = list.map(function (c) {
      var d = KK && KK[c.id] ? KK[c.id] : c;
      var figNote = d.figNote || c.figNote;
      var proof = c.proof
        ? '<button class="proof" type="button" data-full="' + esc(c.proof.full) + '" data-cap="' + esc(L.proof + ": " + d.dir) + '"><img src="' + esc(c.proof.t) + '" alt="" loading="lazy" decoding="async"><span class="pf-t"><b>' + esc(L.proof) + '</b><small>' + esc(L.proofNote) + '</small></span><span class="pf-z">' + ZOOM + '</span></button>'
        : '<div class="proof proof-empty"><span class="pf-sheet" aria-hidden="true"></span><span class="pf-t"><b>' + esc(L.proofEmpty) + '</b><small>' + esc(L.proofEmptyNote) + '</small></span></div>';
      return '<article class="case dog">' +
        '<div class="case-top"><span class="tab">' + esc(d.dir) + '</span>' + (c.draft ? '<span class="draft">' + esc(L.draft) + '</span>' : '') + '</div>' +
        '<div class="case-res"><span class="lbl">' + esc(L.res) + '</span>' +
          (c.fig ? '<p class="fig"><b>' + esc(c.fig) + '</b>' + (figNote ? '<span>' + esc(figNote) + '</span>' : '') + '</p>' : '') +
          '<p class="res-t">' + esc(d.res) + '</p></div>' +
        '<dl>' +
        '<div><dt>' + esc(L.sit) + '</dt><dd>' + esc(d.sit) + '</dd></div>' +
        '<div><dt>' + esc(L.did) + '</dt><dd>' + esc(d.did) + '</dd></div>' +
        '</dl>' + proof +
        (d.term || c.term ? '<p class="term"><span>' + esc(L.term) + '</span><b>' + esc(d.term || c.term) + '</b></p>' : '') +
        (d.court || c.court ? '<p class="term"><span>' + esc(L.court) + '</span><b class="court">' + esc(d.court || c.court) + '</b></p>' : '') +
        '</article>';
    }).join("");
    railCases.scrollLeft = 0;
    updateRails();
  }
  function setCaseFilter(f) {
    caseFilter = f || "all";
    [].forEach.call(doc.querySelectorAll(".cs-fil button"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-f") === caseFilter ? "true" : "false");
    });
    renderCases();
  }
  [].forEach.call(doc.querySelectorAll(".cs-fil button"), function (b) {
    b.addEventListener("click", function () { setCaseFilter(b.getAttribute("data-f")); });
  });
  /* ссылка «Как решались дела ...» с плиты: сначала фильтр, потом прокрутка (обработчик якорей ниже) */
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-cases]") : null;
    if (a) setCaseFilter(a.getAttribute("data-cases"));
  }, true);
  renderCases();

  /* ---------- Язык: RU в разметке, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  var RU = I18N.ru;
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { RU[el.getAttribute("data-i")] = el.textContent; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { RU[el.getAttribute("data-i-aria")] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) el.textContent = v; });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", v); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) el.setAttribute("alt", v); });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("ashat-lang", lang); } catch (e) {}
    renderCases();
    fitText();
  }
  function loadLang(lang, done) {
    if (I18N[lang] || lang !== "kk") return done();
    var s = doc.createElement("script");
    s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
    s.onload = function () {
      if (W.SITE_KK) {
        I18N.kk = W.SITE_KK;
        if (W.SITE_KK_WA) WA.kk = W.SITE_KK_WA;
        if (W.SITE_KK_FORM) FORM_LABELS.kk = W.SITE_KK_FORM;
        if (W.SITE_KK_CASE_LABELS) CASE_LABELS.kk = W.SITE_KK_CASE_LABELS;
      }
      done();
    };
    s.onerror = function () { done(); };
    doc.head.appendChild(s);
  }
  function setLang(lang) { loadLang(lang, function () { applyLang(lang); }); }
  [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  (function initLang() {
    var forced = (location.search.match(/[?&]lang=(ru|kk)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("ashat-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
  })();

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) el.classList.add("in"); }); }, 1500);
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Видео: немая петля по видимости, полный ролик со звуком в модалке ---------- */
  var loops = [].slice.call(doc.querySelectorAll(".vloop"));
  if ("IntersectionObserver" in W) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        var v = x.target;
        if (x.isIntersecting && !REDUCED) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.45 });
    loops.forEach(function (v) { vio.observe(v); });
  }
  var vm = doc.getElementById("vm"), vmVideo = doc.getElementById("vm-video"), vmLast = null;
  function openVideo(src, from) {
    if (!vm || !vmVideo) return;
    vmLast = from || null;
    vmVideo.src = src;
    vm.classList.add("open");
    doc.body.classList.add("vm-open");
    ["main", "hdr", "sticky"].forEach(function (id) { var el = doc.getElementById(id); if (el) el.inert = true; });
    var ft = doc.querySelector(".foot"); if (ft) ft.inert = true;
    loops.forEach(function (v) { v.pause(); });
    var p = vmVideo.play(); if (p && p.catch) p.catch(function () {});
    var x = vm.querySelector(".vm-x"); if (x) x.focus({ preventScroll: true });
  }
  function closeVideo() {
    if (!vm || !vmVideo) return;
    vm.classList.remove("open");
    doc.body.classList.remove("vm-open");
    ["main", "hdr", "sticky"].forEach(function (id) { var el = doc.getElementById(id); if (el) el.inert = false; });
    var ft2 = doc.querySelector(".foot"); if (ft2) ft2.inert = false;
    vmVideo.pause();
    vmVideo.removeAttribute("src"); vmVideo.load();
    if (vmLast) { try { vmLast.focus({ preventScroll: true }); } catch (e) {} }
    loops.forEach(function (v) { if (v.getBoundingClientRect().top < W.innerHeight && v.getBoundingClientRect().bottom > 0 && !REDUCED) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
  }
  [].forEach.call(doc.querySelectorAll(".vtile"), function (tile) {
    var btn = tile.querySelector(".vplay");
    tile.addEventListener("click", function () { openVideo(tile.getAttribute("data-video"), btn); });
  });
  if (vm) {
    [].forEach.call(vm.querySelectorAll("[data-vm-close]"), function (b) { b.addEventListener("click", closeVideo); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && vm.classList.contains("open")) closeVideo(); });
  }

  /* ---------- Документы: лайтбокс ---------- */
  var dm = doc.getElementById("dm"), dmImg = doc.getElementById("dm-img"), dmCap = doc.getElementById("dm-cap"), dmFull = doc.getElementById("dm-full"), dmLast = null;
  function setInert(on) {
    ["main", "hdr", "sticky"].forEach(function (id) { var el = doc.getElementById(id); if (el) el.inert = on; });
    var ft = doc.querySelector(".foot"); if (ft) ft.inert = on;
  }
  function openDoc(card) {
    if (!dm || !dmImg) return;
    dmLast = card;
    var src = card.getAttribute("data-full");
    var k = card.querySelector(".doc-kind"), tt = card.querySelector(".doc-t");
    var cap = card.getAttribute("data-cap") || ((k ? k.textContent + ": " : "") + (tt ? tt.textContent : ""));
    dm.classList.toggle("dm-tall", card.classList.contains("proof"));
    dmImg.src = src; dmImg.alt = cap;
    if (dmCap) dmCap.textContent = cap;
    if (dmFull) dmFull.href = src;
    dm.classList.add("open"); doc.body.classList.add("dm-open"); setInert(true);
    var x = dm.querySelector(".vm-x"); if (x) x.focus({ preventScroll: true });
  }
  function closeDoc() {
    if (!dm || !dm.classList.contains("open")) return;
    dm.classList.remove("open"); doc.body.classList.remove("dm-open"); setInert(false);
    setTimeout(function () { if (!dm.classList.contains("open")) dmImg.removeAttribute("src"); }, 320);
    if (dmLast) { try { dmLast.focus({ preventScroll: true }); } catch (e) {} }
  }
  doc.addEventListener("click", function (e) {
    var c = e.target && e.target.closest ? e.target.closest(".doc[data-full], .proof[data-full]") : null;
    if (c) openDoc(c);
  });
  if (dm) {
    [].forEach.call(dm.querySelectorAll("[data-dm-close]"), function (b) { b.addEventListener("click", closeDoc); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDoc(); });
  }

  /* ---------- Форма -> WhatsApp ---------- */
  var form = doc.getElementById("form"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badName = !name, badPhone = phone.replace(/\D/g, "").length < 10;
      f.name.classList.toggle("bad", badName); f.phone.classList.toggle("bad", badPhone);
      f.name.setAttribute("aria-invalid", badName ? "true" : "false"); f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badName || badPhone) { if (ferr) ferr.hidden = false; (badName ? f.name : f.phone).focus(); return; }
      if (ferr) ferr.hidden = true;
      var L = FORM_LABELS[LANG] || FORM_LABELS.ru;
      var lines = [L.head, L.name + ": " + name, L.phone + ": " + phone];
      if (f.message.value.trim()) lines.push(L.msg + ": " + f.message.value.trim());
      var url = "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(lines.join("\n"));
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    fitText();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
    updateRails();
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitText(); update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
