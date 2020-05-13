// 引入 vue.js
import Vue from 'vue'
// 引入 App.vue
import App from './App'
import router from './router'
// 引入組件 index.js
//import './components'
// 引入 store/index.js 的默认值
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// 引入過濾器
import './filters'




// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
