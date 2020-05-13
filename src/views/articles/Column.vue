<template>
    <b-row  align-h="center">
        <b-col md="3">
            <b-card class="shadow-sm p-1 mb-5 "
                :img-src="userAvatar"
                img-alt="Avatar"
                img-top
            >
                <b-card-body>
                    <b-card-title class="text-center">{{ userName }} 的專欄</b-card-title>
                </b-card-body>

                <b-card-body>
                    <b-button :to="`/${ userName }`" variant="outline-success" block>
                        <b-icon icon="file-earmark-text"></b-icon>
                        專欄文章 ( {{ articleNum }} )
                    </b-button>
                </b-card-body>

            </b-card>
        </b-col>
        <b-col md="7">
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
            userName: '', //  对应用户姓名
            userAvatar: '', //  对应用户头像
            articles: [] //  对应用户文章
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
            // 在子页面之间相互切换时，通过 to.params 参数设置用户和文章数据
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
            }
        }
    }
}
</script>

<style scoped>
    .blog-container { margin-top: 20px;}
</style>