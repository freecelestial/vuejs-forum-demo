<template>
    <b-list-group tag="ul" flush>
        <b-list-group-item v-for="article in articles" :key="article.articleId"
            class="flex-column align-items-start border-top-0 border-left-0 
            border-right-0" :to="`/articles/${article.articleId}/content`" >
            <b-media tag="li">
                <template v-slot:aside>
                    <b-avatar :to="`/${article.uname}`" variant="info" :src="article.uavatar"></b-avatar> 
                </template>
                <span class="d-inline-block mt-1" style="font-size:1.2em">
                    {{ article.title }}
                </span>
                <span class="mb-0 float-right">
                    <span>
                        <b-button variant="white" title="按讚數" style="cursor: auto;" 
                        disabled>
                            <b-icon icon="heart-fill" variant="danger"></b-icon>
                            {{ article.likeUsers ? article.likeUsers.length : 0 }}
                        </b-button>
                    </span>
                    <span>
                        <b-button variant="white" title="留言數" style="cursor: auto;" 
                        disabled>
                            <b-icon icon="chat-dots-fill" variant="info"></b-icon>
                            {{ article.comments ? article.comments.length : 0 }}
                        </b-button>
                    </span>
                    
                    <span class="badge badge-light" style="cursor: auto;">
                        {{ article.date | moment('from') }}</span>
                </span>
            </b-media>
        </b-list-group-item>
    </b-list-group>

</template>

<script>
export default {
    name: 'TabContent',
    props: {
        articles: {
            type: Array,
            default: []
        }
    }
}
</script>

<style scoped>

</style>