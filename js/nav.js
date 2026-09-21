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
            <!-- ENSEÑANZA:GENERADO:INICIO (no editar a mano — ver scripts/generar-ensenanza.js y datos/ensenanza.yaml) -->
            <h5><span class="es">pregrado - universidad diego portales</span><span class="en">undergraduate - universidad diego portales</span></h5>
            <ol>
                <li><a href="/ensenanza/dis9079/"><span class="es">dis9079 - interacciones inalámbricas</span><span class="en">dis9079 - wireless interaction design</span></a></li>
                <li><a href="/ensenanza/dis09214/"><span class="es">dis09214 - pensamiento computacional</span><span class="en">dis09214 - computational thinking</span></a></li>
                <li><a href="/ensenanza/dis8645/"><span class="es">dis8645 - taller de diseño de máquinas computacionales</span><span class="en">dis8645 - studio of computational machines design</span></a></li>
                <li><a href="/ensenanza/dis8644/"><span class="es">dis8644 - taller de diseño de máquinas electrónicas</span><span class="en">dis8644 - studio of electronic machines design</span></a></li>
                <li><a href="/ensenanza/dis8637/"><span class="es">dis8637 - taller de experiencia de usuario</span><span class="en">dis8637 - studio of user experience</span></a></li>
                <li><a href="/ensenanza/dis8636/"><span class="es">dis8636 - taller de interfaz de usuario</span><span class="en">dis8636 - studio of user interfaces</span></a></li>
                <li><a href="/ensenanza/dis9005/"><span class="es">dis9005 - diseño de página web</span><span class="en">dis9005 - web design</span></a></li>
                <li><a href="/ensenanza/dis9034/"><span class="es">dis9034 - programación creativa multimedia</span><span class="en">dis9034 - creative multimedia programming</span></a></li>
            </ol>

            <h5><span class="es">pregrado - universidad de chile</span><span class="en">undergraduate - universidad de chile</span></h5>
            <ol>
                <li><a href="/ensenanza/audiv027/"><span class="es">audiv027 - inteligencia artificial</span><span class="en">audiv027 - artificial intelligence</span></a></li>
                <li><a href="/ensenanza/audiv020/"><span class="es">audiv020 - diseño de instrumentos musicales digitales</span><span class="en">audiv020 - design of digital musical instruments</span></a></li>
                <li><a href="/ensenanza/aud5i022/"><span class="es">aud5i022 - diseño de interfaces electrónicas</span><span class="en">aud5i022 - design of electronic interfaces</span></a></li>
                <li><a href="/ensenanza/aud10004/"><span class="es">aud10004 - matemáticas aplicadas al diseño</span><span class="en">aud10004 - math for designers</span></a></li>
                <li><a href="/ensenanza/aud20004/"><span class="es">aud20004 - física aplicada al diseño</span><span class="en">aud20004 - physics for designers</span></a></li>
            </ol>

            <h5><span class="es">pregrado - universidad adolfo ibáñez</span><span class="en">undergraduate - universidad adolfo ibáñez</span></h5>
            <ol>
                <li><a href="/ensenanza/dis145/"><span class="es">dis145 - diseño y construcción de interfaces</span><span class="en">dis145 - design and construction of interfaces</span></a></li>
            </ol>
            <!-- ENSEÑANZA:GENERADO:FIN -->
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