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
            <b-form>
                <b-card-group class="border shadow-sm p-1 mb-5">
                    <b-card-body>
                        <b-card class="border-0">
                            <b-card-text>
                                <b-card-title class="text-center">
                                    {{ form.title}}
                                </b-card-title>
                                <b-card-sub-title class="py-3 text-center">
                                    <abbr><b-icon icon="clock-history"></b-icon> 
                                    {{ date | moment('from') }}</abbr>
                                </b-card-sub-title>
                                <b-card-text class="py-3">
                                    Some quick example text to build on the card title and make up the bulk of the card's content.
                                </b-card-text>
                                <hr>
                                
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
import emoji from 'node-emoji'
import { mapState } from 'vuex'

// 引入 qrcode.vue 的默認值
import QrcodeVue from 'qrcode.vue'

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
    name: 'Content',
    components: {
        QrcodeVue
    },
    data() {
        return {
            form:{
                title: '', // 文章標題
                content: '', // 文章內容
            },
            articleId: undefined,
            alertShow: null,
            alertMsg:'',
            alertType:'',
            dismissSecs: 5,
            dismissCountDown: 0,
            date: '', // 文章創建時間
            uid: 1, // 用戶 ID
            likeUsers: [], // 點贊用戶列表
            likeClass: '', // 點贊樣式
            showQrcode: false, // 是否顯示打賞彈窗
            commentHtml: '', // 評論 HTML
            comments: [], // 評論列表
            commentId: undefined, // 評論 ID
        }
    },
    computed: {
        ...mapState([
            'auth',
            'user'
        ])
    },
    created() {
        // 從當前路由對象獲取參數 articleId
        const articleId = this.$route.params.articleId
        // 從 getArticleById 取指定 ID 的文章
        const article = this.$store.getters.getArticleById(articleId)

        if (article) {
            let { uid, title, content, date, likeUsers, comments } = article

            this.uid = uid
            this.form.title = title
            // 使用編輯器的 markdown 方法將 Markdown 內容轉成 HTML
            // this.content = SimpleMDE.prototype.markdown(content)
            // 使用 emojify 方法解析 emoji 字符串標識，name => name 表示不認識的就返回原值 
            this.form.content = SimpleMDE.prototype.markdown(emoji.emojify(content, name => name))
            this.date = date
            // 更新實例的 likeUsers
            this.likeUsers = likeUsers || []
            // 更新 likeClass，點贊用戶列表包含當前用戶時，賦值爲 active，表示已贊
            this.likeClass = this.likeUsers.some(likeUser => likeUser.uid === 1) ? 'active' : ''

            // 渲染文章的 comments
            this.renderComments(comments)

            this.$nextTick(() => {
                // 遍歷當前實例下的 'pre code' 元素
                this.$el.querySelectorAll('pre code').forEach((el) => {
                    // 使用 highlight.js 的 highlightBlock 方法進行高亮
                    hljs.highlightBlock(el)
                })
            })
        }
        // 設置實例的 articleId
        this.articleId = articleId
    },
    mounted() {
        // 已登錄時，纔開始創建
        if (this.auth) {
            // 自動高亮編輯器的內容
            window.hljs = hljs

            const simplemde = new SimpleMDE({
                element: document.querySelector('#editor'),
                placeholder: '請使用 Markdown 語法書寫',
                spellChecker: false,
                autoDownloadFontAwesome: true,
                // 不顯示工具欄
                toolbar: false,
                // 不顯示狀態欄
                status: false,
                renderingConfig: {
                    codeSyntaxHighlighting: true
                }
            })

            // 內容改變監聽
            simplemde.codemirror.on('change', () => {
                // 更新 commentMarkdown 爲編輯器的內容
                this.commentMarkdown = simplemde.value()
                // 更新 commentHtml，我們先替換原內容中的 emoji 標識，然後使用 markdown 方法將內容轉成 HTML
                this.commentHtml = simplemde.markdown(emoji.emojify(this.commentMarkdown, name => name))
            })

            // 按鍵鬆開監聽
            simplemde.codemirror.on('keyup', (codemirror, event) => {
                // 使用 Ctrl+Enter 時提交評論
                if (event.ctrlKey && event.keyCode === 13) {
                    this.comment()
                }else if (this.commentId && event.keyCode === 27) { 
                    // 存在 commentId，且按下 Esc 鍵時
                    // 取消編輯評論
                    this.cancelEditComment()
                }
            })

            // 將編輯器添加到當前實例
            this.simplemde = simplemde
        }
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
        editArticle() {
            this.$router.push({ name: 'Edit', params: { articleId: this.articleId } })
        },
        deleteArticle() {
            this.boxTwo = ''
            this.$bvModal.msgBoxConfirm('是否確認要刪除文章?', {
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: '是',
                cancelTitle: '否',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
            .then(value => {
                if (value) {
                    this.$store.dispatch('post', { articleId: this.articleId })
                }

            })
            .catch(err => {
               alert('登出發生異常錯誤!')
               
            })
        },
        like(evt) {
            // 未登錄時，提示登錄
            if (!this.auth) {
                this.$swal({
                    text: '需要登錄以後才能執行此操作。',
                    confirmButtonText: '前往登錄'
                }).then((res) => {
                    if (res.value) {
                        this.$router.push('/auth/login')
                    }
                })
            } else {
                const target = evt.currentTarget
                // 點贊按鈕是否含有 active 類，我們用它來判斷是否已贊
                const active = target.classList.contains('active')
                const articleId = this.articleId

                if (active) {
                    // 清除已贊樣式
                    this.likeClass = ''
                    // 分發 like 事件取消贊，更新實例的 likeUsers 爲返回的值
                    // 調用 store.dispatch 默認返回一個 Promise 對象，表示一個異步操作的最終狀態及其返回的值
                    // 此處返回的是 likeUsers
                    this.$store.dispatch('like', { articleId }).then((likeUsers) => {
                        // 使用帶用戶信息的點贊用戶
                        this.likeUsers = this.recompute('likeUsers')
                    })
                } else {
                    // 添加已贊樣式
                    this.likeClass = 'active animated rubberBand'
                    // 分發 like 事件，傳入 isAdd 參數點贊，更新實例的 likeUsers 爲返回的值
                    this.$store.dispatch('like', { articleId, isAdd: true }).then((likeUsers) => {
                        this.likeUsers = this.recompute('likeUsers')
                    })
                }
            }
        },
        comment() {
            // 編輯器的內容不爲空時
            if (this.commentMarkdown && this.commentMarkdown.trim() !== '') {
                // 分發 comment 事件以提交評論
                this.$store.dispatch('comment', {
                comment: { content: this.commentMarkdown },
                    articleId: this.articleId,
                    commentId: this.commentId
                }).then(this.renderComments)
                // 在 .then 的回調裏，調用 this.renderComments 渲染評論

                if (this.commentId) { // 有 commentId 時，取消編輯評論
                    this.cancelEditComment()
                } else {
                    // 清空編輯器
                    this.simplemde.value('')
                    // 使回覆按鈕獲得焦點
                    document.querySelector('#reply-btn').focus()

                    this.$nextTick(() => {
                        const lastComment = document.querySelector('#reply-list li:last-child')
                        if (lastComment) lastComment.scrollIntoView(true)
                    })
                }




            }
        },
        renderComments(comments) {
            if (Array.isArray(comments)) {
                // 使用帶用戶信息的評論
                comments = this.recompute('comments')

                // 深拷貝 comments 以不影響其原值
                const newComments = comments.map(comment => ({ ...comment }))
                const user = this.user || {}

                for (let comment of newComments) {
                    // 將評論內容從 Markdown 轉成 HTML
                    comment.content = SimpleMDE.prototype.markdown(emoji.emojify(comment.content, name => name))
                }

                // 更新實例的 comments
                this.comments = newComments
                // 將 Markdown 格式的評論添加到當前實例
                this.commentsMarkdown = comments
            }
        },
        editComment(commentId, commentIndex) {
            // 編輯器
            const simplemde = this.simplemde
            // 編輯器
            const codemirror = simplemde.codemirror
            // Markdown 格式的所有評論
            const comments = this.commentsMarkdown

            for (const comment of comments) {
                // 找到與 commentId 對應的評論時
                if (parseInt(comment.commentId) === parseInt(commentId)) {
                    // 設置編輯器的內容
                    simplemde.value(comment.content)
                    // 使編輯器獲得焦點
                    codemirror.focus()
                    // 將光標移到內容的後面
                    codemirror.setCursor(codemirror.lineCount(), 0)
                    // 評論索引 + 1，用來指示頁面滾動的位置
                    this.commentIndex = commentIndex + 1
                    // 更新 commentId
                    this.commentId = commentId
                    break
                }
            }
        },
        // 取消編輯評論
        cancelEditComment() {
            // 清除 commentId
            this.commentId = undefined
            // 清空編輯器
            this.simplemde.value('')

            // 下次 DOM 更新後，將評論滾動回視圖的頂部
            this.$nextTick(() => {
                if (this.commentIndex === undefined) return
                // nth-child 從 1 開始
                const currentComment = document.querySelector(`#reply-list li:nth-child(${this.commentIndex})`)

                if (currentComment) {
                    currentComment.scrollIntoView(true)
                    currentComment.querySelector('.operate a').focus()
                }
            })
        },
        // 刪除評論
        deleteComment(commentId) {
            this.$swal({
                text: '你確定要刪除此評論嗎?',
                confirmButtonText: '刪除'
            }).then((res) => {
                if (res.value) {
                    // 此時不用傳入 comment
                    this.$store.dispatch('comment', {
                        commentId,
                        articleId: this.articleId
                    }).then(this.renderComments)

                    this.cancelEditComment()
                }
            })
        },
        // 重新取值(帶用戶信息的文章的某項屬性)
        recompute(key) {
            const articleId = this.$route.params.articleId
            // 這裏的文章是基於 getters.computedArticles 的，所以包含用戶信息了
            const article = this.$store.getters.getArticleById(articleId)
            let arr

            if (article) {
                arr = article[key]
            }

            return arr || []
        },

    },
    components: {
        ValidationProvider,ValidationObserver
    }
}
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active { transition: opacity .5s;}
    .fade-enter, .fade-leave-to { opacity: 0;}
</style>