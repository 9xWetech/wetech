document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =====================================
           COSMIC BACKGROUND
        ===================================== */

        const canvas =
            document.getElementById(
                "cosmicCanvas"
            );

        const ctx =
            canvas.getContext("2d");


        let width = 0;
        let height = 0;

        let stars = [];


        const mouse = {
            x:-1000,
            y:-1000
        };


        function resize(){

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    1.4
                );


            width =
                window.innerWidth;

            height =
                window.innerHeight;


            canvas.width =
                width * dpr;

            canvas.height =
                height * dpr;


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


            createStars();

        }


        function createStars(){

            const count =
                width < 700
                    ? 28
                    : 58;


            stars =
                Array.from(
                    {length:count},
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
                            ) * .12,

                        vy:
                            (
                                Math.random()
                                -.5
                            ) * .12,

                        r:
                            Math.random()
                            * 1.3
                            + .25,

                        a:
                            Math.random()
                            * .45
                            + .12

                    })
                );

        }


        resize();


        window.addEventListener(
            "resize",
            resize,
            {
                passive:true
            }
        );


        window.addEventListener(
            "pointermove",
            e => {

                mouse.x =
                    e.clientX;

                mouse.y =
                    e.clientY;

            },
            {
                passive:true
            }
        );


        function draw(){

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            for(
                const star of stars
            ){

                star.x += star.vx;
                star.y += star.vy;


                if(star.x < -10)
                    star.x = width + 10;

                if(star.x > width + 10)
                    star.x = -10;


                if(star.y < -10)
                    star.y = height + 10;

                if(star.y > height + 10)
                    star.y = -10;


                const dx =
                    mouse.x -
                    star.x;

                const dy =
                    mouse.y -
                    star.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if(
                    distance < 140
                ){

                    star.x -=
                        dx * .0012;

                    star.y -=
                        dy * .0012;

                }


                ctx.beginPath();

                ctx.arc(
                    star.x,
                    star.y,
                    star.r,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    `rgba(
                        120,
                        225,
                        255,
                        ${star.a}
                    )`;


                ctx.shadowBlur =
                    7;

                ctx.shadowColor =
                    "rgba(34,211,238,.5)";


                ctx.fill();

            }


            requestAnimationFrame(
                draw
            );

        }


        requestAnimationFrame(
            draw
        );


        /* =====================================
           CHARACTER PARALLAX
        ===================================== */

        const hero =
            document.querySelector(
                ".hero"
            );


        const character =
            document.getElementById(
                "waiCharacter"
            );


        if(
            hero &&
            character &&
            window.innerWidth >= 900
        ){

            hero.addEventListener(
                "pointermove",
                event => {

                    const x =
                        event.clientX /
                        window.innerWidth
                        -.5;


                    const y =
                        event.clientY /
                        window.innerHeight
                        -.5;


                    character.style.transform =
                        `
                        translate(
                            ${x * 9}px,
                            ${y * 7}px
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

                    character.style.transform =
                        "";

                }
            );

        }


        /* =====================================
           W.A.I. SPEECH INTERACTION
        ===================================== */

        const speech =
            document.getElementById(
                "waiSpeech"
            );


        const buttons =
            document.querySelectorAll(
                ".assistant-actions button"
            );


        const defaultMessage =
            "Hey 👋 I'm W.A.I. Your digital assistant.";


        buttons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const message =
                            button.dataset.message;


                        if(!speech)
                            return;


                        speech.animate(
                            [
                                {
                                    opacity:.4,
                                    transform:
                                        "translateY(5px)"
                                },

                                {
                                    opacity:1,
                                    transform:
                                        "translateY(0)"
                                }

                            ],
                            {
                                duration:
                                    300
                            }
                        );


                        speech.textContent =
                            "Got it — " +
                            message +
                            ". Let's build something great.";


                        setTimeout(
                            () => {

                                speech.textContent =
                                    defaultMessage;

                            },
                            3800
                        );

                    }
                );

            }
        );


        /* =====================================
           CONTACT FORM
        ===================================== */

        const form =
            document.getElementById(
                "contactForm"
            );


        const message =
            document.getElementById(
                "formMessage"
            );


        if(form){

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    if(message){

                        message.textContent =
                            "✓ Thanks! Your enquiry has been received.";

                    }


                    form.reset();

                }
            );

        }


        /* =====================================
           SCROLL REVEAL
        ===================================== */

        const cards =
            document.querySelectorAll(
                ".service-card," +
                ".work-card," +
                ".process-card," +
                ".pricing-card," +
                ".contact-panel"
            );


        cards.forEach(
            card => {

                card.style.opacity =
                    "0";

                card.style.transform =
                    "translateY(22px)";

                card.style.transition =
                    "opacity .65s ease," +
                    "transform .65s ease";

            }
        );


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


        cards.forEach(
            card =>
                observer.observe(
                    card
                )
        );


        /* =====================================
           LIGHTWEIGHT SHOOTING STARS
        ===================================== */

        function shootingStar(){

            if(
                window.innerWidth < 700
            ){

                return;

            }


            const star =
                document.createElement(
                    "div"
                );


            star.style.position =
                "fixed";

            star.style.width =
                "110px";

            star.style.height =
                "1px";

            star.style.left =
                (
                    60 +
                    Math.random() * 30
                ) + "%";

            star.style.top =
                (
                    8 +
                    Math.random() * 30
                ) + "%";

            star.style.zIndex =
                "-3";

            star.style.pointerEvents =
                "none";

            star.style.background =
                `
                linear-gradient(
                    90deg,
                    transparent,
                    rgba(150,240,255,.9),
                    transparent
                )
                `;

            star.style.transform =
                "rotate(-28deg)";


            document.body.appendChild(
                star
            );


            const animation =
                star.animate(
                    [
                        {
                            opacity:0,

                            transform:
                                "translate(0,0) rotate(-28deg)"

                        },

                        {
                            opacity:.85
                        },

                        {
                            opacity:0,

                            transform:
                                "translate(-260px,160px) rotate(-28deg)"

                        }

                    ],
                    {
                        duration:
                            1700,

                        easing:
                            "ease-out"
                    }
                );


            animation.onfinish =
                () => {

                    star.remove();

                };

        }


        setInterval(
            shootingStar,
            9000
        );

    }
);
