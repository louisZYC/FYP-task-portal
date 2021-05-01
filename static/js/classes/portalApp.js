import i18n from './i18n.js'

const portalApp = {
    showingPage: 'search',
    components: [],
    forwardPage(newPageId) {
        const oldPage = this.components.find(c =>
            c.vue.$el.id === 'page-' + this.showingPage
        )
        if (oldPage.vue.kPageLeaveEvent)
            oldPage.vue.kPageLeaveEvent()

        this.showingPage = newPageId
    },
    addComponent(c) {
        this.components.push({
            vue: c
        })
        i18n.addComponent(c)
    }
}
export default portalApp