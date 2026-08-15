
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
/* ==========================================================
   WETECH V3 PRODUCTION ANIMATION ENGINE
========================================================== */

(() => {

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reduceMotion) return;


    /* ======================================================
       CANVAS
    ====================================================== */

    const canvas =
        document.createElement("canvas");

    canvas.id =
        "wetech-canvas";

    document.body.prepend(canvas);

    const ctx =
        canvas.getContext("2d", {
            alpha:true
        });


    let W = 0;
    let H = 0;
    let DPR = 1;


    const mouse = {
        x:null,
        y:null
    };


    let particles = [];


    function resize(){

        DPR =
            Math.min(
                window.devicePixelRatio || 1,
                1.6
            );

        W =
            window.innerWidth;

        H =
            window.innerHeight;


        canvas.width =
            Math.floor(W * DPR);

        canvas.height =
            Math.floor(H * DPR);

        canvas.style.width =
            W + "px";

        canvas.style.height =
            H + "px";


        ctx.setTransform(
            DPR,
            0,
            0,
            DPR,
            0,
            0
        );


        createParticles();

    }


    function createParticles(){

        particles = [];


        const count =
            W < 700
            ? 30
            : Math.min(
                62,
                Math.floor(
                    W / 22
                )
            );


        for(
            let i=0;
            i<count;
            i++
        ){

            particles.push({

                x:
                    Math.random()*W,

                y:
                    Math.random()*H,

                vx:
                    (Math.random()-.5)
                    * .16,

                vy:
                    (Math.random()-.5)
                    * .16,

                radius:
                    Math.random()*1.25
                    + .35,

                alpha:
                    Math.random()*.45
                    + .12,

                hue:
                    Math.random()>.72
                    ? 265
                    : 190

            });

        }

    }


    resize();

    window.addEventListener(
        "resize",
        resize,
        {passive:true}
    );


    window.addEventListener(
        "mousemove",
        event => {

            mouse.x =
                event.clientX;

            mouse.y =
                event.clientY;

        },
        {passive:true}
    );


    window.addEventListener(
        "mouseleave",
        () => {

            mouse.x=null;
            mouse.y=null;

        },
        {passive:true}
    );


    /* ======================================================
       DRAW
    ====================================================== */

    let lastTime = 0;


    function draw(time){

        if(
            time-lastTime <
            1000/45
        ){

            requestAnimationFrame(
                draw
            );

            return;
        }


        lastTime = time;


        ctx.clearRect(
            0,
            0,
            W,
            H
        );


        /* particles */

        for(
            const p of particles
        ){

            p.x += p.vx;
            p.y += p.vy;


            if(p.x < -10)
                p.x = W+10;

            if(p.x > W+10)
                p.x = -10;

            if(p.y < -10)
                p.y = H+10;

            if(p.y > H+10)
                p.y = -10;


            /* subtle mouse gravity */

            if(
                mouse.x !== null
            ){

                const dx =
                    mouse.x-p.x;

                const dy =
                    mouse.y-p.y;

                const distance =
                    Math.sqrt(
                        dx*dx +
                        dy*dy
                    );


                if(
                    distance < 170
                ){

                    const power =
                        (1 -
                        distance/170)
                        * .018;

                    p.x -=
                        dx*power;

                    p.y -=
                        dy*power;

                }

            }


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.radius,
                0,
                Math.PI*2
            );


            ctx.fillStyle =
                `hsla(
                    ${p.hue},
                    100%,
                    78%,
                    ${p.alpha}
                )`;


            ctx.shadowBlur = 8;

            ctx.shadowColor =
                p.hue === 190
                ? "rgba(32,231,255,.32)"
                : "rgba(139,92,246,.28)";


            ctx.fill();

        }


        /* network lines */

        for(
            let i=0;
            i<particles.length;
            i++
        ){

            let links = 0;


            for(
                let j=i+1;
                j<particles.length;
                j++
            ){

                if(
                    links >= 3
                ) break;


                const a =
                    particles[i];

                const b =
                    particles[j];


                const dx =
                    a.x-b.x;

                const dy =
                    a.y-b.y;

                const distance =
                    Math.sqrt(
                        dx*dx +
                        dy*dy
                    );


                if(
                    distance < 105
                ){

                    const opacity =
                        (1 -
                        distance/105)
                        * .085;


                    ctx.beginPath();

                    ctx.moveTo(
                        a.x,
                        a.y
                    );

                    ctx.lineTo(
                        b.x,
                        b.y
                    );


                    ctx.strokeStyle =
                        `rgba(
                            75,
                            190,
                            255,
                            ${opacity}
                        )`;

                    ctx.lineWidth=.45;

                    ctx.stroke();

                    links++;

                }

            }

        }


        requestAnimationFrame(
            draw
        );

    }


    requestAnimationFrame(
        draw
    );


    /* ======================================================
       REVEAL
    ====================================================== */

    const revealItems =
        document.querySelectorAll(
            ".card, .section, .cta, .page > h1, .page > p"
        );


    revealItems.forEach(
        element => {

            element.classList.add(
                "wx-reveal"
            );

        }
    );


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if(
                            entry.isIntersecting
                        ){

                            entry.target.classList.add(
                                "wx-visible"
                            );

                            revealObserver.unobserve(
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


    revealItems.forEach(
        element =>
            revealObserver.observe(
                element
            )
    );


    /* ======================================================
       CARD LIGHT + TILT
    ====================================================== */

    if(
        window.innerWidth >= 900
    ){

        document
            .querySelectorAll(
                ".card"
            )
            .forEach(card => {

                card.addEventListener(
                    "pointermove",
                    event => {

                        const rect =
                            card.getBoundingClientRect();


                        const px =
                            (
                                event.clientX -
                                rect.left
                            )
                            /
                            rect.width;


                        const py =
                            (
                                event.clientY -
                                rect.top
                            )
                            /
                            rect.height;


                        const rotateY =
                            (px-.5)*3.5;

                        const rotateX =
                            (py-.5)*-3.5;


                        card.style.setProperty(
                            "--mx",
                            `${px*100}%`
                        );


                        card.style.setProperty(
                            "--my",
                            `${py*100}%`
                        );


                        card.style.transform =
                            `perspective(900px)
                             rotateX(${rotateX}deg)
                             rotateY(${rotateY}deg)
                             translateY(-5px)`;

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

            });

    }


    /* ======================================================
       HERO PARALLAX
    ====================================================== */

    const hero =
        document.querySelector(
            ".hero"
        );


    const heroTitle =
        hero
        ?.querySelector(
            "h1"
        );


    if(
        hero &&
        heroTitle &&
        window.innerWidth >= 900
    ){

        let ticking=false;


        hero.addEventListener(
            "pointermove",
            event => {

                if(ticking)
                    return;


                ticking=true;


                requestAnimationFrame(
                    () => {

                        const nx =
                            event.clientX /
                            W -.5;


                        const ny =
                            event.clientY /
                            H -.5;


                        heroTitle.style.transform =
                            `translate3d(
                                ${nx*7}px,
                                ${ny*5}px,
                                0
                            )`;


                        ticking=false;

                    }
                );

            },
            {
                passive:true
            }
        );


        hero.addEventListener(
            "pointerleave",
            () => {

                heroTitle.style.transform =
                    "";

            }
        );

    }


    /* ======================================================
       SHOOTING STARS
    ====================================================== */

    function createShootingStar(){

        const star =
            document.createElement(
                "div"
            );

        star.className =
            "wx-shooting-star";


        star.style.left =
            (55+
            Math.random()*35)
            + "%";


        star.style.top =
            (8+
            Math.random()*35)
            + "%";


        document.body.appendChild(
            star
        );


        const duration =
            2.5 +
            Math.random()*1.2;


        star.style.animation =
            `wxShoot
             ${duration}s
             ease-out
             forwards`;


        setTimeout(
            () => {

                star.remove();

            },
            duration*1000+100
        );

    }


    function shootingLoop(){

        createShootingStar();


        setTimeout(
            shootingLoop,
            5500+
            Math.random()*7000
        );

    }


    if(
        window.innerWidth >= 700
    ){

        setTimeout(
            shootingLoop,
            2500
        );

    }


    /* ======================================================
       SCAN LINE
    ====================================================== */

    if(
        window.innerWidth >= 900
    ){

        const scan =
            document.createElement(
                "div"
            );

        scan.className =
            "wx-scan";

        document.body.appendChild(
            scan
        );

    }


    /* ======================================================
       VIGNETTE
    ====================================================== */

    const vignette =
        document.createElement(
            "div"
        );

    vignette.className =
        "wetech-vignette";

    document.body.appendChild(
        vignette
    );

})();
