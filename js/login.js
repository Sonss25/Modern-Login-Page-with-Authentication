/* =====================================================
   Login page logic
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var ui = window.AxionUI;
  var form = document.getElementById("login-form");
  if (!form) return;

  var emailInput = document.getElementById("login-email");
  var passInput = document.getElementById("login-password");
  var submitBtn = document.getElementById("login-submit");

  function validateEmail(showState) {
    var f = ui.fieldOf(emailInput);
    var ok = ui.EMAIL_RE.test(emailInput.value.trim());
    if (showState) ui.setFieldState(f, ok ? "valid" : "invalid");
    return ok;
  }

  function validatePassword(showState) {
    var f = ui.fieldOf(passInput);
    var ok = passInput.value.length > 0;
    if (showState) {
      if (ok) f.classList.remove("is-valid", "is-invalid");
      else ui.setFieldState(f, "invalid");
    }
    return ok;
  }

  emailInput.addEventListener("input", function () {
    if (ui.fieldOf(emailInput).classList.contains("is-invalid")) validateEmail(true);
  });
  passInput.addEventListener("input", function () {
    if (ui.fieldOf(passInput).classList.contains("is-invalid")) validatePassword(true);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ui.hideBanner("login-banner");

    var emailOk = validateEmail(true);
    var passOk = validatePassword(true);
    if (!emailOk || !passOk) return;

    ui.setButtonLoading(submitBtn, true);
    window.authService
      .login(emailInput.value.trim(), passInput.value)
      .then(function () {
        ui.setButtonSuccess(submitBtn);
        setTimeout(function () {
          // Integration point: redirect to the authenticated app,
          // e.g. window.location.href = "/dashboard";
          submitBtn.querySelector(".btn-label").textContent = "Redirecting…";
        }, 900);
      })
      .catch(function (err) {
        ui.setButtonLoading(submitBtn, false);
        ui.showBanner("login-banner", err && err.message);
        ui.setFieldState(ui.fieldOf(passInput), "invalid");
      });
  });
});
