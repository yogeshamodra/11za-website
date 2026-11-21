/* Industry pages (modern layout): scroll reveal, timeline progress and the live chat in the hero. */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hdr = document.getElementById("top");
  if (hdr) addEventListener("scroll", function () { hdr.classList.toggle("scrolled", scrollY > 20); }, { passive: true });

  /* scroll reveal. .re-js hides the elements, so it is only added when the observer works */
  var items = document.querySelectorAll(".re-r");
  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("re-js");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.classList.add("re-in");
        if (e.target.classList.contains("re-time")) e.target.style.setProperty("--p", 1);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el, i) {
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : i;
      el.style.setProperty("--d", (sib % 4) * 90 + "ms");
      io.observe(el);
    });
  } else {
    var t = document.querySelector(".re-time");
    if (t) t.style.setProperty("--p", 1);
  }

  /* hero chat: messages arrive one by one with a typing indicator, then the chat replays */
  var body = document.querySelector(".re-phone .body");
  if (!body) return;
  var script = Array.prototype.map.call(body.querySelectorAll("[data-m]"), function (n) { return n.cloneNode(true); });
  function showAll() { body.innerHTML = ""; script.forEach(function (n) { body.appendChild(n.cloneNode(true)); }); }
  if (reduce) { showAll(); return; }

  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function play() {
    body.innerHTML = "";
    var at = 600;
    script.forEach(function (node) {
      var out = node.classList.contains("out");
      var wait = out ? 900 : 500;
      later(function () {
        var d = document.createElement("div");
        d.className = "re-typing" + (out ? "" : " in");
        d.innerHTML = "<i></i><i></i><i></i>";
        body.appendChild(d);
        node._t = d;
      }, at);
      at += wait;
      later(function () {
        if (node._t && node._t.parentNode) node._t.parentNode.removeChild(node._t);
        body.appendChild(node.cloneNode(true));
        while (body.scrollHeight > body.clientHeight + 2 && body.children.length > 1) body.removeChild(body.firstChild);
      }, at);
      at += 700;
    });
    later(play, at + 4500);
  }
  /* only animate while the phone is on screen */
  var started = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !started) { started = true; play(); }
        else if (!e.isIntersecting && started) { started = false; timers.forEach(clearTimeout); timers = []; showAll(); }
      });
    }, { threshold: 0.3 }).observe(body);
  } else { showAll(); }
})();
