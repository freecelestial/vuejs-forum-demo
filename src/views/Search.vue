<template>
    <b-col class="search-results">
        <b-breadcrumb class="bg-white">
            <b-breadcrumb-item to="/">
            <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
             Home
            </b-breadcrumb-item>
            <b-breadcrumb-item active>搜尋結果</b-breadcrumb-item>
        </b-breadcrumb>

        <b-card-group>
            <b-card class="border shadow-sm p-3 mb-5">
                <b-card-title class="pb-3 mb-4 border-bottom">
                    <h3>
                        <b-icon icon="search"></b-icon>
                        關於 “<span class="highlight">{{ keyword }}</span>” 的搜索結果, 共 
                        {{ results.length }} 條
                        <!-- 排序方式列表 -->
                        <div class="pull-right mt-n2">

                            <b-button v-for="item in filters"
                                :disabled="item.filter === filter"
                                href="javascript:;"
                                @click="getArticlesByKeyword(keyword, item.filter)" 
                                :key="item.filter"
                                variant="info"
                                class="mx-1"
                                size="sm"
                            >
                                <b-icon :icon="item.icon"></b-icon> {{ item.title }}
                            </b-button>
                        </div>
                    </h3>
                </b-card-title>

                <b-list-group flush>
                    <div v-for="result in results" class="result" :key="result.articleId">
                        <h3 class="title">
                        <router-link :to="`/articles/${result.articleId}/content`">
                            <span v-html="result.title"></span>
                        </router-link>
                        <small>by</small>
                        <b-avatar :to="`/${result.uname}`" size="sm" variant="light" :src="result.uavatar"></b-avatar> 
                        <small>{{ result.uname }}</small>
                        </h3>
                        <div class="info">
                            <span class="url">
                                <router-link :to="`/articles/${result.articleId}/content`">
                                {{ result.url }}
                                </router-link>
                            </span>
                            <span class="date">
                                {{ result.date | moment('from', { startOf: 'minute' }) }} ⋅
                                <b-icon icon="heart-fill" variant="danger"></b-icon>
                                {{ result.likeUsers && result.likeUsers.length || 0 }} ⋅
                                <b-icon icon="chat-dots-fill" variant="info"></b-icon>
                                {{ result.comments && result.comments.length || 0 }}
                            </span>
                        </div>
                        <div class="desc" v-html="result.content"></div>
                        <hr>
                    </div>
                    <div v-if="!results.length" class="empty-block">
                        沒有任何數據~~
                    </div>

                </b-list-group>
                
            </b-card>
        </b-card-group>
    </b-col>
</template>

<script>
export default {
    name: 'Search',
    data() {
        return {
            keyword: '', // 關鍵字
            results: [], // 搜索結果
            filter: 'default', // 默認排序方式
            filters: [ // 排序方式列表
                {
                    filter: 'default',
                    // 標題有關鍵字排前面
                    title: '依相關性排序',
                    icon: 'filter'
                },
                {
                    filter: 'vote',
                    title: '依點讚數排序',
                    icon: 'heart'
                }
            ]
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 確認渲染該組件的對應路由時，獲取搜索結果
            vm.getArticlesByKeyword(to.query.q)
        })
    },
    // 路由的參數改變由 '?q=foo' 變成 '?q=bar' 時，只影響參數
    // 表示 Search.vue 是被複用
    // 複用的情況下，beforeRouteEnter 不會被再次調用
    // 要在 beforeRouteUpdate 中根據路由參數的變化，重新獲取對應數據，
    // 需要使用 next() 確認導航
    beforeRouteUpdate(to, from, next) {
        this.getArticlesByKeyword(to.query.q)
        next()
    },
    // 離開該組件的對應路由時，清空搜索值
    beforeRouteLeave(to, from, next) {
        this.$store.commit('UPDATE_SEARCH_VALUE', '')
        next()
    },
    methods: {
        // 使用關鍵字 keyword 獲取搜索結果
        getArticlesByKeyword(keyword, filter) {
            if (keyword) {
                this.keyword = keyword
                if (filter) this.filter = filter

                // 需要提交事件類型，以更新搜索框的值
                this.$store.commit('UPDATE_SEARCH_VALUE', keyword)
                this.results = this.$store.getters.getArticlesByKeyword(keyword, filter)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .result a:hover, .result a:focus { color: #d6514d; transition: color .15s ease;}
    .btn-info {
        background-color: #5FB878;
        border-color: #5FB878;
    }
</style>