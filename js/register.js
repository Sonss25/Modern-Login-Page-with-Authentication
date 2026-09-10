/* =====================================================
   Register page logic
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var ui = window.AxionUI;
  var form = document.getElementById("register-form");
  if (!form) return;

  var nameInput = document.getElementById("reg-name");
  var emailInput = document.getElementById("reg-email");
  var usernameInput = document.getElementById("reg-username");
  var passInput = document.getElementById("reg-password");
  var confirmInput = document.getElementById("reg-confirm");
  var termsInput = document.getElementById("reg-terms");
  var termsErr = document.getElementById("reg-terms-err");
  var submitBtn = document.getElementById("register-submit");
  var strengthEl = document.getElementById("strength");
  var strengthLabel = document.getElementById("strength-label");

  var strengthWords = ["Too weak", "Weak", "Fair", "Good", "Strong"];

  function checkReqs(pw) {
    return {
      len: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw)
    };
  }

  function updateStrength() {
    var pw = passInput.value;
    var reqs = checkReqs(pw);
    var metCount = 0;
    Object.keys(reqs).forEach(function (key) {
      var li = strengthEl.querySelector('[data-req="' + key + '"]');
      var met = reqs[key];
      li.classList.toggle("met", met);
      if (met) metCount++;
    });
    var level = pw.length === 0 ? 0 : Math.max(1, Math.round((metCount / 5) * 4));
    strengthEl.setAttribute("data-level", pw.length === 0 ? "0" : String(level));
    strengthLabel.textContent = pw.length === 0 ? "Password strength" : strengthWords[level];
    return reqs;
  }

  function validateName(showState) {
    var f = ui.fieldOf(nameInput);
    var ok = nameInput.value.trim().length > 0;
    if (showState) ui.setFieldState(f, ok ? "valid" : "invalid");
    return ok;
  }

  function validateEmail(showState) {
    var f = ui.fieldOf(emailInput);
    var ok = ui.EMAIL_RE.test(emailInput.value.trim());
    if (showState) ui.setFieldState(f, ok ? "valid" : "invalid");
    return ok;
  }

  function validatePassword(showState) {
    var f = ui.fieldOf(passInput);
    var reqs = checkReqs(passInput.value);
    var ok = reqs.len && reqs.upper && reqs.lower && reqs.number && reqs.special;
    if (showState) ui.setFieldState(f, ok ? "valid" : "invalid");
    return ok;
  }

  function validateConfirm(showState) {
    var f = ui.fieldOf(confirmInput);
    var ok = confirmInput.value.length > 0 && confirmInput.value === passInput.value;
    if (showState) ui.setFieldState(f, ok ? "valid" : "invalid");
    return ok;
  }

  function validateTerms(showState) {
    var ok = termsInput.checked;
    if (showState) {
      termsErr.style.maxHeight = ok ? "0" : "30px";
      termsErr.style.opacity = ok ? "0" : "1";
      termsErr.style.marginTop = ok ? "-8px" : "2px";
    }
    return ok;
  }

  passInput.addEventListener("input", function () {
    updateStrength();
    if (ui.fieldOf(passInput).classList.contains("is-invalid")) validatePassword(true);
    if (confirmInput.value) validateConfirm(true);
  });
  nameInput.addEventListener("input", function () {
    if (ui.fieldOf(nameInput).classList.contains("is-invalid")) validateName(true);
  });
  emailInput.addEventListener("input", function () {
    if (ui.fieldOf(emailInput).classList.contains("is-invalid")) validateEmail(true);
  });
  confirmInput.addEventListener("input", function () {
    validateConfirm(true);
  });
  termsInput.addEventListener("change", function () {
    validateTerms(true);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    ui.hideBanner("register-banner");

    var ok = true;
    if (!validateName(true)) ok = false;
    if (!validateEmail(true)) ok = false;
    if (!validatePassword(true)) ok = false;
    if (!validateConfirm(true)) ok = false;
    if (!validateTerms(true)) ok = false;
    if (!ok) return;

    ui.setButtonLoading(submitBtn, true);
    window.authService
      .register({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        username: usernameInput.value.trim(),
        password: passInput.value
      })
      .then(function () {
        ui.setButtonSuccess(submitBtn);
        submitBtn.querySelector(".btn-label").textContent = "Account created";
        setTimeout(function () {
          window.location.href = "index.html";
        }, 1100);
      })
      .catch(function (err) {
        ui.setButtonLoading(submitBtn, false);
        ui.showBanner("register-banner", err && err.message);
      });
  });
});
