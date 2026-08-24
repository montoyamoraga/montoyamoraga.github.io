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
    heading.textContent = formatLabel(key);
    category.appendChild(heading);
    renderValue(value, category, language);
    cvContent.appendChild(category);
  });
}

function renderValue(value, container, language, label) {
  if (value === null || value === undefined) return;

  if (isLocalizedValue(value)) {
    renderText(value[language] ?? value.es ?? value.en, container, label);
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
      heading.textContent = formatLabel(label);
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
    name.textContent = `${formatLabel(label)}: `;
    row.appendChild(name);
  }
  row.appendChild(document.createTextNode(String(value)));
  container.appendChild(row);
}


function isLocalizedValue(value) {
  return typeof value === 'object' && value !== null &&
    !Array.isArray(value) && ('en' in value || 'es' in value);
}

function renderText(value, container, label) {
  if (value !== null && value !== undefined) {
    const paragraph = document.createElement('p');
    paragraph.className = isYearLabel(label) ? 'cv-row cv-year-row' : 'cv-row';
    if (label) {
      const name = document.createElement('strong');
      name.textContent = `${formatLabel(label)}: `;
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

function formatLabel(label) {
  const labels = {
    'educacion-universitaria': 'educación universitaria',
    'breve-resumen-trayectoria-academica': 'breve resumen de trayectoria académica',
    'actividad-perfeccionamiento': 'actividad de perfeccionamiento',
    'docencia-universitaria': 'docencia universitaria',
    'otros-cursos-dictados-en-pre-y-postgrado': 'otros cursos dictados en pregrado y posgrado',
    'otras-actividades-docentes-destacables': 'otras actividades docentes destacables',
    'trayectoria-profesional': 'trayectoria profesional',
    'becas': 'becas',
    'premios-distinciones': 'premios y distinciones',
    'ayudantias': 'ayudantías',
    'postgrado': 'posgrado',
    'pregrado': 'pregrado',
    'magister-mit': 'magíster MIT',
    'magister-nyu': 'magíster NYU',
    'doctorado-usach': 'doctorado USACH',
    'titulo-profesional': 'título profesional',
    'otros-estudios-de-perfeccionamiento': 'otros estudios de perfeccionamiento',
    'fecha-anho-inicio': 'año de inicio',
    'fecha-anho-fin': 'año de término',
    'anho-inicio': 'año de inicio',
    'anho-termino': 'año de término',
    'anho-desde': 'año desde',
    'anho-hasta': 'año hasta',
    'nombre-institucion': 'institución',
    'institucion': 'institución',
    'pais': 'país',
    'grado': 'grado académico',
    'detalle': 'detalle',
    'rol': 'rol',
    'nombre': 'nombre',
    'frecuencia': 'frecuencia',
    'cantidad': 'cantidad',
    'nivel': 'nivel',
    'programa': 'programa',
    'regimen': 'régimen'
  };

  if (labels[label]) return labels[label];

  return label
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
}
