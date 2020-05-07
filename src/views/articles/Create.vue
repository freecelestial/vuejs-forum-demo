<template>
    <div class="blog-container">
        <div class="blog-pages">
        <div class="col-md-12 panel">
            <div class="panel-body">
            <h2 class="text-center">{{ articleId ? '编辑文章' : '创作文章' }}</h2>
            <hr>
            <div data-validator-form>
                <div class="form-group">
                    <input v-model.trim="title" v-validator:blur.required="{ title: '标题' }" type="text" class="form-control" placeholder="请填写标题" @input="saveTitle"> 
                </div>
                <div class="form-group">
                    <textarea id="editor"></textarea>
                </div>
                <br>
                <div class="form-group">
                    <button class="btn btn-primary" type="submit" @click="post">发 布</button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import SimpleMDE from 'simplemde'
import hljs from 'highlight.js'
import ls from '@/utils/localStorage'

// 添加全局变量
window.hljs = hljs

export default {
    name: 'Create',
    data() {
        return {
            title: '',
            content: '',
            // 临时用它来判断是否还处于当前编辑页面
            articleId: undefined
        }
    },
    // 進入路由前，设置 articleId
    // 此時只能用 vm 不能用 this
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.setArticleId(vm.$route.params.articleId)
        })
    },
    // 在离开路由前，清除記錄資料
    // 此時已可用 this
    beforeRouteLeave(to, from, next) {
        this.clearData()
        next()
    },
    watch: {
        // 监听路由参数的变化
        // 我们通常会在两个路由都渲染相同的组件时监听 '$route'
        // 这是因为 Vue 会复用组件实例，以导致组件内的部分钩子不再被调用
        // 例如：当我们从『编辑文章』导航到『创作文章』时 beforeRouteEnter 就不会被调用
        '$route'(to) {
            this.clearData()
            this.setArticleId(to.params.articleId)
        }
    },
    mounted() {
        const simplemde = new SimpleMDE({
            element: document.querySelector('#editor'),
            placeholder: '请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。',
            spellChecker: false,
            autoDownloadFontAwesome: false,
            autosave: {
                enabled: true,
                uniqueId: 'vuejs-essential'
            },
            renderingConfig: {
                // 启用代码高亮，需要引入 highlight.js
                codeSyntaxHighlighting: true
            }
        })
        // 监听编辑器的 change 事件
        simplemde.codemirror.on('change', () => {
            // 将改变后的值赋给文章内容
            this.content = simplemde.value()
        })
        // 将 simplemde 添加到当前实例，以在其他地方调用
        this.simplemde = simplemde
        // 初始化标题和内容
        this.fillContent()
    },
    methods: {
        // 编辑器只会自动保存文章的内容，我们需要自己保存文章的标题
        saveTitle() {
            ls.setItem('smde_title', this.title)
        },
        fillContent(articleId) {
            const simplemde = this.simplemde
            const smde_title = ls.getItem('smde_title')

            // 有 articleId 时
            if (articleId !== undefined) {
                // 获取对应文章
                const article = this.$store.getters.getArticleById(articleId)

                if (article) {
                    // 获取文章的标题和内容
                    const { title, content } = article

                    // 有自动保存的标题时，使用自动保存的标题，否则使用文章的标题
                    this.title = smde_title || title

                    // 有自动保存的内容时，使用自动保存的内容，否则使用文章的内容
                    this.content = simplemde.value() || content

                    // 设置编辑器的内容
                    simplemde.value(this.content)
                }
            } else { 
                // 没有 articleId 时，使用自动保存的标题和内容
                this.title = smde_title
                this.content = simplemde.value()
            }

        },
        post() {
            const title = this.title
            const content = this.content

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
            this.title = ''
            ls.removeItem('smde_title')
            this.simplemde.value('')
            this.simplemde.clearAutosavedValue()
        },
        setArticleId(articleId) {
            // 获取 localStorage 保存的 articleId，临时用它来判断是否还处于当前编辑页面
            const localArticleId = ls.getItem('articleId')
            // 手动在两个不同的编辑页面之间跳转时（如 /articles/1/edit 和 /articles/2/edit）时
            // 清空自动保存的文章数据
            if (articleId !== undefined && !(articleId === localArticleId)) {
                this.clearData()
            }

            this.articleId = articleId
            this.fillContent(articleId)
            ls.setItem('articleId', articleId)
        }
    }
}

</script>

<style scoped>
    .blog-container { max-width: 980px; margin: 0 auto; margin-top: 20px;}
    textarea { height: 200px; }
</style>