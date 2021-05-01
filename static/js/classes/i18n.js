'use strict'

import WebApi from './WebApi.js'


window.usingLang = '';
window.lang = {};

const i18n = {
    supportedLanguages: {
        zh: "中文",
        en: "English"
    },

    languages: { //fetch from json file

    },


    components: [],

    addComponent: function (c) {
        this.components.push(c);
        // c.$forceUpdate();
    },

    removeComponent: function (c) {
        var index = this.components.indexOf(c);
        if (index !== -1) {
            this.components.splice(index, 1);
        }
        // c.$forceUpdate();
    },

    init: async function () {
        await this.load('zh');
        await this.load('en');

        await this.use('zh');
        return
    },

    load: async function (name) {
        this.languages[name] = await WebApi.fetchJson(`/data/lang/${name}.json`)
    },

    use: async function (name) {
        if (this.supportedLanguages[name] == undefined) {
            await this.load(name);
        }

        const defaultLang = Object.assign({}, this.languages['zh'])
        const newLang = this.languages[name]
        window.usingLang = name;
        window.lang = Object.assign(defaultLang, newLang)

        this.components.forEach(c => {
            // c.updateTrigger++;
            c.$forceUpdate();
        });
    },

    t: function (obj, key) {
        var rtn = obj[key]
        if (!rtn) {
            for (let lan in this.languages) {
                rtn = obj[lan]
                if (rtn) break;
            }
        }
        return rtn
    }
}

export default i18n;