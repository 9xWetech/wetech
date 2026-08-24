document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* =========================
       BACKGROUND PARTICLES
    ========================= */

    const canvas =
      document.getElementById(
        "backgroundCanvas"
      );

    if (canvas) {

      const ctx =
        canvas.getContext("2d");

      let width = 0;
      let height = 0;

      let particles = [];


      function resizeCanvas() {

        const dpr =
          Math.min(
            window.devicePixelRatio || 1,
            1.25
          );


        width =
          window.innerWidth;

        height =
          window.innerHeight;


        canvas.width =
          Math.floor(
            width * dpr
          );


        canvas.height =
          Math.floor(
            height * dpr
          );


        canvas.style.width =
          width + "px";

        canvas.style.height =
          height + "px";


        ctx.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );


        const count =
          width < 700
            ? 20
            : 42;


        particles =
          Array.from(
            { length: count },
            () => ({

              x:
                Math.random() *
                width,

              y:
                Math.random() *
                height,

              vx:
                (
                  Math.random()
                  - 0.5
                ) * 0.10,

              vy:
                (
                  Math.random()
                  - 0.5
                ) * 0.10,

              radius:
                Math.random()
                * 1.1
                + 0.25,

              opacity:
                Math.random()
                * 0.20
                + 0.05

            })
          );

      }


      resizeCanvas();


      window.addEventListener(
        "resize",
        resizeCanvas,
        {
          passive: true
        }
      );


      let lastFrame =
        0;


      function animate(
        timestamp
      ) {

        if (
          timestamp -
          lastFrame
          <
          1000 / 40
        ) {

          requestAnimationFrame(
            animate
          );

          return;
        }


        lastFrame =
          timestamp;


        ctx.clearRect(
          0,
          0,
          width,
          height
        );


        particles.forEach(
          particle => {

            particle.x +=
              particle.vx;

            particle.y +=
              particle.vy;


            if (
              particle.x < -10
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


            if (
              particle.y < -10
            ) {

              particle.y =
                height + 10;

            }


            if (
              particle.y >
              height + 10
            ) {

              particle.y =
                -10;

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
                218,
                229,
                234,
                ${particle.opacity}
              )`;


            ctx.fill();

          }
        );


        requestAnimationFrame(
          animate
        );

      }


      requestAnimationFrame(
        animate
      );

    }


    /* =========================
       HERO PARALLAX
    ========================= */

    const hero =
      document.querySelector(
        ".hero"
      );


    const visual =
      document.querySelector(
        ".hero-visual"
      );


    if (
      hero &&
      visual &&
      window.innerWidth >= 900
    ) {

      hero.addEventListener(
        "pointermove",
        event => {

          const x =
            event.clientX /
            window.innerWidth
            - 0.5;


          const y =
            event.clientY /
            window.innerHeight
            - 0.5;


          visual.style.transform =
            `
            translate3d(
              ${x * 9}px,
              ${y * 7}px,
              0
            )
            `;

        },
        {
          passive: true
        }
      );


      hero.addEventListener(
        "pointerleave",
        () => {

          visual.style.transform =
            "";

        }
      );

    }


    /* =========================
       CARD HOVER
    ========================= */

    if (
      window.innerWidth >= 900
    ) {

      const interactiveCards =
        document.querySelectorAll(
          ".featured-service, " +
          ".service-row, " +
          ".work-card, " +
          ".pricing-card"
        );


      interactiveCards.forEach(
        card => {

          card.addEventListener(
            "pointermove",
            event => {

              const rect =
                card.getBoundingClientRect();


              const x =
                (
                  event.clientX -
                  rect.left
                )
                /
                rect.width
                - 0.5;


              const y =
                (
                  event.clientY -
                  rect.top
                )
                /
                rect.height
                - 0.5;


              card.style.transform =
                `
                perspective(900px)
                rotateX(${y * -1.5}deg)
                rotateY(${x * 1.5}deg)
                translateY(-4px)
                `;

            },
            {
              passive: true
            }
          );


          card.addEventListener(
            "pointerleave",
            () => {

              card.style.transform =
                "";

            }
          );

        }
      );

    }


    /* =========================
       SCROLL REVEAL
    ========================= */

    const sections =
      document.querySelectorAll(
        ".section-heading, " +
        ".featured-service, " +
        ".service-row, " +
        ".work-card, " +
        ".process-item, " +
        ".pricing-card, " +
        ".contact-box, " +
        ".statement-content"
      );


    sections.forEach(
      element => {

        element.style.opacity =
          "0";

        element.style.transform =
          "translateY(22px)";

        element.style.transition =
          "opacity .7s ease, " +
          "transform .7s ease";

      }
    );


    if (
      "IntersectionObserver"
      in window
    ) {

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

                if (
                  entry.isIntersecting
                ) {

                  entry.target.style.opacity =
                    "1";

                  entry.target.style.transform =
                    "translateY(0)";


                  observer.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold:
              0.08
          }
        );


      sections.forEach(
        section =>
          observer.observe(
            section
          )
      );

    }
    else {

      sections.forEach(
        section => {

          section.style.opacity =
            "1";

          section.style.transform =
            "none";

        }
      );

    }


    /* =========================
       TEMPORARY CONTACT FORM
       NO BACKEND YET
    ========================= */

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
        event => {

          event.preventDefault();


          if (formMessage) {

            formMessage.textContent =
              "Enquiry system is being connected. Please contact us on WhatsApp for now.";

          }

        }
      );

    }


    /* =========================
       BUTTON MAGNETIC EFFECT
    ========================= */

    if (
      window.innerWidth >= 900
    ) {

      const buttons =
        document.querySelectorAll(
          ".button, .nav-button"
        );


      buttons.forEach(
        button => {

          button.addEventListener(
            "pointermove",
            event => {

              const rect =
                button.getBoundingClientRect();


              const x =
                (
                  event.clientX -
                  rect.left -
                  rect.width / 2
                )
                * 0.04;


              const y =
                (
                  event.clientY -
                  rect.top -
                  rect.height / 2
                )
                * 0.04;


              button.style.transform =
                `
                translate(
                  ${x}px,
                  ${y}px
                )
                `;

            },
            {
              passive: true
            }
          );


          button.addEventListener(
            "pointerleave",
            () => {

              button.style.transform =
                "";

            }
          );

        }
      );

    }


    /* =========================
       SMOOTH ANCHOR LINKS
    ========================= */

    const anchorLinks =
      document.querySelectorAll(
        'a[href^="#"]'
      );


    anchorLinks.forEach(
      link => {

        link.addEventListener(
          "click",
          event => {

            const targetId =
              link.getAttribute(
                "href"
              );


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

      }
    );

  }
);
/* =========================================================
   W.A.I. ASSISTANT ENGINE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const robot =
      document.getElementById(
        "waiCharacter"
      );

    const speech =
      document.getElementById(
        "waiSpeech"
      );

    const buttons =
      document.querySelectorAll(
        ".wai-controls button"
      );


    if(!robot){
      return;
    }


    /* ---------------------------------------
       IDLE MOVEMENT
    --------------------------------------- */

    let start =
      performance.now();


    function robotIdle(
      time
    ){

      const seconds =
        (
          time -
          start
        ) / 1000;


      const bob =
        Math.sin(
          seconds * 1.25
        ) * 3;


      const tilt =
        Math.sin(
          seconds * .72
        ) * .45;


      robot.style.transform =
        `
        translate(
          -50%,
          calc(
            -50% + ${bob}px
          )
        )
        rotate(
          ${tilt}deg
        )
        `;


      requestAnimationFrame(
        robotIdle
      );

    }


    requestAnimationFrame(
      robotIdle
    );


    /* ---------------------------------------
       BLINK
    --------------------------------------- */

    const eyes =
      document.querySelectorAll(
        ".wai-eye"
      );


    function blink(){

      eyes.forEach(
        eye => {

          eye.style.transform =
            "scaleY(.12)";

        }
      );


      setTimeout(
        () => {

          eyes.forEach(
            eye => {

              eye.style.transform =
                "scaleY(1)";

            }
          );

        },
        110
      );

    }


    setInterval(
      blink,
      4300
    );


    /* ---------------------------------------
       TALK REACTION
    --------------------------------------- */

    function robotReact(){

      robot.animate(
        [

          {
            filter:
              "brightness(1)"
          },

          {
            filter:
              "brightness(1.18)"
          },

          {
            filter:
              "brightness(1)"
          }

        ],
        {
          duration:
            650,

          easing:
            "ease-in-out"
        }
      );


      eyes.forEach(
        eye => {

          eye.animate(
            [

              {
                transform:
                  "scaleY(1)"
              },

              {
                transform:
                  "scaleY(.45)"
              },

              {
                transform:
                  "scaleY(1.15)"
              },

              {
                transform:
                  "scaleY(1)"
              }

            ],
            {
              duration:
                620,

              easing:
                "ease-in-out"
            }
          );

        }
      );

    }


    /* ---------------------------------------
       BUTTONS
    --------------------------------------- */

    buttons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const message =
              button.dataset.waiMessage;


            if(
              message &&
              speech
            ){

              speech.innerHTML =
                message;

            }


            robotReact();


            /* Talk button */

            if(
              button.classList.contains(
                "wai-talk-button"
              )
            ){

              const contact =
                document.getElementById(
                  "contact"
                );


              if(contact){

                setTimeout(
                  () => {

                    contact.scrollIntoView({
                      behavior:
                        "smooth",

                      block:
                        "start"
                    });

                  },
                  350
                );

              }

            }

          }
        );

      }
    );


    /* ---------------------------------------
       SPEECH INTRO
    --------------------------------------- */

    if(speech){

      setTimeout(
        () => {

          speech.innerHTML =
            `
            Hey 👋 I'm W.A.I.<br>
            Your digital assistant.
            `;

        },
        900
      );

    }

  }
);
