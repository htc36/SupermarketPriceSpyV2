import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import ProductPage from './pages/ProductPage'
import ProductDetails from "@/pages/ProductDetails";


library.add(faSearch)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Buefy, {
    defaultIconComponent: 'vue-fontawesome',
    defaultIconPack: 'fas',
});
Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        component: ProductPage
    },
    {
        path: "/product/:id",
        component: ProductDetails
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history'
})

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
})


