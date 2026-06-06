/* ===========================================================
   MELI catering site
   Vanilla JS. No dependencies.

   To go live, set your WhatsApp number below. Use the full
   international format, digits only, no plus sign or spaces.
   A UK mobile 07123 456789 becomes 447123456789.
   =========================================================== */

(function () {
  "use strict";

  var WA_NUMBER = "447414962803";

  /* Google Forms mirror. Keyed by each form's data-message-title.
     The field keys are the website input "name" attributes; the values are
     the Google Form entry IDs read from the live forms. */
  var GOOGLE_FORMS = {
    "New party booking request": {
      action: "https://docs.google.com/forms/d/e/1FAIpQLSf61L9tVk2W_mO0w0jNGIOy6gdjGxvvBVNwTWs0wkoY61zRpQ/formResponse",
      fields: {
        name: "1684396316",
        phone: "1009122464",
        email: "2047292245",
        date: "2137926171",
        package: "568829784",
        children: "2093916686",
        adults: "30146686",
        notes: "955270889"
      }
    },
    "New Lunch Club enquiry": {
      action: "https://docs.google.com/forms/d/e/1FAIpQLSfJFEdJW_I2goH7TUjrAr2NTfP7ml41mp452wMuqF4Tqh-6dw/formResponse",
      fields: {
        company: "1770903617",
        name: "1093829625",
        phone: "1595873266",
        email: "452679199",
        day: "1303335336",
        team: "616077541",
        start: "1947877169"
      }
    }
  };

  /* Current year in the footer */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile navigation toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { setNav(false); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setNav(false); }
    });
  }

  /* Hide broken images so the wrapper shows a clean tint, not an icon */
  var markBroken = function (img) { img.classList.add("is-broken"); };
  var images = document.querySelectorAll("img");
  for (var i = 0; i < images.length; i++) {
    (function (img) {
      if (img.complete && img.naturalWidth === 0) { markBroken(img); }
      img.addEventListener("error", function () { markBroken(img); });
    })(images[i]);
  }

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Package buttons preselect the dropdown and scroll to the form */
  var packageButtons = document.querySelectorAll("[data-package]");
  for (var b = 0; b < packageButtons.length; b++) {
    packageButtons[b].addEventListener("click", function (e) {
      var value = this.getAttribute("data-package");
      var select = document.getElementById("p-package");
      var target = document.getElementById("request");
      if (select) { select.value = value; }
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        var firstField = document.getElementById("p-name");
        if (firstField) {
          window.setTimeout(function () {
            firstField.focus({ preventScroll: true });
          }, prefersReduced ? 0 : 450);
        }
      }
    });
  }

  /* Forms that send a pre-filled message to WhatsApp */
  var forms = document.querySelectorAll(".wa-form");
  for (var f = 0; f < forms.length; f++) {
    forms[f].addEventListener("submit", function (e) {
      e.preventDefault();
      var form = this;
      var status = form.querySelector(".form__status");

      /* Validate required fields using built-in constraints */
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) { status.textContent = ""; }
        return;
      }

      var title = form.getAttribute("data-message-title") || "New enquiry";
      var lines = [title, ""];
      var fields = form.querySelectorAll("[data-label]");
      for (var k = 0; k < fields.length; k++) {
        var field = fields[k];
        var label = field.getAttribute("data-label");
        var value = (field.value || "").trim();
        if (value !== "") {
          lines.push(label + ": " + value);
        }
      }

      /* Mirror the submission to Google Forms in the background.
         Best effort only: if it fails for any reason we still open WhatsApp,
         so no enquiry is ever lost. */
      var cfg = GOOGLE_FORMS[title];
      if (cfg) {
        try {
          var gparams = new URLSearchParams();
          for (var fn in cfg.fields) {
            if (cfg.fields.hasOwnProperty(fn)) {
              var gel = form.querySelector('[name="' + fn + '"]');
              gparams.append("entry." + cfg.fields[fn], gel && gel.value ? gel.value : "");
            }
          }
          fetch(cfg.action, { method: "POST", mode: "no-cors", body: gparams, keepalive: true }).catch(function () {});
        } catch (gerr) { /* ignore and continue */ }
      }

      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));

      if (status) { status.textContent = "Sent. We reply the same day."; }

      var win = window.open(url, "_blank");
      if (!win) { window.location.href = url; }
    });
  }

  /* Reveal sections, headings, paragraphs and cards as they scroll into view.
     Cards within a row are staggered 120ms apart. The js-anim class is set in
     the page head only when motion is welcome and IntersectionObserver exists,
     so reduced-motion users and old browsers see everything instantly. */
  if (!prefersReduced && "IntersectionObserver" in window &&
      document.documentElement.classList.contains("js-anim")) {
    window.__meliReveal = true;

    var revealSelector = ".hero__content, .page-intro .eyebrow, .page-intro h1, .page-intro .lead, .section__head, .feature-card, .package, .addon, .step, .benefit, .gallery .media, .founder__media, .founder__text, .split__media, .split__text, .form, .price-tag, .packages-note, .small-print";
    var groups = document.querySelectorAll(".feature-grid, .packages, .addons, .benefits, .steps, .gallery");

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) { continue; }
        var node = entries[i].target;
        var delay = (node.__stagger || 0) * 120;
        (function (el, d) {
          if (d) { window.setTimeout(function () { el.classList.add("is-visible"); }, d); }
          else { el.classList.add("is-visible"); }
        })(node, delay);
        io.unobserve(node);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    var handled = [];
    for (var g = 0; g < groups.length; g++) {
      var kids = groups[g].children;
      var rows = {};
      for (var k = 0; k < kids.length; k++) {
        var top = Math.round(kids[k].offsetTop / 6);
        (rows[top] = rows[top] || []).push(kids[k]);
      }
      for (var key in rows) {
        if (rows.hasOwnProperty(key)) {
          for (var r = 0; r < rows[key].length; r++) { rows[key][r].__stagger = r; }
        }
      }
      for (var k2 = 0; k2 < kids.length; k2++) { handled.push(kids[k2]); io.observe(kids[k2]); }
    }

    var solos = document.querySelectorAll(revealSelector);
    for (var s = 0; s < solos.length; s++) {
      if (handled.indexOf(solos[s]) === -1) { io.observe(solos[s]); }
    }
  }
})();
