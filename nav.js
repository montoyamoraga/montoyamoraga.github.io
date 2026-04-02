let navbar = `
<nav class="navegacion">
    <div class="nav-section">
        <h3>
            <a href="#" id="english">en</a> /
            <a href="#" id="espanol">es</a>
        </h3>
    </div>

    <div class="nav-section">
        <h3 class="dropdown-trigger" style="cursor:pointer; text-decoration:underline;">enseñanza</h3>
        <div class="dropdown-content" style="display:none; padding-left:15px;">
            
            <h5 data-i18n="undergraduate-udp"></h5>
            <ol>
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
        <h3 class="dropdown-trigger" style="cursor:pointer; text-decoration:underline;">investigación</h3>
        <div class="dropdown-content" style="display:none; padding-left:15px;">
            <ol>
                <li><a href="#">proyecto 1</a></li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3 class="dropdown-trigger" style="cursor:pointer; text-decoration:underline;">performance</h3>
        <div class="dropdown-content" style="display:none; padding-left:15px;">
            <ol>
                <li><a href="#">obra 1</a></li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3><a href="/enlaces">enlaces</a></h3>
    </div>

    <div class="nav-section">
        <h3><a href="/contacto">contacto</a></h3>
    </div>
</nav>
`;

let divLeftMenu = document.getElementById('divLeftMenu');
if (divLeftMenu) {
    divLeftMenu.innerHTML = navbar;
}

document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        const isOpen = content.style.display === 'block';
        document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
        content.style.display = isOpen ? 'none' : 'block';
    });
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