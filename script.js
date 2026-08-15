/* =========================================================
   WETECH CINEMATIC ENGINE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const canvas =
            document.getElementById(
                "cosmicCanvas"
            );

        const ctx =
            canvas.getContext("2d");

        let width = 0;
        let height = 0;

        let particles = [];

        const mouse = {
            x: -1000,
            y: -1000
        };


        /* =================================================
           CANVAS SETUP
        ================================================= */

        function resizeCanvas(){

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


            createParticles();

        }


        /* =================================================
           PARTICLES
        ================================================= */

        function createParticles(){

            const count =
                width < 700
                    ? 30
                    : 65;

            particles =
                Array.from(
                    {
                        length:
                            count
                    },
                    () => {

                        return {

                            x:
                                Math.random()
                                * width,

                            y:
                                Math.random()
                                * height,

                            vx:
                                (
                                    Math.random()
                                    - .5
                                ) * .14,

                            vy:
                                (
                                    Math.random()
                                    - .5
                                ) * .14,

                            radius:
                                Math.random()
                                * 1.25
                                + .3,

                            alpha:
                                Math.random()
                                * .45
                                + .12

                        };

                    }
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


        window.addEventListener(
            "pointermove",
            event => {

                mouse.x =
                    event.clientX;

                mouse.y =
                    event.clientY;

            },
            {
                passive:true
            }
        );


        window.addEventListener(
            "pointerleave",
            () => {

                mouse.x =
                    -1000;

                mouse.y =
                    -1000;

            },
            {
                passive:true
            }
        );


        /* =================================================
           DRAW COSMOS
        ================================================= */

        let lastFrame =
            0;


        function drawCosmos(
            timestamp
        ){

            if(
                timestamp -
                lastFrame
                <
                1000 / 45
            ){

                requestAnimationFrame(
                    drawCosmos
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


            /* =============================
               DRAW PARTICLES
            ============================= */

            particles.forEach(
                particle => {

                    particle.x +=
                        particle.vx;

                    particle.y +=
                        particle.vy;


                    if(
                        particle.x <
                        -10
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
                        particle.y <
                        -10
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


                    /* Mouse interaction */

                    const dx =
                        mouse.x -
                        particle.x;

                    const dy =
                        mouse.y -
                        particle.y;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if(
                        distance < 150
                    ){

                        const force =
                            (
                                1 -
                                distance / 150
                            )
                            * .015;


                        particle.x -=
                            dx * force;

                        particle.y -=
                            dy * force;

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
                            115,
                            225,
                            255,
                            ${particle.alpha}
                        )`;


                    ctx.shadowBlur =
                        7;

                    ctx.shadowColor =
                        "rgba(34,211,238,.5)";


                    ctx.fill();

                }
            );


            /* =============================
               CONNECT PARTICLES
            ============================= */

            for(
                let i = 0;
                i < particles.length;
                i++
            ){

                let connections =
                    0;


                for(
                    let j = i + 1;
                    j < particles.length;
                    j++
                ){

                    if(
                        connections >= 2
                    ){

                        break;

                    }


                    const a =
                        particles[i];

                    const b =
                        particles[j];


                    const dx =
                        a.x - b.x;

                    const dy =
                        a.y - b.y;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if(
                        distance < 105
                    ){

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
                                70,
                                185,
                                255,
                                ${
                                    (
                                        1 -
                                        distance / 105
                                    ) * .10
                                }
                            )`;


                        ctx.lineWidth =
                            .45;


                        ctx.stroke();


                        connections++;

                    }

                }

            }


            requestAnimationFrame(
                drawCosmos
            );

        }


        requestAnimationFrame(
            drawCosmos
        );


        /* =================================================
           HERO PARALLAX
        ================================================= */

        const hero =
            document.querySelector(
                ".hero"
            );

        const reactor =
            document.querySelector(
                ".reactor-stage"
            );


        if(
            hero &&
            reactor &&
            window.innerWidth >= 900
        ){

            hero.addEventListener(
                "pointermove",
                event => {

                    const x =
                        (
                            event.clientX /
                            window.innerWidth
                        ) - .5;


                    const y =
                        (
                            event.clientY /
                            window.innerHeight
                        ) - .5;


                    reactor.style.transform =
                        `
                        translate3d(
                            ${x * 12}px,
                            ${y * 10}px,
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

                    reactor.style.transform =
                        "";

                }
            );

        }


        /* =================================================
           CARD INTERACTION
        ================================================= */

        const cards =
            document.querySelectorAll(
                ".service-card,.work-card,.pricing-card"
            );


        cards.forEach(
            card => {

                card.addEventListener(
                    "pointermove",
                    event => {

                        if(
                            window.innerWidth < 900
                        ){

                            return;

                        }


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


        /* =================================================
           SCROLL REVEAL
        ================================================= */

        const revealElements =
            document.querySelectorAll(
                ".service-card," +
                ".work-card," +
                ".process-step," +
                ".pricing-card," +
                ".contact-panel"
            );


        revealElements.forEach(
            element => {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translateY(20px)";

                element.style.transition =
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
                    threshold:
                        .10
                }
            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );


        /* =================================================
           CONTACT FORM
        ================================================= */

        const form =
            document.getElementById(
                "contactForm"
            );


        if(form){

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const message =
                        document.getElementById(
                            "formMessage"
                        );


                    if(message){

                        message.textContent =
                            "✓ Thanks! Your enquiry has been received.";

                    }


                    form.reset();

                }
            );

        }


        /* =================================================
           SOFT SHOOTING STARS
        ================================================= */

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
                "120px";

            star.style.height =
                "1px";

            star.style.left =
                (60 +
                Math.random() * 28)
                + "%";

            star.style.top =
                (8 +
                Math.random() * 28)
                + "%";

            star.style.zIndex =
                "-3";

            star.style.pointerEvents =
                "none";

            star.style.opacity =
                ".8";

            star.style.background =
                `
                linear-gradient(
                    90deg,
                    transparent,
                    rgba(145,235,255,.9),
                    transparent
                )
                `;

            star.style.boxShadow =
                `
                0 0 10px
                rgba(34,211,238,.55)
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
                                "translate(-280px,180px) rotate(-28deg)"
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


        function scheduleStar(){

            shootingStar();

            setTimeout(
                scheduleStar,
                7000 +
                Math.random()*7000
            );

        }


        setTimeout(
            scheduleStar,
            3500
        );

    }
);
/* =========================================================
   WETECH W.A.I. — SMART GUIDED ASSISTANT
========================================================= */

(() => {

    const system =
        document.getElementById("waiSystem");

    const avatar =
        document.getElementById("waiAvatar");

    const closeButton =
        document.getElementById("waiClose");

    const chat =
        document.getElementById("waiChat");

    const options =
        document.getElementById("waiOptions");


    if(
        !system ||
        !avatar ||
        !closeButton ||
        !chat ||
        !options
    ){
        return;
    }


    const sleep =
        ms =>
        new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );


    function addMessage(
        text
    ){

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "wai-message";

        message.textContent =
            text;

        chat.appendChild(
            message
        );

        chat.scrollTop =
            chat.scrollHeight;
    }


    async function typeMessage(
        text
    ){

        chat.innerHTML = "";

        const typing =
            document.createElement(
                "span"
            );

        typing.className =
            "wai-typing";

        typing.innerHTML =
            "<i></i><i></i><i></i>";

        chat.appendChild(
            typing
        );


        await sleep(650);


        typing.remove();


        const message =
            document.createElement(
                "div"
            );

        message.className =
            "wai-message";


        chat.appendChild(
            message
        );


        let index = 0;


        const interval =
            setInterval(
                () => {

                    message.textContent =
                        text.slice(
                            0,
                            index
                        );

                    index++;


                    if(
                        index >
                        text.length
                    ){

                        clearInterval(
                            interval
                        );

                    }

                },
                16
            );

    }


    function setOptions(
        items
    ){

        options.innerHTML = "";


        items.forEach(
            item => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "wai-option";

                button.textContent =
                    item.label;


                button.addEventListener(
                    "click",
                    item.action
                );


                options.appendChild(
                    button
                );

            }
        );

    }


    async function welcome(){

        await typeMessage(
            "Hey 👋 I'm W.A.I. — Wetech's digital assistant. What are you looking to build?"
        );


        setOptions([

            {
                label:"🌐 I need a website",

                action:
                    () =>
                    chooseWebsite()
            },


            {
                label:"📱 I need an app",

                action:
                    () =>
                    chooseApp()
            },


            {
                label:"🎨 Branding / Logo",

                action:
                    () =>
                    chooseBranding()
            },


            {
                label:"🤖 AI / Automation",

                action:
                    () =>
                    chooseAI()
            },


            {
                label:"💬 I just want to talk",

                action:
                    () =>
                    contactUs()
            }

        ]);

    }


    async function chooseWebsite(){

        await typeMessage(
            "Nice. What kind of website are you thinking about?"
        );


        setOptions([

            {
                label:"⚡ Business website",

                action:
                    () =>
                    projectReady(
                        "business website"
                    )
            },


            {
                label:"🚀 Premium website",

                action:
                    () =>
                    projectReady(
                        "premium website"
                    )
            },


            {
                label:"🛒 E-commerce",

                action:
                    () =>
                    projectReady(
                        "e-commerce website"
                    )
            },


            {
                label:"← Back",

                action:
                    () =>
                    welcome()
            }

        ]);

    }


    async function chooseApp(){

        await typeMessage(
            "Awesome. Are you looking for a mobile app or a web application?"
        );


        setOptions([

            {
                label:"📱 Mobile App",

                action:
                    () =>
                    projectReady(
                        "mobile application"
                    )
            },


            {
                label:"💻 Web Application",

                action:
                    () =>
                    projectReady(
                        "web application"
                    )
            },


            {
                label:"← Back",

                action:
                    () =>
                    welcome()
            }

        ]);

    }


    async function chooseBranding(){

        await typeMessage(
            "We can help create a complete visual identity. What do you need?"
        );


        setOptions([

            {
                label:"✦ Logo",

                action:
                    () =>
                    projectReady(
                        "logo design"
                    )
            },


            {
                label:"🎯 Full Branding",

                action:
                    () =>
                    projectReady(
                        "complete branding"
                    )
            },


            {
                label:"📱 Social Media Design",

                action:
                    () =>
                    projectReady(
                        "social media branding"
                    )
            },


            {
                label:"← Back",

                action:
                    () =>
                    welcome()
            }

        ]);

    }


    async function chooseAI(){

        await typeMessage(
            "Interesting. Wetech can build AI assistants, automation workflows and custom AI products."
        );


        setOptions([

            {
                label:"🤖 AI Assistant",

                action:
                    () =>
                    projectReady(
                        "AI assistant"
                    )
            },


            {
                label:"⚙️ Business Automation",

                action:
                    () =>
                    projectReady(
                        "AI automation"
                    )
            },


            {
                label:"🧠 Custom AI Product",

                action:
                    () =>
                    projectReady(
                        "custom AI product"
                    )
            },


            {
                label:"← Back",

                action:
                    () =>
                    welcome()
            }

        ]);

    }


    async function projectReady(
        type
    ){

        await typeMessage(
            `Perfect. A ${type} sounds like a great fit. Let's get the details and we'll help you take the next step.`
        );


        setOptions([

            {
                label:"🚀 Start My Project",

                action:
                    () => {

                        window.location.href =
                            "#contact";

                    }
            },


            {
                label:"💬 WhatsApp Wetech",

                action:
                    () => {

                        window.open(
                            "https://wa.me/918445209063",
                            "_blank"
                        );

                    }
            },


            {
                label:"← Start Over",

                action:
                    () =>
                    welcome()
            }

        ]);

    }


    async function contactUs(){

        await typeMessage(
            "Absolutely. You can reach Wetech directly on WhatsApp and we'll take it from there."
        );


        setOptions([

            {
                label:"💬 WhatsApp +91 8445209063",

                action:
                    () => {

                        window.open(
                            "https://wa.me/918445209063",
                            "_blank"
                        );

                    }
            },


            {
                label:"📩 Contact Form",

                action:
                    () => {

                        window.location.href =
                            "#contact";

                    }
            },


            {
                label:"← Back",

                action:
                    () =>
                    welcome()
            }

        ]);

    }


    avatar.addEventListener(
        "click",
        async () => {

            system.classList.toggle(
                "open"
            );


            if(
                system.classList.contains(
                    "open"
                ) &&
                chat.children.length === 0
            ){

                await welcome();

            }

        }
    );


    closeButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            system.classList.remove(
                "open"
            );

        }
    );


    /* Auto intro */

    setTimeout(
        async () => {

            if(
                !system.classList.contains(
                    "open"
                )
            ){

                system.classList.add(
                    "open"
                );

                await welcome();

            }

        },
        1800
    );

})();
