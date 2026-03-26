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
                <li><a data-i18n="teaching-dis8636" href="/teaching/dis8636/"></a></li>
                <li><a data-i18n="teaching-dis8637" href="/teaching/dis8637"></a></li>
            </ol>
            <h5 data-i18n="undergraduate-uchile"></h5>
            <ol>
                <li><a data-i18n="teaching-audiv020" href="/teaching/audiv020"></a></li>
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
divLeftMenu.innerHTML = navbar;

// Lógica para abrir/cerrar desplegables
document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        const isOpen = content.style.display === 'block';
        
        // Opcional: cierra otros antes de abrir este
        document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
        
        content.style.display = isOpen ? 'none' : 'block';
    });
});