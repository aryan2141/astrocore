gsap.registerPlugin(ScrollTrigger);

// One Lenis instance drives desktop wheel smoothing. Touch remains native so
// mobile browsers retain their normal, reliable vertical scrolling behaviour.
const lenis = new Lenis({
    duration: 2,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Original entrance and ScrollTrigger values, retained verbatim.
// The responsive CSS clips only the off-canvas transform pixels; it does
// not alter these animations' styling, timing, or motion.
gsap.from(".header", {
    y: "-200%",
    delay: 0.2,
    duration: 0.7,
    ease: "power1.inOut",
});

gsap.from(".hero-title", {
    scale: 0,
    y: "-100%",
    duration: 2,
    ease: "elastic.out(1,0.8)",
});

gsap.from(".hero-thumb", {
    y: "100%",
    duration: 2,
    ease: "elastic.out(1,0.7)",
});

gsap.from(".hero-about-block", {
    x: "-200%",
    duration: 2,
    ease: "elastic.out(1,0.8)",
});

gsap.from(".hero-mission-block", {
    x: "200%",
    duration: 2,
    ease: "elastic.out(1,0.8)",
});

gsap.from(".counter-block-left", {
    scrollTrigger: {
        trigger: ".counter",
    },
    x: "-200%",
    duration: .75,
});

gsap.from(".counter-block-right", {
    scrollTrigger: {
        trigger: ".counter",
    },
    x: "200%",
    duration: .75,
});

gsap.from(".mission .section-title", {
    scrollTrigger: {
        trigger: ".mission",
        start: "top 50%"
    },
    x: "-200%",
    duration: .75,
    ease: "elastic.out(0.5,0.8)",
});

gsap.from(".mission-item", {
    scrollTrigger: {
        trigger: ".mission",
        start: "top 50%"
    },
    x: "-200%",
    duration: 1,
    ease: "elastic.out(0.5,0.8)",
});

gsap.from(".mission-thumb-bg", {
    y: "-200%",
    opacity: 0,
    duration: 1,
    scrollTrigger: {
        trigger: ".mission-thumb-wrapper",
        start: "top 50%"
    },
    ease: "elastic.out(0.7,0.8)",
});

gsap.from(".mission-thumb", {
    y: "200%",
    opacity: 0,
    duration: 1,
    scrollTrigger: {
        trigger: ".mission-thumb-wrapper",
        start: "top 50%"
    },
    ease: "elastic.out(0.7,0.8)",
});

gsap.from(".research-planet", {
    y: "-200%",
    opacity: 0,
    duration: 1,
    scrollTrigger: {
        trigger: ".research",
        start: "top 40%"
    },
    ease: "elastic.out(0.7,0.8)",
});

gsap.from(".research .section-title", {
    opacity: 0,
    delay: 0.25,
    duration: 0.25,
    scrollTrigger: {
        trigger: ".research",
        start: "top 40%",
    },
});

gsap.from(".research-pills-wrapper-top", {
    x: "-100%",
    duration: 1.5,
    scrollTrigger: {
        trigger: ".research",
        start: "top 40%",
    },
});

gsap.from(".research-pills-wrapper-bottom", {
    x: "100%",
    duration: 1.5,
    scrollTrigger: {
        trigger: ".research",
        start: "top 40%",
    },
});

gsap.from(".footer-top", {
    x: "-100%",
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".footer",
        start: "top bottom"
    }
});

gsap.from(".footer-bottom", {
    x: "100%",
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".footer",
        start: "top bottom"
    }
});

const menuButton = document.querySelector("#nav-toggler");
const navigation = document.querySelector(".header .navbar-nav");
let menuIsOpen = false;

function setMenu(open) {
    if (window.innerWidth >= 768) open = false;
    menuIsOpen = open;
    navigation.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    open ? lenis.stop() : lenis.start();
}

menuButton.addEventListener("click", () => setMenu(!menuIsOpen));

document.querySelectorAll("[data-scroll-target]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.getElementById(link.dataset.scrollTarget);
        if (!target) return;
        setMenu(false);
        lenis.scrollTo(target, { offset: -24, duration: 1.1 });
    });
});

let resizeTimer;
window.addEventListener("resize", () => {
    setMenu(false);
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refreshScrollTriggers, 200);
}, { passive: true });

function refreshScrollTriggers() {
    ScrollTrigger.refresh();
}

window.addEventListener("load", refreshScrollTriggers, { once: true });
if (document.fonts) document.fonts.ready.then(refreshScrollTriggers);