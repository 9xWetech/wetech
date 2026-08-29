```javascript
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /*
   * ============================================================
   * WETECH — PERFORMANCE + ANIMATION ENGINE
   * ============================================================
   *
   * Improvements:
   * - Optimized background particles
   * - 30 FPS particle rendering
   * - Animation pauses when tab is hidden
   * - Reduced canvas pixel workload
   * - Smooth hero parallax
   * - Smooth 3D card hover
   * - Scroll reveal using IntersectionObserver
   * - Reduced-motion accessibility
   * - Mobile-friendly animation behavior
   * - Smooth magnetic buttons
   * - Smooth anchor scrolling
   */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;

  const desktopMotion =
    window.innerWidth >= 950 &&
    finePointer &&
    !prefersReducedMotion;

  /* ============================================================
     BACKGROUND PARTICLES
     ============================================================ */

  const canvas = document.getElementById("backgroundCanvas");

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true
    });

    if (ctx) {
      let width = 0;
      let height = 0;
      let dpr = 1;

      let particles = [];

      let frameId = 0;
      let resizeTimer = 0;
      let lastFrame = 0;
      let running = !document.hidden;

      const getParticleCount = () => {
        const area = width * height;

        if (width < 700) {
          return 12;
        }

        if (area < 900000) {
          return 20;
        }

        if (area < 1600000) {
          return 28;
        }

        return 36;
      };

      const createParticles = () => {
        const count = getParticleCount();

        particles = Array.from(
          { length: count },
          () => ({
            x: Math.random() * width,
            y: Math.random() * height,

            vx: (Math.random() - 0.5) * 0.055,
            vy: (Math.random() - 0.5) * 0.055,

            radius: Math.random() * 0.8 + 0.3,

            alpha:
              Math.random() * 0.14 + 0.035
          })
        );
      };

      const resizeCanvas = () => {
        width = window.innerWidth;
        height = window.innerHeight;

        /*
         * Cap DPR to avoid unnecessary canvas workload
         * on high-density mobile displays.
         */
        dpr = Math.min(
          window.devicePixelRatio || 1,
          1.25
        );

        canvas.width = Math.max(
          1,
          Math.floor(width * dpr)
        );

        canvas.height = Math.max(
          1,
          Math.floor(height * dpr)
        );

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

        createParticles();
      };

      const scheduleResize = () => {
        window.clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(
          resizeCanvas,
          120
        );
      };

      const stopAnimation = () => {
        running = false;

        if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
      };

      const startAnimation = () => {
        if (
          prefersReducedMotion ||
          running
        ) {
          return;
        }

        running = true;

        lastFrame = performance.now();

        frameId =
          requestAnimationFrame(animate);
      };

      const animate = (timestamp) => {
        if (
          !running ||
          document.hidden
        ) {
          frameId = 0;
          return;
        }

        /*
         * Particle animation is intentionally capped
         * around 30 FPS to reduce CPU/GPU usage.
         */
        if (
          timestamp - lastFrame <
          1000 / 30
        ) {
          frameId =
            requestAnimationFrame(
              animate
            );

          return;
        }

        lastFrame = timestamp;

        ctx.clearRect(
          0,
          0,
          width,
          height
        );

        ctx.fillStyle =
          "rgba(155,214,255,.12)";

        for (const particle of particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -8) {
            particle.x = width + 8;
          } else if (
            particle.x >
            width + 8
          ) {
            particle.x = -8;
          }

          if (particle.y < -8) {
            particle.y = height + 8;
          } else if (
            particle.y >
            height + 8
          ) {
            particle.y = -8;
          }

          ctx.globalAlpha =
            particle.alpha;

          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }

        ctx.globalAlpha = 1;

        frameId =
          requestAnimationFrame(
            animate
          );
      };

      resizeCanvas();

      window.addEventListener(
        "resize",
        scheduleResize,
        {
          passive: true
        }
      );

      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.hidden) {
            stopAnimation();
          } else {
            startAnimation();
          }
        }
      );

      startAnimation();
    }
  } else if (canvas) {
    canvas.remove();
  }

  /* ============================================================
     HERO PARALLAX
     ============================================================ */

  const hero =
    document.querySelector(".hero");

  const visual =
    document.querySelector(
      ".hero-visual"
    );

  if (
    hero &&
    visual &&
    desktopMotion
  ) {
    let pointerX = 0;
    let pointerY = 0;

    let currentX = 0;
    let currentY = 0;

    let pointerFrame = 0;

    const updateHero = () => {
      pointerFrame = 0;

      currentX +=
        (pointerX - currentX) *
        0.09;

      currentY +=
        (pointerY - currentY) *
        0.09;

      visual.style.transform =
        `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (
        Math.abs(
          pointerX - currentX
        ) > 0.05 ||
        Math.abs(
          pointerY - currentY
        ) > 0.05
      ) {
        pointerFrame =
          requestAnimationFrame(
            updateHero
          );
      }
    };

    hero.addEventListener(
      "pointermove",
      (event) => {
        pointerX =
          (
            event.clientX /
              window.innerWidth -
            0.5
          ) * 7;

        pointerY =
          (
            event.clientY /
              window.innerHeight -
            0.5
          ) * 6;

        if (!pointerFrame) {
          pointerFrame =
            requestAnimationFrame(
              updateHero
            );
        }
      },
      {
        passive: true
      }
    );

    hero.addEventListener(
      "pointerleave",
      () => {
        pointerX = 0;
        pointerY = 0;

        if (!pointerFrame) {
          pointerFrame =
            requestAnimationFrame(
              updateHero
            );
        }
      }
    );
  }

  /* ============================================================
     CARD 3D HOVER
     ============================================================ */

  if (desktopMotion) {
    const cards =
      document.querySelectorAll(
        [
          ".featured-service",
          ".service-row",
          ".work-card",
          ".pricing-card"
        ].join(",")
      );

    cards.forEach((card) => {
      let targetRX = 0;
      let targetRY = 0;

      let currentRX = 0;
      let currentRY = 0;

      let cardFrame = 0;

      const animateCard = () => {
        cardFrame = 0;

        currentRX +=
          (targetRX - currentRX) *
          0.14;

        currentRY +=
          (targetRY - currentRY) *
          0.14;

        card.style.transform =
          `perspective(900px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateY(-4px)`;

        if (
          Math.abs(
            targetRX - currentRX
          ) > 0.02 ||
          Math.abs(
            targetRY - currentRY
          ) > 0.02
        ) {
          cardFrame =
            requestAnimationFrame(
              animateCard
            );
        }
      };

      card.addEventListener(
        "pointermove",
        (event) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX -
              rect.left) /
              rect.width -
            0.5;

          const y =
            (event.clientY -
              rect.top) /
              rect.height -
            0.5;

          targetRX =
            y * -1.2;

          targetRY =
            x * 1.2;

          if (!cardFrame) {
            cardFrame =
              requestAnimationFrame(
                animateCard
              );
          }
        },
        {
          passive: true
        }
      );

      card.addEventListener(
        "pointerleave",
        () => {
          targetRX = 0;
          targetRY = 0;

          if (!cardFrame) {
            cardFrame =
              requestAnimationFrame(
                animateCard
              );
          }
        }
      );
    });
  }

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */

  const reveal =
    document.querySelectorAll(
      [
        ".section-heading",
        ".featured-service",
        ".service-row",
        ".work-card",
        ".process-item",
        ".pricing-card",
        ".contact-box",
        ".statement-content"
      ].join(",")
    );

  if (!prefersReducedMotion) {
    reveal.forEach(
      (element, index) => {
        element.classList.add(
          "wetech-reveal"
        );

        const stagger =
          Math.min(index % 6, 5) *
          45;

        element.style.setProperty(
          "--reveal-delay",
          `${stagger}ms`
        );
      }
    );

    if (
      "IntersectionObserver" in
      window
    ) {
      const observer =
        new IntersectionObserver(
          (entries) => {
            for (
              const entry of entries
            ) {
              if (
                !entry.isIntersecting
              ) {
                continue;
              }

              entry.target.classList.add(
                "is-visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          },
          {
            threshold: 0.08,

            rootMargin:
              "0px 0px -8% 0px"
          }
        );

      reveal.forEach(
        (element) =>
          observer.observe(element)
      );
    } else {
      reveal.forEach(
        (element) =>
          element.classList.add(
            "is-visible"
          )
      );
    }
  } else {
    reveal.forEach(
      (element) =>
        element.classList.add(
          "is-visible"
        )
    );
  }

  ```javascript
/* ============================================================
   WHATSAPP ENQUIRY SYSTEM
   ============================================================ */

const form =
  document.getElementById("contactForm");

const formMessage =
  document.getElementById("formMsg");

if (form) {

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      /*
       * ========================================================
       * WETECH WHATSAPP NUMBER
       * ========================================================
       *
       * IMPORTANT:
       * Replace this with your real Wetech WhatsApp number.
       *
       * Format:
       * India example:
       * 919876543210
       *
       * No + sign
       * No spaces
       * No brackets
       */

      const WETECH_WHATSAPP =
        "910000000000";


      /* ======================================================
         GET FORM DATA
      ====================================================== */

      const formData =
        new FormData(form);

      const name =
        String(
          formData.get("name") || ""
        ).trim();

      const email =
        String(
          formData.get("email") || ""
        ).trim();

      const phone =
        String(
          formData.get("phone") || ""
        ).trim();

      const project =
        String(
          formData.get("project") || ""
        ).trim();


      /* ======================================================
         VALIDATION
      ====================================================== */

      if (!name) {

        if (formMessage) {
          formMessage.textContent =
            "Please enter your name.";
        }

        return;
      }


      if (!email) {

        if (formMessage) {
          formMessage.textContent =
            "Please enter your email.";
        }

        return;
      }


      if (!project) {

        if (formMessage) {
          formMessage.textContent =
            "Please tell us about your project.";
        }

        return;
      }


      /* ======================================================
         CREATE WHATSAPP MESSAGE
      ====================================================== */

      const message =
`🚀 *NEW WETECH ENQUIRY*

━━━━━━━━━━━━━━━━━━

👤 *Name*
${name}

📧 *Email*
${email}

📱 *Phone / WhatsApp*
${phone || "Not provided"}

💼 *Project Details*
${project}

━━━━━━━━━━━━━━━━━━

🌐 *Source*
Wetech Website

🕐 *Enquiry Time*
${new Date().toLocaleString("en-IN")}

Thank you for contacting Wetech!`;


      /* ======================================================
         ENCODE MESSAGE
      ====================================================== */

      const encodedMessage =
        encodeURIComponent(
          message
        );


      /* ======================================================
         WHATSAPP URL
      ====================================================== */

      const whatsappURL =
        `https://wa.me/${WETECH_WHATSAPP}?text=${encodedMessage}`;


      /* ======================================================
         BUTTON STATE
      ====================================================== */

      const button =
        document.getElementById(
          "sendEnquiryBtn"
        );

      if (button) {

        button.disabled = true;

        button.innerHTML =
          "Opening WhatsApp...";
      }


      if (formMessage) {

        formMessage.textContent =
          "Opening WhatsApp with your enquiry...";
      }


      /* ======================================================
         OPEN WHATSAPP
      ====================================================== */

      window.setTimeout(
        () => {

          window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
          );

          if (button) {

            button.disabled = false;

            button.innerHTML =
              "Send Enquiry on WhatsApp";
          }

        },
        250
      );

    }
  );
}
```

  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */

  if (desktopMotion) {
    const buttons =
      document.querySelectorAll(
        ".button, .nav-button"
      );

    buttons.forEach((button) => {
      let targetX = 0;
      let targetY = 0;

      let currentX = 0;
      let currentY = 0;

      let buttonFrame = 0;

      const animateButton = () => {
        buttonFrame = 0;

        currentX +=
          (targetX - currentX) *
          0.16;

        currentY +=
          (targetY - currentY) *
          0.16;

        button.style.transform =
          `translate3d(${currentX}px, ${currentY}px, 0)`;

        if (
          Math.abs(
            targetX - currentX
          ) > 0.02 ||
          Math.abs(
            targetY - currentY
          ) > 0.02
        ) {
          buttonFrame =
            requestAnimationFrame(
              animateButton
            );
        }
      };

      button.addEventListener(
        "pointermove",
        (event) => {
          const rect =
            button.getBoundingClientRect();

          targetX =
            (
              event.clientX -
              rect.left -
              rect.width / 2
            ) * 0.025;

          targetY =
            (
              event.clientY -
              rect.top -
              rect.height / 2
            ) * 0.025;

          if (!buttonFrame) {
            buttonFrame =
              requestAnimationFrame(
                animateButton
              );
          }
        },
        {
          passive: true
        }
      );

      button.addEventListener(
        "pointerleave",
        () => {
          targetX = 0;
          targetY = 0;

          if (!buttonFrame) {
            buttonFrame =
              requestAnimationFrame(
                animateButton
              );
          }
        }
      );
    });
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLLING
     ============================================================ */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((link) => {
      link.addEventListener(
        "click",
        (event) => {
          const id =
            link.getAttribute(
              "href"
            );

          if (
            !id ||
            id === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              id
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior:
              prefersReducedMotion
                ? "auto"
                : "smooth",

            block: "start"
          });
        }
      );
    });
});
```
