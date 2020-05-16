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

        <b-breadcrumb class="bg-white">
            <b-breadcrumb-item to="/">
            <b-icon icon="house-fill" variant="success" 
            scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
             Home
            </b-breadcrumb-item>
            <b-breadcrumb-item active>文章內容</b-breadcrumb-item>
        </b-breadcrumb>

        <ValidationObserver ref="observer" v-slot="{ invalid }">
            <b-card-group class="border shadow p-1 mb-5">
                    <b-card class="border-0 overflow-auto">
                        <b-card-body>
                            <b-card-title class="text-center">
                                {{ form.title }}
                            </b-card-title>
                            <b-card-sub-title class="py-3 text-center">
                                <abbr><b-icon icon="clock-history"></b-icon> 
                                {{ date | moment('from') }}</abbr>
                            </b-card-sub-title>
                            <b-card-text class="py-3" v-html="form.content"></b-card-text>

                            <b-card-text>
                                <!-- 編輯刪除連結 -->
                                <a @click="editArticle" id="pencil" href="javascript:;">
                                    <b-icon class="h4" icon="pencil"></b-icon>
                                </a>
                                <a @click="deleteArticle" id="trash" href="javascript:;" >
                                    <b-icon class="h4" icon="trash"></b-icon>
                                </a>
                                <b-tooltip target="pencil" placement="topleft" variant="info">編輯</b-tooltip>
                                <b-tooltip target="trash" placement="topright" variant="danger">刪除</b-tooltip>
                            </b-card-text>
                        </b-card-body>

                        <b-card
                            tag="article"
                            class="p-2 my-2 text-center "
                        >
                            <b-card-text>
                                <b-button-group>
                                    <b-button @click="like" href="javascript:;" :class="likeClass" 
                                    :variant="likeClass ? 'secondary' : 'info'">
                                        <i class="fa fa-thumbs-up"></i> {{ likeClass ? '已讚' : '點讚' }}
                                    </b-button>
                                    <div class="or"></div>
                                    <button @click="showQrcode" class="btn btn-success">
                                        <i class="fa fa-heart"></i> 打賞</button>
                                </b-button-group>

                            </b-card-text>
                            
                            <b-card-text class="mt-4 mb-0">
                                <div>
                                    <span v-for="likeUser in likeUsers" :key="likeUser.uname">
                                        <!-- animated 是固定的，swing 是動畫名稱 -->
                                        <router-link :to="`/${likeUser.uname}`"  :class="{ 'animated swing' : likeUser.uid === uid }">
                                            <b-avatar variant="light" :src="likeUser.uavatar" alt="avatar" 
                                            ></b-avatar>
                                        </router-link>
                                    </span>
                                </div>
                            </b-card-text>

                            <b-card-text>
                                <div v-if="!likeUsers.length" class="mt-3">成爲第一個點讚的人吧 !</div>
                            </b-card-text>

                        </b-card>

                        <!-- 打賞彈窗 -->
                        <b-modal ref="qrcode-modal" hide-footer>
                            <template v-slot:modal-title>
                                <b-avatar variant="success" :src="user.avatar" alt="avatar"></b-avatar>
                            </template>
                            <div class="d-block text-center">
                                <h5 class="mb-4">掃一掃，連結到網頁打賞</h5>
                                <p>
                                    <qrcode-vue name="dd" value="https://github.com/freecelestial/" 
                                    :size="160"></qrcode-vue>
                                </p>
                            </div>
                        </b-modal>

                        <!-- 評論 歷史列表區 -->
                        <b-card no-body>
                            <template v-slot:header>
                                <h5 class="mb-0">評論數量: <b>{{ comments.length }}</b></h5>
                            </template>
                            <b-list-group id="reply-list" tag="ul" flush>
                                <b-list-group-item v-for="(comment, index) in comments" :key="comment.commentId">
                                    <b-media tag="li">
                                        <template v-slot:aside>
                                            <router-link :to="`/${comment.uname}`">
                                                <b-avatar variant="light" :src="comment.uavatar" class="align-middle"></b-avatar>
                                            </router-link>
                                        </template>
                                        <h5 v-html="`#${index+1} <cite>${comment.uname}</cite>`" class="text-secondary"></h5>
                                        <h5 v-html="comment.content" class="my-1"></h5>

                                        <!-- 評論 編輯刪除連結 -->
                                        <span v-if="comment.uid === uid" class="pull-right">
                                            <a @click="editComment(comment.commentId, index)" :id="`pencil2${index}`" href="javascript:;">
                                                <b-icon icon="pencil"></b-icon>
                                            </a>
                                            <a @click="deleteComment(comment.commentId)" :id="`trash2${index}`" href="javascript:;" >
                                                <b-icon icon="trash"></b-icon>
                                            </a>
                                            <b-tooltip :target="`pencil2${index}`" placement="topleft" variant="info">編輯</b-tooltip>
                                            <b-tooltip :target="`trash2${index}`" placement="topright" variant="danger">刪除</b-tooltip>
                                        </span>

                                        <p class="mb-0">
                                            <abbr class="text-secondary">{{ comment.date | moment('from', { startOf: 'second' }) }}</abbr>
                                        </p>

                                    </b-media>
                                </b-list-group-item>
                            </b-list-group>
                        </b-card>

                        <!-- 評論 編輯區 -->
                        <b-card-body>
                            <b-form>
                                <ValidationProvider name="評論" 
                                        rules="required|max:300" v-slot="{ valid,errors }">
                                    <b-form-group 
                                        label="評論: " 
                                    >
                                        <b-form-textarea
                                            v-if="auth" 
                                            id="editor" 
                                            placeholder="" 
                                        ></b-form-textarea>

                                        <b-form-textarea
                                            v-else 
                                            disabled
                                            placeholder="登入後才可評論" 
                                        ></b-form-textarea>
                                        <b-form-invalid-feedback id="inputLiveFeedback">
                                            {{ errors[0] }}</b-form-invalid-feedback>

                                    </b-form-group>

                                    <!-- commentHtml，這裡使用 v-html 指令同步输出 -->
                                    <label v-show="commentHtml" >預覽: </label>
                                    <b-card v-show="commentHtml" class="bg-light">
                                        <div v-html="commentHtml"></div>
                                    </b-card>


                                    <b-button id="reply-btn" class="mt-4 text-center" :disabled="invalid" 
                                    variant="primary" @click="comment">
                                        <b-icon icon="upload"></b-icon> 
                                        {{ commentId ? '修改評論' : '送出評論' }}
                                    </b-button> 

                                    <b-button v-show="commentId" class="mt-4 text-center" type="button" 
                                    variant="outline-secondary"  @click="cancelEditComment">
                                        <b-icon icon="x"></b-icon> 取消编辑
                                    </b-button>
                                    <span v-show="!commentId" class="help-inline">Ctrl+Enter</span>

                                </ValidationProvider>
                            </b-form>
                        </b-card-body>

                    </b-card>
            </b-card-group>
            
        </ValidationObserver>
    </b-col>
