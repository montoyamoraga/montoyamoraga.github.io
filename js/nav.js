let navbar = `
<nav class="navegacion">
    <div class="nav-section">
        <h3>
            <a href="#" id="english">en</a> /
            <a href="#" id="espanol">es</a>
        </h3>
    </div>

    <div class="nav-section">
        <h3 class="dropdown-trigger">enseñanza</h3>
        <div class="dropdown-content" style="padding-left:15px;">

            <h5 data-i18n="undergraduate-udp"></h5>
            <ol>
                <li><a data-i18n="teaching-dis9079" href="/teaching/dis9079/"></a></li>
                <li><a data-i18n="teaching-dis09214" href="/teaching/dis09214/"></a></li>
                <li><a data-i18n="teaching-dis8645" href="/teaching/dis8645/"></a></li>
                <li><a data-i18n="teaching-dis8644" href="/teaching/dis8644/"></a></li>
                <li><a data-i18n="teaching-dis8637" href="/teaching/dis8637/"></a></li>
                <li><a data-i18n="teaching-dis8636" href="/teaching/dis8636/"></a></li>
                <li><a data-i18n="teaching-dis9005" href="/teaching/dis9005/"></a></li>
                <li><a data-i18n="teaching-dis9034" href="/teaching/dis9034/"></a></li>
            </ol>

            <h5 data-i18n="undergraduate-uchile"></h5>
            <ol>
                <li><a data-i18n="teaching-audiv027" href="/teaching/audiv027/"></a></li>
                <li><a data-i18n="teaching-audiv020" href="/teaching/audiv020/"></a></li>
                <li><a data-i18n="teaching-aud5i022" href="/teaching/aud5i022/"></a></li>
                <li><a data-i18n="teaching-aud10004" href="/teaching/aud10004/"></a></li>
                <li><a data-i18n="teaching-aud20004" href="/teaching/aud20004/"></a></li>
            </ol>

            <h5 data-i18n="undergraduate-uai"></h5>
            <ol>
                <li><a data-i18n="teaching-dis145" href="/teaching/dis145/"></a></li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3 class="dropdown-trigger">investigación</h3>
        <div class="dropdown-content" style="padding-left:15px;">
            <ol>
                <li>sin proyectos publicados</li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3 class="dropdown-trigger">performance</h3>
        <div class="dropdown-content" style="padding-left:15px;">
            <ol>
                <li>sin obras publicadas</li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3 class="dropdown-trigger">cv</h3>
        <div class="dropdown-content cv-menu" style="padding-left:15px;">
            <ol>
                <li><a href="/cv/#educacion-universitaria">educacion-universitaria</a></li>
                <li><a href="/cv/#breve-resumen-trayectoria-academica">breve-resumen-trayectoria-academica</a></li>
                <li><a href="/cv/#actividad-perfeccionamiento">actividad-perfeccionamiento</a></li>
                <li><a href="/cv/#docencia-universitaria">docencia-universitaria</a></li>
                <li><a href="/cv/#otros-cursos-dictados-en-pre-y-postgrado">otros-cursos-dictados-en-pre-y-postgrado</a></li>
                <li><a href="/cv/#otras-actividades-docentes-destacables">otras-actividades-docentes-destacables</a></li>
                <li><a href="/cv/#trayectoria-profesional">trayectoria-profesional</a></li>
                <li><a href="/cv/#becas">becas</a></li>
                <li><a href="/cv/#premios-distinciones">premios-distinciones</a></li>
                <li><a href="/cv/#ayudantias">ayudantias</a></li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3><a href="/enlaces/">enlaces</a></h3>
    </div>

    <div class="nav-section">
        <h3><a href="/contacto/">contacto</a></h3>
    </div>
</nav>
`;

let divLeftMenu = document.getElementById('divLeftMenu');
if (divLeftMenu) {
    divLeftMenu.innerHTML = navbar;
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

const currentPath = normalizePath(window.location.pathname);

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
        const dropdownContent = link.closest('.dropdown-content');
        if (dropdownContent) {
            const trigger = dropdownContent.previousElementSibling;
            if (trigger && trigger.classList.contains('dropdown-trigger')) {
                trigger.classList.add('nav-active');
            }
        }
    }
});

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