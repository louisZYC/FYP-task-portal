'use strict'

import WebApi from './WebApi.js'

const keywordCollector = {
    content: "香港西營盤高街2號西營盤社區綜合大樓3字樓",
    ref: [],
    priority: 1,

    new(content) {
        this.content = content
        this.ref = []
    },

    pushId(id) {
        this.ref.push({
            id,
            priority: this.priority
        })
        this.priority++
    },

    async commit() {
        if (!this.content || this.ref.length == 0) return

        const json = {
            content: this.content,
            ref: this.ref
        }

        const response = await WebApi.postData('/api/keyword/add', JSON.stringify(json))
        console.log("keywordCotroller commit()")
        return response
    },

    getContent() {
        return this.content;
    },

    getRef() {
        return this.ref
    }
}

export default keywordCollector;