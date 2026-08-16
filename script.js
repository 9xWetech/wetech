document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       LIGHT PARTICLES
    ========================================= */

    const canvas =
        document.getElementById(
            "lightCanvas"
        );

    const ctx =
        canvas.getContext("2d");


    let width = 0;
    let height = 0;

    let particles = [];


    function resize(){

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                1.35
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


        const amount =
            width < 700
                ? 22
                : 42;


        particles =
            Array.from(
                {length:amount},
                () => ({

                    x:
                        Math.random() * width,

                    y:
                        Math.random() * height,

                    vx:
                        (
                            Math.random()
                            - .5
                        ) * .10,

                    vy:
                        (
                            Math.random()
                            - .5
                        ) * .10,

                    r:
                        Math.random() * 1.1 + .25,

                    a:
                        Math.random() * .32 + .08

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


    /* =========================================
       PARTICLE LOOP
    ========================================= */

    let lastFrame = 0;


    function draw(time){

        if(
            time - lastFrame <
            1000 / 40
        ){

            requestAnimationFrame(
                draw
            );

            return;

        }


        lastFrame = time;


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
                    particle.r,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    `rgba(
                        255,
                        233,
                        184,
                        ${particle.a}
                    )`;


                ctx.shadowBlur =
                    8;


                ctx.shadowColor =
                    "rgba(242,213,154,.45)";


                ctx.fill();

            }
        );


        requestAnimationFrame(
            draw
        );

    }


    requestAnimationFrame(
        draw
    );


    /* =========================================
       HERO PARALLAX
    ========================================= */

    const hero =
        document.querySelector(
            ".hero"
        );


    const monolith =
        document.querySelector(
            ".monolith-scene"
        );


    if(
        hero &&
        monolith &&
        window.innerWidth >= 900
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


                monolith.style.transform =
                    `
                    translate3d(
                        ${x * 10}px,
                        ${y * 8}px,
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

                monolith.style.transform =
                    "";

            }
        );

    }


    /* =========================================
       SCROLL REVEAL
    ========================================= */

    const revealTargets =
        document.querySelectorAll(
            ".service-card," +
            ".work-card," +
            ".process-card," +
            ".pricing-card," +
            ".contact-panel," +
            ".statement-inner"
        );


    revealTargets.forEach(
        item => {

            item.style.opacity =
                "0";

            item.style.transform =
                "translateY(24px)";

            item.style.transition =
                "opacity .7s ease," +
                "transform .7s ease";

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


    revealTargets.forEach(
        target =>
            observer.observe(target)
    );


    /* =========================================
       CARD TILT
    ========================================= */

    if(
        window.innerWidth >= 900
    ){

        document
            .querySelectorAll(
                ".service-card," +
                ".work-card," +
                ".pricing-card"
            )
            .forEach(
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
                                - .5;


                            const y =
                                (
                                    event.clientY -
                                    rect.top
                                )
                                /
                                rect.height
                                - .5;


                            card.style.transform =
                                `
                                perspective(900px)
                                rotateX(${y * -2.5}deg)
                                rotateY(${x * 2.5}deg)
                                translateY(-5px)
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


    /* =========================================
       CONTACT FORM
    ========================================= */

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


    /* =========================================
       LIGHT STREAKS
    ========================================= */

    function createLightStreak(){

        if(
            window.innerWidth < 700
        ){

            return;

        }


        const streak =
            document.createElement(
                "div"
            );


        streak.style.position =
            "fixed";

        streak.style.width =
            "120px";

        streak.style.height =
            "1px";

        streak.style.left =
            (
                65 +
                Math.random()*25
            ) + "%";

        streak.style.top =
            (
                8 +
                Math.random()*25
            ) + "%";

        streak.style.zIndex =
            "-2";

        streak.style.pointerEvents =
            "none";

        streak.style.background =
            `
            linear-gradient(
                90deg,
                transparent,
                rgba(255,239,197,.92),
                transparent
            )
            `;

        streak.style.boxShadow =
            `
            0 0 10px
            rgba(242,213,154,.45)
            `;

        streak.style.transform =
            "rotate(-28deg)";


        document.body.appendChild(
            streak
        );


        const animation =
            streak.animate(
                [
                    {
                        opacity:0,
                        transform:
                            "translate(0,0) rotate(-28deg)"
                    },

                    {
                        opacity:.7
                    },

                    {
                        opacity:0,
                        transform:
                            "translate(-260px,165px) rotate(-28deg)"
                    }

                ],
                {
                    duration:1700,
                    easing:"ease-out"
                }
            );


        animation.onfinish =
            () =>
                streak.remove();

    }


    setInterval(
        createLightStreak,
        8500
    );


    /* =========================================
       MAGNETIC BUTTON FEEL
    ========================================= */

    document
        .querySelectorAll(
            ".btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "pointermove",
                    event => {

                        if(
                            window.innerWidth < 900
                        ){

                            return;

                        }


                        const rect =
                            button.getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left -
                                rect.width/2
                            ) * .08;


                        const y =
                            (
                                event.clientY -
                                rect.top -
                                rect.height/2
                            ) * .08;


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

});
