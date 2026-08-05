let english = document.getElementById('english');
let espanol = document.getElementById('espanol');

if (english) {
  english.addEventListener('click', () => {
    changeLanguage('en');
  });
}

if (espanol) {
  espanol.addEventListener('click', () => {
    changeLanguage('es');
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const lang = localStorage.getItem('language') || 'en';
  const textData = await fetchTextData();
  updateContent(textData, lang);
});

function updateContent(textData, lang) {
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (textData[key]) {
      element.innerHTML = textData[key][lang];
    }
  });
  document.querySelectorAll('[data-link]').forEach((element) => {
    const key = element.getAttribute('data-link');
    if (textData[key]) {
      element.href = textData[key][lang];
    }
  });
  document.querySelectorAll('[data-image]').forEach((element) => {
    const key = element.getAttribute('data-image');
    if (textData[key]) {
      element.src = textData[key][lang];
    }
  });
}

function setLanguagePreference(lang) {
  localStorage.setItem('language', lang);
  location.reload();
}

async function fetchTextData() {
  const response = await fetch('/text/text.yml');
  const yamlText = await response.text();
  return jsyaml.load(yamlText);
}

function changeLanguage(lang) {
  setLanguagePreference(lang);
}
