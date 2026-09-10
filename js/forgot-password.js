/* =====================================================
   Forgot password page logic
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var ui = window.AxionUI;
  var form = document.getElementById("forgot-form");
  if (!form) return;

  var emailInput = document.getElementById("forgot-email");
  var submitBtn = document.getElementById("forgot-submit");
  var requestPane = document.getElementById("forgot-request");
  var sentPane = document.getElementById("forgot-sent");
  var sentEmailEl = document.getElementById("forgot-sent-email");
  var resendBtn = document.getElementById("resend-btn");
  var cooldownTimer = null;

  function validateEmail(showState) {
    var f = ui.fieldOf(emailInput);
    var ok = ui.EMAIL_RE.test(emailInput.value.trim());
    if (showState) ui.setFieldState(f, ok ? "valid" : "invalid");
    return ok;
  }

  emailInput.addEventListener("input", function () {
    if (ui.fieldOf(emailInput).classList.contains("is-invalid")) validateEmail(true);
  });

  function startCooldown(seconds) {
    var remaining = seconds;
    resendBtn.disabled = true;
    resendBtn.textContent = "Resend email (" + remaining + "s)";
    clearInterval(cooldownTimer);
    cooldownTimer = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(cooldownTimer);
        resendBtn.disabled = false;
        resendBtn.textContent = "Resend email";
      } else {
        resendBtn.textContent = "Resend email (" + remaining + "s)";
      }
    }, 1000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ui.hideBanner("forgot-banner");
    if (!validateEmail(true)) return;

    ui.setButtonLoading(submitBtn, true);
    window.authService
      .requestPasswordReset(emailInput.value.trim())
      .then(function (res) {
        ui.setButtonLoading(submitBtn, false);
        sentEmailEl.textContent = res.email;
        requestPane.hidden = true;
        sentPane.hidden = false;
        startCooldown(30);
      })
      .catch(function (err) {
        ui.setButtonLoading(submitBtn, false);
        ui.showBanner("forgot-banner", err && err.message);
      });
  });

  resendBtn.addEventListener("click", function () {
    if (resendBtn.disabled) return;
    window.authService.requestPasswordReset(emailInput.value.trim());
    startCooldown(30);
  });
});
