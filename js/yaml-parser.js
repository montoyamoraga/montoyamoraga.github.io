const cvContent = document.getElementById('cv-content');
let cvData;
let cvLanguage;

if (cvContent) {
  window.addEventListener('DOMContentLoaded', loadCv);
  window.addEventListener('hashchange', () => {
    if (!cvData) return;
    cvContent.replaceChildren();
    renderCv(cvData, cvLanguage);
  });
}

async function loadCv() {
  const language = localStorage.getItem('language') || 'es';

  try {
    const cvResponse = await fetch('/cv/cv.yaml');
    if (!cvResponse.ok) throw new Error(`Could not load CV: ${cvResponse.status}`);

    const data = jsyaml.load(await cvResponse.text());
    cvData = data.cv;
    cvLanguage = language;
    renderCv(cvData, cvLanguage);
  } catch (error) {
    cvContent.textContent = 'No se pudo cargar el currículum.';
    console.error(error);
  }
}

function renderCv(cv, language) {
  const selectedCategory = window.location.hash.slice(1);

  Object.entries(cv).forEach(([key, value]) => {
    if (selectedCategory && key !== selectedCategory) return;

    const category = document.createElement('section');
    category.className = 'cv-category';
    category.id = key;

    const heading = document.createElement('h2');
    heading.textContent = formatLabel(key, language);
    category.appendChild(heading);
    renderValue(value, category, language);
    cvContent.appendChild(category);
  });
}

function renderValue(value, container, language, label) {
  if (value === null || value === undefined || value === false) return;

  if (isLocalizedValue(value)) {
    renderText(value[language] ?? value.es ?? value.en, container, label, language);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      const itemContainer = document.createElement('article');
      itemContainer.className = label === 'frecuencia'
        ? 'cv-frequency-item'
        : 'cv-item';
      renderValue(item, itemContainer, language);
      if (itemContainer.hasChildNodes()) container.appendChild(itemContainer);
    });
    return;
  }

  if (typeof value === 'object') {
    const section = document.createElement('section');
    section.className = 'cv-section';

    if (label) {
      const heading = document.createElement('h3');
      heading.textContent = formatLabel(label, language);
      section.appendChild(heading);
    }

    const hasSubcategories = Object.values(value).some((childValue) =>
      typeof childValue === 'object' && childValue !== null &&
      !Array.isArray(childValue) && !isLocalizedValue(childValue)
    );

    if (hasSubcategories) {
      Object.entries(value).forEach(([entryKey, entryValue]) => {
        const isSubcategory = typeof entryValue === 'object' &&
          entryValue !== null && !Array.isArray(entryValue) &&
          !isLocalizedValue(entryValue);

        if (isSubcategory) {
          const subcategory = document.createElement('article');
          subcategory.className = 'cv-item';
          renderValue(entryValue, subcategory, language, entryKey);
          section.appendChild(subcategory);
        } else {
          renderValue(entryValue, section, language, entryKey);
        }
      });
      container.appendChild(section);
      return;
    }

    Object.entries(value).forEach(([key, childValue]) => {
      renderValue(childValue, section, language, key);
    });

    if (section.childElementCount > (label ? 1 : 0)) container.appendChild(section);
    return;
  }

  const row = document.createElement('p');
  row.className = isYearLabel(label) ? 'cv-row cv-year-row' : 'cv-row';
  if (label) {
    const name = document.createElement('strong');
    name.textContent = `${formatLabel(label, language)}: `;
    row.appendChild(name);
  }
  row.appendChild(document.createTextNode(String(value)));
  container.appendChild(row);
}


function isLocalizedValue(value) {
  return typeof value === 'object' && value !== null &&
    !Array.isArray(value) && ('en' in value || 'es' in value);
}

