let english = document.getElementById('english');
let espanol = document.getElementById('espanol');

english.addEventListener('click', () => {
  changeLanguage('en');
});

espanol.addEventListener('click', () => {
  changeLanguage('es');
});

window.addEventListener('DOMContentLoaded', async () => {
  const lang = localStorage.getItem('language') || 'en';
  const langData = await fetchLanguageData(lang);
  updateContent(langData);
});

function updateContent(langData) {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    element.innerHTML = langData[key];
  });
}

function setLanguagePreference(lang) {
  localStorage.setItem('language', lang);
  location.reload();
}

async function fetchLanguageData(lang) {
  const response = await fetch(`languages/${lang}.json`);
  return response.json();
}

async function changeLanguage(lang) {
  await setLanguagePreference(lang);

  const langData = await fetchLanguageData(lang);
  updateContent(langData);
}
