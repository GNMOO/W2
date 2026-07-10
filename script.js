/* =========================================================
   دعوة زفاف فاخرة — script.js
   جافاسكربت خالص بدون أي مكتبات خارجية
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1) شاشة التحميل: تختفي بعد تحميل الصفحة بقليل
  --------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      startOpeningReveal(); // تبدأ حركة النص بعد اختفاء شاشة التحميل
    }, 900);
  });
  // شبكة أمان: في حال تأخر حدث load كثيرًا
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      startOpeningReveal();
    }
  }, 3000);


  /* ---------------------------------------------------
     2) حركة ظهور جمل الافتتاحية واحدة تلو الأخرى
  --------------------------------------------------- */
  function startOpeningReveal() {
    const lines = document.querySelectorAll('#scene-opening .reveal-line');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('show'), i * 750);
    });
  }


  /* ---------------------------------------------------
     3) زر تشغيل / إيقاف الموسيقى
  --------------------------------------------------- */
  const musicBtn = document.getElementById('music-toggle');
  const musicLabel = musicBtn.querySelector('.music-label');
  const audio = document.getElementById('bg-music');
  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play().catch(() => {
        // في حال منع المتصفح للتشغيل التلقائي، لا مشكلة، المستخدم ضغط يدويًا
      });
      musicLabel.textContent = 'إيقاف الموسيقى';
      musicBtn.classList.add('playing');
    } else {
      audio.pause();
      musicLabel.textContent = 'تشغيل الموسيقى';
      musicBtn.classList.remove('playing');
    }
    isPlaying = !isPlaying;
  });


  /* ---------------------------------------------------
     4) تأثير التوهج حول المؤشر (سطح المكتب فقط)
  --------------------------------------------------- */
  const glowCursor = document.getElementById('glow-cursor');
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktop) {
    window.addEventListener('mousemove', (e) => {
      glowCursor.style.left = e.clientX + 'px';
      glowCursor.style.top = e.clientY + 'px';
    });
  }


  /* ---------------------------------------------------
     5) توليد زهور صغيرة عائمة في الخلفية
  --------------------------------------------------- */
  const flowersContainer = document.getElementById('floating-flowers');
  const FLOWER_COUNT = 14;
  const flowerSVG = `
    <svg viewBox="0 0 40 40" width="100%" height="100%">
      <ellipse cx="20" cy="12" rx="5" ry="8" fill="#C9D8B6"/>
      <ellipse cx="20" cy="12" rx="5" ry="8" fill="#C9D8B6" transform="rotate(72 20 20)"/>
      <ellipse cx="20" cy="12" rx="5" ry="8" fill="#C9D8B6" transform="rotate(144 20 20)"/>
      <ellipse cx="20" cy="12" rx="5" ry="8" fill="#C9D8B6" transform="rotate(216 20 20)"/>
      <ellipse cx="20" cy="12" rx="5" ry="8" fill="#C9D8B6" transform="rotate(288 20 20)"/>
      <circle cx="20" cy="20" r="3" fill="#C9A860"/>
    </svg>`;

  for (let i = 0; i < FLOWER_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'floating-flower';
    el.innerHTML = flowerSVG;
    const size = 14 + Math.random() * 20;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = Math.random() * 100 + 'vh';
    el.style.animationDuration = (6 + Math.random() * 8) + 's';
    el.style.animationDelay = (Math.random() * 5) + 's';
    flowersContainer.appendChild(el);
  }


  /* ---------------------------------------------------
     6) الكونفيتي الأبيض المتساقط (Canvas)
  --------------------------------------------------- */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // إعداد جزيئات الكونفيتي
  let confettiDensity = 55; // العدد الأساسي، يزداد قليلًا في مشهد الختام
  const pieces = [];

  function createPiece() {
    return {
      x: Math.random() * W,
      y: Math.random() * -H,
      r: 3 + Math.random() * 4,
      speed: 0.4 + Math.random() * 0.9,
      drift: Math.random() * 1 - 0.5,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.02,
      opacity: 0.5 + Math.random() * 0.4,
      rotation: Math.random() * 360
    };
  }

  for (let i = 0; i < confettiDensity; i++) pieces.push(createPiece());

  function drawConfetti() {
    ctx.clearRect(0, 0, W, H);
    pieces.forEach(p => {
      p.y += p.speed;
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.6 + p.drift * 0.2;
      p.rotation += 0.5;

      if (p.y > H + 10) {
        p.y = -10;
        p.x = Math.random() * W;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawConfetti);
  }
  drawConfetti();

  // زيادة كثافة الكونفيتي عند الوصول لمشهد الختام
  const endingScene = document.getElementById('scene-ending');
  const endingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // إضافة جزيئات إضافية لجعل التساقط أكثف قليلاً
        if (pieces.length < 120) {
          for (let i = 0; i < 40; i++) pieces.push(createPiece());
        }
      }
    });
  }, { threshold: 0.3 });
  endingObserver.observe(endingScene);


  /* ---------------------------------------------------
     7) كشف الأقسام والبطاقات عند التمرير (Scroll Reveal)
  --------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal-section, .reveal-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  revealTargets.forEach(target => revealObserver.observe(target));


  /* ---------------------------------------------------
     8) حركة نمو الطفلين إلى عروسين عند وصول القسم
  --------------------------------------------------- */
  const growthStage = document.getElementById('growth-stage');
  const growthObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        growthStage.classList.add('in-view');
        growthObserver.unobserve(growthStage);
      }
    });
  }, { threshold: 0.4 });
  growthObserver.observe(growthStage);

});
