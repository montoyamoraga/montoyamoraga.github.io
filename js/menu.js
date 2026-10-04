// generado por scripts/generar-menu.js desde datos/menu.yaml, no editar a mano.
// el comportamiento del menú vive en js/nav.js, que se carga después de este archivo.

const navbar = `
<nav class="navegacion">
    <div class="nav-section">
        <h3 class="nav-brand"><a href="/">montoyamoraga</a></h3>
    </div>

    <div class="nav-section nav-idioma">
        <h3>
            <a href="#" id="english">en</a> /
            <a href="#" id="espanol">es</a>
        </h3>
        <button class="boton-piruetas nav-toggle" aria-expanded="false" aria-controls="divLeftMenu"><span class="es">menú</span><span class="en">menu</span></button>
    </div>

    <div class="nav-section">
        <h3 class="nav-titulo"><span class="es">proyectos</span><span class="en">projects</span></h3>
        <div class="nav-contenido">
            <h5>enumerar</h5>
            <ol>
                <li><a href="/proyectos/enumerar/its-ok-to-die-v0/">its-ok-to-die v0</a></li>
                <li><a href="/proyectos/enumerar/its-ok-to-die-v1/">its-ok-to-die v1</a></li>
                <li><a href="/proyectos/enumerar/cuantosdiasquedan.cl/">cuantosdiasquedan.cl</a></li>
            </ol>

            <h5>tamizar</h5>
            <ol>
                <li><a href="/proyectos/tamizar/bajos-de-mena/">bajos de mena</a></li>
                <li><a href="/proyectos/tamizar/alturas-de-alturas-de-macchu-picchu/">alturas de alturas de macchu picchu</a></li>
                <li><a href="/proyectos/tamizar/menatron/">menatron</a></li>
                <li><a href="/proyectos/tamizar/callese-hombre/">cállese hombre</a></li>
            </ol>

            <h5>caleidoscopar</h5>
            <ol>
                <li><a href="/proyectos/caleidoscopar/rube-telephone/">rube telephone</a></li>
                <li><a href="/proyectos/caleidoscopar/mil-rpm/">mil rpm</a></li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3 class="nav-titulo"><span class="es">enseñanza</span><span class="en">teaching</span></h3>
        <div class="nav-contenido">
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
        </div>
    </div>

    <div class="nav-section">
        <h3 class="nav-titulo"><span class="es">investigación</span><span class="en">research</span></h3>
        <div class="nav-contenido">
            <h5><span class="es">tesis</span><span class="en">theses</span></h5>
            <ol>
                <li><a href="/investigacion/popusintesintesis/">2026 - popusintesíntesis</a></li>
                <li><a href="/investigacion/tiny-trainable-instruments/">2021 - tiny trainable instruments</a></li>
                <li><a href="/investigacion/its-ok/">2017 - its-ok</a></li>
                <li><a href="/investigacion/simulador-pulmon/">2013 - simulador-pulmón</a></li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3 class="nav-titulo">performance</h3>
        <div class="nav-contenido">
            <ol>
                <li><span class="es">sin obras publicadas</span><span class="en">no published works</span></li>
            </ol>
        </div>
    </div>

    <div class="nav-section">
        <h3><a href="/cv/">cv</a></h3>
    </div>

    <div class="nav-section">
        <h3><a href="/enlaces/"><span class="es">enlaces</span><span class="en">links</span></a></h3>
    </div>

    <div class="nav-section">
        <h3><a href="/contacto/"><span class="es">contacto</span><span class="en">contact</span></a></h3>
    </div>
</nav>
`;
