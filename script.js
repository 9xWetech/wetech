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
   W.A.I. — WETECH ASSISTANT FIX
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const system = document.getElementById("waiSystem");
    const avatar = document.getElementById("waiAvatar");
    const closeBtn = document.getElementById("waiClose");
    const chat = document.getElementById("waiChat");
    const options = document.getElementById("waiOptions");

    if (!system || !avatar || !closeBtn || !chat || !options) {
        console.warn("W.A.I. elements not found");
        return;
    }


    const sleep = (ms) =>
        new Promise(resolve => setTimeout(resolve, ms));


    function showTyping() {

        chat.innerHTML = `
            <div class="wai-message">
                <span class="wai-typing">
                    <i></i><i></i><i></i>
                </span>
            </div>
        `;
    }


    async function say(text) {

        showTyping();

        await sleep(650);

        chat.innerHTML = "";

        const message = document.createElement("div");
        message.className = "wai-message";

        chat.appendChild(message);

        let i = 0;

        const timer = setInterval(() => {

            message.textContent = text.slice(0, i);
            i++;

            if (i > text.length) {
                clearInterval(timer);
            }

        }, 18);
    }


    function choices(items) {

        options.innerHTML = "";

        items.forEach(item => {

            const button =
                document.createElement("button");

            button.className =
                "wai-option";

            button.textContent =
                item.text;

            button.addEventListener(
                "click",
                item.action
            );

            options.appendChild(button);

        });
    }


    async function startAssistant() {

        await say(
            "Hey 👋 I'm W.A.I., Wetech's digital assistant. How can I help you today?"
        );

        choices([

            {
                text:"🌐 I need a website",
                action:website
            },

            {
                text:"📱 I need an app",
                action:app
            },

            {
                text:"🎨 Logo / Branding",
                action:branding
            },

            {
                text:"🤖 AI / Automation",
                action:ai
            },

            {
                text:"💬 Talk to Wetech",
                action:talk
            }

        ]);
    }


    async function website() {

        await say(
            "Awesome. What kind of website are you looking for?"
        );

        choices([

            {
                text:"Business Website",
                action:project
            },

            {
                text:"Premium Website",
                action:project
            },

            {
                text:"E-commerce",
                action:project
            },

            {
                text:"← Back",
                action:startAssistant
            }

        ]);
    }


    async function app() {

        await say(
            "Great. We can help with mobile apps and web applications."
        );

        choices([

            {
                text:"📱 Mobile App",
                action:project
            },

            {
                text:"💻 Web App",
                action:project
            },

            {
                text:"← Back",
                action:startAssistant
            }

        ]);
    }


    async function branding() {

        await say(
            "Nice. Wetech can create logos and complete visual identities."
        );

        choices([

            {
                text:"✦ Logo Design",
                action:project
            },

            {
                text:"🎯 Full Branding",
                action:project
            },

            {
                text:"📱 Social Media Branding",
                action:project
            },

            {
                text:"← Back",
                action:startAssistant
            }

        ]);
    }


    async function ai() {

        await say(
            "Interesting. We can build AI assistants, automation and custom AI products."
        );

        choices([

            {
                text:"🤖 AI Assistant",
                action:project
            },

            {
                text:"⚙️ Automation",
                action:project
            },

            {
                text:"🧠 Custom AI",
                action:project
            },

            {
                text:"← Back",
                action:startAssistant
            }

        ]);
    }


    async function project() {

        await say(
            "Perfect. Let's take the next step and discuss your project."
        );

        choices([

            {
                text:"🚀 Start My Project",
                action:goContact
            },

            {
                text:"💬 WhatsApp Wetech",
                action:whatsapp
            },

            {
                text:"← Start Again",
                action:startAssistant
            }

        ]);
    }


    async function talk() {

        await say(
            "I'm here. You can contact Wetech directly or send an enquiry."
        );

        choices([

            {
                text:"💬 WhatsApp +91 8445209063",
                action:whatsapp
            },

            {
                text:"📩 Contact Form",
                action:goContact
            },

            {
                text:"← Back",
                action:startAssistant
            }

        ]);
    }


    function whatsapp() {

        window.open(
            "https://wa.me/918445209063",
            "_blank",
            "noopener"
        );
    }


    function goContact() {

        system.classList.remove("open");

        const contact =
            document.getElementById("contact");

        if (contact) {

            contact.scrollIntoView({
                behavior:"smooth"
            });

        }

    }


    avatar.addEventListener(
        "click",
        async () => {

            const isOpen =
                system.classList.toggle("open");

            if (
                isOpen &&
                chat.children.length === 0
            ) {

                await startAssistant();

            }

        }
    );


    closeBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            system.classList.remove("open");

        }
    );


    /* =========================
       AUTO OPEN
    ========================= */

    setTimeout(
        async () => {

            if (
                !system.classList.contains("open")
            ) {

                system.classList.add("open");

                await startAssistant();

            }

        },
        1200
    );

});
/* =========================================================
   W.A.I. VOICE UPGRADE — PASTE AT END OF script.js
========================================================= */

