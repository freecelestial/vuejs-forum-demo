<template>
    <div>
        <b-card 
            header-bg-variant="transparent"
            header="廣告播放" 
            bg-variant="Default" 
            class="text-center shadow-sm p-1 mb-5"
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
            class="text-center shadow-sm p-1 mb-5"
        >
            <b-card-text>

            </b-card-text>
      </b-card>

        <!-- 七天內最熱 -->
        <b-card 
            header-bg-variant="transparent"
            header="七天內最熱" 
            bg-variant="Default" 
            class="text-center shadow-sm p-1 mb-5"
        >
            <b-card-text>

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
            activeUsers: [], // 活躍用戶
            hotArticles: [], // 最熱文章
        }
    },
    // 在實例創建完成後
    created() {
        // 通過 axios 執行 GET 請求來返回活躍用戶
        this.$axios.get('/users/active').then((response) => {
            // 在成功的回調裏，從 response.data 獲取返回數據
            this.activeUsers = response.data
        })

        // 通過 axios 執行 POST 請求來返回七天內最熱文章，可以傳遞 num 來指定返回條數
        this.$axios.post('/articles/hot', { num: 10 }).then((response) => {
            this.hotArticles = response.data
        })

    }
}
</script>

<style scoped>
    .carousel-inner img {display:block;margin:auto;line-height:1;width:70%;border:1px solid #ddd;box-shadow:0 0 10px #ccc;-moz-box-shadow:0 0 10px #ccc;-webkit-box-shadow:0 0 10px #ccc;}
</style>