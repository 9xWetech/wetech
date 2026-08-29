```javascript
(() => {
  "use strict";

  /* =========================================================
     WETECH CONFIG
  ========================================================= */

  const WHATSAPP_NUMBER = "918445209063";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobile =
    window.matchMedia("(max-width: 700px)").matches;


  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));


  /* =========================================================
     SMOOTH SCROLL
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const id = link.getAttribute("href");

      if (!id || id === "#") return;

      const target = $(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

    });

  });


  /* =========================================================
     NAVBAR
  ========================================================= */

  const navbar = $(".navbar");

  const updateNavbar = () => {

    if (!navbar) return;

    navbar.classList.toggle(
      "navbar-scrolled",
      window.scrollY > 30
    );

  };

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = $$(
    [
      ".section-heading",
      ".featured-service",
      ".service-row",
      ".statement-content",
      ".work-card",
      ".process-item",
      ".pricing-card",
      ".contact-box"
    ].join(",")
  );


  if (
    !prefersReducedMotion &&
    "IntersectionObserver" in window
  ) {

    revealElements.forEach((element, index) => {

      element.classList.add("wetech-reveal");

      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 35, 280)}ms`
      );

    });


    const observer =
      new IntersectionObserver(
        (entries, observerInstance) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            observerInstance.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -40px 0px"
        }
      );


    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {

      element.classList.add(
        "wetech-reveal",
        "is-visible"
      );

    });

  }


  /* =========================================================
     HERO PARALLAX
  ========================================================= */

  const heroVisual = $(".hero-visual");
  const heroContent = $(".hero-content");

  if (
    heroVisual &&
    !prefersReducedMotion &&
    !isMobile
  ) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let frame = null;


    const animateParallax = () => {

      currentX +=
        (targetX - currentX) * 0.05;

      currentY +=
        (targetY - currentY) * 0.05;


      heroVisual.style.transform =
        `translate3d(${currentX * 0.7}px, ${currentY * 0.7}px, 0)`;


      if (heroContent) {

        heroContent.style.transform =
          `translate3d(${currentX * -0.05}px, ${currentY * -0.05}px, 0)`;

      }


      frame =
        requestAnimationFrame(
          animateParallax
        );

    };


    window.addEventListener(
      "pointermove",
      (event) => {

        targetX =
          (event.clientX / window.innerWidth - 0.5) * 10;

        targetY =
          (event.clientY / window.innerHeight - 0.5) * 10;

      },
      { passive: true }
    );


    window.addEventListener(
      "blur",
      () => {

        targetX = 0;
        targetY = 0;

      }
    );


    frame =
      requestAnimationFrame(
        animateParallax
      );

  }


  /* =========================================================
     BACKGROUND PARTICLES
  ========================================================= */

  const canvas =
    $("#backgroundCanvas");


  if (
    canvas &&
    !prefersReducedMotion
  ) {

    const ctx =
      canvas.getContext("2d", {
        alpha: true
      });


    if (ctx) {

      let width = 0;
      let height = 0;

      let particles = [];

      let animationFrame = null;

      let running = true;


      const particleCount =
        isMobile ? 20 : 38;


      const resizeCanvas = () => {

        const dpr =
          Math.min(
            window.devicePixelRatio || 1,
            1.5
          );


        width =
          window.innerWidth;

        height =
          window.innerHeight;


        canvas.width =
          Math.floor(width * dpr);

        canvas.height =
          Math.floor(height * dpr);


        canvas.style.width =
          `${width}px`;

        canvas.style.height =
          `${height}px`;


        ctx.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );

      };


      const createParticle = () => ({

        x: Math.random() * width,

        y: Math.random() * height,

        radius:
          Math.random() * 1.1 + 0.25,

        speed:
          Math.random() * 0.14 + 0.035,

        drift:
          (Math.random() - 0.5) * 0.06,

        opacity:
          Math.random() * 0.35 + 0.08

      });


      const createParticles = () => {

        particles =
          Array.from(
            {
              length: particleCount
            },
            createParticle
          );

      };


      const draw = () => {

        if (!running) {

          animationFrame = null;

          return;

        }


        ctx.clearRect(
          0,
          0,
          width,
          height
        );


        particles.forEach((particle) => {

          particle.y -=
            particle.speed;

          particle.x +=
            particle.drift;


          if (particle.y < -10) {

            particle.y =
              height + 10;

            particle.x =
              Math.random() * width;

          }


          if (particle.x < -10) {
            particle.x = width + 10;
          }


          if (particle.x > width + 10) {
            particle.x = -10;
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
            `rgba(120, 220, 255, ${particle.opacity})`;

          ctx.fill();

        });


        animationFrame =
          requestAnimationFrame(draw);

      };


      resizeCanvas();
      createParticles();

      let resizeTimer = null;


      window.addEventListener(
        "resize",
        () => {

          clearTimeout(resizeTimer);

          resizeTimer =
            setTimeout(() => {

              resizeCanvas();
              createParticles();

            }, 150);

        },
        { passive: true }
      );


      document.addEventListener(
        "visibilitychange",
        () => {

          running =
            !document.hidden;


          if (
            running &&
            !animationFrame
          ) {

            animationFrame =
              requestAnimationFrame(draw);

          }

        }
      );


      animationFrame =
        requestAnimationFrame(draw);

    }

  }


  /* =========================================================
     CONTACT / ENQUIRY FORM
  ========================================================= */

  const contactForm =
    document.getElementById("contactForm");

  const formMessage =
    document.getElementById("formMessage");

  const sendButton =
    document.getElementById("sendEnquiryBtn");


  if (contactForm) {


    const nameInput =
      contactForm.elements.namedItem("name");

    const emailInput =
      contactForm.elements.namedItem("email");

    const phoneInput =
      contactForm.elements.namedItem("phone");

    const serviceInput =
      contactForm.elements.namedItem("service");

    const messageInput =
      contactForm.elements.namedItem("message");


    /* -------------------------------------------------------
       FORM MESSAGE
    ------------------------------------------------------- */

    const showMessage =
      (message, type) => {

        if (!formMessage) return;

        formMessage.textContent =
          message;

        formMessage.dataset.type =
          type;

        formMessage.style.opacity =
          "1";

      };


    const clearMessage = () => {

      if (!formMessage) return;

      formMessage.textContent =
        "";

      formMessage.dataset.type =
        "";

      formMessage.style.opacity =
        "0";

    };


    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    const validateEmail =
      (email) => {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(email);

      };


    /* -------------------------------------------------------
       SUBMIT
    ------------------------------------------------------- */

    contactForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        clearMessage();


        const name =
          String(
            nameInput?.value || ""
          ).trim();


        const email =
          String(
            emailInput?.value || ""
          ).trim();


        const phone =
          String(
            phoneInput?.value || ""
          ).trim();


        const service =
          String(
            serviceInput?.value || ""
          ).trim();


        const message =
          String(
            messageInput?.value || ""
          ).trim();


        /* ---------------------------------------------------
           VALIDATION
        --------------------------------------------------- */

        if (!name) {

          showMessage(
            "Please enter your name.",
            "error"
          );

          nameInput?.focus();

          return;

        }


        if (!email) {

          showMessage(
            "Please enter your email.",
            "error"
          );

          emailInput?.focus();

          return;

        }


        if (!validateEmail(email)) {

          showMessage(
            "Please enter a valid email address.",
            "error"
          );

          emailInput?.focus();

          return;

        }


        if (!service) {

          showMessage(
            "Please select what you need.",
            "error"
          );

          serviceInput?.focus();

          return;

        }


        if (!message) {

          showMessage(
            "Please tell us about your project.",
            "error"
          );

          messageInput?.focus();

          return;

        }


        /* ---------------------------------------------------
           BUILD WHATSAPP MESSAGE
        --------------------------------------------------- */

        const whatsappMessage =
`🚀 *NEW WETECH ENQUIRY*

━━━━━━━━━━━━━━━━━━

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *Phone / WhatsApp:* ${phone || "Not provided"}
💼 *Service:* ${service}

📝 *Project Details:*

${message}

━━━━━━━━━━━━━━━━━━

🌐 *Source:* Wetech Website`;


        const whatsappURL =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            whatsappMessage
          )}`;


        /* ---------------------------------------------------
           BUTTON
        --------------------------------------------------- */

        const originalHTML =
          sendButton
            ? sendButton.innerHTML
            : "Send Enquiry <span>→</span>";


        if (sendButton) {

          sendButton.disabled =
            true;

          sendButton.innerHTML =
            `Opening WhatsApp <span>↗</span>`;

        }


        /* ---------------------------------------------------
           OPEN WHATSAPP
        --------------------------------------------------- */

        window.location.href =
          whatsappURL;


        /* ---------------------------------------------------
           CONFIRMATION
        --------------------------------------------------- */

        showMessage(
          "✓ Enquiry submitted successfully. Opening WhatsApp…",
          "success"
        );


        /* Restore button if browser doesn't navigate */

        setTimeout(() => {

          if (sendButton) {

            sendButton.disabled =
              false;

            sendButton.innerHTML =
              originalHTML;

          }

        }, 2000);

      }
    );

  }


  /* =========================================================
     WHATSAPP BUTTON
  ========================================================= */

  $$('.whatsapp-button[href*="wa.me"]')
    .forEach((button) => {

      button.setAttribute(
        "target",
        "_blank"
      );

      button.setAttribute(
        "rel",
        "noopener noreferrer"
      );

    });


  /* =========================================================
     READY
  ========================================================= */

  document.documentElement.classList.add(
    "wetech-ready"
  );

})();
```