</template>

<script>
import SimpleMDE from 'simplemde'
import hljs from 'highlight.js'
import emoji from 'node-emoji'
import { mapState } from 'vuex'

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

// 引入 qrcode.vue 的默認值
import QrcodeVue from 'qrcode.vue'

export default {
    name: 'Content',
    data() {
        return {
            form:{
                title: '',
                content: ''
            },
            articleId: undefined,
            alertShow: null,
            alertMsg:'',
            alertType:'',
            dismissSecs: 5,
            dismissCountDown: 0,
            date: '', // 文章創建時間
            uid: 1, // 用戶 ID
            likeUsers: [], // 點讚用戶列表
            likeClass: '', // 點讚樣式
            commentHtml: '', // 評論 HTML
            comments: [], // 評論列表
            commentId: undefined, // 評論 ID
            commentMarkdown: ''
        }
    },
    computed: {
        ...mapState([
            'auth',
            'user'
        ])
    },
    created() {
        // 從當前路由參數獲取 articleId，並取出文章
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
            this.likeClass = this.likeUsers.some(likeUser => likeUser.uid === this.uid) ? 'active' : ''

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
        // 若已登錄，載入編輯器
        if (this.auth) {
            // 自動高亮編輯器的內容
            window.hljs = hljs

            const simplemde = new SimpleMDE({
                element: document.querySelector('#editor'),
                placeholder: '請使用 Markdown 語法書寫',
                spellChecker: false,
                autoDownloadFontAwesome: false,
                // 顯示工具欄 (不能用 true)
                // toolbar: false,
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

            // 監聽按鈕，當使用 Ctrl+Enter 時提交評論
            simplemde.codemirror.on('keyup', (codemirror, event) => {
                if (event.ctrlKey && event.which === 13) {
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
            // 導向編輯頁面
            this.$router.push({ name: 'Edit', params: { articleId: this.articleId } })
        },
        deleteArticle() {
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
            evt.preventDefault()
            if (!this.auth) {
                this.showAlert('登入後才能執行此操作','warning')

            } else {
                const target = evt.currentTarget
                // 判斷是否已 like
                const active = target.classList.contains('active')
                const articleId = this.articleId

                if (active) {
                    // 取消點讚
                    // 清除原 like 樣式
                    this.likeClass = ''
                    // 分發 like 事件取消讚，更新實例的 likeUsers 爲返回的值
                    // 調用 store.dispatch 默認返回一個 Promise 對象，
                    // 表示一個異步操作的最終狀態及其返回的值
                    // 此處返回的是 likeUsers
                    this.$store.dispatch('like', { articleId }).then((likeUsers) => {
                        // 使用帶用戶信息的點贊用戶
                        // this.likeUsers = likeUsers
                        // 重新取值
                        this.likeUsers = this.recompute('likeUsers')
                    })
                } else {
                    // 添加已讚樣式
                    this.likeClass = 'active animated rubberBand'
                    // 分發 like 事件，傳入 isAdd:true 表示加讚
                    this.$store.dispatch('like', { articleId, isAdd: true }).then((likeUsers) => {
                        // this.likeUsers = likeUsers
                        // 重新取值
                        this.likeUsers = this.recompute('likeUsers')
                    })
                }
            }
        },
        comment() {
            // 編輯器的內容不爲空時
            if (this.commentMarkdown && this.commentMarkdown.trim() !== '') {
                // 分發 comment 事件以提交評論
                this.$store.dispatch('comment', 
                    {articleId: this.articleId,
                    comment: { content: this.commentMarkdown },
                    // 若有 commentId 代表是編輯
                    commentId: this.commentId
                }).then(this.renderComments)
                // 在 .then 的回調裏，用 this.renderComments 渲染評論

                // 有 commentId 時，取消編輯評論
                if (this.commentId) {
                    this.cancelEditComment()
                } else {
                    // 清空編輯器
                    this.simplemde.value('')
                    // 使回覆按鈕獲得焦點
                    document.querySelector('#reply-btn').focus()
                    // 調整捲軸到最後評論位置
                    this.$nextTick(() => {
                        const lastComment = document.querySelector('#reply-list .list-group-item:last-child')
                        if (lastComment) lastComment.scrollIntoView(true)
                        // 因標頭固定，微調20 px
                        window.scrollBy(0,-20)
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
                    // 取評論內容放入編輯器
                    simplemde.value(comment.content)
                    // 遊標移到編輯器
                    codemirror.focus()
                    // 將遊標移到內容的後面
                    codemirror.setCursor(codemirror.lineCount(), 0)
                    // 評論索引 + 1，用來指示取消編輯時，頁面滾動的位置
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

            // 等 DOM 更新後，將評論滾動回視圖的頂部
            this.$nextTick(() => {
                if (this.commentIndex === undefined) return
                // nth-child 從 1 開始
                const currentComment = document.querySelector(`#reply-list .list-group-item:nth-child(${this.commentIndex})`)

                if (currentComment) {
                    currentComment.scrollIntoView(true)
                    window.scrollBy(0,-60)
                    // currentComment.querySelector('.operate a').focus()
                }
            })
        },
        // 刪除評論
        deleteComment(commentId) {
            this.$bvModal.msgBoxConfirm('是否確認要刪除此評論?', {
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
                    this.$store.dispatch('comment', {
                        commentId,
                        articleId: this.articleId
                    }).then(this.renderComments)

                    this.cancelEditComment()
                }

            })
            .catch(err => {
               alert('登出發生異常錯誤!')
               
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
        showQrcode(){
            this.$refs['qrcode-modal'].show()
        }
    },
    components: {
        ValidationProvider,ValidationObserver,QrcodeVue
    }
}
</script>

<style lang="scss" >
    .CodeMirror,.CodeMirror-scroll {
        min-height: 100px;
    }
    .fade-enter-active, .fade-leave-active { transition: opacity .5s;}
    .fade-enter, .fade-leave-to { opacity: 0;}
    .or {
        position: relative;
        float: left;
        width: .9em;
        height: 2.57142em;
        z-index: 3;
    }
    .or:before {
        position: absolute;
        text-align: center;
        border-radius: 500rem;
        content: "or";
        top: 50%;
        left: 50%;
        background-color: #fff;
        text-shadow: none;
        margin-top: -.922855em;
        margin-left: -.802855em;
        width: 1.78571em;
        height: 1.78571em;
        line-height: 1.78571em;
        color: rgba(0,0,0,.4);
        font-style: normal;
        font-weight: 700;
        -webkit-box-shadow: 0 0 0 1px transparent inset;
        box-shadow: inset 0 0 0 1px transparent;
    }
    .help-inline {
        margin-left: 10px;
        vertical-align: bottom;
    }

</style>