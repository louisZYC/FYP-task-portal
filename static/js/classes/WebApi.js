'use strict';

var loc =
    import.meta.url;
loc = loc.substring(0, loc.indexOf('static') - 1);

const WebAPI = {

    _getData: async function (url = '', data = {}) {

        const params = new URLSearchParams()
        for (let key in data) {
            params.append(key, data[key])
        }

        const query = params.toString() ? '?' + params.toString() : ""

        const final_url = loc + url + query;
        const response = await fetch(final_url, {
            method: 'GET', // GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, omit
            keepalive: true
        })
        return response;
    },

    _sendRawData: async function (method, url = '', data = '') {

        const final_url = loc + url;

        const response = await fetch(final_url, {
            method,
            cache: 'no-cache',
            credentials: 'include', // include cookie
            headers: {
                // 'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
        return response
    },

    postData: async function (url='',data='') {
        return await this._sendRawData('POST',url,data)
    },

    fetchText: async function (url = '', data = {}) {
        const response = await this._getData(url, data)
        return response.text()
    },

    fetchJson: async function (url = '', data = {}) {
        const response = await this._getData(url, data)
        return response.json()
    }
}

export default WebAPI