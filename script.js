document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     COSMIC / TECH PARTICLES
  ===================================================== */

  const canvas = document.getElementById("techCanvas");
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let particles = [];

  function resizeCanvas() {

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      1.35
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    const count = width < 700 ? 24 : 48;

    particles = Array.from(
      { length: count },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.10,
        vy: (Math.random() - 0.5) * 0.10,
        radius: Math.random() * 1.1 + 0.25,
        alpha: Math.random() * 0.24 + 0.06
      })
    );
  }

  resizeCanvas();

  window.addEventListener(
    "resize",
    resizeCanvas,
    { passive: true }
  );

  let lastFrame = 0;

  function animateParticles(timestamp) {

    if (timestamp - lastFrame < 1000 / 40) {
      requestAnimationFrame(animateParticles);
      return;
    }

    lastFrame = timestamp;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    particles.forEach((particle) => {

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -10) {
        particle.x = width + 10;
      }

      if (particle.x > width + 10) {
        particle.x = -10;
      }

      if (particle.y < -10) {
        particle.y = height + 10;
      }

      if (particle.y > height + 10) {
        particle.y = -10;
      }

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(
          213,
          229,
          235,
          ${particle.alpha}
        )`;

      ctx.shadowBlur = 6;
      ctx.shadowColor =
        "rgba(199,255,74,.24)";

      ctx.fill();

    });

    requestAnimationFrame(
      animateParticles
    );
  }

  requestAnimationFrame(
    animateParticles
  );


  /* =====================================================
     HERO OBJECT PARALLAX
  ===================================================== */

  const heroObject =
    document.querySelector(".hero-object");

  const hero =
    document.querySelector(".hero");

  if (
    hero &&
    heroObject &&
    window.innerWidth >= 900
  ) {

    hero.addEventListener(
      "pointermove",
      (event) => {

        const x =
          event.clientX /
          window.innerWidth -
          0.5;

        const y =
          event.clientY /
          window.innerHeight -
          0.5;

        heroObject.style.transform =
          `
          translate3d(
            ${x * 10}px,
            ${y * 8}px,
            0
          )
          `;

      },
      { passive: true }
    );

    hero.addEventListener(
      "pointerleave",
      () => {
        heroObject.style.transform = "";
      }
    );

  }


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealElements =
    document.querySelectorAll(
      ".reveal-up"
    );

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "is-visible"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.08
        }
      );

    revealElements.forEach(
      (element) => {
        observer.observe(element);
      }
    );

  } else {

    revealElements.forEach(
      (element) => {
        element.classList.add(
          "is-visible"
        );
      }
    );

  }


  /* =====================================================
     CARD INTERACTION
  ===================================================== */

  if (window.innerWidth >= 900) {

    document
      .querySelectorAll(
        ".service-row, .service-feature, .work-main, .work-side, .price-card"
      )
      .forEach((card) => {

        card.addEventListener(
          "pointermove",
          (event) => {

            const rect =
              card.getBoundingClientRect();

            const x =
              (
                event.clientX -
                rect.left
              ) /
              rect.width -
              0.5;

            const y =
              (
                event.clientY -
                rect.top
              ) /
              rect.height -
              0.5;

            card.style.transform =
              `
              perspective(900px)
              rotateX(${y * -1.8}deg)
              rotateY(${x * 1.8}deg)
              translateY(-4px)
              `;

          },
          { passive: true }
        );

        card.addEventListener(
          "pointerleave",
          () => {
            card.style.transform = "";
          }
        );

      });

  }


  /* =====================================================
     CONTACT FORM
  ===================================================== */

  const form =
    document.getElementById(
      "contactForm"
    );

  const formMessage =
    document.getElementById(
      "formMessage"
    );

  if (form) {

    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        if (formMessage) {

          formMessage.textContent =
            "✓ Thanks! Your enquiry has been received.";

        }

        form.reset();

      }
    );

  }


  /* =====================================================
     LIGHT STREAKS
  ===================================================== */

  function createLightStreak() {

    if (window.innerWidth < 700) {
      return;
    }

    const streak =
      document.createElement("div");

    streak.style.position = "fixed";
    streak.style.width = "110px";
    streak.style.height = "1px";

    streak.style.left =
      `${65 + Math.random() * 25}%`;

    streak.style.top =
      `${8 + Math.random() * 28}%`;

    streak.style.zIndex = "-2";
    streak.style.pointerEvents = "none";

    streak.style.background =
      `
      linear-gradient(
        90deg,
        transparent,
        rgba(221,255,172,.85),
        transparent
      )
      `;

    streak.style.boxShadow =
      "0 0 10px rgba(199,255,74,.32)";

    streak.style.transform =
      "rotate(-26deg)";

    document.body.appendChild(
      streak
    );

    const animation =
      streak.animate(
        [
          {
            opacity: 0,
            transform:
              "translate(0,0) rotate(-26deg)"
          },
          {
            opacity: 0.75
          },
          {
            opacity: 0,
            transform:
              "translate(-260px,165px) rotate(-26deg)"
          }
        ],
        {
          duration: 1600,
          easing: "ease-out"
        }
      );

    animation.onfinish = () => {
      streak.remove();
    };
  }

  setInterval(
    createLightStreak,
    9000
  );


  /* =====================================================
     MAGNETIC BUTTONS
  ===================================================== */

  if (window.innerWidth >= 900) {

    document
      .querySelectorAll(
        ".btn, .nav-cta"
      )
      .forEach((button) => {

        button.addEventListener(
          "pointermove",
          (event) => {

            const rect =
              button.getBoundingClientRect();

            const x =
              (
                event.clientX -
                rect.left -
                rect.width / 2
              ) * 0.05;

            const y =
              (
                event.clientY -
                rect.top -
                rect.height / 2
              ) * 0.05;

            button.style.transform =
              `
              translate(
                ${x}px,
                ${y}px
              )
              `;

          },
          { passive: true }
        );

        button.addEventListener(
          "pointerleave",
          () => {
            button.style.transform = "";
          }
        );

      });

  }


  /* =====================================================
     SMOOTH INTERNAL LINKS
  ===================================================== */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              targetId
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });

});
