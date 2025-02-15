// Forcer le mode dark
document.documentElement.classList.add('dark');
localStorage.theme = 'dark';

// Suppression des éléments inutiles liés au mode light
function setDarkTheme() {
    document.documentElement.classList.add("dark");
    localStorage.theme = 'dark';
    $('#dark_theme').addClass('active');
};

// Initialisation du mode dark par défaut
$('#dark_theme').addClass('active');

// Suppression des gestionnaires d'événements inutiles
