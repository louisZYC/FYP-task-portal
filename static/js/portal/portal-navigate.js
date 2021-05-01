'use strict';

import WebApi from '../classes/WebApi.js';
import portalApp from '../classes/portalApp.js'
import keywordCollector from '../classes/keywordCollector.js';

Vue.component('group-list-item', {
    props: ['group'],
    methods: {
        groupOnClicked() {
            this.$emit('onclicked', this.group)
        }
    },
    mounted() {
        portalApp.addComponent(this)
    },
    template: '#group-list-item'
})

Vue.component('service-component', {
    props: ["service"],
    mounted() {
        portalApp.addComponent(this)
    },
    template: "#service-component"
})

Vue.component('breadcrumb-item', {
    props: ['obj'],
    methods: {
        async onclicked() {
            if (this.obj.sectionId == 1 && portalApp.showingPage == 'search') {
                await keywordCollector.commit()
                await window.search.reload();
            }
            this.$emit('onclicked', this.obj)
        }
    },
    mounted() {
        portalApp.addComponent(this)
    },
    template: '#breadcrumb-item'
})

window.navigate = new Vue({
    el: '#page-navigate',
    created: async function () {
        var bigGroupList_temp = [];
        await Promise.all(
            [
                new Promise(async (resolve, reject) => {
                    const rawResult = await WebApi.fetchText('/data/ngoinfo/metadata/districts.json')
                    this.districtList = JSON.parse(rawResult)
                    resolve()
                }),
                new Promise(async (resolve, reject) => {
                    const rawResult = await WebApi.fetchText('/data/ngoinfo/metadata/bigGroups.json')
                    bigGroupList_temp = JSON.parse(rawResult)
                    resolve()
                }),
                new Promise(async (resolve, reject) => {
                    const rawResult = await WebApi.fetchText('/data/ngoinfo/services/services.json')
                    this.servicesList = JSON.parse(rawResult)
                    resolve()
                })
            ]
        )

        bigGroupList_temp = bigGroupList_temp.sort(function (a, b) {
            if (a.name['en'] < b.name['en']) return -1;
            return 1;
        })

        this.bigGroupList = bigGroupList_temp.reduce((acc, cur) => {
            const { href, name } = cur
            if (acc.length == 0) {
                acc.push({
                    name: name,
                    href: [href]
                })
                return acc
            }

            const target = acc[acc.length - 1]
            if (target.name.en == name.en) {
                target.href.push(href)
                return acc
            }

            if (target.name.en != name.en) {
                acc.push({
                    name: name,
                    href: [href]
                })
                return acc
            }
        }, [])
    },
    data: {
        showingSection: 1,

        districtList: [],
        bigGroupList: [],
        servicesList: [],

        breadcrumbStack: [],
        selectedGroup: {},
        selectedDistrict: {},

        result_services: [],
        result_services_section3: [],
    },
    methods: {
        groupOnSelected: function (group) {
            if (this.showingSection != 1) return
            this.showingSection = 2;
            this.result_services = []

            this.breadcrumbStack.push({
                name: group.name,
                sectionId: 2
            })
            this.selectedGroup = Object.assign(group)

            console.time("filter")
            for (let i = 0; i < this.servicesList.length; i++) {
                const service = this.servicesList[i];
                for (let i = 0; i < this.selectedGroup.href.length; i++) {
                    const targetHref = this.selectedGroup.href[i];
                    if (service.href.includes(targetHref)) {
                        this.result_services.push(service)
                    }
                }
            }
            console.timeEnd("filter")
        },
        breadcrumbOnClicked(obj) {
            this.showingSection = obj.sectionId;
            // console.log(this.breadcrumbStack.indexOf(obj))
            this.breadcrumbStack.splice(this.breadcrumbStack.indexOf(obj) + 1)
        },
        changeDistrict(e) {
            if (this.showingSection != 2) return
            this.showingSection = 3

            const district = JSON.parse(e.target.value)
            this.selectedDistrict = district;
            this.breadcrumbStack.push({
                name: district.name,
                sectionId: 3
            })

            this.result_services_section3 = this.result_services.filter((service) => { //anonymous function important
                if (service.href.includes(this.selectedDistrict.href))
                    return true
                return false
            })

        },
        kPageLeaveEvent() {
            this.showingSection = 1
            this.breadcrumbStack.splice(1)
            // 
            this.selectedGroup = {}
            this.selectedDistrict = {}
            this.result_services.splice(0)
            this.result_services_section3.splice(0)
        }
    },
    mounted: function () {
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