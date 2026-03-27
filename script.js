/* ================================================================
   SABOR AZTECA — JAVASCRIPT PRINCIPAL
   ================================================================ */

/* ─── Esperar a que el DOM esté listo ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    initNavbar();
    initHamburger();
    initMenuFilter();
    initScrollReveal();
    initCarousel();
    initReservationForm();
    initCounters();
    initBackToTop();
    initOrderButtons();
    initNewsletter();
    initActiveNavLinks();

});


/* ================================================================
   1. NAVBAR — scroll effect + active link
   ================================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hero   = document.getElementById('inicio');

    function onScroll() {
        const scrollY = window.scrollY;

        /* Clase scrolled cuando pasamos 60px */
        navbar.classList.toggle('scrolled', scrollY > 60);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* ejecutar al inicio */

    /* Añadir clase 'loaded' al hero para la animación del fondo */
    setTimeout(() => hero?.classList.add('loaded'), 100);
}


/* ================================================================
   2. HAMBURGER MENU
   ================================================================ */
function initHamburger() {
    const hamburger  = document.getElementById('hamburger');
    const navLinks   = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (!hamburger) return;

    function openMenu() {
        hamburger.classList.add('open');
        navLinks.classList.add('open');
        navOverlay.classList.add('visible');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('visible');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });

    /* Cerrar al hacer clic en un link */
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* Cerrar al hacer clic en el overlay */
    navOverlay.addEventListener('click', closeMenu);

    /* Cerrar con tecla Escape */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });
}


/* ================================================================
   3. ACTIVE NAV LINKS — resaltar sección visible
   ================================================================ */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    }, { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(sec => observer.observe(sec));
}


/* ================================================================
   4. MENÚ INTERACTIVO — filtro por categoría
   ================================================================ */
function initMenuFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards  = document.querySelectorAll('.menu-card');
    const noResults  = document.getElementById('noResults');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.dataset.filter;

            /* Actualizar botón activo */
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            /* Micro-animación en el botón */
            this.style.transform = 'scale(.93)';
            setTimeout(() => (this.style.transform = ''), 150);

            /* Filtrar tarjetas */
            let visibleCount = 0;

            menuCards.forEach((card, i) => {
                const cat = card.dataset.category;
                const match = filter === 'all' || cat === filter;

                if (match) {
                    visibleCount++;
                    card.classList.remove('hidden');
                    /* Delay escalonado para efecto cascada */
                    card.style.transitionDelay = `${(visibleCount - 1) * 50}ms`;
                    card.classList.add('appearing');

                    /* Limpiar clase tras la animación */
                    setTimeout(() => {
                        card.classList.remove('appearing');
                        card.style.transitionDelay = '';
                    }, 400 + i * 50);

                } else {
                    card.classList.add('hidden');
                    card.classList.remove('appearing');
                    card.style.transitionDelay = '';
                }
            });

            /* Mensaje sin resultados */
            noResults?.classList.toggle('hidden', visibleCount > 0);
        });
    });
}


/* ================================================================
   5. SCROLL REVEAL — animaciones al hacer scroll
   ================================================================ */
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (!targets.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); /* Solo una vez */
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    targets.forEach(el => observer.observe(el));
}


/* ================================================================
   6. CONTADOR ANIMADO — números del hero
   ================================================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-target]');

    if (!counters.length) return;

    function animateCounter(el, target, duration = 1800) {
        const start     = performance.now();
        const startVal  = 0;

        function step(timestamp) {
            const elapsed  = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            /* Easing: ease-out cubic */
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(startVal + (target - startVal) * ease);

            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* Lanzar cuando el hero sea visible */
    const heroSection = document.getElementById('inicio');
    const counterObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            counters.forEach(el => {
                const target = parseInt(el.dataset.target, 10);
                animateCounter(el, target);
            });
            counterObserver.disconnect();
        }
    }, { threshold: 0.3 });

    if (heroSection) counterObserver.observe(heroSection);
}


/* ================================================================
   7. CARRUSEL DE TESTIMONIOS
   ================================================================ */
