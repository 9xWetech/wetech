```javascript
/* ============================================================
   WETECH — MAIN JAVASCRIPT
   Performance + Animation + WhatsApp Enquiry System
   ============================================================ */

(() => {
  "use strict";

  /* ==========================================================
     CONFIG
  ========================================================== */

  const WETECH_WHATSAPP = "918445209063";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isMobile = window.matchMedia(
    "(max-width: 700px)"
  ).matches;


  /* ==========================================================
     HELPERS
  ========================================================== */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));


  /* ==========================================================
     SMOOTH INTERNAL NAVIGATION
  ========================================================== */

  const internalLinks = $$('a[href^="#"]');

  internalLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = $(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      /*
       * Keep keyboard/screen-reader focus meaningful.
       */
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }

      window.setTimeout(() => {
        target.focus({
          preventScroll: true
        });
      }, prefersReducedMotion ? 0 : 500);

    });

  });


  /* ==========================================================
     SCROLL REVEAL
  ========================================================== */

  const revealElements = [
    ".section-heading",
    ".featured-service",
    ".service-row",
    ".statement-content",
    ".work-card",
    ".process-item",
    ".pricing-card",
    ".contact-box"
  ];

  const revealTargets = $$(revealElements.join(", "));


  if (!prefersReducedMotion && "IntersectionObserver" in window) {

    revealTargets.forEach((element, index) => {

      element.classList.add("wetech-reveal");

      const delay =
        Math.min(index * 35, 280);

      element.style.setProperty(
        "--reveal-delay",
        `${delay}ms`
      );

    });


    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );


    revealTargets.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealTargets.forEach((element) => {
      element.classList.add(
        "wetech-reveal",
        "is-visible"
      );
    });

  }


  /* ==========================================================
     NAVBAR SCROLL STATE
  ========================================================== */

  const navbar = $(".navbar");

  let navbarTicking = false;

  const updateNavbar = () => {

    if (!navbar) {
      return;
    }

    navbar.classList.toggle(
      "navbar-scrolled",
      window.scrollY > 30
    );

    navbarTicking = false;

  };


  window.addEventListener(
    "scroll",
    () => {

      if (navbarTicking) {
        return;
      }

      navbarTicking = true;

      window.requestAnimationFrame(
        updateNavbar
      );

    },
    {
      passive: true
    }
  );


  updateNavbar();


  /* ==========================================================
     HERO PARALLAX
     Desktop only
  ========================================================== */

  const heroVisual = $(".hero-visual");
  const heroContent = $(".hero-content");

  if (
    heroVisual &&
    !prefersReducedMotion &&
    !isMobile
  ) {

    let pointerX = 0;
    let pointerY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationFrame = null;


    const updateParallax = () => {

      currentX +=
        (pointerX - currentX) * 0.055;

      currentY +=
        (pointerY - currentY) * 0.055;


      heroVisual.style.transform =
        `translate3d(${currentX * 0.7}px, ${currentY * 0.7}px, 0)`;


      if (heroContent) {

        heroContent.style.transform =
          `translate3d(${currentX * -0.08}px, ${currentY * -0.08}px, 0)`;

      }


      animationFrame =
        window.requestAnimationFrame(
          updateParallax
        );

    };


    window.addEventListener(
      "pointermove",
      (event) => {

        pointerX =
          (event.clientX / window.innerWidth - 0.5) * 12;

        pointerY =
          (event.clientY / window.innerHeight - 0.5) * 12;

      },
      {
        passive: true
      }
    );


    animationFrame =
      window.requestAnimationFrame(
        updateParallax
      );


    /*
     * Reset when pointer leaves window.
     */

    window.addEventListener(
      "blur",
      () => {

        pointerX = 0;
        pointerY = 0;

      }
    );


    /*
     * Avoid keeping the animation alive
     * while the tab is hidden.
     */

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.hidden &&
          animationFrame
        ) {

          window.cancelAnimationFrame(
            animationFrame
          );

          animationFrame = null;

        } else if (
          !document.hidden &&
          !animationFrame
        ) {

          animationFrame =
            window.requestAnimationFrame(
              updateParallax
            );

        }

      }
    );

  }


  /* ==========================================================
     BACKGROUND CANVAS PARTICLES
  ========================================================== */

  const canvas =
    $("#backgroundCanvas");

  if (
    canvas &&
    !prefersReducedMotion
  ) {

    const context =
      canvas.getContext("2d", {
        alpha: true
      });


    if (context) {

      let width = 0;
      let height = 0;

      let particles = [];

      let animationId = null;

      let running = true;


      /*
       * Fewer particles on mobile.
       */

      const particleCount =
        isMobile ? 22 : 42;


      const resizeCanvas = () => {

        const devicePixelRatio =
          Math.min(
            window.devicePixelRatio || 1,
            1.5
          );


        width =
          window.innerWidth;

        height =
          window.innerHeight;


        canvas.width =
          Math.floor(
            width * devicePixelRatio
          );

        canvas.height =
          Math.floor(
            height * devicePixelRatio
          );


        canvas.style.width =
          `${width}px`;

        canvas.style.height =
          `${height}px`;


        context.setTransform(
          devicePixelRatio,
          0,
          0,
          devicePixelRatio,
          0,
          0
        );

      };


      const createParticle = () => ({

        x:
          Math.random() * width,

        y:
          Math.random() * height,

        radius:
          Math.random() * 1.2 + 0.25,

        speed:
          Math.random() * 0.16 + 0.035,

        drift:
          (Math.random() - 0.5) * 0.08,

        opacity:
          Math.random() * 0.42 + 0.10

      });


      const rebuildParticles = () => {

        particles =
          Array.from(
            {
              length: particleCount
            },
            createParticle
          );

      };


      const drawParticles = () => {

        if (!running) {
          animationId = null;
          return;
        }


        context.clearRect(
          0,
          0,
          width,
          height
        );


        particles.forEach(
          (particle) => {

            particle.y -=
              particle.speed;

            particle.x +=
              particle.drift;


            /*
             * Wrap particles.
             */

            if (
              particle.y <
              -10
            ) {

              particle.y =
                height + 10;

              particle.x =
                Math.random() * width;

            }


            if (
              particle.x <
              -10
            ) {

              particle.x =
                width + 10;

            }


            if (
              particle.x >
              width + 10
            ) {

              particle.x =
                -10;

            }


            context.beginPath();


            context.arc(
              particle.x,
              particle.y,
              particle.radius,
              0,
              Math.PI * 2
            );


            context.fillStyle =
              `rgba(120, 220, 255, ${particle.opacity})`;


            context.fill();

          }
        );


        animationId =
          window.requestAnimationFrame(
            drawParticles
          );

      };


      resizeCanvas();
      rebuildParticles();


      let resizeTimer = null;


      window.addEventListener(
        "resize",
        () => {

          window.clearTimeout(
            resizeTimer
          );


          resizeTimer =
            window.setTimeout(
              () => {

                resizeCanvas();
                rebuildParticles();

              },
              150
            );

        }
      );


      document.addEventListener(
        "visibilitychange",
        () => {

          running =
            !document.hidden;


          if (
            running &&
            !animationId
          ) {

            animationId =
              window.requestAnimationFrame(
                drawParticles
              );

          }

        }
      );


      animationId =
        window.requestAnimationFrame(
          drawParticles
        );

    }

  }


  /* ==========================================================
     FORM ELEMENTS
  ========================================================== */

  const contactForm =
    $("#contactForm");

  const formMessage =
    $("#formMessage");

  const sendButton =
    $("#sendEnquiryBtn");


  /*
   * The HTML uses:
   * name
   * email
   * phone
   * service
   * message
   */

  if (contactForm) {


    const nameInput =
      contactForm.elements.namedItem(
        "name"
      );

    const emailInput =
      contactForm.elements.namedItem(
        "email"
      );

    const phoneInput =
      contactForm.elements.namedItem(
        "phone"
      );

    const serviceInput =
      contactForm.elements.namedItem(
        "service"
      );

    const messageInput =
      contactForm.elements.namedItem(
        "message"
      );


    /* ========================================================
       FORM MESSAGE
    ====================================================== */

    const showFormMessage = (
      message,
      type = "info"
    ) => {

      if (!formMessage) {
        return;
      }


      formMessage.textContent =
        message;


      formMessage.dataset.type =
        type;


      formMessage.style.opacity =
        "1";

    };


    /* ========================================================
       CLEAR FORM MESSAGE
    ====================================================== */

    const clearFormMessage = () => {

      if (!formMessage) {
        return;
      }


      formMessage.textContent =
        "";

      formMessage.dataset.type =
        "";

      formMessage.style.opacity =
        "0";

    };


    /* ========================================================
       INPUT RESET
    ====================================================== */

    const clearInvalidState = (
      element
    ) => {

      if (!element) {
        return;
      }

      element.removeAttribute(
        "aria-invalid"
      );

    };


    [
      nameInput,
      emailInput,
      phoneInput,
      serviceInput,
      messageInput
    ].forEach((element) => {

      if (!element) {
        return;
      }


      element.addEventListener(
        "input",
        () => {

          clearInvalidState(
            element
          );

          if (
            formMessage &&
            formMessage.textContent
          ) {

            clearFormMessage();

          }

        }
      );


      element.addEventListener(
        "change",
        () => {

          clearInvalidState(
            element
          );

          clearFormMessage();

        }
      );

    });


    /* ========================================================
       EMAIL VALIDATION
    ====================================================== */

    const isValidEmail = (
      email
    ) => {

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

    };


    /* ========================================================
       FORM VALIDATION
    ====================================================== */

    const validateForm = () => {

      const name =
        String(
          nameInput?.value || ""
        ).trim();


      const email =
        String(
          emailInput?.value || ""
        ).trim();


      const service =
        String(
          serviceInput?.value || ""
        ).trim();


      const message =
        String(
          messageInput?.value || ""
        ).trim();


      if (!name) {

        nameInput?.focus();

        nameInput?.setAttribute(
          "aria-invalid",
          "true"
        );

        showFormMessage(
          "Please enter your name.",
          "error"
        );

        return false;

      }


      if (!email) {

        emailInput?.focus();

        emailInput?.setAttribute(
          "aria-invalid",
          "true"
        );

        showFormMessage(
          "Please enter your email.",
          "error"
        );

        return false;

      }


      if (!isValidEmail(email)) {

        emailInput?.focus();

        emailInput?.setAttribute(
          "aria-invalid",
          "true"
        );

        showFormMessage(
          "Please enter a valid email address.",
          "error"
        );

        return false;

      }


      if (!service) {

        serviceInput?.focus();

        serviceInput?.setAttribute(
          "aria-invalid",
          "true"
        );

        showFormMessage(
          "Please select a service.",
          "error"
        );

        return false;

      }


      if (!message) {

        messageInput?.focus();

        messageInput?.setAttribute(
          "aria-invalid",
          "true"
        );

        showFormMessage(
          "Please tell us a little about your project.",
          "error"
        );

        return false;

      }


      return true;

    };


    /* ========================================================
       WHATSAPP MESSAGE
    ====================================================== */

    const buildWhatsAppMessage = () => {

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


      const submittedAt =
        new Date().toLocaleString(
          "en-IN",
          {
            dateStyle: "medium",
            timeStyle: "short"
          }
        );


      return [
        "🚀 *NEW WETECH ENQUIRY*",
        "",
        "━━━━━━━━━━━━━━━━━━",
        "",
        `👤 *Name:* ${name}`,
        `📧 *Email:* ${email}`,
        `📱 *Phone / WhatsApp:* ${phone || "Not provided"}`,
        `💼 *Service:* ${service}`,
        "",
        "📝 *Project Details:*",
        message,
        "",
        "━━━━━━━━━━━━━━━━━━",
        "",
        `🕐 *Received:* ${submittedAt}`,
        "",
        "Sent from Wetech website."
      ].join("\n");

    };


    /* ========================================================
       FORM SUBMIT
    ====================================================== */

    contactForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        clearFormMessage();


        if (!validateForm()) {
          return;
        }


        const whatsappMessage =
          buildWhatsAppMessage();


        const whatsappUrl =
          `https://wa.me/${WETECH_WHATSAPP}?text=${encodeURIComponent(
            whatsappMessage
          )}`;


        /*
         * Prevent double clicks.
         */

        if (sendButton) {

          sendButton.disabled =
            true;

          sendButton.setAttribute(
            "aria-busy",
            "true"
          );

          sendButton.dataset.originalText =
            sendButton.innerHTML;

          sendButton.innerHTML =
            `Opening WhatsApp <span aria-hidden="true">↗</span>`;

        }


        showFormMessage(
          "Opening WhatsApp with your enquiry…",
          "success"
        );


        /*
         * Small delay gives the user
         * visual feedback before navigation.
         */

        window.setTimeout(
          () => {

            window.open(
              whatsappUrl,
              "_blank",
              "noopener,noreferrer"
            );


            if (sendButton) {

              sendButton.disabled =
                false;

              sendButton.removeAttribute(
                "aria-busy"
              );

              sendButton.innerHTML =
                sendButton.dataset.originalText ||
                `Send Enquiry <span aria-hidden="true">→</span>`;

            }

          },
          180
        );

      }
    );

  }


  /* ==========================================================
     WHATSAPP BUTTON TRACKING / SAFETY
  ========================================================== */

  const whatsappButtons =
    $$('.whatsapp-button[href*="wa.me"]');


  whatsappButtons.forEach(
    (button) => {

      button.setAttribute(
        "target",
        "_blank"
      );

      button.setAttribute(
        "rel",
        "noopener noreferrer"
      );

    }
  );


  /* ==========================================================
     BUTTON PRESS MICRO-INTERACTION
  ========================================================== */

  const interactiveButtons =
    $$(
      ".button, .nav-button, .whatsapp-button"
    );


  interactiveButtons.forEach(
    (button) => {

      button.addEventListener(
        "pointerdown",
        () => {

          button.classList.add(
            "is-pressed"
          );

        }
      );


      const removePressed =
        () => {

          button.classList.remove(
            "is-pressed"
          );

        };


      button.addEventListener(
        "pointerup",
        removePressed
      );

      button.addEventListener(
        "pointercancel",
        removePressed
      );

      button.addEventListener(
        "pointerleave",
        removePressed
      );

    }
  );


  /* ==========================================================
     LAZY PAINT OPTIMIZATION
  ========================================================== */

  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {

    const lazySections =
      $(
        ".statement-section, #work, #process, #pricing, #contact"
      );


    lazySections.forEach(
      (section) => {

        section.style.contentVisibility =
          "auto";

        section.style.containIntrinsicSize =
          "1px 700px";

      }
    );

  }


  /* ==========================================================
     PAGE READY
  ========================================================== */

  document.documentElement.classList.add(
    "wetech-ready"
  );


})();
```
