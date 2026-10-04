// el HTML del menú (navbar) viene de js/menu.js, generado por scripts/generar-menu.js
let divLeftMenu = document.getElementById('divLeftMenu');
if (divLeftMenu) {
    divLeftMenu.innerHTML = navbar;

    // en pantallas angostas el menú parte cerrado y se abre con este botón
    const navToggle = divLeftMenu.querySelector('.nav-toggle');
    navToggle.addEventListener('click', () => {
        const abierto = divLeftMenu.classList.toggle('abierto');
        navToggle.setAttribute('aria-expanded', String(abierto));
    });
}

let colophonYear = new Date().getFullYear();
let colophon = `
<span class="es">montoyamoraga © ${colophonYear}</span>
<span class="en">montoyamoraga © ${colophonYear}</span>
`;

let footerEl = document.querySelector('.colophon-banner');
if (footerEl) {
    footerEl.innerHTML = colophon;
}

function normalizePath(path) {
    if (!path) return window.location.pathname;
    return path.replace(/index\.html$/, '').replace(/\/+$/, '/') || '/';
}

function markActiveLinks() {
    const currentPath = normalizePath(window.location.pathname);

    document.querySelectorAll('#divLeftMenu a.nav-active').forEach(link => {
        link.classList.remove('nav-active');
    });
    document.querySelectorAll('#divLeftMenu h3.nav-titulo.nav-active').forEach(trigger => {
        trigger.classList.remove('nav-active');
    });

    document.querySelectorAll('#divLeftMenu a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const [hrefPath, hrefHash] = href.split('#');
        const linkPath = normalizePath(hrefPath);
        const samePage = linkPath === currentPath;
        const sameHash = !hrefHash || `#${hrefHash}` === window.location.hash;

        if (samePage && sameHash) {
            link.classList.add('nav-active');
        }

        if (samePage) {
            const contenido = link.closest('.nav-contenido');
            if (contenido) {
                const titulo = contenido.previousElementSibling;
                if (titulo && titulo.classList.contains('nav-titulo')) {
                    titulo.classList.add('nav-active');
                }
            }
        }
    });
}

markActiveLinks();
window.addEventListener('hashchange', markActiveLinks);

window.addEventListener('scroll', function() {
    const footer = document.querySelector('.colophon-banner');
    if (footer) {
        if (window.scrollY > 50) {
            footer.classList.add('visible');
        } else {
            footer.classList.remove('visible');
        }
    }
});

function detectImageOrientation() {
    const track = document.querySelector('.img-track');
    if (!track) return;

    const images = Array.from(track.querySelectorAll('img[src]'));
    if (images.length === 0) return;

    const buildSlides = () => {
        track.innerHTML = '';
        let i = 0;
        while (i < images.length) {
            const img = images[i];
            const isHorizontal = img.naturalWidth > img.naturalHeight;
            const nextImg = images[i + 1];
            const nextIsHorizontal = nextImg && nextImg.naturalWidth > nextImg.naturalHeight;

            if (isHorizontal && nextIsHorizontal) {
                const pair = document.createElement('div');
                pair.className = 'img-slide-pair';
                pair.appendChild(img);
                pair.appendChild(nextImg);
                track.appendChild(pair);
                i += 2;
            } else if (isHorizontal) {
                const slide = document.createElement('div');
                slide.className = 'img-slide-single-horizontal';
                slide.appendChild(img);
                track.appendChild(slide);
                i += 1;
            } else {
                const slide = document.createElement('div');
                slide.className = 'img-slide-single';
                slide.appendChild(img);
                track.appendChild(slide);
                i += 1;
            }
        }
    };

    let loaded = 0;
    images.forEach(img => {
        const onLoad = () => {
            loaded++;
            if (loaded === images.length) buildSlides();
        };
        if (img.complete && img.naturalWidth > 0) {
            onLoad();
        } else {
            img.addEventListener('load', onLoad);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    detectImageOrientation();

    if (document.querySelector('.split-layout')) {
        const footer = document.querySelector('.colophon-banner');
        if (footer) footer.classList.add('visible');
    }
});