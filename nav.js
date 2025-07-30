let navbar = `
 <nav class="navegacion">
    <h3>
    <a href="./" id="english">en</a> /
    <a href="./" id="espanol">es</a>
    </h3>
    <h3><a href="/">home</a></h3>
    <h3><a href="/info">info</a></h3>
    <div>
    <h3 data-i18n="projects"></h3>
    <ol>
        <li data-i18n="projects-playa-fome-llamadas-telefonicas"></li>
    </ol>
    </div>
    <div>
    <h3 data-i18n="teaching"></h3>
    <h5 data-i18n="undergraduate-udp"></h5>
    <ol>
         <li>
        <a data-i18n="teaching-dis8645" href="/teaching/dis8645/"></a>
        </li>
        <li>
        <a data-i18n="teaching-dis8644" href="/teaching/dis8644/"></a>
        </li>
        <li>
        <a data-i18n="teaching-dis8636" href="/teaching/dis8636/"></a>
        </li>
        <li>
        <a data-i18n="teaching-dis8637" href="/teaching/dis8637"></a>
        </li>
        <li>
        <a data-i18n="teaching-dis9005" href="/teaching/dis9005"></a>
        </li>
        <li>
        <a data-i18n="teaching-dis9034" href="/teaching/dis9034"></a>
        </li>
    </ol>
    <h5 data-i18n="undergraduate-uchile"></h5>
    <ol>
        <li>
        <a data-i18n="teaching-aud10004" href="/teaching/aud10004"></a>
        </li>
        <li>
        <a data-i18n="teaching-aud20004" href="/teaching/aud20004"></a>
        </li>
        <li>
        <a data-i18n="teaching-aud5i022" href="/teaching/aud5i022"></a>
        </li>
        <li>
        <a data-i18n="teaching-audiv020" href="/teaching/audiv020"></a>
        </li>
        <li>
        <a data-i18n="teaching-audiv027" href="/teaching/audiv027"></a>
        </li>
    </ol>
    <h5 data-i18n="undergraduate-uai"></h5>
    <ol>
        <li>
        <a data-i18n="teaching-dis145" href="/teaching/dis145"></a>
        </li>
    </ol>
    </div>
    <div>
    <p data-i18n="archive"></p>
    <ol>
        <li>
        <a
            data-i18n="archive-power-supply"
            href="/archive/power-supply"
        ></a>
        </li>
    </ol>
    </div>
</nav>
`;

let divLeftMenu = document.getElementById('divLeftMenu');

divLeftMenu.insertAdjacentHTML('afterbegin', navbar);
