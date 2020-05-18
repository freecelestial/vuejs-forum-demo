<template>
    <b-col>
        <b-breadcrumb class="bg-white">
            <b-breadcrumb-item to="/">
            <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
             Home
            </b-breadcrumb-item>
            <b-breadcrumb-item active>文章列表</b-breadcrumb-item>
        </b-breadcrumb>
            <b-card class="border shadow-sm p-3 mb-5">
                <b-card-title>
                    <h3 class="mb-3 font-weight-bolder">
                        <b-icon class="h1" icon="file-earmark-text" variant="primary"></b-icon>
                        文章列表</h3>
                </b-card-title>

                <b-list-group flush>
                    <b-list-group-item v-for="(article,index) in articles" :key="article.articleId"
                        class="flex-column align-items-start">
                        <b-media tag="li">
                            <template v-slot:aside>
                                <b-avatar :text="`${index+1}`" variant="info"></b-avatar>
                            </template>
                            <h5 class="mt-2">
                                <router-link :to="`/articles/${article.articleId}/content`" class="title">
                                    {{ article.title }}
                                </router-link>
                            </h5>
                            <p class="mb-0 float-right">
                                <abbr>{{ article.date | moment('from') }}</abbr>
                            </p>
                        </b-media>

                    </b-list-group-item>

                </b-list-group>
                
            </b-card>
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
    form,h4 { font-weight:700 }
    .b-icon.bi {vertical-align: middle;}
    .list-group .align-items-start{ line-height: 0.6em; }
</style>