// device detect
window._DETECT = $.fn.deviceDetector.getInfo();

// mode
window._MODE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.port === '9002') ? 'local' : (document.location.host === 'demo.relevant.ru') ? 'demo' : 'build';

// path to files
window._TEMPLATES_PATH = document.location.origin + '/templates/';
window._MARKERS_PATH = document.location.origin + '/images/';

