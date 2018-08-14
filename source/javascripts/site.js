if (navigator.language === 'fr' && !window.location.pathname.match(/\/fr.*/)) {
  window.location.href = '/fr';
}
