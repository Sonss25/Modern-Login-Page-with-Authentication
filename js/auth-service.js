/* =====================================================
   Auth service abstraction
   This is the ONLY layer that should talk to a backend.
   Every page-specific script calls into window.authService
   rather than reaching for fetch() directly, so swapping
   the mock delay()s below for real API calls is a one-file
   change.

   Integration points are marked. None of these functions
   read or write localStorage/sessionStorage with credentials
   — session/token handling belongs in this layer once a
   real backend exists (e.g. an httpOnly cookie set by the
   server response), not in page code.
===================================================== */
window.authService = (function () {
  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  return {
    login: function (email, password) {
      return delay(1100).then(function () {
        // Integration point: POST /api/auth/login { email, password }
        if (password.length < 8) {
          return Promise.reject({
            message: "Unable to sign in. Please check your credentials and try again."
          });
        }
        return { email: email };
      });
    },

    register: function (payload) {
      return delay(1300).then(function () {
        // Integration point: POST /api/auth/register { name, email, username, password }
        return { email: payload.email };
      });
    },

    requestPasswordReset: function (email) {
      return delay(1000).then(function () {
        // Integration point: POST /api/auth/request-reset { email }
        return { sent: true, email: email };
      });
    }
  };
})();
