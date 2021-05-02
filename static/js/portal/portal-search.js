'use strict';

import WebApi from '../classes/WebApi.js';
import portalApp from '../classes/portalApp.js';
import keywordCollector from '../classes/keywordCollector.js';

Vue.component('page-search-service-component', {
    props: ["service"],
    methods: {
        serviceOnClicked() {
            this.$emit('onclicked', this.service)
        }
    },
    mounted() {
        portalApp.addComponent(this)
    },
    template: "#page-search-service-component"
})


Vue.component('page-search-keyword-span', {
    props: ["keyword"],
    methods: {
        keywordOnClicked() {
            this.$emit('onclicked', this.keyword)
        }
    },
    mounted() {
        portalApp.addComponent(this)
    },
    template: "#page-search-keyword-span"
})

window.search = new Vue({
    el: '#page-search',
    async created() {
        this.result_services_db = await WebApi.fetchJson('/data/ngoinfo/services/services.json')
        await this.reload();
    },
    data: {
        keyword: "香港西營盤高街2號西營盤社區綜合大樓3字樓",
        result_services_db: [],
        result_services: [],
        result_keywords: [],
        showingSection: 1,
        breadcrumbStack: [],
        selectedService: null
    },
    methods: {
        async reload() {
            await WebApi._getData('/api/keyword/update');
            this.result_keywords = await WebApi.fetchJson('/api/keyword/get');
        },
        kPageLeaveEvent() {
            this.keyword = ''
            this.showingSection = 1
            this.breadcrumbStack.splice(1)
        },
        async search() {
            if (this.showingSection != 1) return
            await keywordCollector.commit()
            this.showingSection = 2

            const json = {
                keyword: this.keyword
            }

            const result = await WebApi.postData('/api/service/search', JSON.stringify(json));
            this.result_services = await result.json()

            this.breadcrumbStack.push({
                name: {
                    zh: this.keyword
                },
                sectionId: 2
            })

            keywordCollector.new(this.keyword);
            this.keyword = ''
        },
        serviceOnSelected(service) {
            if (this.showingSection != 2) return
            this.showingSection = 3

            this.selectedService = service
            this.breadcrumbStack.push({
                name: service.nosu,
                sectionId: 2
            })

            keywordCollector.pushId(service.uuid)
        },
        keywordOnClicked(keyword) {
            if (this.showingSection != 1) return
            this.showingSection = 2
            this.result_services = []

            this.breadcrumbStack.push({
                name: {
                    zh: keyword.name
                },
                sectionId: 2
            })

            const keywordRef = this.result_keywords.keywordref
                .filter(kr => {
                    return kr.kw_id == keyword.kw_id
                })
                .sort((a, b) => {
                    return a.score - b.score > 0 ? -1 : 1
                })

            keywordRef.forEach(kr => {
                const result = this.result_services_db.find(service => service.uuid == kr.service_id)
                this.result_services.push(result)
            });

        },
        async breadcrumbOnClicked(obj) {
            if (obj.sectionId == 1) {
                await keywordCollector.commit()
                await this.reload()
            }
            this.showingSection = obj.sectionId;
            // console.log(this.breadcrumbStack.indexOf(obj))
            this.breadcrumbStack.splice(this.breadcrumbStack.indexOf(obj) + 1)
        }
    },
    mounted() {
        portalApp.addComponent(this)
        this.breadcrumbStack.push({
            name: {
                zh: "首頁",
                en: "Home"
            },
            sectionId: 1
        })
    }
})