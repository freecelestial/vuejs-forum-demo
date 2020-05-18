<template>
    <b-row  align-h="center">
        <b-col md="3" class="d-none d-lg-block">
            <b-card class="shadow-sm p-1 mb-5"
                :img-src="userAvatar"
                img-alt="Avatar"
                img-top
                rounded="circle" 
            >
                <b-card-body>
                    <b-card-title class="text-center">{{ userName }} 的專欄</b-card-title>
                </b-card-body>

                <b-card-body>
                    <b-button v-if="buttonListShow" 
                        :to="`/${ userName }`" variant="outline-success" block>
                        <b-icon icon="file-earmark-text"></b-icon>
                        文章列表 
                    </b-button>
                </b-card-body>

            </b-card>
        </b-col>
        <b-col md="9">
            <router-view/>
        </b-col>
    </b-row>
</template>


<script>
// 引入 mapState 辅助函数
import { mapState } from 'vuex'

export default {
    name: 'Column',
    data() {
        return {
            userName: '',
            userAvatar: '',
            articles: [],
            buttonListShow: true,
        }
    },
    computed: {
        ...mapState([
            'user'
        ]),
        articleNum() {
            return this.articles.length
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 确认渲染该组件的对应路由时，通过 to.params 参数设置用户和文章数据
            vm.setDataByParams(to.params)
        })
    },
    watch: {
        '$route'(to) {
            // 在子頁面之間相互切換時，通過 to.params 參數設置用戶和文章數據
            this.setDataByParams(to.params)
        }
    },
    methods: {
        setDataByParams(params) {
            const user = params.user
            const articleId = params.articleId
            // 当前文章
            const article = this.$store.getters.getArticleById(articleId)

            // 存在当前文章时，设置用户数据为当前文章的用户信息，并使用文章的 uname 获取对应用户文章
            if (article) {
                this.userName = article.uname
                this.userAvatar = article.uavatar
                this.articles = this.$store.getters.getArticlesByUid(null, article.uname)

                // 切換顯示按鈕
                this.buttonListShow = true

            } else if (user) {
                // 存在 user 参数时，使用路由的 user 获取对应用户文章
                const articles = this.$store.getters.getArticlesByUid(null, user)

                // 存在至少一篇用户文章时，设置用户数据为第一篇文章的用户信息
                if (articles.length) {
                    this.userName = articles[0].uname
                    this.userAvatar = articles[0].uavatar
                } else if (this.user) {
                    // 不存在用户文章时，设置用户数据为当前用户的用户信息
                    this.userName = this.user.name
                    this.userAvatar = this.user.avatar
                }

                this.articles = articles

                // 切換顯示按鈕
                this.buttonListShow = false
            }else{
                // 新增或編輯文章的介面
                // 切換顯示按鈕
                this.userName = this.user.name
                this.userAvatar = this.user.avatar

                this.buttonListShow = true

            }
            
            document.documentElement.scrollTop = 20
        }
    }
}
</script>

<style scoped>
    .blog-container { margin-top: 20px;}
</style>