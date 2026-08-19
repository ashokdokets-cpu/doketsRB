// Multi-Language Support System - Clean Version
var DoketsI18n = {
  currentLanguage: 'en',
  translations: {
    en: {
      app_name: 'Dokets Resume Builder',
      builder: 'Resume Builder',
      templates: 'Templates',
      export: 'Export',
      save: 'Save',
      download: 'Download',
      preview: 'Preview',
      edit: 'Edit',
      delete: 'Delete',
      personal_info: 'Personal Information',
      full_name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      summary: 'Professional Summary',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      company: 'Company',
      job_title: 'Job Title',
      export_pdf: 'Export as PDF',
      export_docx: 'Export as DOCX',
      print: 'Print',
      ats_score: 'ATS Score',
      upgrade: 'Upgrade to Pro',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      settings: 'Settings',
      profile: 'Profile'
    },
    es: {
      app_name: 'Dokets Constructor de CV',
      builder: 'Constructor de CV',
      templates: 'Plantillas',
      export: 'Exportar',
      save: 'Guardar',
      download: 'Descargar',
      preview: 'Vista Previa',
      edit: 'Editar',
      delete: 'Eliminar',
      personal_info: 'Informacion Personal',
      full_name: 'Nombre Completo',
      email: 'Correo Electronico',
      phone: 'Telefono',
      location: 'Ubicacion',
      summary: 'Resumen Profesional',
      experience: 'Experiencia Laboral',
      education: 'Educacion',
      skills: 'Habilidades',
      company: 'Empresa',
      job_title: 'Titulo del Puesto',
      export_pdf: 'Exportar como PDF',
      export_docx: 'Exportar como DOCX',
      print: 'Imprimir',
      ats_score: 'Puntuacion ATS',
      upgrade: 'Actualizar a Pro',
      login: 'Iniciar Sesion',
      signup: 'Registrarse',
      logout: 'Cerrar Sesion',
      settings: 'Configuracion',
      profile: 'Perfil'
    },
    hi: {
      app_name: 'Dokets Resume Builder',
      builder: 'Resume Builder',
      templates: 'Templates',
      export: 'Export',
      save: 'Save Karein',
      download: 'Download',
      preview: 'Preview',
      edit: 'Edit',
      delete: 'Delete',
      personal_info: 'Vyaktigat Jankari',
      full_name: 'Poora Naam',
      email: 'Email',
      phone: 'Phone',
      location: 'Sthan',
      summary: 'Professional Saransh',
      experience: 'Karya Anubhav',
      education: 'Shiksha',
      skills: 'Kaushal',
      company: 'Company',
      job_title: 'Pad ka Naam',
      export_pdf: 'PDF export karein',
      export_docx: 'DOCX export karein',
      print: 'Print',
      ats_score: 'ATS Score',
      upgrade: 'Pro upgrade karein',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      settings: 'Settings',
      profile: 'Profile'
    }
  },
  t: function(key) {
    var lang = this.translations[this.currentLanguage] || this.translations.en;
    return lang[key] || this.translations.en[key] || key;
  },
  setLanguage: function(lang) {
    if (!this.translations[lang]) return false;
    this.currentLanguage = lang;
    localStorage.setItem('dokets_language', lang);
    if (lang === 'ar') { document.documentElement.dir = 'rtl'; document.body.style.direction = 'rtl'; }
    else { document.documentElement.dir = 'ltr'; document.body.style.direction = 'ltr'; }
    this.translatePage();
    return true;
  },
  translatePage: function() {
    var lang = this.currentLanguage;
    if (lang === 'en') return;
    var trans = this.translations[lang];
    if (!trans) return;
    var en = this.translations.en;
    document.querySelectorAll('button, a, h1, h2, h3, label, span, p, option').forEach(function(el) {
      var text = el.textContent.trim();
      if (text && text.length < 60) {
        for (var key in en) {
          if (en[key] === text) {
            el.textContent = trans[key] || en[key];
            break;
          }
        }
      }
    });
    document.title = trans.app_name || 'Dokets Resume Builder';
  },
  init: function() {
    var saved = localStorage.getItem('dokets_language');
    if (saved && this.translations[saved]) { this.currentLanguage = saved; }
    else {
      var browserLang = (navigator.language || 'en').split('-')[0];
      if (this.translations[browserLang]) { this.currentLanguage = browserLang; }
    }
    this.setLanguage(this.currentLanguage);
  }
};
window.DoketsI18n = DoketsI18n;
window.__ = function(key) { return DoketsI18n.t(key); };
window.changeLanguage = function(lang) {
  if (lang === 'en') { return; }
  window.open('https://translate.google.com/translate?hl=' + lang + '&sl=auto&tl=' + lang + '&u=' + encodeURIComponent(window.location.href), '_blank');
};
setTimeout(function() { DoketsI18n.init(); }, 100);
