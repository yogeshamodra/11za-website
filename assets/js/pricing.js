/* Pricing page: sticky header shadow (same behaviour as the other pages). */
(function () {
  "use strict";
  var hdr = document.getElementById("top");
  if (!hdr) return;
  addEventListener(
    "scroll",
    function () { hdr.classList.toggle("scrolled", scrollY > 20); },
    { passive: true }
  );
})();
