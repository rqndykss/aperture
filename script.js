(() => {
    'use strict';

    const root = document.documentElement;
    const $ = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

    if (window.__jsFallback) clearTimeout(window.__jsFallback);

    const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
    let lenis = null;

   
    $$('a[href="#"]').forEach((link) => {
        link.addEventListener('click', (e) => e.preventDefault());
    });

   
    const burger = $('.header__burger');
    const nav = $('.header__nav');
    const overlay = $('.header__overlay');
    const menuQuery = window.matchMedia('(max-width: 1024px)');

    const setMenu = (open) => {
        if (!burger || !nav) return;

        [nav, burger, overlay].forEach((el) => el && el.classList.toggle('is-open', open));
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('menu-open', open);

        if (lenis) open ? lenis.stop() : lenis.start();

        if (open && hasGsap) {
            gsap.fromTo(
                $$('.header__ul > *'),
                { x: 36, autoAlpha: 0 },
                {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.9,
                    ease: 'expo.out',
                    stagger: 0.07,
                    delay: 0.2,
                    overwrite: true,
                    clearProps: 'transform,opacity,visibility'
                }
            );
        }
    };

    if (burger && nav) {
        burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
        if (overlay) overlay.addEventListener('click', () => setMenu(false));
        $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenu(false);
        });
        menuQuery.addEventListener('change', (e) => {
            if (!e.matches) setMenu(false);
        });
    }

   
    if (!hasGsap) {
        root.classList.remove('js');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

   
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (motionOk && window.Lenis) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    const splitWords = (el) => {
        const walk = (node) => {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(' '));
                            return;
                        }
                        const word = document.createElement('span');
                        const inner = document.createElement('span');
                        word.className = 'word';
                        inner.className = 'word__inner';
                        inner.textContent = part;
                        word.appendChild(inner);
                        frag.appendChild(word);
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === 1 && child.tagName !== 'BR') {
                    walk(child);
                }
            });
        };
        walk(el);
    };

    $$('.aperture__title, .what__we__do-title, .clients-title, .help-photo-title').forEach(splitWords);

    const mm = gsap.matchMedia();

    mm.add(
        {
            motion: '(prefers-reduced-motion: no-preference)',
            wide: '(min-width: 1025px)',
            stacked: '(max-width: 900px)',
            hover: '(hover: hover) and (pointer: fine)'
        },
        (context) => {
            const { motion, wide, stacked, hover } = context.conditions;
            if (!motion) return;

            
            const hero = gsap.timeline({ defaults: { ease: 'expo.out' } });

            hero
                .fromTo(
                    '.aperture__studios',
                    { filter: 'brightness(0.2)' },
                    { filter: 'brightness(1)', duration: 2.4, ease: 'power2.out', clearProps: 'filter' },
                    0
                )
                .from('.header__logo', { y: -18, autoAlpha: 0, duration: 1.2 }, 0.15);

            if (wide) {
                hero.from(
                    '.header__ul > *',
                    { y: -14, autoAlpha: 0, duration: 1, stagger: 0.07, clearProps: 'transform,opacity,visibility' },
                    0.25
                );
            } else {
                hero.from('.header__burger', { autoAlpha: 0, duration: 1 }, 0.25);
            }

            hero
                .from('.mini__title', { y: 22, autoAlpha: 0, duration: 1.2 }, 0.55)
                .from('.aperture__title .word__inner', { yPercent: 120, duration: 1.5, stagger: 0.12 }, 0.65)
                .from('.aperture__desc', { y: 26, autoAlpha: 0, duration: 1.3 }, 1.0);

           
            $$('.what__we__do-title, .clients-title, .help-photo-title').forEach((title) => {
                gsap.from($$('.word__inner', title), {
                    yPercent: 120,
                    duration: 1.3,
                    ease: 'expo.out',
                    stagger: 0.08,
                    scrollTrigger: { trigger: title, start: 'top 88%' }
                });
            });

            $$('.what__we__do-desc, .clients-desc, .help-photo-desc').forEach((desc) => {
                gsap.from(desc, {
                    y: 24,
                    autoAlpha: 0,
                    duration: 1.2,
                    ease: 'expo.out',
                    delay: 0.15,
                    scrollTrigger: { trigger: desc, start: 'top 92%' }
                });
            });

            
            $$('.tech__info-content, .tech__info-content-japan').forEach((group) => {
                gsap.from($$('.tech__info-item, .tech__info-item-japan', group), {
                    y: 16,
                    autoAlpha: 0,
                    duration: 1,
                    ease: 'expo.out',
                    stagger: 0.09,
                    scrollTrigger: { trigger: group, start: 'top 96%' }
                });
            });

            
            const cards = $$('.what__we__do-card-content > div');

            cards.forEach((card) => {
                const tl = gsap.timeline({
                    defaults: { ease: 'expo.out' },
                    scrollTrigger: { trigger: card, start: 'top 88%' }
                });

                tl.fromTo(
                    card,
                    { y: 60, autoAlpha: 0, clipPath: 'inset(14% 0% 0% 0%)' },
                    {
                        y: 0,
                        autoAlpha: 1,
                        clipPath: 'inset(0% 0% 0% 0%)',
                        duration: 1.5,
                        clearProps: 'clipPath,opacity,visibility,transform'
                    }
                ).from(
                    $$('.card-item-text, .card-item-desc, .read__more-button', card),
                    { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.1 },
                    0.35
                );

                if (hover) {
                    const lift = gsap.to(card, { y: -10, duration: 0.8, ease: 'power3.out', paused: true });
                    card.addEventListener('mouseenter', () => lift.play());
                    card.addEventListener('mouseleave', () => lift.reverse());
                }
            });

            
            const frameFrom = stacked ? 'inset(3% 4% 3% 4% round 20px)' : 'inset(8% 5% 8% 5% round 28px)';

            $$('.japan, .leaf, .star').forEach((section) => {
                gsap.fromTo(
                    section,
                    { clipPath: frameFrom },
                    {
                        clipPath: 'inset(0% 0% 0% 0% round 0px)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 95%',
                            end: 'top 30%',
                            scrub: 0.6,
                            invalidateOnRefresh: true
                        }
                    }
                );

                gsap.from($('.japan-text', section), {
                    x: stacked ? 0 : 60,
                    y: stacked ? 30 : 0,
                    autoAlpha: 0,
                    duration: 1.5,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: section, start: 'top 50%' }
                });
            });

            /* ---------- Gear cage ---------- */
            gsap.from($$('.mini-gear-title, .gear-middle-title, .gear-description, .gear-button'), {
                y: 34,
                autoAlpha: 0,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.12,
                scrollTrigger: { trigger: '.gear__cage-content', start: 'top 70%' }
            });

            const gearImage = gsap.timeline({
                defaults: { ease: 'expo.out' },
                scrollTrigger: { trigger: '.gear__cage-right-side', start: 'top 75%' }
            });

            gearImage
                .fromTo(
                    '.gear__cage-right-side',
                    { clipPath: stacked ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 100%)' },
                    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, clearProps: 'clipPath' },
                    0
                )
                .fromTo('.gear-bg', { scale: 1.3 }, { scale: 1, duration: 2.4 }, 0);

            
            gsap.from('.clients-content img', {
                y: 36,
                autoAlpha: 0,
                scale: 0.94,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.1,
                scrollTrigger: { trigger: '.clients-content', start: 'top 90%' }
            });

            
            gsap.from('.check-it-button', {
                y: 24,
                autoAlpha: 0,
                scale: 0.92,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: { trigger: '.check-it-button', start: 'top 96%' }
            });

            
            if (hover) {
                $$('.header__button, .gear__btn, .check__btn, .read__more-btn').forEach((btn) => {
                    const xTo = gsap.quickTo(btn, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.6)' });
                    const yTo = gsap.quickTo(btn, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.6)' });
                    const icon = $('img', btn);

                    btn.addEventListener('pointermove', (e) => {
                        const r = btn.getBoundingClientRect();
                        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
                        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
                    });

                    btn.addEventListener('pointerenter', () => {
                        if (icon) gsap.to(icon, { rotation: 180, duration: 0.9, ease: 'power3.out' });
                    });

                    btn.addEventListener('pointerleave', () => {
                        xTo(0);
                        yTo(0);
                        if (icon) gsap.to(icon, { rotation: 0, duration: 0.9, ease: 'power3.out' });
                    });
                });
            }
        }
    );

    
    root.classList.remove('js');

    
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();