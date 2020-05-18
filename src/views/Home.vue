<template>
    <b-row align-h="center">
        <b-col md="3" class="d-none d-lg-block">
            <!-- 侧栏 -->
            <TheSidebar/>
        </b-col>
        <b-col md="9">
            <b-card no-body>
                <b-tabs pills card>
                    <b-tab v-for="item in filters" :key="item.name" 
                        :title="item.title" @click="setDataByFilter(item.filter)" 
                        :class="{ active: filter === item.filter }" no-body lazy>
                        <b-card-text>
                            <TabContent :articles="articles"/>
                            <div class="mt-5 overflow-auto">
                                <b-pagination-nav 
                                    :link-gen="linkGen" 
                                    :number-of-pages="numberOfPages" 
                                    use-router
                                    align="center"
                                    first-number
                                    last-number
                                >
                                </b-pagination-nav>
                            </div>
                        </b-card-text>
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-col>

    </b-row>
</template>

<script>
import { mapState } from 'vuex'
// 引入 TheSidebar.vue 的默認值
import TabContent from '@/components/TabContent'
import TheSidebar from '@/components/layouts/TheSidebar'


export default {
    name: 'Home',
    components: {
        // 因爲只在首頁使用側欄，所以將 TheSidebar 註冊到局部
        TabContent,TheSidebar
    },
    data() {
        return {
            articles: [], // 文章列表
            filter: 'default', // 目前排序方式
            filters: [ // 過濾方式列表
                { filter: 'default', name: '活躍', title: '依最新留言排序'},
                { filter: 'excellent', name: '注目', title: '只看加精的話題'},
                { filter: 'vote', name: '精品', title: '點讚數排序'},
                { filter: 'recent', name: '最新', title: '文章發佈時間排序'},
                { filter: 'morereply', name: '人氣', title: '評論多的話題'}
            ],
            // total: 0, 
            pageSize: 10, // 每頁條數
            totalRows: 0, // 文章總數
        }
    },
    // 組件內的路由守衛
    // 此守衛不能訪問 this，但我們通過傳一個 vm 給 next，就可以使用上面的 vm 來訪問組件實例
    beforeRouteEnter(to, from, next) {
        // 路由的名稱，對應路由配置中的 name
        const fromName = from.name
        // 獲取 logout 參數
        const logout = to.params.logout

        // 確認路由後執行
        next(vm => {
            // 通過 vm 參數訪問組件實例，已登錄時，評估路由名稱
            if (vm.$store.state.auth) {
                switch (fromName) {
                    // 從註冊頁面跳轉過來
                    case 'Register':
                        vm.makeToast('註冊成功')
                    break
                    case 'Login':
                        vm.makeToast('登入成功')
                    break
                }
            } else if (logout) {
                // logout 返回 true 時，顯示操作成功提示
                vm.makeToast('登出成功')
            }
            // 確認渲染該組件的對應路由時，設置相關數據
            //vm.setDataByFilter(to.query.filter)
            vm.setDataByFilter()

        })
    },
    computed: {
        ...mapState([
            'auth',
            'user',
        ]),
        // 當前頁，從查詢參數 page 返回
        currentPage() {
            return parseInt(this.$route.query.page) || 1
        },
        numberOfPages(){
            this.$nextTick(() => {
                 return Math.ceil(this.totalRows/this.pageSize)
            })
        }

    },
    watch: {
        auth(value) {
            if (!value) {
                this.makeToast('登出成功')
            }
        },
        // 監聽 '$route'，在查詢參數變化後，設置相關數據
        '$route'(to) {
            // this.setDataByFilter(to.query.filter)
            this.setDataByFilter()
        }
    },
    methods: {
        makeToast(msg) {
            this.$bvToast.toast(msg, {
                title:'訊息',
                toaster: 'b-toaster-bottom-right',
                autoHideDelay: 5000,
                appendToast: true
            })
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        setDataByFilter(filter = 'default') {
            // 每頁條數
            const pageSize = this.pageSize
            // 當前頁
            const currentPage = this.currentPage
            // 過濾後的所有文章
            const allArticles = this.$store.getters.getArticlesByFilter(filter)

            this.filter = filter
            // 文章總數
            this.totalRows = allArticles.length
            // 當前頁的文章
            this.articles = allArticles.slice(pageSize * (currentPage - 1), pageSize * currentPage)
        },
        linkGen(pageNum) {
            return pageNum === 1 ? '?' : `?page=${pageNum}`
        }
    }
}
</script>


<style scoped>
    .nav-item{font-weight:border}
</style>