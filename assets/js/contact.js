/* Contact page: validate the short form, then open WhatsApp with the message ready.
   There is no server, so nothing is stored; the visitor sends the message themselves. */
(function () {
  "use strict";

  var WA_NUMBER = "919726654060";
  var EMAIL = "hello@11za.com";

  var form = document.getElementById("contactForm");
  if (!form) return;
  var mailLink = document.getElementById("ctMail");

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
    var f = form.elements, ok = true;
    function check(input, bad, msg) { fieldError(input, bad ? msg : ""); if (bad) ok = false; }
    check(f.name, f.name.value.trim().length < 2, "Please enter your name");
    check(f.phone, !cleanPhone(f.phone.value), "Enter a valid 10-digit WhatsApp number");
    var em = f.email.value.trim();
    check(f.email, em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em), "Enter a valid email or leave it empty");
    check(f.topic, !f.topic.value, "Choose a topic");
    check(f.message, f.message.value.trim().length < 5, "Please write a short message");
    return ok;
  }

  function summary() {
    var f = form.elements;
    var lines = [
      "Hi 11za team,",
      f.message.value.trim(),
      "",
      "Topic: " + f.topic.value,
      "Name: " + f.name.value.trim(),
      "WhatsApp: " + cleanPhone(f.phone.value)
    ];
    if (f.email.value.trim()) lines.push("Email: " + f.email.value.trim());
    return lines.join("\n");
  }

  /* keep the email fallback in sync with what was typed */
  form.addEventListener("input", function (e) {
    if (e.target.name) fieldError(e.target, "");
    if (mailLink) {
      mailLink.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Website enquiry: " + (form.elements.topic.value || "Hello")) +
        "&body=" + encodeURIComponent(summary());
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      return;
    }
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(summary()), "_blank", "noopener");
  });
})();