function initCarousel() {
    const track      = document.getElementById('carouselTrack');
    const prevBtn    = document.getElementById('prevBtn');
    const nextBtn    = document.getElementById('nextBtn');
    const dotsWrap   = document.getElementById('carouselDots');

    if (!track) return;

    const cards       = Array.from(track.children);
    const totalCards  = cards.length;
    let currentIndex  = 0;
    let autoPlayTimer = null;
    let isPaused      = false;

    /* Crear dots */
    cards.forEach((_, i) => {
        const dot  = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.carousel-dot');

    /* Ir a índice */
    function goTo(index) {
        currentIndex = (index + totalCards) % totalCards;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    /* Siguiente / Anterior */
    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    nextBtn?.addEventListener('click', () => { next(); resetAutoPlay(); });
    prevBtn?.addEventListener('click', () => { prev(); resetAutoPlay(); });

    /* AutoPlay cada 5 segundos */
    function startAutoPlay() {
        autoPlayTimer = setInterval(() => {
            if (!isPaused) next();
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    /* Pausar con hover */
    const wrapper = document.querySelector('.carousel-wrapper');
    wrapper?.addEventListener('mouseenter', () => { isPaused = true;  });
    wrapper?.addEventListener('mouseleave', () => { isPaused = false; });

    /* Swipe táctil */
    let touchStartX = 0;
    let touchEndX   = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
            resetAutoPlay();
        }
    });

    /* Teclado */
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { prev(); resetAutoPlay(); }
        if (e.key === 'ArrowRight') { next(); resetAutoPlay(); }
    });

    /* Iniciar */
    goTo(0);
    startAutoPlay();
}


/* ================================================================
   8. FORMULARIO DE RESERVACIONES
   ================================================================ */
function initReservationForm() {
    const form = document.getElementById('reservationForm');

    if (!form) return;

    /* Establecer fecha mínima (hoy) */
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
    }

    /* Validación individual al perder foco (blur) */
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            /* Limpiar error mientras escribe */
            if (field.classList.contains('error')) {
                clearFieldError(field);
            }
        });
    });

    /* Submit */
    form.addEventListener('submit', async e => {
        e.preventDefault();

        /* Validar todos los campos */
        const isValid = validateForm();

        if (!isValid) {
            /* Scroll al primer error */
            const firstError = form.querySelector('.error');
            firstError?.focus();
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showToast('Por favor corrige los campos en rojo', 'error');
            return;
        }

        /* Simular envío (loading state) */
        const submitBtn = form.querySelector('.btn-submit');
        const btnText   = submitBtn.querySelector('span');
        const btnLoader = document.getElementById('btnLoader');

        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        btnLoader?.classList.remove('hidden');

        /* Simular delay de red */
        await sleep(1800);

        /* Éxito */
        submitBtn.disabled = false;
        btnText.textContent = 'Confirmar Reservación';
        btnLoader?.classList.add('hidden');

        /* Mostrar mensaje de éxito */
        const formSuccess = document.getElementById('formSuccess');
        formSuccess?.classList.remove('hidden');
        formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        /* Limpiar formulario */
        form.reset();
        fields.forEach(f => f.classList.remove('valid', 'error'));

        showToast('¡Reservación confirmada exitosamente! 🎉', 'success');

        /* Ocultar mensaje de éxito tras 8 segundos */
        setTimeout(() => {
            formSuccess?.classList.add('hidden');
        }, 8000);
    });
}

/* ── Validar formulario completo ─────────────────────────────────── */
function validateForm() {
    const fieldsToValidate = [
        'nombre', 'telefono', 'personas', 'fecha', 'hora'
    ];
    let allValid = true;

    fieldsToValidate.forEach(id => {
        const field = document.getElementById(id);
        if (field && !validateField(field)) {
            allValid = false;
        }
    });

    /* Validar email solo si tiene contenido */
    const emailField = document.getElementById('email');
    if (emailField && emailField.value.trim()) {
        if (!validateField(emailField)) allValid = false;
    }

    return allValid;
}

