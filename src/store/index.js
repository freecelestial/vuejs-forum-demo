import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'
// 引入 actions.js 的所有導出
import * as moreActions from './actions'
import * as moreGetters from './getters'

Vue.use(Vuex)

const state = {
    // 當前登入用戶
    user: ls.getItem('user'),
    // 添加 auth 來保存當前用戶的登錄狀態
    auth: ls.getItem('auth'),
    // 所有文章狀態
    articles: ls.getItem('articles'),
    // 搜尋字串
    searchValue: '',
    // 默認爲 location.origin（域名的標準形式）
    origin: location.origin.indexOf('github.io') !== -1 ? 
    `${location.origin}/vuejs-forum-demo/dist` : location.origin 
}

// 改變狀態，要在 mutation
const mutations = {
    // UPDATE_XXX 是事件類型名稱
    
    // user 是用戶傳入的參數，多參數的時候應該使用一個對象。
    // 第一個參數固定是 state
    UPDATE_USER(state, user) {
        state.user = user
        ls.setItem('user', user)
    },
    // 改變 auth 資料，並存入local storage
    UPDATE_AUTH(state, auth) {
        state.auth = auth
        ls.setItem('auth', auth)
    },
    UPDATE_ARTICLES(state, articles) {
        state.articles = articles
        ls.setItem('articles', articles)
    },
    // 更新搜索值的事件類型
    UPDATE_SEARCH_VALUE(state, searchValue) {
        state.searchValue = searchValue
    }
}

const actions = {
    // { commit } = context.commit
    // 用 commit 提交 mutations 內定義的事件類型
    // 第一個參數固定是 context 內有 commit,state
    // 第二個參數是物件
    login({ commit }, user) {
        if (user) commit('UPDATE_USER', user)
        // 更新當前用戶的登錄狀態爲已登錄
        commit('UPDATE_AUTH', true)
        // 路由跳轉到首頁
        router.push('/')
    },
    logout({ commit }) {
        commit('UPDATE_AUTH', false)
        router.push({ name: 'Home', params: { logout: true } }).catch(() => {})
    },  // 更新個人信息
    updateUser({ state, commit }, user) {
        const stateUser = state.user
    
        if (stateUser && typeof stateUser === 'object') {
            // 合併新舊個人信息，等價於 user = Object.assign({}, stateUser, user)
            user = { ...stateUser, ...user }
        }
    
        commit('UPDATE_USER', user)
    },
    // 使用對象展開運算符混入 moreActions
    ...moreActions
}

// 倉庫的計算屬性
const getters = {
    // 混入 moreGetters, 你可以理解爲 getters = Object.assign(getters, moreGetters)
    ...moreGetters
  }

  
const store = new Vuex.Store({
    state,
    // 註冊 getters
    getters,
    mutations,
    actions
})

export default store