function renderText(value, container, label, language) {
  if (value !== null && value !== undefined && value !== false) {
    const paragraph = document.createElement('p');
    paragraph.className = isYearLabel(label) ? 'cv-row cv-year-row' : 'cv-row';
    if (label) {
      const name = document.createElement('strong');
      name.textContent = `${formatLabel(label, language)}: `;
      paragraph.appendChild(name);
    }
    paragraph.appendChild(document.createTextNode(String(value)));
    container.appendChild(paragraph);
  }
}

function isYearLabel(label) {
  return typeof label === 'string' &&
    (label.includes('anho') || label.includes('fecha-anho'));
}

function formatLabel(label, language) {
  const labels = {
    'educacion-universitaria': { es: 'educación universitaria', en: 'university education' },
    'breve-resumen-trayectoria-academica': { es: 'breve resumen de trayectoria académica', en: 'brief summary of academic career' },
    'actividad-perfeccionamiento': { es: 'actividad de perfeccionamiento', en: 'professional development activity' },
    'docencia-universitaria': { es: 'docencia universitaria', en: 'university teaching' },
    'otros-cursos-dictados-en-pre-y-postgrado': { es: 'otros cursos dictados en pregrado y posgrado', en: 'other courses taught in undergraduate and graduate programs' },
    'otras-actividades-docentes-destacables': { es: 'otras actividades docentes destacables', en: 'other notable teaching activities' },
    'trayectoria-profesional': { es: 'trayectoria profesional', en: 'professional experience' },
    'becas': { es: 'becas', en: 'scholarships' },
    'premios-distinciones': { es: 'premios y distinciones', en: 'awards and honors' },
    'ayudantias': { es: 'ayudantías', en: 'teaching assistantships' },
    'postgrado': { es: 'posgrado', en: 'graduate' },
    'pregrado': { es: 'pregrado', en: 'undergraduate' },
    'magister-mit': { es: 'magíster MIT', en: 'MIT master’s' },
    'magister-nyu': { es: 'magíster NYU', en: 'NYU master’s' },
    'doctorado-usach': { es: 'doctorado USACH', en: 'USACH doctorate' },
    'titulo-profesional': { es: 'título profesional', en: 'professional degree' },
    'otros-estudios-de-perfeccionamiento': { es: 'otros estudios de perfeccionamiento', en: 'other professional development studies' },
    'fecha-anho-inicio': { es: 'año de inicio', en: 'start year' },
    'fecha-anho-fin': { es: 'año de término', en: 'end year' },
    'anho-inicio': { es: 'año de inicio', en: 'start year' },
    'anho-termino': { es: 'año de término', en: 'end year' },
    'anho-desde': { es: 'año desde', en: 'year from' },
    'anho-hasta': { es: 'año hasta', en: 'year to' },
    'nombre-institucion': { es: 'institución', en: 'institution' },
    'institucion': { es: 'institución', en: 'institution' },
    'pais': { es: 'país', en: 'country' },
    'grado': { es: 'grado académico', en: 'academic degree' },
    'detalle': { es: 'detalle', en: 'detail' },
    'rol': { es: 'rol', en: 'role' },
    'nombre': { es: 'nombre', en: 'name' },
    'frecuencia': { es: 'frecuencia', en: 'frequency' },
    'cantidad': { es: 'cantidad', en: 'amount' },
    'nivel': { es: 'nivel', en: 'level' },
    'programa': { es: 'programa', en: 'program' },
    'regimen': { es: 'régimen', en: 'program type' }
  };

  if (labels[label]) return labels[label][language] ?? labels[label].es;

  const fallback = label
    .replace(/-/g, ' ')
    .replace(/\banho\b/g, 'año')
    .replace(/\bano\b/g, 'año')
    .replace(/\binstitucion\b/g, 'institución')
    .replace(/\bpais\b/g, 'país')
    .replace(/\bpostgrado\b/g, 'posgrado')
    .replace(/\bmagister\b/g, 'magíster')
    .replace(/\beducacion\b/g, 'educación')
    .replace(/\bacademica\b/g, 'académica')
    .replace(/\bacademico\b/g, 'académico')
    .replace(/\bayudantias\b/g, 'ayudantías');

  return fallback;
}
