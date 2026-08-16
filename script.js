document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =====================================
           GOLD PARTICLES
        ===================================== */

        const canvas =
            document.createElement("canvas");

        canvas.id =
            "goldCanvas";

        document.body.prepend(canvas);


        const ctx =
            canvas.getContext("2d");


        let width = 0;
        let height = 0;

        let particles = [];


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


            canvas.style.position =
                "fixed";

            canvas.style.inset =
                "0";

            canvas.style.width =
                "100%";

            canvas.style.height =
                "100%";

            canvas.style.pointerEvents =
                "none";

            canvas.style.zIndex =
                "-3";


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
                    ? 22
                    : 42;


            particles =
                Array.from(
                    {length:count},
                    () => ({

                        x:
                            Math.random()*width,

                        y:
                            Math.random()*height,

                        vx:
                            (
                                Math.random()
                                -.5
                            )*.10,

                        vy:
                            (
                                Math.random()
                                -.5
                            )*.10,

                        r:
                            Math.random()*1.1
                            +.3,

                        alpha:
                            Math.random()*.30
                            +.08

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


        let last =
            0;


        function animate(time){

            if(
                time-last <
                1000/40
            ){

                requestAnimationFrame(
                    animate
                );

                return;

            }


            last =
                time;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            particles.forEach(
                p => {

                    p.x += p.vx;

                    p.y += p.vy;


                    if(p.x < -10)
                        p.x = width+10;

                    if(p.x > width+10)
                        p.x = -10;

                    if(p.y < -10)
                        p.y = height+10;

                    if(p.y > height+10)
                        p.y = -10;


                    ctx.beginPath();

                    ctx.arc(
                        p.x,
                        p.y,
                        p.r,
                        0,
                        Math.PI*2
                    );


                    ctx.fillStyle =
                        `rgba(
                            214,
                            179,
                            106,
                            ${p.alpha}
                        )`;


                    ctx.shadowBlur =
                        8;

                    ctx.shadowColor =
                        "rgba(214,179,106,.35)";


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
            window.innerWidth >= 900
        ){

            hero.addEventListener(
                "pointermove",
                event => {

                    const x =
                        event.clientX/
                        window.innerWidth
                        -.5;


                    const y =
                        event.clientY/
                        window.innerHeight
                        -.5;


                    visual.style.transform =
                        `
                        translate3d(
                            ${x*9}px,
                            ${y*8}px,
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
           SCROLL REVEAL
        ===================================== */

        const revealElements =
            document.querySelectorAll(
                ".service-card," +
                ".work-card," +
                ".process-step," +
                ".pricing-card," +
                ".contact-card"
            );


        revealElements.forEach(
            element => {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translateY(25px)";

                element.style.transition =
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


        revealElements.forEach(
            el =>
                observer.observe(el)
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
           BUTTON LIGHT SWEEP
        ===================================== */

        document
            .querySelectorAll(
                ".button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "pointerenter",
                        () => {

                            button.animate(
                                [
                                    {
                                        backgroundPosition:
                                            "-150% center"
                                    },

                                    {
                                        backgroundPosition:
                                            "150% center"
                                    }

                                ],
                                {
                                    duration:600,
                                    easing:
                                        "ease-out"
                                }
                            );

                        }
                    );

                }
            );


        /* =====================================
           SHOOTING LIGHT
        ===================================== */

        function createLight(){

            if(
                window.innerWidth < 700
            ){

                return;

            }


            const line =
                document.createElement(
                    "div"
                );


            line.style.position =
                "fixed";

            line.style.width =
                "110px";

            line.style.height =
                "1px";

            line.style.left =
                (65+
                Math.random()*25)+"%";

            line.style.top =
                (8+
                Math.random()*25)+"%";

            line.style.zIndex =
                "-2";

            line.style.pointerEvents =
                "none";

            line.style.background =
                `
                linear-gradient(
                    90deg,
                    transparent,
                    rgba(240,220,168,.9),
                    transparent
                )
                `;

            line.style.transform =
                "rotate(-28deg)";


            document.body.appendChild(
                line
            );


            const animation =
                line.animate(
                    [
                        {
                            opacity:0,

                            transform:
                                "translate(0,0) rotate(-28deg)"
                        },

                        {
                            opacity:.65
                        },

                        {
                            opacity:0,

                            transform:
                                "translate(-250px,160px) rotate(-28deg)"
                        }

                    ],
                    {
                        duration:1600,
                        easing:"ease-out"
                    }
                );


            animation.onfinish =
                () =>
                    line.remove();

        }


        setInterval(
            createLight,
            8500
        );

    }
);
