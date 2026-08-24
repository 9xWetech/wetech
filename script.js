document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* =====================================
       BACKGROUND PARTICLES
    ===================================== */

    const canvas =
      document.getElementById(
        "backgroundCanvas"
      );


    if(canvas){

      const ctx =
        canvas.getContext("2d");


      let width = 0;
      let height = 0;

      let particles = [];


      function resizeCanvas(){

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
            ? 18
            : 42;


        particles =
          Array.from(
            {
              length:count
            },
            () => ({

              x:
                Math.random()
                * width,

              y:
                Math.random()
                * height,

              vx:
                (
                  Math.random()
                  -.5
                ) * .075,

              vy:
                (
                  Math.random()
                  -.5
                ) * .075,

              radius:
                Math.random()
                * 1
                + .25,

              opacity:
                Math.random()
                * .18
                + .04

            })
          );

      }


      resizeCanvas();


      window.addEventListener(
        "resize",
        resizeCanvas,
        {
          passive:true
        }
      );


      let lastFrame = 0;


      function animate(timestamp){

        if(
          timestamp -
          lastFrame
          <
          1000 / 40
        ){

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


            if(
              particle.x < -10
            ){
              particle.x =
                width + 10;
            }


            if(
              particle.x >
              width + 10
            ){
              particle.x =
                -10;
            }


            if(
              particle.y < -10
            ){
              particle.y =
                height + 10;
            }


            if(
              particle.y >
              height + 10
            ){
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
                155,
                214,
                255,
                ${particle.opacity}
              )`;


            ctx.shadowBlur = 6;


            ctx.shadowColor =
              "rgba(40,230,255,.32)";


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


    /* =====================================
       HERO PARALLAX
    ===================================== */

    const hero =
      document.querySelector(
        ".hero"
      );


    const visual =
      document.querySelector(
        ".hero-visual"
      );


    if(
      hero &&
      visual &&
      window.innerWidth >= 950
    ){

      hero.addEventListener(
        "pointermove",
        event => {

          const x =
            event.clientX /
            window.innerWidth
            - .5;


          const y =
            event.clientY /
            window.innerHeight
            - .5;


          visual.style.transform =
            `
            translate3d(
              ${x * 7}px,
              ${y * 6}px,
              0
            )
            `;

        },
        {
          passive:true
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


    /* =====================================
       CARD HOVER
    ===================================== */

    if(
      window.innerWidth >= 950
    ){

      const cards =
        document.querySelectorAll(
          [
            ".featured-service",
            ".service-row",
            ".work-card",
            ".pricing-card"
          ].join(",")
        );


      cards.forEach(
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
                -.5;


              const y =
                (
                  event.clientY -
                  rect.top
                )
                /
                rect.height
                -.5;


              card.style.transform =
                `
                perspective(900px)
                rotateX(${y * -1.2}deg)
                rotateY(${x * 1.2}deg)
                translateY(-4px)
                `;

            },
            {
              passive:true
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


    /* =====================================
       SCROLL REVEAL
    ===================================== */

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


    reveal.forEach(
      element => {

        element.style.opacity =
          "0";


        element.style.transform =
          "translateY(20px)";


        element.style.transition =
          "opacity .7s ease, " +
          "transform .7s cubic-bezier(.16,1,.3,1)";

      }
    );


    if(
      "IntersectionObserver"
      in window
    ){

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

                if(
                  entry.isIntersecting
                ){

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
            threshold:.08
          }
        );


      reveal.forEach(
        element =>
          observer.observe(
            element
          )
      );

    }
    else{

      reveal.forEach(
        element => {

          element.style.opacity =
            "1";

          element.style.transform =
            "none";

        }
      );

    }

/* =====================================
   LIVE CONTACT FORM
===================================== */

const form =
  document.getElementById("contactForm");

const formMessage =
  document.getElementById("formMessage");

if (form) {

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );

      const originalText =
        submitButton
          ? submitButton.innerHTML
          : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = "Sending...";
      }

      if (formMessage) {
        formMessage.textContent =
          "Sending your enquiry...";
      }

      const formData =
        new FormData(form);

      const payload =
        Object.fromEntries(
          formData.entries()
        );

      try {

        const response =
          await fetch(
            "/api/contact",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  payload
                )
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Unable to send enquiry."
          );
        }

        form.reset();

        if (formMessage) {
          formMessage.textContent =
            "✓ Enquiry sent successfully. A confirmation email has been sent.";
        }

      } catch (error) {

        console.error(
          "Contact form error:",
          error
        );

        if (formMessage) {
          formMessage.textContent =
            "Unable to send right now. Please contact us on WhatsApp.";
        }

      } finally {

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML =
            originalText;
        }

      }

    }
  );

}
    /* =====================================
       MAGNETIC BUTTONS
    ===================================== */

    if(
      window.innerWidth >= 950
    ){

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
                * .025;


              const y =
                (
                  event.clientY -
                  rect.top -
                  rect.height / 2
                )
                * .025;


              button.style.transform =
                `
                translate(
                  ${x}px,
                  ${y}px
                )
                `;

            },
            {
              passive:true
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


    /* =====================================
       SMOOTH ANCHORS
    ===================================== */

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach(
        link => {

          link.addEventListener(
            "click",
            event => {

              const id =
                link.getAttribute(
                  "href"
                );


              if(
                !id ||
                id === "#"
              ){

                return;
              }


              const target =
                document.querySelector(
                  id
                );


              if(!target){
                return;
              }


              event.preventDefault();


              target.scrollIntoView({
                behavior:"smooth",
                block:"start"
              });

            }
          );

        }
      );

  }
);
