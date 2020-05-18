<template>
    <div>
        <b-card 
            header-bg-variant="transparent"
            header="廣告播放" 
            bg-variant="Default" 
            class="text-center shadow-sm p-1 mb-1"
        >
            <b-card-text>
                <b-carousel
                    id="carousel-1"
                    v-model="slide"
                    :interval="4000"
                    controls
                    indicators
                    background="#ababab"
                    style="text-shadow: 1px 1px 2px #333;"
                    @sliding-start="onSlideStart"
                    @sliding-end="onSlideEnd"
                >
                    <!-- Slides with custom text -->
                    <b-carousel-slide v-for="slide in slides" :key="slide.img"
                        :img-src="slide.img">
                        <p></p>
                    </b-carousel-slide>
                </b-carousel>
            </b-card-text>
      </b-card>

        <!-- 活躍用戶 -->
        <b-card 
            header-bg-variant="transparent"
            header="活躍用戶" 
            bg-variant="Default" 
            class="text-center shadow-sm p-1 mb-1"
        >
            <b-card-text class="text-left">
                <h5>
                    <b-badge v-for="activeUser in activeUsers" 
                        :to="`/${ activeUser.name }`" 
                        :key="activeUser.name" 
                        variant="white"
                    >
                        <b-avatar variant="info"
                        :src="activeUser.avatar"></b-avatar> 
                        {{ activeUser.name }}
                    </b-badge>
                </h5>
            </b-card-text>
      </b-card>

        <!-- 七天內最多留言 -->
        <b-card 
            header-bg-variant="transparent"
            header="七天內最多留言" 
            bg-variant="Default" 
            class="text-center shadow-sm p-1 mb-1"
            no-body
        >
            <b-card-text class="text-left text-secondary">
                <b-list-group flush>
                    <b-list-group-item v-for="(article, index) in hotArticles"
                     :key="index">                        
                        <router-link :to="`/articles/${article.articleId}/content`">
                            <span>{{ index + 1 }}.</span>
                            {{ article.title }}
                        </router-link>
                    </b-list-group-item>
                </b-list-group>
            </b-card-text>
      </b-card>


    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    data() {
        return {
            slides: [
                {
                    title: '廣告書籍1',
                    img: 'https://www.books.com.tw/img/001/079/19/0010791912_bc_01.jpg',
                    link: ''
                },
                {
                    title: '廣告書籍2',
                    img: 'https://www.books.com.tw/img/001/078/08/0010780802_bc_01.jpg',
                    link: ''
                }
            ],
            slide: 0,
            sliding: null,
            activeUsers: [],
            hotArticles: []
        }
    },
    created() {
        // 通過執行 GET 請求來返回活躍用戶
        this.$axios.get('/users/active').then((response) => {
            // 在成功的回調裏，從 response.data 獲取返回數據
            this.activeUsers = response.data
        })

        // 通過執行 POST 請求來返回七天內最熱文章，可以傳遞 num 來指定返回條數
        this.$axios.post('/articles/hot', { num: 3 }).then((response) => {
            this.hotArticles = response.data
        })

    },
    methods: {
        onSlideStart(slide) {
            this.sliding = true
        },
        onSlideEnd(slide) {
            this.sliding = false
        }
    }
}
</script>

<style scoped>

</style>