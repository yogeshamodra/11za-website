/* Product pages: sticky header shadow and the use-case tabs. */
(function () {
  "use strict";

  var hdr = document.getElementById("top");
  if (hdr) {
    addEventListener(
      "scroll",
      function () { hdr.classList.toggle("scrolled", scrollY > 20); },
      { passive: true }
    );
  }

  /* scroll reveal: only content below the first screen is hidden, then eased in */
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.classList.add("pv-in");
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    var vh = innerHeight;
    function reveal(sel, mode, stagger) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        if (el.getBoundingClientRect().top < vh) return;
        el.classList.add("pv");
        if (mode) el.setAttribute("data-pv", mode);
        if (stagger) el.style.transitionDelay = (i % 4) * 90 + "ms";
        io.observe(el);
      });
    }
    reveal(".pr-sec .head");
    reveal(".pr-card", "", true);
    reveal(".pr-hubcard", "", true);
    reveal(".logo-grid li", "", true);
    reveal(".pr-row .pr-text", "left");
    reveal(".pr-row.flip .pr-text", "right");
    reveal(".pr-row .pshot", "zoom");
    reveal(".pr-uc");
    reveal(".pr-story");
    reveal(".pr-rel", "", true);
    reveal(".faq details", "", true);
    reveal(".pr-cta .final", "zoom");
  }

  /* integrations page: filter the logo grid by type */
  document.querySelectorAll("[data-filter]").forEach(function (bar) {
    var grid = bar.parentNode.querySelector(".logo-grid");
    if (!grid) return;
    var buttons = Array.prototype.slice.call(bar.querySelectorAll("button[data-cat]"));
    var items = Array.prototype.slice.call(grid.querySelectorAll("li[data-cat]"));
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var cat = b.getAttribute("data-cat");
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        items.forEach(function (li) { li.hidden = cat !== "all" && li.getAttribute("data-cat") !== cat; });
      });
    });
  });

  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(box.querySelectorAll('[role="tabpanel"]'));

    function select(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach(function (p, n) { p.hidden = n !== i; });
    }

    // Auto-advance with a progress bar on the active tab (vertical use-case tabs only)
    var auto = box.classList.contains("pr-uc") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cur = 0, inView = true, hold = 0;
    function run() {
      tabs.forEach(function (t, n) {
        var bar = t.querySelector(".uc-prog");
        if (!bar) return;
        bar.classList.remove("run");
        if (n === cur) { void bar.offsetWidth; bar.classList.add("run"); }
      });
    }
    if (auto) {
      tabs.forEach(function (t, n) {
        var bar = document.createElement("i");
        bar.className = "uc-prog";
        bar.setAttribute("aria-hidden", "true");
        bar.addEventListener("animationend", function () { if (n === cur && !hold) { cur = (cur + 1) % tabs.length; select(cur, false); } });
        t.appendChild(bar);
      });
      var sync = function () { box.classList.toggle("uc-paused", hold > 0 || !inView); };
      box.addEventListener("mouseenter", function () { hold++; sync(); });
      box.addEventListener("mouseleave", function () { hold = Math.max(0, hold - 1); sync(); });
      box.addEventListener("play", function () { hold++; sync(); }, true);
      box.addEventListener("pause", function () { hold = Math.max(0, hold - 1); sync(); }, true);
      box.addEventListener("ended", function () { hold = Math.max(0, hold - 1); sync(); }, true);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) { inView = en[0].isIntersecting; sync(); }, { threshold: 0.3 }).observe(box);
      }
      var baseSelect = select;
      select = function (i, focus) { cur = i; baseSelect(i, focus); run(); };
      run();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
  });
})();
