gsap.registerPlugin(ScrollTrigger);

// One Lenis instance drives desktop wheel smoothing. Touch remains native so
// mobile browsers retain their normal, reliable vertical scrolling behaviour.
const lenis = new Lenis({
    duration: 2,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false
});

let loaderIsActive = true;
let menuIsOpen = false;

function syncLenisState() {
    if (loaderIsActive || menuIsOpen) {
        lenis.stop();
        return;
    }

    lenis.start();
}

// Keep the existing Lenis instance inactive until the loader is removed.
lenis.stop();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Original entrance and ScrollTrigger values, retained verbatim.
// The responsive CSS clips only the off-canvas transform pixels; it does
// not alter these animations' styling, timing, or motion.
const heroAnimations = [
gsap.from(".header", {
    y: "-200%",
    delay: 0.2,
    duration: 0.7,
    ease: "power1.inOut",
    paused: true,
}),

gsap.from(".hero-title", {
    scale: 0,
    y: "-100%",
    duration: 2,
    ease: "elastic.out(1,0.8)",
    paused: true,
}),

gsap.from(".hero-thumb", {
    y: "100%",
    duration: 2,
    ease: "elastic.out(1,0.7)",
    paused: true,
}),

gsap.from(".hero-about-block", {
    x: "-200%",
    duration: 2,
    ease: "elastic.out(1,0.8)",
    paused: true,
}),

gsap.from(".hero-mission-block", {
    x: "200%",
    duration: 2,
    ease: "elastic.out(1,0.8)",
    paused: true,
})
];

const counterAnimations = [
gsap.from(".counter-block-left", {
    scrollTrigger: {
        trigger: ".counter",
    },
    x: "-200%",
    duration: .75,
    paused: true,
}),

gsap.from(".counter-block-right", {
    scrollTrigger: {
        trigger: ".counter",
    },
    x: "200%",
    duration: .75,
    paused: true,
})
];

// Counter can be visible in the first viewport. Its existing ScrollTriggers
// are enabled only after the loader has finished so they cannot play behind it.
counterAnimations.forEach((animation) => animation.scrollTrigger.disable());

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

function setMenu(open) {
    if (window.innerWidth >= 768) open = false;
    menuIsOpen = open;
    navigation.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    syncLenisState();
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

const loader = document.querySelector(".astro-loader");
const loaderScene = loader?.querySelector(".loader-scene");
const loaderPlanet = loader?.querySelector(".loader-planet");
const loaderOrbit = loader?.querySelector(".loader-orbit-path");
const loaderSatellite = loader?.querySelector(".loader-satellite");
const reduceLoaderMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let resolveLoaderIntro;
const loaderIntroComplete = new Promise((resolve) => {
    resolveLoaderIntro = resolve;
});

// This is the only timeline dedicated to the preloader. The existing site
// entrance and ScrollTrigger animations remain separate and unchanged.
const loaderTimeline = gsap.timeline({ paused: true });
const satelliteOrbitTween = reduceLoaderMotion ? null : gsap.to(loaderSatellite, {
    offsetDistance: "100%",
    duration: 4.5,
    ease: "none",
    repeat: -1,
    paused: true
});

if (reduceLoaderMotion) {
    loaderTimeline
        .set(loaderPlanet, { autoAlpha: 0, scale: 0.08 })
        .set(loaderOrbit, { autoAlpha: 0, strokeDashoffset: 100 })
        .set(loaderSatellite, { autoAlpha: 0, scale: 0.5, offsetDistance: "0%" })
        .to(loaderPlanet, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power1.out" })
        .to(loaderOrbit, { autoAlpha: 1, strokeDashoffset: 0, duration: 0.15, ease: "power1.out" })
        .to(loaderSatellite, { autoAlpha: 1, scale: 1, duration: 0.1, ease: "power1.out" })
        .call(resolveLoaderIntro);
} else {
    loaderTimeline
        .set(loaderPlanet, { autoAlpha: 0, scale: 0.06 })
        .set(loaderOrbit, { autoAlpha: 0, strokeDashoffset: 100 })
        .set(loaderSatellite, { autoAlpha: 0, scale: 0.45, offsetDistance: "0%" })
        .to(loaderPlanet, { autoAlpha: 1, scale: 1, duration: 1.05, ease: "power2.out" })
        .to(loaderOrbit, { autoAlpha: 1, strokeDashoffset: 0, duration: 0.55, ease: "power1.out" }, "-=0.12")
        .to(loaderSatellite, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power1.out" }, "-=0.1")
        .addLabel("loader-ready")
        .call(() => {
            resolveLoaderIntro();
            satelliteOrbitTween.play(0);
        }, [], "loader-ready");
}

loaderTimeline
    .addPause("await-hero-assets")
    .to(loaderScene, { autoAlpha: 0, scale: 0.94, duration: 0.28, ease: "power2.in" })
    .to(loader, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" }, "-=0.16")
    .call(() => {
        satelliteOrbitTween?.kill();
        loaderTimeline.kill();
        loader?.remove();
        startPageAfterLoader();
    });

loaderTimeline.play(0);

function waitForImage(image) {
    return new Promise((resolve) => {
        const source = image.currentSrc || image.src;

        // A completed image includes both successful loads and failures. Either
        // outcome lets the temporary loader finish instead of trapping the page.
        if (!source || image.complete) {
            resolve();
            return;
        }

        const preload = new Image();
        preload.onload = resolve;
        preload.onerror = resolve;
        preload.src = source;
    });
}

async function finishLoader() {
    // Only images that belong to the initial hero are relevant to this loader.
    const heroImages = [...document.querySelectorAll(".hero img")];
    await Promise.all([
        Promise.all(heroImages.map(waitForImage)),
        loaderIntroComplete
    ]);

    // The timeline pauses after its intro. Resume its own exit only once the
    // critical Hero assets are ready.
    loaderTimeline.play();
}

function startPageAfterLoader() {
    document.documentElement.classList.remove("loader-active");
    document.body.classList.remove("loader-active");
    loaderIsActive = false;
    syncLenisState();

    // Give the browser a full paint with the loader gone before the existing
    // entrance tweens begin. This preserves their first frame instead of
    // advancing it in the same render that removes the loader.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            counterAnimations.forEach((animation) => animation.scrollTrigger.enable(false, false));
            ScrollTrigger.refresh();
            heroAnimations.forEach((animation) => animation.play());
            counterAnimations.forEach((animation) => {
                if (animation.scrollTrigger.isActive) animation.play();
            });
        });
    });
}

finishLoader();
