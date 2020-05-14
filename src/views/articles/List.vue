<template>
    <b-col>
        <b-card-group>
            <b-card  class="border shadow-sm p-3 mb-5">
                <b-card-title>
                    <h3 class="mb-3 font-weight-bolder">專欄文章</h3>
                </b-card-title>

                <b-list-group>
                    <b-list-group-item v-for="article in articles" :key="article.articleId"
                        class="flex-column align-items-start border-top-0 border-left-0 
                        border-right-0">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-0">
                                <b-avatar  size="sm" variant="light" :src="article.uavatar"></b-avatar> 
                                <router-link :to="`/articles/${article.articleId}/content`" class="title">
                                    {{ article.title }}
                                </router-link>
                            </h5>
                            <small>{{ article.date | moment('from') }}</small>
                        </div>
                    </b-list-group-item>


                </b-list-group>
                    <div class="mt-5">
                        <b-pagination v-model="currentPage" :total-rows="rows" align="center"></b-pagination>
                    </div>
                
            </b-card>
        </b-card-group>
    </b-col>
</template>

<script>
// 引入 mapState 辅助函数
import { mapState } from 'vuex'

export default {
    name: 'List',
    data() {
        return {
            articles: [],
            rows: 100,
            currentPage: 1
        }
    },
    computed: {
        ...mapState([
            'auth',
            'user'
        ])
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 傳入使用者資料物件，以獲取使用者文章
            vm.articles = vm.$store.getters.getArticlesByUid(null, to.params.user)
        })
    }
}
</script>

<style scoped>
    nav a img{width: 30px;height: 30px;}
</style>