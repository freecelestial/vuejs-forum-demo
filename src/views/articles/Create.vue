<template>
    <b-col>
        <b-alert
            :variant="alertType"
            dismissible
            fade
            :show="dismissCountDown"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
        >
            <p>{{ alertMsg }}</p>
            <b-progress
                :variant="alertType"
                :max="dismissSecs"
                :value="dismissCountDown"
                height="4px"
            ></b-progress>
        
        </b-alert>
        
        <ValidationObserver ref="observer" v-slot="{ invalid }">
            <b-form @submit="onSubmit">
                <b-card-group class="border shadow-sm p-1 mb-5">
                    <b-card-body>
                        <b-card class="border-0">
                            <b-card-text>
                                <b-card-title>
                                    <b-icon class="h1" icon="file-plus" variant="primary"></b-icon> 
                                    創作文章
                                </b-card-title>
                                <hr>
                                <ValidationProvider name="標題" 
                                        rules="required" v-slot="{ valid,errors }">
                                    <b-form-group 
                                        label="標題: " 
                                        label-for="title"
                                        description=""
                                    >
                                        <b-form-input
                                            id="title"
                                            v-model="form.title"
                                            :state="errors[0] ? false : (valid ? true : null)"
                                            placeholder=""
                                            @input="saveTitle"
                                        ></b-form-input>
                                        <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>

                                <ValidationProvider name="內容" 
                                        rules="required|max:1200" v-slot="{ valid,errors }">
                                    <b-form-group 
                                        label="內容: " 
                                    >
                                        <b-form-textarea
                                            id="content"
                                            v-model="form.content"
                                            placeholder=""
                                        ></b-form-textarea>
                                        <b-form-invalid-feedback id="inputLiveFeedback">
                                            {{ errors[0] }}</b-form-invalid-feedback>
                                    </b-form-group>
                                    
                                </ValidationProvider>

                                <b-button class="mt-4" :disabled="invalid" type="submit" variant="primary" block>
                                    <b-icon icon="upload"></b-icon> 送 出
                                </b-button>
                            </b-card-text>
                        </b-card>
                    </b-card-body>
                </b-card-group>
            </b-form>
        </ValidationObserver>
    </b-col>
</template>

<script>
import SimpleMDE from 'simplemde'
import hljs from 'highlight.js'
import ls from '@/utils/localStorage'

// 添加全局變量
window.hljs = hljs

// 引入表單驗證
import { ValidationProvider, extend ,ValidationObserver} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/zh_TW.json';

// 可使用所有rules
Object.keys(rules).forEach(rule => {
    extend(rule, {
         ...rules[rule], // copies rule configuration
         message: messages[rule] // assign message
    });
});


export default {
    name: 'Create',
    data() {
        return {
            form:{
                title: '',
                content: '',
            },
            // 臨時用它來判斷是否還處於當前編輯頁面
            articleId: undefined,
            alertShow: null,
            alertMsg:'',
            alertType:'',
            dismissSecs: 5,
            dismissCountDown: 0,
        }
    },
    // 進入路由前，設置 articleId
    // 此時只能用 vm 不能用 this
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.setArticleId(vm.$route.params.articleId)
        })
    },
    // 在離開路由前，清除記錄資料
    // 此時已可用 this
    beforeRouteLeave(to, from, next) {
        this.clearData()
        next()
    },
    watch: {
        // 監聽路由參數的變化
        // 我們通常會在兩個路由都渲染相同的組件時監聽 '$route'
        // 這是因爲 Vue 會複用組件實例，以導致組件內的部分鉤子不再被調用
        // 例如：當我們從『編輯文章』導航到『創作文章』時 beforeRouteEnter 就不會被調用
        '$route'(to) {
            this.clearData()
            this.setArticleId(to.params.articleId)
        }
    },
    mounted() {
        const simplemde = new SimpleMDE({
            element: document.querySelector('#content'),
            placeholder: '請使用 Markdown 語法書寫',
            spellChecker: false,
            autoDownloadFontAwesome: false,
            autosave: {
                enabled: true,
                uniqueId: 'vuejs-forum-demo'
            },
            renderingConfig: {
                // 啓用代碼高亮，需要引入 highlight.js
                codeSyntaxHighlighting: true
            }
        })
        // 監聽編輯器的 change 事件
        simplemde.codemirror.on('change', () => {
            // 將改變後的值賦給文章內容
            this.form.content = simplemde.value()
        })
        // 將 simplemde 添加到當前實例，以在其他地方調用
        this.simplemde = simplemde
        // 標題和內容載入原有值
        this.initContent()
    },
    methods: {
        showAlert(msg, type = 'success') {
            this.alertMsg = msg
            this.alertType = type
            this.alertShow = false
            this.$nextTick(() => {
                this.dismissCountDown = this.dismissSecs
                document.documentElement.scrollTop = 20
            })
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        // 編輯器只會自動保存文章的內容，文章的標題用@input觸發
        saveTitle() {
            ls.setItem('smde_title', this.form.title)
        },
        initContent(articleId) {
            const simplemde = this.simplemde
            const smde_title = ls.getItem('smde_title')

            // 有 articleId 時
            if (articleId !== undefined) {
                // 獲取對應文章
                const article = this.$store.getters.getArticleById(articleId)

                if (article) {
                    // 獲取文章的標題和內容
                    const { title, content } = article

                    // 有自動保存的標題時，使用自動保存的標題，否則使用文章的標題
                    this.form.title = smde_title || title

                    // 有自動保存的內容時，使用自動保存的內容，否則使用文章的內容
                    this.form.content = simplemde.value() || content

                    // 設置編輯器的內容
                    simplemde.value(this.form.content)
                }
            } else { 
                // 沒有 articleId 時，使用自動保存的標題和內容
                this.form.title = smde_title
                this.form.content = simplemde.value()
            }

        },
        onSubmit(evt) {
            evt.preventDefault()
            const title = this.form.title
            const content = this.form.content

            if (title !== '' && content.trim() !== '') {
                const article = {
                    title,
                    content
                }

                this.$store.dispatch('post', { article, articleId: this.articleId })
                this.clearData()
            }
        },
        clearData() {
            this.form.title = ''
            ls.removeItem('smde_title')
            this.simplemde.value('')
            this.simplemde.clearAutosavedValue()
        },
        setArticleId(articleId) {
            // 獲取 localStorage 保存的 articleId，臨時用它來判斷是否還處於當前編輯頁面
            const localArticleId = ls.getItem('articleId')
            // 手動在兩個不同的編輯頁面之間跳轉時（如 /articles/1/edit 和 /articles/2/edit）時
            // 清空自動保存的文章數據
            if (articleId !== undefined && !(articleId === localArticleId)) {
                this.clearData()
            }

            this.articleId = articleId
            this.initContent(articleId)
            ls.setItem('articleId', articleId)
        }
    },
    components: {
        ValidationProvider,ValidationObserver
    }
}

</script>

<style scoped>
    form,h4 { font-weight:700 }
    .b-icon.bi {vertical-align: middle;}

</style>