
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       SCROLL REVEAL
    ========================= */

    const elements = document.querySelectorAll(
        ".card, .section, .cta, .page > h1, .page > p"
    );

    elements.forEach((element) => {
        element.classList.add("reveal");
    });


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if(entry.isIntersecting){

                    entry.target.classList.add("active");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold:0.12
        }
    );


    elements.forEach((element) => {

        observer.observe(element);

    });


    /* =========================
       CONTACT FORM
    ========================= */

    const form =
        document.getElementById("contactForm");


    if(form){

        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const message =
                    document.getElementById("formMsg");

                if(message){

                    message.textContent =
                        "✓ Thanks! Your enquiry has been received.";

                }

                form.reset();

            }
        );

    }


    /* =========================
       MOUSE PARALLAX
    ========================= */

    const hero =
        document.querySelector(".hero");

    if(hero){

        hero.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    (event.clientX /
                    window.innerWidth - 0.5) * 10;

                const y =
                    (event.clientY /
                    window.innerHeight - 0.5) * 10;


                const title =
                    hero.querySelector("h1");


                if(title){

                    title.style.transform =
                        `translate(${x * .35}px,${y * .35}px)`;

                }

            }
        );


        hero.addEventListener(
            "mouseleave",
            () => {

                const title =
                    hero.querySelector("h1");

                if(title){

                    title.style.transform =
                        "translate(0,0)";

                }

            }
        );

    }


    /* =========================
       CARD TILT
    ========================= */

    const cards =
        document.querySelectorAll(".card");


    cards.forEach((card) => {

        card.addEventListener(
            "mousemove",
            (event) => {

                if(window.innerWidth < 800)
                    return;


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;


                const rotateY =
                    ((x / rect.width) - .5) * 6;

                const rotateX =
                    ((y / rect.height) - .5) * -6;


                card.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-8px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });

});
