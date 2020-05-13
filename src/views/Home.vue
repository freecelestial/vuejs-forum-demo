<template>
    <div>


    </div>
</template>

<script>
import { mapState } from 'vuex'
// 引入 TheSidebar.vue 的默認值
import TheSidebar from '@/components/layouts/TheSidebar'


export default {
    name: 'Home',
    components: {
        // 因爲只在首頁使用側欄，所以將 TheSidebar 註冊到局部
        TheSidebar
    },
    data() {
        return {
            articles: [], // 文章列表
            filter: 'default', // 默認過濾方式
            filters: [ // 過濾方式列表
                { filter: 'default', name: '活躍', title: '最後回覆排序'},
                { filter: 'excellent', name: '精華', title: '只看加精的話題'},
                { filter: 'vote', name: '投票', title: '點贊數排序'},
                { filter: 'recent', name: '最近', title: '發佈時間排序'},
                { filter: 'noreply', name: '零回覆', title: '無人問津的話題'}
            ],
            total: 0, // 文章總數
            pageSize: 20, // 每頁條數
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
            vm.setDataByFilter(to.query.filter)

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
            this.setDataByFilter(to.query.filter)
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
            this.total = allArticles.length
            // 當前頁的文章
            this.articles = allArticles.slice(pageSize * (currentPage - 1), pageSize * currentPage)
        },
        // 回調，組件的當前頁改變時調用
        changePage(page) {
            // 在查詢參數中混入 page，並跳轉到該地址
            // 混入部分等價於 Object.assign({}, this.$route.query, { page: page })
            // 有相同屬性時，後方的page會取代前方的page
            this.$router.push({ query: { ...this.$route.query, page } })
        }
    }
}
</script>


<style scoped>

</style>