/* ── Validar campo individual ────────────────────────────────────── */
function validateField(field) {
    const id    = field.id;
    const value = field.value.trim();
    let   error = '';

    switch (id) {
        case 'nombre':
            if (!value)           error = 'El nombre es requerido';
            else if (value.length < 3) error = 'El nombre debe tener al menos 3 caracteres';
            else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(value))
                error = 'El nombre solo puede contener letras';
            break;

        case 'telefono':
            const tel = value.replace(/[\s\-().+]/g, '');
            if (!value)            error = 'El teléfono es requerido';
            else if (!/^\d{7,15}$/.test(tel))
                error = 'Ingresa un número de teléfono válido (7-15 dígitos)';
            break;

        case 'personas':
            if (!value) error = 'Selecciona el número de personas';
            break;

        case 'fecha':
            if (!value) {
                error = 'La fecha es requerida';
            } else {
                const selected = new Date(value + 'T00:00:00');
                const today    = new Date();
                today.setHours(0, 0, 0, 0);
                if (selected < today) error = 'La fecha no puede ser en el pasado';
            }
            break;

        case 'hora':
            if (!value) error = 'Selecciona la hora de tu reservación';
            break;

        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                error = 'Ingresa un email válido';
            break;
    }

    /* Mostrar / limpiar error */
    if (error) {
        setFieldError(field, error);
        return false;
    } else {
        clearFieldError(field);
        field.classList.add('valid');
        return true;
    }
}

function setFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('valid');
    const errSpan = document.getElementById(
        `err${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`
    );
    if (errSpan) errSpan.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errSpan = document.getElementById(
        `err${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`
    );
    if (errSpan) errSpan.textContent = '';
}


/* ================================================================
   9. BOTÓN VOLVER ARRIBA
   ================================================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');

    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ================================================================
   10. BOTONES "ORDENAR" DE LAS TARJETAS
   ================================================================ */
function initOrderButtons() {
    const orderBtns = document.querySelectorAll('.btn-order');

    orderBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const card  = this.closest('.menu-card');
            const title = card?.querySelector('.card-title')?.textContent || 'platillo';
            const price = card?.querySelector('.card-price')?.firstChild?.textContent?.trim() || '';

            /* Micro-animación de confirmación */
            const original = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
            this.style.background = 'linear-gradient(135deg, #1E8449, #27AE60)';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = original;
                this.style.background = '';
                this.disabled = false;
            }, 2000);

            showToast(`🌮 ${title} ${price} MXN agregado al pedido`);
        });
    });
}


/* ================================================================
   11. NEWSLETTER
   ================================================================ */
function initNewsletter() {
    const btn   = document.getElementById('newsletterBtn');
    const input = document.getElementById('newsletterEmail');

    if (!btn || !input) return;

    btn.addEventListener('click', () => {
        const email = input.value.trim();

        if (!email) {
            showToast('Por favor ingresa tu email', 'error');
            input.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Ingresa un email válido', 'error');
            input.focus();
            return;
        }

        /* Éxito */
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'var(--verde-light)';
        input.value = '';

        showToast('¡Suscrito exitosamente! Recibirás nuestras ofertas 🎉', 'success');

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            btn.style.background = '';
        }, 3000);
    });

    /* Suscribir también con Enter */
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') btn.click();
    });
}


/* ================================================================
   12. SMOOTH SCROLL para links internos
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
        const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
});


/* ================================================================
   UTILIDADES
   ================================================================ */

/* Toast notification global */
function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className   = `toast show ${type}`;

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

/* Sleep helper */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* ================================================================
   PARALLAX SUAVE en el hero (mouse move) — solo desktop
   ================================================================ */
(function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    /* Solo activar si el dispositivo no tiene táctil */
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth  - 0.5) * 12;
            const y = (e.clientY / window.innerHeight - 0.5) * 8;
            heroBg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
        }, { passive: true });
    }
})();


/* ================================================================
   LAZY LOADING de imágenes con efecto fade-in
   ================================================================ */
(function initLazyImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
        img.style.opacity  = '0';
        img.style.transition = 'opacity .5s ease';

        function onLoad() {
            img.style.opacity = '1';
        }

        if (img.complete) {
            onLoad();
        } else {
            img.addEventListener('load',  onLoad);
            img.addEventListener('error', () => {
                /* Fallback: degradado con el color de la marca */
                img.style.opacity = '1';
                img.parentElement.style.background =
                    'linear-gradient(135deg, #C0392B22, #F39C1222)';
            });
        }
    });
})();


/* ================================================================
   INDICADOR DE PROGRESO DE SCROLL (barra en el top)
   ================================================================ */
(function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--rojo, #C0392B), var(--amarillo-light, #F1C40F));
        z-index: 9999;
        width: 0%;
        transition: width .1s linear;
        pointer-events: none;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width  = `${progress}%`;
    }, { passive: true });
})();
