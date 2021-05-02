'use strict';
import portalApp from '../classes/portalApp.js'
import i18n from '../classes/i18n.js'

window.header = new Vue({
    el: '#header',
    methods: {
        changeLanguage(name) {
            i18n.use(name)
        },
        changeFontSize(level){
            document.querySelector(':root').style.setProperty('--font-size', `${level}rem`)
        },
        colorVersion(){
            window.location = './color.php'
        },
        textVersion(){
            window.location = './index.php'
        }
    },
    mounted() {
        portalApp.addComponent(this);
    }
})