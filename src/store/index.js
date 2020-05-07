import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'
// 引入 actions.js 的所有导出
import * as moreActions from './actions'
import * as moreGetters from './getters'

Vue.use(Vuex)

const state = {
    // 當前登入用戶
    user: ls.getItem('user'),
    // 添加 auth 来保存当前用户的登录状态
    auth: ls.getItem('auth'),
    // 所有文章状态
    articles: ls.getItem('articles'),
    searchValue: '',
    // 默认为 location.origin（域名的标准形式）
    origin: location.origin.indexOf('github.io') !== -1 ? 
    `${location.origin}/vuejs-essential/dist` : location.origin 
}

const mutations = {
    // UPDATE_XXX 是事件类型名称
    // 改變狀態，並存入local storage
    
    // user 是用户传入的参数，多参数的时候应该使用一个对象。
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
    // 更新搜索值的事件类型
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
        // 更新当前用户的登录状态为已登录
        commit('UPDATE_AUTH', true)
        // 路由跳轉
        router.push('/')
    },
    logout({ commit }) {
        commit('UPDATE_AUTH', false)
        router.push({ name: 'Home', params: { logout: true } }).catch(() => {})
    },  // 更新个人信息
    updateUser({ state, commit }, user) {
        const stateUser = state.user
    
        if (stateUser && typeof stateUser === 'object') {
            // 合并新旧个人信息，等价于 user = Object.assign({}, stateUser, user)
            user = { ...stateUser, ...user }
        }
    
        commit('UPDATE_USER', user)
    },
    // 使用对象展开运算符混入 moreActions
    ...moreActions
}

// 仓库的计算属性
const getters = {
    getArticleById: (state, getters) => (id) => {
      // 使用派生状态 computedArticles 作为所有文章
      let articles = getters.computedArticles
  
      if (Array.isArray(articles)) {
            // 传进来的 id 和文章的 articleId 相同时，返回这些文章
            articles = articles.filter(article => parseInt(id) === parseInt(article.articleId))
            return articles.length ? articles[0] : null
      } else {
            return null
      }
    },
    // 混入 moreGetters, 你可以理解为 getters = Object.assign(getters, moreGetters)
    ...moreGetters
  }

  
const store = new Vuex.Store({
    state,
    // 注册 getters
    getters,
    mutations,
    actions
})

export default store