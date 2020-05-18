// 引入 vue.js
import Vue from 'vue'
// 引入 App.vue
import App from './App'
import router from './router'
// 引入 store/index.js 的默认值
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// 引入過濾器
import './filters'
import { mockArticles } from './mock/data'
import ls from './utils/localStorage'
// 运行 ./mock/index.js
import './mock'
// 引入 axios 的默認值
import axios from 'axios'
// 將 axios 添加到 Vue.prototype 上，使其在實例內部的所有組件中可用
Vue.prototype.$axios = axios

// 每次使用都直接載入儲存在 localstorage 的數據 加上 50 筆 mock 產生的數據
const AddMockData = (() => {
    // 是否加入測試數據
    const isAddMockData = true
    // 用戶數據
    let userArticles = ls.getItem('articles')
  
    if (Array.isArray(userArticles)) {
        // 只取自建(uid 為1)的文章
        userArticles = userArticles.filter(article => parseInt(article.uid) === 1)
    } else {
        userArticles = []
    }
  
    // 是否產生新資料
    if (isAddMockData) {
        // 合併用戶數據和測試數據，使用合併值作爲所有文章
        store.commit('UPDATE_ARTICLES', [...userArticles, ...mockArticles(24)])
    } else {
        // 使用原用戶資料的文章
        store.commit('UPDATE_ARTICLES', userArticles)
    }
    /* 
    测试文章的数据结构
    与用户文章相比，测试文章的 uid 不同，且多了 uname 属性
        [
            {
                "uid": 2,
                "articleId": 2,
                "title": "命相五经展由造再习设件同火压达六料林",
                "content": "复想到中路光这交少五打么增走支眼各。江给成花元局强非美如动识应地没资。总管全放价毛代外离须经到称。西利世主单果向国收金图整。政所专收三接龙问斗西备界节生话老。",
                "date": "2018-04-05T09:24:54.580Z",
                // "likeUsers" 和 "comments" 不一定存在
                "likeUsers": [],
                "comments": [],
                "uname": "Jessica"
            }
        ] 
    */

})()


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
