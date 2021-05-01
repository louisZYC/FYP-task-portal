'use strict';

import WebApi from '../classes/WebApi.js';
import portalApp from '../classes/portalApp.js';

window.aboutus = new Vue({
    el: '#page-about-us',
    data: {
        test:"abc"

    },
    mounted() {
        portalApp.addComponent(this)
    }
})