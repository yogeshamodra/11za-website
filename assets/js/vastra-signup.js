/* Partner sign-up page (Vastra): validate the form, then WhatsApp Embedded Signup via Facebook login.
   Same flow as the one-1za theme template vastra-Signup-template.php.
   To reuse for another partner, change PARTNER below (partner name, hidden id) and ES_CONFIG if Meta settings differ. */
(function () {
  "use strict";

  /* ---- Embedded Signup config: change only here ---- */
  var ES_CONFIG = {
    appId: "280829531162725",
    config_id: "853148303121994",
    solutionID: "2301794216985187" /* Meta Cloud API direct */
  };
  var FB_VERSION = "v24.0";
  var PARTNER = { name: "vastra", hiddenvalue: "668b89fb1936b526c73eaae4" };
  var SAVE_URL = "/wp-json/api/v1/save_fb_data";
  var ONBOARD_URL = "https://admin.11za.in/11zaMetaform/cloud11zasignup";
  var DONE_MSG = "Signup received! Our team will activate your account shortly.";

  var form = document.getElementById("signupForm");
  if (!form) return;
  var btn = document.getElementById("fbLoginBtn");
  var msg = document.getElementById("signupMsg");
  var sessionInfo = null;

  /* ---------- Facebook SDK ---------- */
  window.fbAsyncInit = function () {
    FB.init({ appId: ES_CONFIG.appId, autoLogAppEvents: true, cookie: true, xfbml: true, version: FB_VERSION });
  };
  (function (d, s, id) {
    if (d.getElementById(id)) return;
    var js = d.createElement(s);
    js.id = id; js.async = true;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    d.head.appendChild(js);
  }(document, "script", "facebook-jssdk"));

  /* Embedded Signup events (sessionInfoVersion 3): capture waba_id, phone_number_id, business_id */
  window.addEventListener("message", function (event) {
    if (!event.origin.endsWith("facebook.com")) return;
    try {
      var data = JSON.parse(event.data);
      if (data.type !== "WA_EMBEDDED_SIGNUP") return;
      if (data.event === "FINISH" || data.event === "FINISH_ONLY_WABA" || data.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING") {
        sessionInfo = data.data || null;
      } else if (data.event === "CANCEL") {
        console.warn("Embedded signup cancelled at step:", data.data ? data.data.current_step : "unknown");
      } else if (data.event === "ERROR") {
        console.error("Embedded signup error:", data.data ? data.data.error_message : "unknown");
      }
    } catch (e) { /* ignore non-JSON messages */ }
  });

  /* ---------- helpers ---------- */
  function val(name) { return (form.elements[name].value || "").trim(); }
  function fieldError(name, text) {
    var out = form.querySelector('[data-err="' + name + '"]');
    var input = form.elements[name];
    if (out) out.textContent = text || "";
    if (input) { if (text) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
  }
  function showMessage(text) {
    msg.innerHTML = '<div class="su-ok" role="status"></div>';
    msg.firstChild.textContent = text;
  }
  function post(url, body) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }

  /* digits only in the phone field */
  form.elements.telephone.addEventListener("input", function () {
    var v = this.value;
    if (isNaN(v)) {
      v = v.replace(/[^0-9\.]/g, "");
      if (v.split(".").length > 2) v = v.replace(/\.+$/, "");
    }
    this.value = v;
  });
  form.addEventListener("input", function (e) { if (e.target.name) fieldError(e.target.name, ""); });

  function validate() {
    var ok = true;
    function check(name, bad, text) { fieldError(name, bad ? text : ""); if (bad) ok = false; }
    check("lename", !val("lename"), "Please enter Legal Entity Name.");
    check("wabaname", !val("wabaname"), "Please enter WABA Name.");
    check("email", !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val("email")), "Please enter a valid Email ID.");
    check("telephone", !/^\d{7,15}$/.test(val("telephone")), "Please enter a valid phone number (7-15 digits with country code).");
    check("url", !val("url"), "Please enter Website URL.");
    check("address", !val("address"), "Please enter an Address.");
    check("terms", !form.elements.terms.checked, "You must agree to the Terms and Conditions.");
    return ok;
  }

  /* ---------- submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    try {
    msg.innerHTML = "";
    if (!validate()) {
      var bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      return;
    }
    sessionInfo = null; /* reset on every attempt */
    var randomNo = Math.floor(Math.random() * 9000000000) + 1000000000;
    var base = {
      hiddenvalue: form.elements.vastra.value,
      legal_name: val("lename"),
      waba_name: val("wabaname"),
      email: val("email"),
      phone: val("telephone"),
      weburl: val("url"),
      plan: "yearly",
      address: val("address"),
      terms: form.elements.terms.checked
    };

    /* save the details before the Facebook window opens (best effort) */
    post(SAVE_URL, { randomNo: randomNo, dataObjToSend: base }).catch(function (err) { console.warn("save_fb_data failed (ignored):", err); });

    btn.disabled = true;
    FB.login(function (response) {
      btn.disabled = false;
      if (!response.authResponse) return; /* cancelled */

      setTimeout(function () {
        var dataToSend = {
          hiddenvalue: PARTNER.hiddenvalue,
          partnerName: PARTNER.name,
          legal_name: base.legal_name,
          waba_name: base.waba_name,
          email: base.email,
          phone: base.phone,
          weburl: base.weburl,
          plan: "yearly",
          address: base.address,
          type: base.hiddenvalue,
          terms: base.terms,
          randomNo: randomNo,
          appId: ES_CONFIG.appId,
          authResponse: response.authResponse,
          sessionInfo: sessionInfo /* { waba_id, phone_number_id, business_id } or null */
        };

        /* WordPress copy is logging only: a failure does not stop onboarding */
        post(SAVE_URL, { randomNo: randomNo, dataObjToSend: dataToSend }).catch(function (err) { console.warn("save_fb_data failed (ignored):", err); });

        /* backend onboarding */
        post(ONBOARD_URL, dataToSend).then(function (res) {
          if (res.Status == 200 && res.IsSuccess == true) showMessage(res.Message);
          else { console.log("11zaMetaform response", res); showMessage(DONE_MSG); }
        }).catch(function (err) {
          console.error("11zaMetaform error:", err);
          showMessage(DONE_MSG);
        });
      }, 500);
    }, {
      config_id: ES_CONFIG.config_id,
      response_type: "code",
      override_default_response_type: true,
      extras: {
        setup: { solutionID: ES_CONFIG.solutionID },
        featureType: "whatsapp_business_app_onboarding",
        sessionInfoVersion: "3"
      }
    });
    } catch (error) {
      console.error("catch Error:", error);
      btn.disabled = false;
    }
  });
})();
