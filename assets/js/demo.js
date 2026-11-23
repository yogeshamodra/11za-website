/* Book a demo page: header shadow, short form, then Calendly step. */
(function () {
  "use strict";

  var CALENDLY_URL = "https://cal.id/11za/11za-personalized-product-demo";

  /* sticky header shadow (same as the other pages) */
  var hdr = document.getElementById("top");
  if (hdr) {
    addEventListener(
      "scroll",
      function () { hdr.classList.toggle("scrolled", scrollY > 20); },
      { passive: true }
    );
  }

  var form = document.getElementById("demoForm");
  var cal = document.getElementById("demoCal");
  var frame = document.getElementById("calFrame");
  var openLink = document.getElementById("calOpen");
  var back = document.getElementById("calBack");
  var steps = document.querySelectorAll(".demo-steps span");
  if (!form || !cal || !frame) return;

  function setStep(n) {
    steps.forEach(function (s, i) { s.classList.toggle("on", i < n); });
  }

  function fieldError(input, msg) {
    var out = form.querySelector('[data-err="' + input.name + '"]');
    if (out) out.textContent = msg || "";
    if (msg) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  /* Indian mobile: optional +91 / 91 / 0 prefix, then 10 digits starting 6-9 */
  function cleanPhone(v) {
    var d = v.replace(/[^\d]/g, "");
    if (d.length === 12 && d.indexOf("91") === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === "0") d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d) ? d : "";
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var phone = form.elements.phone;
    var email = form.elements.email;
    var biz = form.elements.business;
    var size = form.elements.team;

    fieldError(name, name.value.trim().length < 2 ? "Please enter your name" : "");
    if (name.value.trim().length < 2) ok = false;

    var p = cleanPhone(phone.value);
    fieldError(phone, p ? "" : "Enter a valid 10-digit WhatsApp number");
    if (!p) ok = false;

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    fieldError(email, emailOk ? "" : "Enter a valid work email");
    if (!emailOk) ok = false;

    fieldError(biz, biz.value ? "" : "Choose your business type");
    if (!biz.value) ok = false;

    fieldError(size, size.value ? "" : "Choose your team size");
    if (!size.value) ok = false;

    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      return;
    }

    /* Calendly carries name + email into the booking; business type and
       team size travel as UTM tags so the host can see them on the invite. */
    var q = new URLSearchParams({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      utm_source: "11za-website",
      utm_medium: "demo-page",
      utm_campaign: form.elements.business.value,
      utm_content: "team-" + form.elements.team.value
    });
    var url = CALENDLY_URL + "?" + q.toString();

    frame.src = url + "&embed_type=Inline&embed_domain=" + encodeURIComponent(location.hostname || "11za.com") + "&hide_gdpr_banner=1";
    openLink.href = url;

    form.hidden = true;
    cal.hidden = false;
    setStep(2);
    cal.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  back.addEventListener("click", function () {
    cal.hidden = true;
    form.hidden = false;
    frame.removeAttribute("src");
    setStep(1);
  });

  /* clear a field's error as soon as the visitor edits it */
  form.addEventListener("input", function (e) {
    if (e.target.name) fieldError(e.target, "");
  });
})();
