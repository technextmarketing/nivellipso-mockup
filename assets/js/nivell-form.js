// nivellipso® Formulare — Sprachumschalter + Druck (für alle Dokumente)
(function () {
  function setLang(lang) {
    document.querySelectorAll('.lang-section').forEach(function (s) {
      s.classList.toggle('active', s.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('.lang-pill').forEach(function (p) {
      p.classList.toggle('active', p.getAttribute('data-lang') === lang);
    });
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('nivell_form_lang', lang); } catch (e) {}
  }
  window.nivellSetFormLang = setLang;
  window.nivellPrint = function () { window.print(); };
  document.addEventListener('DOMContentLoaded', function () {
    var saved = 'de';
    try { saved = localStorage.getItem('nivell_form_lang') || 'de'; } catch (e) {}
    if (!document.querySelector('.lang-section[data-lang="' + saved + '"]')) saved = 'de';
    setLang(saved);
    document.querySelectorAll('.lang-pill').forEach(function (p) {
      p.addEventListener('click', function () { setLang(p.getAttribute('data-lang')); });
    });
  });
})();