(() => {

    const system =
        document.getElementById("waiSystem");

    const avatar =
        document.getElementById("waiAvatar");

    const closeBtn =
        document.getElementById("waiClose");

    const chat =
        document.getElementById("waiChat");

    const options =
        document.getElementById("waiOptions");


    /* -----------------------------------------
       Check W.A.I. exists
    ----------------------------------------- */

    if (
        !system ||
        !avatar ||
        !closeBtn ||
        !chat ||
        !options
    ) {

        console.warn(
            "W.A.I. voice patch: elements not found."
        );

        return;
    }


    /* -----------------------------------------
       Helpers
    ----------------------------------------- */

    const sleep = (ms) =>
        new Promise(
            resolve => setTimeout(resolve, ms)
        );


    function stopVoice(){

        if (
            "speechSynthesis" in window
        ){

            window.speechSynthesis.cancel();

        }

    }


    function speak(text){

        if (
            !("speechSynthesis" in window)
        ){

            console.warn(
                "Speech synthesis is not supported."
            );

            return;

        }


        stopVoice();


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        /* Voice settings */

        utterance.lang = "en-IN";

        utterance.rate = 0.92;

        utterance.pitch = 1.03;

        utterance.volume = 1;


        /*
         * Try Indian English first.
         * Otherwise use any English voice.
         */

        const voices =
            window.speechSynthesis
                .getVoices();


        const preferred =
            voices.find(
                voice =>
                    voice.lang
                    .toLowerCase()
                    === "en-in"
            )
            ||
            voices.find(
                voice =>
                    voice.lang
                    .toLowerCase()
                    .startsWith("en")
            );


        if(preferred){

            utterance.voice =
                preferred;

        }


        window.speechSynthesis.speak(
            utterance
        );

    }


    function typing(){

        chat.innerHTML = `
            <div class="wai-message">
                <span class="wai-typing">
                    <i></i>
                    <i></i>
                    <i></i>
                </span>
            </div>
        `;

    }


    async function say(
        text,
        voice = true
    ){

        typing();

        await sleep(550);

        chat.innerHTML = "";


        const message =
            document.createElement(
                "div"
            );


        message.className =
            "wai-message";


        chat.appendChild(
            message
        );


        let i = 0;


        const timer =
            setInterval(
                () => {

                    message.textContent =
                        text.slice(
                            0,
                            i
                        );

                    i++;


                    if(
                        i >
                        text.length
                    ){

                        clearInterval(
                            timer
                        );

                    }

                },
                16
            );


        if(voice){

            speak(text);

        }

    }


    function setChoices(
        list
    ){

        options.innerHTML = "";


        list.forEach(
            item => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "wai-option";


                button.type =
                    "button";


                button.textContent =
                    item.text;


                button.addEventListener(
                    "click",
                    async () => {

                        await item.action();

                    }
                );


                options.appendChild(
                    button
                );

            }
        );

    }


    /* -----------------------------------------
       First voice unlock
       Browser autoplay policy means the
       user needs one interaction.
    ----------------------------------------- */

    function unlockVoice(){

        if(
            !("speechSynthesis" in window)
        ){

            return;

        }


        const unlock =
            new SpeechSynthesisUtterance(
                ""
            );


        unlock.volume = 0;


        window.speechSynthesis.speak(
            unlock
        );

    }


    /* -----------------------------------------
       HOME
    ----------------------------------------- */

    async function home(){

        await say(
            "Hey! I'm W.A.I., Wetech's digital assistant. What are you looking to build?",
            true
        );


        setChoices([

            {
                text:
                    "🌐 I need a website",

                action:
                    website
            },

            {
                text:
                    "📱 I need an app",

                action:
                    app
            },

            {
                text:
                    "🎨 Logo or Branding",

                action:
                    branding
            },

            {
                text:
                    "🤖 AI or Automation",

                action:
                    ai
            },

            {
                text:
                    "💬 Talk to Wetech",

                action:
                    contact
            }

        ]);

    }


    /* -----------------------------------------
       WEBSITE
    ----------------------------------------- */

    async function website(){

        await say(
            "Great choice. What kind of website are you looking for?",
            true
        );


        setChoices([

            {
                text:
                    "⚡ Business Website",

                action:
                    () =>
                        project(
                            "business website"
                        )
            },

            {
                text:
                    "🚀 Premium Website",

                action:
                    () =>
                        project(
                            "premium website"
                        )
            },

            {
                text:
                    "🛒 E-commerce Website",

                action:
                    () =>
                        project(
                            "e-commerce website"
                        )
            },

            {
                text:
                    "← Back",

                action:
                    home
            }

        ]);

    }


    /* -----------------------------------------
       APP
    ----------------------------------------- */

    async function app(){

        await say(
            "Awesome. Do you need a mobile app or a web application?",
            true
        );


        setChoices([

            {
                text:
                    "📱 Mobile App",

                action:
                    () =>
                        project(
                            "mobile app"
                        )
            },

            {
                text:
                    "💻 Web Application",

                action:
                    () =>
                        project(
                            "web application"
                        )
            },

            {
                text:
                    "← Back",

                action:
                    home
            }

        ]);

    }


    /* -----------------------------------------
       BRANDING
    ----------------------------------------- */

    async function branding(){

        await say(
            "Nice. We can help build a strong visual identity. What do you need?",
            true
        );


        setChoices([

            {
                text:
                    "✦ Logo Design",

                action:
                    () =>
                        project(
                            "logo design"
                        )
            },

            {
                text:
                    "🎯 Full Brand Identity",

                action:
                    () =>
                        project(
                            "full brand identity"
                        )
            },

            {
                text:
                    "📱 Social Media Branding",

                action:
                    () =>
                        project(
                            "social media branding"
                        )
            },

            {
                text:
                    "← Back",

                action:
                    home
            }

        ]);

    }


    /* -----------------------------------------
       AI
    ----------------------------------------- */

    async function ai(){

        await say(
            "Interesting. Wetech can build AI assistants, automation systems and custom AI products.",
            true
        );


        setChoices([

            {
                text:
                    "🤖 AI Assistant",

                action:
                    () =>
                        project(
                            "AI assistant"
                        )
            },

            {
                text:
                    "⚙️ Business Automation",

                action:
                    () =>
                        project(
                            "business automation"
                        )
            },

            {
                text:
                    "🧠 Custom AI Product",

                action:
                    () =>
                        project(
                            "custom AI product"
                        )
            },

            {
                text:
                    "← Back",

                action:
                    home
            }

        ]);

    }


    /* -----------------------------------------
       PROJECT
    ----------------------------------------- */

    async function project(
        type
    ){

        await say(
            `Perfect. A ${type} sounds like a great fit. Let's take the next step.`,
            true
        );


        setChoices([

            {
                text:
                    "🚀 Start My Project",

                action:
                    goContact
            },

            {
                text:
                    "💬 WhatsApp Wetech",

                action:
                    whatsapp
            },

            {
                text:
                    "← Start Again",

                action:
                    home
            }

        ]);

    }


    /* -----------------------------------------
       CONTACT
    ----------------------------------------- */

    async function contact(){

        await say(
            "Absolutely. You can contact Wetech directly or send a project enquiry.",
            true
        );


        setChoices([

            {
                text:
                    "💬 WhatsApp +91 8445209063",

                action:
                    whatsapp
            },

            {
                text:
                    "📩 Contact Form",

                action:
                    goContact
            },

            {
                text:
                    "← Back",

                action:
                    home
            }

        ]);

    }


    /* -----------------------------------------
       WHATSAPP
    ----------------------------------------- */

    function whatsapp(){

        window.open(
            "https://wa.me/918445209063",
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* -----------------------------------------
       CONTACT SECTION
    ----------------------------------------- */

    function goContact(){

        system.classList.remove(
            "open"
        );


        const contactSection =
            document.getElementById(
                "contact"
            );


        if(
            contactSection
        ){

            contactSection.scrollIntoView({
                behavior:
                    "smooth"
            });

        }

    }


    /* -----------------------------------------
       AVATAR CLICK
    ----------------------------------------- */

    avatar.addEventListener(
        "click",
        async () => {

            /*
             * First click unlocks speech
             */

            unlockVoice();


            const opened =
                system.classList.toggle(
                    "open"
                );


            if(
                opened
            ){

                /*
                 * Start fresh conversation
                 */

                await home();

            }
            else{

                stopVoice();

            }

        }
    );


    /* -----------------------------------------
       CLOSE
    ----------------------------------------- */

    closeBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            system.classList.remove(
                "open"
            );

            stopVoice();

        }
    );


    /* -----------------------------------------
       AUTO WELCOME
       No automatic speech here because
       browsers can block autoplay.
    ----------------------------------------- */

    setTimeout(
        () => {

            if(
                !system.classList.contains(
                    "open"
                )
            ){

                system.classList.add(
                    "open"
                );


                chat.innerHTML = `
                    <div class="wai-message">
                        Hey 👋 I'm W.A.I., Wetech's digital assistant.
                        Click <strong>Talk to W.A.I.</strong>
                        and I'll guide you.
                    </div>
                `;


                setChoices([

                    {
                        text:
                            "🔊 Talk to W.A.I.",

                        action:
                            home
                    },

                    {
                        text:
                            "🌐 I need a website",

                        action:
                            website
                    },

                    {
                        text:
                            "📱 I need an app",

                        action:
                            app
                    },

                    {
                        text:
                            "🎨 Branding",

                        action:
                            branding
                    },

                    {
                        text:
                            "🤖 AI",

                        action:
                            ai
                    }

                ]);

            }

        },
        1800
    );


})();
