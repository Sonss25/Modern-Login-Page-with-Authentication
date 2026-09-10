/* =====================================================
   UI Helpers
===================================================== */

window.AxionUI = (function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldOf(input) {
    return input.closest(".field");
  }

  function setFieldState(fieldEl, state) {
    // state: 'valid' | 'invalid' | 'neutral'
    fieldEl.classList.remove("is-valid", "is-invalid");
    if (state === "valid") fieldEl.classList.add("is-valid");
    if (state === "invalid") fieldEl.classList.add("is-invalid");
  }

  function showBanner(id, text) {
    var b = document.getElementById(id);
    if (!b) return;
    if (text) {
      var span = b.querySelector("span:not(.sr-only)");
      if (span) span.textContent = text;
    }
    b.classList.add("is-visible");
  }

  function hideBanner(id) {
    var b = document.getElementById(id);
    if (b) b.classList.remove("is-visible");
  }

  function setButtonLoading(btn, loading) {
    btn.classList.toggle("is-loading", loading);
    btn.disabled = loading;
  }

  function setButtonSuccess(btn) {
    btn.classList.remove("is-loading");
    btn.classList.add("is-success");
  }

  function initPasswordToggles(root) {
    (root || document).querySelectorAll("[data-toggle-pass]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = document.getElementById(btn.getAttribute("data-toggle-pass"));
        var isPass = input.type === "password";
        input.type = isPass ? "text" : "password";
        btn.setAttribute("aria-pressed", String(isPass));
        btn.setAttribute("aria-label", isPass ? "Hide password" : "Show password");
        btn.innerHTML = isPass
          ? '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 2l16 16M8.3 8.4A2.4 2.4 0 0010 12.4c.6 0 1.2-.2 1.6-.6M6.1 6.2C4 7.5 2.5 9.5 1.5 10c1.2 2.3 4 6 8.5 6 1.4 0 2.7-.4 3.8-1M12.4 5.2A9.7 9.7 0 0010 5c-.6 0-1.1 0-1.6.1"/></svg>'
          : '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z"/><circle cx="10" cy="10" r="2.4"/></svg>';
      });
    });
  }

  // Focus the page heading on load so screen-reader users get an
  // immediate, accurate announcement of which auth page they're on.
  function focusHeading() {
    var h1 = document.querySelector(".view-head h1");
    if (h1) {
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }
  }

  // Intercept clicks on same-site auth-flow links so navigating
  // between login / register / forgot-password feels like one
  // continuous app rather than a hard page reload.
  function initPageTransitions() {
    var card = document.getElementById("card");
    document.querySelectorAll("a[data-transition]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || link.target === "_blank") return;
        e.preventDefault();
        if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.location.href = href;
          return;
        }
        card.classList.remove("page-enter");
        card.classList.add("page-leave");
        setTimeout(function () {
          window.location.href = href;
        }, 260);
      });
    });
  }

  return {
    EMAIL_RE: EMAIL_RE,
    fieldOf: fieldOf,
    setFieldState: setFieldState,
    showBanner: showBanner,
    hideBanner: hideBanner,
    setButtonLoading: setButtonLoading,
    setButtonSuccess: setButtonSuccess,
    initPasswordToggles: initPasswordToggles,
    focusHeading: focusHeading,
    initPageTransitions: initPageTransitions
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  AxionUI.initPasswordToggles(document);
  AxionUI.initPageTransitions();
  AxionUI.focusHeading();
});
