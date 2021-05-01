import i18n from '../classes/i18n.js'
import portalApp from '../classes/portalApp.js'
import keywordCollector from '../classes/keywordCollector.js'


window.portalApp = Vue.observable(portalApp);
window.i18n = Vue.observable(i18n);
window.keywordCollector = Vue.observable(keywordCollector);

window.addEventListener('DOMContentLoaded', () => {
    import('./portal-header.js')
    import('./portal-navigate.js')
    import('./portal-search.js')
    import('./portal-about-us.js')
});

i18n.init()