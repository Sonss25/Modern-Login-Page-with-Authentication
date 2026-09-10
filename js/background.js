/* =====================================================
   Animated background
   Shared by every auth page. GPU-cheap: transform/opacity
   only for the orbs (pure CSS), plain 2D canvas for the
   faint particle field.
===================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("bg");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W, H, particles = [];
  var PARTICLE_COUNT = window.innerWidth < 600 ? 26 : 46;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(180,195,255,0.55)";
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(140,160,255,0.10)";
    ctx.lineWidth = 1;
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  initParticles();
  window.addEventListener("resize", function () {
    resize();
    initParticles();
  });

  if (!reduceMotion) {
    requestAnimationFrame(step);
  } else {
    step(); // draw a single static frame
  }
})();
